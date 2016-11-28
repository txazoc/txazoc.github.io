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

启动Java VisualVM:

```linux
$ jvisualvm
```

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
    * 名称
    * 状态变化
        * RUNNABLE
        * BLOCKED
        * WAITING
        * TIMED_WAITING
    * 运行时间

#### 抽样器

![抽样器](/images/topic/jdk/jvisualvm/sampler.png =664x)

* 设置
    * CPU设置
    * 内存设置
* CPU抽样
    * CPU样例
        * 线程Dump
        * 热点方法和时间
    * 线程CPU时间
        * 线程和线程CPU时间
* 内存抽样
    * 堆柱状图
        * 类名、实例数、字节
    * PermGen柱状图
    * 每个线程分配
    * 执行GC
    * 堆Dump

#### Profiler

![Profiler](/images/topic/jdk/jvisualvm/profiler.png =664x)

#### 线程Dump

![线程Dump](/images/topic/jdk/jvisualvm/threaddump.png =664x)

#### 堆Dump

![堆Dump](/images/topic/jdk/jvisualvm/heapdump.png =664x)

#### 插件

Java VisualVM支持插件功能

![插件](/images/topic/jdk/jvisualvm/plugin.png =664x)

#### MBeans插件

![MBeans插件](/images/topic/jdk/jvisualvm/mbean.png =664x)

#### SA Plugin插件

![SA Plugin插件](/images/topic/jdk/jvisualvm/sa.png =664x)
