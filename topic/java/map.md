---
layout: topic
module: Java
title:  Map
date:   2016-12-14
---

#### ***目录***

* [HashMap](#HashMap)
* [Hashtable](#Hashtable)
* [TreeMap](#TreeMap)
* [ConcurrentHashMap](#ConcurrentHashMap)

#### <a id="HashMap">HashMap</a>

***数据结构***

```java
public class HashMap<K, V> implements Map<K, V> {

    // 大小
    int size;
    // 修改次数
    int modCount;
    // 哈希表
    Entry<K, V>[] table;
    // 阈值
    int threshold;
    // 加载因子
    float loadFactor;
    
    static class Entry<K, V> implements Map.Entry<K, V> {
    
        final K key;
        V value;
        Entry<K, V> next;
        int hash;

    }
    
    public V get(Object key) {
        if (key == null) {
            return getForNullKey();
        }
        Entry<K, V> entry = getEntry(key);
        return null == entry ? null : entry.getValue();
    }

    static int indexFor(int h, int length) {
        return h & (length - 1);
    }

    final Entry<K, V> getEntry(Object key) {
        if (size == 0) {
            return null;
        }
        int hash = (key == null) ? 0 : hash(key);
        for (Entry<K, V> e = table[indexFor(hash, table.length)]; e != null; e = e.next) {
            Object k;
            if (e.hash == hash && ((k = e.key) == key || (key != null && key.equals(k)))) {
                return e;
            }
        }
        return null;
    }

}
```

***特点***

* 数组 + 链表实现，线程不安全
* key、value可以为null，key为null的Entry在table[0]中
* modCount: put或remove时，modCount++
* rehash: 当size大于threshold时，table扩容一倍，进行rehash
* 原理
    * 判断key是否为null
    * 计算key的hash
    * hash模余table.length，定位Entry链表
    * 遍历Entry链表，比较Entry(hash相等，key相等或equals)

#### <a id="Hashtable">Hashtable</a>

***特点***

* 同HashMap
* key、value不可以为null

#### <a id="TreeMap">TreeMap</a>

***数据结构***

```java
public class TreeMap<K, V> {

    // 红
    private static final boolean RED = false;
    // 黑
    private static final boolean BLACK = true;

    // 大小
    int size;
    // 修改次数
    int modCount;
    // 根节点
    Entry<K, V> root;

    static final class Entry<K, V> implements Map.Entry<K, V> {

        K key;
        V value;
        // 左子节点
        Entry<K, V> left;
        // 右子节点
        Entry<K, V> right;
        // 父节点
        Entry<K, V> parent;
        boolean color = BLACK;

    }

}
```

***特点***

* 红黑二叉树
* 排序的Map
* put、get时间复杂度: O(log(n))

#### <a id="ConcurrentHashMap">ConcurrentHashMap</a>
