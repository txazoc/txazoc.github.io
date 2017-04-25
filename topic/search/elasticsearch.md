---
layout: topic
module: 搜索
title:  ElasticSearch
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
$ wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-5.3.1.tar.gz
$ tar -zxvf elasticsearch-5.3.1.tar.gz
$ mv elasticsearch-5.3.1 /usr/local
$ cd /usr/local
$ ln -s elasticsearch-5.3.1 elasticsearch
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

#### 启动

```linux
$ cd /usr/local/elasticsearch
$ ./bin/elasticsearch
```

健康状态: `curl http://127.0.0.1:9200/_cat/health\?v`

节点列表: `curl http://127.0.0.1:9200/_cat/nodes\?v`

索引列表: `curl http://127.0.0.1:9200/_cat/indices\?v`

创建索引: `curl -XPUT http://127.0.0.1:9200/customer?pretty`
