---
layout: map
title:  日志系统
---

#### 日志框架

* 日志实现框架
    * Log4j
    * Log4j2: 性能最佳
    * Logback
    * Jdk Logging
* 日志门面框架
    * Slf4j
    * JCL(Commons Logging)
* 日志框架组合适配推荐
    * 实现: Log4j2
    * 门面: Slf4j
    * 桥接
        * JCL -&gt; jcl-over-slf4j -&gt; Slf4j
        * Log4j -&gt; log4j-1.2-api -&gt; Log4j2
        * og4j-slf4j-impl -&gt; Slf4j
    * jar包冲突

#### 日志来源

* 应用服务器
    * 控制台日志
    * 访问日志
* 框架
    * 框架日志
* 应用
    * 业务日志

#### 日志级别

* debug
* info
* warn
* error

#### 日志输出格式

* 时间
* 机器ip
* 日志级别
* 线程名
* 日志名
* 标签
* 日志消息
* 异常

#### 日志输出方式

* 同步日志
* 异步日志

#### 日志输出

* 控制台
* 文件
* 远程服务器

#### 日志收集

* 日志文件 -&gt; copy 日志中心
* 远程日志

#### 日志查询分析

* ElasticSearch

#### Log4j2
