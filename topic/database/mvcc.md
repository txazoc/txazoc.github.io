---
layout: topic
module: 数据库
title:  MVCC
date:   2017-03-04
---

MVCC，Multi-Version Concurrency Control，多版本并发控制。

#### InnoDB MVCC

InnoDB的默认隔离级别是`Repeatable Read`，底层实现基于MVCC，用来提供并发访问和回滚机制。

InnoDB的行结构，除了存储字段，还存储一些额外的信息:

* `DATA_TRX_ID`: 6byte，最新插入或更新(包括删除)行记录的事务id
* `DATA_ROLL_PTR`: 7byte，回滚指针，指向行记录的undo log，用来找到之前版本的数据
* `DB_ROW_ID`: 
* `DELETE BIT`: 标识记录是否被删除，只是标记删除，在commit时才真正删除

<img src="/images/topic/database/mvcc/mvcc_row1.png" style="width: 600px" title="行结构" />

***insert***

返回符合下面条件的行记录:

* DATA_TRX_ID小于或等于当前事务版本，确保行记录是当前事务开启前就存在的或由当前事务创建或修改的
* 行记录的删除版本是未定义的或大于当前事务版本，确保当前事务开启前行记录未被删除

***delete***

***update***

***select***
