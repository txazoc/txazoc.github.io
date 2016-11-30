---
layout: topic
module: HotSpot
title:  内存管理
date:   2016-11-29
---

参考自: [Memory Management in the Java HotSpot Virtual Machine](http://www.oracle.com/technetwork/java/javase/memorymanagement-whitepaper-150215.pdf)

#### 显式和自动内存管理

显示内存分配带来的问题:

* 手动释放内存, 加重程序员负担
* 对象内存被回收, 任被引用
* 无用内存未释放, 导致内存泄露

#### 垃圾收集概念
