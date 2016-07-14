---
layout:     article
categories: [java]
title:      Java异常
tags:       [java]
date:       2016-07-13
---

#### 异常分类

* `Throwable`，错误和异常的父类
* `Error`，错误，表示严重的问题，程序无法处理
* `Exception`，异常，程序可以处理
* `RuntimeException`，运行时异常
* `受检异常`，编译器要求必须处理的异常，包括非运行时异常
* `非受检异常`，编译器不要求必须处理的异常，包括错误和运行时异常

#### 异常产生

* 程序中显式throw
* Java虚拟机运行出错抛出异常

#### 异常抛出

* throw异常
* throws声明方法抛出异常

```java
public void test() throws Exception {
    throw new Exception()
}
```

#### 异常捕获

异常由`try-catch-finally`进行捕获。

```java
try {
    // try
} catch (Exception e) {
    // catch
} finally {
    // finally
}
```

`try-catch-finally`可能执行的流程有:

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

上述几种情况的输出结果这里就不贴出来了，直接给出结论。

* 最开始执行的是`try`
* 当`try`中抛出异常，且和`catch`中的异常匹配时，才会执行`catch`
* `try`、`catch`、 `finall`中都可以return或throw异常
* 有`finally`, 一定会执行`finally`，在`try`或`catch`return或throw异常之前执行
* 在`finally`中有return或throw异常时，会覆盖`try`和`catch`中的return或throw的异常

#### try-catch-finally字节码分析

先来看下`try-catch-finally`中没有return的情况。

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

要分析上面字节码的含义，首先介绍下异常表`Exception table`的作用，`from to target type`的含义是执行`from`到`to`的字节码(不包含`to`)时，如果有抛出异常，会检查抛出的异常是否和`type`匹配，如果匹配则跳到`target`位置的字节码继续执行，并存储异常对象引用到本地变量表中。如果没有匹配的项，则会终止当前方法的执行。其中，`type`为`any`代表匹配任何的异常。

从上面的字节码中，可以看出有下面几种字节码执行流程。

* `0 - 3 - 6 - 25`，执行`try`，不抛异常，执行`finally`
* `0 - 9 - 10 - 13 - 16 - 25`，执行`try`，抛异常，被`catch`捕获，执行`catch`，不抛异常，执行`finally`
* `0 - 9 - 10 - 19 - 20 - 23 - 24 - 25`，执行`try`，抛异常，被`catch`捕获，执行`catch`，抛异常，被`finally`捕获，执行`finally`
* `0 - 19 - 20 - 23 - 24 - 25`，执行`try`，抛异常，未被`catch`捕获，被`finally`捕获，执行`finally`

再来看下try-catch-finally中有return的情况。

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
字节码执行流程和没有return的情况一样的，唯一的区别是对`try`和`catch`中return的处理。

可以看到，`3 - 4  -7`和`13 - 14 - 17`在执行`finally`前，会保存要return的结果到本地变量表中，`finally`执行完成后，再return保存的结果。这样处理的作用是保证`finally`不会改变return的结果。当然，这里只是保证不会改变return的值，如果return的值是引用类型，`finally`中还是可以改变引用对象内部的数据。

还有一点要注意，异常表处理的字节码入口`9`和`19`两处字节码的含义，`astore_1`和`astore_3`表示将捕获到的异常对象存储到本地变量表中，在`catch`中对应`Exception e`，`finally`中程序不可显示访问，`23 - 24`代表将`finally`捕获到的异常抛出，这种情况对应的是`try`中抛出的异常未被`catch`捕获或者`catch`中抛出异常。

* `try-catch-finally`是通过`goto`和`字节码冗余`来实现的。
* 针对return的特殊处理

#### Throwable源码分析

