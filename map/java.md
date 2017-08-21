---
layout: map
title:  Java
---

#### 并发

* 并发读写控制
    * 避免内存共享
        * 不可变对象
        * 线程局部变量ThreadLocal
        * 方法局部变量
    * 单线程: as-if-serial
    * 读写串行
        * synchronized
        * ReentrantLock
    * 读写分离
        * ReentrantReadWriteLock
    * 乐观锁
        * cas
    * 读一致性
        * volatile
