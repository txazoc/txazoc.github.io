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

* ServletDetectionFilter
* Servlet30WrapperFilter
* PreDecorationFilter

* RibbonRoutingFilter

* SendResponseFilter

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
