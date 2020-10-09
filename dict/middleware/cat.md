---
layout: home
title:  Cat
date:   2020-09-24
tags:   [cat]
---

#### Cat消息类型

* T\|A: Transaction，事务
* E: Event，事件
* L: Trace，跟踪
* M: Metric，度量
* H: Heartbeat，心跳

#### Cat客户端处理流程

* 初始化消息上下文`Context`(ThreadLocal实现)
* 构建消息树`MessageTree`
* 消息树添加到异步消息队列`MessageQueue`
* 消息出队、编码
* Netty发送消息

#### Cat服务端处理流程

* Netty接收消息
* 消息解码
* 消息分发、异步消费(队列)
* 消息转储到文件或HDFS
* 生成统计数据存入MySQL
