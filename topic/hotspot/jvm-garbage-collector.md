---
layout: topic
module: HotSpot
title:  Java垃圾收集器
tags:   ['jvm', 'gc']
date:   2016-09-29
---

#### 垃圾收集器分类

| 分类 | 垃圾收集器 |
| --- | --- |
| 串行垃圾收集器 | Serial、Serial Old |
| 并行垃圾收集器 | ParNew、Parallel Scavenge、Parallel Old |
| 并发垃圾收集器 | CMS |
| G1垃圾收集器 | G1 |

#### Serial收集器

新生代、单线程、Stop The World、复制算法

#### ParNew收集器

新生代、多线程、Stop The World、复制算法

#### Parallel Scavenge收集器

新生代、多线程、Stop The World、复制算法

Parallel Scavenge收集器，又称为吞吐量收集器

#### Serial Old收集器

老年代、单线程、Stop The World、标记-整理算法

#### Parallel Old收集器

老年代、多线程、Stop The World、标记-整理算法

#### CMS收集器

老年代、多线程、部分Stop The World、标记-清除算法

CMS收集器的收集过程:

* 初识标记(Stop The World): 标记GC Roots能直接关联到的对象
* 并发标记
* 重新标记(Stop The World): 并发标记修正
* 并发清理

#### G1收集器

* 新生代 + 老年代: 分区
* 并行 + 并发

#### 垃圾收集器组合

* Serial + Serial Old
* ParNew + CMS
* Parallel Scavenge + Parallel Old
* G1
