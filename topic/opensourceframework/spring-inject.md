---
layout: topic
module: 开源框架
title:  Spring注入
date:   2017-02-22
---

#### @Autowired注入

按照类型自动注入

```java
public @interface Autowired {

    boolean required() default true;

}
```

#### @Resource注入

按照名称或类型自动注入

```java
public @interface Resource {

    String name() default "";

    Class type() default java.lang.Object.class;

}
```

注入流程:

* 
