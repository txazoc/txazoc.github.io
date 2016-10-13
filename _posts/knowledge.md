---
layout:     article
published:  false
categories: [java]
title:      知识点积累
tags:       [总结]
date:       2016-07-27
---

#### 缓存雪崩

* 缓存预热
* 分布式锁
* 缓存失效前更新
* 二级缓存

#### 缓存穿透

* 空缓存

#### 职责链模式

* 链表实现
* 数组实现

#### 命令模式

* 接口分离变化与不变

#### 解释器模式

* 文法
* 解释器

#### 迭代器模式

* 集合元素遍历

#### 中介者模式

* 中间对象

#### 备忘录模式

* 持久化 - 恢复

#### 观察者模式

* 接口回调

#### 状态模式

* 改变状态 - 改变行为

#### 策略模式

* 多种算法实现

#### 模版方法模式

* 模板方法固定算法骨架
* 延迟子类实现
* 接口的匿名内部类

#### 访问者模式

* 获取内部数据结构, 实现不同算法

#### 简单工厂模式

* 一个工厂创建不同产品

#### 工厂方法模式

* 工厂接口化

#### 抽象工厂模式

* 工厂创建一个产品族

#### 单例模式

* 饿汉式单例
* 懒汉式单例
* 枚举单例
* 双重检查锁单例
* 静态内部类单例

#### 原型模式

* 浅克隆
* 深克隆
* JDK Cloneable
* 序列化/反序列化实现深克隆

#### 建造者模式

* 构建过程和构建实现分离

#### 适配器模式

* 接口转换

#### 桥接模式

* 多纬度组合

#### 组合模式

* 树形结构

#### 装饰器模式

* 功能扩展

#### 门面模式

* 子系统的高层次接口

#### 享元模式

* 共享大量的细粒度对象

#### 代理模式

* 控制对象访问
* 静态代理
* 动态代理: JDK CGLib

#### JDK动态代理

* Proxy.newProxyInstance
* 生成代理类的字节码($Proxy0反编译), 装载Class并缓存
* Constructor实例化代理类
* 调用代理类的方法
* 调用InvocationHandler.invoke()
* Method调用目标对象方法

#### HashMap

* 数组 + 链表: Node(hash, key, value, next)[]
* hash相等, key相等或equals()
* 扩容: rehash()

#### ConcurrentHashMap(jdk7)

* volatile Node(final hash, final key, volatile value, volatile next)[]
* get()操作: 不加锁
* put()操作: 对Node加锁, volatile value + volatile next

#### fail-fast机制

* modCount

#### Unsafe

* 创建对象实例并分配内存
* 定位内存偏移
* 获取和修改对象中字段的值或数组元素的值
* CAS操作
* 挂起与恢复线程

#### 原子类

* Unsafe的CAS操作

#### CountDownLatch: 记数器

* await() countDown()

#### CyclicBarrier: 循环屏障

* await() reset()

#### Semaphore: 信号量

* 控制并发数

#### Java内存模型

* 线程(处理器) － 本地内存(共享变量副本) － JMM － 主内存(共享变量)

#### synchronized

* synchronized同步方法 synchronized静态同步方法: ACC_SYNCHRONIZED标记
* synchronized同步代码块: monitorenter monitorexit
* monitor: 监视器

#### ReentrantLock: 可重入锁

* volatile + CAS + park

#### 线程池

* ThreadPoolExecutor
* 工作线程, 循环从工作队列获取任务执行, 
* 工作线程数 < corePoolSize, 新建工作线程
* 工作线程数 > corePoolSize, 工作队列未满, 添加到工作队列
* 工作线程数 > corePoolSize, 工作队列满, 新建工作线程
* 工作队列满, woker工作线程数 > maximumPoolSize, reject策略处理
