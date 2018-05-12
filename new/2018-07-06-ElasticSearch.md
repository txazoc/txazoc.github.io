---
layout: new
title:  ElasticSearch
---

#### ElasticSearch常用术语

* Index: 索引，相当于数据库中的库
* Type: 索引中的数据类型，相当于数据库中的表
* Document: 文档数据，相当于数据库中的行
* Field: 字段，相当于数据库表中的字段

#### ElasticSearch配置文件

* elasticsearch.yml: elasticsearch相关配置

```nginx
# ======================== Elasticsearch Configuration =========================
cluster.name: es-cluster-1
node.name: es-node-1
path.data: /path/to/data
path.logs: /path/to/logs
network.host: 192.168.0.1
http.port: 9200
```

* jvm.options: jvm相关配置
* log4j2.properties: log4j2相关配置

#### ElasticSearch本地集群

#### ElasticSearch增删改查

* 增

方式一: `add or update`语义

```js
PUT /user/account/1
{
  "balance": 100
}
```

方式二: `put-if-absent`语义

```js
PUT /user/account/1/_create
// PUT /user/account/1?op_type=create
{
  "balance": 100
}
```

方式三: 自动生成id

```js
POST /user/account
{
  "balance": 100
}
```

* 删

```js
DELETE /user/account/1
```

* 改

`merge when exists`语义

```js
POST /user/account/10/_update
{
  "doc": {
    "balance": "100"
  }
}
```

* 查

```js
GET /user/account/1
// GET /user/account/1/_source
```

#### ElasticSearch Query

* 方式一: Query String

```js
GET /user/account/_search?q=shanghai
GET /user/account/_search?q=name:shanghai
```

* 方式二: Query DSL

```js
GET /user/account/_search
{
  "query": {
    "term": {
      "name": {
        "value": "shanghai"
      }
    }
  }
}
```
