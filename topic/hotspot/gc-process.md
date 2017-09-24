---
layout: topic
module: HotSpot
title:  GC过程
date:   2017-09-24
---

#### gc入口

```c
void GenCollectedHeap::do_collection(
        bool full,                  // 是否full gc
        bool clear_all_soft_refs,   // 是否清除所有软引用
        size_t size,
        bool is_tlab,
        int max_level
);
```

#### gc前处理

* (1). GC锁

```c
if (GC_locker::check_active_before_gc()) {
    return;
}

bool GC_locker::check_active_before_gc() {
    if (is_active() && !_needs_gc) {
        verify_critical_count();
        _needs_gc = true;
    }
    return is_active();
}
```

* (2). 是否清除所有软引用

```c
const bool do_clear_all_soft_refs = clear_all_soft_refs || collector_policy()->should_clear_all_soft_refs();

void CollectorPolicy::cleared_all_soft_refs() {
    /**
     * 当接近gc开销上限时, 开始清除软引用
     * 软引用可能在上一次gc时被清理, 但如果仍接近gc开销上限, 则继续清除软引用
     */
    if (size_policy() != NULL) {
        _should_clear_all_soft_refs = size_policy()->gc_overhead_limit_near();
    }
    _all_soft_refs_clear = true;
}

/**
 * 判断是否接近gc开销上限
 */
bool gc_overhead_limit_near() {
    return gc_overhead_limit_count() >= (AdaptiveSizePolicyGCTimeLimitThreshold - 1);
}
```

* (3). Metaspace使用的内存大小

```c
const size_t metadata_prev_used = MetaspaceAux::used_bytes();

static size_t used_bytes() {
    return used_words() * BytesPerWord;
}

static size_t used_words() {
    // NonClassType + ClassType
    return used_words(Metaspace::NonClassType) + used_words(Metaspace::ClassType);
}

// Metaspace中不同类型元数据占用的空间
static size_t _used_words[Metaspace::MetadataTypeCount];

enum MetadataType {
    ClassType,
    NonClassType,
    MetadataTypeCount
};
```

* (4). gc前打印堆内存

