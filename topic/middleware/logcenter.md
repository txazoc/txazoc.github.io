---
layout: topic
module: 中间件
title:  日志中心
date:   2016-12-14
---

主要介绍下美团点评日志中心 - LogCenter

#### 背景

* 各业务使用不同的日志组件和日志规范，不统一
* 日志组件同步日志造成性能瓶颈
* 日志分布到多台机器，定位麻烦
* 无法快速进行日志查询
* 无日志监控和报警

#### 统一日志规范

***日志级别规范***

* DEBUG: 开发、调试使用，`线上环境禁用`
* INFO: 重要的业务日志
* WARN: 一般问题，业务处理流程可以继续，例如异常、业务处理失败
* ERROR: 系统发生严重问题，必须马上进行处理，例如数据库不可用、NullPointerException，`ERROR日志继续接入ERROR监控`

***日志弱格式规范***

日志分为三部分: prefix、tags、message

* prefix
* tags
* message

***日志组件规范***

使用`SLF4J`作为日志的API，不直接使用其它各日志组件API

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(LogTest.class);

    public static void main(String[] args) {
        LOGGER.info("params: {} {}", 1, 2);
    }

}
```

#### 封装日志SDK

封装日志SDK

* 使用Log4j 2作为日志实现
* 提供磁盘日志和远程日志两种写日志方式
* 异步实现，彻底杜绝阻塞业务线程
* 控制整体磁盘占用量，避免刷爆磁盘

为兼容其它日志组件的API

![日志中心](/images/topic/middleware/logcenter/log.png =480x)

Log4j 2配置文件示例:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="warn">

    <Appenders>
        <!-- 控制台日志 -->
        <Console name="ConsoleAppender" target="SYSTEM_OUT">
            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%p] %t %c - %msg%n" />
        </Console>

        <!-- info文件日志 -->
        <XMDFile name="INFO-LOG" fileName="info.log" xmdFilePath="/data/applogs">
            <Filters>
                <ThresholdFilter level="error" onMatch="DENY" onMismatch="NEUTRAL" />
                <ThresholdFilter level="warn" onMatch="DENY" onMismatch="NEUTRAL" />
                <ThresholdFilter level="info" onMatch="ACCEPT" onMismatch="DENY" />
            </Filters>
        </XMDFile>

        <!-- warn文件日志 -->
        <XMDFile name="WARN-LOG" fileName="warn.log" xmdFilePath="/data/applogs">
            <Filters>
                <ThresholdFilter level="error" onMatch="DENY" onMismatch="NEUTRAL" />
                <ThresholdFilter level="warn" onMatch="ACCEPT" onMismatch="DENY" />
            </Filters>
        </XMDFile>

        <!-- error文件日志 -->
        <XMDFile name="ERROR-LOG" fileName="error.log" xmdFilePath="/data/applogs">
            <ThresholdFilter level="error" onMatch="ACCEPT" onMismatch="DENY" />
        </XMDFile>

        <!-- 监控中心日志 -->
        <CatAppender name="CatAppender" />

        <!-- 远程日志 -->
        <Scribe name="ScribeAppender">
            <LcLayout />
        </Scribe>

        <Async name="ScribeAsyncAppender" blocking="false">
            <AppenderRef ref="ScribeAppender" />
        </Async>
    </Appenders>

    <Loggers>
        <Logger name="debug" level="debug" additivity="false">
            <AppenderRef ref="ConsoleAppender" />
        </Logger>

        <Logger name="com.dianping.mobile" level="info" additivity="false">
            <AppenderRef ref="INFO-LOG" />
            <AppenderRef ref="WARN-LOG" />
            <AppenderRef ref="ERROR-LOG" />
            <AppenderRef ref="CatAppender" />
            <AppenderRef ref="ScribeAsyncAppender" />
        </Logger>

        <Root level="info">
            <AppenderRef ref="INFO-LOG" />
            <AppenderRef ref="WARN-LOG" />
            <AppenderRef ref="ERROR-LOG" />
            <AppenderRef ref="CatAppender" />
        </Root>
    </Loggers>

</Configuration>
```

![日志中心](/images/topic/middleware/logcenter/logcenter.png =540x)
