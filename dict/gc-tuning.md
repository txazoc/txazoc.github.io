---
layout: home
title:  GC调优
date:   2017-10-13
---

#### CPU Top占用

* mac

```linux
ps h -eo pid,pcpu,pmem | sort -nk3 | tail
```

* linux

```linux
ps Hh -eo pid,tid,pcpu,pmem | sort -nk3 | tail
```
