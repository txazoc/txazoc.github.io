---
layout: topic
module: Java
title:  DirectByteBuffer
date:   2017-09-23
---

#### 直接内存最大值

```java
public final class System {

    /**
     * 初始化System时由JVM调用
     */
    private static void initializeSystemClass() {
        props = new Properties();
        initProperties(props);
        sun.misc.VM.saveAndRemoveProperties(props);
    }

}
```

```java
public static void saveAndRemoveProperties(Properties props) {
    if (booted) {
        throw new IllegalStateException("System initialization has completed");
    }

    savedProps.putAll(props);

    // 直接内存最大值
    String s = (String) props.remove("sun.nio.MaxDirectMemorySize");
    if (s != null) {
        if (s.equals("-1")) {
            // -XX:MaxDirectMemorySize未指定
            directMemory = Runtime.getRuntime().maxMemory();
        } else {
            // -XX:MaxDirectMemorySize
            long l = Long.parseLong(s);
            if (l > -1) {
                directMemory = l;
            }
        }
    }

    // 按页对齐
    s = (String) props.remove("sun.nio.PageAlignDirectMemory");
    if ("true".equals(s)) {
        pageAlignDirectMemory = true;
    }

}
```

```c
JVM_ENTRY_NO_ENV(jlong, JVM_MaxMemory(void))
    JVMWrapper("JVM_MaxMemory");
    size_t n = Universe::heap()->max_capacity();
    return convert_size_t_to_jlong(n);
JVM_END
```

```java
/**
 * survivor=25m
 *
 * VM Args: -server -Xms200m -Xmx200m -XX:NewRatio=1 -XX:SurvivorRatio=2
 */
@Test
public void testMaxDirectMemory() {
    long xmx = 200 * 1024 * 1024;
    long survivor = 25 * 1024 * 1024;
    // maxDirectMemory = xmx - survivor
    Assert.assertEquals(xmx - survivor, VM.maxDirectMemory());
}
```

#### DirectByteBuffer

```java
DirectByteBuffer(int cap) {
    // mark, position, limit, capacity
    super(-1, 0, cap, cap);
    // 直接内存分配是否按页对齐
    boolean pa = VM.isDirectMemoryPageAligned();
    // 页大小
    int ps = java.nio.Bits.pageSize();
    // 分配内存的大小, 如果按页对齐, 要加上一页大小
    long size = Math.max(1L, (long) cap + (pa ? ps : 0));
    // 申请分配内存
    java.nio.Bits.reserveMemory(size, cap);

    long base = 0;
    try {
        // 真正分配内存, 返回内存基地址
        base = unsafe.allocateMemory(size);
    } catch (OutOfMemoryError x) {
        // 内存分配失败, 释放内存
        java.nio.Bits.unreserveMemory(size, cap);
        throw x;
    }
    // 初始化直接内存的数据为0
    unsafe.setMemory(base, size, (byte) 0);
    if (pa && (base % ps != 0)) {
        // 按页对齐方式, 基地址按页对齐
        address = base + ps - (base & (ps - 1));
    } else {
        address = base;
    }
    // Cleaner释放内存
    cleaner = Cleaner.create(this, new Deallocator(base, size, cap));
    att = null;
}
```

***java.nio.Bits: 直接内存管理***

```java
class Bits {

    // 直接内存最大值, 由-XX:MaxDirectMemorySize指定
    private static volatile long maxMemory = VM.maxDirectMemory();
    // 直接内存占用内存大小
    private static volatile long reservedMemory;
    // 直接内存使用容量
    private static volatile long totalCapacity;
    // 直接内存使用数
    private static volatile long count;
    // 初始化标记
    private static boolean memoryLimitSet = false;

    /**
     * 分配内存
     */
    static void reserveMemory(long size, int cap) {
        synchronized (Bits.class) {
            if (!memoryLimitSet && VM.isBooted()) {
                // 设置直接内存最大值
                maxMemory = VM.maxDirectMemory();
                memoryLimitSet = true;
            }
            // 直接内存使用容量不超过直接内存最大值, 按页分配时, 真实的内存使用会比maxMemory大
            if (cap <= maxMemory - totalCapacity) {
                // 内存分配成功
                reservedMemory += size;
                totalCapacity += cap;
                count++;
                return;
            }
        }

        // 分配失败

        // gc尝试回收DirectByteBuffer以及关联的堆外内存
        System.gc();
        try {
            // sleep 100毫秒
            Thread.sleep(100);
        } catch (InterruptedException x) {
            Thread.currentThread().interrupt();
        }
        synchronized (Bits.class) {
            // 重新分配
            if (totalCapacity + cap > maxMemory) {
                // 重新分配失败, 抛出OutOfMemoryError
                throw new OutOfMemoryError("Direct buffer memory");
            }
            // 重新分配成功
            reservedMemory += size;
            totalCapacity += cap;
            count++;
        }
    }

    /**
     * 回收内存
     */
    static synchronized void unreserveMemory(long size, int cap) {
        if (reservedMemory > 0) {
            reservedMemory -= size;
            totalCapacity -= cap;
            count--;
            assert (reservedMemory > -1);
        }
    }

}
```
