---
layout: map
title:  日志系统
---

#### 日志框架

* 日志实现框架
    * Log4j
    * Log4j2: 性能最佳
    * Logback
    * JUL(java.util.logging)
* 日志门面框架
    * Slf4j
    * JCL(Commons Logging)
* 日志框架组合适配推荐
    * 门面: Slf4j
    * 实现: Log4j2
    * 桥接
        * JUL -&gt; `jul-to-slf4j` -&gt; Slf4j
        * JCL -&gt; `jcl-over-slf4j` -&gt; Slf4j
        * Log4j -&gt; `log4j-1.2-api` -&gt; Log4j2
        * Slf4j -&gt; `log4j-slf4j-impl` -&gt; Log4j2
    * jar包冲突: 移除或exclude

#### 日志来源

* 服务器
    * 启动运行日志
    * 访问日志
* 框架
    * 框架日志
* 应用
    * 业务日志

#### 日志级别

debug -&gt; info -&gt; warn -&gt; error

#### 日志输出格式

* 时间
* 机器(主机名、IP)
* 线程名
* 日志级别
* 日志名
* 标签: 键值对
* 消息
* 异常

日志格式示例:

2017-08-23 12:00:00.000 [127.0.0.1] [main] [INFO] [org.test.LogTest] - [[id=1,name=root]]
this is message
java.lang.RuntimeException . . .

#### 日志输出方式

* 同步
* 异步

#### 日志输出目的地

* 控制台
* 本地文件
* 远程主机

#### 日志收集

* 离线收集: 本地日志文件 -&gt; copy -&gt; 日志中心
* 实时收集: 日志 -&gt; Kafka/Logstash -&gt; 日志中心

#### 日志查询分析

* ElasticSearch: 日志索引
* Kibana: 日志查询分析

#### Log4j2

* Logger
    * Root: 根日志
    * Logger: 命名空间
* Appender
    * ConsoleAppender
    * FileAppender
    * RollingFileAppender
    * KafkaAppender
    * AsyncAppender
        * BlockingQueue + AsyncThread
    * 自定义Appender
* Filter: 过滤器
    * ThresholdFilter
