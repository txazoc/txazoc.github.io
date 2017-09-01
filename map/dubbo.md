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
    * 线程池 + 阻塞队列
* broadcast: 广播调用，逐个调用，任意一台报错则报错，通常用于通知所有提供者更新缓存或日志等本地资源信息

![集群容错](/images/dubbo/dubbo_cluster.jpg)

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
    * 筛选最少活跃调用数的节点集合
        * 权重相同: 随机
        * 权重不同: 权重随机
* ConsistentHash: 一致性哈希
    * 节点hash
        * 节点url -&gt; 分组hash -&gt; 160个虚拟节点 -&gt; TreeMap
    * 调用hash
        * 调用方法的参数 -&gt; hash
        * 相同参数的请求总是发到同一提供者
    * 选择节点
        * TreeMap查找比调用hash大的最小虚拟节点

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
    * 异常包装并记录日志

#### 远程调用过程

* 服务代理
    * 动态代理: jdk、javassist
* InvokerInvocationHandler
    * 创建RpcInvocation
    * invoke
* MockClusterInvoker
    * no-mock
        * invoke
    * force-mock
        * doMockInvoke
    * fail-mock
        * invoke -&gt; 失败 -&gt; doMockInvoke
* 集群容错Invoker
    * 负载均衡选节点
    * 集群容错
    * invoke
* Consumer拦截器
    * ConsumerContextFilter: 设置RpcContext
    * ActiveLimitFilter: 并发限流
    * FutureFilter: 处理同步/异步返回的Future
    * MonitorFilter: 收集调用信息
* DubboInvoker
    * 同步
        * future.get()等待返回结果
    * 异步
        * RpcContext.getContext().setFuture(future)
* HeaderExchangeChannel
    * 创建Request
    * 创建DefaultFuture并绑定channel
    * 发送Request
* Netty write
* 网络传输
* Netty read
* HeaderExchangeHandler
    * 创建Response
        * Response.id = Request.id
* Provider拦截器
    * ContextFilter: 设置RpcContext
    * ExecuteLimitFilter: 并发限流
    * AccessLogFilter: 记录访问日志
    * TimeoutFilter: 记录超时日志
    * MonitorFilter: 收集调用信息
    * ExceptionFilter: 包装异常
* 调用服务实现: 反射

#### 调用模型

* 代理: jdk、javassist
* [集群容错](#集群容错)
* [负载均衡](#负载均衡)
* [拦截器](#拦截器)
* 协议
* 通信框架: netty、mina
* 编码/解码
* 序列化/反序列化
* 线程池
* [拦截器](#拦截器)
* 实现

#### 线程模型

![线程模型](/images/dubbo/dubbo_protocol.jpg)

#### 同步/异步

![异步调用](/images/dubbo/dubbo_async.jpg)

#### 日志适配

* 适配日志框架(缺省查找顺序)
    * Log4j
    * Slf4j
    * JCL
    * JUL
