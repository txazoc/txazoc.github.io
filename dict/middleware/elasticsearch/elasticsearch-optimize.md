---
layout: home
title:  ElasticSearch调优
date:   2020-09-23
tags:   [elasticsearch]
---

#### Mapping调优

* 文档id，建议自动生成id或者使用数字型id
* 字段不做分词时，使用`keyword`代替`text`
* 控制索引的字段数量，可考虑存储在其他设备上
* 不要求准实时查询时，可以适当调大参数`index.refresh_interval`
* 大批量导入数据时，可以设置`index.refresh_interval`为-1，暂时关闭`refresh`
* 不分词的字段，设置`not_analyzed`

#### 索引调优

* 可以指定`routing`路由
* 提升写性能，`index.refresh_interval`设为-1关闭`refresh`，`index.number_of_replicas`设为0不设置副本
* translog设置，刷盘频率，日志文件阈值

#### 查询调优

* 避免深度分页，使用`Scroll API`代替
* `filter`查询比`query`查询快，后者会计算score并排序

#### JVM调优

#### 硬件调优

* CPU核数尽可能大
* 尽可能使用SSD硬盘
* ES高度依赖`OS Cache`，确保至少有一半的可用物理内存分配给`OS Cache`
* 协调节点为IO和CPU密集型，尽可能分配好的CPU和磁盘
