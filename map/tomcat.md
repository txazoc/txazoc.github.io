---
layout: map
title:  Tomcat
---

#### 模块

* 组件和生命周期管理
* 启动
    * init() -&gt; start()
    * 加载WebApp
* 请求处理
    * Acceptor、Poller、线程池
    * 解析Http协议: 请求行、头部、参数
    * 请求映射: Host -&gt; Context -&gt; Wrapper
        * 精确匹配
        * 前缀匹配
        * 扩展匹配
        * welcome-file
        * DefaultServlet
    * Pipeline
    * ApplicationFilterChain.doFilter()
    * servlet.service(request, response)
* 热部署
    * webapp
    * servlet
    * jsp

#### Tomcat体系结构

* Bootstrap
* Catalina
* Server: 整个容器(Container)
    * GlobalNamingResources
    * Service[]: 多个Connector和一个Engine的组合
        * Connector[]: 连接器，接收客户端请求
        * Engine: 引擎，处理来自Connector的请求
            * Host: 虚拟主机
                * Context: 一个Web应用程序
                    * Wrapper: 一个Servlet

#### 生命周期管理

Lifecycle

* init()
* start()
* stop()
* destroy()
* LifecycleListener

#### Tomcat启动

**Bootstrap**

* static
    * catalina.home
    * catalina.base
