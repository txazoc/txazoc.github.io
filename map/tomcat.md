---
layout: map
title:  Tomcat
---

#### Tomcat体系结构

* Server: 整个容器(Container)
    * GlobalNamingResources
    * Service[]: 多个Connector和一个Engine的组合
        * Connector[]: 连接器，接收客户端请求
        * Engine: 引擎，接收并处理来自Connector的请求
            * Host: 虚拟主机
                * Context: Web应用程序，`$CATALINA_BASE`目录
                    * Loader

#### 生命周期管理

#### Tomcat启动

1. Bootstrap
    1. static
        * catalina.home
        * catalina.base
    * main()
        * init()
            * initClassLoaders()
                * commonLoader -&gt; SystemLoader: ${catalina.home}/lib/*.jar
                * catalinaLoader -&gt; commonLoader
                * sharedLoader -&gt; commonLoader
            * Catalina.newInstance()
            * Catalina.setParentClassLoader(sharedLoader)
        * load()
            * Catalina.load()
        * start()
            * Catalina.start()
* Catalina
    * load()
        * digester = createStartDigester()
        * digester.parse("conf/server.xml") -&gt; StandardServer
        * StandardServer.init()
    * start()
        * StandardServer.start()
        * await()
            * StandardServer.await()
        * stop()
            * StandardServer.stop()
            * StandardServer.destroy()
* StandardServer
    * init()
        * StandardService.init()
    * start()
        * StandardService.start()
    * await()
        * while (!stopAwait)
            * 在`Server.port=8005`端口上阻塞accept()
            * 直到请求命令为`Server.shutdown=SHUTDOWN`时break
    * stop()
        * StandardService.stop()
    * destroy()
        * StandardService.destroy()
* StandardService
    * init()
        * StandardEngine.init()
        * Connector.init()
    * start()
        * StandardEngine.start()
        * Connector.start()
    * stop()
        * Connector.pause()
        * StandardEngine.stop()
        * Connector.stop()
    * destroy()
        * Connector.destroy()
        * StandardEngine.destroy()
* Connector(HTTP/1.1)
    * new
        * Http11NioProtocol
            * NioEndpoint
                * Poller
                * NioSelectorPool
            * ConnectionHandler
    * init()
        * Http11NioProtocol.init()
            * NioEndpoint.init()
                * ServerSocket.bind(port)
                * NioSelectorPool.open()
                    * NioBlockingSelector.new
                        * BlockPoller.new
                        * BlockPoller.start()
    * start()
        * Http11NioProtocol.start()
            * NioEndpoint.start()
                * 初始化对象池: size=128 limit=500
                    * socketProcessorCache
                    * pollerEventCache
                    * nioChannelCache
                * createExecutor()
                    * ThreadPoolExecutor
                        * corePoolSize: 10
                        * maximumPoolSize: 200
                        * keepAliveTime: 60s
                        * TaskQueue extends LinkedBlockingQueue
                * initializeConnectionLatch()
                    * maxConnections: 默认为`10000`
                * Poller[2]
                    * Poller.new
                    * new Thread(Poller).start()
                * startAcceptorThreads()
                    * Acceptor[1]
                        * Acceptor.new
                        * new Thread(Acceptor).start()
            * new Thread(AsyncTimeout).start()
    * pause()
        * Http11NioProtocol.pause()
            * NioEndpoint.pause()
    * stop()
        * Http11NioProtocol.stop()
            * AsyncTimeout.stop()
            * NioEndpoint.stop()
                * releaseConnectionLatch()
                * Poller[2]
                    * Poller.destroy()
                    * Poller = null
                * shutdownExecutor()
                    * executor.shutdownNow()
                    * executor = null
                * 对象池销毁
                    * socketProcessorCache.clear()
                    * pollerEventCache.clear()
                    * nioChannelCache.clear()
    * destroy()
        * Http11NioProtocol.destroy()
            * NioEndpoint.destroy()
                * unbind()
                    * ServerSocket.close()
                    * NioSelectorPool.close()

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

#### 请求调用

* NioEndpoint$Acceptor.run()
    * countUpOrAwaitConnection()
        * 达到maxConnections则wait
        * 否则连接数加1
    * ServerSocketChannel.accept()
        * 阻塞accept
    * setSocketOptions()
        * socket.configureBlocking(false): 异步模式
        * getPoller0().register(channel)
* NioEndpoint$Poller
    * register()
        * event = eventCache.pop()
        * event.interestOps = OP_REGISTER
        * addEvent(event)
            * events.offer(event)
    * run()
        * while(true)
            * events()
                * events.poll()
                * PollerEvent.run()
                * PollerEvent.reset()

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

* jsp -&gt; compile -&gt; servlet(*_jsp.java)
* extends org.apache.jasper.runtime.HttpJspBase
