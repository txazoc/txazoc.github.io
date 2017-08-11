---
layout: topic
module: 操作系统
title:  Linux内核-开机启动
tags:   ['linux', '内核']
date:   2017-05-03
---

#### 开机加电

计算机加电，CPU以`实模式`(最大寻址范围1MB)启动，并在加电瞬间强行设置`CS`为0xF000、`IP`为0xFFF0，这样`CS:IP`就指向`0xFFFF0`这个地址，即`BIOS`的入口地址，然后CPU开始执行`BIOS`的第一条指令。

#### BIOS加载中断向量表

`BIOS`程序被固化在主板的`ROM`芯片中。

`BIOS`在内存中建立`中断向量表`和`中断服务程序`:

* 中断向量表: 内存`0x0000 ~ 0x003FF`，256个中断向量，每个中断向量占4字节(CS + IP)，指向一个具体的中断服务程序。
* 中断服务程序: 内存`0x0E05B`，大小8KB。

#### 加载第一部分内核代码

`BIOS`完成硬件自检后，发出`int 0x19`中断，CPU接收中断后，转到`int 0x19`对应的中断服务程序的入口地址处执行，这个中断服务程序的功能就是加载磁盘第一扇区(启动扇区，0盘面0磁道1扇区)中的程序(`bootsect`)到内存`0x07C00`处。

#### 加载第二部分内核代码

* 执行`bootsect`代码，将自身从内存`0x07C00`处复制到内存`0x90000`处
* 转到内存`0x90000`处执行，`CS`变为`0x9000`，调整`DS`、`ES`、`SS`和`CS相同`，`SP`设置为`0xFF00`

| 寄存器 | 值 |
| --- | --- |
| CS | 0x9000 |
| IP | 0x0000 |
| DS | 0x9000 |
| ES | 0x9000 |
| SS | 0x9000 |
| SP | 0xFF00 |