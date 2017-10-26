---
layout: homelist
title: java.io
date: 2017-10-26
---

* Buffered流
    * 缓冲区，加速读写，减少内核调用
* 字节字符数组流
    * 内存流
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
