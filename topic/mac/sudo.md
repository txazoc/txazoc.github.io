---
layout: topic
module: Mac
title:  sudo免密
---

```shell
sudo chmod u+w /etc/sudoers
sudo vi /etc/sudoers
```

`username   ALL=(ALL) NOPASSWD: ALL`

```shell
sudo chmod u-w /etc/sudoers
```
