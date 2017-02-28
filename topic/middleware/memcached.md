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
* set

```bash
set name 0 0 7
manager
STORED
```

* add

```bash
add name 0 0 5
admin
STORED
```

* replace

```bash
replace name 0 0 4
root
STORED
```

* delete

```bash
delete name
DELETED
```

* get

```bash
get name
VALUE name 0 5
admin
END
```

* gets

```bash
gets name
VALUE name 0 7 10
manager
END
```

* cas

```bash
cas name 0 0 5 10 
admin
STORED
```

#### LRU

最近最少使用算法

#### Libevent事件处理

I/O多路复用

#### 协议

简单的文本协议

#### 客户端分布式

* 一致性Hash
* memcached互不通信
