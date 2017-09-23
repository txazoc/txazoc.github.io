---
layout: map
title:  Java
---

#### 链接

* [Java引用](/topic/java/reference.html)

#### 线程池

* [线程池](/topic/java/concurrent/thread-pool.html)
* [Java线程池测试](/java/java-thread-pool-test.html)

#### 并发

* 并发方法
    * 多进程
    * 多线程
        * 线程上下文切换
        * 共享内存
        * 信号量
    * I/O多路复用
        * select
        * 事件驱动
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
        * 方法参数、方法局部变量
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

#### Java并发模型

* 线程通信
    * 共享内存
        * 读写内存
    * 消息传递
* 线程同步: 控制执行顺序
    * 共享内存: 显式同步
        * synchronized: 互斥
        * ReentrantLock
        * happens-before
    * 消息传递: 隐式同步
* Java内存模型(JMM)
    * 线程 - 工作内存 - JMM - 主内存
    * 工作内存: 抽象概念，并不真实存在，涵盖了CPU高速缓存、写缓冲区、硬件和编译器优化
    * 读可见性
        * 线程A - 变量a - 写 - 主内存
        * 线程B - 变量b - 读 - 主内存
    * 写竞争
        * 线程A - 变量a - 写 - 主内存
        * 线程B - 变量b - 写 - 主内存
* Java内存模型实现
    * 指令重排序
        * 编译重排序: 不改变单线程语义的前提下
        * 指令重排序: 不存在数据依赖性(两个操作访问变量，其中一个为写操作)
        * 内存重排序: 读缓存、写缓冲

[全面理解Java内存模型](http://blog.csdn.net/suifeng3051/article/details/52611310)

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
