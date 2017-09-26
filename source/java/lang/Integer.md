---
layout: source
title:  Integer
date:   2017-09-26
---

#### 最大值和最小值

```java
// int最小值: -2147483648
public static final int MIN_VALUE = 0x80000000;

// int最大值: 2147483647
public static final int MAX_VALUE = 0x7fffffff;
```

#### 自动装箱拆箱

* 装箱

```java
public static Integer valueOf(int i) {
    if (i >= IntegerCache.low && i <= IntegerCache.high) {
        return IntegerCache.cache[i + (-IntegerCache.low)];
    }
    return new Integer(i);
}
```

* 拆箱

```java
public int intValue() {
    return value;
}
```

#### Integer缓存

```java
private static class IntegerCache {

    static final int low = -128;
    static final int high;
    static final Integer cache[];

    static {
        int h = 127;
        String integerCacheHighPropValue = sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
        if (integerCacheHighPropValue != null) {
            try {
                int i = parseInt(integerCacheHighPropValue);
                i = Math.max(i, 127);
                h = Math.min(i, Integer.MAX_VALUE - (-low) - 1);
            } catch (NumberFormatException nfe) {
            }
        }
        high = h;
        cache = new Integer[(high - low) + 1];
        int j = low;
        for (int k = 0; k < cache.length; k++) {
            cache[k] = new Integer(j++);
        }
    }

    private IntegerCache() {
    }

}
```
