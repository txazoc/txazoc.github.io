---
layout:     article
categories: [jvm]
title:      Mac编译OpenJDK 7
tags:       [openjdk]
date:       2016-08-02
---

#### 下载OpenJDK源码

方式一:

```sh
hg clone http://hg.openjdk.java.net/jdk8/jdk8
cd jdk8
bash ./get_source.sh
```

方式二:

[http://pan.baidu.com/s/1kUIK5YR](http://pan.baidu.com/s/1kUIK5YR)

以上是通过VPN下载得最新的OpenJDK源码，包括`jdk7`、`jdk7u`、`jdk8`、`jdk8u`

#### 要求

* GNU Make 3.81
* Xcode 4.1
* XQuartz(X11)
* CUPS
