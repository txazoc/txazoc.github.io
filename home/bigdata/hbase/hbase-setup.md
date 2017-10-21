---
layout: home
title:  HBase安装
date:   2017-10-20
---

#### conf/hbase-env.sh

```config
export JAVA_HOME=/Library/Java/JavaVirtualMachines/current.jdk/Contents/home
```

#### conf/hbase-site.xml

```xml
<configuration>
    <property>
        <name>hbase.rootdir</name>
        <value>hdfs://127.0.0.1:9000/hbase</value>
    </property>
    <property>
        <name>hbase.cluster.distributed</name>
	<value>true</value>
    </property>
    <property>
        <name>hbase.zookeeper.quorum</name>
	<value>127.0.0.1</value>
    </property>
</configuration>
```

#### 启动HBase

```shell
bin/start-hbase.sh
```

[http://localhost:16010](http://localhost:16010)

#### 停止HBase

```shell
bin/stop-hbase.sh
```
