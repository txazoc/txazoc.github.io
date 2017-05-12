---
layout: topic
module: 网络
title:  WebSocket
date:   2016-12-25
---

WebSocket是HTML5一种新的协议，实现了浏览器和服务器全双工通信。

WebSocket协议的通讯过程:

<img src="/images/topic/network/websocket.png" style="width: 480px" title="WebSocket" />

WebSocket是为了解决浏览器和服务器间的实时通讯问题。在WebSocket之前，实时通讯使用`轮询`和`Comet`。

***轮询***

浏览器每隔一段时间就向服务器发送请求

***Comet***

Comet，基于HTTP场连接的服务器推及时，包括`长轮询`、`iframe流`

***长轮询***

轮询 + 阻塞，请求一直阻塞直到服务器有数据了才返回响应给浏览器，然后，浏览器再次轮询
