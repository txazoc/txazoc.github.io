---
layout: topic
module: 性能优化
title:  Reactor模式
date:   2017-02-16
---

#### BIO多线程模型

* 方式一: 主线程accept新的连接，每个连接创建一个线程进行处理
* 方式二: 主线程accept新的连接，丢给线程池处理

#### Reactor单线程模型

* Acceptor线程accept新的连接
* Reactor线程处理读写

#### Reactor多线程模型

#### Reactor主从多线程模型

* MainReactor: 注册accept事件
* Acceptor: accept新的连接，注册read事件
* SubReactor: 分发read、write
* Task Queue: 任务队列
* Thread Pool: 任务执行线程池

<img src="/images/topic/performance/reactor.png" style="width: 480px" title="Reactor模式" />
