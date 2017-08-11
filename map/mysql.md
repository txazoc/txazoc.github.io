---
layout: map
title:  MySQL
---

* 字段属性
    * Field: 字段名
    * Type: 字段类型
        * int(1) int(11): zerofill
        * varchar(5) varchar(10)
    * Null: YES、NO
    * Default: 0、'1970-01-01 00:00:00'、current_timestamp
    * Key: 索引
        * PRI(主键索引)
        * UNI(唯一索引)
        * MUL(可重复索引)
    * Extra
        * auto_increment
        * on update current_timestamp


* sql执行过程
    * column_names
    * where
    * group
    * order


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
