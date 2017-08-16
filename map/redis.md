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
* 内存分布
    * sdshdr{n} = [len][alloc][flags][sds]
    * sds = [buf][\0][alloc - len]
    * sdshdr->flags = sds[-1]
    * sds = (char *) sdshdr + sizeof(struct sdshdr{n})
* 特点(对比C语言字符串)
    * 空间换时间
    * 获取字符串长度: 时间复杂度为`O(1)`
    * 杜绝缓冲区溢出: 字符串拼接时，先进行内存空间检查，内存空间不够自动扩容
    * 减少字符串修改时内存重分配的次数
        * 增长: 空间预分配
            * len <= 1M -> 扩容后 -> alloc = 2 * len
            * len > 1M -> 扩容后 -> alloc = len + 1M
        * 缩短: 惰性空间释放
    * 二进制安全: 以二进制格式存储文本、图片、视频等数据
    * 兼容部分C语言字符串函数: 同C语言字符串，以`\0`结尾，可重用部分C语言字符串函数
* 相关命令
    * append: O(1)，追加字符串，`memcpy`
    * get: O(1)
    * getset: O(1)
    * mget: O(N)，批量get
    * mset: O(N)，批量set
    * set: O(1)，`memcpy`
    * setex: O(1)，key存在才set
    * setnx: O(1)，key不存在才set
    * strlen: O(1)，字符串长度

#### 列表

* 数据结构
    * struct list: 列表
        * listNode *head: 表头节点
        * listNode *tail: 表尾节点
        * unsigned long len: 节点数
    * struct listNode: 列表节点
        * struct listNode *prev: 前置节点
        * struct listNode *next: 后置节点
        * void *value: 节点的值
    * 双向无环链表
* 特点
    * 支持表头表尾push、pop，效率高
    * 列表中新增、删除、查找，会导致表头或表尾遍历，效率低
    * 可用作双向队列或堆栈
* 相关命令
    * blpop: O(1)，表头阻塞pop
    * brpop: O(1)，表尾阻塞pop
    * lindex: O(N)，下标get
    * llen: O(1)，列表长度
    * lpop: O(1)，表头pop
    * lpush: O(1)，表头push
    * lrange: O(O + S)，子列表
    * lset: O(N)，下标set
    * rpop: O(1)，表尾pop
    * rpush: O(1)，表尾push

#### 字典

* 数据结构
    * struct dict: 字典
        * dictType *type: 类型函数
        * void *privdata: 私有数据
        * dictht ht[2]: hash表数组，大小为2，ht[0]用来读写，ht[1]用来rehash
        * long rehashidx: rehash索引，记录rehash的进度，为-1时表示没有在rehash
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
    * index = hash(key) & ht[0].sizemask
    * hash键冲突: 链地址法
    * 负载因子: ht[0].used / ht[0].size，决定是否扩容/缩容
    * rehash: hash表扩容/缩容，键值对rehash到ht[1]，ht[0] = ht[1]
    * 渐进式rehash
        * insert: 写到ht[1]
        * get: 先读ht[0]，再读ht[1]
        * set、delete: 同时更新ht[0]和ht[1]
        * ht[0]逐步copy到ht[1]，只减不增，最终成为空表，rehash结束
* 相关命令
    * hdel: O(1)
    * hexists: O(1)
    * hget: O(1)
    * hgetall: O(N)
    * hkeys: O(N)
    * hlen: O(N)
    * hmget: O(N)
    * hmset: O(N)
    * hset: O(1)
    * hsetnx: O(1)，key不存在才set
    * hvals: O(N)

#### 跳跃表

* 数据结构
    * struct zskiplist
        * struct zskiplistNode *header
        * struct zskiplistNode *tail
        * unsigned long length
        * int level
    * struct zskiplistNode
        * robj *obj;
        * double score;
        * struct zskiplistNode *backward;
        * struct zskiplistLevel level[]
            * struct zskiplistNode *forward
            * unsigned int span
* 特点
    * 空间换时间
    * 节点数据顺序存放
    * 查找的时间复杂度为O(logN)
    * 
