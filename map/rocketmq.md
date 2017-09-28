---
layout: map
title:  RocketMQ
---

[http://www.iocoder.cn/?vip](http://www.iocoder.cn/?vip)
[blog.csdn.net/binzhaomobile/article/details/73743361](blog.csdn.net/binzhaomobile/article/details/73743361)
[http://www.doc88.com/p-4127042457647.html](http://www.doc88.com/p-4127042457647.html)
[http://www.cnblogs.com/wxd0108/p/6055004.html](http://www.cnblogs.com/wxd0108/p/6055004.html)

#### RocketMQ特性

* 高性能
* 低延迟
* 亿级消息堆积

#### 可用性

* 单master模式
* 多master模式
* 多master多slave异步复制模式
    * master -&gt; 异步复制 -&gt; slave
    * 优点
        * 高可用性
    * 缺点
        * 消息丢失
* 多master多slave同步双写模式
    * master -&gt; 同步双写 -&gt; slave
    * 优点
        * 消息丢失
    * 缺点
        * 牺牲高可用性

#### Namesrv - RouteInfoManager

* topicQueueTable: topic - broker - queue
    * k: topic
    * v: QueueData[]
        * brokerName: broker-1
        * readQueueNums: 读队列数
        * writeQueueNums: 写队列数
        * perm: 读写权限
        * topicSynFlag: 同步/异步复制标记
* brokerAddrTable: broker - master/slave
    * k: brokerName: broker-1
    * v: BrokerData
        * cluster: DefaultCluster
        * brokerName: broker-1
        * brokerAddrs
            * k: brokerId: 0
            * v: brokerAddress: 192.168.1.106:10931
* clusterAddrTable: cluster - broker
    * k: clusterName: DefaultCluster
    * v: Set<String>
        * brokerName: broker-1
        * brokerName: broker-2
* brokerLiveTable
    * k: brokerAddr: 192.168.1.106:10931
    * v: BrokerLiveInfo
        * lastUpdateTimestamp: 最近一次心跳包时间，1505917226150
        * Channel: 通道
        * haServerAddr: 192.168.1.106:10932

#### Netty消息通信

* RemotingService
    * RemotingServer: NettyRemotingServer
    * RemotingClient: NettyRemotingClient
* 消息类型 - RemotingCommand
    * RemotingCommand
        * code: 类型
        * opaque: 请求id，自增
        * flag: 标记
        * remark: 备注
        * extFields: 额外字段
        * customHeader: 自定义header
        * serializeTypeCurrentRPC: 序列化类型
        * body: 内容
    * 编码格式
        * 总长度: 4字节
        * 序列化类型: 1字节
        * header长度: 3字节
        * headerData
            * customHeader复制到extFields
            * 序列化RemotingCommand
                * json
                * rocketmq
        * body
* invoke
    * invokeSync(): 同步调用
        * 创建ResponseFuture
        * responseTable.put(请求id, responseFuture)
        * channel.writeAndFlush(command)
        * responseFuture等待返回结果直到发送失败或超时
        * responseTable.remove(请求id)
    * invokeAsync(): 异步调用
        * 获取异步请求许可
        * 创建ResponseFuture(invokeCallback)
        * responseTable.put(请求id, responseFuture)
        * channel.writeAndFlush(command)
    * invokeOneway(): 单向调用
        * RemotingCommand添加单向标记
        * 获取单向请求许可
        * channel.writeAndFlush(command)
* invoke响应
    * responseFuture = responseTable.get(请求id)
    * responseTable.remove(请求id)
    * invokeCallback != null
        * true: 异步请求的response
            * 回调线程池执行回调
        * false: 同步请求的response
            * 设置responseCommand
            * 唤醒等待

#### 消息传递 - Producer发送消息

***1. 普通消息***

* 选择queue: 支持三种方式
    * 轮询queue列表: 默认方式，同步模式下支持重试，重试次数可配
        * 重试策略: 选择除上次选取的queue的brokerName之外的其它queue
    * 指定MessageQueue
    * 实现MessageQueueSelector接口
* 获取queue对应的broker的master节点地址
    * 获取失败，从namesrv同步
    * 再次获取失败，代表master节点不可用，发送失败，抛出异常
* Message处理
    * 生成消息唯一id: 16字节
        * 4: ip
        * 2: pid低16位
        * 4: classLoader.hashCode()
        * 4: 当前时间与当月第一天0时0分0秒的时间差(毫秒为单位)
        * 2: int累加器低16位
    * 消息压缩: 非批量消息且body长度大于body压缩阈值(默认4096字节)，则压缩
        * 压缩消息
        * 添加消息压缩标记
    * 若为事务消息，添加事务消息标记
    * 创建发送消息请求header: SendMessageRequestHeader
        * producerGroup
        * message.topic
        * queueId
        * 消息标记
        * message.properties
        * 批量消息标记
* 创建RemotingCommand
    * code
    * header: SendMessageRequestHeader
    * body = message.body
* NettyRemotingClient发送消息
    * 同步发送
        * remotingClient.invokeSync()
    * 异步发送
        * remotingClient.invokeAsync()
    * 单向发送
        * remotingClient.invokeOneway()

***2. 事务消息***

* 添加事务消息标记
* 同步发送事务消息
* SEND_OK
    * 执行本地事务分支
    * 获得本地事务状态
        * COMMIT_MESSAGE
        * ROLLBACK_MESSAGE
        * UNKNOW
* endTransaction()
    * 创建结束事务请求header: EndTransactionRequestHeader
        * commitOrRollback = 本地事务状态
    * 单向发送结束事务消息

***3. 批量消息***

* 批量消息校验
    * 不支持延时消息
    * 消息的topic必须都相同
    * 消息的waitStoreMsgOK必须都相同
* 创建MessageBatch: 继承自Message
* 每条消息生成消息唯一id
* body = encode(消息)
* 发送MessageBatch

#### 消息传递 - Broker接收消息

* SendMessageProcessor.processRequest()
* 请求自定义头部SendMessageRequestHeader解码
* 创建响应response
    * response.opaque = request.opaque
* 检查
    * broker是否开始接收消息: startAcceptSendRequestTimeStamp
    * broker写权限检查
    * 检查topic和系统关键字是否冲突
    * 检查topic配置是否存在
    * 检查队列id是否有效
    * 检查是否拒绝事务消息
* 消息处理
    * 队列id小于0: 从写队列中随机选择
    * 消息转换为broker内部存储消息结构
* MessageStore存储消息
    * 检查
        * 是否已关闭
        * 检查是否slave节点
        * 检查是否可写
        * 检查topic长度，不超过127
        * 检查properties长度，不超过32767
        * 系统PageCache是否busy
    * CommitLog存储消息
        * 延时消息处理
            * 调整消息延时级别
            * 修正延时消息的topic和队列id
        * `写消息加锁`
            * CAS
            * ReentrantLock
        * 设置消息存储时间为当前时间戳，为保证全局有序
        * 获取MappedFile
            * MappedFile为空或满，创建新的MappedFile
        * 追加消息到MappedFile
            * 获取文件写入offset
            * 生成消息id: addr + 文件写入offset
            * 获取队列offset
            * 写消息到DirectByteBuffer
            * 更新队列offset: 加1
            * 更新文件写入offset: 加消息字节数
        * `写消息解锁`
        * 统计
            * topic发送消息次数加1
            * topic发送消息大小更新
        * 磁盘flush
            * GroupCommitService: SYNC_FLUSH
                * waitStoreMsgOK
                    * 等到消息flush到磁盘，直到超时
                    * GroupCommitService线程检查是否有未flush消息并flush
                    * flush成功，唤醒等待
                * !waitStoreMsgOK
                    * 唤醒GroupCommitService
            * FlushRealTimeService: ASYNC_FLUSH，实时flush
                * 唤醒FlushRealTimeService
            * CommitRealTimeService: ASYNC_FLUSH，实时commit
                * 唤醒CommitRealTimeService
        * slave同步: broker为同步master
            * waitStoreMsgOK
                * 等待slave同步消息成功，直到超时
                * GroupTransferService线程消息是否同步slave成功
                * 同步slave成功，唤醒等待
    * 存储消息耗时统计
* 处理消息存储结果，返回response
    * 消息存储失败，返回不同的ResponseCode和remark
    * 消息存储成功
        * broker统计
            * topic消息数加1
            * topic消息容量更新
            * broker消息数加1
        * 更新SendMessageResponseHeader
            * 消息id
            * 队列id
            * 队列offset
    * 写response

#### 消息传递 - Consumer拉取消息

* PullMessageProcessor.processRequest()
* 

#### 消息传递 - Consumer消费消息

#### 节点网络通信

* broker -&gt; `register_broker` -&gt; namesrv: 30s
* broker-slave -&gt; `register_broker` -&gt; broker-master
* producer -&gt; `get_routeinto_by_topic` -&gt; namesrv: 30s
* consumer -&gt; `get_routeinto_by_topic` -&gt; namesrv: 30s
