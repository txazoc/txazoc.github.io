---
layout: homelist
title: java.lang.ref
date: 2017-10-26
---

* Reference: 引用
    * referent
    * ReferenceQueue queue
    * ReferenceHandler线程
        * enqueue()
* ReferenceQueue: 引用队列
* SoftReference: 软引用
    * 内存不够即将OOM时回收
* WeakReference: 弱引用
    * gc时回收
* PhantomReference: 虚引用
    * Cleaner
        * Cleaner.clean()
* FinalReference: Final引用
    * Finalizer
        * 入队列
        * FinalizerThread线程
            * queue.poll().finalize()
