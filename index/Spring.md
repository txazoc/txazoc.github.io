---
layout: index
title:  Spring
---

#### BeanFactory

#### ApplicationContext

#### Spring扩展接口

* ```FactroyBean```
* ```BeanPostProcessor```
* ```InstantiationAwareBeanPostProcessor```
* ```BeanFactoryPostProcessor```
* ```Aware```
* ```InitializingBean```

#### Spring IOC

* ClassPathXmlApplicationContext
* AbstractApplicationContext: refresh()
* createBeanFactory()
* AbstractXmlApplicationContext: loadBeanDefinitions()
* AbstractApplicationContext: invokeBeanFactoryPostProcessors()
* registerBeanPostProcessors()
* DefaultListableBeanFactory: preInstantiateSingletons()

* AbstractAutowireCapableBeanFactory: createBean()
* InstantiationAwareBeanPostProcessor.postProcessBeforeInstantiation()
* AbstractAutowireCapableBeanFactory: doCreateBean()
* BeanUtils.instantiateClass()
* InstantiationAwareBeanPostProcessor: postProcessAfterInstantiation()
* InstantiationAwareBeanPostProcessor
* Aware.setBeanName()
* BeanClassLoaderAware.setBeanClassLoader()
* BeanFactoryAware.setBeanFactory()
* BeanPostProcessor: postProcessBeforeInitialization()
* InitializingBean: afterPropertiesSet()
* BeanPostProcessor: postProcessAfterInitialization()

#### BeanDefinition

* BeanDefinition
* BeanDefinitionHolder

* AnnotatedBeanDefinitionReader
* BeanDefinitionRegistry
* ClassPathBeanDefinitionScanner
* ImportBeanDefinitionRegistrar
* FactoryBean
