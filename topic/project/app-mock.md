---
layout: topic
module: 项目总结
title:  AppMock
date:   2017-02-12
---

#### 接口代理

HttpClient

#### mock代理

#### 序列化和反序列化

接口请求参数和响应数据的序列化和反序列化

* json格式
* NVObject协议
* Thrift协议

#### 消息实时推送

代理接口的请求消息实时推送到浏览器

* 请求消息发送到Kafka
* 订阅Kafka消息(一台Server一个Kafka分组)
* 消息分发给用户
* 消息推送到浏览器(WebSocket)，支持广播(多个浏览器窗口)
