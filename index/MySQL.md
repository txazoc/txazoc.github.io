---
layout: index
title:  MySQL
---

#### Spring事务管理

* Spring声明式事务管理

```java
@Transactional(propagation = Propagation.REQUIRED, rollbackFor = Exception.class)
public void update() {
}
```

* AOP实现

```java
@Override
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
    setAutoCommit(false);
    try {
        invoke();
        commit();
    } catch (Exception e) {
        rollback();
    }
}
```

* Spring事务传播机制

#### 数据库事务

#### 分布式事务

#### ORM框架

#### 数据库连接池

#### 数据库中间件

#### 读写分离/分库分表

#### 索引

* B+树
* MyISAM: 非聚集索引(数据文件 + 索引文件)
* InnoDB: 聚集索引(数据索引文件)

#### InnoDB索引

#### InnoDB锁

#### MVCC

#### Redo Log/Undo Log

* innodb_flush_log_at_trx_commit
    * 0:
    * 1:
    * 2:

#### 排序order

#### 分页limit

#### explain
