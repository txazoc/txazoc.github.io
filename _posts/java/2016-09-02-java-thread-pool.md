---
layout:     article
published:  false
categories: [java]
title:      Java线程池源码分析
tags:       [java, 线程池]
date:       2016-09-02
---

```java
public class Executors {

    // 固定大小的线程池
    public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>());
    }

    // 单个线程的线程池
    public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService(new ThreadPoolExecutor(1, 1, 0L, TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>()));
    }

    // 可缓存的线程池
    public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE, 60L, TimeUnit.SECONDS, new SynchronousQueue<Runnable>());
    }

    // 可调度的线程池
    public static ScheduledExecutorService newScheduledThreadPool(int corePoolSize) {
        return new ScheduledThreadPoolExecutor(corePoolSize);
    }

}
```

```java
public class ThreadPoolExecutor extends AbstractExecutorService {

    // 核心线程池大小
    private volatile int corePoolSize;
    // 最大线程池大小
    private volatile int maximumPoolSize;
    // 存活时间
    private volatile long keepAliveTime;
    // 工作队列
    private final BlockingQueue<Runnable> workQueue;
    // 线程工厂
    private volatile ThreadFactory threadFactory;
    // 拒绝执行处理
    private volatile RejectedExecutionHandler handler;
    // 工作线程
    private final HashSet<Worker> workers = new HashSet<Worker>();
    private final AtomicInteger ctl = new AtomicInteger(ctlOf(RUNNING, 0));

    public ThreadPoolExecutor(int corePoolSize,
                              int maximumPoolSize,
                              long keepAliveTime,
                              TimeUnit unit,
                              BlockingQueue<Runnable> workQueue,
                              ThreadFactory threadFactory,
                              RejectedExecutionHandler handler) {
        if (corePoolSize < 0 ||
                maximumPoolSize <= 0 ||
                maximumPoolSize < corePoolSize ||
                keepAliveTime < 0) {
            throw new IllegalArgumentException();
        }
        if (workQueue == null || threadFactory == null || handler == null) {
            throw new NullPointerException();
        }
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.workQueue = workQueue;
        this.keepAliveTime = unit.toNanos(keepAliveTime);
        this.threadFactory = threadFactory;
        this.handler = handler;
    }

}
```

* corePoolSize: 核心线程池大小
* maximumPoolSize: 最大线程池大小
* keepAliveTime: 存活时间
* workQueue: 工作队列
* threadFactory: 线程工厂
* handler: 拒绝执行处理
* workers: 工作线程

#### ctl

`ctl`用来控制线程池的状态, 包含两个内容:

* workerCount: 工作线程的数量
* runState: 运行状态

* RUNNING
* SHUTDOWN
* STOP
* TIDYING
* TERMINATED
