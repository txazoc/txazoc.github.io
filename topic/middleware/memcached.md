---
layout: topic
module: 中间件
title:  Memcached
date:   2016-12-10
---

Memcached，是一个高性能的分布式内存对象缓存系统

#### 内存管理

* 预先分配内存
* 无内存碎片，但会造成空间浪费
* Slab Allocation: 内存 > Slab(1M) > Chunk

```bash
$ memcached -u root -vv
slab class   1: chunk size        96 perslab   10922
slab class   2: chunk size       120 perslab    8738
slab class   3: chunk size       152 perslab    6898
slab class   4: chunk size       192 perslab    5461
...
slab class  39: chunk size    493552 perslab       2
slab class  40: chunk size    616944 perslab       1
slab class  41: chunk size    771184 perslab       1
slab class  42: chunk size   1048576 perslab       1
```

#### O(1)

* 哈希表
* set，设置key-value，置于LRU顶部

```bash
set name 0 0 7
manager
STORED
```

* add，key不存在就添加key-value，置于LRU顶部

```bash
add name 0 0 5
admin
STORED
```

* replace，key存在才替换value

```bash
replace name 0 0 4
root
STORED
```

* delete，删除key-value

```bash
delete name
DELETED
```

* get，获取key对应的value值

```bash
get name
VALUE name 0 5
admin
END
```

* gets，获取key对应的value值，并返回CAS标识符(64位数字)，用于`cas`命令

```bash
gets name
VALUE name 0 7 10
manager
END
```

* cas，Compare And Swap，原子更新

```bash
cas name 0 0 5 10 
admin
STORED
```

* incr/decr，自增/自减，前提是value是64位整数的字符串表示，并且自增/自减的值只能是正整数，不能是负数

```bash
set id 0 0 2
10
STORED
get id
VALUE id 0 2
10
END
incr id 5
15
decr id 10
5
```

#### Multi-Get

批量get操作，由Client实现

最简单的方案就是以串行的方式循环get每个key，时间复杂度O(keys)

分组优化，计算所有的key落到哪些节点上，得到一个Map<Node, List<Key>>，然后遍历Node进行mget操作，时间复杂度O(nodes)

继续优化，并行处理每个Node的mget操作，时间复杂度O(1)

#### Memcached统计

#### LRU

最近最少使用算法

#### Libevent事件处理

I/O多路复用

#### 协议

简单的文本协议

#### 客户端分布式

* 一致性Hash
* memcached互不通信
