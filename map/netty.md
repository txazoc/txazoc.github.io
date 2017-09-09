---
layout: map
title:  Netty
---

#### Netty处理流程

**Server端启动**

**Server端连接**

**Client端连接**

**Channel读写**

#### NioEventLoopGroup

* 线程池
    * bossGroup: 主线程池
        * 负责ServerSocketChannel相关的任务和I/O事件
    * workerGroup: 工作线程池
        * 负责SocketChannel相关的任务和I/O事件
* 数据结构
    * EventExecutor[] children: 事件执行器
        * 实现类: NioEventLoop
    * EventExecutorChooser chooser: 事件执行器选择器
* 核心操作
    * next(): 返回下一个事件执行器

```java
@Override
public EventExecutor next() {
    return chooser.next();
}
```

```java
private class GenericEventExecutorChooser {

    private final AtomicInteger idx = new AtomicInteger();
    private final EventExecutor[] executors;

    @Override
    public EventExecutor next() {
        return executors[Math.abs(idx.getAndIncrement() % executors.length)];
    }

}
```

#### NioEventLoop

* I/O线程
* 数据结构
    * Selector selector: 选择器
    * Queue taskQueue: 任务队列
    * Queue scheduledTaskQueue: 调度任务队列
    * int ioRatio = 50: I/O时间占比
    * Thread thread: 当前线程
    * Executor executor: 执行器，用于启动NioEventLoop
        * 实现类: ThreadPerTaskExecutor

```java
private void doStartThread() {
    executor.execute(new Runnable() {

        @Override
        public void run() {
            thread = Thread.currentThread();
            // 即NioEventLoop.run()
            SingleThreadEventExecutor.this.run();
        }

    });
}
```

#### ChannelPipeline

* ChannelHandler管道
* 实现类: DefaultChannelPipeline

**DefaultChannelPipeline**

* AbstractChannelHandlerContext head: 头节点
* AbstractChannelHandlerContext tail: 尾节点
* Channel channel: 通道

```java
protected DefaultChannelPipeline(Channel channel) {
    tail = new TailContext(this);
    head = new HeadContext(this);

    head.next = tail;
    tail.prev = head;
}
```

**DefaultChannelHandlerContext**

* ChannelHandler handler: 处理器
* AbstractChannelHandlerContext next: 前一节点
* AbstractChannelHandlerContext prev: 后一节点
* boolean inbound: 是否inbound
* boolean outbound: 是否outbound

**HeadContext**

* 继承自AbstractChannelHandlerContext
* 继承自ChannelInboundHandler
* 继承自ChannelOutboundHandler
* inbound=false, outbound=true

**TailContext**

* 继承自AbstractChannelHandlerContext
* 继承自ChannelInboundHandler
* inbound=true, outbound=false

**ChannelPipeline中ChannelHandler处理顺序**

```console
                                           [ Channel.write() ]
                                                    |
+---------------------------------------------------+---------------+
|                           ChannelPipeline         |               |
|                                                  \|/              |
|    +---------------------+            +-----------+----------+    |
|    | Inbound Handler  N  |            | Outbound Handler  1  |    |
|    +----------+----------+            +-----------+----------+    |
|              /|\                                  |               |
|               |                                  \|/              |
|    +----------+----------+            +-----------+----------+    |
|    | Inbound Handler N-1 |            | Outbound Handler  2  |    |
|    +----------+----------+            +-----------+----------+    |
|              /|\                                  .               |
|               .                                   .               |
| ChannelHandlerContext.fireIN_EVT() ChannelHandlerContext.OUT_EVT()|
|        [ method call]                       [method call]         |
|               .                                   .               |
|               .                                  \|/              |
|    +----------+----------+            +-----------+----------+    |
|    | Inbound Handler  2  |            | Outbound Handler M-1 |    |
|    +----------+----------+            +-----------+----------+    |
|              /|\                                  |               |
|               |                                  \|/              |
|    +----------+----------+            +-----------+----------+    |
|    | Inbound Handler  1  |            | Outbound Handler  M  |    |
|    +----------+----------+            +-----------+----------+    |
|              /|\                                  |               |
+---------------+-----------------------------------+---------------+
                |                                  \|/
+---------------+-----------------------------------+---------------+
|               |                                   |               |
|       [ Socket.read() ]                    [ Socket.write() ]     |
|                                                                   |
|  Netty Internal I/O Threads (Transport Implementation)            |
+-------------------------------------------------------------------+
```

* Inbound: 状态改变后的回调事件
    * 事件通知 -&gt; head -&gt; tail
* Outbound: I/O操作
    * tail -&gt; head -&gt; Unsafe

```java
public class DefaultChannelPipeline {

    @Override
    public final ChannelPipeline fireChannelRead() {
        // Inbound, 先由head处理
        AbstractChannelHandlerContext.fireChannelRead(head);
        return this;
    }

    @Override
    public final ChannelPipeline read() {
        // Outbound, 先由tail处理
        tail.read();
        return this;
    }

}
```

