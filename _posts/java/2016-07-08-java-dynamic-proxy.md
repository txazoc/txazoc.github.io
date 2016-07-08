---
layout:     article
categories: [java]
title:      Java动态代理
tags:       [java, 动态代理]
date:       2016-07-08
---

废话不多说，先给出Java动态代理的例子。

首先，定义一个接口。

```java
public interface UserService {

    public void addUser(String userName);

}
```

接口的实现类。

```java
public class UserServiceImpl implements UserService {

    @Override
    public void addUser(String userName) {
        System.out.println("add user " + userName);
    }

}
```

代理类。

```java
public class JdkProxy<T> implements InvocationHandler {

    private T target;

    public JdkProxy(T target) {
        this.target = target;
    }

    public T getProxy() {
        return (T) Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Object result = null;
        System.out.println("proxy before");
        result = method.invoke(target, args);
        System.out.println("proxy after");
        return result;
    }

}
```

测试。

```java
public class JdkProxyTest {

    public static void main(String[] args) {
        UserService userService = new UserServiceImpl();
        JdkProxy<UserService> jdkProxy = new JdkProxy<UserService>(userService);
        UserService userServiceProxy = jdkProxy.getProxy();
        userServiceProxy.addUser("admin");
    }

}
```

运行测试结果。

```test
proxy before
add user admin
proxy after
```

下面来深入分析一下JDK动态代理的原理。

先来看下`Proxy.newProxyInstance`的源码，只列出了核心代码。

```java
public static Object newProxyInstance(ClassLoader loader, Class<?>[] interfaces, InvocationHandler h) throws IllegalArgumentException {
    final Class<?>[] intfs = interfaces.clone();

    // 查找或生成接口的代理类
    Class<?> cl = getProxyClass0(loader, intfs);

    final Constructor<?> cons = cl.getConstructor(new Class<?>[]{InvocationHandler.class});
    final InvocationHandler ih = h;

    // 反射实例化代理类
    return newInstance(cons, ih);
}
```

调用`getProxyClass0`查找或生成接口的代理类，第一次生成代理类是通过`Proxy.ProxyClassFactory.apply()`生成的，来看下里面的核心代码。

```java
@Override
    public Class<?> apply(ClassLoader loader, Class<?>[] interfaces) {
    // 加载代理类的所有接口
    Map<Class<?>, Boolean> interfaceSet = new IdentityHashMap<>(interfaces.length);
    for (Class<?> intf : interfaces) {
        Class<?> interfaceClass = Class.forName(intf.getName(), false, loader);
    }

    // 代理类包名, 前提是接口为public
    String proxyPkg = "com.sun.proxy.";

    // 生成代理类的类名, 例如com.sun.proxy.$Proxy0
    long num = nextUniqueNumber.getAndIncrement();
    String proxyName = proxyPkg + "$Proxy" + num;

    // 生成代理类的class字节码
    byte[] proxyClassFile = ProxyGenerator.generateProxyClass(proxyName, interfaces);

    // native方法加载代理类
    return defineClass0(loader, proxyName, proxyClassFile, 0, proxyClassFile.length);
}
```

然后来看下`ProxyGenerator.generateProxyClass()`生成代理类字节码的过程。

```java
private static final boolean saveGeneratedFiles = ((Boolean) AccessController.doPrivileged(new GetBooleanAction("sun.misc.ProxyGenerator.saveGeneratedFiles"))).booleanValue();

public static byte[] generateProxyClass(final String var0, Class[] var1) {
    ProxyGenerator var2 = new ProxyGenerator(var0, var1);
    final byte[] var3 = var2.generateClassFile();
    if (saveGeneratedFiles) {
        AccessController.doPrivileged(new PrivilegedAction() {

            public Void run() {
                try {
                    FileOutputStream var1 = new FileOutputStream(ProxyGenerator.dotToSlash(var0) + ".class");
                    var1.write(var3);
                    var1.close();
                    return null;
                } catch (IOException var2) {
                    throw new InternalError("I/O exception saving generated file: " + var2);
                }
            }

        });
    }
    return var3;
}
```

上面的代码可以看出，当设置系统属性`sun.misc.ProxyGenerator.saveGeneratedFiles`为`true`时，会输出代理类的字节码到`com.sun.proxy.$Proxy0.class`的文件中，前提是保证'com.sun.proxy'目录存在，否则会抛出`FileNotFoundException`异常。

