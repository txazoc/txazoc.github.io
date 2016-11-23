---
layout: topic
module: JDK
title:  jconsole
---

Java Monitoring and Management Console，Java监视和管理控制台

打开jconsole:

* `jconsole`
* `jconsole pid`

jconsole包含以下几部分:

####  概览

* 堆内存使用量
* 线程
* 类
* CPU占用率

#### 内存

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
    * Yong GC
    * Full GC

#### 线程

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

* 当前加载类数
* 已加载类总数
* 已卸载类总数

#### VM概要

* 概要
    * 运行时间
    * 进程的CPU时间
    * 总编译时间
* 线程
    * 活动线程数
    * 活动线程峰值
    * 守护线程数
    * 启动的线程总数
* 类
    * 当前加载的类数
    * 加载的类总数
    * 卸载的类总数
* 内存
    * 当前堆大小
    * 已提交的内存
    * 最大堆大小
    * 等待finalize的对象数
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

#### MBean
