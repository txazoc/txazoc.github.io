---
layout:     article
categories: [linux]
title:      CentOS搭建VPN
tags:       [linux, vpn]
date:       2016-02-16
---

最近，在阿里云上买了一台美国的云服务器ECS，并在上面搭建了VPN服务器，然后就可以使用VPN可以访问Google了。

下面，介绍下CentOS下VPN的完整搭建流程。

## 安装PPTP

为了简便，直接使用yum的方式进行安装。安装成功后，将pptpd和iptables加入到开机自启动。

```bash
yum install -y ppp iptables pptpd
chkconfig pptpd on
chkconfig iptables on
```

## 配置PPTP

#### 1. 设置VPN的IP地址

`/etc/pptpd.conf`文件末尾添加下面两行，`localip`代表VPN主机的IP地址，`remoteip`代表给连接VPN的远程主机分配的IP地址。

```bash
localip 192.168.0.1
remoteip 192.168.0.2-254
```

#### 2. 配置主备DNS

`/etc/ppp/options.pptpd`文件中取消ms-dns前后的注释并修改如下，`ms-dns`代表的是VPN主机使用的DNS服务器的IP地址。

```bash
ms-dns 8.8.8.8
ms-dns 8.8.4.4
```

#### 3. 设置VPN账号和密码

`/etc/ppp/chap-secrets`文件末尾加入下面一行, `user`为用户名，`passwd`为密码，`*`代表所有主机都可以连接。

```bash
user pptpd passwd *
```

#### 4. 开启IP转发

`/etc/sysctl.conf`文件中`net.ipv4.ip_forward`设置为1，开启IP转发功能。

```bash
net.ipv4.ip_forward = 1
```

执行`sysctl -p`，使修改的配置生效。

```bash
sysctl -p
```

#### 5. 设置防火墙转发规则

添加防火墙转发规则。

```bash
iptables -t nat -F
iptables -t nat -A POSTROUTING -s 192.168.0.0/24 -j MASQUERADE
iptables -t nat -A POSTROUTING -s 192.168.0.0/24 -j SNAT --to-source 112.124.6.220
```

重启`iptables`，使配置生效。

```bash
/etc/init.d/iptables save
/etc/init.d/iptables restart
```

## 重启PPTP

配置完成后，重启下PPTP，就ok了。

```bash
/etc/init.d/pptpd restart-kill
/etc/init.d/pptpd start
```

最后，提供一个完整的安装脚本。

```bash
#!/bin/bash
#
# OS: CentOS 6.5
# Description: auto install pptp vpn

# config
msdns1="8.8.8.8"
msdns2="8.8.4.4"
user="txazo"
passwd="txazovpn1218"
publicip="112.74.48.128"
color="\033[40;36m"

# 安装PPTP
echo -e "${color}Install ppp iptables pptpd${color}"
yum install -y ppp iptables pptpd
chkconfig pptpd on
chkconfig iptables on

# 设置VPN的IP地址
echo -e "${color}\nConfig /etc/pptpd.conf${color}"
sed -i '0,/^#localip .*/s//localip 192.168.0.1/' /etc/pptpd.conf
sed -i '0,/^#remoteip .*/s//remoteip 192.168.0.2-254/' /etc/pptpd.conf

# 配置主备DNS
echo -e "${color}\nConfig /etc/ppp/options.pptpd${color}"
sed -i "0,/^#ms-dns .*/s//ms-dns $msdns1/" /etc/ppp/options.pptpd
sed -i "0,/^#ms-dns .*/s//ms-dns $msdns2/" /etc/ppp/options.pptpd

# 配置VPN账号和密码
echo -e "${color}\nConfig /etc/ppp/chap-secrets${color}"
sed -i "/$/a $user pptpd $passwd *" /etc/ppp/chap-secrets

# 开启转发
echo -e "${color}\nConfig /etc/sysctl.conf${color}"
sed -i '/^net.ipv4.ip_forward.*/s//net.ipv4.ip_forward = 1/' /etc/sysctl.conf
sysctl -p

# 设置防火墙转发规则
echo -e "${color}\nAdd iptables routing${color}"
iptables -t nat -F
iptables -t nat -A POSTROUTING -s 192.168.0.0/24 -j MASQUERADE
iptables -t nat -A POSTROUTING -s 192.168.0.0/24 -j SNAT --to-source ${publicip}

# 防火墙规则生效
echo -e "${color}\nRestart iptables${color}"
/etc/init.d/iptables save
/etc/init.d/iptables restart

# 重启PPTP
echo -e "${color}\nRestart pptpd${color}"
/etc/init.d/pptpd restart-kill
/etc/init.d/pptpd start

echo -e "${color}\nInstall success!\n${color}"
```
