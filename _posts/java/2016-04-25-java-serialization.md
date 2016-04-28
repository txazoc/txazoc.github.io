---
layout:     article
categories: [java]
title:      序列化和反序列化
tags:       [java, 序列化, 反序列化]
date:       2016-04-25
---

> 序列化，将对象的状态信息转换为可以存储或传输的形式的过程。    - [百度百科](http://baike.baidu.com/view/160029.htm)

#### 序列化和反序列化的概念

* `序列化`：将对象或数据结构转换为二进制的过程
* `反序列化`：将序列化生成的二进制转换为对象或数据结构的过程
* `对象`：Java中的对象
* `数据结构`：C中的struct
* `二进制`：Java中指的是byte[]

下面谈下不同的序列化方式。

#### Java序列化

Java提供序列化和反序列化的功能，通过`ObjectInputStream`和`ObjectOutputStream`实现，可以对任何的Java对象进行序列化和反序列化。

Java序列化的特点：

* 数据格式：对象流

为了深入理解Java序列化的过程，先来创建下面两个类。

```java
package org.txazo.java.serialization.jdk;

import java.io.Serializable;

public class Teacher implements Serializable {

    private static final long serialVersionUID = 3065959900182294875L;

    private int id;
    private String name;

    public Teacher(int id, String name) {
        this.id = id;
        this.name = name;
    }

}
```

```java
package org.txazo.java.serialization.jdk;

import java.io.Serializable;

public class Student implements Serializable {

    private static final long serialVersionUID = 7782253254733071150L;

    private int id;
    private String name;
    private Teacher[] teachers;

    public Student(int id, String name, Teacher[] teachers) {
        this.id = id;
        this.name = name;
        this.teachers = teachers;
    }

}
```

然后，写一个对象序列化的测试用例。

```java
@Test
public void testJDKSerialization() throws Exception {
    Teacher[] teachers = new Teacher[2];
    teachers[0] = new Teacher(101, "chinese");
    teachers[1] = new Teacher(102, "english");
    Student student = new Student(1000, "xiaoming", teachers);
    ObjectOutputStream ois = new ObjectOutputStream(new FileOutputStream("/Users/txazo/test/object.txt"));
    ois.writeObject(student);
}
```

最后，拿到序列化后的对象流数据，以十六进制的形式展开。

```java
AC ED       // 对象流头部的魔数，固定为0xACED
00 05       // 序列化版本号5
73          // TC_OBJECT，对象标识
72          // TC_CLASSDESC，Class描述标识
00 28       // 字符串长度40
6F 72 67 2E 74 78 61 7A 
6F 2E 6A 61 76 61 2E 73 65 72 69 61 6C 69 7A 61 
74 69 6F 6E 2E 6A 64 6B 2E 53 74 75 64 65 6E 74 // 字符串org.txazo.java.serialization.jdk.Student
6C 00 1E 1A 60 7E 03 2E // serialVersionUID
02          // SC_SERIALIZABLE，可序列化标识
00 03       // 属性数量3
49          // I，代表int
00 02       // 字符串长度2
69 64       // 字符串id
4C          // L，代表class or interface
00 04       // 字符串长度4
6E 61 6D 65 // 字符串name
74          // TC_STRING，字符串标识
00 12       // 字符串长度18
4C 6A 61 76 61 2F 6C 61 6E 67 2F 53 74 72 69 6E 67 3B // Ljava/lang/String;
5B          // [，代表array
00 08       // 字符串长度8
74 65 61 63 68 65 72 73 // teachers
74          // TC_STRING，字符串标识
00 2B       // 字符串长度43
5B 4C 6F 72 67 2F 74 78 61 7A 6F 2F 6A 61 76 61
2F 73 65 72 69 61 6C 69 7A 61 74 69 6F 6E 2F 6A
64 6B 2F 54 65 61 63 68 65 72 3B // [Lorg/txazo/java/serialization/jdk/Teacher;
78          // TC_ENDBLOCKDATA，对象的数据块结束标识
70          // TC_NULL，NULL标识
00 00 03 E8 // int值1000
74          // TC_STRING，字符串标识
00 08       // 字符串长度8
78 69 61 6F 6D 69 6E 67 // 字符串xiaoming
75          // TC_ARRAY，数组标识
72          // TC_CLASSDESC，Class描述标识
00 2B       // 字符串长度43
5B 4C 6F 72 67 2E 74 78 61 7A 6F 2E 6A 61 76 61
2E 73 65 72 69 61 6C 69 7A 61 74 69 6F 6E 2E 6A
64 6B 2E 54 65 61 63 68 65 72 3B // [Lorg/txazo/java/serialization/jdk/Teacher;
9E 3D 33 F9 8B C3 80 9A // serialVersionUID
02          // SC_SERIALIZABLE，可序列化标识
00 00       // 属性数量0
78          // TC_ENDBLOCKDATA，对象的数据块结束标识
70          // TC_NULL，NULL标识
00 00 00 02 // 数组长度2
73          // TC_OBJECT，对象标识
72          // TC_CLASSDESC，Class描述标识
00 28       // 字符串长度40
6F 72 67 2E 74 78 61 7A 6F 2E 6A 61 76 61 2E 73
65 72 69 61 6C 69 7A 61 74 69 6F 6E 2E 6A 64 6B
2E 54 65 61 63 68 65 72 // org.txazo.java.serialization.jdk.Teacher
2A 8C 7A 48 F9 F5 31 5B // serialVersionUID
02          // SC_SERIALIZABLE，可序列化标识
00 02       // 属性长度2
49          // I，代表int
00 02       // 字符串长度2
69 64       // 字符串id
4C          // L，代表class or interface
00 04       // 字符串长度4
6E 61 6D 65 // name
71          // TC_REFERENCE，引用标识
00 7E 00 01 // int值1(0x7e0000 + 1)，指向流中已经写入的对象
78          // TC_ENDBLOCKDATA，对象的数据块结束标识
70          // TC_NULL，NULL标识
00 00 00 65 // int值101
74          // TC_STRING，字符串标识
00 07       // 字符串长度7
63 68 69 6E 65 73 65 // 字符串chinese
73          // TC_OBJECT，对象标识
71          // TC_REFERENCE，引用标识
00 7E 00 07 // int值7(0x7e0000 + 7)，指向流中已经写入的对象
00 00 00 66 // int值102
74          // TC_STRING，字符串标识
00 07       // 字符串长度7
65 6E 67 6C 69 73 68 // 字符串english
```

从上面的十六进制的数据中，我们可以看出以下几点：

* 冗余数据较多，造成整体序列化后的数据量较大
* 序列化的流程为：
    * 写入对象描述
    * 写入对象的值

#### XML序列化

XML序列化的特点：

* 数据格式：XML

```xml
<student id="1" name="xiaoming">
    <teacher>
        <id>1</id>
        <name>xiaohong</name>
    </teacher>
</student>
```

#### JSON序列化

JSON序列化的Java框架有FastJSON、Gson、Jackson。

JSON序列化的特点：

* 数据格式：JSON

```javascript
{
    "id": "1",
    "name": "xiaoming",
    "teacher": {
        "id": "1",
        "name": "xiaohong"
    }
}
```

#### Hessian序列化

Hessian序列化的特点：

* 数据格式：Hessian流
* 支持语言：Java

#### Thrift

Thrift的特点：

* 数据格式：二进制
* 支持语言：Java、C++、Python、Ruby、PHP

#### Protobuf

Protobuf的特点：

* 序列化格式：流
* 支持语言：Java、C++、Python、Go
