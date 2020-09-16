---
layout: home
title: Spring Boot启动
date: 2002-09-08
tags:   [spring boot]
---

#### 启动入口

```java
public static void main(String[] args) {
    SpringApplication.run(ApplicationMain.class, args);
}
```

#### 初始化SpringApplication

```java
public SpringApplication(ResourceLoader resourceLoader, Class<?>... primarySources) {
    // 读取spring.factories中的ApplicationContextInitializer
    setInitializers((Collection) getSpringFactoriesInstances(ApplicationContextInitializer.class));
    // 读取spring.factories中的ApplicationListener
    setListeners((Collection) getSpringFactoriesInstances(ApplicationListener.class));
    // 解析main class
    this.mainApplicationClass = deduceMainApplicationClass();
}
```

##### 加载spring.factories下的ApplicationContextInitializer

##### 加载spring.factories下的ApplicationListener

##### 获取启动类main class

#### 执行SpringApplication.run()方法

##### 加载spring.factories下的SpringApplicationRunListener

##### createApplicationContext()

实例化Spring容器: `AnnotationConfigServletWebServerApplicationContext`

##### ApplicationContextInitializer.initialize()

##### main class注册为BeanDefinition

`最核心的一步`，

```java
@SpringBootApplication
public class ApplicationMain {

    public static void main(String[] args) {
        SpringApplication.run(ApplicationMain.class, args);
    }

}
```

##### refresh()刷新Spring容器

```java
private void refreshContext(ConfigurableApplicationContext context) {
    refresh(context);
    if (this.registerShutdownHook) {
        try {
            context.registerShutdownHook();
        } catch (AccessControlException ex) {
        }
    }
}
```

##### 注册Spring容器关闭钩子

#### @SpringBootApplication注解

##### @SpringBootConfiguration

##### @ComponentScan

#### @EnableAutoConfiguration

##### @Import(AutoConfigurationImportSelector.class)

##### AutoConfigurationImportSelector
