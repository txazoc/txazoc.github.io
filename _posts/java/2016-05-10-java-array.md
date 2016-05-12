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

数组通过下标进行访问，假设数组长度为n，访问数组中第i个元素(0 <= i < n)，`array[i]`。

```java
public void test(int[] array) {
    int i = array[0];
}
```

```java
0: aload_1       
1: iconst_0      
2: iaload        
3: istore_2      
4: return
```

从编译后的字节码可以看出，数组访问是通过jvm指令实现的，根据数组元素类型的不同，有以下八种访问数组元素的指令：

* `baload`，从数组中加载byte或boolean

格式：baload [..., arrayref(reference), index(int) → ..., value(int)]

* `caload`，从数组中加载char

格式：caload [..., arrayref(reference), index(int) → ..., value(int)]

* `saload`，从数组中加载short

格式：saload [..., arrayref(reference), index(int) → ..., value(int)]

* `iaload`，从数组中加载int

格式：iaload [..., arrayref(reference), index(int) → ..., value(int)]

* `laload`，从数组中加载long

格式：laload [..., arrayref(reference), index(int) → ..., value(long)]

* `faload`，从数组中加载float

格式：faload [..., arrayref(reference), index(int) → ..., value(float)]

* `daload`，从数组中加载double

格式：daload [..., arrayref(reference), index(int) → ..., value(double)]

* `aaload`，从数组中加载对象

格式：aaload [..., arrayref(reference), index(int) → ..., value(reference)]

#### 数组赋值

数组赋值的语法和变量赋值的语法一样，用`=`号。

```java
public void test(int[] array) {
    array[0] = 1;
}
```

```java
0: aload_1       
1: iconst_0  
2: iconst_1  
3: iastore   
4: return
```

* `bastore`，存储boolean或byte到数组

格式：bastore [..., arrayref(reference), index(int), value(int) → ...]

* `castore`，存储char到数组

格式：castore [..., arrayref(reference), index(int), value(int) → ...]

* `sastore`，存储short到数组

格式：sastore [..., arrayref(reference), index(int), value(int) → ...]

* `iastore`，存储int到数组

格式：iastore [..., arrayref(reference), index(int), value(int) → ...]

* `lastore`，存储long到数组

格式：lastore [..., arrayref(reference), index(int), value(long) → ...]

* `fastore`，存储float到数组

格式：fastore [..., arrayref(reference), index(int), value(float) → ...]

* `dastore`，存储double到数组

格式：dastore [..., arrayref(reference), index(int), value(double) → ...]

* `aastore`，存储对象到数组

格式：aastore [..., arrayref(reference), index(int), value(reference) → ...]

#### 数组的类型

Java中，数组也是对象，也有自己的Class。

数组Class由维度和数组元素类型组成，一个维度用一个`[`表示，后面加上数组元素类型。数组的元素类型表示如下：

* boolean，`Z`
* byte，`B`
* char，`C`
* short，`S`
* int，`I`
* long，`J`
* float，`F`
* double，`D`
* class or interface，`L{classname};`，classname为类名的全称

例如：

* int[]的表示为`[I`
* Integer[][]的表示为`[[Ljava.lang.Integer;`
* Object[][][]的表示为`[[[Ljava.lang.Object;`

这下数组的Class类型在JDK中没有提供，是由JVM在运行时动态创建的。

数组的Class是怎么样的呢？

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

上面的结果可以看出，数组直接继承自Object，并实现`java.lang.Cloneable`和`java.io.Serializable`两个接口。

数组继承自Object，所以数组也是一个对象，可以被赋值给Object对象，同时数组也继承了Object的除了`clone()`之外的所有方法。

数组实现了`java.lang.Cloneable`接口，所以数组支持克隆`clone()`。Object的clone()方法是

数组继承自Object，可以被赋值给Object，拥有Object的所有方法。

数组长度在初始化的时候指定，不能被改变。

数组中元素通过数组下标访问，`array[index]`，index为0到n - 1的整数，超出n则抛出ArrayIndexOutOfBoundsException。

数组中元素有相同的类型，数组元素类型，例如，数组元素类型为T，则数组类型为T[]，数组元素类型可以是对象类型或数组类型。

数组Class，数组Class没有属性，只有继承自Object的方法。

数组Class的表示，维度加元素类型，维度用`[`表示，几维就加几个`[`，元素类型表示如下：

array.length，length不是数组的属性，编译时，会转换为相应的jvm指令。

数组Class继承自Object，在数组对象上可以调用Object的所有方法，并实现接口`java.lang.Cloneable`和`java.io.Serializable`，标识数组支持克隆和序列化。

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
