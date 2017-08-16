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
        * listNode *head: 表头节点指针
        * listNode *tail: 表尾节点指针
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
        * struct zskiplistNode *header: 表头节点指针
        * struct zskiplistNode *tail: 表尾节点指针，用于表尾遍历
        * unsigned long length: 节点数(不包括表头节点)
        * int level: 最大层数(不包括表头节点的层数)
    * struct zskiplistNode
        * robj *obj: 节点成员对象，`必须唯一`
        * double score: 节点分值，节点按节点分值从小到大排序，节点分值可以相同
        * struct zskiplistNode *backward: 后退指针，方便`区间查找`
        * struct zskiplistLevel level[]: 层，层的高度为`1 ~ 32`之间的随机数
            * struct zskiplistNode *forward: 前进指针，加速查找，`跳跃表的核心`
            * unsigned int span: 跨度，用于计算`score`
* 特点
    * 空间换时间
    * 节点集合有序
    * 节点查找的时间复杂度为O(logN)
    * 区间查找的时间复杂度为O(logN)

#### 整数集合

* 数据结构
    * struct intset
        * uint32_t encoding: 编码方式，可取值2、4、8，决定集合的元素类型分别为int16_t、int32_t、int64_t
        * uint32_t length: 元素数量
        * int8_t contents[]: 元素数组
* 特点
    * 集合元素有序
    * 尽可能的节约内存
    * 支持类型升级，不支持降级
* 类型升级
    * int16_t -> int32_t -> int64_t
    * 分配新的内存空间
    * 集合中元素copy到新的内存空间

#### 压缩列表

* 数据结构
    * ziplist
        * uint32_t zlbytes: 压缩列表的内存字节数
        * uint32_t zltail: 压缩列表表尾节点距离起始地址的字节数
        * uint16_t zllen: 压缩列表的节点数
        * struct zlentry: 压缩列表节点
            * unsigned int prevrawlensize, prevrawlen;
            * unsigned int lensize, len;
            * unsigned int headersize;
            * unsigned char encoding;
            * unsigned char *p;
        * uint8_t zlend: `0xFF`，标记压缩列表的末端
