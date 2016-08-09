---
layout:     article
categories: [jvm]
title:      JVM启动分析
tags:       [jvm, openjdk]
date:       2016-08-09
---

```c
// openjdk7/jdk/src/share/bin/main.c

int main(int argc, char **argv) {
    // ...
    return JLI_Launch(...);
}
```

```c
// openjdk7/jdk/src/share/bin/java.c

void InitLauncher(boolean javaw) {
    // ...
    // UI初始化
    InitCommonControlsEx(&icx);
    // 
    JLI_SetTraceLauncher();
}
```
