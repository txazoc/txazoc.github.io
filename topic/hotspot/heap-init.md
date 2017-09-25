---
layout: topic
module: HotSpot
title:  堆初始化
date:   2017-09-25
---

#### 堆初始化入口

```c
jint universe_init() {
    jint status = Universe::initialize_heap();
    if (status != JNI_OK) {
        return status;
    }
}
```

* (1). 选择堆类型

```c
/**
 * 有三种堆类型可选择
 *
 * 1) ParallelScavengeHeap
 *        -XX:+UseParallelGC
 * 2) G1CollectedHeap: G1堆
 *        -XX:+UseG1GC
 * 3) GenCollectedHeap: 分代堆, 默认堆类型
 */
if (UseParallelGC) {
    // -XX:UseParallelGC
    Universe::_collectedHeap = new ParallelScavengeHeap();
} else if (UseG1GC) {
    // -XX:UseG1GC
    G1CollectorPolicyExt *g1p = new G1CollectorPolicyExt();
    g1p->initialize_all();
    Universe::_collectedHeap = new G1CollectedHeap(g1p);
} else {
    GenCollectorPolicy *gc_policy;
    if (UseSerialGC) {
        // -XX:UseSerialGC
        gc_policy = new MarkSweepPolicy();
    } else if (UseConcMarkSweepGC) {
        // -XX:UseConcMarkSweepGC
        if (UseAdaptiveSizePolicy) {
            // -XX:UseAdaptiveSizePolicy
            gc_policy = new ASConcurrentMarkSweepPolicy();
        } else {
            gc_policy = new ConcurrentMarkSweepPolicy();
        }
    } else {
        // 默认收集器策略
        gc_policy = new MarkSweepPolicy();
    }
    gc_policy->initialize_all();
    Universe::_collectedHeap = new GenCollectedHeap(gc_policy);
}
```

堆类型划分如下:

```c
/**
 *  CollectedHeap                   垃圾收集堆
 *      SharedHeap                  SharedHeap
 *          GenCollectedHeap        分代收集堆
 *          G1CollectedHeap         G1堆
 *      ParallelScavengeHeap        并行清除堆
 */
class CollectedHeap {
    enum Name {
        Abstract,
        SharedHeap,
        GenCollectedHeap,
        ParallelScavengeHeap,
        G1CollectedHeap
    };
};
```

* (2). 分代堆: 选择收集器策略

收集器策略划分如下:

```c
/**
 *  CollectorPolicy                                 收集器策略
 *      GenCollectorPolicy                          分代收集器策略
 *          TwoGenerationCollectorPolicy            两代收集器策略
 *              MarkSweepPolicy                     标记清除收集器策略
 *              ConcurrentMarkSweepPolicy           CMS收集器策略
 *                  ASConcurrentMarkSweepPolicy     自适应大小CMS收集器策略
 *      G1CollectorPolicy                           G1收集器策略
 *          G1CollectorPolicyExt
 */
class CollectorPolicy {
    enum Name {
        CollectorPolicyKind,
        TwoGenerationCollectorPolicyKind,
        ConcurrentMarkSweepPolicyKind,
        ASConcurrentMarkSweepPolicyKind,
        G1CollectorPolicyKind
    };
};
```

再回到上面的代码，可以看到:

```c
/*
 * ConcurrentMarkSweepPolicy: -XX:+UseConcMarkSweepGC:
 * MarkSweepPolicy: 默认的分代收集器策略
 */
```

* (3). 分代堆的分代收集器策略初始化

