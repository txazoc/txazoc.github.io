---
layout: topic
module: 操作系统
title:  CPU周期
tags:   ['周期']
date:   2017-04-28
---

* 时钟周期: 也称为震荡周期，是计算机中最基本的、最小的时间单位，在一个时钟周期，CPU只完成一个最基本的操作
* 机器周期: 也称为CPU周期，把一条指令的执行过程划分为若干个阶段(取指令、存储器读、存储器写等)，每个阶段完成一个基本操作，这个基本操作的时间就是机器周期
* 指令周期: CPU执行一条指令所需的时间，由若干个机器周期组成，包括取指令、指令译码、指令执行等的全部时间
* 总线周期: CPU通过总线完成一次内存读写或I/O端口读写操作的时间

`机器周期 = n * 时钟周期`

`指令周期 = n * 机器周期`