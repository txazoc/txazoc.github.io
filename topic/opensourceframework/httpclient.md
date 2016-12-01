---
layout: topic
module: 开源框架
title:  HttpClient
date:   2016-12-01
---

#### 示例代码

#### 源码解读

#### 情景一: 高并发实时请求

***情景描述***: 线上实时请求Http接口

***要求***: 高并发，实时响应，限流

***技术方案***: 线程池 + HttpClient

#### 情景二: 百万量级请求

***情景描述***: 百万量级的Http请求任务

***要求***: 保证执行效率和成功率

***技术方案***: 阻塞队列 + 多线程 + HttpClient

\[参考\]:

* [Apache HttpComponents](http://hc.apache.org/)
* [HttpClient Overview](http://hc.apache.org/httpcomponents-client-4.5.x/index.html)
