### 面试

#### 算法

* 数组: 交换
* 双指针: 同方向、两边向中间、中间向两边、速率
* 重复问题: 排序、hash、位数组
* 位操作: 位数组、与、或、异或、掩码
* 链表: 递归、迭代、反转、折半
* 树: 递归、迭代+栈
* 分治
* 动态规划
* 字母: 26个int
* 列表: i累计结果
* 辅助数据结构: 哈希表、栈
* 高级数据结构: 优先队列、前缀树

#### Java

* 红黑树
    * 5条性质、高度(`O(logn)`)、最大高度不会超过最小高度的2倍
    * 增删改查最坏的时间复杂度: `O(logn)`
    * 牺牲部分平衡性来换取插入/删除时少量的旋转操作
* Object
    * hashCode(): 哈希表
    * equals(): 哈希表(==或equals)
    * toString()
* HashMap为啥是2的幂: 减少碰撞(hash & 1111)、与运算(取模)
* ConcurrentHashMap(jdk8)
    * hash(): h ^ (h >>> 16)
    * put: 数组(cas + volatile)、synchronized、链表(红黑树)
    * get: 数组(volatile)、value(volatile)
* 线程栈状态: NEW、RUNNABLE、BLOCKED、WAITING、TIMED_WAITING、TERMINATED
* 线程池: 五大核心参数、四种拒绝策略
    * 单线程线程池、固定大小线程池、可缓存线程池、调度线程池、自定义线程池
    * 线程池中线程不要对外抛出异常(导致线程销毁/创建)
* 调度线程池: DelayedWorkQueue、优先级队列
* 线程数大小: CPU密集型(CPU * 1 ~ 2)、IO密集型(最佳线程数目 = ((线程等待时间 + 线程CPU时间) / 线程CPU时间) * CPU核心数)
* String & StringBuffer & StringBuilder
    * String: 不可变字符串、final
    * StringBuffer/StringBuilder: 可变字符串、扩容
    * StringBuffer: 线程安全
* Future: 等待队列、park/unpark
* IO: 5种IO模型、NIO(同步非阻塞IO)
* BIO & NIO
* 序列化对比: jdk序列化、xml、json、Hessian、Thrift/ProtoBuf，时间、空间、描述文件、友好、跨平台
* 原子性、可见性、有序性
* volatile: 可见性(缓存一致性协议)、禁止指令重排序(内存屏障)
* CAS: 原子性(总线锁定、读改写)、禁止指令重排序、自旋CAS
* AQS: state、CAS、CLH同步队列、park/unpark、独占/共享
* 双重检查锁: 重排序问题、volatile、单例未初始化之前对外暴露
* synchronized & Lock
    * 加解锁: 隐式加锁解锁(关键字、monitorenter、monitorexit、ACC_SYNCHRONIZED方法标识)、显式加锁解锁(代码)
    * 用法: synchronized(三种用法)、lock/lockInterruptibly/tryLock/tryLock(time)
    * 锁类型: 锁升级(偏向锁、轻量级锁、自旋锁、重量级锁)、公平锁/非公平锁/读写锁
    * 优化: synchronized(锁消除、锁粗化)
    * 实现
        * synchronized: 对象头、偏向锁(CAS 对象头`Thread Id`)、轻量级锁(CAS 对象头`Mark Word`)、自旋锁(轻量级锁重试)、重量级锁(监视器锁、block阻塞队列、wait等待队列)
        * Lock: AQS(CAS state、CLH同步队列park/unpark)、公平锁(抢占)/非公平锁(排队)/读写锁(state=高低位读锁写锁数量)
    * 等待/唤醒: 一个wait/notify等待队列、多个Condition等待队列
* 多线程同步: 不可变对象、局部变量、ThreadLocal、volatile、CAS(原子类)、锁、AQS(Semaphore、CountDownLatch、CyclicBarrier)、wait/notify、Condition.await/signal、join、concurrent包
* Java命令: jstack、jmap、jhat
* Reference
    * DirectByteBuffer -> Cleaner(虚引用、记录分配内存的基地址和大小)
        * System.gc()
