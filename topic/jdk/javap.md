---
layout: topic
module: jdk
title:  javap
---

反编译Class文件

给出一个Java类:

```java
public class Javap {

    private String name;

    public Javap(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

}
```

* `javap -p Javap.class`: 显示所有类和成员

```javap
Compiled from "Javap.java"
public class Javap {
  private java.lang.String name;
  public Javap(java.lang.String);
  public java.lang.String getName();
}
```

* `javap -s Javap.class`: 输出内部类型签名

```javap
Compiled from "Javap.java"
public class Javap {
  public Javap(java.lang.String);
    Signature: (Ljava/lang/String;)V

  public java.lang.String getName();
    Signature: ()Ljava/lang/String;
}
```

构造函数的方法签名为`(Ljava/lang/String;)V`，getName()的方法签名为`()Ljava/lang/String;`

* `javap -l Javap.class`: 输出行号和本地变量表

```javap
Compiled from "Javap.java"
public class Javap {
  public Javap(java.lang.String);
    LineNumberTable:
      line 5: 0
      line 6: 4
      line 7: 9
    LocalVariableTable:
      Start  Length  Slot  Name   Signature
             0      10     0  this   LJavap;
             0      10     1  name   Ljava/lang/String;

  public java.lang.String getName();
    LineNumberTable:
      line 10: 0
    LocalVariableTable:
      Start  Length  Slot  Name   Signature
             0       5     0  this   LJavap;
}
```

`LineNumberTable`输出方法的行号，例如: `line m: n`，`m`为源文件中代码的行号，`n`为此行代码对应的字节码开始位置。

`LocalVariableTable`输出方法的本地变量表，含义如下:

| 选项  | 含义 |
| --- | --- |
| Start | 局部变量作用域开始位置 |
| Length | 局部变量作用域的长度 |
| Slot | 局部变量在本地变量表中的位置 |
| Name | 局部变量名称 |
| Signature | 局部变量类型签名 |

* `javap -c Javap.class`: 对代码进行反汇编

```javap
Compiled from "Javap.java"
public class Javap {
  public Javap(java.lang.String);
    Code:
       0: aload_0       
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: aload_0       
       5: aload_1       
       6: putfield      #2                  // Field name:Ljava/lang/String;
       9: return        

  public java.lang.String getName();
    Code:
       0: aload_0       
       1: getfield      #2                  // Field name:Ljava/lang/String;
       4: areturn       
}
```

`Code`中输出方法编译后字节码对应的JVM指令。

例如: 

```javap
1: getfield      #2                  // Field name:Ljava/lang/String;
```

`1`为方法中字节码位置，`getfield`为字节码对应的JVM指令，`#2`为常量池的索引，`// Field name:Ljava/lang/String;`为注释

* `javap -v Javap.class`: 输出附加信息

```javap
Classfile /Users/txazo/TxazoProject/java/target/classes/Javap.class
  Last modified 2016-9-30; size 427 bytes
  MD5 checksum b5bc00ea6a6e21e6a347636f307e4ed6
  Compiled from "Javap.java"
public class Javap
  SourceFile: "Javap.java"
  minor version: 0
  major version: 51
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #4.#18         //  java/lang/Object."<init>":()V
   #2 = Fieldref           #3.#19         //  Javap.name:Ljava/lang/String;
   #3 = Class              #20            //  Javap
   #4 = Class              #21            //  java/lang/Object
   #5 = Utf8               name
   #6 = Utf8               Ljava/lang/String;
   #7 = Utf8               <init>
   #8 = Utf8               (Ljava/lang/String;)V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               LocalVariableTable
  #12 = Utf8               this
  #13 = Utf8               LJavap;
  #14 = Utf8               getName
  #15 = Utf8               ()Ljava/lang/String;
  #16 = Utf8               SourceFile
  #17 = Utf8               Javap.java
  #18 = NameAndType        #7:#22         //  "<init>":()V
  #19 = NameAndType        #5:#6          //  name:Ljava/lang/String;
  #20 = Utf8               Javap
  #21 = Utf8               java/lang/Object
  #22 = Utf8               ()V
{
  public Javap(java.lang.String);
    flags: ACC_PUBLIC
    Code:
      stack=2, locals=2, args_size=2
         0: aload_0       
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: aload_0       
         5: aload_1       
         6: putfield      #2                  // Field name:Ljava/lang/String;
         9: return        
      LineNumberTable:
        line 5: 0
        line 6: 4
        line 7: 9
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
               0      10     0  this   LJavap;
               0      10     1  name   Ljava/lang/String;

  public java.lang.String getName();
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0       
         1: getfield      #2                  // Field name:Ljava/lang/String;
         4: areturn       
      LineNumberTable:
        line 10: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
               0       5     0  this   LJavap;
}
```

输出中的含义如下:

| 选项 | 含义 |
| --- | --- |
| Classfile | class文件路径 |
| Last modified | 最后修改时间及大小 |
| MD5 checksum | MD5值 |
| SourceFile | 源文件名 |
| minor version | 次版本号 |
| major version | 主版本号 |
| flags | 访问标识 |
| Constant pool | 常量池 |
