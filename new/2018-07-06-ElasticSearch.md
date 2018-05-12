---
layout: new
title:  ElasticSearch
---

#### ElasticSearch配置文件

* elasticsearch.yml: elasticsearch相关配置

```nginx
# ======================== Elasticsearch Configuration =========================
cluster.name: es-cluster-1
node.name: node-1
path.data: /path/to/data
path.logs: /path/to/logs
network.host: 192.168.0.1
http.port: 9200
```

* jvm.options: jvm相关配置
* log4j2.properties: log4j2相关配置

#### 本地集群
