---
layout: topic
module: JDK
title:  Attach API
date:   2016-11-08
---

[Attach API](http://docs.oracle.com/javase/8/docs/jdk/api/attach/spec/index.html)，Java提供的一套扩展API，用来连接到目标Java虚拟机

* `com.sun.tools.attach`
    * VirtualMachine
    * VirtualMachineDescriptor
* `com.sun.tools.attach.spi`
    * AttachProvider

#### VirtualMachine.list()

```java
public static void main(String[] args) {
    List<VirtualMachineDescriptor> vms = VirtualMachine.list();
    for (VirtualMachineDescriptor vmd : vms) {
        System.out.println(vmd.id() + " " + vmd.displayName());
    }
}
```

输出结果: 进程id和main class，类似`jps`

```console
9925
9794 org.jetbrains.idea.maven.server.RemoteMavenServer
10859 com.intellij.rt.execution.application.AppMain org.txazo.jvm.attach.VirtualMachineListTest
```

#### VirtualMachine.attach()

* 创建Agent类`AttachAgent`，参考 [java.lang.instrument](http://docs.oracle.com/javase/8/docs/api/java/lang/instrument/package-summary.html)

```java
public class AttachAgent {

    public static void agentmain(String agentArgs, Instrumentation inst) {
        System.out.println("attach success ...");
    }

}
```

* 打包为`attach-agent.jar`，并添加`Agent-Class: AttachAgent`到`MANIFEST.MF`
* 创建Attach启动类`AttachAgentTest`

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

* 运行一个Java程序，假设进程id为5000
* 执行 `java AttachAgentTest 5000 attach-agent.jar`

#### Attach API实现的类层次结构

* VirtualMachine
    * HotSpotVirtualMachine
        * BsdVirtualMachine
* AttachProvider
    * HotSpotAttachProvider
        * BsdAttachProvider

#### Attach原理

* **第一步**: attach到目标虚拟机，参考 `BsdVirtualMachine`

先连接到目标虚拟机，然后关闭连接，这一步主要用来检查目标虚拟机是否可连接

```java
int fd = socket();
try {
    connect(fd, this.path);
} finally {
    close(fd);
}
```

* **第二步**: 连接到目标虚拟机并发送命令给目标虚拟机，参考`HotSpotVirtualMachine`和`BsdVirtualMachine`
* **第三步**: 等待命令执行完成，输出返回结果，参考`BsdVirtualMachine`
* **第四步**: detach关闭连接，参考`BsdVirtualMachine`

HotSpot中支持的Attach命令:

`hotspot/src/share/vm/services/attachListener.cpp`

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

* ***agentProperties***: 实现VirtualMachine.getAgentProperties()
* ***datadump***
* ***dumpheap***: 实现`jmap -heap`，参考`sun.tools.jmap.JMap`
* ***load***: 实现VirtualMachine.loadAgent()
* ***properties***: 实现VirtualMachine.getSystemProperties()
* ***threaddump***: 实现`jstack`，参考`sun.tools.jstack.JStack`
* ***inspectheap***: 实现`jmap -histo`，参考`sun.tools.jmap.JMap`
* ***setflag***: 实现`jinfo`，参考`sun.tools.jinfo.JInfo`
* ***printflag***: 实现`jinfo`，参考`sun.tools.jinfo.JInfo`
* ***jcmd***: 实现`jcmd`，参考`sun.tools.jcmd.JCmd`

> 注: 不带`-F`选项的`jmap`、`jstack`、`jinfo`、`jcmd`是通过Attach API实现的

HotSpot中Attach命令的处理入口:

`hotspot/src/share/vm/services/attachListener.cpp`

```c
static void attach_listener_thread_entry(JavaThread *thread, TRAPS) {
    for (;;) {
        AttachOperation *op = AttachListener::dequeue();
        if (op == NULL) {
            return;
        }

        // 分发命令
        AttachOperationFunctionInfo *info = NULL;
        for (int i = 0; funcs[i].name != NULL; i++) {
            const char *name = funcs[i].name;
            if (strcmp(op->name(), name) == 0) {
                info = &(funcs[i]);
                break;
            }
        }

        if (info != NULL) {
            // 执行命令
            res = (info->func)(op, &st);
        } else {
            res = JNI_ERR;
        }

        // 返回结果给client
        op->complete(res, &st);
    }
}
```

`hotspot/src/os/bsd/vm/attachListener_bsd.cpp`

```c
BsdAttachOperation *BsdAttachListener::dequeue() {
    for (;;) {
        // 等待客户端连接
        RESTARTABLE(::accept(listener(), &addr, &len), s);
        if (s == -1) {
            return NULL;
        }

        // 读取client请求
        BsdAttachOperation *op = read_request(s);
        if (op == NULL) {
            RESTARTABLE(::close(s), res);
            continue;
        } else {
            return op;
        }
    }
}
```
