---
layout: topic
module: Linux
title:  内存映射
date:   2017-02-14
---

内存映射，文件映射到内存，物理地址映射到进程的虚拟地址空间，加快读写效率

```c
void *mmap(void *addr, size_t len, int prot, int flags, int fd, off_t offset);
```
