---
layout: topic
module: 数据库
title:  MVCC
date:   2017-03-04
---

MVCC，Multi-Version Concurrency Control，多版本并发控制。

#### InnoDB MVCC

InnoDB的默认隔离级别是`Repeatable Read`，底层实现基于MVCC。

InnoDB的行结构，除了存储字段，还存储一些额外的信息:

* `DATA_TRX_ID`: 6byte，最新更新行记录的事务id
* `DATA_ROLL_PTR`: 7byte，指向行记录的undo log的指针，用来找到之前版本的数据
* `DELETE BIT`: 标识记录是否被删除，只是标记删除，在commit时才真正删除

| column1 | column2 | ... | DATA_TRX_ID | DATA_ROLL_PTR | DELETE BIT |
| --- | --- | --- | --- | --- | --- |
| 1 | 1 | ... | 1 | 1 | 0 |
