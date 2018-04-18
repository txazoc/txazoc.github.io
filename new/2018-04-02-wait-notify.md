---
layout: new
title:  wait-notify
---

`wait()`方法应该在循环中调用

```java
synchronized (obj) {
    // 循环条件检测
    while (condition) {
        try {
            obj.wait();
        } catch (InterruptedException e) {
        }
    }
}
```
