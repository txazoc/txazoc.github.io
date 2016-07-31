---
layout:     article
categories: [java]
title:      Java基本数据类型
tags:       [java, 数据类型]
date:       2016-07-30
---

Java有8种基本数据类型: `byte`、`short`、`int`、`long`、`char`、`float`、`double`、`boolean`，分类如下:

* **整数类型**: byte、short、int、long、char
* **浮点类型**: float、double
* **布尔类型**: boolean
* **数值类型**: 包括整数类型和浮点类型

下面的表格列出8种基本数据类型的字节数和取值范围:

| 类型 | 字节数 | 取值范围 |
| ---       | ---   | ---  |
| byte      | 1   | -2^7 ~ 2^7-1 |
| short     | 2  | -2^15 ~ 2^15-1 |
| int       | 4  | -2^31 ~ 2^31-1 |
| long      | 8  | -2^63 ~ 2^63-1 |
| char      | 2  | 0 ~ 2^16 |
| float     | 4  | ±2^(-126) ~ ±(2-2^(-23))×2^127 |
| double    | 8  | ±2^(-1022) ~ ±(2-2^(-52))×2^1023 |
| boolean   | 1  | 0 ~ 1 |

#### 整数类型

byte、short、int、long为`有符号数`，char为`无符号数`。

* **正数的二进制**: `原码表示`
* **负数的二进制**: `补码表示`，原码取反加1

例如，127的二进制表示为`0111 1111`，－128的二进制表示为`1000 0000`。

#### 浮点类型

浮点类型分为单精度浮点数(对应Float)和双精度浮点数(对应Double)。

浮点数的组成:

* **阶符±**: 1位
* **阶码e**: float为7位，double为10位
* **数符±**:
* **尾数m**:

| 阶符± | 阶码e | 数符± | 尾数m |
| ---   | ---  | ---   | ---  |
| 1     | 7    | 1     | 23   |

#### 布尔类型

boolean只有两种值: `true`和`false`，对应整数的1和0。

#### 包装类型

Java中的基本数据类型都有对应的包装类型，分别为`Byte`、`Short`、`Integer`、`Long`、`Character`、`Float`、`Double`、`Boolean`。

Byte、Short、Integer、Long、Float、Double都继承自`Number`，Number定义了6个方法，分别用来将包装类型转换为基本数据类型byte、short、int、long、float、double。

```java
public abstract class Number implements java.io.Serializable {

    public abstract int intValue();

    public abstract long longValue();

    public abstract float floatValue();

    public abstract double doubleValue();

    public byte byteValue() {
        return (byte) intValue();
    }

    public short shortValue() {
        return (short) intValue();
    }

}
```

以`Byte`为例，看看包装类的源码。

```java
public final class Byte extends Number implements Comparable<Byte> {

    // byte最小值
    public static final byte MIN_VALUE = -128;
    // byte最大值
    public static final byte MAX_VALUE = 127;
    // 基本数据类型byte的Class
    public static final Class<Byte> TYPE = (Class<Byte>) Class.getPrimitiveClass("byte");

    private final byte value;

    public Byte(byte value) {
        this.value = value;
    }

    // 基本类型byte转换为包装类型Byte
    public static Byte valueOf(byte b) {
        final int offset = 128;
        return ByteCache.cache[(int) b + offset];
    }

    private static class ByteCache {

        private ByteCache() {
        }

        static final Byte cache[] = new Byte[-(-128) + 127 + 1];

        static {
            for (int i = 0; i < cache.length; i++)
                cache[i] = new Byte((byte) (i - 128));
        }
    }

    public byte byteValue() {
        return value;
    }

    public short shortValue() {
        return (short) value;
    }

    public int intValue() {
        return (int) value;
    }

    public long longValue() {
        return (long) value;
    }

    public float floatValue() {
        return (float) value;
    }

    public double doubleValue() {
        return (double) value;
    }

    public int compareTo(Byte anotherByte) {
        return compare(this.value, anotherByte.value);
    }

    public static int compare(byte x, byte y) {
        return x - y;
    }

}
```

