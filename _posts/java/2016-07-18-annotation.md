---
layout:     article
categories: [java]
title:      Java注解
tags:       [java]
date:       2016-07-18
---

定义一个注解。

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

`javap -c Client.class`

```java
public interface org.txazo.java.annotation.Client extends java.lang.annotation.Annotation {
  public abstract java.lang.String type();
}
```

注解也是一个接口，继承自`java.lang.annotation.Annotation`。然后，看下`Annotation`接口的代码。

```java
public interface Annotation {

    boolean equals(Object obj);

    int hashCode();

    String toString();

    Class<? extends Annotation> annotationType();

}
```

`Annotation`定义了`equals`、`hashCode`、`toString`、`annotationType`四个方法，所以注解也有这四个通用的方法。

注解是一个接口，那么，它的实现类是什么呢？

通过跟踪`Class.getAnnotation()`的代码，可以发现，注解是通过`sun.reflect.annotation.AnnotationParser.annotationForMap()`方法完成实例化的，可以看出，注解的实现原理是动态代理。

```java
public class AnnotationParser {

    public static Annotation annotationForMap(Class<? extends Annotation> type, Map<String, Object> memberValues) {
        return (Annotation) Proxy.newProxyInstance(type.getClassLoader(), new Class[]{type}, new AnnotationInvocationHandler(type, memberValues));
    }

}
```

接下来看`AnnotationInvocationHandler`。

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
        // equals方法
        if (member.equals("equals") && paramTypes.length == 1 && paramTypes[0] == Object.class) {
            return equalsImpl(args[0]);
        }
        // 除equals外, 注解的其它方法都不带参数
        if (paramTypes.length != 0) {
            throw new AssertionError("Too many parameters for an annotation method");
        }
        // toString方法
        if (member.equals("toString")) {
            return toStringImpl();
        }
        // hashCode方法
        if (member.equals("hashCode")) {
            return hashCodeImpl();
        }
        // annotationType方法
        if (member.equals("annotationType")) {
            return type;
        }
        // 注解方法的返回值
        Object result = memberValues.get(member);
        // 注解方法的返回值不可为null
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
