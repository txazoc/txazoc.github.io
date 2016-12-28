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

#### SPI

ServiceLoader

#### 注册

* 注册中心: zookeeper
* 服务提供者: 服务注册 注销
* 服务消费者: 服务发现

#### 服务调用

* tcp长连直连
* 负载均衡

#### 服务降级

#### 负载均衡

* failfast: 调用一个节点的服务失败后, 抛出异常, 可配超时重试
* failover: 调用一个节点的服务失败后, 尝试调用另一个节点的服务
* failsafe: 调用服务失败后, 返回空对象
* forking: 同时调用所有节点的服务, 取最快返回的结果(线程池 + 阻塞队列)

#### 调用模式

* sync: 同步调用
* future: 异步调用
* callback: 回调
* oneway: 只发送请求, 不处理返回结果

#### 网络通信

* Http
* Netty

#### 序列化和反序列化

* Java
* Json
* Hessian
* Thrift
* Protobuf

![序列化和序列化](/images/topic/middleware/rpc/serialize.png =540x)
