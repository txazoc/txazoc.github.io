---
layout: topic
module: Java
title:  Map
date:   2016-12-10
---

#### HashMap

* 线程不安全
* key/value可以为null

#### Hashtable

* 线程安全
* key/value不可为null

#### ConcurrentHashMap(jdk8)

* volatile Node(hash key value next)[] table
* key/value不可为null
* 比较hash 比较key(key等于或key.equals())
* get(key): 不加锁
* put(key, value): 对Node加锁synchronized
