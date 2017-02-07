---
layout: topic
module: 服务器
title:  Nginx负载均衡
date:   2017-02-07
---

轮询(默认)

```nginx
upstream txazo {
    server 192.168.1.2;
    server 192.168.1.3;
}
```

ip哈希

```nginx
upstream txazo {
    ip_hash;
    server 192.168.1.2;
    server 192.168.1.3;
}
```

加权轮询

```nginx
upstream txazo {
    server 192.168.1.2 weight=2;
    server 192.168.1.3 weight=2;
    server 192.168.1.4 backup;
}
```

反向代理

```nginx
server {
    listen 80;
    server_name txazo;
    location / {
        proxy_pass http://txazo;
        proxy_set_header Host               $host;
        proxy_set_header X-Real-IP          $remote_addr;
        proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
    }
}
```
