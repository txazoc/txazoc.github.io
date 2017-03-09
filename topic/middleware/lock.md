---
layout: topic
module: 中间件
title:  分布式锁
date:   2017-01-31
---

***场景***

* 多线程环境
* 分布式环境

***实现原理***

利用一个公共资源来实现互斥

***分布式锁***

* Zookeeper
* Redis: setnx
* Memcached: add

#### Zookeeper实现分布式锁

#### Redis实现分布式锁

```java
public void lock(String key) {
    int timeout = 10;
    while (true) {
        try {
            // 尝试获取锁
            if (jedis.setnx(key, String.valueOf(System.currentTimeMillis() + timeout)) == 1) {
                jedis.expire(key, timeout);
                return;
            } else {
                String oldValue = jedis.get(key);
                // 锁超时
                if (oldValue != null && Long.valueOf(oldValue) < System.currentTimeMillis()) {
                    String value = jedis.getSet(key, String.valueOf(System.currentTimeMillis() + timeout));
                    if (oldValue.equals(value)) {
                        jedis.expire(key, timeout);
                        return;
                    }
                }
            }

            Thread.sleep(100);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```

#### Memcached实现分布式锁
