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

#### 快速列表－quicklist

* 数据结构
    * struct quicklist: 快速列表
        * quicklistNode *head: 头部节点指针
        * quicklistNode *tail: 尾部节点指针
        * unsigned long count: 列表中元素的数量
        * unsigned int len: quicklist节点的数量
        * int fill:16: 单个ziplist的最大大小，由`list_max_ziplist_size`给定，取负值时，规则如下，取正值时，表示单个ziplist的最大字节数
            * -1: 4096，4k
            * -2: 8192，8k，默认设置
            * -3: 16384，16k
            * -4: 32768，32k
            * -5: 65536，64k
        * unsigned int compress:16: quicklist两端节点不被压缩的深度，由`list_compress_depth`给定，默认为0表示不压缩，大于0就会对排除掉两端`compress`个quicklist节点之外的中间quicklist节点进行压缩
    * struct quicklistNode: quicklist节点
        * struct quicklistNode *prev: 前一个quicklist节点指针
        * struct quicklistNode *next: 后一个quicklist节点指针
        * unsigned char *zl: 节点内容指针，没被压缩时，指向`ziplist`结构，否则指向`quicklistLZF`结构
        * unsigned int sz: `ziplist`占用内存大小
        * unsigned int count:16: `ziplist`中元素个数
        * unsigned int encoding:2: 编码方式，1-RAW，2-LZF
        * unsigned int container:2: 1-NONE，2-ziplist
        * unsigned int recompress:1: 解压标记，为1代表该节点正在被解压
        * unsigned int attempted_compress:1: 测试相关
        * unsigned int extra:10: 预留字段
    * typedef struct quicklistLZF: quicklist压缩节点
        * unsigned int sz: 压缩后占用的字节数
        * char compressed[]: 压缩后的内容
* 设计原理: 结合`双端链表`和`ziplist`各自的优点，互补不足
* 特点
    * 头部尾部push和pop的时间复杂度为O(1)
    * 节点采用`ziplist`或LZF压缩存储，存储效率高

#### Redis对象

* Redis对象
    * Redis内部string类型的`key`
    * Redis内部不同类型的`value`，提供一种统一的表示方式
* 数据结构
    * struct redisObject: Redis对象
        * unsigned type:4: 数据类型
            * OBJ_STRING: string，字符串
            * OBJ_LIST: list，列表
            * OBJ_SET: set，集合
            * OBJ_ZSET: zset，有序集合
            * OBJ_HASH: hash，哈希表
        * unsigned encoding:4: 编码方式
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
                * 执行`append`操作，转为`OBJ_ENCODING_RAW`类型
            * OBJ_ENCODING_QUICKLIST: `quicklist`
        * unsigned lru:24: 对象最后一次被访问的时间
        * int refcount: 引用计数
        * void *ptr: 数据指针，指向实际的存储结构
* 编码方式
    * 允许同一种数据类型采用不同的内部表示
    * 目的: 尽可能的`节省内存`，牺牲时间换取空间
    * string
        * OBJ_ENCODING_INT
            * 字符串长度小于等于`21`且是long型字符串
            * 执行`incr`和`decr`操作
            * `OBJ_ENCODING_INT`编码类型字符串上执行`append`、`setbit`、`getrange`操作，先转为`OBJ_ENCODING_EMBSTR`或`OBJ_ENCODING_RAW`编码类型
        * OBJ_ENCODING_EMBSTR: 字符串长度小于等于`44`
        * OBJ_ENCODING_RAW: 其它，空闲空间大于`10%`，释放空闲空间
    * list
        * OBJ_ENCODING_QUICKLIST
    * set
        * 控制参数
            * set_max_intset_entries: `intset`编码方式的最大集合大小，默认为512
        * OBJ_ENCODING_INTSET
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
* 相关命令
    * type: 查看对象的数据类型
    * object encoding: 查看对象的编码方式
    * debug object: 查看对象的调试信息
* refcount的作用
    * 内存回收: refcount为0时，释放对象的内存空间
    * 对象共享
        * 节省内存: 共享同一个对象，refcount++
        * 只共享了整数的字符串对象`shared.integers`
        * 开启`LRU`后，关闭对象共享

#### Redis数据库

* struct redisServer
    * int dbnum: 数据库数量，默认为16
    * redisDb *db: redis数据库
        * dict *dict: 数据库键空间，存放键值对
            * 键: `key`，string类型的redisObject
            * 值: `value`，任意类型的redisObject
        * dict *expires: 存放键的过期时间，不包含无过期时间的`key`
            * 键: `key`
            * 值: `key`的过期时间，unix时间戳，单位为毫秒
        * dict *blocking_keys: 处于阻塞状态的键
        * dict *ready_keys: 准备解除阻塞状态的键
        * dict *watched_keys: 被`watch`监视的键
