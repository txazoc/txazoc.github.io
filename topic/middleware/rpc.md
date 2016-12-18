---
layout: topic
module: 中间件
title:  RPC服务
date:   2016-11-29
---

* IO(BIO NIO AIO)
* 网络协议: TCP
* 数据格式: xml json 自定义
* 原理: 反射 动态代理
* 服务注册 负载均衡 心跳检测 监控 限流 降级

#### 美团点评分布式服务框架 Pigeon

* ServiceLoader机制

#### 注册

* 注册中心: zookeeper
* 服务提供者: 服务注册 注销
* 服务消费者: 服务发现

#### 服务调用

* tcp长连直连
* 负载均衡
* 
