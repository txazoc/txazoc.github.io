---
layout: topic
module: Java
title:  注解
date:   2016-11-11
---

定义一个注解

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Client {

    String type() default "ios";

}
```

反编译: `javap -p Client.class`

```javap
Compiled from "Client.java"
public interface Client extends java.lang.annotation.Annotation {
  public abstract java.lang.String type();
}
```

`java.lang.annotation.Annotation`接口

```java
public interface Annotation {

    boolean equals(Object obj);

    int hashCode();

    String toString();

    Class<? extends Annotation> annotationType();

}
```

跟踪`Class.getAnnotation()`的源码

```java
public class AnnotationParser {

    public static Annotation annotationForMap(Class<? extends Annotation> type, Map<String, Object> memberValues) {
        return (Annotation) Proxy.newProxyInstance(type.getClassLoader(), new Class[]{type}, new AnnotationInvocationHandler(type, memberValues));
    }

}
```
