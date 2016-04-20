---
layout:     article
categories: [java]
title:      Java多线程
tags:       [java, 多线程]
date:       2016-04-20 22:00:00
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

#### start()和run()

#### sleep() join() yield()

#### wait() notify() notifyAll()

#### 线程中断

#### ThreadLocal解决线程安全
