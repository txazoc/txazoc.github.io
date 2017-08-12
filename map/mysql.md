---
layout: map
title:  MySQL
---

#### 表结构

* 库表: information_schema.schemata
* 表表: information_schema.tables
    * engine
    * auto_increment
    * 字符
* 字段表: information_schema.columns
    * [字段属性](#字段属性)
* 索引表: information_schema.statistics
* [表物理结构](#表物理结构)

#### <a id="表物理结构">表物理结构</a>

* InnoDB
    * .idb: 数据和索引
* MyISAM
    * tbl_name.frm: 表结构定义文件
    * tbl_name.MYD: 数据文件
    * tbl_name.MYI: 索引文件

#### <a id="字段属性">字段属性</a>

* Field: 字段名
    * 字段名为关键字: `` `column_name` ``
* Type: 字段类型
    * int(n): 定长显示，配合`zerofill`使用
    * varchar(n): 字符串长度
* Null: 是否可为空，取值 YES、NO
* Default: 默认值，例如 0、'1970-01-01 00:00:00'、current_timestamp
* Key: 索引
    * PRI(主键索引)
    * UNI(唯一索引)
    * MUL(可重复索引)
* Extra: 其它信息
    * auto_increment
    * on update current_timestamp

#### 执行计划


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
