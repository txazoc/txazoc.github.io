---
layout:     article
categories: [java]
title:      Java语法糖
tags:       [java, 语法糖, 字节码, 反编译]
date:       2016-03-31
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

通过反编译后的代码可以看出，字节码中没有泛型的痕迹，24行的`checkcast`检查操作数栈顶的对象是否String类型，是的话就赋值给`name`，否则抛出`ClassCastExceptio`异常。

上面添加了泛型的代码和下面没有泛型的代码反编译后的效果是一样的。

```java
public void testGeneric() {
    List list = new ArrayList();
    list.add("generic");
    String name = (String) list.get(0);
}
```

#### 4. 可变长参数

```java
public class VarargsTest {

    public void varargs(int... params) {
    }

    public void testVarargs() {
        varargs();
        varargs(1);
        varargs(1, 2);
        varargs(new int[]{1, 2, 3});
    }

}
```

```java
public void varargs(int...);
    descriptor: ([I)V
    flags: ACC_PUBLIC, ACC_VARARGS
```

```java
public void testVarargs();
    Code:
       // 调用varargs()
       0: aload_0
       1: iconst_0
       2: newarray       int
       4: invokevirtual #2                  // Method varargs:([I)V

       // 调用varargs(1)
       7: aload_0
       8: iconst_1
       9: newarray       int
      11: dup
      12: iconst_0
      13: iconst_1
      14: iastore
      15: invokevirtual #2                  // Method varargs:([I)V
```

从`varargs`的方法描述可以看出，params参数的类型为`[I`(int数组)，`ACC_VARARGS`代表该方法包含不定参数。在调用`varargs()`方法时，可以有以下几种参数传递方式：

* 不传递参数，字节码：new一个空数组，传递给`varargs()`方法
* 传递单个参数，字节码：new一个数组，参数加入到数组，然后传递数组给`varargs()`方法
* 传递多个参数，字节码：new一个数组，参数加入到数组，然后传递数组给`varargs()`方法
* 传递数组参数，字节码：直接传递数组给`varargs()`方法

#### 5. 自动装箱拆箱

`装箱`：基本数据类型转换为包装类型

`拆箱`：包装类型转换为基本数据类型

```java
public void testAutoBox() {
    // 装箱
    Integer a = 10;
    // 拆箱
    int b = a;
}
```

```java
public void testAutoBox();
    Code:
       0: bipush        10
       2: invokestatic  #2                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
       5: astore_1
       6: aload_1
       7: invokevirtual #3                  // Method java/lang/Integer.intValue:()I
      10: istore_2
      11: return
```

```java
public void testAutoBox() {
    // 装箱，Integer.valueOf()转换为包装类型
    Integer a = Integer.valueOf(10);
    // 拆箱, Integer.intValue()转换为基本数据类型
    int b = a.intValue();
}
```

#### 6. 增强for循环

```java
public void testForEach() {
    int number = 0;
    List<Integer> list = new ArrayList<Integer>();
    for (Integer i : list) {
        number = i;
    }
}
```

```java
public void testForEach();
    Code:
       0: iconst_0
       1: istore_1
       2: new           #2                  // class java/util/ArrayList
       5: dup
       6: invokespecial #3                  // Method java/util/ArrayList."<init>":()V
       9: astore_2
      10: aload_2
      11: invokeinterface #4,  1            // InterfaceMethod java/util/List.iterator:()Ljava/util/Iterator;
      16: astore_3
      17: aload_3
      18: invokeinterface #5,  1            // InterfaceMethod java/util/Iterator.hasNext:()Z
      23: ifeq          46
      26: aload_3
      27: invokeinterface #6,  1            // InterfaceMethod java/util/Iterator.next:()Ljava/lang/Object;
      32: checkcast     #7                  // class java/lang/Integer
      35: astore        4
      37: aload         4
      39: invokevirtual #8                  // Method java/lang/Integer.intValue:()I
      42: istore_1
      43: goto          17
      46: return
```

```java
public void testForEach() {
    int number = 0;
    List list = new ArrayList();
    for (Iterator i = list.iterator(); i.hasNext(); ) {
        number = ((Integer) i.next()).intValue();
    }
}
```

#### 7. switch字符串

```java
public void testSwitchString() {
    String mode = "ACTIVE";
    switch (mode) {
        case "ACTIVE":
            System.out.println(mode);
            break;
        case "PASSIVE":
            System.out.println(mode);
            break;
    }
}
```

```java
public void testSwitchString();
    Code:
       0: ldc           #2                  // String ACTIVE
       2: astore_1
       3: aload_1
       4: astore_2
       5: iconst_m1
       6: istore_3
       7: aload_2
       8: invokevirtual #3                  // Method java/lang/String.hashCode:()I
      11: lookupswitch  { // 2
             -74056953: 50
            1925346054: 36
               default: 61
          }
      36: aload_2
      37: ldc           #2                  // String ACTIVE
      39: invokevirtual #4                  // Method java/lang/String.equals:(Ljava/lang/Object;)Z
      42: ifeq          61
      45: iconst_0
      46: istore_3
      47: goto          61
      50: aload_2
      51: ldc           #5                  // String PASSIVE
      53: invokevirtual #4                  // Method java/lang/String.equals:(Ljava/lang/Object;)Z
      56: ifeq          61
      59: iconst_1
      60: istore_3
      61: iload_3
      62: lookupswitch  { // 2
                     0: 88
                     1: 98
               default: 105
          }
      88: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
      91: aload_1
      92: invokevirtual #7                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
      95: goto          105
      98: getstatic     #6                  // Field java/lang/System.out:Ljava/io/PrintStream;
     101: aload_1
     102: invokevirtual #7                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
     105: return
```

```java
public void testSwitchString() {
    String mode = "ACTIVE";
    String s;
    switch ((s = mode).hashCode()) {
        case -74056953:
            if (s.equals("PASSIVE")) {
                System.out.println(mode);
            }
            break;
        case 1925346054:
            if (s.equals("ACTIVE")) {
                System.out.println(mode);
            }
            break;
        default:
            break;
    }
}
```

#### 8. try-with-resources

#### 9. 枚举

#### 10. 内部类
