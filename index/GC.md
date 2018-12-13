---
layout: index
title:  GC
---

#### 垃圾收集器分类

| 分类 | 垃圾收集器 |
| --- | --- |
| 串行垃圾收集器 | Serial、Serial Old |
| 并行垃圾收集器 | ParNew、Parallel Scavenge、Parallel Old |
| 并发垃圾收集器 | CMS、G1 |

#### Serial收集器

新生代、单线程、STW、复制

* -XX:+UseSerialGC

#### Serial Old收集器

老年代、单线程、STW、标记-整理

#### ParNew收集器

新生代、多线程、STW、复制

* -XX:+UseParNewGC
* -XX:ParallelGCThreads=<N>

#### Parallel Scavenge收集器

新生代、多线程、STW、复制，又称为吞吐量收集器

* -XX:+UseParallelGC
* -XX:ParallelGCThreads=<N>
* -XX:MaxGCPauseMillis=<N>，最大垃圾收集停顿时间
* -XX:GCTimeRatio=<N>，垃圾收集时间占比

#### Parallel Old收集器

老年代、多线程、STW、标记-整理

* -XX:+UseParallelOldGC

#### CMS收集器

老年代、多线程、部分STW、标记-清除

* -XX:+UseConcMarkSweepGC
* -XX:CMSInitiatingOccupancyFraction=<N>
* `Concurrent Mode Failure`: CMS失败，临时启用Serial Old收集器

CMS收集器的收集过程:

* 初识标记(STW): 标记GC Roots能直接关联到的对象
* 并发标记
* 重新标记(STW): 并发标记修正
* 并发清理

#### G1收集器

新生代/老年代、多线程、部分STW、标记-整理

#### 垃圾收集器组合

* Serial + Serial Old
* ParNew + CMS + Serial Old
* Parallel Scavenge + Parallel Old
* G1

#### Minor GC(新生代GC)

#### Full GC(老年代GC)
