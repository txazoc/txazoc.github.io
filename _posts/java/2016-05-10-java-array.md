---
layout:     article
categories: [java]
title:      Java数组
tags:       [java, 数组]
date:       2016-05-10
---

> 数组，相同数据类型的元素的顺序集合。

#### 数组声明

Java中数组声明有下面几种方式，以二维数组的声明为例。

* `int[][] array`
* `int[] array[]`
* `int array[][]`

数组声明只是创建一个数组类型的引用变量，并未创建数组对象。

#### 数组创建和初始化

下面创建一个int的二维数组，有下面几种方式。

* <code>new int[2][2]</code>，创建一个二维数组，第一维和第二维的大小都为2
* <code>new int[2][]</code>，创建一个二维数组，第一维的大小为2，第二维的大小未指定，可以运行时动态设置
* <code>new int[][]&#123;{1, 2}, {3, 4}&#125;</code>，创建一个二维数组并初始化
* <code>&#123;{1, 2}, {3, 4}&#125;</code>，创建一个二维数组并初始化

#### 数组访问

Java中，数组也是对象。

数组也有自己的Class，由JVM运行时动态创建，T[]。

数组继承自Object，可以被赋值给Object，拥有Object的所有方法。

数组长度在初始化的时候指定，不能被改变。

数组中元素通过数组下标访问，`array[index]`，index为0到n - 1的整数，超出n则抛出ArrayIndexOutOfBoundsException。

数组中元素有相同的类型，数组元素类型，例如，数组元素类型为T，则数组类型为T[]，数组元素类型可以是对象类型或数组类型。

数组Class，数组Class没有属性，只有继承自Object的方法。

数组Class的表示，维度加元素类型，维度用`[`表示，几维就加几个`[`，元素类型表示如下：

* boolean，Z
* byte，B
* char，C
* short，S
* int，I
* long，J
* float，F
* double，D
* class or interface，L{classname};

例如，int[]的表示为`[I`，Integer[][][]的表示为`[[[Ljava.lang.Integer;`。

array.length，length不是数组的属性，编译时，会转换为相应的jvm指令。

数组Class继承自Object，在数组对象上可以调用Object的所有方法，并实现接口`java.lang.Cloneable`和`java.io.Serializable`，标识数组支持克隆和序列化。

```java
System.out.println(int[].class.getSuperclass());
for (Class c : int[].class.getInterfaces()) {
    System.out.println(c);
}
```

```console
class java.lang.Object
interface java.lang.Cloneable
interface java.io.Serializable
```

#### 数组创建

#### 数组指令

#### 数组遍历

#### 数组在内存中的结构

#### 数组方法

* clone，浅克隆，唯一不从Object继承的方法

for实现原理

`newarray`，创建一维基本数据类型数组。

```java
int[] i = new int[5];
```

```java
0: iconst_5      
1: newarray       int
3: astore_1
```

`anewarray`，创建一维引用类型数组，其中，引用类型可以为对象类型或数组类型。

```java
Integer[] i = new Integer[5];
```

```java
0: iconst_5      
1: anewarray     #2                  // class java/lang/Integer
4: astore_2
```

```java

```

`multianewarray`，创建多维数组(包括基本数据类型和引用数据类型)

```java
int[][] i = new int[2][];
```