包装类的共同点:

* 包装类都为`final`类型，不可被继承
* 包装类都实现了`Serializable`接口，可被序列化
* 包装类都实现了`Comparable`接口的`compareTo()`方法，用于包装类对象间的大小比较
* Byte、Short、Integer、Long、Float、Double都继承自`Number`，
* 除Boolean外，其它包装类都有静态变量`MAX_VALUE`和`MIN_VALUE`，代表该包装类型对应的基本数据类型的最大值和最小值
* 包装类都有静态变量`TYPE`，为该包装类型对应的基本数据类型的Class
* 包装类都有静态的`R valueOf(V v)`方法，用来讲基本数据类型转换为对应的包装类型，其中参数`V`为基本数据类型，返回类型`R`为包装类型

关于`compareTo()`方法，整数类型和布尔类型没什么好说的。

关于`valueOf()`方法的实现，Byte、Short、Integer、Long、Character都有对应的缓存内部类，类似上面`Byte`的`ByteCache`，Boolean由于只有true和false两个值，直接返回静态的`TRUE`和`FALSE`。

| 包装类型   | 缓存内部类        | 缓存区间       |
| ---       | ---             | ---           |
| Byte      | ByteCache       | -128 ~ 127    |
| Short     | ShortCache      | -128 ~ 127    |
| Integer   | IntegerCache    | -128 ~ `high` |
| Long      | LongCache       | -128 ~ 127    |
| Character | CharacterCache  | 0 ~ 127       |
| Boolean   |                 | false ~ true  |

其中，`high`可配的，值在`127` ~ `Integer.MAX_VALUE`之间。

```java
private static class IntegerCache {

    static final int low = -128;
    static final int high;
    static final Integer cache[];

    static {
        int h = 127;
        String integerCacheHighPropValue = sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
        if (integerCacheHighPropValue != null) {
            int i = parseInt(integerCacheHighPropValue);
            i = Math.max(i, 127);
            h = Math.min(i, Integer.MAX_VALUE - (-low) - 1);
        }
        high = h;
        cache = new Integer[(high - low) + 1];
        for (int k = 0, j = low; k < cache.length; k++)
            cache[k] = new Integer(j++);
    }

    private IntegerCache() {
    }

}
```

当添加JVM参数`-Djava.lang.Integer.IntegerCache.high=`时。

`openjdk/hotspot/src/share/vm/opto/c2_globals.hpp`

```c
product(intx, AutoBoxCacheMax, 128, "Sets max value cached by the java.lang.Integer autobox cache")
```

设置`AutoBoxCacheMax`的默认值为128。

`openjdk/hotspot/src/share/vm/runtime/arguments.cpp`

```c
// Aggressive optimization flags  -XX:+AggressiveOpts
void Arguments::set_aggressive_opts_flags() {
#ifdef COMPILER2
    if (AggressiveOpts || !FLAG_IS_DEFAULT(AutoBoxCacheMax)) {
        if (FLAG_IS_DEFAULT(AutoBoxCacheMax)) {
            FLAG_SET_DEFAULT(AutoBoxCacheMax, 20000);
        }

        // Feed the cache size setting into the JDK
        char buffer[1024];
        sprintf(buffer, "java.lang.Integer.IntegerCache.high=" INTX_FORMAT, AutoBoxCacheMax);
        add_property(buffer);
    }
#endif
}
```

当`-XX:+AggressiveOpts`开启，且`AutoBoxCacheMax`为默认值时，会将`AutoBoxCacheMax`修改为`20000`，然后如果`AutoBoxCacheMax`不为默认值`128`或修改为`20000`，用`AutoBoxCacheMax`的值来重写`java.lang.Integer.IntegerCache.high`参数。

`high`设置的优先级为: `-XX:AutoBoxCacheMax` > `-XX:+AggressiveOpts` > `-Djava.lang.Integer.IntegerCache.high` > 默认值127

#### 浮点数的比较

