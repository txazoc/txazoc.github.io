---
layout: home
title:  JVM编译优化
date:   2020-09-22
tags:   [jvm]
---

#### 逃逸分析

开启逃逸分析，`-XX:+DoEscapeAnalysis`

* 栈上分配
* 同步消除: `-XX:+EliminateLocks`
* 标量替换: `-XX:+EliminateAllocations`

#### 方法内联

> 方法内联，为提高方法执行效率，编译器将被调用方法直接展开，避免压栈和出栈

支持内联的方法:

* private方法
* final方法
