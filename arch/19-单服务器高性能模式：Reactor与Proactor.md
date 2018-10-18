---
layout: arch
title:  19-单服务器高性能模式：Reactor与Proactor
---

#### Reactor

Reactor = I/O多路复用 + 线程池

Reactor模式组成:

* Reactor
    * 注册: register(ACCEPT、READ、WRITE)
    * 监听: select
    * 分配: dispatch
* 线程池: 处理请求

三种Reactor方案:

* 单Reactor单线程: Redis
* 单Reactor多线程
* 多Reactor多线程

完全的Reactor流程:

* MainReactor: select()连接事件，dispatch给Acceptor
* Acceptor: accept()新的连接，dispatch给SubReactor
* SubReactor: select()读事件
* 业务线程池: 处理请求
* SubReactor: select()写事件

#### Proactor
