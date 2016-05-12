---
layout:     article
categories: [java]
title:      Java数组
tags:       [java, 数组]
date:       2016-05-10
---

> 数组，相同数据类型的元素的顺序集合。

#### 数组声明

Java中数组声明有以下几种方式，以二维数组的声明为例：

* `int[][] array`
* `int[] array[]`
* `int array[][]`

数组声明只是了创建一个数组类型的引用变量，并未创建数组对象或分配数组的内存空间。

#### 数组创建和初始化

下面创建一个int的二维数组，有以下几种方式：

* <code>new int[2][2]</code>，创建一个二维数组，第一维和第二维的大小都为2
* <code>new int[2][]</code>，创建一个二维数组，第一维的大小为2，第二维的大小未指定，可以在运行时动态为每一个第二维数组指定长度
* <code>new int[][]&#123;{1, 2}, {3, 4}&#125;</code>，创建一个二维数组并初始化
* <code>&#123;{1, 2}, {3, 4}&#125;</code>，创建一个二维数组并初始化

#### 数组访问

数组通过下标进行访问，假设数组长度为n，访问数组中第i个元素(0 <= i < n)，`array[i]`，如果i小于0或大于n - 1，则抛出`java.lang.ArrayIndexOutOfBoundsException`异常。

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

数组实现了`java.lang.Cloneable`接口，所以数组支持克隆`clone()`。Object的clone()方法是protected的，所以数组重写了clone()方法。

数组实现了`java.io.Serializable`接口，所以数组支持序列化。

```java
System.out.println(int[].class.getDeclaredFields().length);
System.out.println(int[].class.getDeclaredMethods().length);
System.out.println(int[].class.getDeclaredConstructors().length);
```

```console
0
0
0
```

从上面的执行结果中可以看出，数组Class没有声明任何的属性和方法，所以数组Class大致是下面这样的。

```java
class Array<T> extends Object implements Cloneable, java.io.Serializable {

    public T[] clone() {
        try {
            return (T[]) super.clone();
        } catch (CloneNotSupportedException e) {
            throw new InternalError(e.getMessage());
        }
    }

}
```

#### 数组的长度

再来说下数组的长度，数组的长度在初始化的时候指定，之后不能被改变。通过`array.length`的方式获取数组的长度，表面上看，length像是数组的一个public类型的属性，但上面可以看到，数组没有声明任何的属性，来看下编译后的字节码。

```java
int[] array = new int[2];
int i = array.length;
```

```java
0: iconst_2      
1: newarray       int
3: astore_1
4: aload_1
5: arraylength
6: istore_2
```

可以看出，通过`arraylength`指令获取数组的长度。

格式：arraylength [..., arrayref(reference) → ..., length(int)]

JVM的实现将数组的长度放在数组对象头部，所以通过数组对象的引用地址加上一定的地址偏移就可以拿到数组的长度，具体就是由`arraylength`实现的。

#### 数组遍历

使用for循环遍历数组：

```java
int[] array = new int[2];
for (int i = 0; i < array.length; i++) {
    System.out.println(array[i]);
}
```

使用增强for循环遍历数组：

```java
int[] array = new int[2];
for (int i : array) {
    System.out.println(i);
}
```

增强for循环是一种编译语法糖，实际生成的字节码和下面的for循环生成的字节码相同。

```java
int[] array = new int[2];
int[] arr$ = array;
int len$ = arr$.length;
for (int i$ = 0, i; i$ < len$; i$++) {
    i = arr$[i$];
    System.out.println(i);
}
```

#### 数组方法clone()

数组的克隆是浅克隆，只会克隆第一维数组，从下面的代码可以得出结论。

```java
int[][] array = new int[][]{{1}};
int[][] clone = array.clone();
clone[0][0] = 5;
Assert.assertNotSame(array, clone); // true
Assert.assertSame(5, array[0][0]); // true
```

基于`System.arraycopy()`的数组复制也是浅克隆。对于一维基本数据类型的数组，浅克隆没有问题，但对于多维或对象类型的数组，浅克隆会使克隆数组和原始数组共享数组中对象或子数组的引用，引发数据一致性问题。

#### 数组在内存中的结构

数组在内存中的结构：

* 对象头
* 数组Class的引用
* 数组长度
* 数组元素

#### 数组创建的jvm指令

`newarray`，创建一维基本数据类型的数组。

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
4: astore_1
```

```java
int[][] i = new int[2][];
```

```java
0: iconst_2      
1: anewarray     #4                  // class "[I"
4: astore_1
```

`multianewarray`，创建多维数组(包括基本数据类型和引用数据类型)

```java
int[][] i = new int[2][2];
```

```java
0: iconst_2      
1: iconst_2      
2: multianewarray #7,  2             // class "[[I"
6: astore_1
```
