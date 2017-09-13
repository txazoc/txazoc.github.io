---
layout: map
title:  RocketMQ
---

#### 消息通信模式

* SYNC: 同步
* ASYNC: 异步
* ONEWAY: 单向

#### 消息优先级

* 不支持
* 不同的topic

#### 有序消息

* 全局有序消息
* 局部有序消息

#### 广播消息

#### 延时消息

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
