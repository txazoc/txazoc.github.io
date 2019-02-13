---
layout: index
title:  Spring IOC源码
---

* 创建BeanFactory
* 加载BeanDefinition
    * `Map<String, BeanDefinition> beanDefinitionMap`
    * 解析并注册BeanDefinition
* Bean预实例化(非lazy-init)
    * doGetBean()
    * InstantiationAwareBeanPostProcessor.postProcessBeforeInstantiation()
    * 实例化Bean
    * addSingletonFactory()
