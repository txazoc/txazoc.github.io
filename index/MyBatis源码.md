---
layout: index
title:  MyBatis源码
---

#### MyBatis源码分析

* 解析Configuration
    * 初始化数据源
    * 注册Mapper
        * Map<Mapper, MapperProxyFactory>
        * MappedStatement
            * `Cache cache`: 二级缓存
* 获取Mapper
    * 动态代理: MapperProxy
* 创建SqlSession
    * new Executor
        * BaseExecutor
            * `PerpetualCache localCache`: 一级缓存
        * CachingExecutor: 缓存执行器
* SqlSession.insert()/update()/delete()/select()
    * 获取MappedStatement
    * CachingExecutor
        * MappedStatement.cache
    * BaseExecutor(SimpleExecutor、BatchExecutor)
        * localCache
    * StatementHandler -> prepareStatement
    * ParameterHandler -> set parameters
    * JDBC execute
    * ResultSetHandler -> handle resultSets

#### MyBatis缓存

* 一级缓存: SqlSession级别
* 二级缓存: Mapper级别(MappedStatement级别)
