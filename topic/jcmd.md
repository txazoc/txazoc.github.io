---
layout: topic
module: 命令行
title:  jcmd
---

* `jcmd [-l]`: 输出所有Java进程状态，同`jps -ml`

```console
$ jcmd -l
45576 com.intellij.rt.execution.application.AppMain JstatTest
45552 org.apache.catalina.startup.Bootstrap start
24265 org.jetbrains.idea.maven.server.RemoteMavenServer
```

* `jcmd <pid | main class> PerfCounter.print`: 输出进程的性能计数器

```console
$ jcmd 8705 PerfCounter.print
8705:
java.ci.totalTime=26703829
java.cls.loadedClasses=8247
java.cls.sharedLoadedClasses=0
java.cls.sharedUnloadedClasses=0
java.cls.unloadedClasses=0
...
```

* `jcmd <pid | main class> <command>`: `command`为`jcmd <pid | main class> help`输出的选项

```console
$ jcmd 8705 help
8705:
The following commands are available:
VM.native_memory
VM.commercial_features
GC.rotate_log
ManagementAgent.stop
ManagementAgent.start_local
ManagementAgent.start
Thread.print
GC.class_histogram
GC.heap_dump
GC.run_finalization
GC.run
VM.uptime
VM.flags
VM.system_properties
VM.command_line
VM.version
help
```

* `jcmd <pid | main class> help <command>`: 输出`command`的帮助信息
* `jcmd <pid | main class> Thread.print [-l]`: 输出线程栈，同`jstack`，`-l`代表输出锁信息
* `jcmd <pid | main class> GC.class_histogram [-all]`: 打印堆的柱状图，同`jmap [-F] -histo[:live] <pid>`，`-all`代表输出所有对象
* `jcmd <pid | main class> GC.heap_dump [-all] <filename>`: 创建堆转储，同`jmap [-F] -dump:[live,]format=b,file=<filename> <pid>`，`-all`代表输出所有对象
* `jcmd <pid | main class> VM.flags`: 输出JVM使用的参数和值

```console
$ jcmd 8705 VM.flags
8705:
-XX:InitialHeapSize=461373440 -XX:+ManagementServer -XX:MaxHeapSize=461373440 -XX:MaxNewSize=146800640 -XX:NewSize=146800640 -XX:SurvivorRatio=5 -XX:+UnlockCommercialFeatures -XX:+UseCompressedOops -XX:+UseParallelGC
```

* `jcmd <pid | main class> VM.flags -all`: 输出所有JVM支持的参数

```console
$ jcmd 8705 VM.flags -all
8705:
[Global flags]
    uintx AdaptivePermSizeWeight                    = 20              {product}           
    uintx AdaptiveSizeDecrementScaleFactor          = 4               {product}           
    uintx AdaptiveSizeMajorGCDecayTimeScale         = 10              {product}           
    uintx AdaptiveSizePausePolicy                   = 0               {product}           
    uintx AdaptiveSizePolicyCollectionCostMargin    = 50              {product}
...
```

* `jcmd <pid | main class> VM.system_properties`: 输出系统属性
* `jcmd <pid | main class> VM.command_line`: 输出进程启动参数

```console
$ jcmd 8705 VM.command_line
8705:
VM Arguments:
jvm_args: -Djava.util.logging.config.file=/Users/txazo/Library/Caches/IntelliJIdea15/tomcat/Unnamed_txazo_3/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Xms440m -Xmx440m -XX:NewSize=140m -XX:MaxNewSize=140m -XX:SurvivorRatio=5 -Dcom.sun.management.jmxremote= -Dcom.sun.management.jmxremote.port=1099 -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false -Djava.rmi.server.hostname=127.0.0.1 -Djava.endorsed.dirs=/usr/local/tomcat/endorsed -Dcatalina.base=/Users/txazo/Library/Caches/IntelliJIdea15/tomcat/Unnamed_txazo_3 -Dcatalina.home=/usr/local/tomcat -Djava.io.tmpdir=/usr/local/tomcat/temp 
java_command: org.apache.catalina.startup.Bootstrap start
Launcher Type: SUN_STANDARD
```

* `jcmd 0 <command>`: 输出所有Java进程相关信息

```console
$ jcmd 0 VM.version
46642:
Java HotSpot(TM) 64-Bit Server VM version 24.80-b11
JDK 7.0_80
24060:
OpenJDK 64-Bit Server VM version 25.40-b25
JDK 8.0_40
```
