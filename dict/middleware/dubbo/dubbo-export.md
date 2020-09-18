---
layout: home
title:  Dubbo服务导出
date:   2020-09-18
tags:   [dubbo]
---

#### 扫描dubbo服务注册为`ServiceBean`

响应Spring容器刷新事件:

```java
public void onApplicationEvent(ContextRefreshedEvent event) {
    // 是否有延迟导出 && 是否已导出 && 是不是已被取消导出
    if (isDelay() && !isExported() && !isUnexported()) {
        // 导出服务
        export();
    }
}
```

#### 检查服务URL配置

#### 多协议多注册中心导出服务

```java
private void doExportUrls() {
    // 加载注册中心链接
    List<URL> registryURLs = loadRegistries(true);
    // 遍历 protocols，并在每个协议下导出服务
    for (ProtocolConfig protocolConfig : protocols) {
        doExportUrlsFor1Protocol(protocolConfig, registryURLs);
    }
}
```
