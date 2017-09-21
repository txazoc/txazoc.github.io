---
layout: map
title:  RocketMQ
---

[http://www.iocoder.cn/?vip](http://www.iocoder.cn/?vip)
[blog.csdn.net/binzhaomobile/article/details/73743361](blog.csdn.net/binzhaomobile/article/details/73743361)

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

#### Namesrv - RouteInfoManager

* topicQueueTable: topic - broker - queue
    * k: topic
    * v: QueueData[]
        * brokerName: broker-1
        * readQueueNums: 读队列数
        * writeQueueNums: 写队列数
        * perm: 读写权限
        * topicSynFlag: 同步/异步复制标记
* brokerAddrTable: broker - master/slave
    * k: brokerName: broker-1
    * v: BrokerData
        * cluster: DefaultCluster
        * brokerName: broker-1
        * brokerAddrs
            * k: brokerId: 0
            * v: brokerAddress: 192.168.1.106:10931
* clusterAddrTable: cluster - broker
    * k: clusterName: DefaultCluster
    * v: Set<String>
        * brokerName: broker-1
        * brokerName: broker-2
* brokerLiveTable
    * k: brokerAddr: 192.168.1.106:10931
    * v: BrokerLiveInfo
        * lastUpdateTimestamp: 最近一次心跳包时间，1505917226150
        * Channel: 通道
        * haServerAddr: 192.168.1.106:10932

#### Broker

* ProducerManager
* ConsumerManager
* TopicConfigManager

#### Producer

* MQClientInstance
* DefaultMQProducerImpl

#### Consumer

* MQClientInstance
* RebalanceImpl

#### Send Message

* Send Message
    * 选择queue: 支持三种方式
        * 默认: 轮询queue列表，同步模式下支持重试，重试次数可配
            * 重试策略: 选择其它brokerName的节点
        * 指定MessageQueue
        * 实现MessageQueueSelector接口
    * 获取queue对应的broker master节点地址
        * 获取失败，从namesrv同步
        * 同步后获取还失败，代表master节点不可用，发送失败，抛出异常
    * Message处理
        * 设置消息唯一id: 16字节
            * 4: ip
            * 2: pid低16位
            * 4: classLoader.hashCode()
            * 4: 当前时间与当月第一天0点的时间差
            * 2: int累加器低16位
        * 消息压缩: 非批量消息且body长度大于body压缩阈值(默认4096字节)，则压缩
            * 压缩消息
            * 添加消息压缩标记
        * 若为事务消息，添加事务消息标记
        * 创建消息header: SendMessageRequestHeader
    * 消息封装为RemotingCommand
        * code
        * header: SendMessageRequestHeader
        * body = message.body
    * 消息通信模式分开处理
        * 同步发送
            * remotingClient.invokeSync
        * 异步发送
            * remotingClient.invokeAsync
        * 单向发送
            * remotingClient.invokeOneway
* 事务消息

#### Pull Message

#### 节点网络通信

* broker -&gt; `register_broker` -&gt; namesrv: 30s
* broker-slave -&gt; `register_broker` -&gt; broker-master
* producer -&gt; `get_routeinto_by_topic` -&gt; namesrv: 30s
* consumer -&gt; `get_routeinto_by_topic` -&gt; namesrv: 30s
