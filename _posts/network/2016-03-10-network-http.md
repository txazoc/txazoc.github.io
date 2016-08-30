---
layout:     article
published:  false
categories: [network]
title:      HTTP协议
tags:       [网络协议]
date:       2016-03-10
---

> HTTP, 超文本传输协议, 互联网上应用最为广泛的一种网络协议

#### HTTP的请求响应模型

请求响应

HTTP底层基于TCP, 请求响应模型, 具体过程为客户端向服务器发送一个请求, 服务器接受请求并进行处理, 处理完成后, 发送一个响应给客户端.

#### Request

Method SP Request-URI SP HTTP-Version CRLF

GET /index.html HTTP/1.1

响应状态码

200 OK
304 Not Modified
403 Forbidden
404 Not Found
500 Internal Server Error
503 Service Unavailable

#### HTTP请求格式

#### HTTP响应格式

#### HTTP头域
