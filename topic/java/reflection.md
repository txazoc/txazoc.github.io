---
layout: topic
module: Java
title:  反射
date:   2017-02-15
---

反射，是指在Java运行时可以动态获取类的属性和方法、调用对象的方法、获取和修改对象的属性

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

new创建好对象，通过对象访问类的属性、调用类的方法

反射就是反过来，通过Class来操作对象，Class是反射操作的开端

#### Class的获取

* 类.class
* Object.getClass()
* Class.forName(className)
* ClassLoader.loadClass(className)

#### 反射实例化对象

```java
public class User {

    public static void main(String[] args) throws Exception {
        User user = User.class.newInstance();
    }

}
```

#### 反射调用构造函数

```java
public class User {

    public static void main(String[] args) throws Exception {
        Constructor<?> constructor = User.class.getConstructor();
        User user = (User) constructor.newInstance();
    }

}
```

#### 反射调用方法

```java
public class User {

    private static String name;

    public static void setName(String name) {
        User.name = name;
    }

    public static void main(String[] args) throws Exception {
        Method method = User.class.getMethod("setName", String.class);
        method.invoke(null, "admin");
    }

}
```

#### 反射操作属性

```java
public class User {

    private static String name;

    public static void main(String[] args) throws Exception {
        Field field = User.class.getField("name");
        field.setAccessible(true);
        field.set(null, "admin");
    }

}
```
