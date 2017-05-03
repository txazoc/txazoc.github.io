---
layout: topic
module: Python
title: 模块安装问题
---

#### Mac下安装mysql-python

报错`Library not loaded: libmysqlclient.18.dylib`

添加环境变量`export DYLD_LIBRARY_PATH=/usr/local/mysql/lib`到文件`~/.bash_profile`，执行`source .bash_profile`

执行软链接:

```bash
sudo ln -s /usr/local/mysql/lib /usr/local/mysql/lib/mysql
sudo ln -s /usr/local/mysql/lib/libmysqlclient.18.dylib /usr/lib/libmysqlclient.18.dylib
```