```c
virtual void initialize_all() {
    CollectorPolicy::initialize_all();
    initialize_generations();
}

virtual void initialize_all() {
    // 初始化堆对齐
    initialize_alignments();
    /**
     * 堆内存大小校验和设置
     *
     * _min_heap_byte_size      最小堆大小
     * _initial_heap_byte_size  初始堆大小
     * _max_heap_byte_size      最大堆大小
     * _min_gen0_size           最小新生代
     * _initial_gen0_size       初始新生代
     * _max_gen0_size           最大新生代
     */
    initialize_flags();
    /**
     * 调整新生代和老年代大小
     */
    initialize_size_info();
}

/**
 * 标记清除收集器策略: 新生代(Serial、ParNew) + 老年代(Serial Old)
 */
void MarkSweepPolicy::initialize_generations() {
    _generations = NEW_C_HEAP_ARRAY3(GenerationSpecPtr, number_of_generations(), mtGC, CURRENT_PC, AllocFailStrategy::RETURN_NULL);
    if (UseParNewGC) {
        // 新生代ParNew收集器
        _generations[0] = new GenerationSpec(Generation::ParNew, _initial_gen0_size, _max_gen0_size);
    } else {
        // 新生代Serial收集器
        _generations[0] = new GenerationSpec(Generation::DefNew, _initial_gen0_size, _max_gen0_size);
    }
    // 老年代Serial Old收集器
    _generations[1] = new GenerationSpec(Generation::MarkSweepCompact, _initial_gen1_size, _max_gen1_size);
}

/**
 * CMS收集器策略: 新生代(Serial、ParNew) + 老年代(CMS)
 */
void ConcurrentMarkSweepPolicy::initialize_generations() {
    _generations = NEW_C_HEAP_ARRAY3(GenerationSpecPtr, number_of_generations(), mtGC, CURRENT_PC, AllocFailStrategy::RETURN_NULL);
    if (UseParNewGC) {
        // 新生代ParNew收集器
        if (UseAdaptiveSizePolicy) {
            _generations[0] = new GenerationSpec(Generation::ASParNew, _initial_gen0_size, _max_gen0_size);
        } else {
            _generations[0] = new GenerationSpec(Generation::ParNew, _initial_gen0_size, _max_gen0_size);
        }
    } else {
        // 新生代Serial收集器
        _generations[0] = new GenerationSpec(Generation::DefNew, _initial_gen0_size, _max_gen0_size);
    }
    // 老年代CMS收集器
    if (UseAdaptiveSizePolicy) {
        _generations[1] = new GenerationSpec(Generation::ASConcurrentMarkSweep, _initial_gen1_size, _max_gen1_size);
    } else {
        _generations[1] = new GenerationSpec(Generation::ConcurrentMarkSweep, _initial_gen1_size, _max_gen1_size);
    }
}
```

* (4). 设置TLAB的最大大小

```c
ThreadLocalAllocBuffer::set_max_size(Universe::heap()->max_tlab_size());
```

* (5). 堆初始化: 下面只关注分代堆

```c
jint status = Universe::heap()->initialize();
if (status != JNI_OK) {
    return status;
}
```

* (6). 初始化TLAB

```c
if (UseTLAB) {
    ThreadLocalAllocBuffer::startup_initialization();
}

void ThreadLocalAllocBuffer::startup_initialization() {
// -XX:TLABWasteTargetPercent=1, TLAB可占用eden空间的百分比
_target_refills = 100 / (2 * TLABWasteTargetPercent);
_target_refills = MAX2(_target_refills, (unsigned) 1U);

// 全局TLAB统计
_global_stats = new GlobalTLABStats();

// 重新初始化main线程的TLAB
Thread::current()->tlab().initialize();
}
```

#### 分代堆初始化

* (1). 预初始化: 可以不关注

```c
CollectedHeap::pre_initialize();
```

* (2). 分代数量

```c
_n_gens = gen_policy()->number_of_generations();
```

```c
/**
 * 两代收集器策略(新生代 + 老年代)
 */
class TwoGenerationCollectorPolicy {

    int number_of_generations() {
        return 2;
    }

};
```

* (3). 堆中分代内存对齐

```c
// 64k或128k
GenGrain = 1 << (16 ARM32_ONLY(+ 1));

size_t gen_alignment = Generation::GenGrain;
// GenerationSpec
_gen_specs = gen_policy()->generations();
for (i = 0; i < _n_gens; i++) {
    _gen_specs[i]->align(gen_alignment);
}

void align(size_t alignment) {
    set_init_size(align_size_up(init_size(), alignment));
    set_max_size(align_size_up(max_size(), alignment));
}
```

* (4). 申请分配堆内存

