---
layout: dict
title:  Git
date:   2020-09-19
tags:   [git]
---

#### jar包解压

* `jar -xvf test.jar`

#### 查看端口占用

* `lsof -i`
* `lsof -i :8080`
* `lsof -i tcp:8080`

#### sudo免密

```
sudo chmod u+w /etc/sudoers
sudo vi /etc/sudoers

// 添加一行
`<username>   ALL=(ALL) NOPASSWD: ALL`

sudo chmod u-w /etc/sudoers
```
