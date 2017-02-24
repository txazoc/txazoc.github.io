---
layout: topic
module: 中间件
title:  Zookeeper
date:   2017-02-23
---

#### 目录

* [Zookeeper简介](#introduction)
* [Zookeeper使用](#use)
* [Zookeeper角色](#role)
* [Zookeeper数据模型](#data-model)
* [Zookeeper API](#api)
* [Zookeeper原子广播](#atomic-broadcast)

#### <a id="introduction">Zookeeper简介</a>

Zookeeper，是一个高性能的分布式协调服务

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

#### <a id="role">Zookeeper角色</a>

Zookeeper有三种角色:

* Leader
* Follower
* Observer

![zkservice](/images/topic/middleware/zookeeper/zkservice.jpg =480x)

***客户端***

客户端通过TCP连接到一个Zookeeper节点，`发送读/写请求`、`接收响应`、`接收监听事件`、`发送心跳`，如果当前连接断开，客户端会连接到一个新的Zookeeper节点

***Leader选举***

#### <a id="data-model">Zookeeper数据模型</a>

![Zookeeper命名空间](/images/topic/middleware/zookeeper/zknamespace.jpg =360x)

***节点***

Zookeeper的数据模型是一种树型结构，类似Linux的文件系统结构，每条路径称为一个节点`znode`，节点有自己的数据结构，也可以有子节点，节点分为以下三类:

* `持久节点`(PERSISTENT): 节点被创建后就一直存在，直到主动调用删除操作来删除节点
* `临时节点`(EPHEMERAL): 节点的生命周期同Session相关联，没有子节点
* `序列节点`(SEQUENTIAL)
    * `持久序列节点`(PERSISTENT_SEQUENTIAL)
    * `临时序列节点`(EPHEMERAL_SEQUENTIAL)

***节点统计结构***

***节点监听***

#### <a id="api">Zookeeper API</a>

* create
* delete
* exists
* getData
* setData
* getChildren
* sync

#### <a id="atomic-broadcast">Zookeeper原子广播</a>

Zookeeper原子广播(Zookeeper Atomic Broadcast)，简称ZAB

在ZAB协议中，每个节点属于以下三种之一的状态:

* Looking: 节点刚启动、Leader崩溃后重启
* Following: Follower节点的状态
* Leading: Leader节点的状态
