---
layout: topic
module: 中间件
title:  Kafka
date:   2017-01-06
---

Kafka，一种高吞吐量的分布式发布订阅消息系统

先启动Zookeeper:

```bash
bin/zkServer.sh start
```

***启动Kafka单节点***

```bash
bin/kafka-server-start.sh config/server.properties
```

***启动Kafka多节点***

```bash
cp config/server.properties config/server-1.properties
cp config/server.properties config/server-2.properties
cp config/server.properties config/server-3.properties
```

```bash
config/server-1.properties:
    broker.id=1
    listeners=PLAINTEXT://:9081
    log.dir=/tmp/kafka-logs-1

config/server-2.properties:
    broker.id=2
    listeners=PLAINTEXT://:9082
    log.dir=/tmp/kafka-logs-2

config/server-3.properties:
    broker.id=3
    listeners=PLAINTEXT://:9083
    log.dir=/tmp/kafka-logs-3
```

```bash
bin/kafka-server-start.sh config/server-1.properties &
bin/kafka-server-start.sh config/server-2.properties &
bin/kafka-server-start.sh config/server-3.properties &
```

#### Topic

***创建Topic***

`bin/kafka-topics.sh --create --zookeeper 127.0.0.1:2181 --replication-factor 1 --partitions 1 --topic my-topic`

***列出Topic***

`bin/kafka-topics.sh --list --zookeeper 127.0.0.1:2181`

***删除Topic***

`bin/kafka-topics.sh --delete --zookeeper 127.0.0.1:2181 --topic my-topic`

***多分区和多副本Topic***

`bin/kafka-topics.sh --create --zookeeper 127.0.0.1:2181 --replication-factor 2 --partitions 5 --topic my-partition-replication-topic`

`bin/kafka-topics.sh --describe --zookeeper 127.0.0.1:2181 --topic my-partition-replication-topic`

```bash
Topic:my-partition-replication-topic	PartitionCount:5	ReplicationFactor:2	Configs:
	Topic: my-partition-replication-topic	Partition: 0	Leader: 2	Replicas: 2,3	Isr: 2,3
	Topic: my-partition-replication-topic	Partition: 1	Leader: 3	Replicas: 3,1	Isr: 3,1
	Topic: my-partition-replication-topic	Partition: 2	Leader: 1	Replicas: 1,2	Isr: 1,2
	Topic: my-partition-replication-topic	Partition: 3	Leader: 2	Replicas: 2,1	Isr: 2,1
	Topic: my-partition-replication-topic	Partition: 4	Leader: 3	Replicas: 3,2	Isr: 3,2
```

* `Partition`: 分区
* `Leader`: 分区主节点id，负责该分区所有的读写请求
* `Replicas`: 分区副本节点id，复制主节点，主节点挂掉后，从副本节点选举一个做为新的主节点

Topic分区和副本:

```bash
/tmp/kafka-logs-1/my-partition-replication-topic-1
/tmp/kafka-logs-1/my-partition-replication-topic-2
/tmp/kafka-logs-1/my-partition-replication-topic-3

/tmp/kafka-logs-2/my-partition-replication-topic-0
/tmp/kafka-logs-2/my-partition-replication-topic-2
/tmp/kafka-logs-2/my-partition-replication-topic-3
/tmp/kafka-logs-2/my-partition-replication-topic-4

/tmp/kafka-logs-3/my-partition-replication-topic-0
/tmp/kafka-logs-3/my-partition-replication-topic-1
/tmp/kafka-logs-3/my-partition-replication-topic-4
```

Topic消息文件:

```bash
$ ls /tmp/kafka-logs-1/my-partition-replication-topic-1
00000000000000000000.index
00000000000000000000.log
00000000000000645287.index
00000000000000645287.log
00000000000001354234.index
00000000000001354234.log
```

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
