---
layout: index
title:  Spring IOC源码
---

#### Spring IOC流程

* AbstractApplicationContext.refresh()
* 创建BeanFactory
* 加载BeanDefinition
    * `Map<String, BeanDefinition> beanDefinitionMap`
    * 解析并注册BeanDefinition
* Bean预实例化(非lazy-init): DefaultListableBeanFactory.preInstantiateSingletons()
    * doGetBean()
    * 实例化Bean
        * InstantiationAwareBeanPostProcessor.postProcessBeforeInstantiation()
        * `反射创建Bean`
        * addSingletonFactory: 处理循环依赖
        * InstantiationAwareBeanPostProcessor.postProcessAfterInstantiation()
    * ioc依赖注入
        * InstantiationAwareBeanPostProcessor.postProcessPropertyValues()
            * `inject`
    * Bean初始化
        * Aware
            * Aware.setBeanName()
            * BeanClassLoaderAware.setBeanClassLoader()
            * BeanFactoryAware.setBeanFactory()
        * BeanPostProcessor.postProcessBeforeInitialization()
            * `@PostConstruct`
        * `InitializingBean.afterPropertiesSet()`
        * `init-method`
        * BeanPostProcessor.postProcessAfterInitialization()

#### Spring扩展接口

* ```FactroyBean```
* ```BeanPostProcessor```
* ```InstantiationAwareBeanPostProcessor```
* ```BeanFactoryPostProcessor```
* ```Aware```
* ```InitializingBean```

#### @Autowired/@Resource

* @Autowired: AutowiredAnnotationBeanPostProcessor
    * byType
    * 有多个，@Primary
    * @Qualifier: byType + byName
* @Resource: CommonAnnotationBeanPostProcessor
    * @Resource(name, type): byName + byType
    * @Resource(name): byName
    * @Resource(type): byType
    * @Resource: 先fieldName，后classType

#### 循环依赖

* `构造器的循环依赖没法解决`
* 三级缓存
    * singletonObjects: Map<String, Object>
    * earlySingletonObjects: Map<String, Object>
    * singletonFactories: Map<String, ObjectFactory<?>>

```java
protected Object getSingleton(String beanName, boolean allowEarlyReference) {
    Object singletonObject = this.singletonObjects.get(beanName);
    if (singletonObject == null && isSingletonCurrentlyInCreation(beanName)) {
        synchronized (this.singletonObjects) {
            singletonObject = this.earlySingletonObjects.get(beanName);
            if (singletonObject == null && allowEarlyReference) {
                ObjectFactory<?> singletonFactory = this.singletonFactories.get(beanName);
                if (singletonFactory != null) {
                    singletonObject = singletonFactory.getObject();
                    this.earlySingletonObjects.put(beanName, singletonObject);
                    this.singletonFactories.remove(beanName);
                }
            }
        }
    }
    return (singletonObject != NULL_OBJECT ? singletonObject : null);
}
```
