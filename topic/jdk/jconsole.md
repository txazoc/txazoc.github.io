---
layout: topic
module: JDK
title:  jconsole
---

Java Monitoring and Management Console，Java监视和管理控制台

打开jconsole:

* `jconsole`
* `jconsole <pid>`

jconsole包含以下几部分:

####  概览

![概览](/images/topic/jdk/console/overview.png =664x)

* 堆内存使用量
* 线程
* 类
* CPU占用率

#### 内存

![内存](/images/topic/jdk/console/memory.png =664x)

* 堆内存
    * Eden Space
    * Survivor Space
    * Old Gen
* 非堆内存
    * Code Cache
    * Perm Gen
* 已用
* 已提交
* 最大值
* GC时间

#### 线程

![线程](/images/topic/jdk/console/thread.png =664x)

* 线程数
    * 活动线程
    * 峰值
* 线程
    * 名称
    * 状态
    * 总阻止数
    * 总等待数
    * 堆栈跟踪
* 检测死锁

#### 类

![类](/images/topic/jdk/console/class.png =664x)

* 当前加载类数
* 已加载类总数
* 已卸载类总数

#### VM概要

![VM概要](/images/topic/jdk/console/vm-summary.png =664x)

* 概要
    * 运行时间
    * 进程的CPU时间
    * 总编译时间
* 线程
    * 活动线程
    * 峰值
    * 守护线程
    * 启动的线程总数
* 类
    * 当前加载类数
    * 已加载类总数
    * 已卸载类总数
* 内存
    * 当前堆大小
    * 提交的内存
    * 最大堆大小
    * 等待finalize的对象
    * 垃圾收集器
* 操作系统
    * 总物理内存
    * 空闲物理内存
    * 提交的虚拟内存
* 其它信息
    * VM参数
    * 类路径
    * 库路径
    * 引导类路径

#### <a id="mbean">MBean</a>

![MBean](/images/topic/jdk/console/mbean.png =664x)

参见 [JMX MBean](/topic/jdk/jmx#mbean)

\[参考\]:

* [Using JConsole - Java SE Monitoring and Management Guide](https://docs.oracle.com/javase/8/docs/technotes/guides/management/jconsole.html)
