---
layout: homelist
title: java.io
date: 2017-10-26
---

* 节点流
    * 文件流: FileInputStream/XXX
    * 网络流: SocketInputStream/XXX
    * 内存流
        * 字节数组流: ByteArrayInputStream/XXX
        * 字符数组流: CharArrayReader/XXX
        * 字符串流: StringReader/XXX
* 过滤流
    * 缓冲流: BufferedInputStream/XXX
        * 缓冲区，加速读写，减少内核调用
    * 数据流: DataInputStream/XXX
* 管道流
    * 线程间通信
    * PipedOutputStream: 生产者
    * PipedInputStream: 消费者
        * byte[] buffer: 缓冲区
* 字节字符转换流: InputStreamReader/XXX
* Closeable/AutoCloseable
    * try-with-resources: 自动关闭
* 序列化/反序列化
    * Serializable: 标记接口
    * Externalizable: 自定义序列化/反序列化
    * ObjectInputStream/ObjectOutputStream
        * Class
        * String
        * 数组
        * 枚举: name
        * 其它对象: instanceof Serializable
            * Externalizable
            * Serializable
                * readObject()/writeObject()
                * 默认方式
* 设计模式
    * 装饰器模式
        * Buffered流
        * Data流
    * 适配器模式
        * InputStreamReader/OutputStreamWriter
