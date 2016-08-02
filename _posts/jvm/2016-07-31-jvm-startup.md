---
layout:     article
published:  false
categories: [jvm]
title:      JVM启动分析
tags:       [jvm]
date:       2016-07-31
---

JVM启动入口: `openjdk/jdk/src/share/bin/main.c`的`main()`函数。

`main()`调用`JLI_Launch()`。

`/Users/txazo/TxazoProject/openjdk/jdk/src/share/bin/java.c`

#### 

# GNU Make 3.81
make -version

```sh
export LANG=C
export ALT_BOOTDIR=`/usr/libexec/java_home -v 1.6.0`
export ALT_CUPS_HEADERS_PATH="/usr/local/cups-2.1.4/include"
export ALLOW_DOWNLOADS=true
export USE_PRECOMPILED_HEADER=true
unset CLASSPATH
unset JAVA_HOME

#export SKIP_DEBUG_BUILD=false
#export SKIP_FASTDEBUG_BUILD=true
#export DEBUG_NAME=debug

export ALT_FREETYPE_LIB_PATH=/usr/local/freetype/lib
export ALT_FREETYPE_HEADERS_PATH=/usr/local/freetype/include/freetype2

sudo ln -s /usr/bin/llvm-gcc /Applications/Xcode.app/Contents/Developer/usr/bin/llvm-gcc
sudo ln -s /usr/local/cups-2.1.4/include /usr/include/cups

make sanity

sudo export _JAVA_OPTIONS=-Dfile.encoding=ASCII
sudo make CC=clang COMPILER_WARNINGS_FATAL=false LFLAGS='-Xlinker -lstdc++' USE_CLANG=true LANG=C LP64=1 ARCH_DATA_MODEL=64 HOTSPOT_BUILD_JOBS=8 ALT_BOOTDIR=/Library/Java/Home ALT_CUPS_HEADERS_PATH=/usr/local/cups-2.1.4/include _JAVA_OPTIONS=-Dfile.encoding=ASCII fastdebug_build 2>&1 > /Users/txazo/OpenJdk/openjdk/build.log
```

#### 乱码问题
sudo find build/macosx-x86_64-fastdebug/corba/gensrc/org/ -name '*.java' | while read p; do native2ascii -encoding UTF-8 $p > tmpj; sudo mv -f tmpj $p; done


```console
sudo ln -s /usr/X11/include/X11 /usr/include/X11
sudo ln -s /usr/X11/include/freetype2/freetype/ /usr/X11/include/freetype

ERROR: The Compiler version is undefined.

ERROR: FreeType version  2.3.0  or higher is required. 
 /bin/mkdir -p /Users/txazo/OpenJdk/openjdk/build/macosx-x86_64/btbins
rm -f /Users/txazo/OpenJdk/openjdk/build/macosx-x86_64/btbins/freetype_versioncheck
Failed to build freetypecheck.

ERROR: You do not have access to valid Cups header files. 
       Please check your access to 
           /usr/include/cups/cups.h 
       and/or check your value of ALT_CUPS_HEADERS_PATH, 
       CUPS is frequently pre-installed on many systems, 
       or may be downloaded from http://www.cups.org
```


```
fatal error: 'JavaNativeFoundation/JavaNativeFoundation.h' file
      not found
#import <JavaNativeFoundation/JavaNativeFoundation.h>
```

```
Picked up _JAVA_OPTIONS: -Dfile.encoding=ASCII
Error: time is more than 10 years from present: 1136059200000
java.lang.RuntimeException: time is more than 10 years from present: 1136059200000
	at build.tools.generatecurrencydata.GenerateCurrencyData.makeSpecialCaseEntry(GenerateCurrencyData.java:285)
	at build.tools.generatecurrencydata.GenerateCurrencyData.buildMainAndSpecialCaseTables(GenerateCurrencyData.java:225)
	at build.tools.generatecurrencydata.GenerateCurrencyData.main(GenerateCurrencyData.java:154)
```

```
../../../src/solaris/native/java/net/net_util_md.c:117:9: error: non-void function 'getDefaultScopeID' should return a
      value [-Wreturn-type]
        CHECK_NULL(c);
```