* key过期删除
    * 惰性删除
        * expireIfNeeded: 所有读写命令执行前调用
            * 无过期时间，直接返回
            * 当前节点为slave节点，`key`的过期操作由master节点控制，只返回正确状态即可
            * master节点: 未过期直接返回，否则删除`key`，并向slave节点发送`del`命令删除`key`
                * dictDelete(db-&gt;expires, key-&gt;ptr)
                * dictDelete(db-&gt;dict, key-&gt;ptr)
    * 定期删除
        * activeExpireCycle
            * 在周期性函数serverCron被调用时调用
            * 可控制周期执行时间快慢和一次执行的时间上限
            * 执行时，随机从`expires`中拿取`key`检查是否过期，过期则执行删除，`同上`
* 相关命令
    * select: 切换redis数据库
    * persist: 移除key的过期时间，持久化
    * expire: 设置key的过期时间，单位为秒
    * expireat: 设置key的过期时间点，unix时间戳，单位为秒
    * pexpire: 设置key的过期时间，单位为毫秒
    * pexpireat: 设置key的过期时间点，unix时间戳，单位为毫秒
    * ttl: 返回key的剩余过期时间，单位为秒
    * pttl: 返回key的剩余过期时间，单位为毫秒

#### Redis持久化

* RDB
    * RDB写入
        * redis数据库 -&gt; RDB文件
    * RDB文件结构
        * REDIS: "REDIS"字符串
        * RDB_VERSION: RDB版本号，四字节，例如0007
        * DB-DATA: redis数据库
            * SELECT-DB: redis数据库标识
            * KEY-VALUE-PAIRS: redis数据库中的键值对
                * OPTIONAL-EXPIRE-TIME: 键的过期时间，可选
                * TYPE-OF-VALUE: `VALUE`的编码方式
                * KEY: 键
                * VALUE: 值
        * EOF: redis数据库内容结尾标识
        * CHECK-SUM: 校验和
* AOF(Append Only File)
    * AOF写入
        * 写命令 -&gt; AOF文件
        * AOF同步写: 保证数据实时持久化
            * 写命令 -&gt; AOF缓冲区 -&gt; AOF文件
        * AOF重写: 解决AOF文件大小不断增长的问题
            * redis数据库 -&gt; 写命令 -&gt; AOF文件
            * AOF重写期间的写命令 -&gt; AOF重写缓冲区 -&gt; AOF文件
    * AOF文件结构
        * 写命令行: redis请求命令格式
* redis启动磁盘加载
    * AOF开启: 加载AOF
        * AOF文件 -&gt; redis数据库
    * AOF关闭: 加载RDB
        * RDB文件 -&gt; redis数据库
* 对比
    * RDB: 全量持久化
    * AOF: 增量持久化，数据更实时
* 相关命令
    * save: 同步写RDB
    * bgsave: 异步写RDB

#### Redis事件驱动

* 事件类型
    * 文件事件
    * 时间事件
* 事件驱动实现: `I/O多路复用`
* Redis命令请求执行过程
    * Redis初始化(server.c/initServer)
        * 开启TCP端口监听
        * 注册时间事件: 事件回调函数`serverCron`
        * 注册客户端连接事件: 事件回调函数`acceptTcpHandler`
    * Redis事件主循环(server.c/aeMain): 串行执行
        * beforeSleep
            * AOF缓冲区数据写到AOF文件
            * 处理客户端响应，遍历有待写数据的`client`
                * `client`写缓冲区的数据写入客户端
                * 还有待写的数据，注册客户端写事件，事件回调函数`sendReplyToClient`
        * `poll`已就绪的文件事件并遍历
            * 读文件事件: 执行读文件事件回调函数
            * 写文件事件: 执行写文件事件回调函数
        * 遍历时间事件
            * 时间事件已就绪: 执行时间事件回调函数
        * 一次循环完成
    * 事件回调函数
        * serverCron
        * acceptTcpHandler
            * `accept`客户端连接
            * 创建客户端上下文对象`client`并初始化
            * 注册客户端读事件: 事件回调函数`readQueryFromClient`
            * 选择`0`号redis数据库
        * readQueryFromClient
            * 读数据到`querybuf`
            * 循环处理直到`querybuf`为空
                * 从`querybuf`读redis请求命令并封装为redis对象，赋值给`client.argv`
                * 从redis命令表`redisCommandTable`中查询命令，赋值给`client.cmd`
                * 命令校验，如果校验失败，有`CLIENT_MULTI`标记则添加`CLIENT_DIRTY_EXEC`标记，然后返回
                * 有`CLIENT_MULTI`标记且非`multi`、`watch`、`disard`、`exec`命令: 添加新的命令到`client`的事务命令队列
                * 其它命令
                    * 执行命令: `c->cmd->proc(c)`
                    * 写慢查询日志
                    * 写命令: 同步到AOF文件，同步给slave节点
                    * 命令执行计数+1
                * `unblock`已就绪的`key`的`client`
        * sendReplyToClient: 写缓冲区中的数据写入客户端

