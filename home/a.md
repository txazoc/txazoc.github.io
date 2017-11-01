---
layout: homelist
title: A
date: 2017-09-26
---

* getrestaurantsbygrouponproductid          (getRestaurantList)
* getrestaurantsbysupplierrestaurantids     (getRestaurantList)
* getDestinationsAndDishesByRestaurantId    (PoiAdminServiceProxy)
* getrestaurantsbydestidanddishid           (getRestaurantList)
* mergedestinationdishrestaurant            (PoiAdminService)
* searchbrandrestaurant                     (restaurantRepository.findByIds(restaurantIds))

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

* 硬件
    * CPU寄存器
    * CPU高速缓存L1
    * CPU高速缓存L2
    * CPU高速缓存L3
    * 内存
    * 磁盘
    * Socket
* 用户
    * 前端缓存
    * CDN
    * 反向代理缓存
    * 应用程序缓存
    * 分布式缓存
* 读写数据
    * 读
        * 缓存: 数据缓存在离CPU或用户更近的地方
    * 写
        * 异步写
        * 写缓冲区
* NIO
    * Channel Buffer Selector
    * 内存映射文件

#### 内存

* 内存结构
    * 堆内存
        * 新生代
            * Eden
            * Survivor
                * From
                * To
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
        * 进入条件
            * 大对象
            * 长期存活对象晋级
            * 空间分配担保: Minor GC后Survivor空间不足
* 内存回收
    * 垃圾收集器分类
        * 新生代/老年代
        * 串行/并行/并发
        * Stop The World
        * 复制/标记-整理/标记-清除
    * 垃圾收集器
        * Serial
        * Serial Old
        * ParNew
        * CMS
        * Parallel Scanvenge
        * Parallel Old
        * G1
* 内存模型
    * 局部变量
        * 线程局部变量
        * 方法局部变量
    * 共享变量
        * 共享内存
            * 主内存
            * 工作内存
        * 问题
            * 原子性
            * 可见性
            * 有序性
        * 问题来源: 重排序
        * 解决办法: 内存屏障
            * volatile
            * cas
            * 锁
        * happens-before
