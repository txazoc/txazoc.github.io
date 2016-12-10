---
layout: topic
module: 数据库
title:  SQL优化
date:   2016-12-10
---

explain
索引: 创建索引 检查where/order by是否用到索引 避免全表扫描
避免null判断
避免使用!= <>
避免使用or
避免使用in/not in, between代替
避免使用like '%key%', 正确方式为'key%'
避免where子句使用参数, 无法在编译期确认索引
避免where子句使用表达式
避免where子句使用函数
组合索引, 确保查询包含索引的第一个字段
避免不带where的select count(*)
索引不能过多, 过多会影响insert/update效率
优先使用数字类型
开启慢查询日志
分库/分表
