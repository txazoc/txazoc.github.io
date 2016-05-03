---
layout:     article
categories: [network]
title:      DNS
tags:       [dns, 域名解析]
date:       2016-03-13
---

> DNS, Domain Name System, 域名系统, 因特网上作为域名和IP地址相互映射的一个分布式系统

#### DNS的功能

DNS提供根据域名查询对应IP地址的功能.

#### DNS服务器

DNS服务器, 保存域名和IP映射, 具有将域名转换为IP地址功能的服务器. 

常见的DNS服务器有:

* 本地DNS服务器
* 根域名服务器
* 顶级域名服务器
* 智能DNS服务器

#### DNS解析

> DNS解析, 将域名转换为IP地址的过程.

DNS解析包含递归查询和迭代查询两个过程:

* 递归查询: hosts文件 - 本地DNS缓存 - 本地DNS服务器
* 迭代查询: 本地DNS服务器 - 顶级域名服务器
* 迭代查询: 本地DNS服务器 - 根域名服务器
* 迭代查询: 本地DNS服务器 - ...
* 迭代查询: 本地DNS服务器 - DNS服务器

#### DNS记录

#### DNS记录 - A记录

A记录, 将域名指向一个IPv4地址. 比如, 域名txazo.com, 配置如下的A记录, 

```java
A       m     112.124.6.220
```

`dig m.txazo.com`

```java
m.txazo.com.		522	IN	A	121.42.178.174
```

#### DNS记录 - CNAME记录

```java
CNAME   image   image.txazo.com.w.kunlunar.com
```

`dig image.txazo.com`

```java
image.txazo.com.	600	IN	CNAME	image.txazo.com.w.kunlunar.com.
image.txazo.com.w.kunlunar.com.	300 IN	A	122.228.95.144
```

#### DNS记录 - MX记录

```java
MX      @       mxbiz1.qq.com       5
MX      @       mxbiz2.qq.com       10
```

#### DNS记录 - NS记录

```java
NS      pod     f1g1ns1.dnspod.net
NS      pod     f1g1ns2.dnspod.net
```
#### DNS记录 - 显性URL记录

#### DNS记录 - 隐性URL记录

#### DNS负载均衡

```java
A       m.txazo.com       121.42.178.174        2
A       m.txazo.com       112.74.216.203        3
```

#### DNS诊断工具

DNS诊断工具有`dig`和`nslookup`

`dig www.txazo.com`

```java
; <<>> DiG 9.8.3-P1 <<>> www.txazo.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 38005
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;www.txazo.com.			IN	A

;; ANSWER SECTION:
www.txazo.com.		600	IN	CNAME	txazo.github.io.
txazo.github.io.	1200	IN	CNAME	github.map.fastly.net.
github.map.fastly.net.	281	IN	A	103.245.222.133

;; Query time: 363 msec
;; SERVER: 192.168.16.1#53(192.168.16.1)
;; WHEN: Thu Apr 14 23:11:02 2016
;; MSG SIZE  rcvd: 111
```

`nslookup m.txazo.com`

```java
Server:		192.168.16.1
Address:	192.168.16.1#53

Non-authoritative answer:
Name:	m.txazo.com
Address: 112.74.216.203
```
