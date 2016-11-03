---
layout: topic
module: HotSpot
title: SA
---

SA，Serviceability Agent的简称。

参考资料: 

* [Serviceability Agent API](https://docs.oracle.com/javase/8/docs/serviceabilityagent/)
* [Serviceability in HotSpot](http://openjdk.java.net/groups/hotspot/docs/Serviceability.html)
* [The HotSpot™ Serviceability Agent](http://static.usenix.org/event/jvm01/full_papers/russell/russell_html/)
* openjdk/hotspot/agent/doc目录

启动SA:

* 命令行

```shell
sudo java -cp .:$JAVA_HOME/lib/sa-jdi.jar sun.jvm.hotspot.CLHSDB
```

* 图形界面

```shell
sudo java -cp .:$JAVA_HOME/lib/sa-jdi.jar sun.jvm.hotspot.HSDB
```