* main()
    * init()
        * initClassLoaders()
            * commonLoader(${catalina.home}/lib/*.jar) -&gt; SystemLoader
            * catalinaLoader -&gt; commonLoader
            * sharedLoader -&gt; commonLoader
        * Catalina.newInstance()
        * Catalina.setParentClassLoader(sharedLoader)
    * load()
        * Catalina.load()
    * start()
        * Catalina.start()

**Catalina**

* load()
    * createStartDigester()
    * digester.parse("conf/server.xml") -&gt; StandardServer
    * StandardServer.init()
* start()
    * StandardServer.start()
    * await()
        * StandardServer.await()
    * stop()
        * StandardServer.stop()
        * StandardServer.destroy()

**StandardServer**

* init()
    * StandardService.init()
* start()
    * StandardService.start()
* await()
    * while (!stopAwait)
        * 在`Server.port=8005`端口上阻塞accept()
        * 接收到`Server.shutdown=SHUTDOWN`的请求时break
* stop()
    * StandardService.stop()
* destroy()
    * StandardService.destroy()

**StandardService**

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

**Connector(HTTP/1.1)**

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
    * BootstrapClassLoader: 启动类加载器
        * sun.boot.class.path
            * $JAVA_HOME/jre/lib/*.jar
    * Launcher$ExtClassLoader: 扩展类加载器
        * java.ext.dirs
            * $JAVA_HOME/jre/lib/ext/*.jar
    * Launcher.AppClassLoader: 系统类加载器，Tomcat启动类
        * java.class.path: -classpath
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
    * LauncherHelper: BootstrapClassLoader加载
        * static
            * ClassLoader.getSystemClassLoader()
            * ClassLoader.initSystemClassLoader()
            * Launcher.getLauncher()
    * new Launcher()
        * Launcher$ExtClassLoader
        * Launcher$AppClassLoader -&gt; SystemClassLoader
    * LauncherHelper.checkAndLoadMain()
        * SystemClassLoader.loadClass(mainClass)
    * Bootstrap.main()
        * initClassLoaders()
            * CommonClassLoader
    * Catalina: CommonClassLoader加载
    * 请求处理
        * WebappClassLoader
        * jsp请求
            * JasperLoader
* 类初始化
    * main类
    * 父类
    * 反射
    * new、getstatic、putstatic、invokestatic字节码指令

#### 请求执行过程

* NioEndpoint$Acceptor.run()
    * while (running)
        * countUpOrAwaitConnection()
            * 连接数达到maxConnections -&gt; wait
            * 否则，连接数加1
        * ServerSocketChannel.accept()
            * 阻塞模式
        * setSocketOptions()
            * socket.configureBlocking(false): 非阻塞模式
            * getPoller0().register(): 注册到Poller
* NioEndpoint$Poller
    * register()
        * interestOps -&gt; OP_REGISTER
        * addEvent()
            * events.offer()
    * run()
        * while (true)
            * events()
                * events.poll()
                * PollerEvent.run()
                    * register(SelectionKey.OP_READ): 注册读事件
                * PollerEvent.reset()
            * select()
                * executor.execute(SocketProcessor)
* NioEndpoint$SocketProcessor.run()
    * AbstractProtocol$ConnectionHandler.process()
        * Http11Processor.process()
            * Http11Processor.service()
                * prepareRequest()
                * CoyoteAdapter.service(request, response)
* CoyoteAdapter.service()
    * Connector.getService().getContainer().getPipeline().getFirst().invoke(request, response)
    * response.finishResponse()
* StandardEngineValve.invoke()
    * StandardHost.getPipeline().getFirst().invoke(request, response);
* AccessLogValve.invoke()
    * getNext().invoke(request, response)
* ErrorReportValve.invoke()
    * getNext().invoke(request, response)
* StandardHostValve.invoke()
    * StandardContext.getPipeline().getFirst().invoke(request, response)
* StandardContextValve.invoke()
    * StandardWrapper.getPipeline().getFirst().invoke(request, response)
* StandardWrapperValve.invoke()
    * createFilterChain()
    * filterChain.doFilter()
        * filter.doFilter()
        * servlet.service(request, response)
* Http11OutputBuffer.finishResponse()
      * flushBuffer()
* NioEndpoint$NioSocketWrapper.doWrite()
* NioSelectorPool.write()
* NioBlockingSelector.write()
    * socket.write(buf)
    * 未写完 -&gt; 注册到NioBlockingSelector$BlockPoller

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

#### Container

* HashMap<String, Container> children: 子容器
* ThreadPoolExecutor startStopExecutor: 子容器启动停止线程池
* Pipeline pipeline: 管道
* List<LifecycleListener> lifecycleListeners: 生命周期事件监听器
* Thread thread: 容器后台线程
    * ContainerBackgroundProcessor
        * backgroundProcess(): 10s

```java
public abstract class ContainerBase extends LifecycleMBeanBase implements Container {

    @Override
    protected void initInternal() throws LifecycleException {
        // 初始化子容器启动停止线程池
        super.initInternal();
    }

    @Override
    protected synchronized void startInternal() throws LifecycleException {
        Container children[] = findChildren();
        List<Future<Void>> results = new ArrayList<>();
        // 启动子容器
        for (int i = 0; i < children.length; i++) {
            results.add(startStopExecutor.submit(new StartChild(children[i])));
        }

        // 等待子容器启动完成
        for (Future<Void> result : results) {
            result.get();
        }

        // 启动管道
        if (pipeline instanceof Lifecycle) {
            ((Lifecycle) pipeline).start();
        }

        // 触发start事件
        setState(LifecycleState.STARTING);

        // 启动容器后台线程(仅为StandardEngine时创建)
        threadStart();
    }

}
```

#### 部署WebApp

* StandardContext
    * lifecycleListeners: ContextConfig
* StandardHost.addChild(context)
    * StandardContext.start()
* StandardContext.start()
    * 创建WebappLoader
    * 创建work目录: work/Catalina/localhost/test
    * 创建ServletContext: ApplicationContextFacade
    * 校验Webapp和jar包中的/META-INF/MANIFEST.MF
    * WebappLoader.start()
    * fireLifecycleEvent("configure_start", null)
    * ServletContainerInitializer.onStartup()
    * listenerStart()
        * 实例化listener
        * listener.contextInitialized()
    * StandardManager.start()
        * SessionIdGenerator
    * filterStart()
    * loadOnStartup()
        * StandardWrapper.start()
            * 实例化Servlet
            * Servlet.init()
* WebappLoader.start() 
    * 创建ParallelWebappClassLoader
        * parent = CommonClassLoader
        * delegate = false
* ContextConfig.configureStart()
    * 扫描ServletContainerInitializer
    * 扫描/WEB-INF/classes下注解
        * @WebServlet
        * @WebFilter
        * @WebListener
    * 扫描其它类路径下注解
    * web.xml配置设置给ContextConfig
        * context-param
        * filter filter-mapping
        * listener
        * servlet -&gt; StandardWrapper
            * pipeline: StandardWrapperValve
        * StandardContext.addChild(wrapper)
        * 添加servlet映射到servletMappings
            * default: /
            * jsp: *.jsp
            * jsp: *.jspx
            * 自定义
        * welcome-file-list

#### 热部署

* webapp
    * backgroundProcess()
    * HostConfig.check()
        * if autoDeploy
        * resources
            * webapp
            * webapp.war
            * webapp/META-INF/context.xml
            * ${catalina.home}/conf/context.xml
            * ${catalina.home}/conf/Catalina/localhost/test.xml
        * web.xml
            * webapp/WEB-INF/web.xml
            * ${catalina.home}/conf/web.xml
        * StandardContext.reload()
* jsp
    * JspServletWrapper.service()
    * JspCompilationContext.compile(): development mode
    * Compiler.isOutDated()
        * 检查class文件的最后修改时间: 至少4s间隔
        * 最后修改时间不一致: return true
    * if true
        * 删除生成的servlet文件
        * JasperLoader = null
        * JDTCompiler.compile()
        * JspServletWrapper.reload = true
    * servlet = getServlet()
        * if reload
            * theServlet.destroy()
            * 销毁当前servlet实例
            * new JasperLoader()
            * JasperLoader.loadClass()
            * newInstance()
            * newServlet.init()
            * theServlet = newServlet
            * reload = false
    * servlet.service()
