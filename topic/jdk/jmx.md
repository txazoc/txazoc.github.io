---
layout: topic
module: JDK
title:  JMX
---

Java Management Extensions, Java管理扩展

JMX主要包含三部分:

* MBean
* JMX Agent
* Remote Management

#### <a id="mbean">MBean</a>

MBean，JMX管理的资源

MBean组成:

* Attribute(getter/setter规范)
* Operation

```java
public interface HelloMBean {

    // 只可读Attribute: id
    public int getId();

    // 可读可写Attribute: name
    public String getName();

    public void setName(String name);

    // 只可写Attribute: age
    public void setAge(int age);

    // Operation
    public void operation();

}
```

实现`HelloMBean`

```java
public class Hello implements HelloMBean {

    private int id;
    private String name;
    private int age;

    public Hello(int id, String name, int age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }

    @Override
    public int getId() {
        return this.id;
    }

    @Override
    public String getName() {
        return this.name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public void operation() {
        System.out.println("Hello operation ...");
    }

}
```

#### JMX Agent

JMX Agent，JMX代理，提供管理MBean的容器和服务

MBean容器(MBeanServer):

```java
// 创建MBeanServer
MBeanServer mbs = ManagementFactory.createMBeanServer();
```

```java
// 获取平台的MBeanServer
MBeanServer mbs = ManagementFactory.getPlatformMBeanServer();
```

注册MBean:

```java
ObjectName name = ObjectName.getInstance("org.txazo.jmx.mbean.standard:type=Hello,name=local");
HelloMBean bean = new Hello(1, "local", 25);
mbs.registerMBean(bean, name);
```

创建并注册MBean:

```java
String className = "org.txazo.jmx.mbean.standard.Hello";
ObjectName name = ObjectName.getInstance("org.txazo.jmx.mbean.standard:type=Hello,name=local");
Object[] params = new Object[]{1, "local", 25};
String[] signatures = new String[]{"int", "java.lang.String", "int"};
mbs.createMBean(className, name, params, signatures);
```

#### Remote Management

Remote Management，远程管理

被管理Java应用启动时添加如下JVM参数:

```console
-Dcom.sun.management.jmxremote.port=9999
-Dcom.sun.management.jmxremote.authenticate=false
-Dcom.sun.management.jmxremote.ssl=false
```

然后，通过RMI方式连接远程MbeanServer:

```java
JMXServiceURL url = new JMXServiceURL("service:jmx:rmi:///jndi/rmi://:9999/jmxrmi");
JMXConnector jmxc = JMXConnectorFactory.connect(url);
MBeanServerConnection mbsc = jmxc.getMBeanServerConnection();
Set<ObjectName> objectNames = mbsc.queryNames(null, null);
for (ObjectName name : objectNames) {
    System.out.println("ObjectName: " + name.getCanonicalName());
}
jmxc.close();
```

\[参考\]:

* [Java Management Extensions (JMX)](http://docs.oracle.com/javase/8/docs/technotes/guides/jmx/)
* [Java Management Extensions (JMX) Technology Tutorial](http://docs.oracle.com/javase/8/docs/technotes/guides/jmx/tutorial/tutorialTOC.html)
* [JConsole MBean](/topic/jdk/jconsole#mbean)
