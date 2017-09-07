---
layout: map
title:  Dubbo
---

#### 注册中心

* Zookeeper
    * notify
    * unregister
* Provider
    * register
* Consumer
    * register
    * subscribe
* Monitor
    * subscribe

Zookeeper注册中心

* 临时节点
* register &lt;-&gt; unregister
* subscribe &lt;-&gt; notify

![Zookeeper注册中心](/images/dubbo/dubbo_zookeeper.jpg)

Dubbo依赖关系

![Dubbo依赖关系](/images/dubbo/dubbo_relation.jpg)

#### 集群容错

* failover: 失败转移，当出现失败，重试其它服务器，通常用于读操作，但重试会带来更长延迟
* failfast: 快速失败，只发起一次调用，失败立即报错，通常用于非幂等性的写操作
* failsafe: 失败安全，出现异常时，直接忽略，通常用于写入审计日志等操作
* failback: 失败自动恢复，后台记录失败请求，定时重发，直到成功，通常用于消息通知操作
    * 可调度线程池
* forking: 并行调用，只要一个成功即返回，通常用于实时性要求较高的操作，但需要浪费更多服务资源
    * 可缓存线程池 + 阻塞队列
* broadcast: 广播调用，逐个调用，任意一台报错则报错，返回最后一个结果或异常，通常用于通知所有提供者更新缓存或日志等本地资源信息

![集群容错](/images/dubbo/dubbo_cluster.jpg)

* merge: 集群容错结合invoke
* list: 节点列表
* route: 路由规则，节点过滤
* select: 选择节点，负载均衡
* invoke: 调用

#### 负载均衡

* Random: 随机
    * 权重相同
        * Random.nextInt(length)
    * 权重不同: 权重随机
        * Random.nextInt(totalWeight)
        * 权重列表、乱序权重列表
* RoundRobin: 轮询
    * 权重相同
        * AtomicInteger.getAndIncrement() % length
    * 权重不同: 权重轮询
        * AtomicInteger.getAndIncrement() % totalWeight
        * 权重列表、乱序权重列表
* LeastActive: 最少活跃调用数(最少并发)
    * 筛选出活跃调用数最少的节点集合
        * 权重相同: 随机
        * 权重不同: 权重随机
* ConsistentHash: 一致性哈希
    * 节点
        * 节点url -&gt; 分组hash -&gt; 160个虚拟节点(hash环) -&gt; TreeMap
    * 调用
        * 方法参数 -&gt; hash -&gt; hash值
    * 选择节点
        * 顺时针方向选择最近的虚拟节点
        * TreeMap中查找比hash值大的最小虚拟节点

#### 拦截器

**Consumer拦截器**

* ConsumerContextFilter: Consumer上下文拦截器
    * ThreadLocal中上下文对象RpcContext初始化
* ActiveLimitFilter: 并发限流拦截器
    * 开启拦截器: actives=100
    * 并发计数
        * 执行前: AtomicInteger.incrementAndGet()
        * 执行后: AtomicInteger.decrementAndGet()
    * 最大并发拦截
        * wait直到
            * 超时抛出异常
            * 当前并发数小于最大并发数
* FutureFilter: Future拦截器
    * 回调处理
        * 同步
            * 直接回调
        * 异步
            * future注册return回调和throw回调
    * 回调类型
        * invoke回调
            * oninvoke.method、oninvoke.instance
        * return回调
            * onreturn.method、onreturn.instance
        * throw回调
            * onthrow.method、onthrow.instance
* MonitorFilter: 监控拦截器
    * 收集: 成功/失败、调用耗时、当前并发数
    * 汇总
        * 汇总纬度: application/service/method/client/server
        * 汇总信息: 调用成功次数、调用失败次数、调用总耗时、当前并发数、最大调用耗时、最大并发数
    * 定时(默认60s)上报监控中心

**Provider拦截器**

* ContextFilter: 上下文拦截器
    * ThreadLocal中上下文对象RpcContext初始化
* TpsLimitFilter: tps限流拦截器
    * META-INF/dubbo/com.alibaba.dubbo.rpc.Filter
        * tps=com.alibaba.dubbo.rpc.filter.TpsLimitFilter
    * 配置tps限流规则
        * tps=1000，间隔时间内最大调用次数
        * tps.interval=10000，间隔时间
    * tps限流器
        * long lastResetTime: 最近一次复位时间
        * AtomicInteger token: 令牌数
    * 复位: now > lastResetTime + tps.interval
        * token.set(tps)
        * lastResetTime = now
    * 获取令牌
        * 自旋直到CAS成功或value为0
            * value = token.get()
            * token.compareAndSet(value, value - 1)
    * 令牌获取失败
        * 抛出异常
