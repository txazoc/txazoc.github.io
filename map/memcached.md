---
layout: map
title:  Memcached
---

#### Memcached特性

* 客户端分布式
* libevent事件驱动

#### Memcached内存分配

* 内存预分配
* Slab: 具有相同大小Chunk的Page集合
    * Page: 1M(1024 * 1024字节)
        * Chunk: 默认96字节
* `key`最大长度: 250

#### Memcached命令

* get
* set
* delete

#### 过期处理

#### 淘汰机制