* 设计模式: 工厂模式、单例模式、建造者模式、装饰器模式、代理模式、职责链模式、模板方法模式、策略模式
* 进程 & 线程
    * 进程: 资源分配的最小单位
    * 线程: 程序执行的最小单位
    * 内存、CPU切换开销、通信

#### JVM

* JVM内存结构: 程序计数器(字节码指令)、Java虚拟机栈(栈帧、局部变量表、操作数栈)、本地方法栈、堆(对象)、方法区(类、常量池)(Metaspace、永久代)、直接内存
* `类加载`
    * 触发: 第一次、new、调用static方法、访问static变量、反射、ClassLoader.loadClass()
    * 双亲委派、.class字节码、类文件格式(解析验证)
    * 准备: 类静态变量分配内存空间、静态基本类型常量赋值
    * 初始化: 先初始化父类、静态代码块、静态变量、静态引用类型常量
* `对象初始化`: 分配内存空间、父类构造代码块/成员变量、父类构造方法、子类...
* GC Roots: 线程栈帧(方法参数、局部变量)、本地方法栈、方法区(static变量、常量池、Class)、JVM全局引用
* 垃圾收集算法: 复制、标记-整理、标记-清除、分代
* young gc为什么快: 扫描对象少(线程栈 + Dirty Card)、存活对象少(copy少)
* 8种垃圾收集器:
    * Serial、Serial Old、ParNew、Parallel Scavenge、Parallel Old、CMS、G1
    * 新生代/老年代、串行/并行/并发、STW、垃圾收集算法
    * 垃圾收集器组合
* CMS: 4个过程
* 内存分配
    * 新生代: 新的对象
    * 老年代: 长期存活晋级的对象、大对象、Minor GC空间分配担保
* Minor GC
    * 新生代eden内存空间不足
    * -XX:+CMSScavengeBeforeRemark: 在执行CMS Remark前执行一次Young GC，减少GC Roots的数量，降低Remark的开销
    * Full GC时会先触发Minor GC，适用于吞吐量收集器
* Full GC
    * System.gc()
    * 老年代空间不足
    * 永久代空间/Metaspace不足
    * 针对吞吐量收集器，Minor GC前，老年代剩余空间小于历史晋升到老年代对象的平均大小
    * CMS GS promotion failed，Minor GC时，晋升对象/担保对象进入老年代，因碎片问题，无法分配内存空间，触发CMS Full GC
    * CMS GS concurrent mode failure，CMS GC时，大对象直接进入老年代，老年代空间不足，此时CMS GC退化为Serial Old GC
* JVM调优
    * 调优目标: gc时间少、gc频率低、吞吐量大、停顿时间少
    * 调什么: 代码层面(对象)、垃圾收集器选择、参数调整(内存大小及比例、线程数、其它)
* JVM参数调优
    * -Xms、-Xmx、-XX:NewRatio=2、-XX:SurvivorRatio=8
    * -XX:PermSize、-XX:MaxPermSize
    * -XX:MetaspaceSize、-XX:MaxMetaspaceSize
    * -XX:MaxTenuringThreshold=15
    * GC收集器选择
    * GC收集器配置: -XX:ParallelGCThreads、-XX:MaxGCPauseMillis、-XX:GCTimeRatio
    * GC日志
    * -XX:HeapDumpOnOutOfMemoryError
* jstack/kill -3
* CMS & G1
    * 内存碎片问题、复制算法
    * CMS GC退化为Serial Old GC
    * 停顿时间: 全量GC 部分GC
* Metaspace
    * 容易出现内存泄漏
    * 增加full gc的开销(gc扫描、gc压缩)
    * 字符串常量池、静态变量移至堆中
    * Metaspace内存动态调整
* 内存泄漏: 无用对象未被释放，不能被gc回收
    * 自增长的静态集合
    * 未关闭资源(数据库连接、网络连接、IO流)
    * 字符串常量池: String.intern()、字面常量字符串
    * 线程池中的ThreadLocal
    * DirectByteBuffer
* 内存溢出OOM: +HeapDumpOnOutOfMemoryError、jmap、jhat、MAT
    * 内存泄漏导致OOM
    * 栈OOM: -Xss、深递归、大循环
    * 堆OOM: 堆太小、高并发、大对象、大查询、自增长的静态集合
    * 方法区OOM: 加载过多的类
    * 直接内存OOM: DirectByteBuffer、-XX:MaxDirectMemorySize

