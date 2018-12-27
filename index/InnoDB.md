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
* D(Durability): 持久性
