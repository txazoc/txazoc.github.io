---
layout: topic
module: Java
title:  Volatile
tags:   [java, 并发]
date:   2017-01-08
---

`volatile`，保证共享变量的可见性

***什么是可见性?***

`可见性`的含义是一个线程修改了一个共享变量，其它线程能立马读到该共享变量最新修改的值

***可见性的问题是怎么产生的呢?***

#### 编译器重排序

#### 指令重排序

#### 编译屏障

编译器屏障: 禁止编译器的乱序优化

```c
__asm__ volatile ("" : : : "memory")
```

* `__asm__`: 汇编代码开始
* `volatile`: 禁止编译器优化代码

#### volatile写

```c
// hotspot/src/share/vm/interpreter/bytecodeInterpreter.cpp
#define CASE(opcode) opc ## opcode

switch (opcode) {
    CASE(_putfield):
    {
        int field_offset = cache->f2_as_index();
        if (cache->is_volatile()) {
            if (tos_type == itos) {
                obj->release_int_field_put(field_offset, STACK_INT(-1));
            }
            OrderAccess::storeload();
        }
    }
}

// hotspot/src/share/vm/oops/oop.inline.hpp
inline void oopDesc::release_int_field_put(int offset, jint contents) {
    OrderAccess::release_store(int_field_addr(offset), contents);
}

// hotspot/src/os_cpu/solaris_x86/vm/orderAccess_solaris_x86.inline.hpp
inline void OrderAccess::release_store(volatile jint *p, jint v) {
    *p = v;
}
```

```c
// hotspot/src/os_cpu/solaris_x86/vm/orderAccess_solaris_x86.inline.hpp
inline void OrderAccess::storeload() {
    fence();
}

inline void OrderAccess::fence() {
    if (os::is_MP()) {
        _OrderAccess_fence();
    }
}

extern "C" {
    inline void _OrderAccess_fence() {
        __asm__ volatile ("lock; addl $0,0(%%esp)" : : : "cc", "memory");
    }
}
```

#### volatile读

```c
// hotspot/src/share/vm/interpreter/bytecodeInterpreter.cpp
#define CASE(opcode) opc ## opcode

switch (opcode) {
    CASE(_getfield):
    {
        int field_offset = cache->f2_as_index();
        if (cache->is_volatile()) {
            if (support_IRIW_for_not_multiple_copy_atomic_cpu) {
                OrderAccess::fence();
            }
            if (tos_type == itos) {
                SET_STACK_INT(obj->int_field_acquire(field_offset), -1);
            }
        }
    }
}

// hotspot/src/share/vm/oops/oop.inline.hpp
inline jint oopDesc::int_field_acquire(int offset) const {
    return OrderAccess::load_acquire(int_field_addr(offset));
}

// hotspot/src/os_cpu/solaris_x86/vm/orderAccess_solaris_x86.inline.hpp
inline jint OrderAccess::load_acquire(volatile jint *p) {
    return *p;
}
```
