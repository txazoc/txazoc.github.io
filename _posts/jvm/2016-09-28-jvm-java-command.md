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
| -ea -enableassertions | 启用断言 |
| -da -disableassertions | 禁用断言 |
| -esa -enablesystemassertions | 启用系统断言 |
| -dsa -disablesystemassertions | 禁用系统断言 |
| -jar filename | 从jar包运行程序 |
| -version | 输出版本信息后退出 |
| -showversion | 输出版本信息 |
| -verbose:gc | 输出gc信息 |
| -verbose:jni | 输出native方法和JNI信息 |
| -verbose:class | 输出加载的类信息 |

#### 非标准选项

| 选项 | 作用 |
| --- | --- |


#### 运行时选项

#### JIT编译器选项

#### 可用性选项

#### 垃圾收集选项
