---
layout: arch
title:  xxl-job架构设计
---

#### 注册

* 执行器发送心跳注册到调度中心
* 调度中心下线注册超时执行器
* 调度中心刷新线上机器列表

#### 调度

* Quartz分布式调度
* 线程池
* 根据路由策略选择执行job的执行器
* 发送调度请求给执行器

#### 执行

* 执行器接收调度请求
* 新建线程执行job

#### 回调

* job执行成功或失败后异步回调更新job状态

#### 日志

* job执行日志异步写入ES
