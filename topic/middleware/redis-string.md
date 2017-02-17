---
layout: topic
module: 中间件
title:  Redis-String
date:   2016-12-10
---

`sds.h`

```c
#define SDS_TYPE_5  0
#define SDS_TYPE_8  1
#define SDS_TYPE_16 2
#define SDS_TYPE_32 3
#define SDS_TYPE_64 4

// SDS结构体
struct __attribute__ ((__packed__)) sdshdr8 {
    // 已使用长度(1字节)
    uint8_t len;
    // 申请的长度(1字节)
    uint8_t alloc;
    // 类型标记
    unsigned char flags;
    // 字符串
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr16 {
    uint16_t len;
    uint16_t alloc;
    unsigned char flags;
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr32 {
    uint32_t len;
    uint32_t alloc;
    unsigned char flags;
    char buf[];
};
struct __attribute__ ((__packed__)) sdshdr64 {
    uint64_t len;
    uint64_t alloc;
    unsigned char flags;
    char buf[];
};
```

SDS按长度划分为sdshdr8、sdshdr16、sdshdr32、sdshdr64

![SDS](/images/topic/middleware/redis/string.png =480x)
