---
layout: topic
module: 网络
title:  Client/Server
date:   2017-02-13
---

Client/Server，客户端服务端模型，包括C/S(客户机-服务器)和B/S(浏览器-服务器)，按照客户端的不同分为下面三类:

* 客户机 - 服务器(C/S)
* 浏览器 - 服务器(B/S)
* 手机App - 服务器(B/S)

#### Push/Pull

客户端向服务端获取数据时，根据请求主动方的不同，分为Push和Pull

* Push: 服务端主动发送消息给客户端
* Pull: 客户端主动请求服务端获取数据

#### 客户机/服务器

* Pull
    * http
    * tcp长连接: RPC
* Push
    * tcp长连接: Zookeeper

#### 浏览器/服务器

* Pull
    * Http
    * Ajax
* Push
    * http轮询: Ajax轮询
    * http长轮询: Ajax长轮询
    * tcp长连接: WebSocket

#### 手机App/服务器

* Pull
    * Http
* Push
    * http轮询
    * http长轮询
    * tcp长连接
        * APNS(tcp): IOS平台
        * 第三方Push: 极光推送
