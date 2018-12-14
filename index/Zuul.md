---
layout: index
title:  Zuul
---

#### RequestContext

#### ZuulServlet

* pre
* route
* post

#### ZuulFilter

* ServletDetectionFilter(`pre`): 检测是否DispatcherServlet过来的Request
* Servlet30WrapperFilter(`pre`): 包装HttpServletRequest
* PreDecorationFilter(`pre`): 查找路由

* RibbonRoutingFilter(`route`): 使用Ribbon、Hystrix或HttpClient发送代理请求

* SendResponseFilter(`post`): 写回代理请求的响应

```java
public abstract class ZuulFilter implements IZuulFilter, Comparable<com.netflix.zuul.ZuulFilter> {

    // zuul.ServletDetectionFilter.pre.disable:true
    public boolean isFilterDisabled() {
        return filterDisabled.get();
    }

}
```

```java
public class MyFilter extends ZuulFilter {

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public int filterOrder() {
        return 10;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public Object run() {
        System.out.println(RequestContext.getCurrentContext().getRequest().getRequestURL());
        return null;
    }

}
```

![Zuul Core Architecture](/images/zuul/zuul-filter.png)

![Request Lifecycle](/images/zuul/zuul-lifecycle.png)
