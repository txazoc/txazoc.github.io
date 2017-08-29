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

![依赖关系](/images/dubbo/dubbo_relation.jpg)

#### 监控中心

* count://127.0.0.1:8080/org.test.IndexService/index?provider=127.0.0.1:20881
* 定时上传汇总数据
    * 当前时间戳
    * 调用成功次数
    * 调用失败次数
    * 调用总耗时，用于计算平均耗时
    * 当前并发数
    * 最大调用耗时
    * 最大并发数

#### 集群容错

* failover: 失败转移，当出现失败，重试其它服务器，通常用于读操作，但重试会带来更长延迟
* failfast: 快速失败，只发起一次调用，失败立即报错，通常用于非幂等性的写操作
* failsafe: 失败安全，出现异常时，直接忽略，通常用于写入审计日志等操作
* failback: 失败自动恢复，后台记录失败请求，定时重发，通常用于消息通知操作
    * 可调度线程池
* forking: 并行调用，只要一个成功即返回，通常用于实时性要求较高的操作，但需要浪费更多服务资源
    * 线程池 + 阻塞队列

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
* LeastActive: 最小活跃数
    * 筛选最小活跃数集合
        * 权重相同: 随机
        * 权重不同: 权重随机
* ConsistentHash: 一致性哈希
    * 节点hash
        * 节点url -&gt; 分组hash -&gt; 160个虚拟节点 -&gt; TreeMap
    * 调用hash
        * 调用方法的参数 -&gt; hash
    * 选择节点
        * TreeMap查找比调用hash大的最小虚拟节点

#### 拦截器

**Consumer拦截器**

* ConsumerContextFilter: Consumer上下文拦截器
    * ThreadLocal保存上下文对象RpcContext
* ActiveLimitFilter: 并发限流拦截器，配置`actives`才启用
    * actives = 10
    * 并发计数器: AtomicInteger
    * 达到最大并发数限制，wait直到
        * 当前并发数小于最大并发数，继续执行
        * 超时抛出异常
* FutureFilter: Future拦截器
* MonitorFilter: 监控拦截器

**Provider拦截器**

* ContextFilter
* ExecuteLimitFilter: 并发限流拦截器，配置`actives`才启用
    * actives = 10
    * 并发计数器: AtomicInteger
    * 达到最大并发数限制，直接抛异常
* AccessLogFilter: 访问日志拦截器，配置`accesslog`才启用
    * accesslog = /var/log/dubbo/access.log
    * 组装日志
    * 添加日志到日志缓冲，每个日志文件限制5000条缓冲日志
    * 定时刷新日志缓冲到文件
* TimeoutFilter: 超时拦截器
    * 执行超时，记录warn日志
* MonitorFilter: 监控拦截器
* ExceptionFilter: 异常拦截器
    * 包装异常
* TpsLimitFilter: tps限流拦截器

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

![线程模型](/images/dubbo/dubbo_protocol.jpg)