```c
print_heap_before_gc();

void CollectedHeap::print_heap_before_gc() {
    // -XX:PrintHeapAtGC
    if (PrintHeapAtGC) {
        Universe::print_heap_before_gc();
    }
    if (_gc_heap_log != NULL) {
        _gc_heap_log->log_heap_before();
    }
}

void Universe::print_heap_before_gc(outputStream *st, bool ignore_extended) {
    st->print_cr("{Heap before GC invocations=%u (full %u):",
                 heap()->total_collections(),
                 heap()->total_full_collections());
    // -XX:PrintHeapAtGCExtended
    if (!PrintHeapAtGCExtended || ignore_extended) {
        heap()->print_on(st);
    } else {
        heap()->print_extended_on(st);
    }
}

void GenCollectedHeap::print_on(outputStream *st) const {
    for (int i = 0; i < _n_gens; i++) {
        // 打印分代
        _gens[i]->print_on(st);
    }
    // 打印Metaspace
    MetaspaceAux::print_on(st);
}

/**
 * used
 * capacity
 * committed
 * reserved
 */
void MetaspaceAux::print_on(outputStream *out) {
    // NonClassType
    Metaspace::MetadataType nct = Metaspace::NonClassType;
    out->print_cr(" Metaspace       "
            "used "      SIZE_FORMAT "K, "
            "capacity "  SIZE_FORMAT "K, "
            "committed " SIZE_FORMAT "K, "
            "reserved "  SIZE_FORMAT "K",
            used_bytes() / K,
            capacity_bytes() / K,
            committed_bytes() / K,
            reserved_bytes() / K);

    if (Metaspace::using_class_space()) {
        // ClassType
        Metaspace::MetadataType ct = Metaspace::ClassType;
        out->print_cr("  class space    "
                "used "      SIZE_FORMAT "K, "
                "capacity "  SIZE_FORMAT "K, "
                "committed " SIZE_FORMAT "K, "
                "reserved "  SIZE_FORMAT "K",
                used_bytes(ct) / K,
                capacity_bytes(ct) / K,
                committed_bytes(ct) / K,
                reserved_bytes(ct) / K);
    }
}

/**
 * 新生代
 */
void PSYoungGen::print_on(outputStream *st) const {
    st->print(" %-15s", "PSYoungGen");
    // total
    if (PrintGCDetails && Verbose) {
        st->print(" total " SIZE_FORMAT ", used " SIZE_FORMAT,
                capacity_in_bytes(),
                used_in_bytes());
    } else {
        st->print(" total " SIZE_FORMAT "K, used " SIZE_FORMAT "K",
                capacity_in_bytes() / K,
                used_in_bytes() / K);
    }
    virtual_space()->print_space_boundaries_on(st);
    // eden
    st->print("  eden");
    eden_space()->print_on(st);
    // from survivor
    st->print("  from");
    from_space()->print_on(st);
    // to survivor
    st->print("  to  ");
    to_space()->print_on(st);
}

/**
 * 老年代
 */
void PSOldGen::print_on(outputStream *st) const {
    st->print(" %-15s", name());
    if (PrintGCDetails && Verbose) {
        st->print(" total " SIZE_FORMAT ", used " SIZE_FORMAT,
                capacity_in_bytes(),
                used_in_bytes());
    } else {
        st->print(" total " SIZE_FORMAT "K, used " SIZE_FORMAT "K",
                capacity_in_bytes() / K,
                used_in_bytes() / K);
    }
    st->print_cr(" [" INTPTR_FORMAT ", " INTPTR_FORMAT ", " INTPTR_FORMAT ")",
            virtual_space()->low_boundary(),
            virtual_space()->high(),
            virtual_space()->high_boundary());

    st->print("  object");
    object_space()->print_on(st);
}

/**
 * eden、from survivor、to survivor
 */
void MutableSpace::print_on(outputStream *st) const {
    MutableSpace::print_short_on(st);
    st->print_cr(" [" INTPTR_FORMAT "," INTPTR_FORMAT "," INTPTR_FORMAT ")",
            bottom(), top(), end());
}

void MutableSpace::print_short_on(outputStream *st) const {
    st->print(" space " SIZE_FORMAT "K, %d%% used",
            capacity_in_bytes() / K,
            (int) ((double) used_in_bytes() * 100 / capacity_in_bytes()));
}
```

* (5). 

```c
void GenCollectedHeap::gc_prologue(bool full) {
    always_do_update_barrier = false;
    CollectedHeap::accumulate_statistics_all_tlabs();
    ensure_parsability(true);

    GenGCPrologueClosure blk(full);
    generation_iterate(&blk, false);
};
```

* (6). gc计数加1

```c
// 总的gc次数
unsigned int _total_collections;
// 总的full gc次数
unsigned int _total_full_collections;

void increment_total_collections(bool full = false) {
    _total_collections++;
    if (full) {
        increment_total_full_collections();
    }
}

void increment_total_full_collections() {
    _total_full_collections++;
}
```

* (7). 堆内存已使用大小

```c
size_t gch_prev_used = used();

size_t GenCollectedHeap::used() const {
    size_t res = 0;
    // 分代已使用内存大小的和
    for (int i = 0; i < _n_gens; i++) {
        res += _gens[i]->used();
    }
    return res;
}
```

* (8). 确定开始回收的分代

```c
int starting_level = 0;
// 是否full gc
if (full) {
    /**
     * 从最老的分代开始查找, 直到找到会回收所有更年轻分代的分代,
     * 并从此分代开始循环进行回收
     */
    for (int i = max_level; i >= 0; i--) {
        if (_gens[i]->full_collects_younger_generations()) {
            starting_level = i;
            break;
        }
    }
}

// Generation
virtual bool full_collects_younger_generations() const {
    return false;
}

// TenuredGeneration
virtual bool full_collects_younger_generations() const {
    // -XX:CollectGen0First = false
    return !CollectGen0First;
}

// ConcurrentMarkSweepGeneration.hpp
virtual bool full_collects_younger_generations() const {
    // -XX:UseCMSCompactAtFullCollection = true
    return UseCMSCompactAtFullCollection && !CollectGen0First;
}
```

#### 循环分代gc

* (1). 判断分代是否gc

