---
layout: homelist
title: A
date: 2017-09-26
---

#### CPU

* CPU
    * 多核
* 线程
    * 多线程
* 程序
    * 同步
        * 方法
        * RPC
    * 异步
        * 线程
        * 消息
* 虚拟机栈
    * 栈帧
        * 操作数栈
        * 局部变量表
        * 返回地址
* 虚拟机执行
    * 解释执行: 字节码 -&gt; 机器码
    * 编译执行: 机器码

#### I/O

* 狭义I/O
    * 磁盘I/O: 文件
    * 网络I/O: Socket
* 广义I/O: 读写数据
    * 硬件
        * CPU寄存器
        * CPU高速缓存L1
        * CPU高速缓存L2
        * CPU高速缓存L3
        * 内存
        * 本地磁盘
        * 远程存储
    * 用户
        * 前端缓存
        * CDN
        * 反向代理缓存
        * 应用程序缓存
        * 分布式缓存
* NIO
    * Channel Buffer Selector
    * 内存映射文件

#### 内存

* 内存结构
    * 堆内存
        * 新生代
            * Eden
            * Survivor
                * from
                * to
        * 老年代
        * 持久代: JDK7及之前
        * Metaspace: JDK8
    * 栈内存
    * 直接内存: DirectByteBuffer
* 内存分配
    * 新生代: 优先分配
        * TLAB
        * Eden: 指针碰撞
    * 老年代
        * CMS: 空闲列表
        * 非CMS: 指针碰撞
        * 对象进入条件
            * 大对象
            * 长期存活对象晋级
            * 空间分配担保: Minor GC后Survivor空间不足
* 内存回收
* 内存模型
