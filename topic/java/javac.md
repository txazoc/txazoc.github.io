---
layout: topic
module: Java
title:  javac编译器
date:   2016-12-06
---

javac编译: ***.java -> javac -> .class***

开源实现: [openjdk langtools](http://hg.openjdk.java.net/jdk7u/jdk7u/langtools), langtools/src/share/classes目录, 启动类:

`com.sun.tools.javac.Main`

javac编译过程:

* 源代码
* 词法分析 -> Token流
* 语法分析 -> 语法树
* 语义分析 -> 注解语法树
* 字节码生成 -> 字节码

javac核心代码:

```java
public class JavaCompiler {

    public void compile() {
        initProcessAnnotations(processors);
        delegateCompiler =
                processAnnotations(
                        enterTrees(stopIfError(CompileState.PARSE,
                                parseFiles(sourceFileObjects))), classnames);
        delegateCompiler.compile2();
    }

    private void compile2() {
        while (!todo.isEmpty())
            generate(desugar(flow(attribute(todo.remove()))));
    }

}
```

#### 词法分析

词法分析器: 

* `com.sun.tools.javac.parser.Scanner`
* java源码 -> Token序列

#### 语法分析

* `com.sun.tools.javac.parser.Parser`
* Token序列 -> 抽象语法树

