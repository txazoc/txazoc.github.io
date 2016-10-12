---
layout: topic
module: JDK
title:  jdb
---

Java Debugger，java的debug调试工具

jdb有两种使用方式:

* 方式一: jdb方式直接启动

`jdb org.txazo.Test`

* 方式二: attach方式连接到Java进程

以debug方式启动Java程序:

```console
$ java -Xdebug -Xrunjdwp:transport=dt_socket,address=8787,server=y,suspend=n org.txazo.Test
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
