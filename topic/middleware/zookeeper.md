---
layout: topic
module: 中间件
title:  Zookeeper
date:   2017-02-23
---

#### 目录

* [Zookeeper简介](#introduction)
* [Zookeeper使用](#use)
* [Zookeeper数据模型](#data-model)

#### <a id="introduction">Zookeeper简介</a>

Zookeeper，是一个高性能的分布式协调服务

![zkservice](/images/topic/middleware/zookeeper/zkservice.jpg =480x)

#### <a id="use">Zookeeper使用</a>

***单机模式***

conf/zoo.cfg

```config
tickTime=2000
dataDir=/var/lib/zookeeper
clientPort=2181
```

* tickTime: 心跳时间、最小会话超时时间(2 * tickTime)
* dataDir: 数据目录
* clientPort: 监听客户端连接的端口号

启动Zookeeper: `bin/zkServer.sh start`

***集群模式***

连接到Zookeeper: `bin/zkCli.sh -server 127.0.0.1:2181`

#### <a id="data-model">Zookeeper数据模型</a>

![Zookeeper命名空间](/images/topic/middleware/zookeeper/zknamespace.jpg =360x)

***节点***

每个路径称为一个节点(`znode`)，节点有自己的数据结构，节点分为以下三类:

* 持久节点: 节点被创建后就一直存在，直到主动调用删除操作来删除节点
* 临时节点: 节点的生命周期同Session相关联，没有子节点
* 序列节点: 

***Zookeeper统计结构***
