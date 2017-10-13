---
layout: home
title:  GC调优
date:   2017-10-13
---

#### 参考资料

#### GC调优目标

* 减少gc次数
* 减小gc停顿时间
* 提高吞吐量

#### GC调优策略

* 垃圾收集器组合选择
* 参数调整
* 分析gc日志

#### GC调优工具

* 命令行工具: ps、jps、jinfo、jstat、jstack、jmap、jhat
* 图形工具: jconsole、jvisualvm

#### CPU Top占用

* mac

```linux
ps h -eo pid,pcpu,pmem | sort -nk3 | tail
```

* linux

```linux
ps Hh -eo pid,tid,pcpu,pmem | sort -nk3 | tail
```
