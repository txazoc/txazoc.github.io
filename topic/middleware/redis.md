---
layout: topic
module: 中间件
title:  Redis
date:   2016-12-10
---

Redis，是一个开源的内存存储系统，可以用作缓存、数据库、消息队列

#### 数据结构

支持多种数据结构: string、list、set、zset、hash

* [Redis String](/topic/middleware/redis-string.html)

```c
// Redis对象类型
// OBJ_STRING   0   字符串对象类型, string
// OBJ_LIST     1   列表对象类型, list
// OBJ_SET      2   集合对象类型, set
// OBJ_ZSET     3   有序集合对象类型, zset
// OBJ_HASH     4   哈希对象类型, hash

// Redis对象
typedef struct redisObject {
    // 对象类型
    unsigned type:4;
    // 编码
    unsigned encoding:4;
    // LRU时间
    unsigned lru:LRU_BITS;
    // 引用计数
    int refcount;
    // 对象指针
    void *ptr;
} robj;
```

#### 持久化

#### 发布/订阅

#### 主从复制

#### Redis实现分布式锁

* 加锁: `setnx key value`，设置加锁过期时间: `expire key seconds`
* 解锁: `del key`
