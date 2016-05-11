---
layout:     article
categories: [java]
title:      Java数组
tags:       [java, 数组]
date:       2016-05-10
---

Java中，数组也是对象。

数组也有自己的Class，由JVM运行时动态创建，T[]。

数组继承自Object。

数组通过下标引用，`array[i]`，0～array.length - 1。

#### 数组创建

#### 数组指令

`newarray`，创建一维基本数据类型数组

```java
int[] i = new int[5];
```

```java
0: iconst_5      
1: newarray       int
3: astore_1
```

`anewarray`，创建一维引用类型数组

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
