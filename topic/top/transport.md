---
layout: topic
module: 热点
title:  通讯
date:   2017-02-02
---

***通讯协议***

* tcp
    * ip + port
    * 建立连接: 三次握手
        * SYN_SEND: SYN(SEQ=x)
        * SYN_RECV: SYN(SEQ=y)-ACK(ACK=x+1)
        * Established: ACK(ACK=y+1)  
    * 传输数据: 全双工
    * 关闭连接: 四次挥手
        * FIN - ACK - FIN - ACK
    * socket
        * send
            * 用户空间数据 - 拷贝 - 内核发送缓冲区 - tcp
        * recv
            * tcp - 内核接受缓冲区 - 拷贝 - 用户空间
        * epoll
        * select
        * 滑动窗口协议
* http
* https

***通讯模型***

* Server - Web
* Server - App
* Server - Server
