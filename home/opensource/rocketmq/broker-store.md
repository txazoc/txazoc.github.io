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

***consumerOffset.json***

```json
{
	"offsetTable":{
		"%RETRY%consumer@consumer":{0:0
		},
		"topic-multi@consumer":{0:113085,1:113083,2:113086,3:113088
		}
	}
}
```

***delayOffset.json***

```json
{
	"offsetTable":{3:233051
	}
}
```

***topics.json***

```json
"topic-multi": {
    "order": false,
    "perm": 6,
    "readQueueNums": 4,
    "topicFilterType": "SINGLE_TAG",
    "topicName": "topic-multi",
    "topicSysFlag": 0,
    "writeQueueNums": 4
}
```

```java
/**
 * 配置管理器
 */
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

#### consumerqueue

```c
store/
    consumerqueue/
        ${topic}/
            ${queueId}/
                00000000000000000000    // 6M
                00000000000006000000    // 6M
                00000000000012000000    // 6M
                00000000000018000000    // 6M
                00000000000024000000    // 6M
                ...
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
