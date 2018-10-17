---
layout: arch
title:  19-单服务器高性能模式：Reactor与Proactor
---

#### Reactor

Reactor = I/O多路复用 + 线程池

Reactor模式组成:

* Reactor
    * 监听
    * 分配
* 线程池: 处理请求

三种Reactor方案:

* 单Reactor单线程
* 单Reactor多线程
* 多Reactor多线程

完整的Reactor流程:

* MainReactor select()连接事件，dispatch给Acceptor
* Acceptor accept()新的连接，dispatch给SubReactor
* SubReactor select()读事件
* 业务线程池处理请求
* SubReactor select()写事件

#### Proactor
