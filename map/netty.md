---
layout: map
title:  Netty
---

#### Netty处理流程

**Server启动**

* NioEventLoopGroup bossGroup
    * NioEventLoop[]
        * Selector selector
        * Queue taskQueue
        * Queue scheduledTaskQueue
    * chooser: NioEventLoop选择器
* NioEventLoopGroup workerGroup: 同上
* new NioServerSocketChannel: 后面用ServerChannel代替
    * SelectableChannel ch: java nio的Channel
    * int readInterestOp: SelectionKey.OP_ACCEPT
    * EventLoop eventLoop
    * Unsafe unsafe: I/O操作实现
    * DefaultChannelPipeline pipeline
        * ChannelHandlerContext head
            * ChannelHandlerContext next
                * ChannelHandler handler
                * boolean inbound
                * boolean outbound
            * ChannelHandlerContext prev
        * ChannelHandlerContext tail
* ServerChannel的pipeline添加ChannelInitializer
    * ChannelInitializer.initChannel()，此处为方法描述，暂未执行
        * pipeline添加自定义Handler
        * pipeline添加ServerBootstrapAcceptor
* 从bossGroup中选择一个NioEventLoop
    * 启动NioEventLoop线程
    * ServerChannel的ServerSocketChannel注册到NioEventLoop的selector
    * pipeline.`fireChannelRegistered()`
        * ...
        * ChannelInitializer.fireChannelRegistered(): 添加Handler
            * pipeline.addLast(handler)
                * handler.`handlerAdded()`
            * pipeline.remove(this)
                * handler.`handlerRemoved()`
            * pipeline.fireChannelRegistered(): pipeline改变
        * ...
* pipeline.`bind()`
    * ServerChannel的ServerSocketChannel的ServerSocket绑定端口
    * pipeline.`fireChannelActive()`
        * head.fireChannelActive()
            * ctx.fireChannelActive()，传递给下一个Handler
            * pipeline.`read()`: fireChannelActive()执行完成后
                * ...
                * unsafe.beginRead()
                    * selectionKey.interestOps(SelectionKey.OP_ACCEPT)，注册ACCEPT事件，开始接收Client端连接
        * ...
* channel().closeFuture().sync()
    * wait()

**Client启动**

* NioEventLoopGroup workerGroup: 同上
* new NioSocketChannel: 后面用SocketChannel代替
    * int readInterestOp: SelectionKey.OP_READ
    * 其它同NioServerSocketChannel
* SocketChannel的pipeline添加自定义Handler
* 从workerGroup中选择一个NioEventLoop
    * 启动NioEventLoop线程
    * SocketChannel的java SocketChannel注册到NioEventLoop的selector
    * pipeline.`fireChannelRegistered()`
        * 同Server启动
* pipeline.`connect()`
    * SocketChannel的java SocketChannel的Socket连接远程主机
    * selectionKey.interestOps(SelectionKey.OP_CONNECT)，注册CONNECT事件
* channel().closeFuture().sync()
    * wait()
* NioEventLoop.processSelectedKey()
    * SelectionKey.OP_CONNECT
        * interestOps(ops & ~SelectionKey.OP_CONNECT): 移除OP_CONNECT事件
        * pipeline.`fireChannelActive()`
            * head.fireChannelActive()
                * ctx.fireChannelActive()，传递给下一个Handler
                * pipeline.`read()`: fireChannelActive()执行完成后
                    * ...
                    * unsafe.beginRead()
                        * selectionKey.interestOps(SelectionKey.OP_READ)，注册READ事件，开始接收Server端消息
            * ...

**Server接收连接**

* ServerChannel.eventLoop.processSelectedKey()
    * SelectionKey.OP_ACCEPT
        * accept新的连接SocketChannel
        * 创建对应的NioSocketChannel: 后面用SocketChannel代替
            * int readInterestOp: SelectionKey.OP_READ
            * 其它同NioServerSocketChannel
        * pipeline.fireChannelRead(NioSocketChannel)
            * ServerBootstrapAcceptor.fireChannelRead()
                * NioSocketChannel的pipeline添加自定义Handler
                * 从workerGroup中选择一个NioEventLoop
                    * 启动NioEventLoop线程
                    * SocketChannel的java SocketChannel注册到NioEventLoop的selector
                    * pipeline.fireChannelRegistered()
                        * 同上
                    * pipeline.fireChannelActive()
                        * 同上

**Server/Client读写**

#### Handler

**Server启动**

```console
handlerAdded: 添加Handler
channelRegistered: 注册Selector
bind: 绑定端口
channelActive: Channel激活
read: 监听accept事件
```

**Server Accept**

```console
// ServerSocketChannel
channelReadComplete: accept完成
read: 什么都不做

// SocketChannel(accept -> register)
handlerAdded: 添加Handler
channelRegistered: 注册Selector
channelActive: Channel激活
read: 监听read事件
```

**Client启动**

```console
handlerAdded: 添加Handler
channelRegistered: 注册Selector
connect: 连接远程主机
channelActive: Channel激活
read: 监听read事件
```

**Read**

```console
// read到ByteBuf
fireChannelRead: 处理read的数据
fireChannelReadComplete: read结束
```

#### Netty Read

* NioEventLoop.processSelectedKey()
    * SelectionKey.OP_READ
    * unsafe.read()
    * 分配DirectBuffer
    * 读数据到DirectBuffer
    * pipeline.fireChannelRead(ByteBuf): 读完一个ByteBuf
    * DirectBuffer释放，重复使用
    * pipeline.fireChannelReadComplete(): 一次Channel Read完成

#### Netty Write

* channel.write()
    * pipeline.write()
    * inEventLoop()
        * next.write()
    * !inEventLoop()
        * channel.eventLoop.execute(WriteTask)
    * ...
    * Unsafe.write()
        * ByteBuf转换为DirectBuffer
        * 添加到ChannelOutboundBuffer(写缓冲区)
    * Unsafe.flush()
        * 写ChannelOutboundBuffer中数据

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

**NioEventLoop线程循环**

* 时间分配
    * ioRatio == 100
        * processSelectedKeys()
        * runAllTasks()
    * ioRatio != 100
        * processSelectedKeys(): 执行时间ioTime，默认为50，1:1
        * runAllTasks(ioTime * (100 - ioRatio) / ioRatio)
* processSelectedKeys()
    * processSelectedKey()
        * (SelectionKey.OP_READ | SelectionKey.OP_ACCEPT
            * unsafe.read()
        * SelectionKey.OP_WRITE
            * unsafe().forceFlush()
        * SelectionKey.OP_CONNECT
            * unsafe.finishConnect()
* runAllTasks()
    * fetchFromScheduledTaskQueue(): 从调度任务队列中获取即将执行的任务添加到taskQueue
    * taskQueue.poll()
    * 全部执行或是直到达到执行限制时间

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
* int handlerState: 状态

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

#### ChannelInitializer

```java
public abstract class ChannelInitializer<C extends Channel> extends ChannelInboundHandlerAdapter {

    protected abstract void initChannel(C ch) throws Exception;

    @Override
    public final void channelRegistered(ChannelHandlerContext ctx) throws Exception {
        // 调用initChannel()添加自定义Handler
        initChannel((C) ctx.channel());
        // 删除当前Handler
        ctx.pipeline().remove(this);
        // 重新执行pipeline.fireChannelRegistered()
        ctx.pipeline().fireChannelRegistered();
    }

}
```

#### ByteBuf

#### Promise
