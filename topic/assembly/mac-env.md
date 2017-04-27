---
layout: topic
module: 汇编
title:  Mac下搭建汇编开发环境
tags:   ['mac', 'dosbox', '汇编']
date:   2017-04-05
---

#### 下载安装DOSBox

在 [DOSBox](http://www.dosbox.com/) 上下载DOSBox的安装包，在`应用程序`中创建`dosbox`文件夹，打开安装包，将安装包中的内容复制到`dosbox`目录下

#### 下载LINK.EXE、MASM.EXE、DEBUG.EXE

在当前用户目录下创建文件`~/Assembly/bin`，下载LINK.EXE、MASM.EXE、DEBUG.EXE并复制到`~/Assembly/bin`里面

#### 配置DOSBox

打开DOSBox，执行命令`config -writeconfig dosbox.conf`，在`dosbox`目录下会创建`dosbox.conf`配置文件

修改`dosbox.conf`配置文件

```conf
[autoexec]
mount c ~/Assembly
path=path;c:\bin
c:
```

#### 运行DOSBox

![DOSBox](/images/topic/assembly/dosbox.png =480x)

#### 汇编编辑器

下载`Sublime Text 3`，安装插件`FASM x86`

![Sublime Text 3](/images/topic/assembly/sublime.png =480x)