---
layout:     article
categories: [jvm]
title:      JVM垃圾回收
tags:       [jvm, 垃圾回收]
date:       2016-09-29
---

Java虚拟机包含三种类型的垃圾收集器:

* ***串行收集器***: 单个线程执行垃圾回收工作，适用于单核CPU机器或较小的应用程序
    * Serial收集器
    * Serial Old收集器
* ***并行收集器***: 吞吐量收集器，多个线程同时执行垃圾回收工作
    * ParNew收集器
    * Parallel Scavenge收集器
    * Parallel Old收集器
* ***并发收集器***: 垃圾回收和程序执行同时进行
    * CMS收集器
    * G1收集器

#### Serial收集器

#### Parallel收集器

* -XX:+UseParallelGC
* -XX:ParallelGCThreads=<N\>
* -XX:MaxGCPauseMillis=<N>
* -XX:GCTimeRatio=<N>

#### CMS收集器

* -XX:+UseConcMarkSweepGC

#### G1收集器
