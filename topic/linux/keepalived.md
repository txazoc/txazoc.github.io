---
layout: topic
module: Linux
title:  Keepalived
date:   2017-02-08
---

Keepalived，C实现的路由软件

#### Keepalived HA主备

***master***

```conf
global_defs {
    router_id LVS_DEVEL
}

vrrp_script chk_nginx {
    # 检测脚本
    script "/etc/keepalived/nginx_check.sh"
    # 检测间隔
    interval 2
    weight 2
}

vrrp_instance VI_1 {
    # 主
    state MASTER
    # 网卡
    interface eth0
    virtual_router_id 51
    # 优先级(主 > 备)
    priority 100
    advert_int 1
    notify_master "/etc/keepalived/keepalived-notify.sh 192.168.1.1切换为主机"
    notify_backup "/etc/keepalived/keepalived-notify.sh 192.168.1.1切换为备机"
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    track_script {
        chk_nginx
    }
    # 虚拟ip
    virtual_ipaddress {
        192.168.1.100
        192.168.1.101
    }
    # 单播(针对广播无效的情况)
    unicast_src_ip 192.168.1.1 {
        unicast_peer {
            192.168.1.2
        }
    }
}
```

***backup***

```conf
global_defs {
    router_id LVS_DEVEL
}

vrrp_script chk_nginx {
    # 检测脚本
    script "/etc/keepalived/nginx_check.sh"
    # 检测间隔
    interval 2
    weight 2
}

vrrp_instance VI_1 {
    # 备
    state BACKUP
    # 网卡
    interface eth0
    virtual_router_id 51
    # 优先级(主 > 备)
    priority 99
    advert_int 1
    notify_master "/etc/keepalived/keepalived-notify.sh 192.168.1.2切换为主机"
    notify_backup "/etc/keepalived/keepalived-notify.sh 192.168.1.2切换为备机"
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    track_script {
        chk_nginx
    }
    # 虚拟ip
    virtual_ipaddress {
        192.168.1.100
        192.168.1.101
    }
    # 单播(针对广播无效的情况)
    unicast_src_ip 192.168.1.2 {
        unicast_peer {
            192.168.1.1
        }
    }
}
```

#### Keepalived HA双主

***node1***

```conf
global_defs {
    router_id LVS_DEVEL
}

vrrp_script chk_nginx {
    # 检测脚本
    script "/etc/keepalived/nginx_check.sh"
    # 检测间隔
    interval 2
    weight 2
}

vrrp_instance VI_1 {
    # 主
    state MASTER
    # 网卡
    interface eth0
    virtual_router_id 51
    # 优先级(主 > 备)
    priority 100
    advert_int 1
    notify_master "/etc/keepalived/keepalived-notify.sh 主机192.168.1.1启动"
    notify_backup ""
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    track_script {
        chk_nginx
    }
    # 虚拟ip
    virtual_ipaddress {
        192.168.1.100
        192.168.1.101
    }
    # 单播(针对广播无效的情况)
    unicast_src_ip 192.168.1.1 {
        unicast_peer {
            192.168.1.2
        }
    }
}

vrrp_instance VI_2 {
    # 备
    state BACKUP
    # 网卡
    interface eth0
    virtual_router_id 52
    # 优先级(主 > 备)
    priority 99
    advert_int 1
    notify_master "/etc/keepalived/keepalived-notify.sh 主机192.168.1.2宕机"
    notify_backup ""
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    track_script {
        chk_nginx
    }
    # 虚拟ip
    virtual_ipaddress {
        192.168.1.102
        192.168.1.103
    }
    # 单播(针对广播无效的情况)
    unicast_src_ip 192.168.1.1 {
        unicast_peer {
            192.168.1.2
        }
    }
}
```

***node2***

```conf
global_defs {
    router_id LVS_DEVEL
}

vrrp_script chk_nginx {
    # 检测脚本
    script "/etc/keepalived/nginx_check.sh"
    # 检测间隔
    interval 2
    weight 2
}

vrrp_instance VI_1 {
    # 备
    state BACKUP
    # 网卡
    interface eth0
    virtual_router_id 51
    # 优先级(主 > 备)
    priority 99
    advert_int 1
    notify_master "/etc/keepalived/keepalived-notify.sh 主机192.168.1.1宕机"
    notify_backup ""
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    track_script {
        chk_nginx
    }
    # 虚拟ip
    virtual_ipaddress {
        192.168.1.100
        192.168.1.101
    }
    # 单播(针对广播无效的情况)
    unicast_src_ip 192.168.1.2 {
        unicast_peer {
            192.168.1.1
        }
    }
}

vrrp_instance VI_2 {
    # 主
    state MASTER
    # 网卡
    interface eth0
    virtual_router_id 52
    # 优先级(主 > 备)
    priority 100
    advert_int 1
    notify_master "/etc/keepalived/keepalived-notify.sh 主机192.168.1.2启动"
    notify_backup ""
    authentication {
        auth_type PASS
        auth_pass 1111
    }
    track_script {
        chk_nginx
    }
    # 虚拟ip
    virtual_ipaddress {
        192.168.1.102
        192.168.1.103
    }
    # 单播(针对广播无效的情况)
    unicast_src_ip 192.168.1.2 {
        unicast_peer {
            192.168.1.1
        }
    }
}
```

***/etc/keepalived/nginx_check.sh***

```bash
#!/bin/bash
#
# Description: Check nginx status

if [ `ps -C nginx --no-header | wc -l` -eq 0 ]; then
    /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
fi

sleep 2

if [ `ps -C nginx --no-header | wc -l` -eq 0 ]; then
    killall keepalived
fi
```

***/etc/keepalived/keepalived-notify.sh***

```bash
#!/bin/bash
#
# Description: Send keepalived notify mail

send_mail() {
    echo $1 | mail -s "Keepalived Notify" txazo1218@163.com
}

send_mail $1
```
