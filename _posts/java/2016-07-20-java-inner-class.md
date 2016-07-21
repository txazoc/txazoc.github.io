---
layout:     article
categories: [java]
title:      Java内部类
tags:       [java, 内部类]
date:       2016-07-20
---

Java有四种内部类:

* 成员内部类
* 静态内部类
* 局部内部类
* 匿名内部类

#### 局部内部类

以局部内部类为例，来看下Java内部类的实现原理。

```java
// 外部类
public class OuterClass {

    // 实例变量
    private Object instanceField = new Object();
    // 静态变量
    private static Object staticField = new Object();

    // 实例方法
    private Object getInstanceField() {
        return instanceField;
    }

    // 静态方法
    private static Object getStaticField() {
        return staticField;
    }

    public void outerMethod() {
        // 方法的局部变量
        final Object localField = new Object();

        // 局部内部类
        class LocalInnerClass {

            public void innerMethod() {
                // 访问方法的局部变量
                localField.getClass();
                // 访问外部类的成员变量和静态变量
                instanceField = staticField;
                // 访问外部类的成员方法
                getInstanceField();
                // 访问外部类的静态方法
                getStaticField();
            }

        }

        // 实例化内部类
        new LocalInnerClass().innerMethod();
    }

}
```

`javap -c OuterClass.class`

```java
Compiled from "OuterClass.java"
public class org.txazo.java.innerclass.local.OuterClass {
  public org.txazo.java.innerclass.local.OuterClass();
    Code:
       0: aload_0
       1: invokespecial #5                  // Method java/lang/Object."<init>":()V
       4: aload_0
       5: new           #6                  // class java/lang/Object
       8: dup
       9: invokespecial #5                  // Method java/lang/Object."<init>":()V
      12: putfield      #4                  // Field instanceField:Ljava/lang/Object;
      15: return

  public void outerMethod();
    Code:
       0: new           #6                  // class java/lang/Object
       3: dup
       4: invokespecial #5                  // Method java/lang/Object."<init>":()V
       7: astore_1
       8: new           #7                  // class org/txazo/java/innerclass/local/OuterClass$1LocalInnerClass
      11: dup
      12: aload_0
      13: aload_1
      14: invokespecial #8                  // Method org/txazo/java/innerclass/local/OuterClass$1LocalInnerClass."<init>":(Lorg/txazo/java/innerclass/local/OuterClass;Ljava/lang/Object;)V
      17: invokevirtual #9                  // Method org/txazo/java/innerclass/local/OuterClass$1LocalInnerClass.innerMethod:()V
      20: return

  static java.lang.Object access$002(org.txazo.java.innerclass.local.OuterClass, java.lang.Object);
    Code:
       0: aload_0
       1: aload_1
       2: dup_x1
       3: putfield      #4                  // Field instanceField:Ljava/lang/Object;
       6: areturn

  static java.lang.Object access$100();
    Code:
       0: getstatic     #3                  // Field staticField:Ljava/lang/Object;
       3: areturn

  static java.lang.Object access$200(org.txazo.java.innerclass.local.OuterClass);
    Code:
       0: aload_0
       1: invokespecial #2                  // Method getInstanceField:()Ljava/lang/Object;
       4: areturn

  static java.lang.Object access$300();
    Code:
       0: invokestatic  #1                  // Method getStaticField:()Ljava/lang/Object;
       3: areturn

  static {};
    Code:
       0: new           #6                  // class java/lang/Object
       3: dup
       4: invokespecial #5                  // Method java/lang/Object."<init>":()V
       7: putstatic     #3                  // Field staticField:Ljava/lang/Object;
      10: return
}
```

通过对比反编译后的字节码，编译后的`OuterClass`和下面的`OuterClass`是等价的。

```java
public class OuterClass {

    private Object instanceField = new Object();
    private static Object staticField = new Object();

    private Object getInstanceField() {
        return instanceField;
    }

    private static Object getStaticField() {
        return staticField;
    }

    public void outerMethod() {
        final Object localField = new Object();
        new OuterClass$1LocalInnerClass(this, localField).innerMethod();
    }

    static Object access$002(OuterClass outerClass, Object instanceField) {
        outerClass.instanceField = instanceField;
        return instanceField;
    }

    static Object access$100() {
        return staticField;
    }

    static Object access$200(OuterClass outerClass) {
        return outerClass.getInstanceField();
    }

    static Object access$300() {
        return getStaticField();
    }

}
```

反编译后的局部内部类。

```java
class OuterClass$1LocalInnerClass {

    final OuterClass this$0;
    final Object val$localField;

    public OuterClass$1LocalInnerClass(OuterClass this$0, Object val$localField) {
        this.this$0 = this$0;
        this.val$localField = val$localField;
    }

    public void outerMethod() {
        this.val$localField.getClass();
        OuterClass.access$002(this.this$0, OuterClass.access$100());
        OuterClass.access$200(this.this$0);
        OuterClass.access$300();
    }

}
```

下面来总结下局部内部类的实现。

* javac编译器会把内部类从外部类中剥离出来，编译为一个单独的class文件，例如上面的`OuterClass$1LocalInnerClass.class`
* 非静态内部类持有外部类实例的引用`this$0`，这是在实例化内部类时，从构造函数传入的
* 内部类中可以访问外部类的变量和方法，包括private类型的，静态内部类只能访问外部类的静态变量和静态方法。针对外部类中private类型的变量和方法访问，编译器单独生成了`static`的`access$xxx()`方法，供内部类使用
* 内部类中访问的局部变量必须是final类型的，局部变量会作为内部类构造函数的参数传入内部类

局部内部类包含成员内部类、静态内部类和匿名内部类全部的特性。

下面介绍下成员内部类、静态内部类和匿名内部类。

#### 成员内部类

成员内部类的特点：

* 可以访问外部类的所有变量和方法(包括private)
* 不可以定义静态变量和静态方法

#### 静态内部类

静态内部类的特点：

* 只能访问外部类的静态变量和静态方法(包括private)
* 可以定义成员变量、静态变量、成员方法和静态方法

#### 匿名内部类

匿名内部类的特点：

* 匿名内部类实现任何的一个类或接口。
* 可以访问外部类的所有变量和方法(包括private)
* 不可以定义静态变量和静态方法
* 可以访问final的局部变量
