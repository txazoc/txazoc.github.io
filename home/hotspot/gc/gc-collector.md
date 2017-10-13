---
layout: home
title:  GC收集器
date:   2017-10-13
---

#### 参考资料

#### 垃圾收集器

* Serial

新生代、串行、复制、STW

* ParNew

新生代、并行、复制、STW

* Parallel Scavenge

新生代、并行、复制、STW

* CMS

老生代、并发、标记-清除、部分STW

* Serial Old

老生代、串行、标记-整理、STW

* Parallel Old

老生代、并行、标记-整理、STW

* G1

新生代/老年代、并发、标记-整理、部分STW

#### 吞吐量收集器

> 吞吐量优先

#### CMS

> 停顿时间优先

* -XX:CMSFullGCsBeforeCompaction: 进行内存压缩的full gc次数
* -XX:UseCMSCompactAtFullCollection: 开启老年代压缩，对性能有影响
* CMS失败后，会启用Serial Old做Full GC
