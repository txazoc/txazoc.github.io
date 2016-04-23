---
layout:     article
categories: [java]
title:      Java语法糖
tags:       [java, 语法糖]
date:       2016-04-22
---

> `语法糖`，Syntactic Sugar，也译为`糖衣语法`，指计算机语言中添加的某种语法。

Java语言也有语法糖，一共有下面10种：

* 断言
* 条件编译
* 泛型
* 可变长参数
* 自动装箱拆箱
* 增强for循环
* switch字符串
* try-with-resources
* 枚举
* 内部类

下面来一一介绍每种语法糖的原理。

#### 1. 断言

断言的语法格式如下，assert为断言关键字，condition为boolean表达式，message为对象，用于显示错误信息。如果condition为true，断言为真，什么都不干，否则condition为false，断言为假，抛出一个`AssertionError`的错误异常，如果存在message，message会被传递给AssertionError的构造函数。

```java
assert condition
assert condition : message
```

```java
public class AssertTest {

    public void testAssert(boolean condition, Object message) {
        assert condition : message;
    }

}
```

`javap -c AssertTest.class`

```java
public class org.txazo.java.jvm.sugar.AssertTest {
  static final boolean $assertionsDisabled;

  public org.txazo.java.jvm.sugar.AssertTest();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public void testAssert(boolean, java.lang.Object);
    Code:
       0: getstatic     #2                  // Field $assertionsDisabled:Z
       3: ifne          19
       6: iload_1
       7: ifne          19
      10: new           #3                  // class java/lang/AssertionError
      13: dup
      14: aload_2
      15: invokespecial #4                  // Method java/lang/AssertionError."<init>":(Ljava/lang/Object;)V
      18: athrow
      19: return

  static {};
    Code:
       0: ldc           #5                  // class org/txazo/java/jvm/sugar/AssertTest
       2: invokevirtual #6                  // Method java/lang/Class.desiredAssertionStatus:()Z
       5: ifne          12
       8: iconst_1
       9: goto          13
      12: iconst_0
      13: putstatic     #2                  // Field $assertionsDisabled:Z
      16: return
}
```

反编译后的代码如下。

```java
public class AssertTest {

    // 是否禁用断言
    static final boolean assertionsDisabled;

    static {
        assertionsDisabled = AssertTest.class.desiredAssertionStatus();
    }

    public void testAssert(boolean condition, Object message) {
        if (!assertionsDisabled) {
            // 断言开启
            if (!condition) {
                // 断言为假
                throw new AssertionError(message);
            }
        }
    }

}
```

#### 2. 条件编译

`条件编译`，对于条件永远为false的语句，Java编译器将不会对其生成字节码。

```java
public void testIf() {
    final boolean condition = true;
    if (!condition) {
        System.out.println("false");
    }
    if (condition) {
        System.out.println("true");
    } else {
        System.out.println("false");
    }
}
```

反编译后的字节码如下：

```java
public void testIf();
    Code:
       0: iconst_1
       1: istore_1
       2: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       5: ldc           #3                  // String true
       7: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      10: return
```

通过反编译后的字节码可以看出，`System.out.println("false");`没有生成相应的字节码。

#### 3. 泛型

泛型只在Java源代码中存在，在编译后的字节码中，泛型被擦除，并插入强制类型转换。

```java
public void testGeneric() {
    List<String> list = new ArrayList<String>();
    list.add("generic");
    String name = list.get(0);
}
```

```java
public void testGeneric();
    Code:
       0: new           #2                  // class java/util/ArrayList
       3: dup
       4: invokespecial #3                  // Method java/util/ArrayList."<init>":()V
       7: astore_1
       8: aload_1
       9: ldc           #4                  // String generic
      11: invokeinterface #5,  2            // InterfaceMethod java/util/List.add:(Ljava/lang/Object;)Z
      16: pop
      17: aload_1
      18: iconst_0
      19: invokeinterface #6,  2            // InterfaceMethod java/util/List.get:(I)Ljava/lang/Object;
      24: checkcast     #7                  // class java/lang/String
      27: astore_2
      28: return
```

通过反编译后的代码可以看出，24行的`checkcast`检查操作数栈顶的对象是否String类型，是的话就赋值给`name`，否则抛出`ClassCastExceptio`异常。

上面添加了泛型的代码和下面没有泛型的代码反编译后的效果是一样的。

```java
public void testGeneric() {
    List list = new ArrayList();
    list.add("generic");
    String name = (String) list.get(0);
}
```

#### 4. 可变长参数



#### 5. 自动装箱拆箱

#### 6. 增强for循环

#### 7. switch字符串

#### 8. try-with-resources

#### 9. 枚举

#### 10. 内部类
