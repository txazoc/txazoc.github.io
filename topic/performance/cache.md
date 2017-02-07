---
layout: topic
module: 性能优化
title:  缓存调优
date:   2017-01-26
---

缓存分类:

* 本地缓存: HashMap、EhCache
* 分布式缓存: Redis、Memcache

缓存使用场景:

* 短时间读多写少
* 高并发查询热点数据

缓存更新:

* 准实时更新
* 设置过期时间，过期后从DB加载

缓存击穿:

* 