```c
// starting_level到max_level循环
for (int i = starting_level; i <= max_level; i++) {
    // 分代是否gc
    if (_gens[i]->should_collect(full, size, is_tlab)) {
        // 分代gc
    }
}

virtual bool should_collect(bool full, size_t word_size, bool is_tlab) {
    return (full || should_allocate(word_size, is_tlab));
}

bool TenuredGeneration::should_collect(bool full, size_t size, bool is_tlab) {
    bool result = false;
    // full gc, 返回true
    if (!result && full) {
        result = true;
    }
    // 分配内存, 返回true
    if (!result && should_allocate(size, is_tlab)) {
        result = true;
    }
    // 空闲内存小于10000k, 返回true
    if (!result && free() < 10000) {
        result = true;
    }
    // 要扩容以容纳年轻代晋升的对象, 返回true
    if (!result && _capacity_at_prologue < capacity()) {
        result = true;
    }
    return result;
}

/**
 * 是否分配内存
 */
virtual bool should_allocate(size_t word_size, bool is_tlab) {
    bool result = false;
    // 溢出大小
    size_t overflow_limit = (size_t) 1 << (BitsPerSize_t - LogHeapWordSize);
    if (!is_tlab || supports_tlab_allocation()) {
        result = (word_size > 0) && (word_size < overflow_limit);
    }
    return result;
}

/**
 * 是否支持TLAB分配
 *
 * DefNewGeneration: true
 * ParallelScavengeHeap: true
 * G1CollectedHeap: true
 */
bool supports_tlab_allocation() {
    return false;
}
```

* (2). Major GC处理

```c
if (i == n_gens() - 1) {
    // 当前gc为Major GC
    if (!complete) {
        // 修正full gc计数
        increment_total_full_collections();
    }
    // full gc前dump
    pre_full_gc_dump(NULL);
}

void CollectedHeap::pre_full_gc_dump(GCTimer *timer) {
    // 是否在full gc前dump堆内存, -XX:HeapDumpBeforeFullGC = false
    if (HeapDumpBeforeFullGC) {
        // dump堆内存
        HeapDumper::dump_heap();
    }
    // 是否在full gc前打印类柱状图, -XX:PrintClassHistogramBeforeFullGC = false
    if (PrintClassHistogramBeforeFullGC) {
        VM_GC_HeapInspection inspector(gclog_or_tty, false);
        inspector.doit();
    }
}

void HeapDumper::dump_heap(bool oome) {
    /**
     * dump路径
     *
     * 默认为: 当前工作目录/java_pid<pid>.hprof
     * 可使用-XX:HeapDumpPath=<file>自定义
     */

    HeapDumper dumper(false, true, oome);
    // dump
    dumper.dump(my_path);
}
```

* (3). gc前统计记录

```c
// 当前分代堆内存使用大小
size_t prev_used = _gens[i]->used();
// 统计记录: 调用次数加1
_gens[i]->stat_record()->invocations++;
// 统计记录: 累积时间start
_gens[i]->stat_record()->accumulated_time.start();
```

* (4). gc前记录分代堆内存top地址，必须在每次gc前完成, 因为前一次gc可能改变了某些空间的top地址

```c
record_gen_tops_before_GC();

void GenCollectedHeap::record_gen_tops_before_GC() {
    // -XX:ZapUnusedHeapArea = trueInDebug
    if (ZapUnusedHeapArea) {
        GenGCSaveTopsBeforeGCClosure blk;
        generation_iterate(&blk, false);
    }
}

class GenGCSaveTopsBeforeGCClosure : public GenCollectedHeap::GenClosure {
private:
public:
    void do_generation(Generation *gen) {
        gen->record_spaces_top();
    }
};

// ParallelScavengeHeap
void ParallelScavengeHeap::record_gen_tops_before_GC() {
    if (ZapUnusedHeapArea) {
        young_gen()->record_spaces_top();
        old_gen()->record_spaces_top();
    }
}

void OneContigSpaceCardGeneration::record_spaces_top() {
    the_space()->set_top_for_allocations();
}

void SpaceMangler::set_top_for_allocations(HeapWord *v) {
    _top_for_allocations = v;
}
```
