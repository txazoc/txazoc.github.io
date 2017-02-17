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
slab class   5: chunk size       240 perslab    4369
slab class   6: chunk size       304 perslab    3449
slab class   7: chunk size       384 perslab    2730
slab class   8: chunk size       480 perslab    2184
slab class   9: chunk size       600 perslab    1747
slab class  10: chunk size       752 perslab    1394
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

#### 简单的文本协议

#### 客户端分布式

* 一致性Hash
* memcached互不通信
