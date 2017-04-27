---
layout: topic
module: 搜索
title:  ElasticSearch
tags:   ['elasticsearch', 'kibana']
date:   2017-04-18
---

`ElasticSearch`是一个基于Lucene的开源全文搜索和分析引擎，允许快速和实时存储、搜索和分析大容量数据，支持RESTful接口

#### 基本概念

* 集群(Cluster): 多个节点组成一个集群对外提供服务
* 节点(Node): 一个ElasticSearch服务称为一个节点
* 索引(Index): 类似关系数据库中的Database
* 类型(Type): 类似关系数据库中的Table
* 文档(Document): 类似关系数据库中Table的一条记录，JSON格式，可以被索引，同一个Type下，每个Document都有一个唯一的ID
* 分片(Shard): 一个Index划分为若干部分存储在集群的节点上
* 副本(Replica): Index的冗余备份，也可以用做负载均衡

#### 安装ElasticSearch

先安装JDK，推荐JDK 8，低版本JDK可能会不兼容

```linux
$ wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.3.0.tar.gz
$ tar -zxvf elasticsearch-5.3.0.tar.gz
$ mv elasticsearch-5.3.0 /usr/local
$ cd /usr/local
$ ln -s elasticsearch-5.3.0 elasticsearch
```

#### 安装Kibana

```linux
$ wget https://artifacts.elastic.co/downloads/kibana/kibana-5.3.0-darwin-x86_64.tar.gz
$ tar -zxvf kibana-5.3.0-darwin-x86_64.tar.gz
$ mv kibana-5.3.0-darwin-x86_64 /usr/local/kibana-5.3.0
$ cd /usr/local
$ ln -s kibana-5.3.0 kibana
```

修改config/kibana.yml文件，取消`elasticsearch.url: "http://localhost:9200"`前面注释

#### 启动ElasticSearch

```linux
$ cd /usr/local/elasticsearch
$ bin/elasticsearch
```

浏览器访问 [http://localhost:5601](http://127.0.0.1:9200)

#### 启动Kibana

```linux
$ cd /usr/local/kibana
$ bin/kibana
```

#### 集群

* 集群状态: `_cat/health?format=json`

```js
[
  {
    "epoch": "1493192065",
    "timestamp": "15:34:25",
    "cluster": "elasticsearch",
    "status": "yellow",
    "node.total": "1",
    "node.data": "1",
    "shards": "6",
    "pri": "6",
    "relo": "0",
    "init": "0",
    "unassign": "6",
    "pending_tasks": "0",
    "max_task_wait_time": "-",
    "active_shards_percent": "50.0%"
  }
]
```

* 节点状态: `_cat/nodes?format=json`

```js
[
  {
    "ip": "127.0.0.1",
    "heap.percent": "9",
    "ram.percent": "100",
    "cpu": "20",
    "load_1m": "2.27",
    "load_5m": null,
    "load_15m": null,
    "node.role": "mdi",
    "master": "*",
    "name": "wk7M8z6"
  }
]
```

* 索引列表: `GET /_cat/indices?v`

```console
health status index    uuid                   pri rep docs.count docs.deleted store.size pri.store.size
yellow open   customer Fdd8PaoERJSbKbE3Nsj8TQ   5   1          0            0       650b           650b
yellow open   .kibana  CxctjEmXTFGE9y2nBjoN4g   1   1          1            0      3.1kb          3.1kb
yellow open   test     bZIKn_aTTfS0m00qhjKeKA   5   1          0            0       650b           650b
```

* 创建索引: `PUT /test?pretty`

```js
{
  "acknowledged": true,
  "shards_acknowledged": true
}
```

* 索引文档

```js
PUT /test/user/1?pretty
{
    "name": "root"
}
```

```js
{
  "_index": "test",
  "_type": "user",
  "_id": "1",
  "_version": 3,
  "result": "updated",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  },
  "created": false
}
```

#### 检索文档

```js
GET /test/user/1?pretty
```

```js
{
  "_index": "test",
  "_type": "user",
  "_id": "1",
  "_version": 3,
  "found": true,
  "_source": {
    "name": "root"
  }
}
```

#### 删除索引: `DELETE /test?pretty`

```js
{
  "acknowledged": true
}
```

#### 删除文档: `DELETE /test/user/1?pretty`

```json
{
  "found": true,
  "_index": "test",
  "_type": "user",
  "_id": "1",
  "_version": 17,
  "result": "deleted",
  "_shards": {
    "total": 2,
    "successful": 1,
    "failed": 0
  }
}
```