#### Redis事务

* 数据结构
    * struct client
        * list *watched_keys: 当前`client`监视的`key`集合
            * struct watchedKey
                * robj *key: `key`
                * redisDb *db: `key`对应的redis数据库
        * redisDb *db: 当前`client`对应的redis数据库
            * dict *watched_keys
                * 键: `key`
                * 值: 监视`key`的`client`列表
* 事务命令
    * multi: 事务开始，给`client`添加事务标记`CLIENT_MULTI`
    * watch: 监视`key`
        * 检查`client`是否有事务标记`CLIENT_MULTI`
        * `client`添加到监视`key`的`client`列表中
    * unwatch: 取消对`key`的监视
        * 检查`client`是否有事务标记`CLIENT_MULTI`
        * 将`client`从监视`key`的`client`列表中移除
    * discard: 取消执行事务
        * 检查`client`是否有事务标记`CLIENT_MULTI`
        * 清除`client`的事务标记`CLIENT_MULTI`、`CLIENT_DIRTY_CAS`、`CLIENT_DIRTY_EXEC`
        * `unwatch`所有的`key`
    * exec: 提交执行事务
        * 检查`client`是否有事务标记`CLIENT_MULTI`
        * 检查`client`是否有事务标记`CLIENT_DIRTY_CAS`或`CLIENT_DIRTY_EXEC`
        * `unwatch`所有的`key`
        * 循环从命令队列中获取命令并执行
        * 执行`discard`操作
    * 事务标记
        * CLIENT_MULTI: 标记事务上下文
        * CLIENT_DIRTY_CAS: 监视的`key`被修改
        * CLIENT_DIRTY_EXEC: 命令入队失败
        * `exec`执行命令条件: CLIENT_MULTI && !(CLIENT_DIRTY_CAS \| CLIENT_DIRTY_EXEC)
* 事务特性
    * 原子性: 能保证所有命令全部执行或全部不执行，但有命令执行失败不会回滚
    * 一致性: 单进程单线程模型保证
    * 隔离性: 单进程单线程模型保证
    * 持久性: 通过AOF保证准实时持久化

#### Redis发布与订阅

* 数据结构
    * struct redisServer
        * dict *pubsub_channels: 发布/订阅频道字典
            * 键: 频道
            * 值: 订阅频道的`client`列表
        * list *pubsub_patterns: 发布/订阅模式列表
            * struct pubsubPattern: 发布/订阅模式
                * robj *pattern: 模式
                * client *client: 订阅模式的`client`
* 订阅
    * subscribe: 订阅频道
        * 当前`client`添加到频道订阅的`client`列表后
    * unsubscribe: 取消订阅频道
        * 参数处理
            * 无参数: 取消订阅所有频道
            * 多个频道参数: 取消订阅多个频道
        * 遍历上面选取的频道列表，从频道订阅的`client`列表中删除当前`client`
    * psubscribe: 订阅模式
        * 模式和当前`client`构造为`pubsubPattern`添加到`pubsub_patterns`中
    * punsubscribe: 取消订阅模式
        * 参数处理
            * 无参数: 取消订阅所有模式
            * 多个模式参数: 取消订阅多个模式
        * 遍历上面选取的模式列表，从`pubsub_patterns`中删除模式和当前`client`对应的`pubsubPattern`
* 发布: publish
    * 发送消息给订阅频道的所有`client`
        * 从`pubsub_channels`从查找频道订阅的`client`列表
        * 遍历`client`列表，向`client`发送消息
        * 消息格式: message\r\n{channel}\r\n{message}
    * 发送消息给匹配频道的所有`client`
        * 遍历`pubsub_patterns`中的`pubsubPattern`，如果`pattern`和频道匹配，则向对应的`client`发送消息
        * 消息格式: pmessage\r\n{pattern}\r\n{channel}\r\n{message}
* 特点
    * 只支持在线订阅

#### Redis集群

* 客户端分布式
    * 一致性hash，同Memcached集群
    * 主从
* 服务端分布式
    * 集群
* Redis集群
    * 去中心化
    * 分片
        * 16384个slot分给Redis集群中的redis节点
        * key -&gt; hash(key) & 16384 -&gt; redis节点
        * client -&gt; redis [-&gt; 重定向 -&gt; redis]
    * 重新分片: 数据迁移
    * 主从
        * 从节点复制主节点
        * 主节点下线，从节点切换为主节点
