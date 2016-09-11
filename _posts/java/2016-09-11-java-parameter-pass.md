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

然后，针对Java对象的值传递，比较常见的解释是：`obj`是对象引用，指向一个对象`new Object()`，在方法穿参时，将`obj`对象引用传递到`passParameter()`方法中，所以，在`passParameter()`中，也能通过同一个对象引用访问到`new Object()`对象，接下来的`obj = null`操作则将`passParameter()`方法中`obj`的对象引用重新赋值，指向`null`，但由于是对象引用值传递的方式，并不改变`test()`方法中`obj`的对象引用，所以，`obj`保持不变。

上面的结论和解释是对的。

下面，从JVM的角度来解释下Java的参数值传递方式。

首先，要明确一点，Java代码都是在方法中执行，入口方法是主类的`main()`方法。

在JVM中，方法的执行对应栈的`栈帧`，栈帧由局部变量表、操作数栈等组成。

再来看看方法调用的JVM指令，以`invokevirtual`为例。

![invokevirtual](/images/opcode/invokevirtual.png =540x)

图中的`Operand Stack`为操作数栈，可以看出，方法调用的参数是在操作数栈准备好的。

> If the method is not native, the nargs argument values and objectref are popped from the operand stack. A new frame is created on the Java Virtual Machine stack for the method being invoked. The objectref and the argument values are consecutively made the values of local variables of the new frame, with objectref in local variable 0, arg1 in local variable 1 (or, if arg1 is of type long or double, in local variables 1 and 2), and so on. Any argument value that is of a floating-point type undergoes value set conversion (§2.8.3) prior to being stored in a local variable. The new frame is then made current, and the Java Virtual Machine pc is set to the opcode of the first instruction of the method to be invoked. Execution continues with the first instruction of the method.
