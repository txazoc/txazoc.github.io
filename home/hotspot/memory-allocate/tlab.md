---
layout: home
title:  TLAB
date:   2017-09-27
---

> TLAB，线程本地分配缓冲区

#### ThreadLocalAllocBuffer

```c
class ThreadLocalAllocBuffer : public CHeapObj<mtThread> {

  private:

    HeapWord *_start;                       // 开始地址
    HeapWord *_top;                         // 上次分配后的地址
    HeapWord *_end;                         // 结束地址(不包括对齐保留的内存空间)

  public:

    HeapWord *top() const { return _top; }

    HeapWord *end() const { return _end; }

    void set_top(HeapWord *top) { _top = top; }

};
```

#### 内存分配

```c
inline HeapWord *ThreadLocalAllocBuffer::allocate(size_t size) {
    // top地址
    HeapWord *obj = top();
    // 检查剩余空间是否满足分配
    if (pointer_delta(end(), obj) >= size) {
        // 分配成功, 更新top地址
        set_top(obj + size);
        return obj;
    }
    return NULL;
}

inline size_t pointer_delta(const HeapWord *left, const HeapWord *right) {
    return pointer_delta(left, right, sizeof(HeapWord));
}

/**
 * 计算剩余可分配的元素个数
 */
inline size_t pointer_delta(
        const void *left,       // 高位地址
        const void *right,      // 低位地址
        size_t element_size     // 元素字节长度
) {
    return (((uintptr_t) left) - ((uintptr_t) right)) / element_size;
}
```
