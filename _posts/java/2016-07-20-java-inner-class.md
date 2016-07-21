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

#### 成员内部类

成员内部类的特点：

* 成员内部类可以访问外部类的所有变量和方法(包括private)
* 成员内部类不可以定义静态变量和静态方法

下面，来看下成员内部类的原理。

首先，定义一个类OutterClass，该类有一个成员内部类InnerClass。

```java
public class OutterClass {

    private Object field;
    private static Object staticField;

    public Object getField() {
        return field;
    }

    public static Object getStaticField() {
        return staticField;
    }

    public class InnerClass {

        public void inner() {
            // 访问外部类成员变量和静态变量
            field = staticField;
            // 访问外部类成员方法
            getField();
            // 访问外部类静态方法
            getStaticField();
        }

    }

}
```

可以看到，在成员内部类中，可以访问外部类的成员变量、静态变量、成员方法和静态方法。

编译`OutterClass`，生成`OutterClass.class`和`OutterClass$InnerClass.class`两个class文件。

`javap -c OutterClass.class`

```java
Compiled from "OutterClass.java"
public class org.txazo.java.innerclass.member.OutterClass {
  public org.txazo.java.innerclass.member.OutterClass();
    Code:
       0: aload_0
       1: invokespecial #3                  // Method java/lang/Object."<init>":()V
       4: return

  public java.lang.Object getField();
    Code:
       0: aload_0
       1: getfield      #2                  // Field field:Ljava/lang/Object;
       4: areturn

  public static java.lang.Object getStaticField();
    Code:
       0: getstatic     #1                  // Field staticField:Ljava/lang/Object;
       3: areturn

  static java.lang.Object access$002(org.txazo.java.innerclass.member.OutterClass, java.lang.Object);
    Code:
       0: aload_0
       1: aload_1
       2: dup_x1
       3: putfield      #2                  // Field field:Ljava/lang/Object;
       6: areturn

  static java.lang.Object access$100();
    Code:
       0: getstatic     #1                  // Field staticField:Ljava/lang/Object;
       3: areturn
}
```

可以看出，编译器给`OutterClass`添加了`access$002()`和`access$100()`两个方法。反编译`OutterClass`。

```java
public class OutterClass {

    private Object field;
    private static Object staticField;

    public Object getField() {
        return field;
    }

    public static Object getStaticField() {
        return staticField;
    }

    static Object access$002(OutterClass outterClass, Object field) {
        outterClass.field = field;
        return field;
    }

    static Object access$100() {
        return staticField;
    }

}
```

反编译`OutterClass$InnerClass`。

```java
public class OutterClass$InnerClass {

    private final OutterClass this$0;

    public OutterClass$InnerClass(OutterClass this$0) {
        this.this$0 = this$0;
    }

    public void inner() {
        OutterClass.access$002(this.this$0, OutterClass.access$100());
        this.this$0.getField();
        OutterClass.getStaticField();
    }

}
```

可以看出，成员内部类只有一个构造函数，传入了外部类实例的引用。

```java
public static void main(String[] args) {
    OutterClass outterClass = new OutterClass();
    OutterClass.InnerClass innerClass = outterClass.new InnerClass();
}
```

```java
public static void main(java.lang.String[]);
  Code:
     0: new           #2                  // class org/txazo/java/innerclass/member/OutterClass
     3: dup
     4: invokespecial #3                  // Method org/txazo/java/innerclass/member/OutterClass."<init>":()V
     7: astore_1
     8: new           #4                  // class org/txazo/java/innerclass/member/OutterClass$InnerClass
    11: dup
    12: aload_1
    13: dup
    14: invokevirtual #5                  // Method java/lang/Object.getClass:()Ljava/lang/Class;
    17: pop
    18: invokespecial #6                  // Method org/txazo/java/innerclass/member/OutterClass$InnerClass."<init>":(Lorg/txazo/java/innerclass/member/OutterClass;)V
    21: astore_2
    22: return
```

可以看出，通过外部类的实例创建内部类实例的时候，先通过`new`来分配内部类的内存空间，然后调用内部类的构造函数并传入外部类的实例对象。

#### 静态内部类

静态内部类

#### 局部内部类

#### 匿名内部类
