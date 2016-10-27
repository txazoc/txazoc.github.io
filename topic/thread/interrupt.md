---
layout: topic
module: 多线程
title:  中断
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
        if (slp != NULL) slp->unpark();
    }

    if (thread->is_Java_thread())
        ((JavaThread *) thread)->parker()->unpark();

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
