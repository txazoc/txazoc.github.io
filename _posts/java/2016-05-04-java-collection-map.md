---
layout:     article
categories: [java]
title:      Java Map
tags:       [java, 集合]
date:       2016-05-04
---

Map是key-value映射的集合。

#### HashMap

下面是HashMap的数据结构。

```java
public class HashMap<K, V> {

    // key-value对的数量
    transient int size;
    // 节点的链表数组
    transient Entry<K, V>[] table = (Entry<K, V>[]) EMPTY_TABLE;
    int threshold;
    final float loadFactor;
    // 修改的次数
    transient int modCount;

    /**
     * 节点
     */
    static class Entry<K, V> implements Map.Entry<K, V> {

        // 节点的hash值
        int hash;
        // 节点的key
        final K key;
        // 节点的value
        V value;
        // 下一个节点
        Entry<K, V> next;

    }

}
```

#### Hashtable

Hashtable是线程安全的。

#### LinkedHashMap

#### ConcurrentHashMap

#### TreeMap

#### Properties

#### WeakHashMap

#### ConcurrentSkipListMap
