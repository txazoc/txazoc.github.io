---
layout:     article
categories: [java]
title:      Java磁盘IO
tags:       [java]
date:       2016-07-27
---

```java
public class FileInputStream extends InputStream {

    private final FileDescriptor fd;
    private final String path;

    public FileInputStream(File file) throws FileNotFoundException {
        String name = (file != null ? file.getPath() : null);
        if (name == null) {
            throw new NullPointerException();
        }
        fd = new FileDescriptor();
        fd.attach(this);
        path = name;
        open(name);
    }

    public FileInputStream(FileDescriptor fdObj) {
        fd = fdObj;
        fd.attach(this);
    }

    private void open(String name) throws FileNotFoundException {
        open0(name);
    }

    private native void open0(String name) throws FileNotFoundException;

}
```

`FileDescriptor`为文件描述符.

```java
public final class FileDescriptor {

    // 标准输入的描述符
    public static final FileDescriptor in = new FileDescriptor(0);
    // 标准输出的描述符
    public static final FileDescriptor out = new FileDescriptor(1);
    // 标准错误输出的描述符
    public static final FileDescriptor err = new FileDescriptor(2);

    private int fd;
    private Closeable parent;

    public FileDescriptor() {
        fd = -1;
    }

    private FileDescriptor(int fd) {
        this.fd = fd;
    }

    synchronized void attach(Closeable c) {
        if (parent == null) {
            parent = c;
        }
    }

}
```

```java
public final class System {

    // 标准输入
    public final static InputStream in = null;
    // 标准输出
    public final static PrintStream out = null;
    // 标准错误输出
    public final static PrintStream err = null;

    private static void initializeSystemClass() {
        FileInputStream fdIn = new FileInputStream(FileDescriptor.in);
        FileOutputStream fdOut = new FileOutputStream(FileDescriptor.out);
        FileOutputStream fdErr = new FileOutputStream(FileDescriptor.err);
        setIn0(new BufferedInputStream(fdIn));
        setOut0(newPrintStream(fdOut, props.getProperty("sun.stdout.encoding")));
        setErr0(newPrintStream(fdErr, props.getProperty("sun.stderr.encoding")));
    }

    private static PrintStream newPrintStream(FileOutputStream fos, String enc) {
        if (enc != null) {
            try {
                return new PrintStream(new BufferedOutputStream(fos, 128), true, enc);
            } catch (UnsupportedEncodingException uee) {
            }
        }
        return new PrintStream(new BufferedOutputStream(fos, 128), true);
    }

    private static native void setIn0(InputStream in);

    private static native void setOut0(PrintStream out);

    private static native void setErr0(PrintStream err);

}
```
