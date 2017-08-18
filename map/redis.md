---
layout: map
title:  Redis
---

Redis版本: `3.2.1`

#### 简单动态字符串－sds

* 数据结构
    * sdshdr{n}: sds结构体
        * uint{n}_t len: 当前长度，确定字符串结尾而非依赖于`\0`
        * uint{n}_t alloc: 分配总长度，用于空间预分配
        * unsigned char flags: 类型标记，低三位有效
        * char buf[]: 字符数组
        * `注`: n可取值8、16、32、64
    * sds: 简单动态字符串
        * typedef char *sds: 字符串指针
* 内存分布
    * 连续内存存储，可加速内存访问
    * sdshdr = [len][alloc][flags][buf]
    * buf = [sds][\0][alloc - len]
    * sds和sds结构体可以互相转换
        * sds = (char *) (sdshdr + sizeof(struct sdshdr))
        * sdshdr = (void *) (sds - sizeof(struct sdshdr))
* 特点(对比C语言字符串)
    * 空间换时间
    * 获取字符串长度的时间复杂度为`O(1)`
    * 杜绝缓冲区溢出: 字符串拼接时，先进行内存空间检查，内存空间不够自动扩容
    * 减少字符串修改时内存重分配的次数
        * 增长: 空间预分配
            * len &lt;= 1M，扩容后，alloc = 2 * len
            * len &gt; 1M，扩容后，alloc = len + 1M
        * 缩短: 惰性空间释放
    * 二进制安全: 以二进制格式存储文本、图片、视频等数据
    * 兼容部分C语言字符串函数: 同C语言字符串，以`\0`结尾，可重用部分C语言字符串函数
* 相关命令
    * append: O(1)，追加字符串
    * get: O(1)
    * getset: O(1)
    * mget: O(N)，批量get
    * mset: O(N)，批量set
    * set: O(1)
    * setex: O(1)，key存在才set
    * setnx: O(1)，key不存在才set
    * strlen: O(1)，字符串长度

#### 列表－list

* 数据结构
    * struct list: 列表
        * listNode *head: 表头节点指针
        * listNode *tail: 表尾节点指针
        * unsigned long len: 节点数
    * struct listNode: 列表节点
        * struct listNode *prev: 前置节点指针
        * struct listNode *next: 后置节点指针
        * void *value: 节点的值指针
* 特点
    * 双向无环链表
    * 表头表尾push、pop的时间复杂度为`O(1)`
    * 列表中insert、delete、update、get，会导致从表头或表尾遍历，时间复杂度为O(N)
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

#### 字典－dict

* 数据结构
    * struct dict: 字典
        * dictType *type: 类型函数
        * void *privdata: 私有数据
        * dictht ht[2]: hash表数组，大小为2，ht[0]用来读写，ht[1]用来rehash
        * long rehashidx: rehash索引，即table下标，记录rehash的进度，为-1时表示没有在rehash
        * int iterators: 正在迭代中的迭代器数量
    * struct dictht: hash表
        * dictEntry **table: hash表数组
        * unsigned long size: hash表大小，2的n次方
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
* 特点
    * get、set、del的时间复杂度都为O(1)
* hash
    * hash算法: MurmurHash2
    * index = hash(key) & sizemask
    * hash键冲突: 链地址法
    * 负载因子: used / size，决定是否扩容/缩容
    * rehash: hash表扩容/缩容，ht[0]中键值对转移到ht[1]
    * 扩容条件
        * 条件一: ht[0].used &gt; ht[0].size
        * 条件二: dict_can_resize \|\| ht[0].used / ht[0].size &gt; dict_force_resize_ratio
        * dict_can_resize: 是否可以扩容，默认为1代表可以扩容
        * dict_force_resize_ratio: 强制扩容的比率，默认为5
    * 缩容条件
        * used * 100 / size &lt; HASHTABLE_MIN_FILL(10): 下限10%
    * 渐进式rehash过程
        * 判断是否在`rehash`: `rehashidx`不为-1代表正在进行`rehash`
        * 循环处理ht[0]中的`桶`直到`ht[0].used`为0，桶下标`rehashidx`
            * 空桶直接略过
            * 非空桶
                * 遍历桶中的节点，计算落到ht[1]中桶的index并添加到对应的桶中
                * ht[0].used--
                * ht[1].used++
                * ht[0].table[rehashidx] = NULL
            * rehashidx++
        * 释放`ht[0].table`
        * ht[0] = ht[1]
        * ht[1]复位为空白hash表
        * rehashidx = -1
    * 渐进式rehash时操作
        * insert: 写到ht[1]
        * delete: 先删ht[0]，未成功再删ht[1]
        * get: 先读ht[0]，未成功再读ht[1]
        * set: 先`get`再更新
