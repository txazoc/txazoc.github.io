---
layout:     article
categories: [java]
title:      序列化和反序列化
tags:       [java, 序列化, 反序列化]
date:       2016-04-26
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

```java
public class Teacher implements Serializable {

    private static final long serialVersionUID = -2513305609411074005L;

    private int id;
    private String name;

    public Teacher(int id, String name) {
        this.id = id;
        this.name = name;
    }

}

public class Student implements Serializable {

    private static final long serialVersionUID = 1152043348774545250L;

    private int id;
    private String name;
    private Teacher teacher;

    public Student(int id, String name, Teacher teacher) {
        this.id = id;
        this.name = name;
        this.teacher = teacher;
    }

}
```

我们来通过一个简单的Java对象来看下Java序列化后生成的二进制格式。

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

* 数据格式：二进制
* 支持语言：Java、C++、Python、Ruby、PHP

#### Protobuf

* 序列化格式：流
* 支持语言：Java、C++、Python、Go
