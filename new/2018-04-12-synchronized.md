---
layout: new
title:  synchronized
---

#### synchronized的三种用法

* synchronized同步实例方法

```java
public synchronized void synchronizedMethod() {
}
```

* synchronized同步静态方法

```java
public static synchronized void synchronizedStaticMethod() {
}
```

* synchronized同步代码块

```java
synchronized (lock) {
}
```

#### synchronized锁类型

* 偏向锁
* 轻量级锁
* 重量级锁

#### 对象头

* 无锁: 偏向锁标识0 + 锁标识`01`
* 偏向锁: 线程ID + Epoch + 偏向锁标识1 + 锁标识`01`
* 轻量级锁: 指向锁记录的指针 + 锁标识`00`
* 重量级锁: 指向重量级锁的指针 + 锁标识`10`

#### 自旋锁

线程在获取锁的时候，先进行自旋尝试，不成功再阻塞

#### 偏向锁

偏向锁，无锁竞争的情况下，持有锁的线程的重入操作，不需要同步操作

* compare或CAS

#### 轻量级锁

竞争的线程使用自旋来获取锁，不会阻塞，自旋失败，升级为重量级锁

* 自旋CAS

#### 重量级锁

线程进入阻塞状态

* 阻塞

#### 参考

* [https://www.cnblogs.com/charlesblc/p/5994162.html](https://www.cnblogs.com/charlesblc/p/5994162.html)
* [http://www.importnew.com/23511.html](http://www.importnew.com/23511.html)
* [https://www.cnblogs.com/mingyao123/p/7424911.html](https://www.cnblogs.com/mingyao123/p/7424911.html)
