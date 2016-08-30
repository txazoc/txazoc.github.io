---
layout:     article
published:  false
categories: [分布式]
title:      任务调度
tags:       [quartz, spring]
date:       2016-03-24
---

在开发中常见的任务调度有脚本调度(Shell、Python、Ruby)、应用程序调度(Java)。

脚本调度，一般依赖于Linux服务器，使用Linux的crontab。

应用程序调度，这种调度部署在特定的应用里面，比如Java。Java里面有四种方式可以实现任务调度：

* JDK的Timer
* JDK并发包的ScheduledExecutorService
* 开源框架Quartz
* 开源框架Jcrontab
* Spring

##### 1. JDK的Timer

##### 2. JDK并发包的ScheduledExecutorService

##### 3. 开源框架Quartz

##### 4. 开源框架Jcrontab

##### 5. Spring

脚本调度和应用程序调度都存在单点故障问题，应用程序调度如果部署在多台服务器上，还存在如何控制单实例执行的问题，这里提供一种思路，通过Memcached的add()操作实现，第一个add()操作成功节点获得执行权。

### 分布式任务调度平台

前面介绍的调度适合小公司的业务需求，如果是大公司的话，这种显然不合适。

分布式任务调度平台提供的功能：

* 支持多种任务类型: 脚本(Shell、Python、Ruby)、Java
* 提供灵活的任务注册机制。针对脚本，提供上传的功能就ok了。但如果是Java任务的话，要分为几种类型，第一种就是简单的Java类，第二种是依附于应用程序的Java任务，可以提供注解或配置文件的方式进行注册，第三种是独立的jar包，也要提供上传的机制。
* 中心化，统一的注册和调度中心，使用ZooKeeper避免单点故障
