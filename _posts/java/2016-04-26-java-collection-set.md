---
layout:     article
categories: [java]
title:      Java Set
tags:       [java, 集合, set]
date:       2016-04-26
---

> Set，无序不包含重复元素的集合。

#### Set

#### HashSet

HashSet基于HashMap实现，其中key为Set的元素，value为固定的Object对象。

```java
public class HashSet<E> {

    // HashMap
    private transient HashMap<E,Object> map;
    // map的value值
    private static final Object PRESENT = new Object();

    public HashSet() {
        map = new HashMap<>();
    }

    public boolean add(E e) {
        return map.put(e, PRESENT) == null;
    }

    public boolean contains(Object o) {
        return map.containsKey(o);
    }

    public boolean remove(Object o) {
        return map.remove(o) == PRESENT;
    }

}
```

#### TreeSet

#### LinkedHashSet

#### CopyOnWriteArraySet

#### ConcurrentSkipListSet
