---
layout: arch
title:  cat架构设计
---

#### Cat消息设计

消息类型:

* T\|A: Transaction，事务
* E: Event，事件
* L: Trace，跟踪
* M: Metric，度量
* H: Heartbeat，心跳

消息协议:

```console
Class Timestamp Type Name Status Duration Data
```

例如:

```console
A 2012-04-26 16:00:42.775 URL /index 0 10 xxx
```

消息树:

```java
public class DefaultMessageTree implements MessageTree {

    private String m_domain;

    private String m_ipAddress;

    private Message m_message;

    private String m_messageId;

    private String m_parentMessageId;

    private String m_rootMessageId;

    private String m_threadName;

}
```

消息:

```java
public abstract class AbstractMessage implements Message {

    private String m_type;

    private String m_name;

    private String m_status = "unset";

    private long m_timestampInMillis;

    private CharSequence m_data;

}
```

Transaction消息:

```java
public class DefaultTransaction extends AbstractMessage implements Transaction {

    private List<Message> m_children;
    
    private long m_durationInMicro = -1;

}
```

#### Cat客户端处理流程

* 初始化消息上下文`Context`(ThreadLocal实现)
* 构建消息树`MessageTree`
* 消息树添加到异步消息队列`MessageQueue`
* 消息出队、编码
* Netty发送消息

#### Cat服务端处理流程

* Netty接收消息
* 消息解码
* 消息分发、异步消费(队列)
* 消息转储到文件或HDFS
* 生成统计数据存入MySQL
