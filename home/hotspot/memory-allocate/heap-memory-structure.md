---
layout: home
title:  堆内存结构
date:   2017-09-26
---

```c
/**
 * 堆字
 */
class HeapWord {
  private:
    // 基地址
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
