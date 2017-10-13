---
layout: home
title:  GC触发
date:   2017-10-13
---

#### 参考资料

#### Minor GC触发时机

* 新生代eden内存空间不足
* -XX:+CMSScavengeBeforeRemark: 在执行CMS Remark前执行一次Young GC，减少老年代对新生代的引用，降低Remark的开销
* Full GC时会先触发Minor GC

#### Full GC触发时机

* System.gc()
* 老年代空间不足
* 永久代空间不足
* CMS GS时promotion failed: Minor GC时
* CMS GS时concurrent mode failure: CMS GS时大对象进入老年代，而老年代空间不足


* 晋升失败
* CMS失败
* 大对象直接进入老年代
