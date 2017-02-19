---
layout: topic
module: Java
title:  volatile
date:   2017-02-15
---

volatile，保证共享变量的可见性，即一个线程对一个共享变量的修改对另一个线程是可见的

#### volatile原理

* 缓存行数据写回主存
* 其它处理器的缓存行无效
