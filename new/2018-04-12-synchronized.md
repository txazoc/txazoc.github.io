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

#### 偏向锁

在无锁竞争的情况下，对象头中存储当前持有锁的线程ID，出现锁竞争后，偏向锁撤销，升级为轻量级锁

* compare

#### 轻量级锁

竞争锁的线程在当前线程的栈帧中创建存储锁记录的空间，将对象头的Mark Word复制到锁记录中，然后尝试CAS替换对象头的Mark Word为指向锁记录的指针，成功则获得锁，失败则使用自旋锁

* CAS

#### 自旋锁

轻量级锁失败，先进行自旋尝试，不成功再升级为重量级锁

* 自旋

#### 重量级锁

线程进入阻塞状态

* 阻塞

#### 参考

* [https://www.cnblogs.com/charlesblc/p/5994162.html](https://www.cnblogs.com/charlesblc/p/5994162.html)
* [http://www.importnew.com/23511.html](http://www.importnew.com/23511.html)
* [https://www.cnblogs.com/mingyao123/p/7424911.html](https://www.cnblogs.com/mingyao123/p/7424911.html)