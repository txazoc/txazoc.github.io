---
layout: home
title:  新生代
date:   2017-09-27
---

#### 新生代内存空间

```c
/**
 * 内存空间: bottom() <= top() <= end()
 */
class Space : public CHeapObj<mtGC> {

  protected:

    HeapWord *_bottom;      // 内存空间开始地址
    HeapWord *_end;         // 内存空间结束地址

};

/**
 * 压缩空间
 */
class CompactibleSpace : public Space {

};

/**
 * 连续空间: from空间和to空间
 */
class ContiguousSpace : public CompactibleSpace {

  protected:

    HeapWord *_top;         // 上次分配后的地址

};

/**
 * Eden空间
 */
class EdenSpace : public ContiguousSpace {

  private:

    DefNewGeneration *_gen;     // 新生代

};
```
