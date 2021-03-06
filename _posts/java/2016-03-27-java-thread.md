---
layout:     article
categories: [java]
title:      Java多线程
tags:       [java, 多线程, 并发]
date:       2016-03-27
---

#### Runnable

`java.lang.Runnable`是多线程的接口, 任何线程都会直接或间接实现`Runnable`接口, 并实现接口的run()方法.

```java
public interface Runnable {

    public abstract void run();

}
```

#### Thread

`java.lang.Thread`

#### 线程优先级

Java线程可以设置优先级，优先级范围为`1 ~ 10`，默认优先级为5，优先级高的线程会被分配更多的CPU时间片。针对IO密集型线程，设置较高优先级，针对CPU密集型线程，设置较低优先级，防止CPU被独占。

```java
public class Thread {

    // 最低优先级
    public final static int MIN_PRIORITY = 1;
    // 最高优先级
    public final static int MAX_PRIORITY = 10;

    // 线程优先级
    private int priority;

    public Thread() {
        Thread parent = currentThread();
        // 默认继承父线程优先级
        this.priority = parent.getPriority();
        setPriority(priority);
    }

    public final void setPriority(int newPriority) {
        ThreadGroup g;
        // 优先级大小校验
        if (newPriority > MAX_PRIORITY || newPriority < MIN_PRIORITY) {
            throw new IllegalArgumentException();
        }
        if ((g = getThreadGroup()) != null) {
            // 线程优先级不超过线程组最大优先级
            if (newPriority > g.getMaxPriority()) {
                newPriority = g.getMaxPriority();
            }
            setPriority0(priority = newPriority);
        }
    }

    // native方法改变线程优先级
    private native void setPriority0(int newPriority);

}
```

#### 线程状态

Java线程有下面几种状态，参见`java.lang.Thread.State`。

* `NEW`，`初始状态`，此时线程已经被创建，但还没调用`start()`启动。
* `RUNNABLE`，`运行状态`，包括`运行`(`RUNNING`)和`就绪`(`READY`)两种状态。
* `BLOCKED`，`阻塞状态`，线程被阻塞，等待获取监视器锁。有两种场景，一种场景是进入synchronized方法/代码块，另一种场景是synchronized方法/代码块中从wait()返回后。

```java
synchronized(this) {
    wait();
}
```

* `WAITING`，`等待状态`，线程进入等待状态，对应的方法有：
    * Object.wait()
    * Thread.join()
    * LockSupport.park()

处于等待状态的线程，等待其它线程对它进行唤醒操作。

* `TIMED_WAITING`，`超时等待状态`，线程等待指定的时间，对应的方法有：
    * Object.wait(timeout)
    * Thread.join(timeout)
    * Thread.sleep(timeout)
    * LockSupport.parkNanos(timeout)
    * LockSupport.parkUntil(timeout)
* `TERMINATED`，`终止状态`，线程结束执行。

#### start()和run()

`start()`，Java线程启动的方法，使当前线程开始执行，之后由Java虚拟机调用线程的run()方法。

`run()`，Java线程实现的方法。

```java
@Override
public void run() {
    if (target != null) {
        target.run();
    }
}
```

#### sleep() join() yield()

`sleep(long mills)`，当前线程休眠(`暂停执行`)mills毫秒，休眠期间不会释放对象锁，mills毫秒后线程进入可运行状态。

`join()`，当前线程等待目标线程终止后才继续执行，否则一直等待。`join()`是基于`wait()`实现的，下面是`join()`实际执行的代码，只要目标线程存活，就一直`wait(0)`，当目标线程终止时，会触发`notifyAll()`，当前线程就可以从`wait(0)`返回。

```java
while (isAlive()) {
    wait(0);
}
```

`join(long mills)`，当前线程等待目标线程终止后才继续执行，否则等待，最多等待mills毫秒。下面是`join(long mills)`实际执行的代码。

```java
long now = 0;
long base = System.currentTimeMillis();
while (isAlive()) {
    long delay = millis - now;
    if (delay <= 0) {
        break;
    }
    wait(delay);
    now = System.currentTimeMillis() - base;
}
```

`yield()`，当前线程放弃CPU的使用权。一般情况下，`yield()`会导致线程从运行状态切换到可运行状态，但线程调度器也可能会忽略`yield()`，导致实际没有效果。

#### wait() notify() notifyAll()

#### 线程中断
