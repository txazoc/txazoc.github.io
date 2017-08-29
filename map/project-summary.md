---
layout: map
title:  项目总结
---

#### App Mock

* 代理App请求
    * 序列化和反序列化
        * 序列化协议NVObject
            * 基本类型
                * 基本数据类型
                * 字符串
                * 时间
            * 复合类型
                * 对象: hash值
                    * 字段: hash值
                * 数组
        * 对比
            * Thrift: 传递字段hash值
            * NVObject: 传递field id
    * HttpClient
* 实时展示
    * Kafka(分组订阅) -&gt; 用户分发 -&gt; 窗口分发 -&gt; WebSocket -&gt; 浏览器窗口
* 自定义Mock数据

#### 移动运营平台

* 业务线订单服务统一管理
    * 实时接入
    * 开关
* 异步并行调用
* 超时控制

#### 统一订单服务中心

* 模块配置
    * 一级列表和二级列表
    * 列表元素自定义
* 三级缓存
    * sdk缓存
    * 本地缓存
    * redis分布式缓存