```java
public final class Float {

    public int compareTo(Float anotherFloat) {
        return Float.compare(value, anotherFloat.value);
    }

    public static int compare(float f1, float f2) {
        if (f1 < f2) {
            return -1;   // Neither val is NaN, thisVal is smaller
        }
        if (f1 > f2) {
            return 1;    // Neither val is NaN, thisVal is larger
        }

        // Cannot use floatToRawIntBits because of possibility of NaNs.
        int thisBits = Float.floatToIntBits(f1);
        int anotherBits = Float.floatToIntBits(f2);
        return (thisBits == anotherBits ? 0 :   // Values are equal
                (thisBits < anotherBits ? -1 :  // (-0.0, 0.0) or (!NaN, NaN)
                        1));                    // (0.0, -0.0) or (NaN, !NaN)
    }

}
```

反编译`compare()`方法中f1和f2比较的字节码。

```java
Code:
   0: fload_0       
   1: fload_1       
   2: fcmpg         
   3: ifge          8
   6: iconst_m1     
   7: ireturn       
   8: fload_0       
   9: fload_1       
  10: fcmpl         
  11: ifle          16
  14: iconst_1      
  15: ireturn
```

float的小于和大于比较运算对应的jvm指令为`fcmpg`和`fcmpl`。

| 指令 | fcmp / fcml |
| --- | --- |
| 入栈 | ..., value1, value2 → |
| 出栈 | ..., result |

* value1大于value2，result = 1
* value1等于value2，result = 0
* value1小于value2，result = －1
* value1、value2两者至少有一个为NaN，大小比较失败，`fcmpg`指令返回result = 1，`fcmpl`指令返回result = -1

根据`IEEE 754 标准`，`NaN`是无序的，除`NaN`外的浮点数都是有序的，`负无穷大`小于所有有限值，`正无穷大`大于所有有限值，`正0`和`负0`是相等的。

什么是NaN呢？`NaN`是`Not a Number`的缩写，在`IEEE 754 标准`中，用来表示一些特殊数值。

#### 自动装箱拆箱

Java中基本数据类型和包装类型可以相互转换。

* **装箱**: 基本数据类型转换为包装类型
* **拆箱**: 包装类型转换为基本数据类型

先来看一个自动装箱拆箱的示例:

```java
public void testAutoBox() {
    // 装箱
    Integer a = 10;
    // 拆箱
    int b = a;
}
```

反编译。

```java
Code:
   0: bipush        10
   2: invokestatic  #2                  // Method java/lang/Integer.valueOf:(I)Ljava/lang/Integer;
   5: astore_1      
   6: aload_1       
   7: invokevirtual #20                 // Method java/lang/Integer.intValue:()I
  10: istore_2      
  11: return
```

自动装箱拆箱的本质是编译语法糖，使用包装类的`valueOf()`完成装箱操作，使用包装类的`${type}Value()`方法完成拆箱操作，其中`${type}`为对应的基本数据类型名。下面列出了包装类装箱和拆箱的方法。

| 类型 | 装箱 | 拆箱 |
| --- | --- | --- |
| byte    | valueOf(byte)    | byteValue() |
| short   | valueOf(short)   | shortValue() |
| int     | valueOf(int)     | intValue() |
| long    | valueOf(long)    | longValue() |
| char    | valueOf(char)    | charValue() |
| float   | valueOf(float)   | floatValue() |
| double  | valueOf(double)  | doubleValue() |
| boolean | valueOf(boolean) | booleanValue() |

说到这里，或许能理解包装类的缓存内部类的意义，在实际编码中，我们更倾向于使用基本数据类型，即使变量或参数的类型为包装类型，然后Java通过自动装箱将基本数据类型转换为包装类型，而数值`-127` ~ `128`使用得比较频繁，为避免频繁创建包装类的对象，于是缓存内部类就诞生了。至于为何`Integer`缓存的上界可以配置，应该是考虑到`int`是基本数据类型中使用**最多**的类型。

#### 基本数据类型转换