* 相关命令
    * hdel: O(1)
    * hexists: O(1)
    * hget: O(1)
    * hgetall: O(N)
    * hkeys: O(N)
    * hlen: O(1)
    * hmget: O(N)
    * hmset: O(N)
    * hset: O(1)
    * hsetnx: O(1)，key不存在才set
    * hvals: O(N)

#### 跳跃表－zskiplist

* 数据结构
    * struct zskiplist: 跳跃表
        * struct zskiplistNode *header: 表头节点指针
        * struct zskiplistNode *tail: 表尾节点指针，用于表尾遍历
        * unsigned long length: 节点数(不包括表头节点)
        * int level: 最大层数(不包括表头节点的层数)
    * struct zskiplistNode: 跳跃表节点
        * robj *obj: 节点成员对象，`必须唯一`
        * double score: 节点分值，节点按分值从小到大排序，节点分值可以相同
        * struct zskiplistNode *backward: 后退指针，方便`区间查找`
        * struct zskiplistLevel level[]: 层，层的高度为`1 ~ 32`之间的随机数
            * struct zskiplistNode *forward: 前进指针，加速查找，`跳跃表的核心`
            * unsigned int span: 跨度，用于计算`score`
* 特点
    * 空间换时间
    * 表中节点有序
    * 节点查找的时间复杂度为O(logN)
    * 区间查找的时间复杂度为O(logN)
    * 排序对比时，先对比`score`，再对比`obj`
* 对比红黑树
    * 二者都有序，查找的时间复杂度都为O(logN)
    * 节点变更时，跳跃表维护的成本更低
    * 区间查找时，跳跃表的效率更高

#### 整数集合－intset

* 数据结构
    * struct intset
        * uint32_t encoding: 编码方式，可取值2(int16_t)、4(int32_t)、8(int64_t)
        * uint32_t length: 元素数量
        * int8_t contents[]: 元素数组
* 特点
    * 连续内存存储，可加速内存访问
    * 集合元素有序递增，无重复
    * 尽可能的节省内存
    * 支持类型升级，不支持降级
    * get
        * 按index: 数组下标访问，时间复杂度O(1)
        * 按值: 二分查找，时间复杂度O(logN)
    * insert、delete、set: `get` + `移位`
* 类型升级
    * int16_t -> int32_t -> int64_t
    * 分配新的内存空间
    * 集合中元素copy到新的内存空间

#### 压缩列表－ziplist

* 数据结构
    * ziplist
        * uint32_t zlbytes: 整个压缩列表的内存字节数，用于内存重分配和定位`zlend`
        * uint32_t zltail: 压缩列表表尾节点距离起始地址的偏移，用于定位`表尾节点`
        * uint16_t zllen: 压缩列表的节点数，等于`65535`时，要遍历整个压缩列表才能计算出真实的节点数
        * struct zlentry[]: 压缩列表节点
            * unsigned int prevrawlensize: `prevrawlen`占用的字节数
            * unsigned int prevrawlen: 前一个节点的长度，用于向前遍历
            * unsigned int lensize: `len`占用的字节数
            * unsigned int len: 当前节点的长度，用于确定节点内容及向后遍历
            * unsigned int headersize: 当前节点的头部大小
            * unsigned char encoding: 当前节点内容编码
            * unsigned char *p: 当前节点内容指针
        * uint8_t zlend: 特殊值`0xFF`，标记压缩列表的末端
* 特点
    * 特殊双向链表
    * 连续内存存储，内存利用率高
    * 头部尾部push和pop的时间复杂度为O(1)
    * 增删改查效率低

#### Redis对象

