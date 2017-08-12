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

#### <a id="auto_increment">auto_increment</a>

* auto_increment_offset: 自增偏移
* auto_increment_increment: 自增增量

#### <a id="索引">索引</a>

#### <a id="执行计划">执行计划(explain)</a>

* 输出格式
    * id: select语句id
    * select_type: select语句类型
    * table: 行输出来源的表名，可能多个
    * type: join类型
        * system: 表仅有一行，const的特例
        * const: 最多匹配一行
            * `select * from t where [primary_key | unique_key] = value`
        * eq_ref: 多表关联时，最多匹配一行，关联字段为`primary_key`或`unique_key`
            * `select * from t1, t2 where t1.[primary_key | unique_key] = t2.[primary_key | unique_key]`
        * ref: 关联非`primary_key`或`unique_key`索引字段
            * `select * from t where key = value`
            * `select * from t1, t2 where t1.key = t2.key`
        * index_merge: 多个索引查询合并
            * `select * from t where t.key1 = value1 or t.key2 = value2`
        * range: 单表，索引字段和`=、<>、>、>=、<、<=、<=>、IS NULL、IN()、BETWEEN()`
        * index: 扫描`Index Tree`
            * `select key from t`
        * ALL: 全表扫描，`最坏情况`
            * `select * from t`
    * possible_keys: 可能选择的索引
    * key: 实际选择的索引
    * key_len: 选择的索引长度
    * ref
    * rows: 估计要扫描的行数，越小越好
    * Extra: 其它信息

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
