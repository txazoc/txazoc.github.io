---
layout: arch
title:  18-单服务器高性能模式：PPC与TPC
---

* I/O模型: 阻塞、非阻塞、同步、异步
* 进程模型: 单进程、多进程、多线程

#### PPC

PPC，Process Per Connection，一个连接创建一个进程

prefork，pre-fork，提前创建进程

#### TPC

TPC，Thread Per Connection，一个连接创建一个线程

prethread，pre-thread，提前创建线程

#### 适用场景

PPC和TPC都不适合高并发的场景

* 常量连接常量请求
* 常量连接海量请求: 数据库、Redis、Kafka
