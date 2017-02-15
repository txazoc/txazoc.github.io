---
layout: topic
module: 多线程
title:  线程中断
date:   2016-10-27
---

`Thread`提供的中断方法:

| 方法 | 含义 |
| --- | --- |
| interrupt() | 中断线程 |
| interrupted() | 检测是否中断并清除中断 |
| isInterrupted() | 检测是否中断 |

```java
public class Thread {

    public void interrupt() {
        if (this != Thread.currentThread())
            checkAccess();

        synchronized (blockerLock) {
            Interruptible b = blocker;
            if (b != null) {
                interrupt0();
                b.interrupt(this);
                return;
            }
        }
        interrupt0();
    }

    public static boolean interrupted() {
        return currentThread().isInterrupted(true);
    }

    public boolean isInterrupted() {
        return isInterrupted(false);
    }

    private native void interrupt0();

    /**
     * clearInterrupted     是否清除中断状态
     */
    private native boolean isInterrupted(boolean clearInterrupted);

}
```

```c
void os::interrupt(Thread *thread) {
    OSThread *osthread = thread->osthread();

    if (!osthread->interrupted()) {
        // 设置中断状态
        osthread->set_interrupted(true);
        OrderAccess::fence();
        ParkEvent *const slp = thread->_SleepEvent;
        // 唤醒线程的sleep状态
        if (slp != NULL) slp->unpark();
    }

    if (thread->is_Java_thread())
        ((JavaThread *) thread)->parker()->unpark();

    // 唤醒线程的wait状态
    ParkEvent *ev = thread->_ParkEvent;
    if (ev != NULL) ev->unpark();
}

bool os::is_interrupted(Thread *thread, bool clear_interrupted) {
    OSThread *osthread = thread->osthread();

    bool interrupted = osthread->interrupted();

    if (interrupted && clear_interrupted) {
        // 清除中断状态
        osthread->set_interrupted(false);
    }

    return interrupted;
}
```

`OSThread`是JVM中和Java线程对应的线程，变量`_interrupted`代表中断状态

```c
class OSThread : public CHeapObj<mtThread> {

    private:
        volatile jint _interrupted;

    volatile bool interrupted() const { return _interrupted != 0; }
    
    void set_interrupted(bool z) { _interrupted = z ? 1 : 0; }

};
```


Java中可以被中断的方法分为三类:

* sleep: Thread.sleep()
* wait: Object.wait()、Thread.join()
* lock: ReentrantLock.lockInterruptibly()

#### 如何中断一个线程?

***1. volatile变量***

```java
public class Interrupt implements Runnable {

    private volatile boolean avaliable = true;

    @Override
    public void run() {
        while (avaliable) {
        }
    }

    public void cancel() {
        avaliable = false;
    }

}
```

***2. 中断标识检测***

```java
public class Interrupt implements Runnable {

    @Override
    public void run() {
        while (!Thread.interrupted()) {
        }
//      while (!Thread.currentThread().isInterrupted()) {
//      }
    }

}
```

***3. 中断异常捕获***

适用于Object.wait、Thread.join、Thread.sleep等抛出InterruptedException的操作

```java
public class Interrupt implements Runnable {

    @Override
    public void run() {
        try {
            while (true) {
                Thread.sleep(1000);
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

}
```

***4. 综合上述中断方式***

```java
public class Interrupt implements Runnable {

    private volatile boolean avaliable = true;

    @Override
    public void run() {
        try {
            while (true) {
                if (!avaliable || Thread.currentThread().isInterrupted()) {
                    /** 检测到中断, 向外抛出InterruptedException */
                    throw new InterruptedException();
                }
                task();
            }
        } catch (InterruptedException e) {
            /** 重新设置中断标识 */
            Thread.currentThread().interrupt();
        }
    }

    public void task() throws InterruptedException {
        try {
            while (true) {
                if (!avaliable || Thread.currentThread().isInterrupted()) {
                    /** 检测到中断, 向外抛出InterruptedException */
                    throw new InterruptedException();
                }
                Thread.sleep(1000);
            }
        } catch (InterruptedException e) {
            /** 重新设置中断标识 */
            Thread.currentThread().interrupt();
            throw e;
        }
    }

    public void cancel() {
        avaliable = false;
    }

}
```
