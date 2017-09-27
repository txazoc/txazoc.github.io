---
layout: home
title:  新生代内存分配
date:   2017-09-27
---

```c
/**
 * 并发分配
 */
inline HeapWord *ContiguousSpace::par_allocate_impl(
        size_t size,                    // 分配内存大小
        HeapWord *const end_value       // end()
) {
    do {
        // top地址
        HeapWord *obj = top();
        // 检查剩余空间是否满足分配
        if (pointer_delta(end_value, obj) >= size) {
            // 剩余空间满足分配
            HeapWord *new_top = obj + size;
            // CAS尝试更新top地址
            HeapWord *result = (HeapWord *) Atomic::cmpxchg_ptr(new_top, top_addr(), obj);
            if (result == obj) {
                // 分配成功, 返回分配到的基地址
                return obj;
            }
            // 分配失败, 重试
        } else {
            // 剩余空间不满足分配, 返回NULL
            return NULL;
        }
    } while (true);
}
```

```c
/**
 * 是否尝试老年代内存分配
 *
 * 1) 准备gc
 * 2) eden剩余空间不满足分配
 * 3) 最近一次的增量收集失败
 */
bool GenCollectorPolicy::should_try_older_generation_allocation(
        size_t word_size
) const {
    // 分代堆
    GenCollectedHeap *gch = GenCollectedHeap::heap();
    // 新生代eden容量
    size_t gen0_capacity = gch->get_gen(0)->capacity_before_gc();
    return (word_size > heap_word_size(gen0_capacity))
           || GC_locker::is_active_and_needs_gc()
           || gch->incremental_collection_failed();
}
```
