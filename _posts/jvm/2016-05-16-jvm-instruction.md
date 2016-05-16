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

#### 常量指令

* `iconst_m1`，int -1进栈
* `iconst_0`，int 0进栈
* `iconst_1`，int 1进栈
* `iconst_2`，int 2进栈
* `iconst_3`，int 3进栈
* `iconst_4`，int 4进栈
* `iconst_5`，int 5进栈
* `lconst_0`，long 0进栈
* `lconst_1`，long 1进栈
* `fconst_0`，float 0进栈
* `fconst_1`，float 1进栈
* `fconst_2`，float 2进栈
* `dconst_0`，double 0进栈
* `dconst_1`，double 1进栈
