---
layout: homelist
title: RemotingCommand
date: 2017-09-29
---

#### Topic路由

* get_routeinto_by_topic
    * Concumer/Producer `<<` Namesrv
    * 时间点: 启动、间隔30s

```json
{
    "topic": "topic-multi",
    "_nodeName": "consumer-1"
}
```

#### 注册Broker

* register_broker
    * Broker `>>` Namesrv
    * 时间点: 启动、间隔30s

```json
{
    "brokerId": "0",
    "brokerName": "broker-1",
    "clusterName": "DefaultCluster",
    "brokerAddr": "10.32.66.148:10911",
    "haServerAddr": "10.32.66.148:10912",
    "_nodeName": "broker-1-master"
}
```

* unregister_broker
    * Broker `>>` Namesrv
    * 时间点: shutdown

```json
{
    "brokerId": "0",
    "brokerName": "broker-1",
    "clusterName": "DefaultCluster",
    "brokerAddr": "10.32.66.148:10911",
    "_nodeName": "broker-1-master"
}
```

#### 发送消息

* send_message_v2
    * Producer `>>` Broker Master
    * 时间点: send

```json
{
    "producerGroup": "producer",
    "topic": "topic-multi",
    "defaultTopic": "TBW102",
    "defaultTopicQueueNums": "4",
    "queueId": "2",
    "sysFlag": "0",
    "bornTimestamp": "1506681800873",
    "flag": "0",
    "properties": "UNIQ_KEY\u00010A204294828F2FF4ACD0943684A80001\u0002WAIT\u0001true\u0002",
    "reconsumeTimes": "0",
    "unitMode": "false",
    "batch": "false",
    "_nodeName": "producer-0"
}
```

#### 消费消息

* pull_message
    * Concumer `<<` Broker
    * 时间点: pull

```json
{
    "consumerGroup": "consumer",
    "topic": "topic-multi",
    "queueId": "2",
    "queueOffset": "5726",
    "maxMsgNums": "32",
    "sysFlag": "3",
    "commitOffset": "5725",
    "suspendTimeoutMillis": "15000",
    "subVersion": "1506681831385",
    "_nodeName": "consumer-0"
}
```

#### 消费Offset

* query_consumer_offset
    * Concumer `<<` Broker Master
    * 时间点: 启动

```json
{
    "consumerGroup": "consumer",
    "topic": "topic-multi",
    "queueId": "3",
    "_nodeName": "consumer-0"
}
```

* update_consumer_offset
    * Concumer `>>` Broker Master
    * 时间点: 间隔5s

```json
{
    "consumerGroup": "consumer",
    "topic": "topic-multi",
    "queueId": "0",
    "commitOffset": "37150",
    "_nodeName": "consumer-0"
}
```

#### Slave同步Master

* get_all_consumer_offset: 间隔60s
* get_all_delay_offset: 间隔60s
* get_all_topic_config: 间隔60s
* get_all_subscriptiongroup_config: 间隔60s

```json
{
    "_nodeName": "broker-1-slave"
}
```

#### 心跳

* heart_beat
    * Concumer/Producer `>>` Broker
    * 时间点: 间隔30s

```json
{
    "_nodeName": "producer-0"
}
```

#### Concumer变更通知

* notify_consumer_ids_changed
    * Broker `>>` Concumer
    * 时间点: 消费者变更

```json
{
    "consumerGroup": "consumer",
    "_nodeName": "broker-1-master"
}
```

#### Concumer列表

* get_consumer_list_by_group
    * Concumer `<<` Broker Master
    * 时间点: 间隔20s

```json
{
    "consumerGroup": "consumer",
    "_nodeName": "consumer-0"
}
```
