---
layout: new
title:  ThreadLocal
---

#### ThreadLocal结构

Thread内部有一个`ThreadLocal.ThreadLocalMap`实例

```java
public class Thread implements Runnable {

    ThreadLocal.ThreadLocalMap threadLocals = null;

}
```

ThreadLocal为ThreadLocalMap中Entry的key，同时也是WeakReference的referent

```java
public class ThreadLocal<T> {

    static class ThreadLocalMap {

        private Entry[] table;

        /**
         * Entry节点为弱引用
         */
        static class Entry extends WeakReference<ThreadLocal<?>> {

            Object value;

            Entry(ThreadLocal<?> k, Object v) {
                // referent为ThreadLocal
                super(k);
                value = v;
            }
        }

    }

}
```

#### ThreadLocal.get()

```java
public T get() {
    // 当前线程的ThreadLocalMap
    ThreadLocalMap map = getMap(Thread.currentThread());
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            return (T) e.value;
        }
    }
    // 设置初始值
    return setInitialValue();
}

ThreadLocalMap getMap(Thread t) {
    return t.threadLocals;
}

/**
 * 可被重写
 */
protected T initialValue() {
    return null;
}
```

#### ThreadLocal内存泄露

在一个线程内，使用多个ThreadLocal，用完后ThreadLocal失去强引用，gc时会被回收，但Entry中的value不会被回收，造成内存泄露。

最新的ThreadLocal实现中，get()和set()时，会调用`expungeStaleEntry()`方法清除key为null的Entry中的value。

好的习惯: ThreadLocal用完后，手动调用`remove()`方法清除Entry中的value
