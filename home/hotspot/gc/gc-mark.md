---
layout: home
title:  GC标记
date:   2017-10-13
---

#### 参考资料

#### 根搜索算法

#### GC Roots

* 线程栈帧
* 本地方法栈
* 类static变量
* Class
* ClassLoader
* Universe
* String常量池
* CodeCache

#### Minor GC标记

* Young Gen中GC Roots级联
* Old Gen中GC Roots
* 卡片标记

> 卡片标记，老年代的内存分片，一个片默认512字节，上次老年代GC后，如果分片中的对象发生修改或者指向新生代对象，将此分片标记为dirty，Minor GC时，只扫描dirty卡片中的对象，而无需扫描整个老年代
