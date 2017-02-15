---
layout: topic
module: Java
title:  反射
date:   2017-02-15
---

反射，是指在运行时可以动态获取类的属性和方法、调用对象的方法、获取和修改对象的属性

`对象 > 类`

#### 为何称为反射?

先看下“正”的情况:

```java
public class User {

    private String name;

    public String getName() {
        return name;
    }

    public static void main(String[] args) {
        User user = new User();
        user.name = user.getName();
    }

}
```

我们知道具体的类以及它的属性和方法，通过new来创建对象，直接访问类的属性和调用类的方法

反射就是反过来，通过对象
