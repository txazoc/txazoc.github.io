---
layout:     article
published:  true
title:      Centos 6.5搭建PPTP VPN
date:       2016-02-16
categories: [linux]
tags:       [linux, vpn]
---

## 安装PPTP

为了简便，直接使用yum的方式进行安装。安装成功后，将pptpd和iptables加入到开机自启动。

```bash
yum install -y ppp iptables pptpd
chkconfig pptpd on
chkconfig iptables on
```

## 配置PPTP

#### 1. 设置VPN的IP地址

/etc/pptpd.conf末尾添加如下两行，localip代表VPN主机的地址，remoteip代表给连接VPN的远程主机分配的IP地址。

```bash
localip 192.168.0.1
remoteip 192.168.0.2-254
```

#### 2. 配置主备DNS

/etc/ppp/options.pptpd中取消ms-dns前后的注释并修改如下，ms-dns代表的是VPN主机使用的DNS服务器地址

```bash
ms-dns 8.8.8.8
ms-dns 8.8.4.4
```

#### 3. 设置VPN账号和密码

/etc/ppp/chap-secrets末尾加入一行, user为用户名，passwd为密码，*代表所有主机都可以连接

```bash
user pptpd passwd *
```

#### 4. 开启转发

/etc/sysctl.conf中net.ipv4.ip_forward设置为1，开启IP转发功能。

```bash
net.ipv4.ip_forward = 1
```

```bash
sysctl -p
```

#### 5. 设置防火墙转发规则

```bash
iptables -t nat -F
iptables -t nat -A POSTROUTING -s 192.168.0.0/24 -j MASQUERADE
iptables -t nat -A POSTROUTING -s 192.168.0.0/24 -j SNAT --to-source 112.124.6.220
```

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
