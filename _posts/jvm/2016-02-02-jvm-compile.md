---
layout:     article
categories: [jvm]
title:      Java虚拟机编译
tags:       [jvm]
date:       2016-02-02 00:00:00
---

## Java虚拟机编译

#### 1. 示例

`javap -c`

`<index> <opcode> [ <operand1> [ <operand2>... ]] [<comment>]`

`8	bipush	100		// Push int constant 100`

#### 2. 常量、局部变量、控制结构

#### 3. 算术

#### 4. 运行时常量池访问

#### 5. 控制示例

###### while

```java
void whileInt() {
    int i = 0;
    while (i < 100) {
        i++;
    }
}
```

```java
Code:
   0: iconst_0
   1: istore_1
   2: iload_1
   3: bipush        100
   5: if_icmpge     14
   8: iinc          1, 1
  11: goto          2
  14: return
```

#### 6. 参数接受

#### 7. 方法调用

#### 8. 类实例

#### 9. 数组

#### 10. switch

#### 11. 操作数栈

#### 12. 异常抛出和处理

#### 13. finally

#### 14. 同步

#### 15. 注解
