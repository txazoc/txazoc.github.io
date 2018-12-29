---
layout: index
title:  InnoDB
---

[The InnoDB Storage Engine](https://dev.mysql.com/doc/refman/5.7/en/innodb-storage-engine.html)

#### ACID模型

* A(Atomicity): 原子性
    * autocommit
    * `commit`、`rollback`
* C(Consistency): 一致性
    * doublewrite buffer
    * Crash Recovery
* I(Isolation): 隔离性
    * autocommit
    * set ISOLATION LEVEL
    * Row-Level Lock
* D(Durability): 持久性
    * doublewrite buffer
    * `set innodb_flush_log_at_trx_commit`
    * sync_binlog
    * innodb_file_per_table

#### MVCC

* DB_TRX_ID(6byte): 事务ID
* DB_ROLL_PTR(7byte): 回滚指针
* DB_ROW_ID

#### InnoDB In-Memory Structures

* Buffer Pool

#### InnoDB On-Disk Structures

* Tables
    * `.frm`: 数据字典
    * `.ibd`: 数据和索引
    * innodb_file_per_table
* Indexes
    * Clustered Index: 聚集索引
    * Secondary Index: 辅助索引
    * B+Tree: `The default size of an index page is 16KB`
* Tablespaces: 表空间
    * File-Per-Table Tablespace
* InnoDB Data Dictionary
    * `.frm`
* Doublewrite Buffer: 双写缓冲
* Redo Log: 重做日志
* Undo Log: 撤销日志
