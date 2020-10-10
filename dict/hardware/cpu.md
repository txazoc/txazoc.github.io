---
layout: dict
title:  CPU
date:   2020-09-18
tags:   [cpu]
---

#### top

##### mac下top命令

```linux
ps h -eo pid,pcpu,pmem | sort -nk3 | tail
```

##### linux下top命令

```linux
ps Hh -eo pid,tid,pcpu,pmem | sort -nk3 | tail
```