#### 网络通信

* TCP: 全双工、三次握手、四次挥手、滑动窗口、分组/重组、重传
* TCP直连、HTTP连接池(长连接)
* HTTP: 半双工
* Http请求全过程: 域名解析 -> ip -> tcp三次握手 -> http请求报文 -> 处理 -> http响应报文 -> tcp四次挥手
* get & post
    * HTTP协议 & 浏览器/服务器限制
    * get: 查询、幂等、可缓存
    * 请求参数、url长度、安全
* DNS: 浏览器缓存 -> hosts -> 本地DNS服务器 -> 根DNS服务器 -> ...

#### 开源框架

* Spring IOC
    * IOC(控制反转): 容器负责实例化、对象依赖
    * DI(依赖注入): 对象依赖
    * 扫描BeanDefinition、实例化bean、注入依赖、初始化bean(@PostConstruct、afterPropertiesSet()、init-method)
    * 循环依赖: singletonObjects、earlySingletonObjects、singletonFactories、构造器的循环依赖没法解决
    * `@Autowired`: 基于类型、@Primary、@Qualifier
    * `@Resource`: name + type
* Spring AOP: 在某些类或方法上做拦截处理、切入点Pointcut(类 + 方法) + 增强Advice(前置增强、后置增强、环绕增强、异常增强)、动态代理
* Spring事务: AOP、Spring事务传播机制、事务管理、commit、rollback
* Spring & SpringBoot
    * 零配置: 框架
    * jar包main函数启动、内嵌tomcat服务器、容器部署
    * 健康检查
* Netty
    * Reactor模型: boss线程池(accept)、worker线程池(io读写、Handler事件链)、自定义Handler处理线程池
    * Handler事件驱动(Inbound、Outbound)、拆包粘包、ByteBuf(Zero Copy、池化)
* Tomcat: maxConnections(10000)、maxThreads(200)
* LVS: NAT、DR、TUN

#### 微服务

* 服务拆分的好处: 快速迭代开发/维护、隔离
* Dubbo & Spring Cloud
    * 定位: RPC框架、微服务的一站式解决方案
    * 注册中心: Zookeeper、Eureka
    * 服务调用
        * RPC(二进制协议、hessian序列化、Netty、性能)
        * Restful API(Http协议、json序列化、Spring MVC、灵活)
    * Spring Cloud一站式: API网关、配置中心、分布式链路追踪、断路器
    * Spring Cloud: Spring、Spring Boot
    * Dubbo: 服务治理
* Ribbon: 随机、轮询、加权响应时间、最小并发数
* Hystrix: 隔离、限流(信号量、线程池)、熔断(滑动时间窗口)、降级
    * 断路器状态: OPEN、HALF_OPEN、CLOSED
* Eureka: 服务提供者(register、心跳、replication)、服务消费者(fetch、refresh)、Server(去中心化、同步)
* Eureka Server三级缓存
    * registry: 注册表
    * readWriterCacheMap: 读写缓存
    * readOnlyCacheMap: 只读缓存(可禁用)
* Eureka缓存
    * Ribbon缓存: client.ribbon.ServerListRefreshInterval=30s
    * Eureka Client缓存: eureka.client.registry-fetch-interval-seconds=30s
    * Eureka Server缓存: eureka.server.response-cache-update-interval-ms=30s
* Spring Cloud配置
    * Eureka Server: 自我保护
    * Eureka Client:
    * Ribbon: 负载均衡、ServerList缓存、重试、超时时间
    * Hystrix: 

#### 分布式

* CAP: C一致性(多副本一致)、A可用性(有限时间内返回正常结果)、P分区容错性(网络分区)
    * 分布式环境下，必须保证P，在C和A之间取舍
    * 保证可用性N个9、保证AP，牺牲C(强一致性)
* BASE: CAP理论的延伸，保证最终一致性
    * BA: 基本可用(Basically Available)，允许响应时间上的损失、功能损失(降级)
    * S: 软状态(Soft State)，允许存在中间状态
    * E: 最终一致性(Eventual Consistent)，弱一致性，保证最终一致性
