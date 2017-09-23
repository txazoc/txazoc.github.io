---
layout: map
title:  I/O
---

#### 相关

* [DirectByteBuffer](/topic/java/nio/direct-byte-buffer.html)

#### 传统的文件I/O

* 用户态
* 内核态
    * I/O缓冲区
        * 预读
        * 局部性原理
        * 减少磁盘I/O次数

#### Buffered缓冲流

* I/O缓冲区
    * 预读
    * 局部性原理
    * 减少系统调用次数

#### 内存映射文件

* 直接内存 - `映射`  - 文件
* 适合对大文件的操作
