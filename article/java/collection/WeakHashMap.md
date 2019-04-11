---
layout: article
title:  WeakHashMap
---

#### WeakHashMap的Entry

WeakHashMap的`Entry`是一个弱引用

```java
/**
 * 继承自WeakReference
 */
private static class Entry<K, V> extends WeakReference<Object> implements Map.Entry<K, V> {

    // key为Reference的referent
    // value
    V value;
    // hash值
    final int hash;
    // next
    Entry<K, V> next;

    Entry(Object key, V value,
          ReferenceQueue<Object> queue,
          int hash, Entry<K, V> next) {
        super(key, queue);
        this.value = value;
        this.hash = hash;
        this.next = next;
    }

}
```

#### WeakHashMap的原理

* key只被WeakReference.Entry弱引用，gc时key被回收，key = null
* 被回收key的entry入队列queue
* 操作WeakHashMap时，会执行expungeStaleEntries()清除queue中的entry
* expungeStaleEntries()
    * queue中的entry出队列
    * entry从entry链中删除
    * entry.value = null
* 下一次gc，value如果不被其它对象引用，就会被回收
