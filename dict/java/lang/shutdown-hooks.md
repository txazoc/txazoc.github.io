---
layout: homelist
title: 关闭钩子
date: 2019-09-30
---

#### 关闭钩子

```java
public class Runtime {

    // 注册关闭钩子
    public void addShutdownHook(Thread hook) {
        ApplicationShutdownHooks.add(hook);
    }

}
```

```java
public class ApplicationShutdownHooks {

    // 关闭钩子map
    private static IdentityHashMap<Thread, Thread> hooks;

    static {
        // 程序关闭，运行钩子
        Shutdown.add(1, false, () -> runHooks());
    }

    // 注册钩子
    static synchronized void add(Thread hook) {
        hooks.put(hook, hook);
    }

    static void runHooks() {
        // 并行运行钩子线程
        for (Thread hook : hooks.keySet()) {
            hook.start();
        }

        // 等待钩子线程运行完成
        for (Thread hook : hooks.keySet()) {
            hook.join();
        }
    }

}
```