* Redis对象: Redis内部不同类型的`value`，提供一种统一的表示方式
* 数据结构
    * struct redisObject: Redis对象
        * unsigned type:4: 数据类型
            * OBJ_STRING: string
            * OBJ_LIST: list
            * OBJ_SET: set
            * OBJ_ZSET: zset
            * OBJ_HASH: hash
        * unsigned encoding:4: 编码方式，允许同一种数据类型采用不同的内部表示，`以节省内存`
            * OBJ_ENCODING_RAW: `sds`
            * OBJ_ENCODING_INT: `long`
                * 未启用`LRU`且0 &lt;= value &lt; 10000，使用共享数字对象`shared.integers`表示
                * 否则，`ptr`直接存储long值
            * OBJ_ENCODING_HT: `dict`
            * OBJ_ENCODING_ZIPLIST: `ziplist`
                * `zset`和`dict`: 集合大小较小且元素长度较小时节省内存的编码方式
            * OBJ_ENCODING_INTSET: `intset`
            * OBJ_ENCODING_SKIPLIST: `zset`(dict + zskiplist)
            * OBJ_ENCODING_EMBSTR: `embedded string`
                * embedded string: 嵌入式字符串
                * sds和redisObject一起分配在同一个内存块(不超过64字节)中，节省空间，提高缓存命中
                    * sizeof(redisObject): 16
                    * sizeof(sdshdr8): 3
                    * sizeof(sds): &lt;= `44`
                    * sizeof('\0'): 1
                * sds不可变: alloc = len，无空闲内存空间
            * OBJ_ENCODING_QUICKLIST: `quicklist`
        * unsigned lru:24
        * int refcount: 引用计数，支持对象共享
        * void *ptr: 数据指针，指向实际的存储结构
* 数据类型编码
    * string
        * OBJ_ENCODING_INT
            * 字符串长度小于等于`21`且是long型字符串
            * 执行`incr`和`decr`
            * `OBJ_ENCODING_INT`编码类型字符串上执行`append`、`setbit`、`getrange`，先转为`OBJ_ENCODING_EMBSTR`或`OBJ_ENCODING_RAW`编码类型
        * OBJ_ENCODING_EMBSTR: 字符串长度小于等于`44`
        * OBJ_ENCODING_RAW: 其它，空闲空间大于`10%`，释放空闲空间
    * list
        * OBJ_ENCODING_QUICKLIST
    * set
        * 控制参数
            * set_max_intset_entries: `intset`编码方式的最大集合大小，默认为512
        * OBJ_ENCODING_INTSET: 
        * OBJ_ENCODING_HT: 集合大小大于`set_max_intset_entries`或包括非long型字符串
    * zset
        * 控制参数
            * zset_max_ziplist_entries: `ziplist`编码方式的最大集合大小，默认为128
            * zset_max_ziplist_value: `ziplist`编码方式的最大元素长度，默认为64
        * OBJ_ENCODING_ZIPLIST
        * OBJ_ENCODING_SKIPLIST: 集合大小大于`zset_max_ziplist_entries`或元素长度大于`zset_max_ziplist_value`
    * hash
        * 控制参数
            * hash_max_ziplist_entries: `ziplist`编码方式的最大集合大小，默认为512
            * hash_max_ziplist_value: `ziplist`编码方式的最大元素长度，默认为64
        * OBJ_ENCODING_ZIPLIST
        * OBJ_ENCODING_HT: 集合大小大于`hash_max_ziplist_entries`或元素长度大于`hash_max_ziplist_value`

#### Redis事务

* 事务命令
    * multi: 标记事务开始，`client`添加事务标记`CLIENT_MULTI`
    * watch: 监视key，`client`添加到`key`的监视集合中
    * unwatch: 取消对key的监视，将`client`从`key`的监视集合中移除
    * discard: 取消执行事务，清除`client`的事务标记，将`client`从`key`的监视集合中移除
    * exec: 提交执行事务，先检查事务标记，然后开始执行事务中的命令
    * 事务标记
        * CLIENT_MULTI: 标记事务开始
        * CLIENT_DIRTY_CAS: 监视的`key`被修改，`exec`执行失败
        * CLIENT_DIRTY_EXEC: 命令入队失败，`exec`执行失败
        * 事务执行条件: CLIENT_MULTI && !(CLIENT_DIRTY_CAS \| CLIENT_DIRTY_EXEC)
* 事务特性
    * 事务中全部命令顺序执行
    * 事务中命令要么全部执行，要么全部不执行
    * 事务中一个命令执行失败，不会回滚，其它命令继续执行

#### Redis AOF

#### Redis RDB
