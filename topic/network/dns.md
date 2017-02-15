---
layout: topic
module: 网络
title:  DNS
date:   2017-02-11
---

DNS，Domain Name System，域名系统，因特网上作为域名和IP地址相互映射的一个分布式系统

域名解析: 得到域名对应的IP地址

#### 域名解析过程

* 递归查询
    * 应用DNS缓存(浏览器、App、应用程序)
    * hosts文件
    * 操作系统DNS缓存(TTL)
    * 本地DNS服务器
* 迭代查询
    * 本地DNS服务器缓存(TTL)
    * 本地DNS服务器 > 根域名服务器
    * 本地DNS服务器 > 顶级域名服务器
    * 本地DNS服务器 > ...
    * 本地DNS服务器 > DNS服务器
    * 域名解析记录 > 本地DNS服务器缓存

#### 域名解析记录

* A记录: 域名 > ipv4地址
* AAAA记录: 域名> ipv6地址
* CNAME记录: 域名 > 域名
* MX记录: 域名 > 邮件服务器地址
* NS记录: 域名 > 域名服务器地址
* 显性URL: 域名 > http(s)协议地址 + 跳转
* 隐性URL: 域名 > http(s)协议地址

```bash
A       www      124.168.2.1
AAAA    doc      ff03:0:0:0:0:0:0:c1
CNAME   image    txazo.github.io
MX      @     mxbiz1.qq.com
NS      pod      f1g1ns2.dnspod.net
显性URL  baidu    http://www.baidu.com
隐性URL  tobaidu  http://www.baidu.com
```

#### TTL

TTL(Time To Live)，一条域名解析记录在DNS服务器中存留的时间，单位为秒

```linux
$ ping www.baidu.com
64 bytes from 115.239.210.27: icmp_seq=0 ttl=53 time=13.168 ms
64 bytes from 115.239.210.27: icmp_seq=1 ttl=53 time=10.731 ms
64 bytes from 115.239.210.27: icmp_seq=2 ttl=53 time=13.113 ms
```

#### DNS负载均衡

在DNS服务器中为一个域名配置多个IP地址

```bash
A   www     124.168.2.1
A   www     124.168.2.2
A   www     124.168.2.3
```

#### DNS查询工具

***dig***

```bash
$ dig www.baidu.com

; <<>> DiG 9.8.3-P1 <<>> www.baidu.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 41105
;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 0

;; QUESTION SECTION:
;www.baidu.com.			IN	A

;; ANSWER SECTION:
www.baidu.com.		777	IN	CNAME	www.a.shifen.com.
www.a.shifen.com.	300	IN	A	115.239.211.112
www.a.shifen.com.	300	IN	A	115.239.210.27

;; Query time: 35 msec
;; SERVER: 180.168.255.18#53(180.168.255.18)
;; WHEN: Wed Feb 15 20:27:45 2017
;; MSG SIZE  rcvd: 90
```

***nslookup***

```bash
$ nslookup www.baidu.com
Server:		180.168.255.18
Address:	180.168.255.18#53

Non-authoritative answer:
www.baidu.com	canonical name = www.a.shifen.com.
Name:	www.a.shifen.com
Address: 115.239.211.112
Name:	www.a.shifen.com
Address: 115.239.210.27
```
