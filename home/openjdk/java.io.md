---
layout: homelist
title: java.io
date: 2017-10-26
---

* 字节
    * 8位
* 字符
    * 字符集
        * ASCII
        * ISO-8859-1
        * GB2312
        * GBK
        * GB18030
        * Unicode: 统一码
    * Unicode字符编码
        * UTF-8
        * UTF-16
* 流总结
    * 转byte
        * byte、char、String、基本数据类型、对象
    * 中间处理
        * 缓冲
    * 存储读写
        * 内存
        * 文件
        * 网络
* 节点流
    * 文件流: FileInputStream/XXX
        * FileDescriptor fd: 文件描述符
    * 网络流: SocketInputStream/XXX
    * 内存流
        * 字节数组流: ByteArrayInputStream/XXX
            * byte[] buf
        * 字符数组流: CharArrayReader/XXX
            * char[] buf
        * 字符串流: StringReader/XXX
            * String/StringBuffer
* 过滤流
    * 缓冲流: BufferedInputStream/XXX
        * byte[] buf
        * 缓冲区，加速读写，减少内核调用
    * 数据流: DataInputStream/XXX
        * 读写基本数据类型
* 管道流
    * 线程间通信
    * PipedOutputStream: 写
    * PipedInputStream: 读
        * byte[] buffer: 缓冲区
* 字节字符转换流: InputStreamReader/XXX
    * FileReader/FileWriter
* Closeable/AutoCloseable
    * try-with-resources: 自动关闭资源
* 序列化/反序列化
    * Serializable: 序列化标记接口
    * Externalizable: 自定义序列化/反序列化
    * 对象流: ObjectInputStream/XXX
        * Class
        * String
        * 数组
        * 枚举: name
        * 其它对象: instanceof Serializable
            * Externalizable
                * readExternal()/writeExternal()
            * Serializable
                * readObject()/writeObject()
                * 默认方式
    * serialVersionUID
* 设计模式
    * 装饰器模式
    * 适配器模式
* RandomAccessFile: 随机访问文件
