---
layout:     article
categories: [java]
title:      Java断言
tags:       [java]
date:       2016-07-21
---

断言是JDK1.5提供的新特性。

`assert`为断言关键字

断言格式一:

```java
assert condition;
```

`condition`为`true`，继续执行，为`false`，抛出`AssertionError`异常。

断言格式二:

```java
assert condition : message;
```

`condition`为`true`，继续执行，为`false`，抛出`AssertionError(message)`异常。

> `注`: `condition`为boolean表达式, `message`为值表达式

```java
public class AssertTest {

    public void testAssert(boolean condition, Object message) {
        assert condition : message;
    }

}
```

`javap -c AssertTest.class`

```java
Compiled from "AssertTest.java"
public class org.txazo.jvm.sugar.AssertTest {
  static final boolean $assertionsDisabled;

  public org.txazo.jvm.sugar.AssertTest();
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
       0: ldc           #5                  // class org/txazo/jvm/sugar/AssertTest
       2: invokevirtual #6                  // Method java/lang/Class.desiredAssertionStatus:()Z
       5: ifne          12
       8: iconst_1
       9: goto          13
      12: iconst_0
      13: putstatic     #2                  // Field $assertionsDisabled:Z
      16: return
}
```

反编译为Java代码。

```java
public class AssertTest {

    // 是否禁用断言
    static final boolean $assertionsDisabled;

    static {
        $assertionsDisabled = !AssertTest.class.desiredAssertionStatus() ? true : false;
    }

    public void testAssert(boolean condition, Object message) {
        if (!$assertionsDisabled) {
            // 断言开启
            if (!condition) {
                // 断言为false, 抛出异常
                throw new AssertionError(message);
            }
        }
    }

}
```

是否禁用断言是根据`Class.desiredAssertionStatus()`判断的，里面会调用`native`的`desiredAssertionStatus0()`方法。

跟踪`desiredAssertionStatus0()`方法，最终执行的是下面的`JavaAssertions::enabled()`方法。

`hotspot/src/share/vm/classfile/javaAssertions.cpp`

```c
// 断言是否启用
bool JavaAssertions::enabled(const char *classname, bool systemClass) {
    OptionList *p;
    if (p = match_class(classname)) {
        return p->enabled();
    }

    if (p = match_package(classname)) {
        return p->enabled();
    }

    return systemClass ? systemClassDefault() : userClassDefault();
}
```

下面是jvm启动时jvm参数的处理。

`hotspot/src/share/vm/runtime/arguments.cpp`

```c
// 用户类断言选项
static const char *user_assertion_options[] = {
    "-da", "-ea", "-disableassertions", "-enableassertions", 0
};

// 系统类断言选项
static const char *system_assertion_options[] = {
    "-dsa", "-esa", "-disablesystemassertions", "-enablesystemassertions", 0
};

if (match_option(option, user_assertion_options, &tail, true)) {
    bool enable = option->optionString[1] == 'e';
    if (*tail == '\0') {
        // 设置用户类断言
        JavaAssertions::setUserClassDefault(enable);
    } else {
        assert(*tail == ':', "bogus match by match_option()");
        JavaAssertions::addOption(tail + 1, enable);
    }
}

if (match_option(option, system_assertion_options, &tail, false)) {
    bool enable = option->optionString[1] == 'e';
    // 设置系统类断言
    JavaAssertions::setSystemClassDefault(enable);
}
```

可以看出，判断是否启用断言的逻辑是先判断类，然后是包，最后用户类或系统类。

* -ea、-enableassertions，启用用户类断言
* -da、-disableassertions，禁用用户类断言
* -esa、-enablesystemassertions，启用系统类断言
* -dsa、-disablesystemassertions，禁用系统类断言

断言开启/禁用设置。

* `java -ea:org.txazo.jvm...`，包
* `java -ea:org.txazo.jvm.Test`，类
* `java -ea`，用户类
* `java -esa`，系统类
