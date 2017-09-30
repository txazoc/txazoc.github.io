---
layout: homelist
title: 延时消息
date: 2017-09-30
---

#### 延时消息级别

```console
1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h
1  2  3   4   5  6  7  8  9  10 11 12 13 14  15  16  17 18
```

```java
Message message = new Message();
// 延时10s
message.setDelayTimeLevel(3);
```
