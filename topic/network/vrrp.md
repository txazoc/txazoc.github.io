---
layout: topic
module: 网络
title:  VRRP
date:   2017-02-08
---

VRRP，Virtual Router Redundancy Protocol，虚拟路由冗余协议，用于解决局域网中的单点故障问题

***VRRP原理***

```cfg
vip: 192.168.1.10
master: 192.168.1.1 100
backup1: 192.168.1.2 99
backup2: 192.168.1.3 98
```

* master广播vrrp报文，通知backup自己工作正常
* master/backup收到vrrp报文，将自己的优先级和vrrp报文的优先级进行比较，大于则backup升级为master，否则为backup
* backup收到vrrp报文超时，认为master无法正常工作，此时backup认为自己是master，对外广播vrrp报文，backup组根据优先级选举出新的master
