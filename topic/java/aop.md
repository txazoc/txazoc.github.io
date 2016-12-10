---
layout: topic
module: Java
title:  AOP
date:   2016-12-10
---

* 静态织入: 编译期, AspectJ的织入编译器
* JDK动态代理: 运行时, 创建接口的实现类, 反射实现
* CGLib代理: 运行时, 通过字节码技术创建类的子类, 覆盖父类方法, 加入拦截, 无法代理final的方法
* 自定义类加载器: 类装载, 实现特殊的ClassLoader, Javassist
