---
layout: dict
title:  Hashmap
date:   2020-09-22
tags:   [java, hash]
---

#### hashcode()

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```
