---
layout: topic
module: JDK
title:  jmap
---

Java Memory Map，Java内存映射

* `jmap -heap <pid>`: 打印堆的摘要信息

```console
$ jmap -heap 8705

using thread-local object allocation.
Parallel GC with 4 thread(s)

Heap Configuration:
   MinHeapFreeRatio = 0
   MaxHeapFreeRatio = 100
   MaxHeapSize      = 461373440 (440.0MB)
   NewSize          = 146800640 (140.0MB)
   MaxNewSize       = 146800640 (140.0MB)
   OldSize          = 5439488 (5.1875MB)
   NewRatio         = 2
   SurvivorRatio    = 5
   PermSize         = 21757952 (20.75MB)
   MaxPermSize      = 85983232 (82.0MB)
   G1HeapRegionSize = 0 (0.0MB)

Heap Usage:
PS Young Generation
Eden Space:
   capacity = 138412032 (132.0MB)
   used     = 82236344 (78.42668914794922MB)
   free     = 56175688 (53.57331085205078MB)
   59.41415844541608% used
From Space:
   capacity = 4194304 (4.0MB)
   used     = 0 (0.0MB)
   free     = 4194304 (4.0MB)
   0.0% used
To Space:
   capacity = 3670016 (3.5MB)
   used     = 0 (0.0MB)
   free     = 3670016 (3.5MB)
   0.0% used
PS Old Generation
   capacity = 314572800 (300.0MB)
   used     = 33263096 (31.72216033935547MB)
   free     = 281309704 (268.27783966064453MB)
   10.574053446451822% used
PS Perm Generation
   capacity = 73924608 (70.5MB)
   used     = 50952240 (48.59184265136719MB)
   free     = 22972368 (21.908157348632812MB)
   68.92459950548538% used

20314 interned Strings occupying 2436648 bytes.
```

* `jmap [-F] -histo[:live] <pid>`: 打印堆的柱状图，包括实例数、内存大小和类型签名

```console
$ jmap -histo:live 8705 | head -10

 num     #instances         #bytes  class name
----------------------------------------------
   1:         75439       13235696  [C
   2:         84708       12940176  <constMethodKlass>
   3:         84708       10852976  <methodKlass>
   4:          8309        9851872  <constantPoolKlass>
   5:         23323        6850288  [B
   6:          8309        5941736  <instanceKlassKlass>
   7:          6762        5411264  <constantPoolCacheKlass>
```

* `jmap [-F] -dump:[live,]format=b,file=<filename> <pid>`: 以hprof二进制格式转储堆到文件，之后使用jhat或MAT进行分析
* `jmap -permstat <pid>`: 打印永久代的统计信息

```console
$ jmap -permstat 8705
Attaching to process ID 8705, please wait...
Debugger attached successfully.
Server compiler detected.
JVM version is 24.80-b11
finding class loader instances ..done.
computing per loader stat ..done.
please wait.. computing liveness...........done.
class_loader	classes	bytes	parent_loader	alive?	type

<bootstrap>	465	3021792	  null  	live	<internal>
0x00000007aaabb488	0	0	  null  	live	sun/misc/Launcher$ExtClassLoader@0x00000006fafc3388
0x00000007aaaf47f0	29	316912	0x00000007aaabb488	live	sun/misc/Launcher$AppClassLoader@0x00000006fb01ea30

total = 3	494	3338704	    N/A    	alive=3, dead=0	    N/A
```

> 注: `-F`代表强制执行，`live`代表只统计存活的对象
