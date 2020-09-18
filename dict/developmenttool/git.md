---
layout: home
title:  Git
date:   2020-09-19
tags:   [git]
---

#### Git别名

```linux
git config --global alias.br 'branch'

git config --global alias.co 'checkout'
git config --global alias.ad 'add'
git config --global alias.cm 'commit -am'

git config --global alias.rs 'reset HEAD'
git config --global alias.rb 'checkout --'
git config --global alias.rollback 'checkout --'

git config --global alias.ps 'push origin'
git config --global alias.pl 'pull origin'

git config --global alias.df 'diff'
git config --global alias.st 'status'

git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit"
```

#### Git SSH Key

配置支持多个SSH Key

```linux
cd ~/.ssh
ssh-keygen -t rsa -C "txazo1218@163.com" -f id_rsa_github
vi config
```

```config
Host github_chaugod
     HostName github.com
     User git
     Port 22
     IdentityFile ~/.ssh/id_rsa_chaugod

Host github_txazoc
     HostName github.com
     User git
     Port 22
     IdentityFile ~/.ssh/id_rsa_txazoc
```
