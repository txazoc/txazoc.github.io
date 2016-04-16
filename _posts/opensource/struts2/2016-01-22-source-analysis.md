---
layout:     article
published:  true
title:      Struts2源码分析
date:       2016-01-22
categories: [struts2]
tags:       [java, 开源框架, struts2]
---

#### 标题
* 到达核心过滤器StrutsPrepareAndExecuteFilter
* 到达核心过滤器StrutsPrepareAndExecuteFilter
* 到达核心过滤器StrutsPrepareAndExecuteFilter
* 到达核心过滤器StrutsPrepareAndExecuteFilter

#### Struts2的运行流程

    1) Request进来, 经过一系列过滤器, 到达核心过滤器StrutsPrepareAndExecuteFilter
    2) 询问ActionMapper是否存在请求对应的Action
    3) Action存在, 根据struts.xml中配置的Action信息, 创建Action的代理对象ActionProxy
    4) ActionProxy把请求交给ActionInvocation, ActionInvocation内部持有具体的Action对象和一系列拦截器
    5) 执行一系列拦截器, 然后执行Action, 得到Result
    6) 根据Result和Action配置的返回类型生成Response
    7) Response经过一系列拦截器和一系列过滤器返回

#### Struts2的运行流程

之前在看这篇名为“JavaScript字符串练习之实现”时，动手试了一下各个方法，发现题目6的解法得不到想要的结果，也不太理解其解题思路，遂自己上网找了两个解法，以防自己忘记，记下以当笔记，若有人看到此文，有更好的解法，希望您能与大家分享。
