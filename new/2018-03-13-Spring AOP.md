---
layout: new
title:  Spring AOP
---

#### AOP

Aspect Oriented Programming，面向切面编程

#### 切入点Pointcut

* execution: 方法
* args: 方法参数
* @args: 方法参数注解
* @annotation: 方法注解
* ...

```java
public interface Pointcut {

    // 类过滤器
    ClassFilter getClassFilter();

    // 方法匹配器
    MethodMatcher getMethodMatcher();

}
```

类过滤器，参考`AspectJExpressionPointcut`

```java
public interface ClassFilter {

    boolean matches(Class<?> clazz);

}
```

方法匹配器，参考`AspectJExpressionPointcut`

```java
public interface MethodMatcher {

    boolean isRuntime();

    boolean matches(Method method, Class<?> targetClass);

    boolean matches(Method method, Class<?> targetClass, Object... args);

}
```

#### 增强Advice

* 前置增强: MethodBeforeAdvice
* 环绕增强: MethodInterceptor
* 异常增强: ThrowsAdvice
* 后置增强: AfterReturningAdvice
* 引介增强: IntroductionInterceptor

#### 切面Aspect

```切面Aspect = 切入点Pointcut + 增强Advice```

#### AOP代理

* JDK动态代理: JdkDynamicAopProxy
* CGLib动态代理: ObjenesisCglibAopProxy

#### AOP代理实现


```java
public class ReflectiveMethodInvocation implements ProxyMethodInvocation, Cloneable {

    // 当前拦截器的索引
    private int currentInterceptorIndex = -1;
    // 拦截器列表(包括动态方法匹配器)
    protected final List<?> interceptorsAndDynamicMethodMatchers;

    @Override
    public Object proceed() throws Throwable {
        if (this.currentInterceptorIndex == this.interceptorsAndDynamicMethodMatchers.size() - 1) {
            // 拦截器列表调用完, 调用连接点的方法
            return invokeJoinpoint();
        }

        // currentInterceptorIndex自加1, 职责链模式
        Object interceptorOrInterceptionAdvice = this.interceptorsAndDynamicMethodMatchers.get(++this.currentInterceptorIndex);
        if (interceptorOrInterceptionAdvice instanceof InterceptorAndDynamicMethodMatcher) {
            // 动态方法匹配器的处理逻辑, 此处略过
        } else {
            // 调用拦截器
            return ((MethodInterceptor) interceptorOrInterceptionAdvice).invoke(this);
        }
    }

}
```

前置增强拦截器:

```java
public class MethodBeforeAdviceInterceptor implements MethodInterceptor, Serializable {

    private MethodBeforeAdvice advice;

    public MethodBeforeAdviceInterceptor(MethodBeforeAdvice advice) {
        this.advice = advice;
    }

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        this.advice.before(invocation.getMethod(), invocation.getArguments(), invocation.getThis());
        return invocation.proceed();
    }

}
```

后置增强拦截器:

```java
public class AfterReturningAdviceInterceptor implements MethodInterceptor, AfterAdvice, Serializable {

    private final AfterReturningAdvice advice;

    public AfterReturningAdviceInterceptor(AfterReturningAdvice advice) {
        this.advice = advice;
    }

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        Object result = invocation.proceed();
        this.advice.afterReturning(result, invocation.getMethod(), invocation.getArguments(), invocation.getThis());
        return result;
    }

}
```

异常增强拦截器:

```java
public class ThrowsAdviceInterceptor implements MethodInterceptor, AfterAdvice {

    private final Object throwsAdvice;

    @Override
    public Object invoke(MethodInvocation invocation) throws Throwable {
        try {
            return invocation.proceed();
        } catch (Throwable ex) {
            Method handlerMethod = getExceptionHandler(ex);
            if (handlerMethod != null) {
                invokeHandlerMethod(invocation, ex, handlerMethod);
            }
            throw ex;
        }
    }

}
```
