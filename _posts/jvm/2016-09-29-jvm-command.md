---
layout:     article
categories: [jvm]
title:      Java命令工具
tags:       [java]
date:       2016-09-29
---

#### java

启动Java应用程序，参见 [java命令](/jvm/jvm-java-command.html)

#### javac

编译Java源文件

#### javadoc

从Java源文件生成API文档

#### jar

#### javap

反编译Class文件

* `javap -c classes`: 对代码进行反汇编
* `javap -s classes`: 输出内部类型签名
* `javap -p classes`: 显示所有类和成员
* `javap -l classes`: 输出行号和本地变量表
* `javap -v classes`: 输出附加信息

#### jdb

Java Debugger，debug调试工具

`-Xdebug -Xrunjdwp:transport=dt_socket,address=8787,server=y,suspend=n`

`jdb -attach 192.168.224.111:8787`

```console
> run
> stop at com.dianping.mobile.api.discovery.facade.FindRankListFacade:58
> stop in com.test.Main.test
> next
> step
> dump context.config
> print context.config
> cont
> threads
> thread <index>
> where
> where all
> where <index>
> catch java.io.FileNotFoundException
> ignore
```


#### jps

显示当前所有Java进程pid

`jps`

`jps -l`

#### jstat

#### jconsole

`jconsole pid`

```console
-Dcom.sun.management.jmxremote.port=9999
-Dcom.sun.management.jmxremote.authenticate=false
-Dcom.sun.management.jmxremote.ssl=false
```

`jconsole 127.0.0.1:9999`

#### jvisualvm

#### jstack

打印Java线程栈

`jstack pid`

* `jstack pid`: 打印线程栈
* `jstack -F pid`: 强制打印线程栈
* `jstack -l pid`: 打印详细的线程栈
* `jstack -m pid`: 打印Java和C++的混合栈
