---
layout: topic
module: Java
title:  Yield
date:   2017-02-15
---

`yield()`，当前线程放弃CPU的使用权

一般情况下，`yield()`会导致线程从运行状态切换到可运行状态，但线程调度器也可能会忽略`yield()`，导致实际没有效果
