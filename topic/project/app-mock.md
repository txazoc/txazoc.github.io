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

API代理和Mock主要针对美团和点评APP的API接口

***场景一***

在开发、测试、处理投诉时，无法获取接口的请求信息和响应信息

***场景二***

后端API没有开发完成时，APP开发无法进行调试

针对这两个基本场景需求，API代理和Mock诞生了

#### API

首先，来介绍下美团API和点评API

***JSON API***

部分美团和点评App使用

* 接口请求: `query string` + `压缩`
* 接口响应: `json` + `压缩`

***Thrift API***

部分美团App使用

* 接口请求: `thrift` + `压缩`
* 接口响应: `thrift` + `压缩`

***点评API***

点评主App使用

* 接口请求: `query string` + `urlencode` + `压缩` + `加密`
* 接口响应: `nvobject` + `压缩` + `加密`

`注`: `query string`: key1=value1&key2=value2，`nvobject`
