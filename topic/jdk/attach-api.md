---
layout: topic
module: JDK
title:  Attach API
date:   2016-11-08
---

[Attach API](http://docs.oracle.com/javase/8/docs/jdk/api/attach/spec/index.html)

* `com.sun.tools.attach`包: 提供连接到Java虚拟机的接口
* `com.sun.tools.attach.spi`包: 只有一个类`AttachProvider`

#### Attach

```java
public class AttachTest {

    public static void agentmain(String agentArgs, Instrumentation inst) {
        System.out.println("attached ...");
    }

}
```

打jar包为`attach-agent.jar`

* `Agent-Class`: AttachTest

```java
public class Test {

    public static void main(String[] args) throws Exception {
        String pid = args[0];
        String agent = args[1];
        VirtualMachine vm = VirtualMachine.attach(pid);
        vm.loadAgent(agent);
        vm.detach();
    }

}
```

`java Test <pid> attach-agent.jar`
