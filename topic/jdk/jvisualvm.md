---
layout: topic
module: JDK
title:  jvisualvm
date:   2016-11-28
---

Java VisualVM，一体化的Java监控和故障排除工具

VisualVM使用到的技术有:

* jvmstat
* [JMX](/topic/jdk/jmx.html)
* Serviceability Agent
* [Attach API](/topic/jdk/attach-api.html)

启动VisualVM:

```linux
$ jvisualvm
```

#### 应用程序和起始页

![起始页](/images/topic/jdk/jvisualvm/startpage.png =664x)

* 应用程序
    * 本地: 本地Java进程
        * 本地(鼠标左键双击)
            * 主机IP、主机名
            * 操作系统、体系结构，处理器
            * 物理内存总大小、交换空间大小
            * CPU负荷、物理内存、交换空间内存
        * Java进程 - 鼠标右键
            * [线程Dump](#threaddump)
            * [堆Dump](#heapdump)
            * [应用程序快照](#snapshot)
            * 在出现OOME时生成堆Dump: 启用/禁用
    * 远程: 远程Java进程
    * VM核心dump
        * 打开保存的核心dump(鼠标左键双击)
    * 快照
        * 生成的应用程序快照
        * 打开保存的应用程序快照(鼠标左键双击)
* 起始页

#### 概述

![概述](/images/topic/jdk/jvisualvm/overview.png =664x)

* 概述
    * PID、主机、主类、参数
    * JVM、Java、Java Home、JVM标志
* 保存的数据
    * [线程Dump](#threaddump)
    * [堆Dump](#heapdump)
    * Profiler快照
* JVM参数
* 系统属性

#### 监视

![监视](/images/topic/jdk/jvisualvm/monitor.png =664x)

* 正常运行时间
* 执行垃圾回收
* [堆Dump](#heapdump)
* CPU
    * CPU使用情况
    * 垃圾回收活动
* 内存
    * 堆: 大小、已使用、最大
    * PermGen: 大小、已使用、最大
* 类
    * 已装入的类总数
    * 已卸载的类总数
* 线程
    * 活动线程
    * 实时峰值
    * 守护线程
    * 已启动的线程总数

#### 线程

![线程](/images/topic/jdk/jvisualvm/thread.png =664x)

* 实时线程
* 守护线程
* [线程Dump](#threaddump)
* 时间线
    * 名称
    * 状态变化
        * 运行
            * `RUNNABLE`
        * 休眠
            * `TIMED_WAITING (sleeping)`: Thread.sleep(timeout)
        * 等待
            * `WAITING (on object monitor)`: Object.wait()
            * `TIMED_WAITING (on object monitor)`: Object.wait(timeout)
        * 驻留
            * `WAITING (parking)`: LockSupport.park()
            * `TIMED_WAITING (parking)`: LockSupport.parkNanos(timeout)、LockSupport.parkUntil(timeout)
        * 监视
            * `BLOCKED (on object monitor)`: synchronized
    * 运行时间

#### 抽样器

![抽样器](/images/topic/jdk/jvisualvm/sampler.png =664x)

* 设置
    * CPU设置
    * 内存设置
* CPU抽样
    * CPU样例
        * 快照
        * [线程Dump](#threaddump)
        * 热点方法、自用时间
    * 线程CPU时间
        * 线程名称、线程CPU时间
* 内存抽样
    * 堆柱状图
        * 快照
        * 类名、实例数、字节
    * PermGen柱状图
    * 每个线程分配
    * 执行GC
    * [堆Dump](#heapdump)

#### Profiler

![Profiler](/images/topic/jdk/jvisualvm/profiler.png =664x)

#### <a id="threaddump">线程Dump</a>

![线程Dump](/images/topic/jdk/jvisualvm/threaddump.png =664x)

* 鼠标右键
    * 另存为: \*.tdump

#### <a id="heapdump">堆Dump</a>

![堆Dump](/images/topic/jdk/jvisualvm/heapdump.png =664x)

* 鼠标右键
    * 另存为: \*.hprof
* 概要
    * 概述
        * 基本信息
        * 环境
        * 系统属性
        * 堆转储上的线程
    * 最大对象查找
* 类
    * 类
        * 堆转储比较
        * 类: 类名、实例数、大小
        * 类名过滤器
    * 类的静态字段
* 实例数
    * 类型、实例数、实例大小、总大小
    * 实例
    * 字段
    * 引用
* OQL控制台

#### <a id="snapshot">应用程序快照</a>

* 鼠标右键
    * 另存为: \*.apps

#### 插件

Java VisualVM支持插件功能，选择菜单: 工具－插件

![插件](/images/topic/jdk/jvisualvm/plugin.png =664x)

#### MBeans插件

![MBeans插件](/images/topic/jdk/jvisualvm/mbean.png =664x)

#### SA Plugin插件

![SA Plugin插件](/images/topic/jdk/jvisualvm/sa.png =664x)

\[参考\]:

* [VisualVM](https://visualvm.github.io/)
* [Introduction to VisualVM](http://visualvm.java.net/intro.html)
