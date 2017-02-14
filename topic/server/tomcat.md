---
layout: topic
module: 服务器
title:  Tomcat
date:   2017-02-13
---

tomcat 8.5.11

#### Tomcat Digester

#### Tomcat NIO模型

***Connector初始化***

Connector类

```java
@Override
protected void startInternal() throws LifecycleException {
    protocolHandler.start();
}
```

protocolHandler为`org.apache.coyote.http11.Http11NioProtocol`

`org.apache.tomcat.util.net.NioEndpoint`

```java
@Override
public void startInternal() throws Exception {
    if (!running) {
        running = true;
        paused = false;

        processorCache = new SynchronizedStack<>(SynchronizedStack.DEFAULT_SIZE,
                socketProperties.getProcessorCache());
        eventCache = new SynchronizedStack<>(SynchronizedStack.DEFAULT_SIZE,
                socketProperties.getEventCache());
        nioChannels = new SynchronizedStack<>(SynchronizedStack.DEFAULT_SIZE,
                socketProperties.getBufferPool());

        // 创建Executor
        if (getExecutor() == null) {
            createExecutor();
        }

        // 初始化最大连接数限制
        initializeConnectionLatch();

        // 启动Poller线程
        pollers = new Poller[getPollerThreadCount()];
        for (int i = 0; i < pollers.length; i++) {
            pollers[i] = new Poller();
            Thread pollerThread = new Thread(pollers[i], getName() + "-ClientPoller-" + i);
            pollerThread.setPriority(threadPriority);
            pollerThread.setDaemon(true);
            pollerThread.start();
        }

        // 启动Acceptor线程
        startAcceptorThreads();
    }
}

public void createExecutor() {
    internalExecutor = true;
    // 任务队列
    TaskQueue taskqueue = new TaskQueue();
    TaskThreadFactory tf = new TaskThreadFactory(getName() + "-exec-", daemon, getThreadPriority());
    // 工作线程池
    executor = new ThreadPoolExecutor(getMinSpareThreads(), getMaxThreads(), 60, TimeUnit.SECONDS, taskqueue, tf);
    taskqueue.setParent((ThreadPoolExecutor) executor);
}

protected LimitLatch initializeConnectionLatch() {
    if (maxConnections == -1) {
        return null;
    }
    if (connectionLimitLatch == null) {
        connectionLimitLatch = new LimitLatch(getMaxConnections());
    }
    return connectionLimitLatch;
}

protected final void startAcceptorThreads() {
    int count = getAcceptorThreadCount();
    acceptors = new Acceptor[count];

    for (int i = 0; i < count; i++) {
        acceptors[i] = createAcceptor();
        String threadName = getName() + "-Acceptor-" + i;
        acceptors[i].setThreadName(threadName);
        Thread t = new Thread(acceptors[i], threadName);
        t.setPriority(getAcceptorThreadPriority());
        t.setDaemon(getDaemon());
        t.start();
    }
}
```

***Acceptor***

`org.apache.tomcat.util.net.NioEndpoint$Acceptor`负责accept新的连接

```java
protected class Acceptor extends AbstractEndpoint.Acceptor {

    @Override
    public void run() {
        while (running) {
            try {
                countUpOrAwaitConnection();

                SocketChannel socket = null;
                try {

                    socket = serverSock.accept();
                } catch (IOException ioe) {
                    countDownConnection();
                    if (running) {
                        throw ioe;
                    } else {
                        break;
                    }
                }

                if (running && !paused) {
                    if (!setSocketOptions(socket)) {
                        closeSocket(socket);
                    }
                } else {
                    closeSocket(socket);
                }
            } catch (Throwable t) {
            }
        }
    }

    private void closeSocket(SocketChannel socket) {
        countDownConnection();
        try {
            socket.socket().close();
        } catch (IOException ioe) {
        }

        try {
            socket.close();
        } catch (IOException ioe) {
        }
    }
}
```

***Poller***

***Executor***

#### Pipeline

#### FilterChain

#### Tomcat类加载机制

***Tomcat类加载器***

* Bootstrap
    * $JAVA_HOME/lib
    * $JAVA_HOME/jre/lib/ext/*.jar
* System
    * $CATALINA_HOME/bin/bootstrap.jar
    * $CATALINA_BASE/bin/tomcat-juli.jar
* Common
    * $CATALINA_BASE/lib/*.jar
    * $CATALINA_HOME/lib/*.jar
* Webapp
    * /WEB-INF/classes
    * /WEB-INF/lib/*.jar 

Tomcat类加载顺序: Bootstrap -> Webapp -> System -> Common

```java
public abstract class WebappClassLoaderBase extends URLClassLoader {

    // CommonClassLoader(URLClassLoader)
    protected final ClassLoader parent;

    @Override
    public Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        synchronized (getClassLoadingLock(name)) {
            Class<?> clazz = null;

            try {
                // BootstrapClassLoader(Launcher$ExtClassLoader)
                clazz = getJavaseClassLoader().loadClass(name);
                if (clazz != null) {
                    if (resolve)
                        resolveClass(clazz);
                    return (clazz);
                }
            } catch (ClassNotFoundException e) {
            }

            boolean delegateLoad = delegate || filter(name, true);

            if (delegateLoad) {
                try {
                    // delegate为true, 先使用CommonClassLoader加载
                    clazz = Class.forName(name, false, parent);
                    if (clazz != null) {
                        if (resolve) {
                            resolveClass(clazz);
                        }
                        return (clazz);
                    }
                } catch (ClassNotFoundException e) {
                }
            }

            try {
                // delegate为false, 先使用WebAppClassLoader加载
                clazz = findClass(name);
                if (clazz != null) {
                    if (resolve) {
                        resolveClass(clazz);
                    }
                    return (clazz);
                }
            } catch (ClassNotFoundException e) {
            }

            if (!delegateLoad) {
                try {
                    clazz = Class.forName(name, false, parent);
                    if (clazz != null) {
                        if (resolve) {
                            resolveClass(clazz);
                        }
                        return (clazz);
                    }
                } catch (ClassNotFoundException e) {
                }
            }
        }

        throw new ClassNotFoundException(name);
    }

}
```

#### Tomcat热部署

#### Tomcat Filter
