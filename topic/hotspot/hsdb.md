---
layout: topic
module: HotSpot
title:  HSDB
date:   2016-10-27
---

```java
package org.txazo.jvm.hsdb.test;

public class HsdbTest {

    private static Hsdb staticHsdb = new Hsdb();
    private Hsdb instanceHsdb = new Hsdb();

    public static void main(String[] args) {
        Hsdb localHsdb = new Hsdb();
    }

}

class Hsdb {
}
```

```console
$ javac -d . HsdbTest.java
$ jdb -classpath . org.txazo.jvm.hsdb.test.HsdbTest
正在初始化jdb...
> stop in org.txazo.jvm.hsdb.test.HsdbTest.main
正在延迟断点org.txazo.jvm.hsdb.test.HsdbTest.main。
将在加载类后设置。
> run
运行org.txazo.jvm.hsdb.test.HsdbTest
设置未捕获的java.lang.Throwable
设置延迟的未捕获的java.lang.Throwable
> 
VM 已启动: 设置延迟的断点org.txazo.jvm.hsdb.test.HsdbTest.main

断点命中: "线程=main", org.txazo.jvm.hsdb.test.HsdbTest.main(), 行=9 bci=0

main[1] next
> 
已完成的步骤: "线程=main", org.txazo.jvm.hsdb.test.HsdbTest.main(), 行=10 bci=8

main[1]
```

```console
$ sudo java -cp .:$JAVA_HOME/lib/sa-jdi.jar sun.jvm.hotspot.HSDB
```
