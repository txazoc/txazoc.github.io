---
layout: topic
module: 中间件
title:  RPC
date:   2016-11-29
---

#### RPC分层

* proxy: 服务代理
* registry: 服务注册与发现
* cluster: 集群容错、负载均衡、服务降级
* monitor: 服务监控
* protocol: 远程调用协议
* transport: 网络传输
* serialize: 序列化与反序列化

#### 服务注册与发现

* 注册中心: Zookeeper注册中心、Redis注册中心
* 服务提供者: 服务注册
* 服务消费者: 服务发现

服务消费者 - TCP长连接 - 服务提供者

#### 监控中心

* 服务提供者 -> 监控中心
* 服务消费者 -> 监控中心

#### 心跳和重连

服务消费者 - 心跳检测 - 服务提供者

#### 服务限流

依赖于线程池的限流

#### 服务降级

* 自动降级
* 开关降级

#### 集群容错

* failfast: 快速失败，调用一个节点的服务失败后，立即抛出异常
* failover: 失败自动切换，调用一个节点的服务失败后，尝试调用另一个节点的服务，可配最大失败重试次数
* failsafe: 失败安全，调用一个节点的服务失败后，直接忽略，返回空对象
* forking: 并行调用多个节点的服务，取最快返回的结果(线程池 + 阻塞队列)，可配最大并行数

#### 负载均衡

* Random: 随机(权重)
* RoundRobin: 轮询(权重)
* LeastActive: 最少活跃调用数
* ConsistentHash: 一致性Hash

#### 调用模式

推荐: 异步 + Future

* sync: 同步调用
* future: 异步调用
* callback: 回调
* oneway: 只发送请求，不处理返回结果

#### 序列化协议

* Java
* Json
* Hessian
* Thrift
* Protobuf

#### Netty

Reactor模式

#### I/O模型

* BIO
* NIO
* AIO

#### 网络协议

TCP长连接
