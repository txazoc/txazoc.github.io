---
layout: topic
module: Linux
title:  I/O模型
date:   2017-02-12
---

先给出I/O模型涉及到的几个概念:

* ***同步(sync)***: 操作执行完成后才返回
* ***异步(async)***: 调用立即返回，操作执行完成后发送通知或回调
* ***阻塞(blocking)***: 线程等待
* ***非阻塞(non-blocking)***: 线程不用等待

同步和异步关注调用是否等待操作执行完成才返回，阻塞和非阻塞关注线程是否等待

***I/O分类***

* `BIO`: 同步阻塞I/O
* `NIO`: 同步非阻塞I/O
* `AIO`: 异步非阻塞I/O

***5种I/O模型***

* 阻塞式I/O: BIO
* 非阻塞式I/O: NIO
* I/O多路复用: NIO
* 信号驱动I/O: NIO
* 异步I/O: AIO

#### 阻塞式I/O

以Socket的recv()为例:

* recv()调用
* `阻塞`: 等待接收缓冲区中的数据准备就绪
* `同步`: 数据从内核空间copy到用户空间

阻塞式I/O是最传统的I/O模型，需要一个线程处理一个连接

***Tomcat I/O模型***: 主线程负责accept连接，工作线程池负责处理请求

#### 非阻塞式I/O

以Socket(设置为非阻塞)的recv()为例:

* recv()调用
* `非阻塞`: 接收缓冲区中的数据未准备就绪，调用立即返回
* `同步`: 接收缓冲区中的数据准备就绪，数据从内核空间copy到用户空间

非阻塞式I/O需要不断轮询，消耗CPU，很少使用

#### I/O多路复用

以Socket的recv()为例:

* select()调用等待有可读的套接字(接收缓冲区中的数据准备就绪)
* recv()调用
* `非阻塞`: 接收缓冲区中的数据已准备就绪
* `同步`: 数据从内核空间copy到用户空间

I/O多路复用的优点是一个线程可以处理多个连接，

***I/O多路复用应用***: Ngin、Java NIO、Reactor模式

#### 信号驱动I/O

用的很少，略过

#### 异步I/O

以Linux的aio_read()为例:

* aio_read()调用
* `非阻塞`: 提交异步io请求，调用返回
* `异步`: 内核等待接收缓冲区中的数据准备就绪，将数据从内核空间copy到用户空间，然后回调

可以总结出:

* 阻塞I/O和非阻塞I/O: 内核数据准备就绪阶段
* 同步I/O和异步I/O: 数据从内核空间copy到用户空间阶段

#### I/O多路复用实现

I/O多路复用的原理是一个线程管理多个Socket，有三种实现: select、poll、epoll

***select***

* 最大连接数有限制，默认为1024
* 线程不安全

***poll***

* 最大连接数无限制
* 线程不安全

***epoll***

* 线程安全
* 事件驱动模型

select和poll需要自己不断轮询所有fd集合，epoll基于事件回调

select和poll的IO效率会随着fd数量增加而线性下降，epoll则不会

#### Reactor模式

![Reactor模式](/images/topic/linux/reactor.png =480x)

* MainReactor: 注册accept事件
* Acceptor: accept新的连接，注册read事件
* SubReactor: 分发read、write
* Task Queue: 任务队列
* Thread Pool: 任务执行线程池