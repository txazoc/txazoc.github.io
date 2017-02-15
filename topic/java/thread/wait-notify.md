---
layout: topic
module: Java
title:  Wait/Notify
date:   2017-02-15
---

* Object.wait(): 线程在目标对象上进入等待状态
* Object.notify(): 唤醒目标对象上的一个等待线程
* Object.notifyAll(): 唤醒目标对象上的所有等待线程

***调用wait()、notify()、notifyAll()时, 必须保证已经获取到被调用对象的锁, 否则抛IllegalMonitorStateException***

#### 生产者/消费者模式

```java
/**
 * 生产者/消费者模式
 */
private static class Product {

    private static final int MAX = 5;

    private Stack<String> container = new Stack<String>();

    /**
     * 生产
     */
    public synchronized void put(String p) {
        while (container.size() >= MAX) {
            try {
                /** wait时释放锁 */
                wait();
                /** 被notify/notifyAll唤醒后, 重新竞争锁 */
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        container.push(p);
        /** notify/notifyAll时不释放锁 */
        notify();
    }

    /**
     * 消费
     */
    public synchronized String get() {
        while (container.isEmpty()) {
            try {
                /** wait时释放锁 */
                wait();
                /** 被notify/notifyAll唤醒后, 重新竞争锁 */
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        /** notify/notifyAll时不释放锁 */
        notify();
        return container.pop();
    }

}
```
