---
layout: map
title:  Tomcat
---

#### 类加载机制

* 类加载器
    * Bootstrap类加载器
        * $JAVA_HOME/jre/lib/*.jar
        * $JAVA_HOME/jre/lib/ext/*.jar
    * System类加载器
        * $CATALINA_HOME/bin/bootstrap.jar
        * $CATALINA_HOME/bin/tomcat-juli.jar
        * $CATALINA_HOME/bin/commons-daemon.jar
    * Common类加载器
        * $CATALINA_HOME/lib/*.jar
    * Webapp类加载器: 隔离不同的Webapp
        * /WEB-INF/classes
        * /WEB-INF/lib/*.jar
* 类加载顺序
    * Bootstrap类加载器 -&gt; Common类加载器 -&gt; Webapp类加载器
        * `delegate`为true
        * 部分Tomcat源码类
    * Bootstrap类加载器 -&gt; Webapp类加载器 -&gt; Common类加载器
        * `delegate`为false

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
* Http11Processor.finishResponse()
* NioSelectorPool.write()

#### Servlet容器

* Listener
* Filter
* Servlet

#### Http服务器
