---
layout:     article
categories: [java]
title:      Java并发 - 锁
tags:       [java, 并发, 锁]
date:       2016-08-11
---

#### 1. synchronized

Java中`synchronized`有两种: synchronized方法、synchronized代码块，通过一个同步的监视器`monitor`来实现锁功能。

针对`synchronized方法`，在运行时常量池的`method_info`结构中有`ACC_SYNCHRONIZED`标记。在调用带`ACC_SYNCHRONIZED`标记的方法时，执行线程会进入监视器，然后执行方法，最后在方法调用返回或中断退出监视器。

```java
public synchronized void sync() {
}
```

```javap
public synchronized void sync();
  descriptor: ()V
  flags: ACC_PUBLIC, ACC_SYNCHRONIZED
```

`synchronized代码块`则是由`monitorenter`、`monitorexit`指令实现的。

```java
public void syncBlock() {
    synchronized (this) {
    }
}
```

```javap
Code:
  stack=2, locals=3, args_size=1
     0: aload_0
     1: dup
     2: astore_1
     3: monitorenter
     4: aload_1
     5: monitorexit
     6: goto          14
     9: astore_2
    10: aload_1
    11: monitorexit
    12: aload_2
    13: athrow
    14: return
  Exception table:
     from    to  target type
         4     6     9   any
         9    12     9   any
```

#### 2. Lock

#### 3. 锁的替代
