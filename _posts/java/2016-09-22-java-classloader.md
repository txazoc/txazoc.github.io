---
layout:     article
categories: [java]
title:      Java类加载分析
tags:       [java]
date:       2016-09-22
---

> There are two kinds of class loaders: the `bootstrap class loader` supplied by the Java Virtual Machine, and `user-defined class loaders`. Every user-defined class loader is an instance of a subclass of the abstract class ClassLoader.  
> [The Java® Virtual Machine Specification §5.3](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-5.html#jvms-5.3)

在Java中有两种类加载器，一种是启动类加载器，由Java虚拟机提供，另一种是用户自定义类加载器，继承自`java.lang.ClassLoader`。

在 [JVM启动分析](/jvm/jvm-startup.html) 文章中介绍到，JVM启动时，先通过启动类加载器加载`sun.launcher.LauncherHelper`类，然后调用`LauncherHelper`的`checkAndLoadMain()`方法，`checkAndLoadMain()`方法中，调用`ClassLoader`的`getSystemClassLoader()`方法获取系统类加载器，然后调用系统类加载器的`loadClass()`方法加载主类。

先来看下`getSystemClassLoader()`方法的实现，里面调用`initSystemClassLoader()`方法初始化系统类加载器。

```java
public abstract class ClassLoader {

    // 系统类加载器
    private static ClassLoader scl;
    private static boolean sclSet;

    public static ClassLoader getSystemClassLoader() {
        initSystemClassLoader();
        return scl;
    }

    private static synchronized void initSystemClassLoader() {
        if (!sclSet) {
            sun.misc.Launcher l = sun.misc.Launcher.getLauncher();
            if (l != null) {
                scl = l.getClassLoader();
                try {
                    // 通过java.system.class.loader指定自定义的系统类加载器
                    scl = AccessController.doPrivileged(new SystemClassLoaderAction(scl));
                } catch (PrivilegedActionException pae) {
                }
            }
            sclSet = true;
        }
    }

}
```

默认的系统类加载器是通过`sun.misc.Launcher`初始化的。

```java
public class Launcher {

    private static Launcher launcher = new Launcher();

    // 系统类加载器
    private ClassLoader loader;

    public static Launcher getLauncher() {
        return launcher;
    }

    public Launcher() {
        Launcher.ExtClassLoader extClassLoader;
        try {
            // 扩展类加载器, 无父类加载器
            extClassLoader = Launcher.ExtClassLoader.getExtClassLoader();
        } catch (IOException e) {
            throw new InternalError("Could not create extension class loader", e);
        }

        try {
            // 应用程序类加载器, 父类加载器为扩展类加载器
            this.loader = Launcher.AppClassLoader.getAppClassLoader(extClassLoader);
        } catch (IOException e) {
            throw new InternalError("Could not create application class loader", e);
        }

        Thread.currentThread().setContextClassLoader(this.loader);
    }

    public ClassLoader getClassLoader() {
        return this.loader;
    }

}
```

类加载器的结构如下。

* 启动类加载器: sun.boot.class.path
* 扩展类加载器: java.ext.dirs
* 应用程序类加载器: java.class.path
* 自定义类加载器

再来看看`ClassLoader`的`loadClass()`中类加载的过程。

```java
protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
    // 类加载锁
    synchronized (getClassLoadingLock(name)) {
        // 检查是否已被当前类加载器加载
        Class<?> c = findLoadedClass(name);
        if (c == null) {
            // 当前类加载器未加载, 委托给父类加载器加载
            try {
                if (parent != null) {
                    c = parent.loadClass(name, false);
                } else {
                    // 父类加载器为null, 委托给启动类加载器加载
                    c = findBootstrapClassOrNull(name);
                }
            } catch (ClassNotFoundException e) {
            }

            if (c == null) {
                // 父类加载器未找到, 调用findClass()加载, 该方法由子类实现
                c = findClass(name);
            }
        }
        if (resolve) {
            // 链接已加载的类
            resolveClass(c);
        }
        return c;
    }
}
```

可以看到，除启动类加载器外，类加载器最终通过`findClass()`来加载类。

`Launcher.ExtClassLoader`和`Launcher.AppClassLoader`都继承自`URLClassLoader`，`URLClassLoader`的`findClass()`方法逻辑如下。

* 获取class文件的字节码byte数组
* 调用ClassLoader的`defineClass()`方法加载字节码byte数组，返回Class对象

`defineClass()`方法中调用native的`defineClass1()`方法，下面来看下openjdk中`defineClass1()`方法的逻辑。

```c
// jdk/src/share/native/java/lang/ClassLoader.c
JNIEXPORT jclass JNICALL Java_java_lang_ClassLoader_defineClass1() {
    result = JVM_DefineClassWithSource(env, utfName, loader, body, length, pd, utfSource);
    return result;
}

// hotspot/src/share/vm/prims/jvm.cpp
JVM_ENTRY(jclass, JVM_DefineClassWithSource())
    JVMWrapper2("JVM_DefineClassWithSource %s", name);
    return jvm_define_class_common(env, name, loader, buf, len, pd, source, true, THREAD);
JVM_END

// hotspot/src/share/vm/prims/jvm.cpp
static jclass jvm_define_class_common() {
    klassOop k = SystemDictionary::resolve_from_stream(class_name, class_loader,
                     protection_domain, &st, verify != 0, CHECK_NULL);
    // 返回Class
    return (jclass) JNIHandles::make_local(env, Klass::cast(k)->java_mirror());
}

// hotspot/src/share/vm/classfile/systemDictionary.cpp
klassOop SystemDictionary::resolve_from_stream() {
    // 解析class文件
    instanceKlassHandle k = ClassFileParser(st).parseClassFile(class_name, class_loader,
                                protection_domain, parsed_name, verify, THREAD);
    return k();
}

// hotspot/src/share/vm/classfile/classFileParser.cpp
instanceKlassHandle ClassFileParser::parseClassFile() {
    // 解析class文件流
    ClassFileStream *cfs = stream();
    // 魔数
    u4 magic = cfs->get_u4_fast();
    // 次版本号
    u2 minor_version = cfs->get_u2_fast();
    // 主版本号
    u2 major_version = cfs->get_u2_fast();
    // ...
    {
        // 构建instanceKlass
        instanceKlassHandle this_klass(THREAD, ik);
        this_klass->set_class_loader(class_loader());
        this_klass->set_nonstatic_field_size(nonstatic_field_size);
        this_klass->set_has_nonstatic_fields(has_nonstatic_fields);
        this_klass->set_static_oop_field_count(fac.count[STATIC_OOP]);
        this_klass->set_constants(cp());
        this_klass->set_local_interfaces(local_interfaces());
        this_klass->set_fields(fields(), java_fields_count);
        this_klass->set_methods(methods());
        this_klass->set_name(cp->klass_name_at(this_class_index));
        this_klass->set_minor_version(minor_version);
        this_klass->set_major_version(major_version);

        preserve_this_klass = this_klass();
    }

    instanceKlassHandle this_klass(THREAD, preserve_this_klass);

    return this_klass;
}
```
