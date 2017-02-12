---
layout: topic
module: Linux
title:  Socket
date:   2017-02-11
---

Socket，套接字

#### Socket编程接口

***服务端Socket编程***

`socket()` > `bind()` > `listen()` > `accept()` > `send()/recv()` > `close()`

***客户端Socket编程***

`socket()` > `connect()` > `send()/recv()` > `close()`

***socket()***

```c
int socket(int domain, int type, int protocol)
```

创建一个套接字，返回Socket描述符

***bind()***

```c
int bind(int socket, const struct sockaddr *address, socklen_t address_len)
```

为套接字绑定ip地址和端口号

***listen()***

```c
int listen(int socket, int backlog)
```

监听套接字的客户端连接请求，调用`listen`后，内核会建立两个队列:

* SYN队列: 未完成三次握手的连接队列
* ACCEPT队列: 已完成三次握手的连接队列，`backlog`代表`ACCEPT队列`的最大长度

队列满了怎么处理?

* ACCEPT队列满: 丢弃ACK请求，对端重发
* ACCEPT队列满、SYN队列未满: SYN队列增长
* ACCEPT队列满、SYN队列满: 丢弃SYN请求，对端重发

***accept()***

```c
int accept(int socket, struct sockaddr *restrict address, socklen_t *restrict address_len)
```

阻塞等待接收新的连接(从`ACCEPT队列`中拿一个连接)，返回新的socket描述符

***connect()***

```c
int connect(int socket, const struct sockaddr *address, socklen_t address_len)
```

请求服务端建立连接

***send()***

```c
ssize_t send(int socket, const void *buffer, size_t length, int flags)
```

发送数据，`buffer`中的数据copy到发送缓冲区，返回`send`成功的字节数，返回-1代表错误

对于TCP，`send`返回时，数据不一定已经被发送出去

***recv()***

```c
ssize_t recv(int socket, void *buffer, size_t length, int flags)
```

接收数据，接收缓冲区中的数据copy到`buffer`，返回实际读取的字节数，返回-1代表错误

对于TCP，返回0代表对端已关闭连接

***close()***

```c
int close(int fildes)
```

关闭套接字

#### 什么是Socket描述符?

Socket描述符类似文件描述符，整数表示，指向套接字的数据结构

#### Socket缓冲区

#### send/recv执行流程

***send执行流程***

* 若待发送数据长度大于发送缓冲区的长度，返回SOCKET_ERROR，否则下一步
* 若正在发送数据，等待直到发送缓冲区中的数据发送完毕，下一步
* 若待发送数据长度大于发送缓冲区中剩余空间的长度，等待直到发送缓冲区中的数据发送完毕且待发送数据长度小于发送缓冲区中剩余空间的长度，下一步
* 待发送数据copy到发送缓冲区的剩余空间，返回实际copy的字节数，不用等待数据发送

***recv执行流程***

* 若接收缓冲区为空或正在接收数据，等待接收缓冲区不为空且数据接收完毕
* 接收缓冲区中的数据copy到buffer，返回实际copy的字节数

#### 如何切分不同的消息?

* 定界符: 每个消息以一个特殊字节序列结尾
* 显式长度: 每个消息开头添加一个固定大小的字段，代表消息的字节长度

#### Tomcat Socket模型

* 主线程: 阻塞accept新的连接，丢给待处理请求队列
* 待处理请求队列: 存放待处理的请求
* 工作线程池: 从待处理请求队列拿请求进行处理

#### Socket编程

***服务端Socket编程***

```c
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<sys/types.h>
#include<sys/socket.h>
#include<netinet/in.h>

#define PORT 8888

int main() {
    int server_fd, socket_fd, length;
    struct sockaddr_in server_addr;
    char buffer[1024];

    if ((server_fd = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
        printf("Socket init error\n");
        exit(0);
    }

    server_addr.sin_family = AF_INET;
    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);
    server_addr.sin_port = htons(PORT);

    if (bind(server_fd, (struct sockaddr *) &server_addr, sizeof(server_addr)) == -1) {
        printf("Socket bind error\n");
        exit(0);
    }

    if (listen(server_fd, 10) == -1) {
        printf("Socket listen error\n");
        exit(0);
    }

    printf("Server started waiting for new connection ...\n");

    while (true) {
        if ((socket_fd = accept(server_fd, (struct sockaddr *) NULL, NULL)) == -1) {
            printf("Socket accept error\n");
            continue;
        }

        printf("Accept new connection\n");

        if ((length = recv(socket_fd, buffer, 1024, 0)) == -1) {
            printf("Socket recv error\n");
        } else {
            buffer[length] = '\0';
            printf("Receive Message: %s\n", buffer);
        }

        if (send(socket_fd, "Hello, you are connected!", 25, 0) == -1) {
            printf("Socket send error\n");
        }

        shutdown(socket_fd, SHUT_RD);
    }

    shutdown(server_fd, SHUT_RD);
    exit(0);
}
```

