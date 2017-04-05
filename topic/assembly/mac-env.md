---
layout: topic
module: 汇编
title:  Mac下搭建汇编环境
tags:   ['mac', 'dosbox', '汇编']
date:   2017-04-05
---

#### 下载安装DOSBox

在 [DOSBox](http://www.dosbox.com/) 上下载DOSBox的安装包，在`应用程序`中创建dosbox文件夹，打开安装包，将安装包中的内容复制到dosbox目录下

#### 下载DEBUG.EXE

下载DEBUG.EXE，在当前用户目录下创建文件`~/Assembly/debug`，将下载的DEBUG.EXE复制到`~/Assembly/debug`里面

#### 配置DOSBox

打开DOSBox，执行命令`config -writeconfig dosbox.conf`，在DOSBox目录下会创建`dosbox.conf`配置文件

修改`dosbox.conf`配置文件

```conf
[autoexec]
mount c ~/Assembly/debug
c:
```

#### DOSBox运行效果

<img src="/images/topic/assembly/dosbox.png" alt="DOSBox" width="480" style="padding: 3px">