继续分析。

```java
private byte[] generateClassFile() {
    // 添加Object的hashCode(), equals(), toString()方法
    this.addProxyMethod(hashCodeMethod, Object.class);
    this.addProxyMethod(equalsMethod, Object.class);
    this.addProxyMethod(toStringMethod, Object.class);

    // 添加代理接口的方法
    int var1;
    int var3;
    for (var1 = 0; var1 < this.interfaces.length; ++var1) {
        Method[] var2 = this.interfaces[var1].getMethods();
        for (var3 = 0; var3 < var2.length; ++var3) {
            this.addProxyMethod(var2[var3], this.interfaces[var1]);
        }
    }

    // 方法签名检查
    Iterator var7 = this.proxyMethods.values().iterator();
    List var8;
    while (var7.hasNext()) {
        var8 = (List) var7.next();
        checkReturnTypes(var8);
    }

    Iterator var11;
    try {
        this.methods.add(this.generateConstructor());
        var7 = this.proxyMethods.values().iterator();

        while (var7.hasNext()) {
            var8 = (List) var7.next();
            var11 = var8.iterator();

            while (var11.hasNext()) {
                // 添加方法对应的Method属性
                ProxyGenerator.ProxyMethod var4 = (ProxyGenerator.ProxyMethod) var11.next();
                this.fields.add(new ProxyGenerator.FieldInfo(var4.methodFieldName, "Ljava/lang/reflect/Method;", 10));
                this.methods.add(var4.generateMethod());
            }
        }

        // 添加static静态代码块
        this.methods.add(this.generateStaticInitializer());
    } catch (IOException var6) {
        throw new InternalError("unexpected I/O Exception");
    }

    if (this.methods.size() > '\uffff') {
        throw new IllegalArgumentException("method limit exceeded");
    } else if (this.fields.size() > '\uffff') {
        throw new IllegalArgumentException("field limit exceeded");
    } else {
        // 类名
        this.cp.getClass(dotToSlash(this.className));
        // 父类名
        this.cp.getClass("java/lang/reflect/Proxy");
        // 接口名
        for (var1 = 0; var1 < this.interfaces.length; ++var1) {
            this.cp.getClass(dotToSlash(this.interfaces[var1].getName()));
        }

        this.cp.setReadOnly();
        ByteArrayOutputStream var9 = new ByteArrayOutputStream();
        DataOutputStream var10 = new DataOutputStream(var9);

        try {
            // 魔数
            var10.writeInt(-889275714);
            var10.writeShort(0);
            var10.writeShort(49);
            this.cp.write(var10);
            var10.writeShort(49);
            // 类名
            var10.writeShort(this.cp.getClass(dotToSlash(this.className)));
            // 父类名
            var10.writeShort(this.cp.getClass("java/lang/reflect/Proxy"));
            // 接口数量
            var10.writeShort(this.interfaces.length);
            // 接口名
            for (var3 = 0; var3 < this.interfaces.length; ++var3) {
                var10.writeShort(this.cp.getClass(dotToSlash(this.interfaces[var3].getName())));
            }
            // 字段数量
            var10.writeShort(this.fields.size());
            // 字段描述
            var11 = this.fields.iterator();
            while (var11.hasNext()) {
                ProxyGenerator.FieldInfo var12 = (ProxyGenerator.FieldInfo) var11.next();
                var12.write(var10);
            }
            // 方法数量
            var10.writeShort(this.methods.size());
            // 方法描述
            var11 = this.methods.iterator();
            while (var11.hasNext()) {
                ProxyGenerator.MethodInfo var13 = (ProxyGenerator.MethodInfo) var11.next();
                var13.write(var10);
            }
            var10.writeShort(0);
            return var9.toByteArray();
        } catch (IOException var5) {
            throw new InternalError("unexpected I/O Exception");
        }
    }
}
```

这里面就是生成代理类字节码的过程，按照`class文件结构`的规范来构造class字节码。

* 添加父类名和接口名
* 添加Object的`hashCode()`、`equals()`、`toString()`方法和接口的方法
* 添加上面方法对应的Method类型的字段
* 添加static代码块，初始化上面的字段
