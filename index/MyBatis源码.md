---
layout: index
title:  MyBatis源码
---

#### MyBatis源码分析

* 解析Configuration
    * 初始化数据源
    * 注册Mapper
* 获取Mapper
    * 动态代理: MapperProxy
* 创建SqlSession
    * new Executor
        * BaseExecutor
            * `PerpetualCache localCache`: 一级缓存
        * CachingExecutor
* SqlSession.insert()/update()/delete()/select()
    * 获取MappedStatement
    * 

#### MyBatis缓存

* 一级缓存: SqlSession级别
* 二级缓存: Mapper级别(MappedStatement级别)