* 分布式ID
    * 本机: UUID、雪花算法(1+41+10+12、时钟回拨)
    * Redis: redis incr
    * 数据库: 数据库分表步长、数据库发号器
    * Zookeeper
* 分布式事务
    * 两阶段提交(prepare、commit、rollback): 性能、事务
    * TCC两阶段补偿(try、confirm、cancel): 分布式服务、开发成本高
    * RocketMQ事务消息
    * 本地消息表(MQ、轮询)
* 分布式锁: 可重入、阻塞、超时释放、单点问题
    * MySQL: 唯一索引(insert/delete)、InnoDB排他锁
    * redis: setnx、Redission(lua、clientId、count、watch dog)、redlock(n/2 + 1)
    * Zookeeper: 临时顺序节点、watch
* Zookeeper
    * server.1=、server.2=、server.3=、...
    * 选举算法: epoch、zxid、sid
    * 应用: 命名服务、配置管理(元数据)、集群管理(注册中心)、分布式锁、分布式队列
* 限流
    * 计数器: AtomicInteger、基于时间窗口的分布式限流(Redis incr)
    * 并发限流: 信号量(Semaphore)、线程池
    * 令牌桶(RateLimiter)、漏桶
* 幂等
    * 为什么要保证幂等: 消息失败重发、Consumer重复消费、微服务失败重试
    * 幂等解决方案(结合具体业务)
        * 唯一索引
            * 顺序消息 + 单线程消费
            * 新增: 数据库唯一索引约束、分布式锁(先查后insert)
            * 修改: 直接更新、乐观锁(版本号)、状态机
        * 全局唯一requestId: 去重(redis setnx、数据库唯一索引)
* 布隆过滤器
    * 二进制向量 + 一系列哈希函数

#### MySQL

* InnoDB & MyISAM
    * 聚集索引 非聚集索引
    * 事务
    * 表锁 行锁
* B+Tree: 一页(16k)、树的高度、范围查询
* 索引
    * 聚集索引、非聚集索引、二级索引、联合索引、前缀索引、覆盖索引、回表
    * 避免过多、优先整数、索引尽量小、索引列基数足够大(否则导致大量的回表操作)、最好自增
* SQL优化: explain、join、子查询、where、like、表达式、order(索引排序)、group by(索引排序)、limit(避免大的offset)
* explain
    * type: const(唯一索引)、eq_ref(唯一索引join)、ref(非唯一二级索引查询/join)、index_merge(索引查询合并)、range(索引范围查询)、index(全表扫描索引树)、ALL(全表扫描)
    * Extra: Using filesort(文件排序)、Using temporary(临时表)、Using index(覆盖索引)
* Log
    * Redo Log(崩溃恢复): `innodb_flush_log_at_trx_commit`
    * Undo Log(回滚、MVCC)、binlog(主从同步)、慢查询日志
* ACID
    * A: 撤销日志
    * C: AID一起保证、双写缓冲
    * I: 隔离性: MVCC、锁
    * D: 重做日志、脏页刷新
* MVCC: 版本链、ReadView
* 锁
    * 表锁、意向锁、行锁
    * 记录锁、间隙锁、Next-Key锁、插入意向锁(幻读、并发)
    * 共享锁(S锁)、排它锁(X锁)
    * 悲观锁、乐观锁
        * 悲观锁: select for update、update
        * 乐观锁: 版本号update
* 事务隔离级别
    * READ UNCOMMITTED: select不加锁
    * READ COMMITTED: 一致性非锁定读(当前读)
    * REPEATABLE READ: 一致性非锁定读(快照读)，加Gap锁/Next-Key锁
    * SERIALIZABLE
* 一致性非锁定读(MVCC)、一致性锁定读(锁)
* MySQL数据同步Canal
    * Master: 开启binlog、binlog格式为row
    * canal-server: 伪装为MySQL Slave
    * canal-adapter
