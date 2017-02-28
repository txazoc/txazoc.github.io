---
layout: topic
module: 网络
title:  TCP
date:   2016-12-07
---

TCP(Transmission Control Protocol)，传输控制协议，一种面向连接的、可靠的、基于字节流的传输层通信协议

#### 三次握手

* SYN_SEND: `SYN`(seq=x)
* SYN_RECV: `SYN-ACK`(seq=y ack=x+1)，半连接状态
* Established: `ACK`(ack=y+1)  

Wireshark抓包分析:

```bash
1	192.168.1.101	151.101.100.133	TCP	78	58263 → 80 [SYN] Seq=0 
2	151.101.100.133	192.168.1.101	TCP	74	80 → 58263 [SYN, ACK] Seq=0 Ack=1
3	192.168.1.101	151.101.100.133	TCP	66	58263 → 80 [ACK] Seq=1 Ack=1
```

tcpdump抓包分析:

```bash
$ tcpdump -iany tcp and net 151.101.100.133
192.168.1.101.64265 > 151.101.100.133.http: Flags [S], seq 3419034387
151.101.100.133.http > 192.168.1.101.64265: Flags [S.], seq 3730537192, ack 3419034388
192.168.1.101.64265 > 151.101.100.133.http: Flags [.], ack 1
```

#### 四次挥手

`FIN` > `ACK` > `FIN` > `ACK`

Wireshark抓包分析:

```bash
36	192.168.1.101	151.101.100.133	TCP	66	58346 → 80 [FIN, ACK] Seq=152 Ack=11519
37	151.101.100.133	192.168.1.101	TCP	66	80 → 58346 [FIN, ACK] Seq=11519 Ack=153
38	192.168.1.101	151.101.100.133	TCP	66	58346 → 80 [ACK] Seq=153 Ack=11520
```

tcpdump抓包分析:

```bash
$ tcpdump -iany tcp and net 151.101.100.133
192.168.1.101.64265 > 151.101.100.133.http: Flags [F.], seq 152, ack 11519
151.101.100.133.http > 192.168.1.101.64265: Flags [F.], seq 11519, ack 153
192.168.1.101.64265 > 151.101.100.133.http: Flags [.], ack 11520
```

***为什么是三次握手四次挥手?***

建立连接时，服务端可以把SYN和ACK放在一个报文里面发送出去

关闭连接时，一端关闭了，另一端不一定立即关闭，有可能继续发送数据给对端，所以SYN和ACK要分开发送。但有些场景也把SYN和ACK一起发送，相当于三次挥手
