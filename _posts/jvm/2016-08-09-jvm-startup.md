---
layout:     article
categories: [jvm]
title:      JVM启动分析
tags:       [jvm, openjdk]
date:       2016-08-09
---

通过openjdk的源码来分析jvm的启动过程。

jvm的启动入口`main()`:

```c
// openjdk7u/jdk/src/share/bin/main.c

int main(int argc, char **argv) {
    return JLI_Launch(...);
}
```

`JLI_Launch()`方法:

```c
// openjdk7u/jdk/src/share/bin/java.c

int JLI_Launch(...) {
    // 启动初始化
    InitLauncher(javaw);

    // 选择jre版本
    SelectVersion(argc, argv, &main_class);

    // 创建执行环境
    CreateExecutionEnvironment(...);

    // 加载Java虚拟机
    if (!LoadJavaVM(jvmpath, &ifn)) {
        return (6);
    }

    if (IsJavaArgs()) {
        TranslateApplicationArgs(jargc, jargv, &argc, &argv);
        if (!AddApplicationOptions(appclassc, appclassv)) {
            return (1);
        }
    } else {
        // 读取环境变量CLASSPATH
        cpath = getenv("CLASSPATH");
        if (cpath == NULL) {
            cpath = ".";
        }
        // 设置类路径
        SetClassPath(cpath);
    }

    // 解析命令行参数
    if (!ParseArguments(&argc, &argv, &mode, &what, &ret, jrepath)) {
        return (ret);
    }

    if (mode == LM_JAR) {
        // jar启动模式, 重新设置类路径
        SetClassPath(what);
    }

    SetJavaCommandLineProp(what, argc, argv);

    SetJavaLauncherProp();

    SetJavaLauncherPlatformProps();

    return JVMInit(&ifn, threadStackSize, argc, argv, mode, what, ret);
}
```

`InitLauncher()`方法:

```c
// openjdk7u/jdk/src/solaris/bin/java_md_common.c

void InitLauncher(jboolean javaw) {
    // 读取环境变量_JAVA_LAUNCHER_DEBUG, 来设置是否打印debug信息
    JLI_SetTraceLauncher();
}
```

`LoadJavaVM()`方法:

```c
// openjdk7u/jdk/src/solaris/bin/java_md_solinux.c

jboolean LoadJavaVM(const char *jvmpath, InvocationFunctions *ifn) {
    // 装载动态链接库
    libjvm = dlopen(jvmpath, RTLD_NOW + RTLD_GLOBAL);
    // 导出函数JNI_CreateJavaVM, 挂载到ifn
    ifn->CreateJavaVM = (CreateJavaVM_t) dlsym(libjvm, "JNI_CreateJavaVM");
    // 导出函数JNI_GetDefaultJavaVMInitArgs, 挂载到ifn
    ifn->GetDefaultJavaVMInitArgs = (GetDefaultJavaVMInitArgs_t) dlsym(libjvm, "JNI_GetDefaultJavaVMInitArgs");
    // 导出函数JNI_GetCreatedJavaVMs, 挂载到ifn
    ifn->GetCreatedJavaVMs = (GetCreatedJavaVMs_t) dlsym(libjvm, "JNI_GetCreatedJavaVMs");
    return JNI_TRUE;
}
```

`JVMInit()`方法:

```c
// openjdk7u/jdk/src/solaris/bin/java_md_solinux.c

int JVMInit(...) {
    ShowSplashScreen();
    return ContinueInNewThread(ifn, threadStackSize, argc, argv, mode, what, ret);
}
```

`ContinueInNewThread()`方法:

```c
// openjdk7u/jdk/src/share/bin/java.c

int ContinueInNewThread(InvocationFunctions *ifn, jlong threadStackSize, ...) {
    {
        //创建一个新的线程来执行JavaMain方法
        rslt = ContinueInNewThread0(JavaMain, threadStackSize, (void *) &args);
    }
}
```

`JavaMain()`方法:

```c
// openjdk7u/jdk/src/share/bin/java.c

int JNICALL JavaMain(void *_args) {
    // 初始化虚拟机
    if (!InitializeJVM(&vm, &env, &ifn)) {
        exit(1);
    }

    // 加载主类
    mainClass = LoadMainClass(env, mode, what);

    // 获取主类的main()方法id
    mainID = (*env)->GetStaticMethodID(env, mainClass, "main", "([Ljava/lang/String;)V");

    // 创建main方法参数
    mainArgs = CreateApplicationArgs(env, argv, argc);

    // 调用main方法
    (*env)->CallStaticVoidMethod(env, mainClass, mainID, mainArgs);

    // main方法退出
    ret = (*env)->ExceptionOccurred(env) == NULL ? 0 : 1;

    // 销毁虚拟机
    LEAVE();
}

static jclass LoadMainClass(JNIEnv *env, int mode, char *name) {
    // 获取sun.launcher.LauncherHelper类
    jclass cls = GetLauncherHelperClass(env);

    // 获取LauncherHelper类的checkAndLoadMain()方法id
    mid = (*env)->GetStaticMethodID(env, cls, "checkAndLoadMain", "(ZILjava/lang/String;)Ljava/lang/Class;");

    // 调用LauncherHelper类的checkAndLoadMain()方法来检查并加载主类
    result = (*env)->CallStaticObjectMethod(env, cls, mid, USE_STDERR, mode, str);

    return (jclass) result;
}

jclass GetLauncherHelperClass(JNIEnv *env) {
    return FindBootStrapClass(env, "sun/launcher/LauncherHelper");
}
```

`sun.launcher.LauncherHelper`的`checkAndLoadMain()`方法检查并加载主类过程:

```java
public enum LauncherHelper {

    private static final int LM_UNKNOWN = 0;
    private static final int LM_CLASS = 1;
    private static final int LM_JAR = 2;

    /**
     * 检查并加载主类
     *
     * @param useStdErr 是否使用标准错误输出
     * @param mode      模式, 对应LM_UNKNOWN、LM_CLASS、LM_JAR
     * @param name      主类名
     * @return          main class
     */
    public static Class<?> checkAndLoadMain(boolean useStdErr, int mode, String name) {
        PrintStream printStream = useStdErr ? System.err : System.out;
        ClassLoader classLoader = ClassLoader.getSystemClassLoader();
        String className = null;
        switch (mode) {
            // class启动模式
            case 1:
                className = name;
                break;
            // jar启动模式
            case 2:
                // 通过jar包中MANIFEST.MF文件的Main-Class获取主类名
                className = getMainClassFromJar(printStream, name);
                break;
            default:
                throw new InternalError(mode + ": Unknown launch mode");
        }

        className = className.replace('/', '.');

        Class mainClass = null;
        try {
            // 加载主类
            mainClass = classLoader.loadClass(className);
        } catch (ClassNotFoundException var8) {
            // 主类加载失败, 退出
            abort(printStream, var8, "java.launcher.cls.error1", new Object[]{className});
        }

        // 检查主类的main()方法, public static void main([Ljava.lang.String)
        getMainMethod(printStream, mainClass);
        return mainClass;
    }

}
```

java的启动模式如下:

* class启动模式: `java org.txazo.test.Main`
* jar启动模式: `java -jar main.jar`
