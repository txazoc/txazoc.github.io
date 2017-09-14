---
layout: map
title:  RocketMQ
---

[http://www.iocoder.cn/?vip](http://www.iocoder.cn/?vip)

#### RocketMQ特性

* 高性能
* 低延迟
* 亿级消息堆积

#### Namesrv

#### Broker

#### Producer

#### Consumer

#### 消息通信模式

* SYNC: 同步
* ASYNC: 异步
* ONEWAY: 单向

#### 消息优先级

* 不支持
* 不同的topic

#### 消息类型

* 普通消息
* 顺序消息
    * 全局顺序
    * 分区顺序
* 定时消息
* 延时消息
* 事务消息

#### 消息查询

* 按topic
* 按msgId
* 按key

#### 广播消息

#### 批量消息

#### 消息过滤

#### Push & Pull

#### 可用性

* 单master模式
* 多master模式
* 多master多slave异步复制模式
    * master -&gt; 异步复制 -&gt; slave
    * 优点
        * 高可用性
    * 缺点
        * 消息丢失
* 多master多slave同步双写模式
    * master -&gt; 同步双写 -&gt; slave
    * 优点
        * 消息丢失
    * 缺点
        * 牺牲高可用性
