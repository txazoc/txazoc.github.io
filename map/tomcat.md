---
layout: map
title:  Tomcat
---

#### 环境变量

* catalina.home
* catalina.base

#### 类加载机制

* 类加载器继承关系
    * BootstrapClassLoader
        * $JAVA_HOME/jre/lib/*.jar
        * $JAVA_HOME/jre/lib/ext/*.jar
    * SystemClassLoader: -classpath，Tomcat启动类
        * $CATALINA_HOME/bin/bootstrap.jar
        * $CATALINA_HOME/bin/tomcat-juli.jar
    * CommonClassLoader: Tomcat类库和公共类库
        * $CATALINA_HOME/lib/*.jar
    * WebappClassLoader: 隔离不同的Webapp
        * /WEB-INF/classes
        * /WEB-INF/lib/*.jar
    * JasperLoader: jsp
        * org.apache.jsp.*
* WebappClassLoader
    * BootstrapClassLoader -&gt; CommonClassLoader -&gt; WebappClassLoader
        * `delegate`为true
        * Tomcat类
    * BootstrapClassLoader -&gt; WebappClassLoader -&gt; CommonClassLoader
        * `delegate`为false
* 类加载顺序
    * JVM
        * BootstrapClassLoader
    * LauncherHelper
        * ClassLoader.getSystemClassLoader()
    * Launcher
        * 创建SystemClassLoader
            * ExtClassLoader
            * AppClassLoader
    * main类
        * SystemClassLoader
        * 创建CommonClassLoader
    * Tomcat类
        * CommonClassLoader
    * 请求处理(请求线程池)
        * WebappClassLoader
        * jsp请求
            * JasperLoader
* 类初始化
    * main类
    * 父类
    * 反射
    * new、getstatic、putstatic、invokestatic字节码指令

#### NIO模型

* NioEndpoint$Acceptor
    * 检查maxConnections
        * 达到maxConnections则wait
    * 阻塞accept()
* NioEndpoint$Poller
    * 插入PollerEvent队列
    * poll()
        * 注册OP_READ
    * select()
        * socket读就绪
        * 线程池
* NioEndpoint$SocketProcessor
* Http11Processor
    * service(request, response)
* Http11Processor.finishResponse()
* NioBlockingSelector.write()
    * 先尝试socket.write()
    * 写失败或未写完，下一步
    * NioBlockingSelector$BlockPoller
        * 插入队列
        * poll()
            * 注册OP_WRITE
        * select()
            * socket写就绪
            * 写数据

#### Servlet容器

* Listener
    * 容器启动
    * 读取web.xml
    * Listener初始化
        * contextInitialized()
* Filter
* Servlet

#### Http服务器

#### 热部署

* lastModifiedTime

#### jsp编译