```java
// 可同时处理Inbound和Outbound
final class HeadContext extends AbstractChannelHandlerContext
        implements ChannelOutboundHandler, ChannelInboundHandler {

    private final Channel.Unsafe unsafe;

    @Override
    public void read(ChannelHandlerContext ctx) {
        // 最后一个处理Outbound, 交给Unsafe处理
        unsafe.beginRead();
    }

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        // 第一个处理Inbound, 传递给下一个Handler处理
        ctx.fireChannelRead(msg);
    }

}
```

```java
// 只处理Inbound
final class TailContext extends AbstractChannelHandlerContext implements ChannelInboundHandler {

    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        // 最后一个处理Inbound, 一般什么都不做
        // 释放
        onUnhandledInboundMessage(msg);
    }

}
```

#### Channel

**ServerSocketChannel**

* 实现类: NioServerSocketChannel

**SocketChannel**

* 实现类: NioSocketChannel

**SocketChannel通用数据结构**

* ChannelId id
* Unsafe unsafe
* DefaultChannelPipeline pipeline
* EventLoop eventLoop
* SelectableChannel ch: 即SocketChannel
* int readInterestOp: 注册事件类型

```java
protected AbstractNioChannel(Channel parent, SelectableChannel ch, int readInterestOp) {
    super(parent);
    this.ch = ch;
    this.readInterestOp = readInterestOp;
    try {
        ch.configureBlocking(false);
    } catch (IOException e) {
    }
}
```

```java
protected AbstractChannel(Channel parent) {
    id = newId();
    unsafe = newUnsafe();
    pipeline = newChannelPipeline();
}
```

#### ServerBootstrap启动

```java
// 绑定端口
bootstrap.bind(port)

private ChannelFuture doBind(final SocketAddress localAddress) {
    // 初始化并注册Channel
    ChannelFuture regFuture = initAndRegister();

    if (regFuture.isDone()) {
        // 绑定端口
        doBind0(regFuture, channel, localAddress, promise);
    }
}

final ChannelFuture initAndRegister() {
    // 反射实例化Channel
    final Channel channel = channelFactory.newChannel();
    try {
        // 初始化Channel
        init(channel);
    } catch (Throwable t) {
    }
    // 注册Channel
    ChannelFuture regFuture = group().register(channel);
    return regFuture;
}

void init(Channel channel) throws Exception {
    // 设置Options
    synchronized (options) {
        channel.config().setOptions(options);
    }

    ChannelPipeline p = channel.pipeline();
    // 添加Handler
    p.addLast(new ChannelInitializer<Channel>() {

        @Override
        public void initChannel(Channel ch) throws Exception {
            ChannelPipeline pipeline = ch.pipeline();
            ChannelHandler handler = config.handler();
            if (handler != null) {
                // 添加自定义Handler
                pipeline.addLast(handler);
            }
            // 添加ServerBootstrapAcceptor
            pipeline.addLast(new ServerBootstrapAcceptor(
                    currentChildGroup, currentChildHandler, currentChildOptions, currentChildAttrs));
        }

    });
}

// NioEventLoop
public ChannelFuture register(final ChannelPromise promise) {
    promise.channel().unsafe().register(this, promise);
    return promise;
}

private void register0(ChannelPromise promise) {
    doRegister();
    // ChannelRegistered事件
    pipeline.fireChannelRegistered();
}

protected void doRegister() throws Exception {
    for (; ; ) {
        try {
            // Channel的javaChannel注册到Channel的NioEventLoop的selector
            // attachment为Channel自身
            selectionKey = javaChannel().register(eventLoop().selector, 0, this);
            return;
        } catch (CancelledKeyException e) {
        }
    }
}

private static void doBind0() {
    channel.eventLoop().execute(new OneTimeTask() {
        @Override
        public void run() {
            channel.bind(localAddress, promise);
        }
    });
}

public ChannelFuture bind(SocketAddress localAddress, ChannelPromise promise) {
    return pipeline.bind(localAddress, promise);
}

public final ChannelFuture bind(SocketAddress localAddress, ChannelPromise promise) {
    return tail.bind(localAddress, promise);
}

public void bind() {
    unsafe.bind(localAddress, promise);
}

public final void bind(final SocketAddress localAddress, final ChannelPromise promise) {
    doBind(localAddress);

    if (!wasActive && isActive()) {
        invokeLater(new OneTimeTask() {
            @Override
            public void run() {
                // ChannelActive事件
                pipeline.fireChannelActive();
            }
        });
    }
}

protected void doBind(SocketAddress localAddress) throws Exception {
    // ServerSocket绑定端口
    javaChannel().socket().bind(localAddress, config.getBacklog());
}
```

#### ByteBuf

#### Promise
