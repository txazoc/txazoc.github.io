---
layout:     article
categories: [java]
title:      Java知识体系
tags:       [java]
date:       2016-09-09
---

罗列一下Java的知识体系，慢慢消化。

#### Java Document

* [Java Conceptual Diagram](http://docs.oracle.com/javase/8/docs/technotes/guides/desc_jdk_structure.html)
* [The Java Tutorials](http://docs.oracle.com/javase/tutorial/)
* [Java SE Specifications](http://docs.oracle.com/javase/specs/index.html)
* [Troubleshooting Guide](http://docs.oracle.com/javase/8/docs/technotes/guides/troubleshoot/index.html)
* [Java SE Document](http://docs.oracle.com/javase/8/)
* [Java SE White Papers](http://www.oracle.com/technetwork/java/javase/documentation/whitepapers-jsp-139357.html)

![Java Conceptual Diagram](/images/java/java-conceptual-diagram.png)

#### Java增强功能

* 1.4
    * 断言
* 1.5
    * 泛型
    * 增强for循环
    * 自动装箱拆箱
    * 枚举
    * 变长参数
    * 静态导入
    * 注解
* 1.7
    * 二进制字面值
    * switch字符串
    * try-with-resources

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
	* 数组类型: [[I
	* 数组变量: int[] ai
	* 数组创建
	* 数组访问: a[i]
	* 数组存储异常
	* 数组初始化: {}
	* 数组成员
		* length
		* 继承自Object的成员
		* T[] clone()
	* 数组的class
	* char数组不是String
* ***异常***
	* 异常分类
		* Throwable
			* Exception
				* RuntimeException
				* 非运行时异常
			* Error
		* 受检异常
		* 非受检异常: Error + RuntimeException
	* 异常原因
		* throw
		* JVM中断执行的同步异常
		* 异步异常: OutOfMemoryError
	* 异常捕获
		* try-catch-finally
* ***执行***
	* JVM启动
		* 加载主类
		* 链接主类
		* 初始化主类
		* 调用主类的main方法
	* 加载类和接口
		* 查找二进制的类文件格式: ClassLoader.loadClass()
		* 构造类的Class对象: ClassLoader.defineClass()
	* 链接类和接口
		* 验证: 类或接口的二进制表示是否正确
		* 准备: static属性(类变量和常量)的内存分配和默认值
		* 解析: 常量池中的符号引用替换为直接引用
			* 类和接口的符号引用
			* 属性的符号引用
			* 方法的的符号引用
			* 构造函数的符号引用
	* 类和接口的初始化
		* 何时初始化
			* 创建类实例
			* static方法被调用
			* static属性被赋值
			* 非常量的static属性访问
			* 子类初始化，父类和接口未初始化
		* 初始化过程
			* 获取锁
			* 初始化常量
			* 父类和接口初始化
			* 类变量和静态代码块初始化(按声明顺序)
			* 释放锁
	* 创建类实例
		* 类实例化
			* 字符串字面值
			* 基本数据类型装箱
			* 字符串+操作
		* 类实例化过程
			* 分配内存空间
			* 实例变量初始化默认值
			* 调用构造函数
			* 构造函数参数赋值给参数变量
			* 父类实例化
			* 实例变量赋值
			* 执行构造函数
	* 卸载类和接口
	* 程序退出
* ***语句***
	* 执行中断: break、continue、return、throw
	* 语句块
	* 空语句: ;
	* 标记
	* 表达式
		* 赋值表达式
		* 自增自减表达式
		* 方法调用
		* new
	* if: if ... else if ... else
	* assert
		* assert expression;
		* assert expression : expression;
	* switch
	* while
	* do ... while
	* for
		* for(;;;)
		* for(:)
	* break
	* continue
	* return
	* throw
	* synchronized: synchronized (expression) {}
	* try
		* try-catch-finally
		* try-with-resources
* ***表达式***
	* 类实例创建表达式: new
	* 数组创建和访问表达式
		* new [] {}
		* array[i]
	* 属性访问表达式: [this | super | identifier | ClassName].identifier
	* 方法调用表达式: [this | super | identifier | ClassName].identifier(args...)
	* 转型表达式: (Type)
	* 自增自减表达式: ++i、--i、i++、i--
	* 四则运算表达式: + - \* / %
	* 位运算表达式: & | ^ ~
	* 移位运算表达式: << >> >>>
	* 关系运算表达式: == != > >= < <= instanceof
	* 逻辑运算表达式: && || !
	* 条件表达式: ? :
	* 赋值运算表达式: = += -= \*= /= %= &= |= ^= <<= >>= >>>=
	* Lambda表达式
* ***线程和锁***
	* synchronized: monitor
		* synchronized方法
		* synchronized代码块
	* wait和notify
	* interrupt
	* sleep
	* yield
	* join
	* 内存模型
	* final的语言

#### Java虚拟机规范
* [***Java Virtual Machine Specification***](https://docs.oracle.com/javase/specs/jvms/se8/html/index.html)
* JVM结构
	* 类文件格式: 类和接口的二进制表示
		* jdk版本
		* 类和接口
			* 类、父类、接口
			* 属性
			* 方法、构造函数
				* 字节码
			* 引用: 属性、方法、构造函数
	* 数据类型
		* 基本数据类型
		* 引用类型
		* 数据类型使用
			* 局部变量表
			* 方法传参
			* 方法返回值
			* 操作数栈
			* 操作基本数据类型值和引用类型值
	* 基本数据类型和值
		* 整数类型
		* 浮点类型
		* 布尔类型
	* 引用类型和值
		* 类型: 类、接口、数组
		* 值: 引用地址
	* 运行时数据区
		* 程序计数器: 下一条JVM指令的地址
			* 分支
			* 循环
			* 跳转
			* 异常处理
			* 线程恢复
		* Java虚拟机栈
			* 栈帧
		* 堆
			* 对象内存分配
			* 方法区
			* 垃圾收集器
		* 方法区
			* 类结构
				* 运行时常量池
				* 属性
				* 方法
			* 代码
				* 方法
				* 构造函数
				* 特殊方法: <init\>、<cinit\>
		* 运行时常量池: 符号表
			* 类和接口的Class文件常量池的运行时表示
			* 组成
				* 数字(整数和浮点数)字面值
				* 字符串
				* 属性、方法引用
		* 本地方法栈
	* 栈帧
		* 作用
			* 存储数据和部分结果
			* 执行动态链接
			* 方法返回值
			* 处理异常
		* 局部变量表: 大小编译时确定, 索引访问
			* 方法参数
			* 局部变量
			* LocalVariableTable Attribute
		* 操作数栈: 最大深度编译时确定
			* 加载常量、局部变量或属性的值到操作数栈
			* 部分JVM指令从操作数栈获取操作数, 操作并返回结果到操作数栈
			* 准备方法参数、接受方法返回值
		* 动态链接
			* 当前方法对应的类的运行时常量池的引用
			* 方法的符号引用转换为直接引用
			* 属性的符号引用转换为内存地址偏移量
		* 方法调用完成
			* 恢复调用栈帧, 包括局部变量表和操作数栈
			* 方法返回值压入调用栈帧的操作数栈
			* 程序计数器增加
		* 方法调用中断
			* 产生异常, 未被捕获, 方法执行中断, 无返回值
	* 浮点运算
	* 特殊方法: 编译器生成
		* 实例初始化方法<init\>
			* 构造函数
			* 对象实例化时调用: new指令
			* 方法code
				* 调用父类的<init\>方法
				* 执行构造函数
		* 类或接口实例化方法<cinit\>
			* 类初始化时由JVM调用
			* 方法code
				* 静态变量(非常量)初始化、静态代码块(按声明顺序)
	* 异常
		* 异常原因
			* 执行athrow指令
		* 异常处理程序
			* 异常产生, 逐一匹配异常处理程序, 按异常处理表的顺序
			* 异常匹配, 指令偏移和异常类型匹配, 跳转到异常处理code
			* 异常不匹配
				* 方法执行中断, 当前栈帧出栈
				* 恢复调用栈帧
				* rethrow异常
	* 指令集
		* JVM解释器执行过程
			* 自动计算pc
			* 获取pc指向的指令opcode
			* 指令有操作数, 获取操作数
			* 执行指令opcode
		* 指令类型
			* boolean、byte、char、short -> int
		* 加载和存储指令
			* 局部变量表 -> 操作数栈: iload、iload_<n\> ...
			* 操作数栈 -> 局部变量表: istore、istore_<n\> ...
			* 常量 -> 操作数栈: bipush、iconst_<i\> ...
			* wide
		* 算术指令
			* 整数类型值和浮点类型值
			* 加、减、乘、除、余
			* 否定
			* 移位
			* 位运算
			* 局部变量自增
			* 比较
		* 类型转换指令
		* 对象创建和操作指令
			* 创建类实例: new
			* 创建数组: newarray、anewarray、multianewarray
			* 访问类的属性: getstatic、putstatic、getfield、putfield
			* 访问数组元素: baload、bastore ...
			* 数组长度: arraylength
			* 类型检查: instanceof、checkcast
		* 操作数堆栈管理指令
			* 出栈: pop、pop2
			* 复制: dup、dup2、dup_x1、dup2_x1、dup_x2、dup2_x2
			* 交换: swap
		* 控制转移指令
			* if
			* switch
			* goto
		* 方法调用和返回指令
			* invokevirtual: 类实例方法
			* invokeinterface: 接口方法
			* invokespecial: <init\>、private方法、父类方法
			* invokestatic: 类静态方法
			* invokedynamic
			* return
		* 抛出异常指令
			* athrow
		* 同步指令
			*  monitorenter
			*  monitorexit
	* 类库
* JVM编译
	* <index\> <opcode\> [ <operand1\> [ <operand2\>... ]] [<comment\>]
	* 常量和局部变量
	* 运算
	* 访问运行时常量池
	* 控制结构
		* for、while
	* 接收参数
	* 调用方法
	* 类实例
	* 数组
	* switch
	* 操作数栈
	* 异常抛出和处理
	* 同步
* 类文件格式
	* 类文件结构
		* magic: 魔数(0xCAFEBABE)
		* minor_version: 次版本号
		* major_version: 主版本号
		* constant_pool_count: 常量池大小
		* constant_pool: 常量池(1 ~ constant_pool_count - 1)
			* 基本数据类型常量
			* 字符串常量
			* 类和接口名
			* 属性、方法名和类型
		* access_flags: 访问标识
		* this_class: 类或接口
		* super_class: 父类
			* CONSTANT_Class_info
		* interfaces_count: 接口数量
		* interfaces: 接口
		* fields_count: 字段数量
		* fields: 字段
			* field_info
		* methods_count: 方法数量
		* methods: 方法
			* method_info
		* attributes_count: 属性数量
		* attributes: 属性
			* attribute_info
	* 描述符
		* 属性描述符
			* B C D F I J(long) S Z(boolean)
			* L<ClassName\>;
			* [<ComponentType\>
		* 方法描述符
			* eg: (IDLjava/lang/Thread;)Ljava/lang/Object;
	* 常量池
		* CONSTANT_Class_info Structure: 类或接口
		* CONSTANT_Fieldref_info: 属性的符号引用
		* CONSTANT_Methodref_info: 方法的符号引用
		* CONSTANT_InterfaceMethodref_info: 接口方法的符号引用
		* CONSTANT_String_info: String字符串
		* CONSTANT_Integer_info: int常量
		* CONSTANT_Float_info: float常量
		* CONSTANT_Long_info: long常量
		* CONSTANT_Double_info: double常量
		* CONSTANT_NameAndType_info
		* CONSTANT_Utf8_info: String常量
		* CONSTANT_MethodHandle_info
		* CONSTANT_MethodType_info
		* CONSTANT_InvokeDynamic_info
* 加载、链接和初始化
* JVM指令集

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
