---
layout: topic
module: HotSpot
title: 并发实现
---

#### volatile

* volatile读/Unsafe.getVolatile
    * 等待总线锁或缓存行锁释放，直接读
* volatile写/Unsafe.putVolatile

```c
inline void _OrderAccess_fence() {
    __asm__ volatile ("lock; addl $0,0(%%esp)" : : : "cc", "memory");
}
```

汇编指令解释:

* volatile
* lock
* cc
* memory

lock指令包含的功能:

* 锁总线或锁缓存行
* 写操作刷新到内存，其它CPU相应的缓存行失效

#### CAS

```c
// 多核系统为lock, 保证多核同步
#define LOCK_IF_MP(mp) "cmp $0, " #mp "; je 1f; lock; 1: "

/**
 * exchange_value   替换值
 * dest             地址
 * compare_value    预期值
 */
inline jint _Atomic_cmpxchg(jint exchange_value, volatile jint *dest, jint compare_value) {
    // 是否为多核
    int mp = (int) os::is_MP()
    __asm__ volatile (LOCK_IF_MP(%4) "cmpxchgl %1,(%3)"
        : "=a" (exchange_value)
        : "r" (exchange_value), "a" (compare_value), "r" (dest), "r" (mp)
        : "cc", "memory");
    return exchange_value;
}
```

* lock
* cmpxchgl
* cc
* memory

CAS = lock + cmpxchgl + 缓存一致性协议 + memory + volatile读

#### synchronized

* monitorenter
* monitorexit
