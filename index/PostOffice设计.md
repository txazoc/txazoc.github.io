---
layout: index
title:  PostOffice设计
---

#### Kafka消息接收

* 多KafkaListener

#### 消息并发消费

* Netty
* 延迟消息
* httpclient

#### Redis延迟消息队列

* put: zadd + set
* poll: luna(zrangebyscore + zadd + zrem)
* kafka produce
* kafka consume

#### Netty多客户端维护

* Eureka subscribe
* Map<ip:port, ChannelFuture>

#### 消息类型

* 及时消息
    * 成功
    * 失败 -&gt; 重试消息
* 延迟消息
    * Redis延迟消息队列
* 重复消息
    * Redis延迟消息队列 + repeat + peroid
* 重试消息
    * Redis延迟消息队列
