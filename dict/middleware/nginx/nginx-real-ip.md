---
layout: home
title:  Nginx真实IP
date:   2020-09-19
tags:   [nginx]
---

***场景***:

* `Client`: 192.168.1.10
* `Nginx Proxy 1`: 192.168.1.101
* `Nginx Proxy 2`: 192.168.1.102
* `Server`: 192.168.1.20

<img src="/images/topic/server/nginx-real-ip.png" style="width: 200px" title="Nginx真实IP" alt="Nginx真实IP" />

***Nginx Proxy 1: 192.168.1.101***

```nginx
location / {
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://192.168.1.102:8080;
}
```

***Nginx Proxy 2: 192.168.1.102***

```nginx
location / {
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_pass http://192.168.1.20:8080;
}
```

在`Nginx Proxy 2`中请求的Header:

```http
X-Real-IP: 192.168.1.10
X-Forwarded-For: 192.168.1.10
```

在`Server`中请求的Header:

```http
X-Real-IP: 192.168.1.10
X-Forwarded-For: 192.168.1.10,192.168.1.101
```

`$remote_addr`代表客户端的ip

`$proxy_add_x_forwarded_for`的作用是将`$remote_addr`添加到`X-Forwarded-For`后面，以逗号分隔
