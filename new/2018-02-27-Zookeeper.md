---
layout: new
title:  Zookeeper
---

Zookeeper，是一个高性能的分布式协调服务

#### Zookeeper角色

* Leader
* Follow
* Observer: 不参入投票

#### Zookeeper节点

* `持久节点`(PERSISTENT): 节点被创建后就一直存在，直到主动调用删除操作来删除节点
* `临时节点`(EPHEMERAL): 节点的生命周期同Session相关联，没有子节点
* `顺序节点`(SEQUENTIAL)
    * `持久顺序节点`(PERSISTENT_SEQUENTIAL)
    * `临时顺序节点`(EPHEMERAL_SEQUENTIAL)

#### Zookeeper选举

`epoch` &gt; `xzid` &gt; `sid`

#### Zookeeper应用

* 命名服务: 文件系统
* 配置管理: 持久节点 + watch
* 集群管理: 临时节点 + watch
* 分布式锁: 临时顺序节点 + watch
* 分布式队列: 持久顺序节点 + watch
