---
layout: index
title:  MyBatis源码
---

#### MyBatis源码分析

* 解析Configuration
    * 初始化数据源: 数据库连接池
    * 注册Mapper
        * MapperRegistry -> `Map<Class, MapperProxyFactory>`
        * Mapper -> MappedStatement
        * MappedStatement
            * `Cache cache`: 二级缓存
* 获取Mapper
    * 动态代理: MapperProxyFactory -> MapperProxy
* 创建SqlSession
    * new Executor
        * BaseExecutor(SimpleExecutor、BatchExecutor)
            * `PerpetualCache localCache`: 一级缓存
        * CachingExecutor: 缓存执行器
* SqlSession.insert()/update()/delete()/select()
    * 获取MappedStatement
    * CachingExecutor
        * MappedStatement.cache
    * BaseExecutor
        * localCache
    * StatementHandler -> prepareStatement
    * ParameterHandler -> set parameters
    * JDBC execute
    * ResultSetHandler -> handle resultSets

#### MyBatis缓存

* 一级缓存: SqlSession级别
* 二级缓存: Mapper级别(MappedStatement级别)
