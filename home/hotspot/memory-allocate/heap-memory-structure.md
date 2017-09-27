---
layout: home
title:  堆内存结构
date:   2017-09-26
---

> HeapWord，堆内存的最小单元，堆中的通用指针，也是堆中对象大小的基本单位

```c
/**
 * 堆字
 */
class HeapWord {
  private:
    char *i;
  public:
    char *value() {
        return i;
    }
};

/**
 * 堆字长: C中指针的长度, HeapWordSize = 2^LogHeapWordSize
 *
 * 1) 32位: HeapWordSize = 4
 * 2) 64位: HeapWordSize = 8
 */
const int HeapWordSize = sizeof(HeapWord);
#ifdef _LP64
const int LogHeapWordSize = 3;
#else
const int LogHeapWordSize = 2;
#endif
```
