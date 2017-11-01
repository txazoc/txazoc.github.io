---
layout: homelist
title: java.util.concurrent
date: 2017-10-26
---

* Unsafe
    * allocateMemory()/freeMemory(): 直接内存分配/回收
    * park()/unpark()
    * compareAndSwapInt()/compareAndSwapLong()/compareAndSwapObject()
    * getXXX()/putXXX()
    * getXXXVolatile()/putXXXVolatile()
* AQS
* 原子类
* Lock
    * ReentrantLock
    * ReentrantReadWriteLock
* Condition
* 并发工具类
    * Semaphore
    * CyclicBarrier
    * CountDownLatch
* 并发集合类
    * ArrayBlockingQueue
    * LinkedBlockingQueue
    * ConcurrentHashMap
    * CopyOnWriteArrayList
    * DelayQueue
    * PriorityBlockingQueue
* 线程池
    * Executors
    * ThreadPoolExecutor
    * ScheduledThreadPoolExecutor
    * FutureTask: implements Runnable, Future
        * Callable
