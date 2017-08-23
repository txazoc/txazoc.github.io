---
layout: map
title:  Java
---

#### 并发

* 并发读写控制
    * 并发的问题
        * 资源抢夺: 多线程
        * 读写并发: 读读、读写、写读、写写
        * 读写缓存: Java内存模型
        * 重排序: 编译重排序、指令重排序、内存重排序
    * 只读: 不可变对象
        * final类型常量
        * final类型对象引用
        * 创建后内部状态不能被修改的对象: String
    * 单线程: as-if-serial
    * 局部变量: 避免多线程共享
        * 方法局部变量
        * 线程局部变量ThreadLocal
    * 读写串行
        * synchronized
        * ReentrantLock
    * 并行读、读写互斥
        * ReentrantReadWriteLock
    * 读写分离
        * CopyOnWriteArrayList
    * 无锁
        * 读一致性: volatile
        * 写一致性: cas
        
#### 集合

* CopyOnWriteArrayList
    * 数据结构
        * volatile Object[] array
    * 特点
        * 读: volatile读
        * 写: ReentrantLock + copy + volatile写
* ConcurrentHashMap
    * 数据结构(java 8)
        * volatile Node<K,V>[] table
            * final int hash
            * final K key
            * volatile V val
            * volatile Node<K,V> next
        * volatile Node<K,V>[] nextTable
        * volatile long baseCount
        * volatile int sizeCtl
        * volatile int transferIndex
        * volatile int cellsBusy
