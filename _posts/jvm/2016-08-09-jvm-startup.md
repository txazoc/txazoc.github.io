---
layout:     article
categories: [jvm]
title:      JVM启动分析
tags:       [jvm, openjdk]
date:       2016-08-09
---

```c
// openjdk7/jdk/src/share/bin/main.c

int main(int argc, char **argv) {
    return JLI_Launch(...);
}
```

```c
// openjdk7/jdk/src/share/bin/java.c

int JLI_Launch(...) {
    InitLauncher(javaw);

    // 输出状态
    DumpState();

    SelectVersion(argc, argv, &main_class);

    CreateExecutionEnvironment(...);

    if (!LoadJavaVM(jvmpath, &ifn)) {
        return (6);
    }

    if (IsJavaArgs()) {
        TranslateApplicationArgs(jargc, jargv, &argc, &argv);
        if (!AddApplicationOptions(appclassc, appclassv)) {
            return (1);
        }
    } else {
        cpath = getenv("CLASSPATH");
        if (cpath == NULL) {
            cpath = ".";
        }
        SetClassPath(cpath);
    }

    if (!ParseArguments(&argc, &argv, &mode, &what, &ret, jrepath)) {
        return (ret);
    }

    if (mode == LM_JAR) {
        SetClassPath(what);
    }

    SetJavaCommandLineProp(what, argc, argv);

    SetJavaLauncherProp();

    SetJavaLauncherPlatformProps();

    return JVMInit(&ifn, threadStackSize, argc, argv, mode, what, ret);
}
```

```c
// openjdk7/jdk/src/windows/bin/java_md.c

void InitLauncher(boolean javaw) {
    InitCommonControlsEx(&icx);
    JLI_SetTraceLauncher();
}
```

```c
// openjdk7/jdk/src/solaris/bin/java_md_solinux.c

int JVMInit(...) {
    ShowSplashScreen();
    return ContinueInNewThread(ifn, threadStackSize, argc, argv, mode, what, ret);
}
```

```c
// openjdk7/jdk/src/share/bin/java.c

int ContinueInNewThread(InvocationFunctions *ifn, jlong threadStackSize, ...) {
    // threadStackSize为0, 设置默认线程栈大小

    //创建一个新的线程, 用来创建虚拟机和调用main方法
    {
        rslt = ContinueInNewThread0(JavaMain, threadStackSize, (void *) &args);
    }
}
```