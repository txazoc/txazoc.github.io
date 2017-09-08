---
layout: map
title:  Netty
---

#### NioEventLoop

* 主要数据结构
    * Selector selector
    * Queue taskQueue
    * Queue scheduledTaskQueue

#### NioEventLoopGroup

* 主要数据结构
    * EventExecutor[] children: NioEventLoop
    * EventExecutorChooser chooser

#### ChannelPipeline

* DefaultChannelPipeline
    * AbstractChannelHandlerContext head: HeadContext
    * AbstractChannelHandlerContext tail: TailContext
    * Channel channel
* DefaultChannelHandlerContext
    * AbstractChannelHandlerContext next
    * AbstractChannelHandlerContext prev
    * boolean inbound
    * boolean outbound
    * ChannelHandler handler
    * EventExecutor executor

#### Channel

#### ByteBuf

#### Promise
