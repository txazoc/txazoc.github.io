---
layout: topic
module: Java
title:  线程池
date:   2016-12-10
---

#### ***目录***

* ThreadPoolExecutor
    * volatile int corePoolSize: 核心线程数
    * volatile int maximumPoolSize: 最大线程数
    * BlockingQueue<Runnable> workQueue: 任务队列
        * DelayedWorkQueue: 调度线程池
        * SynchronousQueue: 可缓存线程池
        * LinkedBlockingQueue
    * volatile long keepAliveTime: 空闲线程的最大存活时间，当`allowCoreThreadTimeOut`为true或工作线程数大于`corePoolSize`时有效
    * RejectedExecutionHandler handler: 拒绝策略，线程池饱和或关闭时如何处理，默认提供4种
        * CallerRunsPolicy: 调用线程执行任务
            * r.run()
        * AbortPolicy: 抛出异常
            * throw new RejectedExecutionException()
        * DiscardPolicy: 直接丢弃任务，什么都不做
        * DiscardOldestPolicy: 从workQueue中丢弃最旧的未处理任务并重试
            * workQueue.poll()
            * ThreadPoolExecutor.execute(r)
    * HashSet<Worker> workers: 工作线程
    * AtomicInteger ctl
        * workerCount: 工作线程数
        * runState: 运行状态，用来控制线程池的生命周期
            * RUNNING: 执行状态，接收新的任务，处理队列中的任务
            * SHUTDOWN: 关闭状态，不接收新的任务，处理队列中的任务
            * STOP: 停止状态，不接收新的任务，不处理队列中的任务，中断正在处理的任务
            * TIDYING: 所有任务都终止并且workerCount为0，线程池过度到该状态，并执行terminated()方法
            * TERMINATED: 终止状态，terminated()方法执行结束后切换到该状态

Java中线程池的实现类是`ThreadPoolExecutor`，先来看下构造函数:

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
}
```

* `corePoolSize`: 核心池大小
* `maximumPoolSize`: 最大池大小
* `keepAliveTime`: 空闲线程的最大存活时间，当`allowCoreThreadTimeOut`为`true`或工作线程数大于`corePoolSize`时有效
* `unit`: `keepAliveTime`的时间单位
* `workQueue`: 任务队列
* `threadFactory`: 线程工厂，用来创建线程
* `handler`: 拒绝策略，线程池饱和或关闭时如何处理

#### <a id="execute">执行任务</a>

```java
public void execute(Runnable command) {
    if (command == null)
        throw new NullPointerException();

    int c = ctl.get();
    if (workerCountOf(c) < corePoolSize) {
        if (addWorker(command, true))
            return;
        c = ctl.get();
    }
    if (isRunning(c) && workQueue.offer(command)) {
        int recheck = ctl.get();
        if (!isRunning(recheck) && remove(command))
            reject(command);
        else if (workerCountOf(recheck) == 0)
            addWorker(null, false);
    } else if (!addWorker(command, false))
        reject(command);
}
```

先来解释下`ctl`是什么鬼?

`ctl`是int型的原子变量，包装两个字段:

* `workerCount`: 工作线程数
* `runState`: 运行状态，用来控制线程池的生命周期，包含下面几种状态:
    * RUNNING: 执行状态，接收新的任务，处理队列中的任务
    * SHUTDOWN: 关闭状态，不接收新的任务，处理队列中的任务
    * STOP: 停止状态，不接收新的任务，不处理队列中的任务，中断正在处理的任务
    * TIDYING: 所有任务都终止并且`workerCount`为0，线程池过度到该状态，并执行`terminated()`方法
    * TERMINATED: 终止状态，`terminated()`方法执行结束后切换到该状态

```java
// ctl初始值
private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));
// 29
private static final int COUNT_BITS = Integer.SIZE - 3;
// 000 11111 11111111 11111111 11111111
private static final int CAPACITY = (1 << COUNT_BITS) - 1;

// 111 00000 00000000 00000000 00000000
private static final int RUNNING = -1 << COUNT_BITS;
// 000 00000 00000000 00000000 00000000
private static final int SHUTDOWN = 0 << COUNT_BITS;
// 001 00000 00000000 00000000 00000000
private static final int STOP = 1 << COUNT_BITS;
// 010 00000 00000000 00000000 00000000
private static final int TIDYING = 2 << COUNT_BITS;
// 011 00000 00000000 00000000 00000000
private static final int TERMINATED = 3 << COUNT_BITS;

// 获取runState
private static int runStateOf(int c) {
    return c & ~CAPACITY;
}

// 获取workerCount
private static int workerCountOf(int c) {
    return c & CAPACITY;
}

// runState + workerCount组装ctl
private static int ctlOf(int rs, int wc) {
    return rs | wc;
}
```

可以看出，`ctl`的高3位代表`runState`，低29位代表`workerCount`，所以线程池的最大工作线程数为2^29-1。线程池初始化时，`runState`为`RUNNING`，`workerCount`为0。

继续回到上面的`execute()`方法

Java中线程池可分为四类:

* 单线程线程池: 只创建一个线程执行任务  

```java
public static ExecutorService newSingleThreadExecutor() {
    return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                    0L, TimeUnit.MILLISECONDS,
                    new LinkedBlockingQueue<Runnable>()));
}
```

* 定长线程池:  

```java
public static ExecutorService newFixedThreadPool(int nThreads) {
    return new ThreadPoolExecutor(nThreads, nThreads,
            0L, TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<Runnable>());
}
```

* 可缓存线程池:  

```java
public static ExecutorService newCachedThreadPool() {
    return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
            60L, TimeUnit.SECONDS,
            new SynchronousQueue<Runnable>());
}
```

* 定时调度线程池:  

```java
public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
    return new ScheduledThreadPoolExecutor(corePoolSize);
}
```
