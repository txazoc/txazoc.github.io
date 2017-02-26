---
layout: topic
module: Java
title:  Volatile
tags:   [java, 并发]
date:   2017-01-08
---

`volatile`，保证共享变量的可见性

***什么是可见性?***

`可见性`的含义是一个线程修改了一个共享变量，其它线程能立马读到该共享变量最新修改的值

***可见性的问题是怎么产生的呢?***
