---
layout:     article
categories: [java]
title:      Java的参数传递
tags:       [java]
date:       2016-09-11
---

最近看到一篇文章介绍Java参数传递是值传递还是引用传递？代码大概是下面这样的。

```java
public class ParameterPassTest {

    @Test
    public void test() {
        int i = 1;
        Object obj = new Object();
        passParameter(i, obj);
        Assert.assertEquals(i, 1);
        Assert.assertNotNull(obj);
    }

    public void passParameter(int i, Object obj) {
        i = 0;
        obj = null;
    }

}
```

`test()`方法中将变量`i`和`obj`传给`passParameter()`方法，然后在`passParameter()`方法中对`i`和`obj`重新赋值，结果是，`test()`方法中变量`i`和`obj`的值保持不变。

由此得出结论，Java中的参数传递是值传递的方式。

首先，基本数据类型是值传递的方式，这个没有什么异议。

然后，针对Java对象的值传递，给出的解释是：`obj`变量是一个对象引用，指向新创建的对象`new Object()`，在方法传参时，将`obj`变量的对象引用传递给`passParameter()`方法中的`obj`变量，然后，在`passParameter()`中，`obj`变量的对象引用也是指向`test()`方法中的`new Object()`对象，接下来的`obj = null`操作则将`passParameter()`方法中`obj`变量的对象引用重新赋值，指向`null`，但由于方法传递的是对象引用的值，所以并不会改变`test()`方法中`obj`变量的对象引用，`test()`方法中`obj`变量指向的对象保持不变。

上面的结论和解释是正确的，但不是很直观。

下面，从JVM的角度来解释下Java的参数值传递。

下面是`test()`方法的字节码。

```javap
Code:
  stack=4, locals=3, args_size=1
     0: iconst_1      
     1: istore_1      
     2: new           #2                  // class java/lang/Object
     5: dup           
     6: invokespecial #1                  // Method java/lang/Object."<init>":()V
     9: astore_2      
    10: aload_0       
    11: iload_1       
    12: aload_2       
    13: invokevirtual #3                  // Method passParameter:(ILjava/lang/Object;)V
```

可以看出，`passParameter()`方法调用是通过`invokevirtual`指令实现的。

![invokevirtual](/images/opcode/invokevirtual.png =540x)

上图是`invokevirtual`指令的说明，图中的`Operand Stack`为操作数栈，可以看出，`invokevirtual`指令的参数为`objectref, [arg1, [arg2 ...]]`，`objectref`为被调用方法的对象的引用，`arg{n}`为第`n`个方法参数。在执行`invokevirtual`指令前，方法参数被压入操作数栈，对应上面的字节码指令`iload_1`和`aload_2`。

操作数栈中存放的是什么数据呢？

> Like the Java programming language, `the Java Virtual Machine operates on two kinds of types: primitive types and reference types`. There are, correspondingly, two kinds of values that can be stored in variables, passed as arguments, returned by methods, and operated upon: primitive values and reference values.     —— [The Java® Virtual Machine Specification §2.2](http://docs.oracle.com/javase/specs/jvms/se7/html/jvms-2.html#jvms-2.2)

和Java语言一样，JVM操作两种数据类型：**基本数据类型**和**引用类型**，这两种数据类型使用在局部变量表、操作数栈、方法传参和方法返回值中。

* **局部变量表**，存放方法中的局部变量
* **方法传参**，操作数栈中的参数出栈，传递给被调用方法
* **方法返回值**，当前方法调用结束，方法的返回值压入上一个方法的栈顶
* **操作数栈**，用途比较多
    * 局部变量表中的变量入栈
    * 数据出栈写入局部变量表
    * 方法传参时的参数入栈准备
    * 方法的返回值入栈
    * 弹出栈顶的数据用于CPU计算
    * CPU计算的结果压入栈顶

上面所有操作的数据类型都是基本数据类型和引用类型，那么基本数据类型和引用类型到底是什么样子的呢？

下面是`test()`方法的局部变量表的模型。

| 下标 | 变量 | 地址    | 值     |
| --- |  --- | ---    | ---    |
| 0   | this | 0x0300 | 0x346c |
| 1   | i    | 0x0320 | 0x0001 |
| 2   | obj  | 0x0340 | 0x75a8 |

可以看出，在局部变量表中，基本数据类型变量`i`的值就是基本数据类型的值`0x0001`，而引用类型变量`obj`的值则是一个地址`0x75a8`，这个地址指向堆中实际的对象，类似C++中的指针。

说到这里，再来看一个对象赋值操作的例子。

```java
public void test(Object obj) {
    Object temp = obj;
}
```

对应的字节码如下。

```javap
Code:
  stack=1, locals=3, args_size=2
     0: aload_1
     1: astore_2
     2: return
```

可以看出，对象的赋值操作是通过`astore`指令实现的，来看下openjdk中该指令的源码。

`/hotspot/src/share/vm/interpreter/bytecodeInterpreter.cpp`

```c
#define OPC_STORE_n(num)                             \
        // 匹配指令astore_{n}
        CASE(_astore_##num):                         \
            astore(topOfStack, -1, locals, num);     \
            UPDATE_PC_AND_TOS_AND_CONTINUE(1, -1);   \

void BytecodeInterpreter::astore(intptr_t *tos, int stack_offset,
                                 intptr_t *locals, int locals_offset) {
    // 获取栈顶的值，即对象的地址
    intptr_t value = tos[Interpreter::expr_index_at(-stack_offset)];
    // 赋值给本地变量表
    locals[Interpreter::local_index_at(-locals_offset)] = value;
}
```