```java
class Throwable implements Serializable {

    private transient Object backtrace;

    // 详细信息
    private String detailMessage;

    // 异常起因
    private Throwable cause = this;

    // 堆栈轨迹
    private StackTraceElement[] stackTrace = UNASSIGNED_STACK;

    // 被屏蔽的异常
    private List<Throwable> suppressedExceptions = SUPPRESSED_SENTINEL;

    public Throwable() {
        fillInStackTrace();
    }

    public Throwable(String message) {
        fillInStackTrace();
        detailMessage = message;
    }

    public Throwable(String message, Throwable cause) {
        fillInStackTrace();
        detailMessage = message;
        this.cause = cause;
    }

    public Throwable(Throwable cause) {
        fillInStackTrace();
        detailMessage = (cause == null ? null : cause.toString());
        this.cause = cause;
    }

    /**
     * protected的构造函数, 子类可以继承
     *
     * @param enableSuppression  是否允许添加被屏蔽的异常
     * @param writableStackTrace 是否填充堆栈轨迹
     */
    protected Throwable(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        if (writableStackTrace) {
            fillInStackTrace();
        } else {
            stackTrace = null;
        }
        detailMessage = message;
        this.cause = cause;
        if (!enableSuppression)
            suppressedExceptions = null;
    }

    /**
     * 填充堆栈轨迹
     */
    public synchronized Throwable fillInStackTrace() {
        if (stackTrace != null || backtrace != null) {
            fillInStackTrace(0);
            stackTrace = UNASSIGNED_STACK;
        }
        return this;
    }

    /**
     * native填充堆栈轨迹
     */
    private native Throwable fillInStackTrace(int dummy);

    /**
     * 获取异常详细信息
     */
    public String getMessage() {
        return detailMessage;
    }

    /**
     * 获取本地化的异常详细信息, 默认返回getMessage(), 可被子类覆盖
     */
    public String getLocalizedMessage() {
        return getMessage();
    }

    /**
     * toString, 输出异常的类名和本地化的异常详细信息
     */
    public String toString() {
        String s = getClass().getName();
        String message = getLocalizedMessage();
        return (message != null) ? (s + ": " + message) : s;
    }

    /**
     * 获取cause的异常
     */
    public synchronized Throwable getCause() {
        return (cause == this ? null : cause);
    }

    /**
     * 初始化cause的异常, 只能初始化一次, 如果cause已经被构造函数初始化, 则会抛异常
     */
    public synchronized Throwable initCause(Throwable cause) {
        if (this.cause != this)
            throw new IllegalStateException("Can't overwrite cause with " + Objects.toString(cause, "a null"), this);
        if (cause == this)
            throw new IllegalArgumentException("Self-causation not permitted", this);
        this.cause = cause;
        return this;
    }

    /**
     * 打印堆栈轨迹
     */
    public void printStackTrace() {
        printStackTrace(System.err);
    }

    public void printStackTrace(PrintStream s) {
        printStackTrace(new WrappedPrintStream(s));
    }

    private void printStackTrace(PrintStreamOrWriter s) {
        Set<Throwable> dejaVu = Collections.newSetFromMap(new IdentityHashMap<Throwable, Boolean>());
        dejaVu.add(this);

        synchronized (s.lock()) {
            // 输出toString()
            s.println(this);

            // 输出堆栈轨迹
            StackTraceElement[] trace = getOurStackTrace();
            for (StackTraceElement traceElement : trace)
                s.println("\tat " + traceElement);

            // 输出cause的异常
            for (Throwable se : getSuppressed())
                se.printEnclosedStackTrace(s, trace, SUPPRESSED_CAPTION, "\t", dejaVu);

            // 输出被屏蔽的异常
            Throwable ourCause = getCause();
            if (ourCause != null)
                ourCause.printEnclosedStackTrace(s, trace, CAUSE_CAPTION, "", dejaVu);
        }
    }

    /**
     * 打印附加的异常的堆栈轨迹, 针对cause的异常和被屏蔽的异常
     */
    private void printEnclosedStackTrace(PrintStreamOrWriter s,
                                         StackTraceElement[] enclosingTrace,
                                         String caption,
                                         String prefix,
                                         Set<Throwable> dejaVu) {
        // 逻辑和printStackTrace差不多
    }

    /**
     * 获取堆栈轨迹
     */
    public StackTraceElement[] getStackTrace() {
        return getOurStackTrace().clone();
    }

    /**
     * 获取堆栈轨迹
     */
    private synchronized StackTraceElement[] getOurStackTrace() {
        if (stackTrace == UNASSIGNED_STACK || (stackTrace == null && backtrace != null)) {
            int depth = getStackTraceDepth();
            stackTrace = new StackTraceElement[depth];
            for (int i = 0; i < depth; i++)
                stackTrace[i] = getStackTraceElement(i);
        } else if (stackTrace == null) {
            return UNASSIGNED_STACK;
        }
        return stackTrace;
    }

    /**
     * 获取堆栈轨迹深度
     */
    native int getStackTraceDepth();

    /**
     * 获取index深度的堆栈轨迹
     */
    native StackTraceElement getStackTraceElement(int index);

    /**
     * 添加被屏蔽的异常
     */
    public final synchronized void addSuppressed(Throwable exception) {
        if (exception == this)
            throw new IllegalArgumentException(SELF_SUPPRESSION_MESSAGE, exception);

        if (exception == null)
            throw new NullPointerException(NULL_CAUSE_MESSAGE);

        if (suppressedExceptions == null)
            return;

        if (suppressedExceptions == SUPPRESSED_SENTINEL)
            suppressedExceptions = new ArrayList<>(1);

        suppressedExceptions.add(exception);
    }

    /**
     * 获取被屏蔽的异常
     */
    public final synchronized Throwable[] getSuppressed() {
        if (suppressedExceptions == SUPPRESSED_SENTINEL || suppressedExceptions == null)
            return EMPTY_THROWABLE_ARRAY;
        else
            return suppressedExceptions.toArray(EMPTY_THROWABLE_ARRAY);
    }

}
```

首先，来看下`fillInStackTrace()`，这是在Throwable构造函数初始化的时候调用的，用来填充异常的堆栈轨迹，里面会调用native的`fillInStackTrace()`方法。
