---
layout: topic
module: jdk
title:  jps
---

Java Process Status Tool，Java进程状态工具

* `jps`: 默认方式, 显示pid + 主类名

```console
$ jps
42424 RemoteMavenServer
58990 Jps
42214 
```

* `jps -l`: 显示pid + 主类名全称

```console
$ jps -l
42424 org.jetbrains.idea.maven.server.RemoteMavenServer
42214 
59015 sun.tools.jps.Jps
```

* `jps -v`: 显示pid + java参数

```console
$ jps -v
42424 RemoteMavenServer -Djava.awt.headless=true -Didea.version==15.0.2 -Xmx512m -Didea.maven.embedder.version=3.0.5 -Dfile.encoding=UTF-8
59673 Jps -Denv.class.path=/Library/Java/JavaVirtualMachines/current.jdk/Contents/Home/lib -Dapplication.home=/Library/Java/JavaVirtualMachines/jdk1.7.0_80.jdk/Contents/Home -Xms8m
42214  -Dfile.encoding=UTF-8 -XX:+UseConcMarkSweepGC -XX:SoftRefLRUPolicyMSPerMB=50 -ea -Dsun.io.useCanonCaches=false -Djava.net.preferIPv4Stack=true -XX:+HeapDumpOnOutOfMemoryError -XX:-OmitStackTraceInFastThrow -Xverify:none -Xbootclasspath/a:../lib/boot.jar -Xms128m -Xmx750m -XX:MaxPermSize=350m -XX:ReservedCodeCacheSize=240m -XX:+UseCompressedOops -Djb.vmOptionsFile=/Applications/IntelliJ IDEA 15.app/Contents/bin/idea.vmoptions -Didea.java.redist=custom-jdk-bundled -Didea.home.path=/Applications/IntelliJ IDEA 15.app/Contents -Didea.executable=idea -Didea.paths.selector=IntelliJIdea15
```
