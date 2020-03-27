---
layout: topic
module: 中间件
title:  Kafka
date:   2017-01-06
---

Topic生产:

<img src="/images/topic/middleware/kafka/topic_log.png" style="width: 400px" title="Topic生产" />

`bin/kafka-console-producer.sh --broker-list 127.0.0.1:9092 --topic my-topic`

Topic消费:

<img src="/images/topic/middleware/kafka/topic_consumer.png" style="width: 400px" title="Topic消费" />

`bin/kafka-console-consumer.sh --zookeeper 127.0.0.1:2181 --topic my-topic --from-beginning`

`offset`由消费者控制

#### 生产者

* 选择消息发送的分区，可以采用轮询或其它基于key的算法

#### 消费者

* 消费组

<img src="/images/topic/middleware/kafka/consumer-groups.png" style="width: 400px" title="消费组" />

#### 消息系统

* 队列: 多个消费者共用一个消费组
* 发布/订阅: 每个消费者对应一个消费组

#### 存储系统

文件 + 副本

#### 流处理

实时流处理

#### Kafka设计

* 持久化
* 效率
* Producer
* Consumer
* 消息传递语义
* 副本
* 日志压缩
* 限额