* 主从同步
    * 主binlog -> 从relay log -> 从执行SQL(串行)
    * 异步复制、半同步复制、全同步复制
    * 主从同步延迟
        * Master: 并发写、实时读、写后更新Redis
        * 主从同步模式
        * 网络延迟
        * Slave
            * 并行复制: 并行执行不同库的SQL
            * 单线程随机写、读写竞争
            * 日志(sync_binlog=0/禁用、innodb_flush_log_at_trx_commit=2)
            * 硬件: CPU、网卡、磁盘
            * 分散压力: 分库分表、多从
            * Redis
* 分库分表
    * 水平切分/垂直切分、数据量大、读写压力
    * 带来的问题: 分布式事务、跨节点join/聚合、ID生成、分片规则、扩容
    * 分库分表中间件: Sharding-jdbc、Mycat
    * 分库分表扩容
        * 停服 -> 迁移 -> 修改分片规则 -> 重启
        * 双写迁移
            * DBA创建新库、迁移数据
            * 旧库: insert/update/select
            * 新库: insert/update
            * 校验: 同步最近update的数据

#### Redis

* 高性能、高并发
* 单线程原因: 内存读写快、线程上下文切换开销、IO多路复用、并发冲突
* 数据结构: string(缓存、原子操作、分布式锁)、list(关注列表)、set(全局去重、集合运算)、zset(排序)、hash
* Redis高可用
    * Redis哨兵
    * Redis Cluster: 16384个槽、mget(大括号)
* 避免大的value: 占用内存过大(导致淘汰)、IO
* 缓存穿透(空值、布隆过滤器)、缓存失效、缓存雪崩
* 热点缓存
    * 压力: 本地缓存、缓存多份数据
    * 失效导致数据库压力: 持久缓存、分布式锁、数据库限流、失效时间分散化、失效预填充(定时任务)
* 持久化
    * RDB(fork子进程): 数据恢复快
    * AOF: 更好保证数据不丢失、影响qps
* 主从同步: 全量同步(RDB) + 增量同步(缓冲区)
* Pipeline
* 过期键删除策略: 惰性删除、定期删除(随机抽取)
* `内存淘汰机制`
    * volatile-lru、volatile-ttl、volatile-random
    * allkeys-lru、allkeys-random
    * no-eviction
* 缓存和数据库的一致性(保证最终一致性)
    * 先更新数据库、后删除缓存(失败重试)
    * 先更新数据库 + 消息队列异步
    * 先更新数据库 + Canal异步
    * 分布式锁
    * 失效时间

#### ElasticSearch

* Lucene倒排索引: term前缀树(节省空间、比较开销小) -> term字典(二分查找) -> 倒排列表
* 字段: 精确值/全文、Multi-Field
* 避免深度分页、scroll
* 查询: term查询、filter查询(缓存)、bool查询(must、must_not、should、filter)
    * filter查询: 不计算_score，结果被缓存
    * query查询: 计算_score，结果不被缓存
* Lucene索引
    * 一个提交点(Commit Point)、多个段(Segment)
    * 一个提交点记录所有已提交的段，包含一个`.del`文件
    * 一个段包含多个字段的倒排索引，可以被搜索
* 写数据: 写`in-memory buffer`、记录translog
* refresh: `in-memory buffer` -> `Segment(os buffer)`、准实时搜索
* flush: 先refresh，Commit Point写入磁盘文件，Segment(os buffer)fsync到磁盘，清空translog
* translog: 每5s落盘
* 更新/删除: `.del`文件、更新 = 删除 + 插入
* merge: 多个segment file合并成一个segment file
* 优化
    * 硬件: CPU、磁盘
    * 内存(OS Cache = 磁盘中数据的一半)
    * 写优化: 批量写、merge、refresh
    * 读优化: 避免大分页(scroll代替)、routing

#### Kafka

* 解耦、削峰、异步化
* 高性能: 消息缓冲区、batch批量发送、Reactor网络模型、内存文件映射、磁盘顺序IO、零拷贝、批量消费
* 高可用: 多Partition、多Replication、ISR、Master选举
* 消息可靠投递:
    * ack=-1、retry>0(尽量大、重试间隔大一点)
    * replicas>1、`min.insync.replicas`>1、OSR不参与Master选举
    * 刷盘(防止集群宕机)
        * log.flush.interval.messages=10000
        * log.flush.interval.ms=1000
        * log.flush.scheduler.interval.ms
    * 关闭自动commit、幂等
