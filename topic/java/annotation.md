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

注解是一个接口，继承自`java.lang.annotation.Annotation`接口

```java
public interface Annotation {

    boolean equals(Object obj);

    int hashCode();

    String toString();

    Class<? extends Annotation> annotationType();

}
```

跟踪`Class.getAnnotation()`方法的源码，查看注解实例的生成过程

```java
public class AnnotationParser {

    public static Annotation annotationForMap(Class<? extends Annotation> type, Map<String, Object> memberValues) {
        return (Annotation) Proxy.newProxyInstance(type.getClassLoader(), new Class[]{type}, new AnnotationInvocationHandler(type, memberValues));
    }

}
```

注解实例是通过动态代理生成的，代理类`sun.reflect.annotation.AnnotationInvocationHandler`

```java
class AnnotationInvocationHandler implements InvocationHandler, Serializable {

    private static final long serialVersionUID = 6182022883658399397L;

    // 注解class
    private final Class<? extends Annotation> type;
    // 成员方法返回值集合
    private final Map<String, Object> memberValues;

    AnnotationInvocationHandler(Class<? extends Annotation> type, Map<String, Object> memberValues) {
        Class<?>[] superInterfaces = type.getInterfaces();
        // 注解校验
        if (!type.isAnnotation() || superInterfaces.length != 1 || superInterfaces[0] != java.lang.annotation.Annotation.class) {
            throw new AnnotationFormatError("Attempt to create proxy for a non-annotation type.");
        }
        this.type = type;
        this.memberValues = memberValues;
    }

    public Object invoke(Object proxy, Method method, Object[] args) {
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

        switch (member) {
            // toString()方法
            case "toString":
                return toStringImpl();
            // hashCode()方法
            case "hashCode":
                return hashCodeImpl();
            // annotationType()方法
            case "annotationType":
                return type;
        }

        // 以下是注解自定义方法的处理

        // 注解方法的返回值
        Object result = memberValues.get(member);

        // 注解方法的返回值为null, 抛出异常
        if (result == null) {
            throw new IncompleteAnnotationException(type, member);
        }

        // 结果异常
        if (result instanceof ExceptionProxy)
            throw ((ExceptionProxy) result).generateException();

        // 返回结果是数组类型, 克隆数组
        if (result.getClass().isArray() && Array.getLength(result) != 0) {
            result = cloneArray(result);
        }

        // 返回结果
        return result;
    }

}
```
