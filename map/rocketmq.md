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

#### RouteInfoManager

* topicQueueTable: topic - 队列集合
    * k: topic
    * v: QueueData[]
        * brokerName: broker-1
        * readQueueNums: 4
        * writeQueueNums: 4
* brokerAddrTable: brokerName - master/slave
    * k: brokerName: broker-1
    * v: BrokerData
        * cluster: DefaultCluster
        * brokerName: broker-1
        * brokerAddrs
            * k: brokerId: 0
            * v: brokerAddress: 192.168.1.106:10931
* clusterAddrTable: 集群 - brokerName集合
    * k: clusterName: DefaultCluster
    * v: Set<String>
        * brokerName: broker-1
        * brokerName: broker-2
* brokerLiveTable
    * k: brokerAddr: 192.168.1.106:10931
    * v: BrokerLiveInfo
        * lastUpdateTimestamp: 1505917226150
        * Channel
        * haServerAddr: 192.168.1.106:10932

#### Send Message

#### Pull Message