* 消息重复: Server幂等、Consumer幂等
* Kafka幂等实现
    * `Producer Id`
    * <Topic, Partition>: 自增`Sequence Number`
    * Broker: 缓存的`Sequence Number` + 1 = 接收消息的`Sequence Number`
* 消息顺序消费
    * `max.in.flight.requests.per.connection=1`
    * 开启Server幂等
    * 相同的key、单线程消费
    * 多个内存queue(每个queue一个线程消费)
    * 多个topic、增加Partition
* HW(ISR中最小的LEO)、LEO(分区中下一条消息的offset)
* 大量消息堆积问题: 扩容(消息转移到N倍Partition的topic + N倍Consumer机器)

#### 高性能

* 指标: QPS、响应时间
* 单机: CPU、IO
* 集群: 负载均衡

#### 高可用(4个9)

* 避免单点故障: 负载均衡、多机房、异地多活
* 存储: 数据分片、冗余备份、读写分离
* 压测
* 监控自动报警
* 隔离(进程隔离、线程池隔离)/限流/熔断/降级
* 超时/失败重试

#### 高并发

* 高并发带来`海量数据`
* 高并发要求`高性能`
* 高并发要求`高可用`
* 高并发要求`可扩展`: 水平扩容
* 高并发保证`数据一致性`: 数据丢失、并发冲突、数据不一致(最终一致性)

`实施`:

* 应用
* 微服务
* 中间件
* 压测: 瓶颈、调优、容量(规划、扩容)
* 监控: 自动报警

#### 微服务 & SOA

* 通信方式: ESB企业服务总线 去中心化(服务与服务直接通信)
* 服务划分粒度: 粗粒度 细粒度(拆分、快速迭代、扩展、隔离)
* 容器支持: 持续集成、自动化测试、自动化部署、扩容

#### 故障排查

* CPU: 是否飙高、top、jstack
* 频繁gc: gc log
* 业务异常: 业务日志

https://blog.csdn.net/h70614959/article/details/83109317

#### 优化

* Java应用
    * CPU: 线程阻塞、异步、避免锁(无锁算法)
    * 内存: 避免大对象、避免频繁创建对象
* JVM: 内存、垃圾收集器及配置、避免频繁full gc、避免full gc时间过长
* 微服务: 服务拆分、隔离限流熔断降级
* MySQL优化
    * 架构: 分库分表、读写分离
    * 硬件: 缓冲池(内存)、磁盘(SSD)
    * 开启慢查询日志
    * Redo Log/binlog刷盘
    * 主从同步模式
    * 索引: 主键索引有序(插入)、优先整数、索引尽量小、索引列基数足够大、避免过多
    * 字段: 优先整数、尽量小、尽量定长、not null
    * SQL优化
        * explain
        * select 必需字段
        * 避免join和子查询
        * where: 索引、like、函数/表达式
        * order: 索引排序
        * group by: 索引排序
        * limit: 避免大的offset、避免大的分页
* Redis优化
    * 硬件: 网卡
    * 是否需要持久化: RDB(fork导致高并发延迟、redis内存不要过大)、AOF(每秒fysnc)
    * 减少网络传输次数: 批量(mget、pipeline、lua)
    * key设置过期时间
    * 避免O(n)命令、避免大的value(io、内存)、append
    * 内存淘汰策略
    * 多级缓存
    * 缓存穿透、缓存失效、热点缓存、缓存雪崩
* Kafka优化
    * Producer: 异步发送、消息尽量小、buffer.memory、linger.ms、batch.size、acks
    * Broker: 分区数、刷盘、Java(内存、网络io)
    * Consumer: 消费者数量、批量fetch、多线程消费

#### 展望

* 大局观: 分布式、高并发、高性能、高可用、可扩展
* 源码: JDK源码、开源框架源码、中间件源码
* 分布式架构: 分布式中间件(选型、使用、优化、底层原理)、分布式锁、分布式事务
* 微服务架构: 服务拆分
* Java: 并发编程
* 调优: Java优化、JVM优化、中间件优化
* 具体到业务
* 一定的团队管理能力

#### 项目问题

