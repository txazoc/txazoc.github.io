---
layout: topic
module: JDK
title:  jvisualvm
date:   2016-11-28
---

Java VisualVM

* jvmstat
* JMX
* Serviceability Agent
* Attach API

启动Java VisualVM，`jvisualvm`

#### 应用程序和起始页

![起始页](/images/topic/jdk/jvisualvm/startpage.png =664x)

* 应用程序
    * 本地: 本地Java进程
        * 右键
            * 线程Dump
            * 堆Dump
            * 应用程序快照
    * 远程: 远程Java进程
    * VM核心dump
    * 快照
* 起始页

#### 概述

![概述](/images/topic/jdk/jvisualvm/overview.png =664x)

* 概述
    * PID、主机、主类、参数
    * JVM、Java Home、JVM标志
* 保存的数据
    * 线程Dump
    * 堆Dump
    * Profiler快照
* JVM参数
* 系统属性

#### 监视

![监视](/images/topic/jdk/jvisualvm/monitor.png =664x)

* 正常运行时间
* 执行垃圾回收
* 堆Dump
* CPU
    * CPU使用情况
    * 垃圾回收活动
* 内存
    * 堆: 大小、最大、已使用
    * PermGen: 大小、最大、已使用
* 类
    * 已装入的总数
    * 已卸载的总数
* 线程
    * 活动
    * 实时峰值
    * 守护线程
    * 已启动的总数

#### 线程

![线程](/images/topic/jdk/jvisualvm/thread.png =664x)

* 实时线程
* 守护线程
* 线程Dump
* 时间线

#### 抽样器

![抽样器](/images/topic/jdk/jvisualvm/sampler.png =664x)

#### Profiler

![Profiler](/images/topic/jdk/jvisualvm/profiler.png =664x)
