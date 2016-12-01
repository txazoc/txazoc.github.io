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
* 对象持有已被释放内存的引用
* 无用内存未释放, 导致内存泄露

#### 垃圾收集概念

垃圾收集器的职责:

* 分配内存
* 回收无用内存

`垃圾收集`: 查找并释放无用内存的过程

`内存碎片`

设计垃圾收集算法时的选择:

* 串行 vs 并行
* 并发 vs Stop-The-World
* 压缩 vs 不压缩 vs 复制

评估垃圾收集器的***`性能指标`***:

* 吞吐量: 应用程序运行时间 / (应用程序运行时间 + 垃圾收集时间)
* 垃圾收集开销: 垃圾收集时间 / (应用程序运行时间 + 垃圾收集时间)
* 停顿时间: 垃圾收集时, 应用程序被停止执行的时间
* 收集频率: 垃圾收集发生的频率
* 内存占用大小: 比如堆的大小
* 实时性: 对象从成为垃圾到被回收所经历的时间

实时应用程序: 

***`分代收集`***:

* 分代假设: 大部分对象的存活时间很短
* 年轻代: 内存相对小, 存放新生对象, GC频繁, GC时间短
* 年老代: 内存相对大, 存放年老对象, GC较少, GC时间长

#### 垃圾收集器

***`HotSpot分代`***:

* 年轻代: 大部分新生对象
* 年老代: 长时间存活的对象、一些大对象
* 永久代: 类、方法以及它们的描述信息

***`垃圾收集类型`***:

* Minor GC: Young GC
* Major GC: Full GC

***`快速分配`***:

* 指针碰撞: 保存已分配内存的末尾
* 线程局部分配缓冲(TLAB): Thread-Local Allocation Buffer, 多线程情况下, 每个线程都有自己的TLAB

***`Serial收集器`***

* 年轻代, 单线程, Stop-The-World
* 复制算法
* -XX:+UseSerialGC

***`Serial Old收集器`***

* 年老代, 单线程, Stop-The-World
* 标记 - 清除 - 压缩算法
* -XX:+UseSerialGC

***`ParNew收集器`***

* 年轻代, 多线程, Stop-The-World
* 复制算法

***`Parallel Scavenge收集器`***

* 年轻代, 多线程

***`并行压缩收集器`***

***`并发标记清除收集器(CMS)`***

#### 自动调优
