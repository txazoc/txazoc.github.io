---
layout: dict
title:  分布式链路追踪
date:   2020-09-24
tags:   [分布式链路追踪]
---

#### 分布式追踪标准OpenTracing

##### Trace

> 一次完整请求链路

* trace_id: 追踪id

##### Span

> 一次调用过程，比如一次RPC调用、一次SQL操作

* 开始时间
* 结束时间

##### SpanContext

> Span上下文，用于关联Trace、Span、父Span

* trace_id: 追踪id
* span_id
* parent_span_id

#### 集成

* 是否代码无侵入性
* 性能损耗

#### 数据采集

##### 请求采样

##### trace_id生成

`trace_id`保证分布式唯一

##### 数据上报

#### 跨进程传递

将`span_id`、`parent_span_id`添加到Header中实现跨进程传递

#### 数据可视化

##### 完整的分布式调用链路

##### 统计报表

* QPS
* 平均响应时间
* 99线、995线