* Spring Cloud搭建
    * Eureka Server配置
    * Eureka Client配置
    * Ribbon配置
    * Hystrix配置
* 中间件选型
    * 各种中间件的优缺点(提供的功能是否满足、集成难度、对系统的性能损耗、管理后台的友好度)
    * 本地部署测试
    * 选择一个搭建demo
* 集成Cat(挑战): 拦截、记录、异步、对业务透明
    * Servlet
    * MyBatis: 插件
    * Redis: 重写Jedis的RedisClient
    * ES: AOP拦截
    * Log4j 2: 插件
    * Spring Cloud: Feign拦截器、Spring MVC拦截器
    * Hystrix: 包装Callback(RequestAttributes)
    * HttpClient: 封装
    * Kafka: 生产端(interceptor)、消费端
    * 线程池异步调用

#### HR面

* 带人/独立负责大型项目
* 业余时间(学习新的技术)
* 打游戏、外出旅游
* 适应能力强，有责任心
* 缺点和优点
    * 优点: 技术扎实、承担核心业务、靠谱
    * 缺点: 考虑的更多的是技术
* 为什么考虑这个职位

#### 高频面试

* 离职原因: 稳定、更好的发展空间/平台
* 项目中遇到的最大挑战:
* 项目中学到最多的东西:
* 看什么书
* 职业规划
    * 技术为主、架构方向
    * 主导/参与有挑战性的项目 提升自己的架构能力 为公司实现自己的价值

#### 面试

* 兴奋(有兴趣)、开心、随便一点(题外话)
* 对公司怎么看:
    * 小红书
        * 口碑、分享、电商/交易、武汉分部
* 对职位怎么看: 很适合、
* 职业规划: 技术为主(架构师)、转以技术为主的管理
* 项目亮点/最大挑战: 调研、引入新的技术、`拉回来`
* 最大的挑战
    * CAP，分布式环境下，保证系统的高可用和数据一致性问题
    * 数据不丢失、主从/主备一致性、主从切换、
    * 中间件之间的一致性问题
    * 幂等
* 管理/团队效率
    * 规范
    * code review
    * 每人工作经验/擅长
* 管理/遇到的问题
    * 自己
        * 承担更多的责任
        * 系统大方向的布局
    * 对外: 产品/其它团队
        * 需求分析/改需求/口头需求/难实现的需求
        * 人员争执
    * 对内
        * 人员争执、协调团队关系
        * 出问题: 解决问题/反思
        * 任务分配/主动跟进/指导

#### 个人简单介绍

软件工程专业，大二就自学Java，毕业后7年Java开发经验

1. 珍爱网，珍心会员(付费/AB测试/会员功能)，珍爱网改版(前后端重构)
2. 大众点评，移动运营配置平台，个人中心我的订单和卡券，Mock平台
3. 携程，DDD框架，类Mybatis组件，主导 美食林业务.Net转Java和旅游攻略平台
4. 基础架构设计，中间件调研选型，核心业务商品和订单开发，指导其它同事

业务时间, 喜欢看一些源码，看一些比较好的博客

#### 无招胜有招

基础技术扎实，有带人经验，熟悉分布式、高并发、高性能、高可用的架构设计和开发

#### 面试技巧

* 简历
* 离职原因(规划、收获成长)
    * 珍爱网: 技术遇到瓶颈、亲人
    * 美团点评: 接口中间层、平台、脱离具体业务
    * 携程: .Net、Java不看重
    * 网易上海: 业务发展缓慢、基础架构/架构设计/带人经验
* 游戏商城: 1000QPS
* 订单TPS: 四五十万的订单量

#### 拉勾面试

* 挑选职位: Java资深/专家/5-10年

#### 独角兽公司

* 菜鸟网络
* 商汤科技: 人工智能
* 喜马拉雅
* 运满满
* 联盟智能社区
* OPPO
* 虎扑
* 平安科技
* 千寻位置
* 平安金服

* 比心: 网鱼网咖/鱼泡泡、游戏陪玩/陪练/直播
* Coupang: 韩国最大的电商网站

#### 自我介绍

* 平时喜欢去看源码，开源框架/中间件有针对性的研究源码
* 隔离理发
* 思考能力、学习能力
