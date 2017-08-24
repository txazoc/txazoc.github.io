---
layout: topic
module: Java
title:  Park/Unpark
tags:   [unsafe, park]
date:   2017-08-24
---

数据结构

```c
class Parker : public os::PlatformParker {
private:
    volatile int _counter;
    Parker *FreeNext;
    JavaThread *AssociatedWith;
};

class PlatformParker {
protected:
    mutex_t _mutex[1];
    cond_t _cond[1];
};
```

`park`流程

* `_counter`大于0则返回
* 检查当前线程被中断则返回
* `_mutex`加锁
* 判断等待时间，并调用`pthread_cond_wait`等待，等待返回将`_mutex`置为0

`unpark`流程

* `_mutex`加锁
* `_counter` = 1
* `_mutex`解锁
* 若`_counter`在第2步前小于1，则唤醒在`park`中等待的线程
