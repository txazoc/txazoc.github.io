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
	* 标识符: a-z、A-Z、0-9、_、$
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
		* Type Variable: java.lang.reflect.Type
		* 数组类型
	* 对象
		* 类实例
		* 数组
	* 泛型
		* 参数化类型
		* 泛型类、泛型接口、泛型方法
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
		* 类变量、实例变量、数组元素
			* 基本数据类型变量: 0
			* 引用类型变量: null
		* 方法参数：实参
		* 构造函数参数：实参
		* 异常参数：抛出的异常
		* 局部变量：必须初始化或赋值
* ***类型转换***
	* 基本数据类型向上转型
	* 基本数据类型向下转型
	* 基本数据类型向上和向下转型
	* 引用类型向上转型
	* 引用类型向下转型
	* 装箱
	* 拆箱
	* 不受检查的转型
	* Capture Conversion
	* 字符串转型
* ***类***
	* 类声明
		* 类修饰符: public protected private abstract static final
		* 泛型类和类型参数
		* 内部类
			* 成员内部类
			* 局部内部类
			* 匿名内部类
			* 静态内部类
		* 父类和子类: extends
		* 接口: implements
	* 类成员
		* 父类继承的成员
		* 接口继承的成员
		* 类声明的成员
	* 属性声明
		* 属性修饰符: public protected private static final transient volatile
		* 属性初始化
		* 属性初始化时的向前引用
	* 方法声明
		* 方法参数
		* 方法签名: 方法名 + 方法参数
		* 方法修饰符: public protected private abstract static final synchronized native
		* 泛型方法
		* 方法返回值
		* 方法抛出异常声明: throws
		* 继承
		* 重写: 实例方法
		* 重载: Overload
	* 成员类型声明
		* 静态内部类
	* 实例初始化
	* 静态初始化
	* 构造函数声明
		* 构造函数参数
		* 构造函数签名
		* 构造函数修饰符: public protected private
		* 泛型构造函数
		* 构造函数抛出异常声明
		* 构造函数重写
		* 默认构造函数
		* 防止类实例化: private
	* 枚举类型
		* 枚举常量
		* 枚举成员
			* 枚举声明的成员
			* 继承自Enum的成员
			* 枚举常量
			* values()、valueOf()
* ***接口***
	* 接口声明
		* 接口修饰符: public protected private abstract static
		* 泛型接口和类型参数
		* 父接口和子接口: extends
	* 接口成员
		* 接口声明的成员
		* 父接口继承的成员
	* 属性常量声明
		* 接口属性的初始化
	* 方法声明
		* 继承
		* 重载
	* 成员类型声明
		* 静态内部类
	* 注解类型
		* 注解类型元素
		* 注解类型元素默认值: default
		* 预定义的注解类型: @Target、@Retention、@Inherited、@Override、@SuppressWarnings、@Deprecated、
	* 注解
		* 标准注解
		* 标识注解
		* 单个元素注解
	* 功能性接口
* ***数组***
	* 数组类型
	* 数组变量
	* 数组创建
	* 数组访问
	* 数组
	* 数组初始化
	* 数组成员
	* 数组的class
	* 

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