* ExecuteLimitFilter: 并发限流拦截器
    * 开启拦截器: executes=100
    * 并发计数
        * 执行前: AtomicInteger.incrementAndGet()
        * 执行后: AtomicInteger.decrementAndGet()
    * 最大并发拦截
        * 抛出异常
* AccessLogFilter: 访问日志拦截器
    * 开启拦截器: accesslog=/var/log/dubbo/access.log
    * 组装日志
    * 写日志到日志缓冲区
    * 日志缓冲区
        * ConcurrentHashSet: 去重
        * 大小限制5000
    * 定时(5s)刷新缓冲区中日志到日志文件
    * 访问日志格式

```console
[2017-08-30 11:08:30] 10.32.66.148:64189 -> 10.32.66.148:20881 - test.dubbo.service.VersionService getVersion(int) [1156]
```

* TimeoutFilter: 超时拦截器
    * 执行超时: 记录warn日志
* MonitorFilter: 同上
* ExceptionFilter: 异常拦截器
    * 包装异常并记录日志

#### 通信协议

* dubbo(默认)
    * 单一长连接(可以配置多连接)
    * NIO
    * 适合小数据量高并发
    * 适合消费者远大于提供者
    * 默认hessian序列化
* rmi
* hessian
* thrift
* webservice
* http
* memcached
* redis

#### 远程调用过程

* 服务代理
    * 动态代理: jdk、javassist
* InvokerInvocationHandler
    * 创建RpcInvocation
* MockClusterInvoker
    * no-mock
        * invoke
    * force-mock
        * doMockInvoke
    * fail-mock
        * invoke -&gt; 失败 -&gt; doMockInvoke
* 集群容错Invoker
    * 获取服务的节点列表
    * 节点列表应用路由规则
    * 负载均衡选择节点
    * 集群容错
* Consumer拦截器
    * ConsumerContextFilter: 设置RpcContext
    * ActiveLimitFilter: 并发限流
    * FutureFilter: 处理同步/异步返回的Future
    * MonitorFilter: 收集调用信息
* 协议
* DubboInvoker
    * 同步
        * future.get()等待返回结果
    * 异步
        * RpcContext.getContext().setFuture(future)
* HeaderExchangeChannel
    * 创建Request
    * 创建DefaultFuture并绑定channel
    * 发送Request
* Encode Request
    * ExchangeCodec.encodeRequest()
    * DubboCodec.encodeRequestData()
* Netty write
* 网络传输
* Netty read
* Decode Request
    * ExchangeCodec.decode()
    * DubboCodec.decodeBody()
* Provider拦截器
    * ContextFilter: 设置RpcContext
    * ExecuteLimitFilter: 并发限流
    * AccessLogFilter: 记录访问日志
    * TimeoutFilter: 记录超时日志
    * MonitorFilter: 收集调用信息
    * ExceptionFilter: 包装异常
* 调用服务实现: 反射

#### 编码解码

* Request
    * id: 请求id，id = AtomicLong.getAndIncrement()
    * version: dubbo版本号
    * flag: 标识
    * RpcInvocation: Rpc调用
        * String methodName: 方法名
        * Class<?>[] parameterTypes: 参数类型
        * Object[] arguments: 参数
        * Map<String, String> attachments: 额外信息
            * path: 服务path
            * interface: 服务接口
            * version: 服务版本号
            * timeout: 超时时间
* Response
    * id: 响应id，id = Request.id
    * version: dubbo版本号，version = Request.version
    * status: 状态码
    * flag: 标识
    * errorMessage: 错误信息
    * RpcResult: Rpc结果
        * Object result: 结果
        * Throwable exception: 异常
        * Map<String, String> attachments: 额外信息
* Request编码格式
    * header
        * 0 ~ 1: 魔数，`0xdabb`
        * 2: flag
        * 4 ~ 11: 8字节，Request.id
        * 12 ~ 15: 4字节，data长度
    * data
        * dubbo版本号
        * 服务path
        * 服务版本号
        * 方法名
        * 参数类型
        * 参数: 序列化
        * 额外信息: 序列化
* Response编码格式
    * header
        * 0 ~ 1: 魔数，`0xdabb`
        * 2: flag
        * 3: status
        * 4 ~ 11: 8字节，Response.id
        * 12 ~ 15: 4字节，data长度
    * data
        * status == Response.OK
            * exception != null
                * 0: 1字节
                * exception: 序列化
            * result != null
                * 1: 1字节
                * result: 序列化
            * result == null
                * 2: 1字节
        * else
            * errorMessage

#### 序列化/反序列化

* dubbo
* hessian2(默认)
* json
* fastjson
* java
* nativejava
* compactedjava

#### 线程模型

![线程模型](/images/dubbo/dubbo_protocol.jpg)

#### 异步调用

![异步调用](/images/dubbo/dubbo_async.jpg)

#### 日志适配

* 适配日志框架(缺省查找顺序)
    * Log4j
    * Slf4j
    * JCL
    * JUL
