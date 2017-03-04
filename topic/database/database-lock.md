---
layout: topic
module: 数据库
title:  数据库锁机制
date:   2016-12-10
---

#### 表锁(Table-Level Lock)

表锁，锁对象是整个表，Myisam和InnoDB都支持表锁，表锁不允许并发写

***MyISAM并发插入***

MyISAM引擎允许插入和查询并发执行，由系统变量`concurrent_insert`控制:

* NEVER: 0，不允许并发插入
* AUTO: 1，默认设置，MyISAM表没有空洞时，才允许并发插入
* ALWAYS: 2，始终允许并发插入，MyISAM表有空洞时，如果另一个会话正在执行，将数据插入到表的末尾，否则，获取写锁并将数据插入到空洞

```sql
create table User (
    id int(11) unsigned not null auto_increment comment 'id',
    name varchar(16) not null default '' comment 'name',
    primary key (id)
) ENGINE=Myisam DEFAULT CHARSET=utf8 COMMENT='User';

insert into User(name) values('admin');
```

***表读锁***

| 会话一 | 会话二 |
| :--- | :---  |
| $ lock table User read; | |
| $ select * from User; <br><font style="color: green;">1 row in set (0.00 sec)</> | $ select * from User; <br><font style="color: green;">1 row in set (0.00 sec)</> |
| | <font style="color: red;">$ update User set name = 'root2' where id = 1;</> |
| $ update User set name = 'root1' where id = 1;<br><font style="color: red;">ERROR 1099 (HY000): Table 'User' was locked with a READ lock and can't be updated</> | |
| $ unlock tables; | |
| | <font style="color: green;">Query OK, 1 row affected (5.97 sec)<br>Rows matched: 1  Changed: 1  Warnings: 0</> |

***表写锁***

| 会话一 | 会话二 |
| :--- | :---  |
| $ lock table User write; | |
| $ select * from User; <br><font style="color: green;">1 row in set (0.00 sec)</> | <font style="color: red;">$ select * from User;</> |
| $ update User set name = 'root1' where id = 1;<br><font style="color: green;">Query OK, 1 row affected (0.00 sec)<br>Rows matched: 1  Changed: 1  Warnings: 0</> | |
| $ unlock tables; | |
| | <font style="color: green;">1 row in set (0.00 sec)</> |
| $ lock table User write; | |
| | <font style="color: red;">$ update User set name = 'root2' where id = 1;</> |
| $ unlock tables; | |
| | <font style="color: green;">Query OK, 1 row affected (1.23 sec)<br>Rows matched: 1  Changed: 1  Warnings: 0</> |

***MyISAM锁调度***

在MyISAM中，读锁和写锁是互斥的，默认情况下，`写请求的优先级更高`，大量的写操作会导致读请求等待获取读锁而阻塞

#### 行锁(Row-Level Lock)

Innodb使用行锁来支持并发写

表锁和行锁对比:

| 类型   | MyISAM | InnoDB |
| ---   | ---    | --- |
| 锁开销 | 小 | 大 |
| 锁粒度 | 大 | 小 |
| 并发度 | 低 | 高 |
| 死锁   | 无 | 有 |

#### 共享锁(Shared Lock)

又称S锁

#### 排它锁(Exclusive Lock)

又称X锁

#### 意向锁(Intention Lock)

#### 间隙锁(Gap Lock)

#### Next-Key锁

表锁
行锁
悲观锁
乐观锁: updateTime
