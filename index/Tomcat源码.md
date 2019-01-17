---
layout: index
title:  Tomcat源码
---

#### Tomcat请求流程

* acceptCount(backlog): 100
* Acceptor
    * maxConnections: 10000
    * accept()
    * offer Poller.events
* Poller
    * `Selector selector`
    * `SynchronizedQueue<PollerEvent> events`
    * events -> poll() -> register `OP_READ`
    * selector -> select() -> isReadable -> SocketProcessor
* Executor
    * `minSpareThreads`: 10
    * `maxThreads`: 200
    * execute(SocketProcessor)
* SocketProcessor
    * parse HTTP
    * request
        * mapping
        * ApplicationFilterChain.doFilter()
        * servlet.service(request, response)
    * response
        * write()
        * register `OP_WRITE`

<img src="/images/tomcat/tomcat-request-process.png" style="width: 480px; border-width: 1px;" title="Tomcat Request Process" />
