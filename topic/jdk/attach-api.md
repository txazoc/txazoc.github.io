---
layout: topic
module: JDK
title:  Attach API
date:   2016-11-08
---

Attach API是Java提供的一套扩展API，用来连接到目标Java虚拟机。

从 [Attach API文档](http://docs.oracle.com/javase/8/docs/jdk/api/attach/spec/index.html) 可以看到，Attach API只有两个包:

* `com.sun.tools.attach`
* `com.sun.tools.attach.spi`

#### com.sun.tools.attach包

com.sun.tools.attach包提供连接到Java虚拟机的接口，主要有两个类: `VirtualMachine`和`VirtualMachineDescriptor`，VirtualMachine是Attach API的核心接口，VirtualMachineDescriptor则用来描述一个Java虚拟机。

#### com.sun.tools.attach.spi包

com.sun.tools.attach包中只有一个类`AttachProvider`，定义attach实现。

#### VirtualMachine.list()

VirtualMachine的`list()`方法返回系统的虚拟机进程列表。

```java
public static void main(String[] args) {
    List<VirtualMachineDescriptor> vms = VirtualMachine.list();
    for (VirtualMachineDescriptor vmd : vms) {
        System.out.println(vmd.id() + " " + vmd.displayName());
    }
}
```

输出结果:

```console
2716 com.intellij.rt.execution.application.AppMain org.txazo.jvm.attach.JpsTest
1033 org.jetbrains.idea.maven.server.RemoteMavenServer
428
```

输出虚拟机进程的进程id和main class，功能类似jps工具。

#### VirtualMachine.attach()

VirtualMachine的`attach()`方法用来连接到目标虚拟机进程。

下面给出一个attach的例子。

首先，按照 [JavaAgent规范](http://docs.oracle.com/javase/8/docs/api/) 创建一个Agent类。

```java
public class AttachAgent {

    public static void agentmain(String agentArgs, Instrumentation inst) {
        System.out.println("attach sucess ...");
    }

}
```

打包为attach-agent.jar，并添加`Agent-Class`属性到`MANIFEST`。

* Agent-Class: AttachAgent

然后，创建一个测试类，attach到目标虚拟机并加载attach-agent.jar。

```java
public class AttachAgentTest {

    public static void main(String[] args) throws Exception {
        String pid = args[0];
        String agent = args[1];
        VirtualMachine vm = VirtualMachine.attach(pid);
        vm.loadAgent(agent);
        vm.detach();
    }

}
```

最后，随便启动一个Java应用程序并保证运行，假设进程id为5000。

执行 `java AttachAgentTest 5000 attach-agent.jar` ，在目标Java进程中可以看到输出:

```console
attach sucess ...
```

#### Attach原理

Mac系统上`VirtualMachine`的继承关系为:

* `HotSpotVirtualMachine`继承自`VirtualMachine`
* `BsdVirtualMachine`继承自`HotSpotVirtualMachine`

VirtualMachine的`attach()`方法逻辑为:

* 调用`AttachProvider.providers()`获取系统的`AttachProvider`实现列表
* 遍历`AttachProvider`列表，并调用`attachVirtualMachine()`方法尝试连接目标虚拟机

Mac系统上的`AttachProvider`实现为`BsdAttachProvider`，`attachVirtualMachine()`方法返回`BsdVirtualMachine`实例。

不带`-F`选项的`jcmd`、`jinfo`、`jmap`、`jstack`是通过Attach API实现的。

以`jstack`为例。

```java
private static void runThreadDump(String pid, String[] args) throws Exception {
    VirtualMachine vm = null;
    try {
        vm = VirtualMachine.attach(pid);
    } catch (Exception e) {
        System.exit(1);
    }

    InputStream input = ((HotSpotVirtualMachine) vm).remoteDataDump((Object[]) args);

    int length = 0;
    byte[] buffer = new byte[256];
    do {
        length = input.read(buffer);
        if (length > 0) {
            System.out.print(new String(buffer, 0, length, "UTF-8"));
        }
    } while (length > 0);

    input.close();
    vm.detach();
}
```

```java
public InputStream remoteDataDump(Object... args) throws IOException {
    return this.executeCommand("threaddump", args);
}

private InputStream executeCommand(String name, Object... args) throws IOException {
    try {
        return this.execute(name, args);
    } catch (AgentLoadException e) {
        throw new InternalError("Should not get here");
    }
}

abstract InputStream execute(String name, Object... args) throws AgentLoadException, IOException;
```

`execute()`的实现在`BsdVirtualMachine`中，先connect到目标虚拟机，然后发送`name`和`args`到目标虚拟机，最后返回连接的InputStream。

虚拟机接收到命令后的处理入口: `hotspot/src/share/vm/services/attachListener.cpp`的`attach_listener_thread_entry()`方法。

Attach API支持的命令如下:

```c
static AttachOperationFunctionInfo funcs[] = {
        {"agentProperties", get_agent_properties},
        {"datadump",        data_dump},
        {"dumpheap",        dump_heap},
        {"load",            JvmtiExport::load_agent_library},
        {"properties",      get_system_properties},
        {"threaddump",      thread_dump},
        {"inspectheap",     heap_inspection},
        {"setflag",         set_flag},
        {"printflag",       print_flag},
        {"jcmd",            jcmd},
        {NULL,              NULL}
};
```

* 

jcmd

* jcmd

jinfo

* setflag
* printflag

jmap

* inspectheap
* dumpheap

jstack

* threaddump
