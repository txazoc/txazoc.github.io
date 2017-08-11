---
layout: topic
module: 操作系统
title:  CPU
tags:   ['cpu']
date:   2017-05-02
---

#### 冯·诺依曼体系结构

现代计算机都是基于`冯·诺依曼体系结构`，冯·诺依曼体系结构的特点如下:

* 计算机处理的指令和数据一律用二进制表示
* 采用存储程序方式，指令和数据不加区别混合存储在同一个存储器中
* 存储器是线性编址的一纬结构
* 指令由操作码和操作数组成
* 顺序执行程序中的指令
* 计算机硬件由运算器、控制器、存储器、输入设备和输出设备五大部分组成

#### CPU指令

CPU执行的是指令，每一款CPU都有自己的指令集

指令格式: `操作码 + 操作数`，例如`0xB80100`

#### 汇编指令

CPU指令对程序员不友好，于是就出现了汇编指令，例如`mox ax,1`

汇编指令通过汇编器转换为机器指令