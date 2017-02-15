---
layout: topic
module: Java
title:  Thread
date:   2017-02-15
---

#### Thread

#### Runnable

#### 线程优先级

#### Daemon线程

#### 线程状态

* `NEW`: 初始状态
* `RUNNABLE`: 运行状态
* `BLOCKED`: 阻塞状态
    * synchronized
* `WAITING`: 等待状态
    * Object.wait()
    * Thread.join()
    * LockSupport.park()
* `TIMED_WAITING`: 超时等待状态
    * Object.wait(timeout)
    * Thread.join(timeout)
    * Thread.sleep(timeout)
    * LockSupport.parkNanos(timeout)
    * LockSupport.parkUntil(timeout)
* `TERMINATED`: 终止状态

`jstack`查看:

```console
1. RUNNING
runnable
java.lang.Thread.State: RUNNABLE

2. READY
waiting on condition
java.lang.Thread.State: RUNNABLE

3. synchronized
waiting for monitor entry
java.lang.Thread.State: BLOCKED (on object monitor)

4. Object.wait() or Thread.join()
in Object.wait()
java.lang.Thread.State: WAITING (on object monitor)

5. LockSupport.park()
waiting on condition
java.lang.Thread.State: WAITING (parking)

6. Thread.sleep(timeout)
waiting on condition
java.lang.Thread.State: TIMED_WAITING (sleeping)

7. Object.wait(timeout) or Thread.join(timeout)
in Object.wait()
java.lang.Thread.State: TIMED_WAITING (on object monitor)

8. LockSupport.parkNanos(timeout) or LockSupport.parkUntil(timeout)
waiting on condition
java.lang.Thread.State: TIMED_WAITING (parking)
```
