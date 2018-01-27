---
layout: map
title:  Zookeeper
---

#### Zookeeper节点

* Leader
* Observer
* Follow

#### Zookeeper选举

#### Zookeeper数据结构

* 文件系统
* 节点
    * 持久节点
    * 临时节点
    * 序列节点
* watch
    * create
    * delete
    * update
    * childrenChange

#### Zookeeper应用

* 命名服务: 文件系统
* 配置管理: 持久节点 + watch
* 集群管理: 临时节点 + watch
* 分布式锁: 临时序列节点 + watch
* 队列: 持久序列节点 + watch
