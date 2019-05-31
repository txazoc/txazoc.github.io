---
layout: topic
module: HotSpot
title:  自动内存管理
date:   2016-11-29
---

参考自: [Memory Management in the Java HotSpot Virtual Machine](http://www.oracle.com/technetwork/java/javase/memorymanagement-whitepaper-150215.pdf)


设计垃圾收集算法时的选择:

* 串行 vs 并行
* 并发 vs Stop-The-World
* 压缩 vs 不压缩 vs 复制

评估垃圾收集器的***`性能指标`***:

* 吞吐量: 应用程序运行时间 / (应用程序运行时间 + 垃圾收集时间)
* 垃圾收集开销: 垃圾收集时间 / (应用程序运行时间 + 垃圾收集时间)
* 停顿时间: 垃圾收集时，应用程序被停止执行的时间
* 收集频率: 垃圾收集发生的频率
* 内存占用大小: 比如堆的大小
* 实时性: 对象从成为垃圾到被回收所经历的时间

实时应用程序: 

***`分代收集`***:

* 分代假设: 大部分对象的存活时间很短
* 年轻代: 内存相对小，存放新生对象，GC频繁，GC时间短
* 年老代: 内存相对大，存放年老对象，GC较少，GC时间长

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
* 线程局部分配缓冲(TLAB): Thread-Local Allocation Buffer，多线程情况下，每个线程都有自己的TLAB

***`Serial收集器`***

* 年轻代，单线程，Stop-The-World
* 复制算法
* -XX:+UseSerialGC

***`ParNew收集器`***

* 年轻代，多线程，Stop-The-World
* 复制算法
* -XX:+UseParNewGC

***`Parallel Scavenge收集器`***

* 年轻代，多线程

***`Serial Old收集器`***

* 年老代，单线程，Stop-The-World
* 标记 - 清除 - 压缩算法
* -XX:+UseSerialGC

***`Parallel Old收集器`***

***`CMS收集器(Concurrent Mark Sweep)`***

* 老年代, 多线程
* 步骤一: 初始标记(STW): 标记GC Roots关联的对象，速度很快  
  步骤二: 并发标记(并发): GC Roots Tracing  
  步骤三: 重新标记(STW): 修正并发标记期间应用程序运行导致的标记变动  
  步骤四: 并发清除(并发): 清除垃圾对象
* 优点: 低停顿时间
* 缺点:
    * 不压缩导致内存碎片和更多的内存分配时间
    * 内存碎片和并发标记的应用内存分配(预留内存空间)导致更大的堆空间
    * 内存碎片过多，大对象分配可能导致提前触发Full GC
    * 预留内存空间不足导致Concurrent Mode Failure，触发使用Serial Old收集器重新Full GC
* VM选项:
    * -XX:+UseConcMarkSweepGC

***`G1收集器`***

#### 自动调优

***`并行收集器调优`***

* 最大暂停时间目标: -XX:MaxGCPauseMillis=n
* 吞吐量目标: -XX:GCTimeRatio=n

#### 建议

***`垃圾收集器选择`***

* –XX:+UseSerialGC
* –XX:+UseParallelGC
* –XX:+UseParallelOldGC
* –XX:+UseConcMarkSweepGC

***`如何处理OutOfMemoryError`***

* Java heap space: –Xmx
* PermGen space: –XX:MaxPermSize=n
* Requested array size exceeds VM limit

#### 垃圾收集的性能评估的工具

* –XX:+PrintGCDetails
* –XX:+PrintGCTimeStamps
* [jmap](/topic/jdk/jmap.html)
* [jstat](/topic/jdk/jstat.html)
* HPROF: Heap Profiler
* HAT: Heap Analysis Tool

#### 垃圾收集相关的关键选项

***垃圾收集器选择***

* –XX:+UseSerialGC: Serial收集器
* –XX:+UseParallelGC: Parallel收集器
* –XX:+UseParallelOldGC: Parallel Old收集器
* –XX:+UseConcMarkSweepGC: CMS收集器

***垃圾收集器统计***

* –XX:+PrintGC
* –XX:+PrintGCDetails
* –XX:+PrintGCTimeStamps

***堆和分代大小***

* –Xms: 最小堆大小
* –Xmx: 最大堆大小
* –XX:MinHeapFreeRatio=minimum
* –XX:MaxHeapFreeRatio=maximum
* –XX:NewSize=n: 年轻代大小初始大小
* –XX:NewRatio=n: 年轻代/年老代比例(1:n)
* –XX:SurvivorRatio=n: Enen/Survivor比例(1:n)
* –XX:MaxPermSize=n: 永久代最大大小

***Parallel收集器选项***

* –XX:ParallelGCThreads=n: 垃圾收集的线程数
* –XX:MaxGCPauseMillis=n: 最大GC暂停时间
* –XX:GCTimeRatio=n: GC时间比例(1/1+n)

***CMS收集器选项***

* –XX:ParallelGCThreads=n: 垃圾收集的线程数

#### 更多信息

* [Tuning Garbage Collection with the 5.0 Java Virtual Machine](http://www.oracle.com/technetwork/java/gc-tuning-5-138395.html)
