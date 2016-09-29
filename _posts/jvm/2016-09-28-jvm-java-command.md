---
layout:     article
categories: [jvm]
title:      java命令
tags:       [java]
date:       2016-09-28
---

java命令用来启动Java应用程序，格式如下。

* java [options] classname [args]
* java [options] -jar filename [args]

options为命令行选项，args为Java主类参数。

#### 标准选项

| 选项 | 作用 |
| --- | --- |
| -client | client模式启动 |
| -server | server模式启动 |
| -Dproperty=value | 设置系统属性 |
| -ea | 启用断言 |
| -da | 禁用断言 |
| -esa | 启用系统断言 |
| -dsa | 禁用系统断言 |
| -jar filename | 从jar包运行程序 |
| -version | 输出版本信息后退出 |
| -showversion | 输出版本信息 |
| -verbose:gc | 输出gc信息 |
| -verbose:jni | 输出native方法和JNI信息 |
| -verbose:class | 输出加载的类信息 |
| -classpath | 类路径 |

#### 非标准选项

| 选项 | 作用 |
| --- | --- |
| -X | 输出所有-X选项 |
| -Xint | 解释模式 |
| -Xcomp | 编译模式 |
| -Xmixed | 混合模式 |
| -Xloggc:filename | gc信息输入到文件 |
| -Xms<size\> | 堆初始大小 |
| -Xmx<size\> | 堆最大大小 |
| -Xmn<size\> | 新生代大小 |
| -Xss<size\> | 线程栈大小 |
| -Xnoclassgc | 禁止回收Class对象 |
| -XshowSettings:all | 输出所有设置 |
| -XshowSettings:vm | 输出虚拟机设置 |
| -XshowSettings:locale | 输出本地设置 |
| -XshowSettings:properties | 输出系统属性 |

#### 运行时选项

| 选项 | 作用 |
| --- | --- |
| -XX:+PerfDataSaveToFile |  |
| -XX:+PrintCommandLineFlags | 输出命令行选项 |
| -XX:ThreadStackSize | 线程栈大小 |
| -XX:+TraceClassLoading | 踪迹加载的类 |
| -XX:+TraceClassResolution | 跟踪常量池解析 |
| -XX:-UseCompressedOops | 禁用指针压缩  |
| -XX:+PrintFlagsFinal | |

#### JIT编译器选项

| 选项 | 作用 |
| --- | --- |
| -XX:CompileThreshold=1000 | 编译阈值 |
| -XX:InitialCodeCacheSize=size | 代码缓存大小 |
| -XX:+Inline | 启用方法内联 |

#### 可用性选项

| 选项 | 作用 |
| --- | --- |
| -XX:+HeapDumpOnOutOfMemory | 内存溢出时dump堆内存 |
| -XX:HeapDumpPath=path | dump堆内存路径 |

#### 垃圾收集选项

| 选项 | 作用 |
| --- | --- |
| -XX:InitialHeapSize=size | 堆初始大小 |
| -XX:InitialSurvivorRatio=ratio | 新生代比例 |
| -XX:MaxHeapSize=size | 堆最大大小 |
| -XX:MetaspaceSize=size | Metaspace初始大小 |
| -XX:MaxMetaspaceSize=size | Metaspace最大大小 |
| -XX:NewSize=size | 新生代初始大小 |
| -XX:MaxNewSize=size | 新生代最大大小 |
| -XX:NewRatio=ratio | 新生代/年老代比例 |
| -XX:+PrintGC | 输出gc日志 |
| -XX:+PrintGCDetails | 输出gc详细日志 |
| -XX:SurvivorRatio=ratio | eden/survivor比例 |
| -XX:+UseConcMarkSweepGC | |
| -XX:+UseG1GC | G1垃圾收集器 |
| -XX:+UseParallelGC | |
| -XX:+UseParallelOldGC | |
| -XX:+UseParNewGC | |
| -XX:+UseSerialGC | |
