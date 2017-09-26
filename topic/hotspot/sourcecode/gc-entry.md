---
layout: topic
module: HotSpot
title:  GC入口分析
date:   2017-09-25
---

[https://yq.aliyun.com/articles/2949](https://yq.aliyun.com/articles/2949)

#### System.gc()

```java
public static void gc() {
    Runtime.getRuntime().gc();
}
```

```c
JVM_ENTRY_NO_ENV(void, JVM_GC(void))
    // -XX:DisableExplicitGC
    if (!DisableExplicitGC) {
        Universe::heap()->collect(GCCause::_java_lang_system_gc);
    }
JVM_END
```

分代堆回收:

```c
void GenCollectedHeap::collect(
        GCCause::Cause cause    // 记录GC来源
) {
    if (should_do_concurrent_full_gc(cause)) {
        // 并行gc
        collect_mostly_concurrent(cause);
    } else if (cause == GCCause::_wb_young_gc) {
        // 可以不管
        collect(cause, 0);
    } else {
        if (cause == GCCause::_scavenge_alot) {
            // 可以不管
            collect(cause, 0);
        } else {
            // STW Full GC
            collect(cause, n_gens() - 1);
        }
    }
}
```

```c
/**
 * 并行回收满足的条件
 */
bool GenCollectedHeap::should_do_concurrent_full_gc(GCCause::Cause cause) {
    // CMS收集器
    return UseConcMarkSweepGC &&
           ((cause == GCCause::_gc_locker && GCLockerInvokesConcurrent) ||
            // System.gc() 且 -XX:+ExplicitGCInvokesConcurrent
            (cause == GCCause::_java_lang_system_gc && ExplicitGCInvokesConcurrent));
}
```

```c
/**
 * 并行gc
 */
void GenCollectedHeap::collect_mostly_concurrent(GCCause::Cause cause) {
    MutexLocker ml(Heap_lock);
    // full gc总数
    unsigned int full_gc_count_before = total_full_collections();
    // gc总数
    unsigned int gc_count_before = total_collections();
    {
        MutexUnlocker mu(Heap_lock);
        VM_GenCollectFullConcurrent op(gc_count_before, full_gc_count_before, cause);
        VMThread::execute(&op);
    }
}
```
