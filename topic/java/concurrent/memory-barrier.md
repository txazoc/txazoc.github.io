---
layout: topic
module: Java
title:  内存屏障
tags:   [java, 并发]
date:   2017-08-25
---

#### __asm__ volatile

格式:

```c
__asm__ __volatile__ ("Instruction List" : Output : Input : Clobber/Modify)
```

说明:

* __asm__: 声明内嵌汇编表达式
* __volatile__: 可选，禁止对内嵌汇编表达式做编译优化
* Instruction List: 汇编指令序列
* Output: 输出
* Input: 输入
* Clobber/Modify: 通知gcc当前内嵌汇编指令可能会对某些寄存器或内存进行修改，希望gcc在编译时考虑到这一点
    * "memory": 

#### 编译器级内存屏障

`__asm__ __volatile__ ("" : : : "memory")`
