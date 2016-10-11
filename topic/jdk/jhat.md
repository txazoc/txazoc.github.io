---
layout: topic
module: jdk
title:  jhat
---

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