***客户端Socket编程***

```c
#include<stdio.h>
#include<stdlib.h>
#include<string.h>
#include<sys/types.h>
#include<sys/socket.h>
#include<netinet/in.h>

#define PORT 8888

int main() {
    int socket_fd, length;
    struct sockaddr_in server_addr;
    char buffer[1024];

    if ((socket_fd = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
        printf("Socket init error\n");
        exit(0);
    }

    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(PORT);

    if (connect(socket_fd, (struct sockaddr *) &server_addr, sizeof(server_addr)) == -1) {
        printf("Socket connect error\n");
        exit(0);
    }

    if (send(socket_fd, "I'm a new connection!", 21, 0) == -1) {
        printf("Socket send error\n");
    }

    if ((length = recv(socket_fd, buffer, 1024, 0)) == -1) {
        printf("Socket recv error\n");
    } else {
        buffer[length] = '\0';
        printf("Receive Message: %s\n", buffer);
    }

    shutdown(socket_fd, SHUT_RD);
    exit(0);
}
```

#### Java Socket

Java Socket发送数据实现:

```c
void Java_java_net_SocketOutputStream_socketWrite0(JNIEnv *env, jobject this,
                                                   jobject fdObj,
                                                   jbyteArray data,
                                                   jint off, jint len) {
    // 缓冲区
    char *bufP;
    char BUF[MAX_BUFFER_LEN];
    // 缓冲区长度
    int buflen;
    int fd;

    if (len <= MAX_BUFFER_LEN) {
        bufP = BUF;
        buflen = MAX_BUFFER_LEN;
    } else {
        buflen = min(MAX_HEAP_BUFFER_LEN, len);
        bufP = (char *) malloc((size_t) buflen);

        if (bufP == NULL) {
            bufP = BUF;
            buflen = MAX_BUFFER_LEN;
        }
    }

    while (len > 0) {
        int loff = 0;
        int chunkLen = min(buflen, len);
        int llen = chunkLen;
        
        // 数据copy(Java层 > JNI层)
        (*env)->GetByteArrayRegion(env, data, off, chunkLen, (jbyte *) bufP);

        while (llen > 0) {
            // 每次send长度为llen的数据
            int n = NET_Send(fd, bufP + loff, llen, 0);
            if (n > 0) {
                llen -= n;
                loff += n;
                continue;
            }
            if (bufP != BUF) {
                free(bufP);
            }
            return;
        }
        len -= chunkLen;
        off += chunkLen;
    }

    if (bufP != BUF) {
        free(bufP);
    }
}

int NET_Send(int s, void *msg, int len, unsigned int flags) {
    // 阻塞IO
    BLOCKING_IO_RETURN_INT(s, send(s, msg, len, flags));
}
```

Java Socket接收数据实现:

```c
jint Java_java_net_SocketInputStream_socketRead0(JNIEnv *env, jobject this,
                                                 jobject fdObj, jbyteArray data,
                                                 jint off, jint len, jint timeout) {
    char BUF[MAX_BUFFER_LEN];
    // 缓冲区
    char *bufP;
    jint fd, nread;

    if (len > MAX_BUFFER_LEN) {
        if (len > MAX_HEAP_BUFFER_LEN) {
            len = MAX_HEAP_BUFFER_LEN;
        }
        bufP = (char *) malloc((size_t) len);
        if (bufP == NULL) {
            bufP = BUF;
            len = MAX_BUFFER_LEN;
        }
    } else {
        bufP = BUF;
    }

    // 读取数据
    nread = NET_Read(fd, bufP, len);

    if (nread > 0) {
        // 数据copy(JNI层 > Java层)
        (*env)->SetByteArrayRegion(env, data, off, nread, (jbyte *) bufP);
    }

    if (bufP != BUF) {
        free(bufP);
    }

    return nread;
}

int NET_Read(int s, void *buf, size_t len) {
    // 阻塞IO
    BLOCKING_IO_RETURN_INT(s, recv(s, buf, len, 0));
}
```
