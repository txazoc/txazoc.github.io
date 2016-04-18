---
layout:     article
categories: [network]
title:      CDN
tags:       [网络]
date:       2016-04-14
---

> CDN，Content Delivery Network，内容分发网络，一种实现静态资源加速的网络系统。－百度百科

#### 传统的Web访问方式

先来介绍下传统的Web访问方式，过程为：客户端要访问网络资源，先通过DNS查询到资源对应的服务器IP地址，然后向服务器发送请求，服务器接受请求并处理后响应。

这种方式存在什么缺点呢？

#### CDN的Web访问方式

CDN系统包括智能DNS服务器和CDN节点服务器, DNS服务器负责解析用户请求到指定CDN节点, 
CDN节点服务器负责根据请求查询并返回请求资源

#### CDN原理

CDN加速实现的方式为将域名CNAME到CDN的域名, 由CDN来代替接收请求并响应

```java
image.txazo.com - DNS Server - image.txazo.com CNAME image.txazo.com.w.kunlunar.com
```

#### CDN查询的过程

* 递归查询: hosts文件 - 本地DNS缓存 - 本地DNS服务器
* 迭代查询: 本地DNS服务器 - 根域名服务器
* 迭代查询: 本地DNS服务器 - 顶级域名服务器
* 迭代查询: 本地DNS服务器 - ...
* 迭代查询: 本地DNS服务器 - DNS服务器
* 迭代查询: 本地DNS服务器 - CNAME - 智能DNS服务器
* 返回最近的CDN节点的IP地址
* 向返回的CDN节点请求资源, 存在直接返回, 不存在, 从资源服务器拉取资源
