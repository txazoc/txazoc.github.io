---
layout: map
title:  Redis
---

#### 字符串(SDS)

* 数据结构
    * uint_t len: 字符串长度，uint_t有四种类型: uint8_t、uint16_t、uint32_t、uint64_t
    * uint_t alloc: 分配的长度
    * unsigned char flags: 类型标记，低三位有效
    * char buf[]: 字符数组
* 内存结构: len + alloc + flags + buf + \0 + 空闲空间(alloc - len)
* 特点
    * 获取字符串长度: O(1)
    * 杜绝缓冲区溢出: 字符串拼接时，先进行内存空间检查
    * 减少字符串修改时内存重分配的次数
        * 增长: 预分配
        * 缩短: 惰性释放
    * 二进制安全
    * 重用部分C语言字符串函数

#### 列表

* 数据结构
    * struct list
        * listNode *head: 表头节点
        * listNode *tail: 表尾节点
        * unsigned long len: 节点数
    * struct listNode
        * struct listNode *prev: 前置节点
        * struct listNode *next: 后置节点
        * void *value: 节点的值
