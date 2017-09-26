---
layout: topic
module: HotSpot
title:  对象创建分析
date:   2017-09-26
---

#### new Object()

```java
Object obj = new Object();
```

```java
0: new           #2                  // class java/lang/Object
3: dup
4: invokespecial #1                  // Method java/lang/Object."<init>":()V
7: astore_1
```

```c
CASE(_new): {
    // 常量池下标
    u2 index = Bytes::get_Java_u2(pc + 1);
    // 常量池
    ConstantPool *constants = istate->method()->constants();
    // 查找常量池标签, 查看类是否已被解析
    if (!constants->tag_at(index).is_unresolved_klass()) {
        // 获取常量池下标对应的Class
        Klass *entry = constants->slot_at(index).get_klass();
        Klass *k_entry = (Klass *) entry;
        // 转型为InstanceKlass
        InstanceKlass *ik = (InstanceKlass *) k_entry;
        // 如果类已被初始化, 且可以被快速分配(f类、接口和抽象类、java/lang/Class除外)
        if (ik->is_initialized() && ik->can_be_fastpath_allocated()) {
            // 分配的对象内存大小(oop的大小)
            size_t obj_size = ik->size_helper();
            oop result = NULL;
            // TLAB分配时是否初始化内存空间为0
            bool need_zero = !ZeroTLAB;
            if (UseTLAB) {
                // TLAB分配
                result = (oop) THREAD->tlab().allocate(obj_size);
            }

            if (result == NULL) {
                // TLAB分配失败, 在eden上分配, 要初始化内存空间为0
                need_zero = true;
                retry:
                // eden的top地址
                HeapWord *compare_to = *Universe::heap()->top_addr();
                // 分配内存后新的top地址
                HeapWord *new_top = compare_to + obj_size;
                // 新的top地址不超过eden的最大内存大小
                if (new_top <= *Universe::heap()->end_addr()) {
                    // CAS方式分配内存
                    if (Atomic::cmpxchg_ptr(new_top, Universe::heap()->top_addr(), compare_to) != compare_to) {
                        // CAS失败, 重试
                        goto retry;
                    }
                    // 内存分配成功, 返回对象的基地址
                    result = (oop) compare_to;
                }
            }

            // 对象内存分配成功
            if (result != NULL) {
                // 内存空间初始化为0
                if (need_zero) {
                    // Java对象的基地址
                    HeapWord *to_zero = (HeapWord *) result + sizeof(oopDesc) / oopSize;
                    // Java对象的大小
                    obj_size -= sizeof(oopDesc) / oopSize;
                    if (obj_size > 0) {
                        // 对象内存空间初始化为0
                        memset(to_zero, 0, obj_size * HeapWordSize);
                    }
                }
                // 是否启用偏向锁
                if (UseBiasedLocking) {
                    result->set_mark(ik->prototype_header());
                } else {
                    result->set_mark(markOopDesc::prototype());
                }
                result->set_klass_gap(0);
                // Klass指针
                result->set_klass(k_entry);
                // 插入内存屏障
                OrderAccess::storestore();
                // 对象引用入栈
                SET_STACK_OBJECT(result, 0);
                // 更新PC继续下一条指令
                UPDATE_PC_AND_TOS_AND_CONTINUE(3, 1);
            }
        }
    }

    // 缓慢分配
    CALL_VM(InterpreterRuntime::_new(THREAD, METHOD->constants(), index), handle_exception);
    // 插入内存屏障
    OrderAccess::storestore();
    // 对象引用入栈
    SET_STACK_OBJECT(THREAD->vm_result(), 0);
    THREAD->set_vm_result(NULL);
    // 更新PC继续下一条指令
    UPDATE_PC_AND_TOS_AND_CONTINUE(3, 1);
}
```

```c
IRT_ENTRY(void, InterpreterRuntime::_new(JavaThread* thread, ConstantPool* pool, int index))
    Klass* k_oop = pool->klass_at(index, CHECK);
    instanceKlassHandle klass (THREAD, k_oop);
    klass->check_valid_for_instantiation(true, CHECK);
    klass->initialize(CHECK);
    oop obj = klass->allocate_instance(CHECK);
    thread->set_vm_result(obj);
IRT_END
```

```c
void InstanceKlass::initialize(TRAPS) {
    // 是否要初始化
    if (this->should_be_initialized()) {
        HandleMark hm(THREAD);
        instanceKlassHandle this_oop(THREAD, this);
        initialize_impl(this_oop, CHECK);
    }
}
```

```c
instanceOop InstanceKlass::allocate_instance(TRAPS) {
    // 是否f类
    bool has_finalizer_flag = has_finalizer();
    // 实例大小
    int size = size_helper();
    KlassHandle h_k(THREAD, this);
    // 对象
    instanceOop i;
    // 堆分配内存
    i = (instanceOop) CollectedHeap::obj_allocate(h_k, size, CHECK_NULL);
    // 是f类且开启-XX:+RegisterFinalizersAtInit
    if (has_finalizer_flag && !RegisterFinalizersAtInit) {
        i = register_finalizer(i, CHECK_NULL);
    }
    return i;
}
```

#### Object.clone()

#### Class.newInstance()

#### Constructor.newInstance()