```c
char *heap_address;
size_t total_reserved = 0;
int n_covered_regions = 0;
ReservedSpace heap_rs;
heap_address = allocate(heap_alignment, &total_reserved, &n_covered_regions, &heap_rs);

// 分配失败, 退出虚拟机
if (!heap_rs.is_reserved()) {
    vm_shutdown_during_initialization("Could not reserve enough space for object heap");
    return JNI_ENOMEM;
}

char *GenCollectedHeap::allocate(
        size_t alignment,           // 堆内存对齐大小
        size_t *_total_reserved,    // 总预留内存大小
        int *_n_covered_regions,    // 堆内存覆盖的区域数量
        ReservedSpace *heap_rs)     // 堆预留内存空间
{
    size_t total_reserved = 0;
    int n_covered_regions = 0;

    for (int i = 0; i < _n_gens; i++) {
        // 总预留内存大小 = 各分代最大堆内存之和
        total_reserved += _gen_specs[i]->max_size();
        n_covered_regions += _gen_specs[i]->n_covered_regions();
    }

    n_covered_regions += 2;

    *_total_reserved = total_reserved;
    *_n_covered_regions = n_covered_regions;

    *heap_rs = Universe::reserve_heap(total_reserved, alignment);
    return heap_rs->base();
}

ReservedSpace Universe::reserve_heap(size_t heap_size, size_t alignment) {
    // 对齐后的总预留内存大小
    size_t total_reserved = align_size_up(heap_size, alignment);
    // 是否开启大内存分页, -XX:+UseLargePages
    bool use_large_pages = UseLargePages && is_size_aligned(alignment, os::large_page_size());

    // 基地址
    char *addr = Universe::preferred_heap_base(total_reserved, alignment, Universe::UnscaledNarrowOop);
    ReservedHeapSpace total_rs(total_reserved, alignment, use_large_pages, addr);

    // 开启指针压缩, -XX:+UseCompressedOops
    if (UseCompressedOops) {
        if (addr != NULL && !total_rs.is_reserved()) {
            addr = Universe::preferred_heap_base(total_reserved, alignment, Universe::ZeroBasedNarrowOop);
            ReservedHeapSpace total_rs0(total_reserved, alignment, use_large_pages, addr);
            if (addr != NULL && !total_rs0.is_reserved()) {
                addr = Universe::preferred_heap_base(total_reserved, alignment, Universe::HeapBasedNarrowOop);
                ReservedHeapSpace total_rs1(total_reserved, alignment, use_large_pages, addr);
                total_rs = total_rs1;
            } else {
                total_rs = total_rs0;
            }
        }
    }

    if (!total_rs.is_reserved()) {
        // 退出虚拟机
        return total_rs;
    }

    if (UseCompressedOops) {
        address base = (address)(total_rs.base() - os::vm_page_size());
        Universe::set_narrow_oop_base(base);
    }
    return total_rs;
}
```

* (5). 初始化各分代

```c
_gch = this;

for (i = 0; i < _n_gens; i++) {
    ReservedSpace this_rs = heap_rs.first_part(_gen_specs[i]->max_size(), false, false);
    // 初始化各分代
    _gens[i] = _gen_specs[i]->init(this_rs, i, rem_set());
    heap_rs = heap_rs.last_part(_gen_specs[i]->max_size());
}

Generation *GenerationSpec::init(ReservedSpace rs, int level, GenRemSet *remset) {
    switch (name()) {
        // Serial收集器
        case Generation::DefNew:
            return new DefNewGeneration(rs, init_size(), level);

            // Serial Old收集器
        case Generation::MarkSweepCompact:
            return new TenuredGeneration(rs, init_size(), level, remset);

            // ParNew收集器
        case Generation::ParNew:
            return new ParNewGeneration(rs, init_size(), level);

            // 自适应大小ParNew收集器
        case Generation::ASParNew:
            return new ASParNewGeneration(rs, init_size(), init_size(), level);

            // CMS收集器
        case Generation::ConcurrentMarkSweep: {
            CardTableRS *ctrs = remset->as_CardTableRS();
            ConcurrentMarkSweepGeneration *g = NULL;
            g = new ConcurrentMarkSweepGeneration(rs, init_size(), level, ctrs, UseCMSAdaptiveFreeLists, (FreeBlockDictionary<FreeChunk>::DictionaryChoice) CMSDictionaryChoice);
            g->initialize_performance_counters();
            return g;
        }

            // 自适应大小CMS收集器
        case Generation::ASConcurrentMarkSweep: {
            CardTableRS *ctrs = remset->as_CardTableRS();
            ASConcurrentMarkSweepGeneration *g = NULL;
            g = new ASConcurrentMarkSweepGeneration(rs, init_size(), level, ctrs, UseCMSAdaptiveFreeLists, (FreeBlockDictionary<FreeChunk>::DictionaryChoice) CMSDictionaryChoice);
            g->initialize_performance_counters();
            return g;
        }
        default:
            return NULL;
    }
}
```

* (6). 创建CMS收集器

```c
if (collector_policy()->is_concurrent_mark_sweep_policy()) {
    bool success = create_cms_collector();
    if (!success) {
        return JNI_ENOMEM;
    }
}
```
