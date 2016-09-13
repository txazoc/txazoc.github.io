---
layout:     article
categories: [java]
title:      Java知识体系
tags:       [java]
date:       2016-09-09
---

罗列一下Java的知识体系，慢慢消化。

#### Java语言规范

* [***Java Language Specification***](https://docs.oracle.com/javase/specs/jls/se8/html/index.html)
* ***词汇结构***
	* 注释：//、/\* \*/、/\*\* \*/
	* 标识符
	* 关键字
	* 字面值：基本数据类型、字符串、转义字符、null
	* 分隔符：( ) [ ] { } . , : ; ... @
	* 运算符
* ***类型、值和变量***
	* 基本数据类型
		* 整数类型：byte、char、short、int、long
		* 浮点类型：float、double
		* 布尔类型：boolean
	* 引用类型
		* 类类型
		* 接口类型
		* 泛型类型
		* 数组类型
	* 引用类型对象
		* 类实例
		* 数组
	* 泛型
	* 类型擦除
	* 子类型
	* 变量
		* 基本数据类型变量
		* 引用类型变量
		* 类变量
		* 实例变量
		* 数组元素
		* 方法参数
		* 构造函数参数
		* Lambda参数
		* 异常参数
		* 局部变量
		* final变量
	* 变量的初始值
		* 类变量、实例变量、数组元素：基本数据类型初始值为0，引用类型初始值为null
		* 方法参数：初始值为传递的参数
		* 构造函数参数：初始值为传递的参数
		* 异常参数：初始值为抛出的异常对象
		* 局部变量：使用前，必须显式赋初始值
* ***类型转换***
	* 基本数据类型向上转型
	* 基本数据类型向下转型
	* 引用类型向上转型
	* 引用类型向下转型
	* 装箱
	* 拆箱
	* 字符串转换

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
