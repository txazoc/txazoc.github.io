---
layout: map
title:  Tomcat
---

#### NIO模型

* NioEndpoint$Acceptor
    * accept()
        * 轮询
    * getPoller0().register(channel)
* NioEndpoint$Poller
    * SynchronizedQueue<PollerEvent> events
    * events.offer(event)
    * run
        * events.poll()
