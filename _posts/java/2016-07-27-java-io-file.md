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

    private native void open(String name) throws FileNotFoundException;

    private native int readBytes(byte b[], int off, int len) throws IOException;

}
```

`openjdk/jdk/src/share/native/java/io/FileInputStream.c`

```c
JNIEXPORT void JNICALL Java_java_io_FileInputStream_open(JNIEnv *env, jobject this, jstring path) {
    fileOpen(env, this, path, fis_fd, O_RDONLY);
}
```

`openjdk/jdk/src/solaris/native/java/io/io_util_md.c`

```c
void fileOpen(JNIEnv *env, jobject this, jstring path, jfieldID fid, int flags) {
    fd = JVM_Open(ps, flags, 0666);
    if (fd >= 0) {
        SET_FD(this, fd, fid);
    } else {
        throwFileNotFoundException(env, path);
    }
}
```

在初始化`FileInputStream`时，会调用`native`的`open()`方法打开文件。在`fileOpen()`中，`JVM_Open`代表的是系统调用函数`open()`，先调用系统调用函数`open()`方法打开或创建文件，`O_RDONLY`代表只读模式，`0666`用于设置创建文件的权限，返回文件描述符`fd`，`fd`大于或等于0，代表操作成功，然后调用`SET_FD`设置`FileInputStream`中`FileDescriptor`的`fd`，若`fd`小于0，抛出`FileNotFoundException`异常。

```c
/**
 * 系统调用函数open(), 打开和创建文件
 * 
 * pathname 文件名
 * flags 
 * mode 创建文件的权限
 * 
 * return 文件描述符
 */
int open(const char *pathname, int flags, mode_t mode);
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

接下来看看文件读取的逻辑。

读取字节数组，最终调用的是`native`的`readBytes()`方法。

`openjdk/jdk/src/share/native/java/io/FileInputStream.c`

```c
JNIEXPORT jint JNICALL Java_java_io_FileInputStream_readBytes(JNIEnv *env, jobject this, jbyteArray bytes, jint off, jint len) {
    return readBytes(env, this, bytes, off, len, fis_fd);
}
```

`openjdk/jdk/src/share/native/java/io/io_util.c`

```c
#define BUF_SIZE 8192

jint readBytes(JNIEnv *env, jobject this, jbyteArray bytes, jint off, jint len, jfieldID fid) {
    jint nread;
    char stackBuf[BUF_SIZE];
    char *buf = NULL;
    FD fd;

    if (IS_NULL(bytes)) {
        // 传入的字节数组为null, 抛出NullPointerException异常
        JNU_ThrowNullPointerException(env, NULL);
        return -1;
    }

    if (outOfBounds(env, off, len, bytes)) {
        // off、len校验, 校验失败, 抛出IndexOutOfBoundsException异常
        JNU_ThrowByName(env, "java/lang/IndexOutOfBoundsException", NULL);
        return -1;
    }

    if (len == 0) {
        return 0;
    } else if (len > BUF_SIZE) {
        // 读取字节数大于BUF_SIZE, 分配新的内存空间
        buf = malloc(len);
        if (buf == NULL) {
            JNU_ThrowOutOfMemoryError(env, NULL);
            return 0;
        }
    } else {
        // 读取字节数小于BUF_SIZE, 使用stackBuf
        buf = stackBuf;
    }

    // 获取文件描述符
    fd = GET_FD(this, fid);
    if (fd == -1) {
        // 文件未open, 抛出IOException异常
        JNU_ThrowIOException(env, "Stream Closed");
        nread = -1;
    } else {
        nread = (jint)IO_Read(fd, buf, len);
        if (nread > 0) {
            // 读取成功, 拷贝buf中读取的字节到bytes字节数组中
            (*env)->SetByteArrayRegion(env, bytes, off, nread, (jbyte *)buf);
        } else if (nread == JVM_IO_ERR) {
            JNU_ThrowIOExceptionWithLastError(env, "Read error");
        } else if (nread == JVM_IO_INTR) {
            JNU_ThrowByName(env, "java/io/InterruptedIOException", NULL);
        } else {
            // 文件读取结束
            nread = -1;
        }
    }

    if (buf != stackBuf) {
        // 施放buf
        free(buf);
    }
    return nread;
}
```

真正读取是在`IO_Read`，在`openjdk/jdk/src/solaris/native/java/io/io_util_md.h`中有声明`#define IO_Read JVM_Read`，`JVM_Read`代表系统调用函数`read()`。`IO_Read`读取成功后，进行了一次内存拷贝。

```c
int read(unsigned int fd, char *buf, size_t count);
```

`read`，从`fd`指向的文件中读取`count`个字节到`buf`指向的内存中。
