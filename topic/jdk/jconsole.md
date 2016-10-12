---
layout: topic
module: JDK
title:  jconsole
---

Java Monitoring and Management Console，Java监视和管理控制台

包括以下几部分:

* CPU占用率
* 堆内存使用
* 类加载
* 线程
* VM概要
* MBean

使用方式:

* `jconsole`
* `jconsole pid`
* `jconsole host:port`

```console
-Dcom.sun.management.jmxremote.port=9999
-Dcom.sun.management.jmxremote.authenticate=false
-Dcom.sun.management.jmxremote.ssl=false
```
