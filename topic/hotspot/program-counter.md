---
layout: topic
module: HotSpot
title:  程序计数器
date:   2016-11-07
---

每个线程都有自己的程序计数器, 程序计数器保存正在执行方法的下一条指令的地址.

1. 执行方法前, 获取当前方法字节码的首地址`pc`
2. 获取`pc`对应的字节码`opcode`, 根据`opcode`类型
3. 当前指令执行完成, 更新`pc`, 跳到`2`继续执行

```c
while (1) {
    opcode = *pc;
    execute(opcode);
    update(pc);
}
```
