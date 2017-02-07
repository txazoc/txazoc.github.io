---
layout: topic
module: 网络
title:  CDN
date:   2017-02-07
---

CDN，Content Delivery Network，内容分发网络

***CDN原理***

* image.txazo.com
* DNS Server
* image.txazo.com CNAME image.txazo.com.w.kunlunar.com
* 智能DNS Server
* CDN Server

***CDN流程***

* 递归查询
    * hosts文件
    * 本地DNS缓存
    * 本地DNS服务器
* 迭代查询
    * 本地DNS服务器 - 根域名服务器
    * 本地DNS服务器 - 顶级域名服务器
    * 本地DNS服务器 - ...
    * 本地DNS服务器 - DNS服务器
    * 本地DNS服务器 - CNAME - 智能DNS服务器

***CDN技术点***

加速、回源、预热、刷新
