---
layout:     article
categories: [java]
title:      Java异常
tags:       [java]
date:       2016-07-13
---

#### 异常抛出

* Java虚拟机抛出异常
* throw抛出异常
* throws声明方法抛出异常

```java
public void test() throws Exception {
    throw new Exception()
}
```

#### 异常捕获

异常由`try-catch-finally`捕获

```java
try {
    // try
} catch (Exception e) {
    // catch
} finally {
    // finally
}
```

`try-catch-finally`可能执行的过程有:

* try - try return/throw

```java
public static String test() {
    try {
        System.out.println("try");
        return "try";
        // throw new RuntimeException("try");
    } catch (NullPointerException e) {
        System.out.println("catch");
        return "catch";
    }
}
```

* try - catch - catch return/throw

```java
public static String test() {
    try {
        System.out.println("try");
        throw new Exception("try");
    } catch (Exception e) {
        System.out.println("catch");
        return "catch";
        // throw new RuntimeException("catch");
    }
}
```

* try - finally - try return/throw

```java
public static String test() {
    try {
        System.out.println("try");
        return "try";
        // throw new RuntimeException("try");
    } finally {
        System.out.println("finally");
    }
}
```

* try - finally return/throw

```java
public static String test() {
    try {
        System.out.println("try");
        return "try";
        // throw new RuntimeException("try");
    } finally {
        System.out.println("finally");
        return "finally";
        // throw new RuntimeException("finally");
    }
}
```

* try - catch - finally - catch return/throw

```java
public static String test() {
    try {
        System.out.println("try");
        throw new Exception("try");
    } catch (Exception e) {
        System.out.println("catch");
        return "catch";
        // throw new RuntimeException("catch");
    } finally {
        System.out.println("finally");
    }
}
```

* try - catch - finally return/throw

```java
public static String test() {
    try {
        System.out.println("try");
        throw new Exception("try");
    } catch (Exception e) {
        System.out.println("catch");
        return "catch";
        // throw new RuntimeException("catch");
    } finally {
        System.out.println("finally");
        return "finally";
        // throw new RuntimeException("finally");
    }
}
```

> 注: `return/throw`代表方法return或向上throw异常

上述几种情况的输出结果就不贴出来, 直接说下`try-catch-finally`的执行流程.

* `try`, `catch`, `finall`中都可以return或throw异常
* 有`finally`, 一定会执行`finally`, 在`try`块或`catch`块return或throw异常之前执行
* 如果在`finally`块中return或throw异常, 则会覆盖`try`块和`catch`块中的return或throw的异常
* 当`try`中抛出异常, 且和catch中的异常匹配时, 才会执行`catch`

#### try-catch-finally字节码分析

```java
public void test() {
    try {
        tryBlock();
    } catch (Exception e) {
        catchBlock();
    } finally {
        finallyBlock();
    }
}
```

```java
Code:
  stack=1, locals=3, args_size=1
     0: invokestatic  #10                 // Method tryBlock:()V
     3: invokestatic  #11                 // Method finallyBlock:()V
     6: goto          25
     
     9: astore_1
    10: invokestatic  #12                 // Method catchBlock:()V
    13: invokestatic  #11                 // Method finallyBlock:()V
    16: goto          25
    
    19: astore_2
    20: invokestatic  #11                 // Method finallyBlock:()V
    23: aload_2
    24: athrow
    25: return
  Exception table:
     from    to  target type
         0     3     9   Class java/lang/Exception
         0     3    19   any
         9    13    19   any
```

通过字节码可以看出, `try-catch-finally`是通过`goto`和`字节码冗余`来实现的.

```java
public int test() {
    try {
        return tryBlock();
    } catch (Exception e) {
        return catchBlock();
    } finally {
        finallyBlock();
    }
}
```

```java
Code:
  stack=1, locals=4, args_size=1
     0: invokestatic  #10                 // Method tryBlock:()I
     3: istore_1
     4: invokestatic  #11                 // Method finallyBlock:()V
     7: iload_1
     8: ireturn
     
     9: astore_1
    10: invokestatic  #12                 // Method catchBlock:()I
    13: istore_2
    14: invokestatic  #11                 // Method finallyBlock:()V
    17: iload_2
    18: ireturn
    
    19: astore_3
    20: invokestatic  #11                 // Method finallyBlock:()V
    23: aload_3
    24: athrow
  Exception table:
     from    to  target type
         0     4     9   Class java/lang/Exception
         0     4    19   any
         9    14    19   any
```

#### Throwable源码分析
