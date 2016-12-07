---
layout: topic
module: 网络
title:  ARP
date:   2016-12-07
---

ARP，Address Resolution Protocol，地址解析协议，是根据IP地址获取MAC地址的一个TCP/IP协议

ARP缓存: 储存IP地址和MAC地址的缓冲区

ARP原理:

1. 主机A查找本地ARP缓存, IP-MAC映射不存在, 执行2
2. 主机A广播ARP请求(主机A的IP地址 + MAC地址)到本地网络的所有主机
3. 主机B
    * IP不匹配, 丢弃ARP请求
    * IP匹配, 主机A的IP-MAC映射添加到本地ARP缓存, 主机B的MAC地址回复给主机A
4. 主机A: 收到ARP回复消息, 主机B的IP-MAC映射添加到本地ARP缓存

arp命令

```bash
# arp
arp -a
#
arp -d 192.168.1.5
#
arp -s 192.168.1.5 ee:ff:ff:ff:ff:ff
```

ARP欺骗: 向目标主机发送伪ARP应答报文，篡改本机的MAC地址表
