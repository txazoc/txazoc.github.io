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

    private static void passParameter(int i, Object obj) {
        i = 0;
        obj = null;
    }

}
```

`test()`方法中将变量`i`和`obj`传给`passParameter()`方法，然后在`passParameter()`方法中对`i`和`obj`重新赋值，结果是，`test()`方法中变量`i`和`obj`的值保持不变。

由此得出结论，Java中的参数传递是值传递的方式。

首先，基本数据类型是值传递的方式，这个没有什么异议。

然后，针对Java对象的值传递，比较常见的解释是：`obj`变量是一个对象引用，指向新创建的对象`new Object()`，在方法穿参时，将`obj`变量的对象引用传递给`passParameter()`方法中的`obj`变量，所以，在`passParameter()`中，也能通过同一个对象引用访问到`new Object()`对象，接下来的`obj = null`操作则将`passParameter()`方法中`obj`变量的对象引用重新赋值，指向`null`，但由于是对象引用值传递的方式，并不改变`test()`方法中`obj`变量的对象引用，所以，`test()`方法中`obj`变量的值保持不变。

上面的结论和解释是对的，但不是特别透彻。

下面，从JVM的角度来解释下Java的参数值传递方式。

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

上图是`invokevirtual`指令的说明，图中的`Operand Stack`为操作数栈，可以看出，`invokevirtual`指令的参数为`objectref, [arg1, [arg2 ...]]`，`objectref`为被调用方法的对象的引用，`arg{n}`为方法参数。方法参数在执行`invokevirtual`指令前被压入操作数栈，对应上面的字节码指令`iload_1`和`aload_2`。

操作数栈中存放的是什么数据呢？

> Like the Java programming language, `the Java Virtual Machine operates on two kinds of types: primitive types and reference types`. There are, correspondingly, two kinds of values that can be stored in variables, passed as arguments, returned by methods, and operated upon: primitive values and reference values.     —— [The Java® Virtual Machine Specification §2.2](http://docs.oracle.com/javase/specs/jvms/se7/html/jvms-2.html#jvms-2.2)

JVM中操作两种数据类型：基本数据类型和引用类型。在栈帧的局部变量表和操作数栈、方法传参、方法返回的数据类型都是这两种类型。

* 基本数据类型
* 引用类型，存放一个引用地址，类似C++的指针，指向堆中的对象

> There are three kinds of reference types: class types, array types, and interface types. `Their values are references to dynamically created class instances, arrays, or class instances or arrays` that implement interfaces, respectively.      —— [The Java® Virtual Machine Specification §2.4](http://docs.oracle.com/javase/specs/jvms/se7/html/jvms-2.html#jvms-2.4)
