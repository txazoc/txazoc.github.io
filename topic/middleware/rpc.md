---
layout: topic
module: 中间件
title:  RPC
date:   2016-11-29
---

#### 模块加载

SPI: ServiceLoader

#### 服务注册与发现

* 注册中心: Zookeeper、Redis
* 服务提供者: 服务注册、注销
* 服务消费者: 服务发现
* 客户端 - TCP长连 - 服务端
* 监控中心

#### 心跳和重连

#### 服务限流

依赖于线程池的限流

#### 服务降级

#### 集群容错

* failfast: 调用一个节点的服务失败后，抛出异常，可配超时重试
* failover: 调用一个节点的服务失败后，尝试调用另一个节点的服务
* failsafe: 调用服务失败后，返回空对象
* forking: 同时调用所有节点的服务，取最快返回的结果(线程池 + 阻塞队列)

#### 负载均衡

* Random: 随机
* RoundRobin: 轮询
* Consistent Hash: 一致性Hash

#### 调用模式

* sync: 同步调用
* future: 异步调用
* callback: 回调
* oneway: 只发送请求，不处理返回结果

#### 序列化和反序列化

* Java
* Json
* Hessian
* Thrift
* Protobuf

![序列化和序列化](/images/topic/middleware/rpc/serialize.png =540x)

#### Netty线程模型

***客户端***

***服务端***

#### I/O模型

* BIO
* NIO
* AIO

#### 网络协议

* TCP
