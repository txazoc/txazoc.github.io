---
layout: homelist
title: Broker存储
date: 2017-09-30
---

#### config

```c
store/
    config/
        consumerFilter.json
        consumerFilter.json.bak
        consumerOffset.json
        consumerOffset.json.bak
        delayOffset.json
        delayOffset.json.bak
        subscriptionGroup.json
        topics.json
        topics.json.bak
```

***consumerOffset.json - 消费进度***

```js
{
	"offsetTable": {
		"%RETRY%consumer-group@consumer-group": {
		    0: 0
		},
		// topic@消费组
		"topicName@consumer-group": {
		    // 队列id: 消费进度
		    0: 113085,
		    1: 113083,
		    2: 113086,
		    3: 113088
		}
	}
}
```

***delayOffset.json - 延时消费进度***

```js
{
	"offsetTable": {
	    // SCHEDULE_TOPIC_XXXX的队列id: 消费进度
	    3: 233051
	}
}
```

***subscriptionGroup.json - 订阅组***

```js
"consumer-group": {
    "brokerId": 0,                              // brokerId
    "consumeBroadcastEnable": true,             // 是否允许广播消费
    "consumeEnable": true,                      // 是否允许消费
    "consumeFromMinEnable": true,               // 是否允许从头开始消费
    "groupName": "consumer-group",              // 订阅组名称
    "notifyConsumerIdsChangedEnable": true,     // 消费者变更时是否通知
    "retryMaxTimes": 16,                        // 最大重试次数
    "retryQueueNums": 1,                        // 重试队列数
    "whichBrokerWhenConsumeSlowly": 1           // 消费缓慢时建议切换到的brokerId
}
```

***topics.json - topic配置***

```js
"topicName": {
    "order": false,                     // 是否有序
    "perm": 6,                          // 读写权限, 0100-可读, 0010-可写
    "readQueueNums": 4,                 // 读队列数
    "writeQueueNums": 4,                // 写队列数
    "topicFilterType": "SINGLE_TAG",    // 过滤类型
    "topicName": "topicName",           // topic名称
    "topicSysFlag": 0                   // topic系统标记
}
```

***配置管理器***

```java
public abstract class ConfigManager {

    /**
     * 配置文件路径: ${user.home}/store/config/${fileName}
     */
    public abstract String configFilePath();

    /**
     * 配置反序列化到内存
     */
    public abstract void decode(final String jsonString);

    /**
     * 内存配置序列化
     */
    public abstract String encode();

    /**
     * 内存配置序列化
     *
     * @param prettyFormat 是否格式化输出
     */
    public abstract String encode(final boolean prettyFormat);

    /**
     * 从文件加载配置到内存
     */
    public boolean load() {
        String fileName = null;
        try {
            fileName = this.configFilePath();
            String jsonString = MixAll.file2String(fileName);
            if (null == jsonString || jsonString.length() == 0) {
                return this.loadBak();
            } else {
                this.decode(jsonString);
                return true;
            }
        } catch (Exception e) {
            return this.loadBak();
        }
    }

    /**
     * 从备份文件加载配置到内存
     */
    private boolean loadBak() {
        String fileName = null;
        try {
            fileName = this.configFilePath();
            String jsonString = MixAll.file2String(fileName + ".bak");
            if (jsonString != null && jsonString.length() > 0) {
                this.decode(jsonString);
                return true;
            }
        } catch (Exception e) {
            return false;
        }

        return true;
    }

    /**
     * 从内存持久化配置到文件
     */
    public synchronized void persist() {
        String jsonString = this.encode(true);
        if (jsonString != null) {
            String fileName = this.configFilePath();
            try {
                MixAll.string2File(jsonString, fileName);
            } catch (IOException e) {
            }
        }
    }

}
```

#### commitlog

***commitlog文件***

```c
store/
    commitlog/
        00000000000000000000    // 1G
        00000000001073741824    // 1G
        00000000002147483648    // 1G
        00000000003787456512    // 1G
        00000000004294967296    // 1G
        ...
```

***消息存储结构***

```c
1   TotalSize                   // 4字节     消息大小
2   MagicCode                   // 4字节     0xdaa320a7
3   BodyCRC                     // 4字节     消息内容校验码
4   QueueId                     // 4字节     队列id
5   Flag                        // 4字节     标记
6   QueueOffset                 // 8字节     队列中偏移量(实际偏移地址 = QueueOffset * 20)
7   PhysicalOffset              // 8字节     commitlog中偏移地址
8   SysFlag                     // 4字节     消息标记
9   BornTimestamp               // 8字节     消息生产时间戳
10  BornHost                    // 8字节     消息生产host
11  StoreTimestamp              // 8字节     消息存储时间戳
12  StoreHostAddress            // 8字节     消息存储host
13  ReconsumeTimes              // 4字节     重复消费次数
14  PreparedTransactionOffset   // 8字节     prepared状态事务消息在commitlog中偏移地址
15  BodyLength                  // 4字节     消息内容长度
    Body                        //          消息内容
16  TopicLength                 // 1字节     topic长度
    Topic                       //          topic
17  PropertiesLength            // 2字节     Properties长度
    Properties                  //          Properties
```

#### consumerqueue

```c
store/
    consumerqueue/
        ${topicName}/
            ${queueId}/
                00000000000000000000    // 6M
                00000000000006000000    // 6M
                00000000000012000000    // 6M
                00000000000018000000    // 6M
                00000000000024000000    // 6M
                ...
```

***消费队列结构***

```c
CommitLogOffset     // 8字节      commitlog中偏移地址
MsgSize             // 4字节      消息大小
TagsCode            // 8字节      tag的哈希值
```

#### index

***index文件***

```c
store/
    index/
        20170930122236455   // 大小: 420000040, 格式: yyMMddHHmmssSSS
        ...
```

***index文件结构***

`数组 + 链表`结构

```c
header: 40字节
    beginTimestamp      // 8字节, 第一个索引消息的storeTimestamp
    endTimestamp        // 8字节, 最后一个索引消息的storeTimestamp
    beginPhyOffset      // 8字节, 第一个索引消息的commitlog offset
    endPhyOffset        // 8字节, 最后一个索引消息的commitlog offset
    hashSlotCount       // 4字节, 构建索引使用的slot数
    indexCount          // 4字节, 构建的索引数, 等于hashSlotCount
slot: 500万 * 4字节
    slotValue           // 4字节, 相同slot的最后一个索引的offset
index: 2000万 * 20字节
    keyHash             // 4字节, key的hash值
    phyOffset           // 8字节, 索引消息的commitlog offset
    timeDiff            // 4字节, 索引消息和第一个消息的storeTimestamp的时间差, 单位为秒
    slotValue           // 4字节, 0或上一个索引的offset(解决hash冲突)
```

***index查询***

* topic
* key
* beginTimestamp
* endTimestamp

#### checkpoint
