---
layout: topic
module: JDK
title:  jstat
---

Java Virtual Machine Statistics Monitoring Tool，Java虚拟机统计监控工具

* 命令格式: jstat [ generalOption | outputOptions vmid [interval[s|ms] [count]]
    * ***generalOption***: -help、-options
    * ***outputOptions***: `jstat -options`输出的选项、-t、-h&lt;lines&gt;
    * ***vmid***: lvmid[@hostname[:port]/servername]，lvmid即pid
    * ***interval***: 每间隔interval[s|ms]时间输出一次
    * ***count***: 总共输出count次

`jstat -options`输出的选项:

```console
$ jstat -options
-class
-compiler
-gc
-gccapacity
-gccause
-gcnew
-gcnewcapacity
-gcold
-gcoldcapacity
-gcpermcapacity
-gcutil
-printcompilation
```

各个options选项输出的字段含义参考 [jstat](http://docs.oracle.com/javase/8/docs/technotes/tools/unix/jstat.html)

* `jstat -class`: 类加载统计

```console
$ jstat -class 8705
Loaded  Bytes  Unloaded  Bytes     Time   
  8233 16680.3        0     0.0      12.33
```

* `jstat -compiler`: JIT编译统计

```console
$ jstat -compiler 8705
Compiled Failed Invalid   Time   FailedType FailedMethod
    1945      0       0    24.28          0
```

* `jstat -gc`: 堆内存和gc统计

```console
$ jstat -gc 8705
 S0C    S1C    S0U    S1U      EC       EU        OC         OU       PC     PU    YGC     YGCT    FGC    FGCT     GCT   
13312.0 12288.0 2560.0  0.0   117760.0 78743.0   307200.0   202786.7  49664.0 49175.5     56    0.680   0      0.000    0.680
```

* `jstat -gccapacity`: 堆内存容量统计

```console
$ jstat -gccapacity 8705
 NGCMN    NGCMX     NGC     S0C   S1C       EC      OGCMN      OGCMX       OGC         OC      PGCMN    PGCMX     PGC       PC     YGC    FGC 
143360.0 143360.0 143360.0 11776.0 12288.0 117760.0   307200.0   307200.0   307200.0   307200.0  21504.0  83968.0  49664.0  49664.0     57     0
```

* `jstat -gccause`: 输出同`-gcutil`，多最后一次gc的原因和当前gc的原因

```console
$ jstat -gccause 8705
  S0     S1     E      O      P     YGC     YGCT    FGC    FGCT     GCT    LGCC                 GCC                 
  0.00  11.20  94.86  66.02  99.02     57    0.685     0    0.000    0.685 Allocation Failure   No GC
```

* `jstat -gcnew`: 新生代统计

```console
$ jstat -gcnew 8705
 S0C    S1C    S0U    S1U   TT MTT  DSS      EC       EU     YGC     YGCT  
11776.0 10752.0 3104.0    0.0  1  15 10752.0 120832.0  84236.4     58    0.692
```

* `jstat -gcnewcapacity`: 新生代容量统计

```console
$ jstat -gcnewcapacity 8705
  NGCMN      NGCMX       NGC      S0CMX     S0C     S1CMX     S1C       ECMX        EC      YGC   FGC 
  143360.0   143360.0   143360.0  20480.0  10240.0  20480.0  10752.0   142336.0   120832.0    59     0
```

* `jstat -gcold`: 老年代统计

```console
$ jstat -gcold 8705
   PC       PU        OC          OU       YGC    FGC    FGCT     GCT   
 49664.0  49183.4    307200.0    202874.7     59     0    0.000    0.699
```

* `jstat -gcoldcapacity`: 老年代容量统计

```console
$ jstat -gcoldcapacity 8705
   OGCMN       OGCMX        OGC         OC       YGC   FGC    FGCT     GCT   
   307200.0    307200.0    307200.0    307200.0    60     0    0.000    0.707
```

* `jstat -gcpermcapacity`: 持久代容量统计

```console
$ jstat -gcpermcapacity 8705
  PGCMN      PGCMX       PGC         PC      YGC   FGC    FGCT     GCT   
   21504.0    83968.0    49664.0    49664.0    60     0    0.000    0.707
```

* `jstat -gcutil`: 堆内存百分比和gc统计

```console
$ jstat -gcutil 8705
  S0     S1     E      O      P     YGC     YGCT    FGC    FGCT     GCT   
  0.00  31.58  45.52  66.05  99.04     61    0.713     0    0.000    0.713
```

* `jstat -printcompilation`

```console
$ jstat -printcompilation 8705
Compiled  Size  Type Method
    2042      5    1 com/dianping/mobile/framework/io/ResponseContent getStatusCode
```

* `jstat ... interval count`: 每间隔`interval`ms输出一次，总共输出`count`次

```console
$ jstat -gcnew -t 8705 1000 5
Timestamp        S0C    S1C    S0U    S1U   TT MTT  DSS      EC       EU     YGC     YGCT  
          682.9 8192.0 8704.0    0.0 2336.0  1  15 8192.0 125440.0  45636.5     63    0.723
          683.9 8192.0 8704.0    0.0 2336.0  1  15 8192.0 125440.0  48214.4     63    0.723
          685.0 8192.0 8704.0    0.0 2336.0  1  15 8192.0 125440.0  48434.1     63    0.723
          686.0 8192.0 8704.0    0.0 2336.0  1  15 8192.0 125440.0  48434.2     63    0.723
          687.0 8192.0 8704.0    0.0 2336.0  1  15 8192.0 125440.0  48436.5     63    0.723
```
