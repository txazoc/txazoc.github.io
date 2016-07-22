---
layout:     article
categories: [java]
title:      Java注解
tags:       [java]
date:       2016-07-18
---

> 注解，Annotation，也叫元数据。一种代码级别的说明。它是JDK1.5及以后版本引入的一个特性，与类、接口、枚举是在同一个层次。它可以声明在包、类、字段、方法、局部变量、方法参数等的前面，用来对这些元素进行说明和注释。    - [百度百科](http://baike.baidu.com/view/8059816.htm)

先来定义一个注解，关键字`@interface`。

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Client {

    String type() default "ios";

}
```

使用注解。

```java
@Client(type = "ios")
public class IPhone {
}
```

反编译注解类，`javap -c Client.class`。

```java
Compiled from "Client.java"
public interface Client extends java.lang.annotation.Annotation {
  public abstract java.lang.String type();
}
```

可以看到，注解本质是一个接口，继承自`java.lang.annotation.Annotation`。

`java.lang.annotation.Annotation`接口的源码。

```java
public interface Annotation {

    boolean equals(Object obj);

    int hashCode();

    String toString();

    // 注解类型
    Class<? extends Annotation> annotationType();

}
```

`Annotation`接口定义了`equals()`、`hashCode()`、`toString()`、`annotationType()`四个方法。所以，注解除了自定义的方法外，还要实现`Annotation`的四个方法。

那么，注解的实现类是什么呢？

通过跟踪`Class.getAnnotation()`的源码，可以发现，注解是通过`sun.reflect.annotation.AnnotationParser.annotationForMap()`方法完成实例化的。

```java
public class AnnotationParser {

    public static Annotation annotationForMap(Class<? extends Annotation> type, Map<String, Object> memberValues) {
        return (Annotation) Proxy.newProxyInstance(type.getClassLoader(), new Class[]{type}, new AnnotationInvocationHandler(type, memberValues));
    }

}
```

通过`annotationForMap()`方法的实现，可以看出，注解是通过JDK的动态代理来实例化的。

接下来，看下`AnnotationInvocationHandler`的源码实现。

```java
class AnnotationInvocationHandler implements InvocationHandler, Serializable {

    private static final long serialVersionUID = 6182022883658399397L;

    // 注解class
    private final Class<? extends Annotation> type;
    // 成员方法返回值集合
    private final Map<String, Object> memberValues;

    AnnotationInvocationHandler(Class<? extends Annotation> type, Map<String, Object> memberValues) {
        Class[] interfaces = type.getInterfaces();
        // 注解校验
        if (type.isAnnotation() && interfaces.length == 1 && interfaces[0] == Annotation.class) {
            this.type = type;
            this.memberValues = memberValues;
        } else {
            throw new AnnotationFormatError("Attempt to create proxy for a non-annotation type.");
        }
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // 方法名
        String member = method.getName();
        // 方法参数
        Class<?>[] paramTypes = method.getParameterTypes();
        // equals()方法
        if (member.equals("equals") && paramTypes.length == 1 && paramTypes[0] == Object.class) {
            return equalsImpl(args[0]);
        }
        // 除equals()外, 注解的其它方法都不带参数
        if (paramTypes.length != 0) {
            throw new AssertionError("Too many parameters for an annotation method");
        }
        // toString()方法
        if (member.equals("toString")) {
            return toStringImpl();
        }
        // hashCode()方法
        if (member.equals("hashCode")) {
            return hashCodeImpl();
        }
        // annotationType()方法
        if (member.equals("annotationType")) {
            return type;
        }
        // 以下是注解自定义的方法
        // 注解方法的返回值
        Object result = memberValues.get(member);
        // 注解方法的返回值为null, 抛出异常
        if (result == null) {
            throw new IncompleteAnnotationException(type, member);
        }
        // 结果异常
        if (result instanceof ExceptionProxy) {
            throw ((ExceptionProxy) result).generateException();
        }
        // 克隆并返回数组结果
        if (result.getClass().isArray() && Array.getLength(result) != 0) {
            result = cloneArray(result);
        }
        // 返回结果
        return result;
    }

}
```

`AnnotationInvocationHandler`中，`memberValues`为注解方法的返回值集合，对应的`key`为注解的方法名，`value`为方法的返回值。
