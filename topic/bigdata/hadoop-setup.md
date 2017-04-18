---
layout: topic
module: 大数据
title:  Hadoop安装
date:   2017-04-07
---

#### 环境说明

* 系统: CentOS Linux release 7.3.1611 (Core) 
* JDK: 1.8.0_121
* Hadoop: 2.7.3

#### 1. 创建hadoop用户

```linux
$ su root
$ useradd -m hadoop -s /bin/bash
$ passwd hadoop
```

给hadoop用户添加管理员权限

```linux
$ visudo
```

```conf
root    ALL=(ALL)       ALL
hadoop  ALL=(ALL)       ALL
```

#### 2. 安装SSH

先检验SSH是否已安装，若未安装，则先安装SSH

```linux
$ rpm -qa | grep ssh
openssh-clients-6.6.1p1-33.el7_3.x86_64
openssh-server-6.6.1p1-33.el7_3.x86_64
libssh2-1.4.3-10.el7_2.1.x86_64
openssh-6.6.1p1-33.el7_3.x86_64
```

测试SSH是否可用

```linux
ssh localhost
```

配置SSH无密码登陆

```linux
$ cd ~/.ssh
$ ssh-keygen -t rsa -P '' -f id_rsa
$ cat id_rsa.pub >> authorized_keys
$ chmod 0600 authorized_keys
```

#### 3. 安装Java环境

```linux
$ wget --no-cookie --no-check-certificate --header "Cookie: s_cc=true;oraclelicense=accept-securebackup-cookie;gpw_e24=http%3A%2F%2Fwww.oracle.com%2F" http://download.oracle.com/otn-pub/java/jdk/8u121-b13/e9e7ea248e2c4826b92b3f075a80e441/jdk-8u121-linux-x64.rpm
$ rpm -ivh jdk-8u121-linux-x64.rpm
$ sudo sed -i '/^export PATH/a export JAVA_HOME="/usr/java/jdk1.8.0_121"\nexport PATH="$PATH:$JAVA_HOME/bin:$JAVA_HOME/jre/bin"\nexport CLASSPATH=".:$JAVA_HOME/lib:$JAVA_HOME/jre/lib"' /etc/profile
$ source /etc/profile
```

测试Java是否安装成功

```linux
$ java -version
```

#### 4. 安装Hadoop

去Hadoop官网上下载`.tar.gz`格式得安装包，hadoop-2.7.3.tar.gz
l
```linux
$ tar -zxvf hadoop-2.7.3.tar.gz -C /usr/local
$ cd /usr/local
$ ln -s hadoop-2.7.3 hadoop
$ sudo chown -R hadoop:hadoop hadoop hadoop-2.7.3
```

配置JAVA_HOME，修改etc/hadoop/hadoop-env.sh中JAVA_HOME

```conf
export JAVA_HOME=/usr/java/latest
```

测试Hadoop是否安装成功

```linux
$ cd /usr/local/hadoop
$ bin/hadoop version
```
