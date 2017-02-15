---
layout: topic
module: Java
title:  Join
date:   2017-02-15
---

Join，等待目标线程执行完毕

`join()`是基于`wait()`实现的:

#### join()

只要目标线程存活，就一直`wait(0)`，当目标线程终止时，会触发notifyAll()，当前线程从`wait(0)`返回

#### join(long millis)

使用超时`wait(delay)`，超时会`break`，或者当目标线程终止时，会触发notifyAll()，当前线程从`wait(delay)`返回

```java
public final void join() throws InterruptedException {
    join(0);
}

/**
 * 同步方法
 */
public final synchronized void join(long millis) throws InterruptedException {
    long base = System.currentTimeMillis();
    long now = 0;

    if (millis == 0) {
        // join的逻辑
        while (isAlive()) {
            wait(0);
        }
    } else {
        // 超时join的逻辑
        while (isAlive()) {
            long delay = millis - now;
            if (delay <= 0) {
                // 超时退出
                break;
            }
            wait(delay);
            now = System.currentTimeMillis() - base;
        }
    }
}
```
