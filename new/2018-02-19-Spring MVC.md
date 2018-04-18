---
layout: new
title:  Spring MVC
---

<img src="/images/spring/spring-mvc-flow.png" style="width: 480px; border-width: 0px;" />

#### DispatcherServlet

DispatcherServlet，前端控制器

```xml
<servlet>
    <servlet-name>index</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
    <init-param>
        <param-name>contextConfigLocation</param-name>
        <param-value>classpath:config/spring/index-servlet.xml</param-value>
    </init-param>
    <load-on-startup>1</load-on-startup>
</servlet>

<servlet-mapping>
    <servlet-name>index</servlet-name>
    <url-pattern>/</url-pattern>
</servlet-mapping>
```

#### HandlerMapping

HandlerMapping，定义请求和Handler之间的映射

```java
public interface HandlerMapping {

    // 返回匹配请求的Handler和拦截器链
    HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception;
}
```

HandlerExecutionChain，包装Handler和Handler拦截器链

```java
public class HandlerExecutionChain {

    // Handler
    private final Object handler;

    // Handler拦截器链
    private HandlerInterceptor[] interceptors;

}
```

#### HandlerInterceptor

HandlerInterceptor，Handler拦截器，自定义Handler执行链

```java
public interface HandlerInterceptor {

    // 预处理, Handler执行前
    boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception;

    // 后处理, Handler执行后, View渲染前
    void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception;

    // 返回处理, View渲染后
    void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception;

}
```

#### HandlerAdapter

HandlerAdapter，Handler适配器

```java
public interface HandlerAdapter {

    // 执行Handler, 返回ModelAndView
    ModelAndView handle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception;

}
```

#### ModelAndView

ModelAndView，模型和视图

```java
public class ModelAndView {

    // 视图
    private Object view;

    // 模型
    private ModelMap model;

}
```

#### ViewResolver

ViewResolver，视图解析器

```java
public interface ViewResolver {

    // 解析视图名, 返回View
    View resolveViewName(String viewName, Locale locale) throws Exception;

}
```

#### View

View，视图

```java
public interface View {

    // 用Model来渲染视图
    void render(Map<String, ?> model, HttpServletRequest request, HttpServletResponse response) throws Exception;

}
```

#### Spring MVC流程总结

* 请求进入DispatcherServlet
* HandlerMapping查找匹配请求的Handler，和Handler拦截器一起封装为HandlerExecutionChain
* Handler适配为HandlerAdapter
* 调用Handler拦截器链的preHandle()方法
* HandlerAdapter执行Handler，返回ModelAndView
* 调用Handler拦截器链的postHandle()方法
* ViewResolver解析视图名，返回View
* View使用Model来进行渲染
* 视图渲染结果写回Response
* 调用Handler拦截器链的afterCompletion()方法
* 请求处理结束
