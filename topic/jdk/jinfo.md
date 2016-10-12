---
layout: topic
module: JDK
title:  jinfo
---

Java Configuration Info，Java配置信息

* `jinfo <pid>`: 输出Java系统属性和JVM参数
* `jinfo -flag <name> <pid>`: 输出指定名称的JVM参数的值

```console
$ jinfo -flag NewSize 8705
-XX:NewSize=146800640
```

* `jinfo -flag [+|-]<name> <pid>`: 启用/禁用指定名称的JVM参数

```console
$ jinfo -flag +PrintGC 8705
$ jinfo -flag PrintGC 8705
-XX:+PrintGC
$ jinfo -flag -PrintGC 8705
$ jinfo -flag PrintGC 8705
-XX:-PrintGC
```

* `jinfo -flag <name>=<value> <pid>`: 设置指定名称的JVM参数的值

```console
$ jinfo -flag MaxHeapFreeRatio 8705
-XX:MaxHeapFreeRatio=100
$ jinfo -flag MaxHeapFreeRatio=80 8705
-XX:MaxHeapFreeRatio=80
```

* `jinfo -flags <pid>`: 输出JVM参数

```console
$ jinfo -flags 8705
-Djava.util.logging.config.file=/Users/txazo/Library/Caches/IntelliJIdea15/tomcat/Unnamed_txazo_3/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Xms440m -Xmx440m -XX:NewSize=140m -XX:MaxNewSize=140m -XX:SurvivorRatio=5 -Dcom.sun.management.jmxremote= -Dcom.sun.management.jmxremote.port=1099 -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false -Djava.rmi.server.hostname=127.0.0.1 -Djava.endorsed.dirs=/usr/local/tomcat/endorsed -Dcatalina.base=/Users/txazo/Library/Caches/IntelliJIdea15/tomcat/Unnamed_txazo_3 -Dcatalina.home=/usr/local/tomcat -Djava.io.tmpdir=/usr/local/tomcat/temp
```

* `jinfo -sysprops <pid>`: 输出Java系统属性

```console
$ jinfo -sysprops 8705
java.vendor = Oracle Corporation
sun.java.launcher = SUN_STANDARD
catalina.base = /Users/txazo/Library/Caches/IntelliJIdea15/tomcat/Unnamed_txazo_3
sun.management.compiler = HotSpot 64-Bit Tiered Compilers
catalina.useNaming = true
os.name = Mac OS X
...
```

可以在运行时通过`jinfo`动态修改的JVM参数:

```console
$ java -XX:+PrintFlagsFinal | grep manageable
 intx CMSAbortablePrecleanWaitMillis            = 100             {manageable}        
 intx CMSWaitDuration                           = 2000            {manageable}        
 bool HeapDumpAfterFullGC                       = false           {manageable}        
 bool HeapDumpBeforeFullGC                      = false           {manageable}        
 bool HeapDumpOnOutOfMemoryError                = false           {manageable}        
ccstr HeapDumpPath                              =                 {manageable}        
uintx MaxHeapFreeRatio                          = 100             {manageable}        
uintx MinHeapFreeRatio                          = 0               {manageable}        
 bool PrintClassHistogram                       = false           {manageable}        
 bool PrintClassHistogramAfterFullGC            = false           {manageable}        
 bool PrintClassHistogramBeforeFullGC           = false           {manageable}        
 bool PrintConcurrentLocks                      = false           {manageable}        
 bool PrintGC                                   = false           {manageable}        
 bool PrintGCDateStamps                         = false           {manageable}        
 bool PrintGCDetails                            = false           {manageable}        
 bool PrintGCTimeStamps                         = false           {manageable}
```
