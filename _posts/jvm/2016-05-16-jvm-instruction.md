---
layout:     article
categories: [jvm]
title:      Java虚拟机指令
tags:       [jvm, 指令]
date:       2016-05-16
---

#### 虚拟机指令

虚拟机指令格式：

```java
<opcode> [<operand1> [<operand2> ...]]
```

javap的格式：

```java
<index> <opcode> [<operand1> [<operand2> ...]] [<comment>]
```

* index，字节码的偏移位置
* opcode
* operand&lt;n&gt;，指令的操作数
* comment，注释

#### 加载指令

本地变量表压入操作数栈。

* `iload`，本地变量表第index个变量(int)压入操作数栈

```java
iload <index>(byte) [... → ..., value(int)]
```

* iload_&lt;n&gt;，`iload_0`、`iload_1`、`iload_2`、`iload_3`

```java
iload_<n> [... → ..., value(int)]
```

* `lload`，本地变量表第index个变量(long)压入操作数栈

```java
lload <index>(byte) [... → ..., value(long)]
```

* lload_&lt;n&gt;，`lload_0`、`lload_1`、`lload_2`、`lload_3`

```java
lload_<n> [... → ..., value(long)]
```

* `float`，本地变量表第index个变量(float)压入操作数栈

```java
float <index>(byte) [... → ..., value(float)]
```

* float_&lt;n&gt;，`fload_0`、`fload_1`、`fload_2`、`fload_3`

```java
float_<n> [... → ..., value(float)]
```

* `dload`，本地变量表第index个变量(double)压入操作数栈

```java
dload <index>(byte) [... → ..., value(double)]
```

* dload_&lt;n&gt;，`dload_0`、`dload_1`、`dload_2`、`dload_3`

```java
dload_<n> [... → ..., value(double)]
```

* `aload`，本地变量表第index个变量(reference)压入操作数栈

```java
aload <index>(byte) [... → ..., objectref(reference)]
```

* aload_&lt;n&gt;，`aload_0`、`aload_1`、`aload_2`、`aload_3`

```java
aload_<n> [... → ..., objectref(reference)]
```

常量压入操作数栈。

* iconst_&lt;i&gt;，`iconst_m1`、`iconst_0`、`iconst_1`、`iconst_2`、`iconst_3`、`iconst_4`、`iconst_5`
* bipush
* lconst_&lt;n&gt;
* fconst_&lt;n&gt;
* dconst_&lt;n&gt;

#### 存储指令

* istore
* istore_&lt;n&gt;
* lstore
* lstore_&lt;n&gt;
* fstore
* fstore_&lt;n&gt;
* dstore
* dstore_&lt;n&gt;
* astore
* astore_&lt;n&gt;
