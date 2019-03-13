---
layout: index
title:  Linux监控命令
---

#### CPU

***top***

```console
Tasks:  94 total,   1 running,  93 sleeping,   0 stopped,   0 zombie
%Cpu(s):  0.3 us,  0.3 sy,  0.0 ni, 99.3 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st
KiB Mem:   4060904 total,  3882004 used,   178900 free,   186360 buffers
KiB Swap:  3906556 total,   176168 used,  3730388 free.  1028268 cached Mem

  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND                                                                                                                                                                                                  
27162 otmg      20   0 3590292 512876   9728 S   1.3 12.6   2955:27 java                                                                                                                                                                                                     
17577 otmg      20   0 3055788 459404  13196 S   0.7 11.3 685:49.31 java                                                                                                                                                                                                     
26613 otmg      20   0 3074592 627080  15008 S   0.3 15.4  50:37.88 java                                                                                                                                                                                                     
```

***pidstat***

#### 磁盘

***iostat***

```console
Linux 3.16.0-4-amd64 (qa-ngl-node1.192.168.94.1) 	03/13/2019 	_x86_64_	(2 CPU)

avg-cpu:  %user   %nice %system %iowait  %steal   %idle
           0.61    0.00    0.38    0.01    0.00   99.00

Device:            tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn
sda               1.35         0.34        16.53    6151120  302919377
```

#### 网络

***netstat***
