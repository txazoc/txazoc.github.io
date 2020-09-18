---
layout: home
title:  Spring关闭钩子
date:   2019-09-30
tags:   [spring, 关闭钩子]
---

#### Spring容器注册关闭钩子

```java
public abstract class AbstractApplicationContext {

    public void registerShutdownHook() {
        if (this.shutdownHook == null) {
            this.shutdownHook = new Thread() {

                @Override
                public void run() {
                    synchronized (startupShutdownMonitor) {
                        doClose();
                    }
                }

            };
            Runtime.getRuntime().addShutdownHook(this.shutdownHook);
        }
    }

}
```

#### doClose()关闭容器

```java
protected void doClose() {
    // 发布容器关闭事件
    publishEvent(new ContextClosedEvent(this));

    // 关闭生命周期Bean
    if (this.lifecycleProcessor != null) {
        this.lifecycleProcessor.onClose();
    }

    // 销毁容器中缓存的单例
    destroyBeans();

    // 关闭容器自身
    closeBeanFactory();

    // 提供给子类做最后的清理工作
    onClose();
}
```

##### 发布容器关闭事件

##### 关闭生命周期Bean

##### 销毁容器中缓存的单例

##### 关闭容器自身

##### 提供给子类做最后的清理工作
