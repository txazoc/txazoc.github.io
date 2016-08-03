---
layout:     article
categories: [jvm]
title:      Mac编译OpenJDK 7
tags:       [openjdk]
date:       2016-08-02
---

系统版本:

* Mac OS X YoseMite 10.10.2
* JDK 1.6.0
* Xcode 6.2
* XQuartz 2.7.9
* CUPS 2.1.4
* GNU Make 3.81

#### 下载OpenJDK源码

* 源码下载方式一:

使用`Mercurial`获取OpenJDK的源码，这种方式比较慢，还有可能中断。

```sh
hg clone http://hg.openjdk.java.net/jdk7u/jdk7u
cd jdk7u
bash ./get_source.sh
```

* 源码下载方式二:

下载网盘: [https://pan.baidu.com/s/1kUIK5YR#path=%252Fopenjdk](https://pan.baidu.com/s/1kUIK5YR#path=%252Fopenjdk) 中的`jdk7u.tar.gz`文件，然后解压缩。

#### 安装JDK1.6

Mac版的`jdk 1.6`下载地址: [https://support.apple.com/kb/DL1572](https://support.apple.com/kb/DL1572) 。

#### 安装Xcode

安装`Xcode`，直接通过App Store安装。

安装`Command Line Tools`:

```c
xcode-select --install
```

创建软链接:

```c
sudo ln -s /usr/bin/llvm-gcc /Applications/Xcode.app/Contents/Developer/usr/bin/llvm-gcc
sudo ln -s /usr/bin/llvm-g++ /Applications/Xcode.app/Contents/Developer/usr/bin/llvm-g++
```

#### 安装XQuartz

下载`XQuartz`并安装，安装完成后，执行下面的命令:

```sh
sudo ln -s /usr/X11/include/X11 /usr/include/X11
sudo ln -s /usr/X11/include/freetype2/freetype/ /usr/X11/include/freetype
```

XQuartz中包含`X11`和`freetype`。

#### 安装CUPS

```sh
wget https://github.com/apple/cups/releases/download/release-2.1.4/cups-2.1.4-source.tar.gz
tar -zxvf cups-2.1.4-source.tar.gz
cd cups-2.1.4-source
./configure --prefix=/usr/local/cups
make
make install
```

#### 配置环境变量

```sh
export LANG=C
export ALT_BOOTDIR=`/usr/libexec/java_home -v 1.6.0`
export ALT_CUPS_HEADERS_PATH="/usr/local/cups/include"
export ALLOW_DOWNLOADS=true
export USE_PRECOMPILED_HEADER=true
export SKIP_DEBUG_BUILD=false
export SKIP_FASTDEBUG_BUILD=false
export DEBUG_NAME=debug
unset CLASSPATH
unset JAVA_HOME
```

#### 编译检查

运行下面的命令进行编译检查:

```sh
make sanity
```

编译检查通过，输出如下:

```console
Sanity check passed.
```

#### 开始编译

运行下面的命令开始编译:

```sh
sudo make CC=clang COMPILER_WARNINGS_FATAL=false LFLAGS='-Xlinker -lstdc++' USE_CLANG=true LANG=C LP64=1 ARCH_DATA_MODEL=64 HOTSPOT_BUILD_JOBS=8 ALT_BOOTDIR=/Library/Java/Home _JAVA_OPTIONS=-Dfile.encoding=ASCII fastdebug_build
```

编译过程中可能会遇到下面的报错:

```error
clang: error: unknown argument: '-fpch-deps'
```

解决办法，修改文件`hotspot/make/bsd/makefiles/gcc.make`:

```c
# 注释掉这一行
# DEPFLAGS = -fpch-deps -MMD -MP -MF $(DEP_DIR)/$(@:%=%.d)
# 添加下面的代码
DEPFLAGS = -MMD -MP -MF $(DEP_DIR)/$(@:%=%.d)  
ifeq ($(USE_CLANG),)  
  ifneq ($(CC_VER_MAJOR), 2)  
    DEPFLAGS += -fpch-deps  
  endif  
endif
```

修改文件`hotspot/src/share/vm/code/relocInfo.hpp`:

```c
# inline friend relocInfo prefix_relocInfo(int datalen = 0);
# 替换为下面一行
inline friend relocInfo prefix_relocInfo(int datalen);

# inline relocInfo prefix_relocInfo(int datalen) {
# 替换为下面一行
inline relocInfo prefix_relocInfo(int datalen = 0) {
  assert(relocInfo::fits_into_immediate(datalen), "datalen in limits");
  return relocInfo(relocInfo::data_prefix_tag, relocInfo::RAW_BITS, relocInfo::datalen_tag | datalen);
}
```

#### 编译完成

编译完成，输出如下:

```console
########################################################################
##### Leaving jdk for target(s) sanity all  images                 #####
########################################################################
##### Build time 00:09:16 jdk for target(s) sanity all  images     #####
########################################################################

#-- Build times ----------
Target fastdebug_build
Start 2016-08-02 23:40:44
End   2016-08-02 23:50:33
00:00:11 corba
00:00:14 hotspot
00:00:02 jaxp
00:00:03 jaxws
00:09:16 jdk
00:00:03 langtools
00:09:49 TOTAL
-------------------------
```

编译结果: `build/macosx-x86_64`目录，目录的结构如下:

* **bin/**: 二进制文件
* **hotspot/**: jvm

运行编译的jdk:

```console
$ bin/java -version

openjdk version "1.7.0-internal"
OpenJDK Runtime Environment (build 1.7.0-internal-root_2016_08_02_16_51-b00)
OpenJDK 64-Bit Server VM (build 24.95-b01, mixed mode)
```
