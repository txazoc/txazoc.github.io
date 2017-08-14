---
layout: map
title:  MySQL
---

#### 表结构

* 库表: information_schema.schemata
    * schema_name: 库名
    * default_character_set_name: 默认字符集
    * default_collation_name: 默认排序规则
* 表表: information_schema.tables
    * table_name: 表名
    * engine: [存储引擎](#存储引擎)
    * [auto_increment](#auto_increment): 下一个自增id
    * table_collation: 排序规则
    * character_set: 字符集
* 字段表: information_schema.columns
    * [字段属性](#字段属性)
* 索引表: information_schema.statistics
    * [索引](#索引)
* [表物理结构](#表物理结构)

#### <a id="表物理结构">表物理结构</a>

* InnoDB
    * tbl_name.frm: 表结构定义文件
    * tbl_name.idb: 数据和索引文件
* MyISAM
    * tbl_name.frm: 表结构定义文件
    * tbl_name.MYD: 数据文件
    * tbl_name.MYI: 索引文件

#### <a id="字段属性">字段属性</a>

* Field: 字段名
    * 字段名为关键字: `` `column_name` ``
* Type: 字段类型
    * 整数类型
        * tinyint: 1字节，`-128` ~ `127`
        * smallint: 2字节，`-32768` ~ `32767`
        * int(n): 4字节，n为最小显示宽度，配合`zerofill`使用，宽度不够左边填充0
        * bigint: 8字节
        * unsigned: 无符号数
    * 字符串类型
        * char(n): 定长字符串，0 &lt; n &lt;= `255`，定长存储，长度不足以空格填充，读取时去掉尾部空格
        * varchar(n): 变长字符串，0 &lt; n &lt;= `65535`
        * text: 变长字符串，无`default`
    * 时间类型
        * datetime: &nbsp;8字节`int`，索引相对慢，和时区无关，时间范围: `1000-01-01 00:00:00` ~ `9999-12-31 23:59:59`
        * timestamp: 4字节`int`，索引相对快，和时区有关，时间范围: `1970-01-01 00:00:00` ~ `2038-01-19 03:14:07`，插入和更新支持填充当前时间`current_timestamp`
* Null: 是否可为空，取值 YES、NO
* Default: 默认值，例如 0、'1970-01-01 00:00:00'、current_timestamp
* Key: 索引
    * PRI(主键索引)
    * UNI(唯一索引)
    * MUL(可重复索引)
* Extra: 其它信息
    * auto_increment
    * on update current_timestamp

#### <a id="存储引擎">存储引擎</a>

* MyISAM
    * 不支持事务，强调性能
    * 锁类型: 表锁
    * 索引: 非聚集索引
* InnoDB
    * 支持事务
    * 锁类型: 表锁、行锁
    * 索引: 聚集索引(主键)
    * 支持 [MVCC](#MVCC)
* [InnoDB事务](#InnoDB事务)
* [MySQL锁机制](#MySQL锁机制)

#### <a id="auto_increment">auto_increment</a>

* auto_increment_offset: 自增偏移
* auto_increment_increment: 自增增量

#### <a id="索引">索引</a>

* 索引分类
    * 聚集索引: InnoDB，索引和数据在同一个文件中
        * 聚集索引: 主键索引、唯一索引或隐藏主键索引(InnoDB自动生成)
            * 索引数据项: 行数据
            * 查询: 聚集索引 -> 行数据
        * 辅助索引: 除聚集索引之外的索引
            * 索引数据项: 聚集索引的值
            * 查询: 辅助索引 -> 聚集索引 -> 行数据
    * 非聚集索引: MyISAM，索引和数据在不同文件中
        * 索引数据项: 行数据的物理地址
        * 查询: 索引 -> 行数据的物理地址 -> 行数据
* B+Tree

#### <a id="执行计划">执行计划(explain)</a>

* id: select语句id
* select_type: select语句类型
* table: 行输出来源的表名，可能多个
* type: join类型
    * system: 表仅有一行，`const`的特例
    * const: 单表`primary_key`或`unique_key`查询，最多匹配一行，操作符 `=`
    * eq_ref: 多表`primary_key`或`unique_key`关联查询，最多匹配一行，操作符 `=`，`最好的关联类型`
    * ref: 单表索引查询或多表索引关联查询，操作符 `=`
    * ref_or_null: 在`ref`的基础上对`NULL`值做额外搜索
    * index_merge: 多个索引查询合并，操作符 `OR`
    * range: 单表索引范围查询，操作符 `!=、<>、>、>=、<、<=、IN()、BETWEEN()`
    * index: 全表扫描`index tree`
    * ALL: 全表扫描，`最坏的情况`，尽量避免
    * 总结
        * `主键或唯一索引` &gt; `普通索引` &gt; `无索引`
        * `=` &gt; `OR` &gt; `范围查询` &gt; `全表扫描`
* possible_keys: 可能选择的索引
* key: 实际选择的索引
* key_len: 选择的索引长度
* ref: 和`key`指定的索引做比较的行或`const`
* rows: 估计要扫描的行数，越小越好
* Extra: 其它信息
    * Using index: 只使用索引，避免访问表
    * Using filesort: 使用额外排序
    * Using index condition: 使用索引条件
    * Using temporary: 使用临时表
    * Using where: 使用where

#### <a id="InnoDB事务">InnoDB事务</a>

* 事务的ACID特性
    * A 原子性: 一个事务中的所有操作，要么全部执行，要么全部不执行，不会停留在某个中间状态，允许回滚
        * [MVCC](#MVCC)
        * autocommit
        * commit、rollback
    * C 一致性: 事务从一个一致性状态切换到另一个一致性状态，事务的中间状态不会被其它事务看到
        * doublewrite buffer
        * crash recovery
    * I 隔离性: 事务之间互相影响的程度，适当的破坏`一致性`来提升并发度
        * autocommit
        * [事务隔离级别](#事务隔离级别)
        * 行锁
    * D 持久性: 事务提交后，数据会被持久化到数据库，不会丢失
        * doublewrite buffer
        * innodb_flush_log_at_trx_commit
        * sync_binlog
        * innodb_file_per_table
* 并发事务产生的问题
    * 脏读: 一个事务读取了另一个事务`未提交`的数据，读到脏数据
        * 问题来源: 读写并发
        * 解决方案: [MySQL锁机制](#MySQL锁机制)
    * 不可重复读: 一个事务读取了另一个事务`提交后`的数据，多次读取结果不同
        * 问题来源: 事务并发
        * 解决方案: [MVCC](#MVCC)
    * 幻读: 一个事务读取了另一个事务插入的记录，多次读取结果不同
        * 问题来源: 读事务无法对`insert`的行加锁
        * 解决方案: 事务串行化
* <a id="事务隔离级别">事务隔离级别</a>
    * Read Uncommitted: 读未提交
    * Read Committed: 读已提交，解决`脏读`
        * [MySQL锁机制](#MySQL锁机制)
    * Repeatable Read: 可重复读，解决`脏读`、`不可重复读`，InnoDB默认隔离级别
        * [MVCC](#MVCC)
    * Serializable: 串行化，解决所有并发问题

#### <a id="MySQL锁机制">MySQL锁机制</a>

* 按读写分类
    * 共享锁(S锁)
    * 独占锁(X锁)
* 按锁粒度分类
    * 表锁: 锁表，加锁快，开销小，无死锁，锁粒度大，并发度低
    * 页锁: 介于两者之间，有死锁
    * 行锁: 锁行，加锁慢，开销大，有死锁，锁粒度小，并发度高
* MyISAM
    * 表锁
    * 写请求优先级更高，适合读多写少的场景
* InnoDB
    * 表锁: `锁表`
        * 表共享读锁: `lock tables ... read`
        * 表独占写锁: `lock tables ... write`
    * 行锁: `锁行记录`
        * 共享锁(S锁): `select ... lock in share mode`
        * 独占锁(X锁): `select ... for update`
    * 意向锁(Intention Lock): 表级锁，表示事务准备给表中的行加共享锁或独占锁
        * 意向共享锁(IS锁): 事务准备给表中的行加共享锁
        * 意向独占锁(IX锁): 事务准备给表中的行加独占锁
        * 作用: 快速检测`表锁和行锁之间的冲突`，实现表锁和行锁的共存
    * 记录锁(Record Lock): `锁索引项`，索引查询才有效
        * 作用:
    * 间隙锁(Gap Lock): `锁索引项之间的间隙`，`... )`、`( )`、`( ...`
        * 作用: 阻止其它事务插入间隙，解决`RR隔离级别`的幻读问题
    * Next-Key Lock: `锁索引项和索引项前的一个间隙`，`( ]`，记录锁和间隙锁的结合
        * 作用: 阻止其它事务插入间隙，解决`RR隔离级别`的幻读问题
    * 插入意向锁(Insert Intention Lock)
* 表锁和意向锁兼容矩阵

| --- | --- | --- |
|    | X | IX | S | IS |
| X  | - | - | - | - |
| IX | - | + | - | + |
| S  | - | - | + | + |
| IS | - | + | + | + |

* InnoDB锁
    * 读写一致性 -> 表共享读锁和表独占写锁
    * 提高并发度 -> 行锁(共享锁和独占锁)
    * 表锁和行锁冲突 -> 意向锁
    * 幻读问题 -> 间隙锁和Next-Key Lock
    * 插入冲突 -> 插入意向锁
    * 继续提高并发度 -> MVCC

#### <a id="MVCC">多版本并发控制(MVCC)</a>

* 行记录隐藏字段
    * DB_TRX_ID: 最新`insert`或`update`行记录的事务id
    * DB_ROLL_PTR: 行记录在`rollback segment`中的`undo log`记录的指针
    * DB_ROW_ID: 
    * DELETE_BIT: 行记录的删除标识，默认为0
* transaction_id: 事务id，递增
* insert: `DB_TRX_ID` = `transaction_id`
* delete: `DELETE_BIT` = 1
* update: copy行记录
    * 老行: `DELETE_BIT` = 1
    * 新行: `DB_TRX_ID` = `transaction_id`
* select: `DB_TRX_ID` <= `transaction_id` and `DELETE_BIT` = 0

#### <a id="InnoDB日志文件">InnoDB日志文件</a>

* 重做日志(Redo Log)
* 双写缓存(Doublewrite Buffer)
* 撤销日志(Undo Log)

#### <a id="DML">数据操作语言(DML)</a>

* insert
    * batch insert
* delete
    * 使用带where条件的索引，尽量避免锁表
* update
    * 使用带where条件的索引，尽量避免锁表
* select

#### <a id="DML">数据操作语言(DML)</a>

* 函数用在不同地方(column_names where group order)


* null值


* like


* count
    * count(1): 扫描主键，包含NULL值
    * count(*): 扫描全表，包含NULL值
    * count(column): 扫描字段，不包含NULL值


* join


* explain

* 日志
    * 慢查询日志

* explain

* SQL优化

* InnoDB
    * 事务
    * 锁
    * MVCC
    * B+树

* ACID
    * 原子性
        * commit
        * rollback
        * autocommit
    * 一致性
        * doublewrite buffer
        * crash recovery
    * 隔离性
        * autocommit
        * 事务隔离级别
    * 持久性
        * doublewrite buffer
        * sync_binlog


#### MVCC

* DB_TRX_ID
* DB_ROLL_PTR
* DB_ROW_ID
