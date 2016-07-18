---
layout:     article
categories: [java]
title:      Java注解
tags:       [java]
date:       2016-07-18
---

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
        // 克隆并返回返回数组结果
        if (result.getClass().isArray() && Array.getLength(result) != 0) {
            result = cloneArray(result);
        }
        // 返回结果
        return result;
    }

}
```
