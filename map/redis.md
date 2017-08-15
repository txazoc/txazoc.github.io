---
layout: map
title:  Redis
---

#### 字符串

* 数据结构
    * sdshdr{n}
        * uint{n}_t len: 当前长度
        * uint{n}_t alloc: 分配总长度
        * unsigned char flags: 类型标记，低三位有效
        * char buf[]: 字符数组
        * `注`: n可取值8(byte)、16(short)、32(int)、64(long)
    * 空间换时间
* 内存分布
    * sdshdr{n} = [len][alloc][flags][sds]
    * sds = [buf][\0][alloc - len]
    * sdshdr.flags = sds[-1]
* 特点
    * 获取字符串长度: 时间复杂度为`O(1)`
    * 杜绝缓冲区溢出: 字符串拼接时，先进行内存空间检查，内存空间不够自动扩容
    * 减少字符串修改时内存重分配的次数
        * 增长: 空间预分配
            * len <= 1M，扩容后，alloc = 2 * len
            * len > 1M，扩容后，alloc = len + 1M
        * 缩短: 惰性空间释放
    * 二进制安全: 以二进制格式处理文本、图片、视频等数据
    * 兼容部分C语言字符串函数: 同C语言字符串，以`\0`结尾，可重用部分C语言字符串函数

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
        * void *(*dup)(void *ptr): 节点值复制函数
        * void (*free)(void *ptr): 节点值释放函数
        * int (*match)(void *ptr, void *key): 节点值对比函数
    * 双向无环链表

#### 字典

* 数据结构
    * struct dict: 字典
        * dictType *type: 类型函数
        * void *privdata: 私有数据
        * dictht ht[2]: hash表数组，大小为2，ht[0]用来读写，ht[1]用来rehash
        * long rehashidx: rehash索引，记录rehash的进度，为-1时表示当前没有在进行rehash
        * int iterators: 正在迭代的迭代器数量
    * struct dictht: hash表
        * dictEntry **table: hash表数组
        * unsigned long size: hash表大小
        * unsigned long sizemask: hash表大小掩码，等于size - 1
        * unsigned long used: hash表中已有的节点数
    * struct dictEntry: hash表节点
        * void *key: 键
        * union: 值
            * void *val
            * uint64_t u64
            * int64_t s64
            * double d
        * struct dictEntry *next: 下一个节点指针，构成链表，解决hash键冲突
* hash
    * hash算法: MurmurHash2
    * hash键冲突: `next`链表
    * rehash: 键值对rehash到ht[1]，ht[0] = ht[1]
    * 负载因子: ht[0].used / ht[0].size
    * 渐进式rehash
        * insert: 写到ht[1]
        * get: 先读ht[0]，未找到，再读ht[1]
        * set、delete: 同时更新ht[0]和ht[1]
        * ht[0]只减不增，最终成为空表，rehash结束
