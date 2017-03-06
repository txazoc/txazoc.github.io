---
layout:     article
categories: [jvm]
title:      Java命令工具
tags:       [java, 命令]
date:       2016-09-30
---

#### 目录

* [java](#java)
* [javac](#javac)
* [javadoc](#javadoc)
* [jar](#jar)
* [javap](#javap)
* [jdb](#jdb)
* [jps](#jps)
* [jstat](#jstat)
* [jconsole](#jconsole)
* [jvisualvm](#jvisualvm)
* [jstack](#jstack)
* [jmap](#jmap)
* [jhat](#jhat)
* [jinfo](#jinfo)
* [jcmd](#jcmd)
* [jmc](#jmc)
* [jfr](#jfr)

#### <a id="java">java</a>

启动Java应用程序，参见 [java命令](/jvm/jvm-java-command.html)

* `java org.txazo.Test`，启动运行类
* `java -jar test.jar`，启动运行jar包中的main class

#### <a id="javac">javac</a>

Java Compiler，Java编译器，编译`.java`源文件为`.class`字节码文件

* `javac org.txazo.Test.java`: 编译生成`Test.class`字节码文件

#### <a id="javadoc">javadoc</a>

Java API Documentation Generator，Java API文档生成器

* `javadoc -sourcepath . -d api org.txazo`: org.txazo包生成api文档(不包含子包)

#### <a id="jar">jar</a>

Java Archive，Java存档

* `jar -cvf test.jar *`: 创建jar包
* `jar -uvf test.jar test.txt`: 更新jar包
* `jar -xvf test.jar`: 解压jar包
* `jar -tvf test.jar`: 列出jar包中文件

#### <a id="javap">javap</a>

反编译Class文件

给出一个Java类:

```java
public class Javap {

    private String name;

    public Javap(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
```

* `javap -p Javap.class`: 显示所有类和成员

```javap
Compiled from "Javap.java"
public class Javap {
  private java.lang.String name;
  public Javap(java.lang.String);
  public java.lang.String getName();
}
```

* `javap -s Javap.class`: 输出内部类型签名

```javap
Compiled from "Javap.java"
public class Javap {
  public Javap(java.lang.String);
    Signature: (Ljava/lang/String;)V

  public java.lang.String getName();
    Signature: ()Ljava/lang/String;
}
```

构造函数的方法签名为`(Ljava/lang/String;)V`，getName()的方法签名为`()Ljava/lang/String;`

* `javap -l Javap.class`: 输出行号和本地变量表

```javap
Compiled from "Javap.java"
public class Javap {
  public Javap(java.lang.String);
    LineNumberTable:
      line 5: 0
      line 6: 4
      line 7: 9
    LocalVariableTable:
      Start  Length  Slot  Name   Signature
             0      10     0  this   LJavap;
             0      10     1  name   Ljava/lang/String;

  public java.lang.String getName();
    LineNumberTable:
      line 10: 0
    LocalVariableTable:
      Start  Length  Slot  Name   Signature
             0       5     0  this   LJavap;
}
```

`LineNumberTable`输出方法的行号，例如: `line m: n`，`m`为源文件中代码的行号，`n`为此行代码对应的字节码开始位置。

`LocalVariableTable`输出方法的本地变量表，含义如下:

| 选项  | 含义 |
| --- | --- |
| Start | 局部变量作用域开始位置 |
| Length | 局部变量作用域的长度 |
| Slot | 局部变量在本地变量表中的位置 |
| Name | 局部变量名称 |
| Signature | 局部变量类型签名 |

* `javap -c Javap.class`: 对代码进行反汇编

```javap
Compiled from "Javap.java"
public class Javap {
  public Javap(java.lang.String);
    Code:
       0: aload_0       
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: aload_0       
       5: aload_1       
       6: putfield      #2                  // Field name:Ljava/lang/String;
       9: return        

  public java.lang.String getName();
    Code:
       0: aload_0       
       1: getfield      #2                  // Field name:Ljava/lang/String;
       4: areturn       
}
```

`Code`中输出方法编译后字节码对应的JVM指令。

例如: 

```javap
1: getfield      #2                  // Field name:Ljava/lang/String;
```

`1`为方法中字节码位置，`getfield`为字节码对应的JVM指令，`#2`为常量池的索引，`// Field name:Ljava/lang/String;`为注释

* `javap -v Javap.class`: 输出附加信息

```javap
Classfile /Users/txazo/TxazoProject/java/target/classes/Javap.class
  Last modified 2016-9-30; size 427 bytes
  MD5 checksum b5bc00ea6a6e21e6a347636f307e4ed6
  Compiled from "Javap.java"
public class Javap
  SourceFile: "Javap.java"
  minor version: 0
  major version: 51
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #4.#18         //  java/lang/Object."<init>":()V
   #2 = Fieldref           #3.#19         //  Javap.name:Ljava/lang/String;
   #3 = Class              #20            //  Javap
   #4 = Class              #21            //  java/lang/Object
   #5 = Utf8               name
   #6 = Utf8               Ljava/lang/String;
   #7 = Utf8               <init>
   #8 = Utf8               (Ljava/lang/String;)V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               LocalVariableTable
  #12 = Utf8               this
  #13 = Utf8               LJavap;
  #14 = Utf8               getName
  #15 = Utf8               ()Ljava/lang/String;
  #16 = Utf8               SourceFile
  #17 = Utf8               Javap.java
  #18 = NameAndType        #7:#22         //  "<init>":()V
  #19 = NameAndType        #5:#6          //  name:Ljava/lang/String;
  #20 = Utf8               Javap
  #21 = Utf8               java/lang/Object
  #22 = Utf8               ()V
{
  public Javap(java.lang.String);
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=2, args_size=2
         0: aload_0       
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: aload_0       
         5: aload_1       
         6: putfield      #2                  // Field name:Ljava/lang/String;
         9: return        
      LineNumberTable:
        line 5: 0
        line 6: 4
        line 7: 9
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
               0      10     0  this   LJavap;
               0      10     1  name   Ljava/lang/String;

  public java.lang.String getName();
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0       
         1: getfield      #2                  // Field name:Ljava/lang/String;
         4: areturn       
      LineNumberTable:
        line 10: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
               0       5     0  this   LJavap;
}
```

输出中的含义如下:

| 选项 | 含义 |
| --- | --- |
| Classfile | class文件路径 |
| Last modified | 最后修改时间及大小 |
| MD5 checksum | MD5值 |
| SourceFile | 源文件名 |
| minor version | 次版本号 |
| major version | 主版本号 |
| flags | 访问标识 |
| Constant pool | 常量池 |

#### <a id="jdb">jdb</a>

Java Debugger，java的debug调试工具

jdb有两种使用方式:

* 方式一: jdb方式直接启动

`jdb org.txazo.Test`

* 方式二: attach方式连接到Java进程

以debug方式启动Java程序:

```linux
$ java -Xdebug -Xrunjdwp:transport=dt_socket,address=8787,server=y,suspend=n org.txazo.Test
```

然后，通过jdb的attach方式建立连接:

`jdb -attach 192.168.224.111:8787`

```linux
$ jdb -classpath . org.txazo.Test
正在初始化jdb...
> stop in org.txazo.Test.main
正在延迟断点org.txazo.Test.main。
将在加载类后设置。
> run
运行org.txazo.Test
设置未捕获的java.lang.Throwable
设置延迟的未捕获的java.lang.Throwable
> 
VM 已启动: 设置延迟的断点org.txazo.Test.main

断点命中: "线程=main", org.txazo.Test.main(), 行=6 bci=0

main[1] next
> 
已完成的步骤: "线程=main", org.txazo.Test.main(), 行=7 bci=2

main[1] cont
> 
应用程序已退出
```

jdb支持的常用命令:

| 命令 | 含义 |
| ---  | --- |
| run | 开始执行应用程序的主类 |
| stop in &lt;class&gt;:&lt;method&gt; | 在方法中设置断点 |
| stop at &lt;class&gt;:&lt;line&gt; | 在行中设置断点 |
| clear | 列出断点 |
| clear &lt;class&gt;:&lt;method&gt; | 清除方法中的断点 |
| clear &lt;class&gt;:&lt;line&gt; | 清除行中的断点 |
| next | 下一步, 跳过一行 |
| step  | 执行当前行 |
| stepi | 执行当前指令 |
| step up | 一直执行, 直到当前方法返回到其调用方 |
| cont | 从断点处继续执行 |
| threads | 列出线程 |
| where [&lt;thread id&gt; \| all] | 转储线程的堆栈 |
| wherei [&lt;thread id&gt; \| all] | 转储线程的堆栈以及pc信息 |
| up [n frames] | 上移线程的堆栈 |
| down [n frames] | 下移线程的堆栈 |
| locals | 输出当前堆栈帧中的所有本地变量 |
| print &lt;expr&gt; | 输出表达式的值 |
| eval &lt;expr&gt; | 对表达式求值(与print相同) |
| dump &lt;expr&gt; | 输出所有对象信息 |
| set &lt;lvalue&gt; = &lt;expr&gt; | 向字段/变量/数组元素分配新值 |
| class &lt;class&gt; | 显示类的信息 |
| methods &lt;class&gt; | 列出类的方法 |
| fields &lt;class&gt; | 列出类的字段 |
| lock &lt;expr&gt; | 输出对象的锁信息 |
| threadlocks [thread id] | 输出线程的锁信息 |
| exit \| quit | 退出调试器 |

#### <a id="jps">jps</a>

Java Process Status Tool，Java进程状态工具

* `jps`: 默认方式, 显示pid + 主类名

```linux
$ jps
42424 RemoteMavenServer
58990 Jps
42214 
```

* `jps -l`: 显示pid + 主类名全称

```linux
$ jps -l
42424 org.jetbrains.idea.maven.server.RemoteMavenServer
42214 
59015 sun.tools.jps.Jps
```

* `jps -v`: 显示pid + java参数

```linux
$ jps -v
42424 RemoteMavenServer -Djava.awt.headless=true -Didea.version==15.0.2 -Xmx512m -Didea.maven.embedder.version=3.0.5 -Dfile.encoding=UTF-8
59673 Jps -Denv.class.path=/Library/Java/JavaVirtualMachines/current.jdk/Contents/Home/lib -Dapplication.home=/Library/Java/JavaVirtualMachines/jdk1.7.0_80.jdk/Contents/Home -Xms8m
42214  -Dfile.encoding=UTF-8 -XX:+UseConcMarkSweepGC -XX:SoftRefLRUPolicyMSPerMB=50 -ea -Dsun.io.useCanonCaches=false -Djava.net.preferIPv4Stack=true -XX:+HeapDumpOnOutOfMemoryError -XX:-OmitStackTraceInFastThrow -Xverify:none -Xbootclasspath/a:../lib/boot.jar -Xms128m -Xmx750m -XX:MaxPermSize=350m -XX:ReservedCodeCacheSize=240m -XX:+UseCompressedOops -Djb.vmOptionsFile=/Applications/IntelliJ IDEA 15.app/Contents/bin/idea.vmoptions -Didea.java.redist=custom-jdk-bundled -Didea.home.path=/Applications/IntelliJ IDEA 15.app/Contents -Didea.executable=idea -Didea.paths.selector=IntelliJIdea15
```

#### <a id="jstat">jstat</a>

Java Virtual Machine Statistics Monitoring Tool，Java虚拟机统计监控工具

* 命令格式: jstat [ generalOption | outputOptions vmid [interval[s|ms] [count]]
    * ***generalOption***: -help、-options
    * ***outputOptions***: `jstat -options`输出的选项、-t、-h&lt;lines&gt;
    * ***vmid***: lvmid[@hostname[:port]/servername]，lvmid即pid
    * ***interval***: 每间隔interval[s|ms]时间输出一次
    * ***count***: 总共输出count次

`jstat -options`输出的选项:

```linux
$ jstat -options
-class
-compiler
-gc
-gccapacity
-gccause
-gcnew
-gcnewcapacity
-gcold
-gcoldcapacity
-gcpermcapacity
-gcutil
-printcompilation
```

各个options选项输出的字段含义参考 [jstat](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jstat.html)

* `jstat -class`: 类加载统计

```linux
$ jstat -class 8705
Loaded  Bytes  Unloaded  Bytes     Time   
  8233 16680.3        0     0.0      12.33
```

* `jstat -compiler`: JIT编译统计

```linux
$ jstat -compiler 8705
Compiled Failed Invalid   Time   FailedType FailedMethod
    1945      0       0    24.28          0
```

* `jstat -gc`: 堆内存和gc统计

```linux
$ jstat -gc 8705
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       PC     PU    YGC     YGCT    FGC    FGCT     GCT   
13312.0 12288.0 2560.0  0.0   117760.0 78743.0   307200.0   202786.7  49664.0 49175.5     56    0.680   0      0.000    0.680
```

* `jstat -gccapacity`: 堆内存容量统计

```linux
$ jstat -gccapacity 8705
 NGCMN    NGCMX     NGC     S0C   S1C       EC      OGCMN      OGCMX       OGC         OC      PGCMN    PGCMX     PGC       PC     YGC    FGC 
143360.0 143360.0 143360.0 11776.0 12288.0 117760.0   307200.0   307200.0   307200.0   307200.0  21504.0  83968.0  49664.0  49664.0     57     0
```

* `jstat -gccause`: 输出同`-gcutil`，多最后一次gc的原因和当前gc的原因

```linux
$ jstat -gccause 8705
  S0     S1     E      O      P     YGC     YGCT    FGC    FGCT     GCT    LGCC                 GCC                 
  0.00  11.20  94.86  66.02  99.02     57    0.685     0    0.000    0.685 Allocation Failure   No GC
```

* `jstat -gcnew`: 新生代统计

```linux
$ jstat -gcnew 8705
 S0C    S1C    S0U    S1U   TT MTT  DSS      EC       EU     YGC     YGCT  
11776.0 10752.0 3104.0    0.0  1  15 10752.0 120832.0  84236.4     58    0.692
```

* `jstat -gcnewcapacity`: 新生代容量统计

```linux
$ jstat -gcnewcapacity 8705
  NGCMN      NGCMX       NGC      S0CMX     S0C     S1CMX     S1C       ECMX        EC      YGC   FGC 
  143360.0   143360.0   143360.0  20480.0  10240.0  20480.0  10752.0   142336.0   120832.0    59     0
```

* `jstat -gcold`: 老年代统计

```linux
$ jstat -gcold 8705
   PC       PU        OC          OU       YGC    FGC    FGCT     GCT   
 49664.0  49183.4    307200.0    202874.7     59     0    0.000    0.699
```

* `jstat -gcoldcapacity`: 老年代容量统计

```linux
$ jstat -gcoldcapacity 8705
   OGCMN       OGCMX        OGC         OC       YGC   FGC    FGCT     GCT   
   307200.0    307200.0    307200.0    307200.0    60     0    0.000    0.707
```

* `jstat -gcpermcapacity`: 持久代容量统计

```linux
$ jstat -gcpermcapacity 8705
  PGCMN      PGCMX       PGC         PC      YGC   FGC    FGCT     GCT   
   21504.0    83968.0    49664.0    49664.0    60     0    0.000    0.707
```

* `jstat -gcutil`: 堆内存百分比和gc统计

```linux
$ jstat -gcutil 8705
  S0     S1     E      O      P     YGC     YGCT    FGC    FGCT     GCT   
  0.00  31.58  45.52  66.05  99.04     61    0.713     0    0.000    0.713
```

* `jstat -printcompilation`

```linux
$ jstat -printcompilation 8705
Compiled  Size  Type Method
    2042      5    1 com/dianping/mobile/framework/io/ResponseContent getStatusCode
```

* `jstat ... interval count`: 每间隔`interval`ms输出一次，总共输出`count`次

```linux
$ jstat -gcnew -t 8705 1000 5
Timestamp        S0C    S1C    S0U    S1U   TT MTT  DSS      EC       EU     YGC     YGCT  
          682.9 8192.0 8704.0    0.0 2336.0  1  15 8192.0 125440.0  45636.5     63    0.723
          683.9 8192.0 8704.0    0.0 2336.0  1  15 8192.0 125440.0  48214.4     63    0.723
          685.0 8192.0 8704.0    0.0 2336.0  1  15 8192.0 125440.0  48434.1     63    0.723
          686.0 8192.0 8704.0    0.0 2336.0  1  15 8192.0 125440.0  48434.2     63    0.723
          687.0 8192.0 8704.0    0.0 2336.0  1  15 8192.0 125440.0  48436.5     63    0.723
```

#### <a id="jconsole">jconsole</a>

Java Monitoring and Management Console，Java监视和管理控制台

包括以下几部分:

* CPU占用率
* 堆内存使用
* 类加载
* 线程
* VM概要
* MBean

使用方式:

* `jconsole`
* `jconsole pid`
* `jconsole host:port`

```linux
-Dcom.sun.management.jmxremote.port=9999
-Dcom.sun.management.jmxremote.authenticate=false
-Dcom.sun.management.jmxremote.ssl=false
```

#### <a id="jvisualvm">jvisualvm</a>

Java监控、分析和故障排除工具

* `jvisualvm`

#### <a id="jstack">jstack</a>

Java Stack Trace，Java堆栈跟踪

* `jstack <pid>`: 打印线程栈
* `jstack -l <pid>`: 打印详细的线程栈

#### <a id="jmap">jmap</a>

Java Memory Map，Java内存映射

* `jmap -heap <pid>`: 打印堆的摘要信息

```linux
$ jmap -heap 8705

using thread-local object allocation.
Parallel GC with 4 thread(s)

Heap Configuration:
   MinHeapFreeRatio = 0
   MaxHeapFreeRatio = 100
   MaxHeapSize      = 461373440 (440.0MB)
   NewSize          = 146800640 (140.0MB)
   MaxNewSize       = 146800640 (140.0MB)
   OldSize          = 5439488 (5.1875MB)
   NewRatio         = 2
   SurvivorRatio    = 5
   PermSize         = 21757952 (20.75MB)
   MaxPermSize      = 85983232 (82.0MB)
   G1HeapRegionSize = 0 (0.0MB)

Heap Usage:
PS Young Generation
Eden Space:
   capacity = 138412032 (132.0MB)
   used     = 82236344 (78.42668914794922MB)
   free     = 56175688 (53.57331085205078MB)
   59.41415844541608% used
From Space:
   capacity = 4194304 (4.0MB)
   used     = 0 (0.0MB)
   free     = 4194304 (4.0MB)
   0.0% used
To Space:
   capacity = 3670016 (3.5MB)
   used     = 0 (0.0MB)
   free     = 3670016 (3.5MB)
   0.0% used
PS Old Generation
   capacity = 314572800 (300.0MB)
   used     = 33263096 (31.72216033935547MB)
   free     = 281309704 (268.27783966064453MB)
   10.574053446451822% used
PS Perm Generation
   capacity = 73924608 (70.5MB)
   used     = 50952240 (48.59184265136719MB)
   free     = 22972368 (21.908157348632812MB)
   68.92459950548538% used

20314 interned Strings occupying 2436648 bytes.
```

* `jmap [-F] -histo[:live] <pid>`: 打印堆的柱状图，包括实例数、内存大小和类型签名

```linux
$ jmap -histo:live 8705 | head -10

 num     #instances         #bytes  class name
----------------------------------------------
   1:         75439       13235696  [C
   2:         84708       12940176  <constMethodKlass>
   3:         84708       10852976  <methodKlass>
   4:          8309        9851872  <constantPoolKlass>
   5:         23323        6850288  [B
   6:          8309        5941736  <instanceKlassKlass>
   7:          6762        5411264  <constantPoolCacheKlass>
```

* `jmap [-F] -dump:[live,]format=b,file=<filename> <pid>`: 以hprof二进制格式转储堆到文件，之后使用jhat或MAT进行分析

> 注: `-F`代表强制执行，`live`代表只统计存活的对象

#### <a id="jhat">jhat</a>

Java Heap Analysis Tool，Java堆分析工具，用于分析堆转储文件

格式: jhat [options] <heap-dump-file\>

options:

* -stack <bool\>: 对象内存分配调用栈跟踪开关，默认开
* -refs <bool\>: 对象引用跟踪开关，默认开
* -port <port\>: 设置HTTP Server的端口号，默认为7000
* -baseline <file\>: 指定基准堆转储，用于比较两个堆转储
* -debug <int\>: 设置debug级别，0不输出调试信息，1和2输出调试信息

`jhat -port 7888 heap.bin`

浏览器访问 [http://127.0.0.1:7888](http://127.0.0.1:7888) 查看分析结果

![堆转储分析结果](/images/java/jhat.png =540x)

#### <a id="jinfo">jinfo</a>

Java Configuration Info，Java配置信息

* `jinfo <pid>`: 输出Java系统属性和JVM参数
* `jinfo -flag <name> <pid>`: 输出指定名称的JVM参数的值

```linux
$ jinfo -flag NewSize 8705
-XX:NewSize=146800640
```

* `jinfo -flag [+|-]<name> <pid>`: 启用/禁用指定名称的JVM参数

```linux
$ jinfo -flag +PrintGC 8705
$ jinfo -flag PrintGC 8705
-XX:+PrintGC
$ jinfo -flag -PrintGC 8705
$ jinfo -flag PrintGC 8705
-XX:-PrintGC
```

* `jinfo -flag <name>=<value> <pid>`: 设置指定名称的JVM参数的值

```linux
$ jinfo -flag MaxHeapFreeRatio 8705
-XX:MaxHeapFreeRatio=100
$ jinfo -flag MaxHeapFreeRatio=80 8705
-XX:MaxHeapFreeRatio=80
```

* `jinfo -flags <pid>`: 输出JVM参数

```linux
$ jinfo -flags 8705
-Djava.util.logging.config.file=/Users/txazo/Library/Caches/IntelliJIdea15/tomcat/Unnamed_txazo_3/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Xms440m -Xmx440m -XX:NewSize=140m -XX:MaxNewSize=140m -XX:SurvivorRatio=5 -Dcom.sun.management.jmxremote= -Dcom.sun.management.jmxremote.port=1099 -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false -Djava.rmi.server.hostname=127.0.0.1 -Djava.endorsed.dirs=/usr/local/tomcat/endorsed -Dcatalina.base=/Users/txazo/Library/Caches/IntelliJIdea15/tomcat/Unnamed_txazo_3 -Dcatalina.home=/usr/local/tomcat -Djava.io.tmpdir=/usr/local/tomcat/temp
```

* `jinfo -sysprops <pid>`: 输出Java系统属性

```linux
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

```linux
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

#### <a id="jcmd">jcmd</a>

* `jcmd [-l]`: 输出所有Java进程状态，同`jps -ml`

```linux
$ jcmd -l
45576 com.intellij.rt.execution.application.AppMain JstatTest
45552 org.apache.catalina.startup.Bootstrap start
24265 org.jetbrains.idea.maven.server.RemoteMavenServer
```

* `jcmd <pid | main class> PerfCounter.print`: 输出进程的性能计数器

```linux
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

```linux
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

```linux
$ jcmd 8705 VM.flags
8705:
-XX:InitialHeapSize=461373440 -XX:+ManagementServer -XX:MaxHeapSize=461373440 -XX:MaxNewSize=146800640 -XX:NewSize=146800640 -XX:SurvivorRatio=5 -XX:+UnlockCommercialFeatures -XX:+UseCompressedOops -XX:+UseParallelGC
```

* `jcmd <pid | main class> VM.flags -all`: 输出所有JVM支持的参数

```linux
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

```linux
$ jcmd 8705 VM.command_line
8705:
VM Arguments:
jvm_args: -Djava.util.logging.config.file=/Users/txazo/Library/Caches/IntelliJIdea15/tomcat/Unnamed_txazo_3/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Xms440m -Xmx440m -XX:NewSize=140m -XX:MaxNewSize=140m -XX:SurvivorRatio=5 -Dcom.sun.management.jmxremote= -Dcom.sun.management.jmxremote.port=1099 -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false -Djava.rmi.server.hostname=127.0.0.1 -Djava.endorsed.dirs=/usr/local/tomcat/endorsed -Dcatalina.base=/Users/txazo/Library/Caches/IntelliJIdea15/tomcat/Unnamed_txazo_3 -Dcatalina.home=/usr/local/tomcat -Djava.io.tmpdir=/usr/local/tomcat/temp 
java_command: org.apache.catalina.startup.Bootstrap start
Launcher Type: SUN_STANDARD
```

* `jcmd 0 <command>`: 输出所有Java进程相关信息

```linux
$ jcmd 0 VM.version
46642:
Java HotSpot(TM) 64-Bit Server VM version 24.80-b11
JDK 7.0_80
24060:
OpenJDK 64-Bit Server VM version 25.40-b25
JDK 8.0_40
```

#### <a id="jmc">jmc</a>

Java Mission Control，Java任务控制

* `jmc`

#### <a id="jfr">jfr</a>

Java Flight Recorder，Java飞行记录器

```linux
java -XX:+UnlockCommercialFeatures -XX:+FlightRecorder -XX:StartFlightRecording=duration=60s,filename=myrecording.jfr MyApp
```
