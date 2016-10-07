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

#### <a id="java">java</a>

启动Java应用程序，参见 [java命令](/jvm/jvm-java-command.html)

例如:

* `java org.txazo.Test`，启动运行类
* `java -jar test.jar`，启动运行jar包

#### <a id="javac">javac</a>

编译Java源文件为class字节码文件

例如，`javac org.txazo.Test.java`，编译生成`Test.class`字节码文件

#### <a id="javadoc">javadoc</a>

从Java源文件生成API文档

#### <a id="jar">jar</a>

操纵jar包

* `jar -cvf test.jar *`: 打jar包
* `jar -tvf test.jar`: 列出jar包中文件
* `jar -uvf test.jar test.txt`: 更新文件到jar包
* `jar -xvf test.jar`: 解压jar包

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

```console
java -Xdebug -Xrunjdwp:transport=dt_socket,address=8787,server=y,suspend=n org.txazo.Test
```

然后，通过jdb的attach方式建立连接:

`jdb -attach 192.168.224.111:8787`



```console
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

显示当前所有Java进程的pid

* `jps`: 默认方式, 显示pid + 主类名

```console
42424 RemoteMavenServer
58990 Jps
42214 
```

* `jps -l`: 显示pid + 主类名全称

```console
42424 org.jetbrains.idea.maven.server.RemoteMavenServer
42214 
59015 sun.tools.jps.Jps
```

* `jps -v`: 显示pid + java参数

```console
42424 RemoteMavenServer -Djava.awt.headless=true -Didea.version==15.0.2 -Xmx512m -Didea.maven.embedder.version=3.0.5 -Dfile.encoding=UTF-8
59673 Jps -Denv.class.path=/Library/Java/JavaVirtualMachines/current.jdk/Contents/Home/lib -Dapplication.home=/Library/Java/JavaVirtualMachines/jdk1.7.0_80.jdk/Contents/Home -Xms8m
42214  -Dfile.encoding=UTF-8 -XX:+UseConcMarkSweepGC -XX:SoftRefLRUPolicyMSPerMB=50 -ea -Dsun.io.useCanonCaches=false -Djava.net.preferIPv4Stack=true -XX:+HeapDumpOnOutOfMemoryError -XX:-OmitStackTraceInFastThrow -Xverify:none -Xbootclasspath/a:../lib/boot.jar -Xms128m -Xmx750m -XX:MaxPermSize=350m -XX:ReservedCodeCacheSize=240m -XX:+UseCompressedOops -Djb.vmOptionsFile=/Applications/IntelliJ IDEA 15.app/Contents/bin/idea.vmoptions -Didea.java.redist=custom-jdk-bundled -Didea.home.path=/Applications/IntelliJ IDEA 15.app/Contents -Didea.executable=idea -Didea.paths.selector=IntelliJIdea15
```

#### <a id="jstat">jstat</a>

Java Virtual Machine Statistics Monitoring Tool，监控Java虚拟机的统计数据

* 命令格式: jstat [ generalOption | outputOptions vmid [interval[s|ms] [count]]
    * ***generalOption***: -help、-options
    * ***outputOptions***: `jstat -options`输出的选项、-t、-h&lt;lines&gt;
    * ***vmid***: lvmid[@hostname[:port]/servername]，lvmid即pid
    * ***interval***: 每间隔interval[s|ms]时间输出一次
    * ***count***: 总共输出count次

`jstat -options`输出的选项:

```console
~ jstat -options
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

各个options选项的输出字段含义参考 [jstat](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jstat.html)

* `jstat -class`: 类加载统计

```console
> jstat -class 63413
Loaded  Bytes  Unloaded  Bytes     Time   
  8269 16738.6        0     0.0      19.51
```

* `jstat -compiler`: HotSpot的JIT编译器编译统计

```console
> jstat -compiler 63413
Compiled Failed Invalid   Time   FailedType FailedMethod
    2618      0       0    57.18          0
```

* `jstat -gc`: 堆的大小和gc统计

```console
> jstat -gc 63413
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       PC     PU    YGC     YGCT    FGC    FGCT     GCT   
43008.0 21504.0  0.0   21249.3 517120.0 359146.4  156160.0   129677.5  49664.0 49428.3     19    1.227   1      0.283    1.511
```

* `jstat -gccapacity`: 堆中各个代的内存统计

```console
> jstat -gccapacity 63413 1000 10
 NGCMN    NGCMX     NGC     S0C   S1C       EC      OGCMN      OGCMX       OGC         OC      PGCMN    PGCMX     PGC       PC     YGC    FGC 
 44032.0 699392.0 556544.0 22016.0 38400.0 449536.0    87040.0  1397760.0   156160.0   156160.0  21504.0  83968.0  49664.0  49664.0     22     1
```

* `jstat -gccause`: 同`-gcutil`，多出最后一次gc的原因和当前gc的原因

```console
> jstat -gccause 63413
  S0     S1     E      O      P     YGC     YGCT    FGC    FGCT     GCT    LGCC                 GCC                 
  0.00  98.60  15.28  83.04  99.59     27    1.586     1    0.283    1.870 Allocation Failure   No GC
```

* `jstat -gcnew`
* `jstat -gcnewcapacity`
* `jstat -gcold`
* `jstat -gcoldcapacity`
* `jstat -gcpermcapacity`

* `jstat -gcutil`: 堆中各个代已使用内存的百分比和gc统计

```console
> jstat -gcutil 63413 1000 10
  S0     S1     E      O      P     YGC     YGCT    FGC    FGCT     GCT   
 98.49   0.00   1.55  83.04  99.57     24    1.470     1    0.283    1.754
```

* `jstat -printcompilation`
* `jstat ... interval count`: 每间隔`interval`ms输出一次，总共输出`count`次

```console
> jstat -class -t 63413 1000 5
Timestamp       Loaded  Bytes  Unloaded  Bytes     Time   
         2833.4   8269 16738.6        0     0.0      19.51
         2834.4   8269 16738.6        0     0.0      19.51
         2835.4   8269 16738.6        0     0.0      19.51
         2836.4   8269 16738.6        0     0.0      19.51
         2837.4   8269 16738.6        0     0.0      19.51
```

#### <a id="jconsole">jconsole</a>

`jconsole pid`

```console
-Dcom.sun.management.jmxremote.port=9999
-Dcom.sun.management.jmxremote.authenticate=false
-Dcom.sun.management.jmxremote.ssl=false
```

`jconsole 127.0.0.1:9999`

#### <a id="jvisualvm">jvisualvm</a>

#### <a id="jstack">jstack</a>

打印Java线程栈

`jstack pid`

* `jstack pid`: 打印线程栈
* `jstack -F pid`: 强制打印线程栈
* `jstack -l pid`: 打印详细的线程栈
* `jstack -m pid`: 打印Java和C++的混合栈
