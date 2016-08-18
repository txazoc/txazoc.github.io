---
layout:     article
categories: [dubbo]
title:      Dubbo源码分析 - Provider
tags:       [dubbo]
date:       2016-08-18
---

```xml
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:dubbo="http://code.alibabatech.com/schema/dubbo"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://code.alibabatech.com/schema/dubbo http://code.alibabatech.com/schema/dubbo/dubbo.xsd">

    <bean id="versionService" class="test.dubbo.service.impl.VersionServiceImpl"/>

    <dubbo:application name="dubbo-app"/>

    <dubbo:registry address="zookeeper://127.0.0.1:2181"/>

    <dubbo:protocol name="dubbo" port="20881"/>

    <dubbo:service interface="test.dubbo.service.VersionService" ref="versionService"/>

</beans>
```

直接启动Spring容器即可

```java
public static void main(String[] args) throws IOException {
    ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring-provider.xml");
    context.start();
    System.in.read();
}
```

`spring.handlers`

```console
http\://code.alibabatech.com/schema/dubbo=com.alibaba.dubbo.config.spring.schema.DubboNamespaceHandler
```

来看`DubboNamespaceHandler`类, 实现`NamespaceHandler`接口, Spring启动时, 会调用`DubboNamespaceHandler`的`init()`方法

```java
public void init() {
    registerBeanDefinitionParser("application", new DubboBeanDefinitionParser(ApplicationConfig.class, true));
    registerBeanDefinitionParser("module", new DubboBeanDefinitionParser(ModuleConfig.class, true));
    registerBeanDefinitionParser("registry", new DubboBeanDefinitionParser(RegistryConfig.class, true));
    registerBeanDefinitionParser("monitor", new DubboBeanDefinitionParser(MonitorConfig.class, true));
    registerBeanDefinitionParser("provider", new DubboBeanDefinitionParser(ProviderConfig.class, true));
    registerBeanDefinitionParser("consumer", new DubboBeanDefinitionParser(ConsumerConfig.class, true));
    registerBeanDefinitionParser("protocol", new DubboBeanDefinitionParser(ProtocolConfig.class, true));
    registerBeanDefinitionParser("service", new DubboBeanDefinitionParser(ServiceBean.class, true));
    registerBeanDefinitionParser("reference", new DubboBeanDefinitionParser(ReferenceBean.class, false));
    registerBeanDefinitionParser("annotation", new DubboBeanDefinitionParser(AnnotationBean.class, true));
}
```

`ServiceBean`的`onApplicationEvent()`方法, 触发`export()`

`ServiceConfig`类, `doExport()`, `doExportUrls()`, `doExportUrlsFor1Protocol`

```java
Invoker<?> invoker = proxyFactory.getInvoker(ref, (Class) interfaceClass, registryURL.addParameterAndEncoded(Constants.EXPORT_KEY, url.toFullString()));
Exporter<?> exporter = protocol.export(invoker);
```
