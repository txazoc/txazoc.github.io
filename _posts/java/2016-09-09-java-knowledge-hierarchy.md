---
layout:     article
categories: [java]
title:      Java知识体系
tags:       [java]
date:       2016-09-09
---

罗列一下Java的知识体系，慢慢消化。

#### Java语言规范

* [Java Language Specification](https://docs.oracle.com/javase/specs/jls/se7/html/index.html)
* 词汇结构
	* 注释：/\* \*/、//
	* 关键字
	* 分隔符
	* 运算符
* 类型、值和变量
	* 基本数据类型
		* 整数类型：byte、char、short、int、long
		* 浮点类型：float、double
		* 布尔类型：boolean
	* 引用类型
	* 泛型
	* 类型擦除
	* 子类型：extends、implements
	* 变量
		* 基本数据类型变量
		* 引用类型变量
		* 类变量
		* 实例变量
		* 方法参数
		* 构造函数参数
		* 局部变量

#### Java代码

* JDK开发工具包
	* IO/NIO：java.io、java.nio
	* 集合：java.util
	* 网络编程：java.net
	* 多线程
	* 并发编程：java.util.concurrent
* Java开源框架
	* Struts2
	* Spring
	* MyBatis
* Java应用程序
* Java设计模式

#### Java静态编译

* javac
* [OpenJDK langtools](http://hg.openjdk.java.net/jdk7/jdk7/langtools)

#### Java类文件

* javap
* 类文件结构
