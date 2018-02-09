---
layout: new
title:  原子类AtomicInteger
---

原子类原理: volatile + CAS

```java
public class AtomicInteger extends Number implements Serializable {

    private static final Unsafe unsafe = Unsafe.getUnsafe();
    
    // value字段偏移
    private static final long valueOffset;

    static {
        valueOffset = unsafe.objectFieldOffset(AtomicInteger.class.getDeclaredField("value"));
    }

    // 值
    private volatile int value;

    /**
     * 自增1
     */
    public final int getAndIncrement() {
        return unsafe.getAndAddInt(this, valueOffset, 1);
    }

}
```

```java
public final int getAndAddInt(Object o, long offset, int delta) {
    int v;
    // 自旋CAS
    do {
        v = getIntVolatile(o, offset);
    } while (!compareAndSwapInt(o, offset, v, v + delta));
    return v;
}
```
