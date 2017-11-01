---
layout: homelist
title: java.lang
date: 2017-10-26
---

* 包装类型
    * 自动装箱拆箱
    * Cache
    * Number: Byte、Short、Integer、Long、Float、Double
* ClassLoader: 类加载器
    * 双亲委派
    * loadClass()
    * findClass()
    * defineClass()
* Cloneable: 克隆标记接口
    * 浅克隆
* 比较
    * Comparable
    * Comparator
* Enum: 枚举父类
    * String name
    * int ordinal
* 异常
    * Throwable
        * Error
        * Exception
            * RuntimeException
* FunctionalInterface: 函数式接口注解
* Iterable: 遍历接口
    * iterator()
* Object
    * hashCode()
    * equals(): ==
    * clone()
    * toString()
    * wait()/notify()/notifyAll()
    * finalize()
* 多线程
    * Runnable
    * Thread
        * ThreadLocalMap<ThreadLocal, Object>
        * start()/run()
        * sleep()
        * join()
        * interrupt()/interrupted()/isInterrupted()
    * Thread$State
        * NEW
        * RUNNABLE
        * BLOCKED
        * WAITING
        * TIMED_WAITING
        * TERMINATED
    * ThreadLocal
* 字符串
    * String: 不可变
        * 字符串常量池
            * 字符串常量
            * intern()
    * StringBuffer
    * StringBuilder
        * char[]
