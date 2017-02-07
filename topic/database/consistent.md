---
layout: topic
module: 数据库
title:  数据一致性
date:   2017-01-31
---

并发修改数据库容易引发数据一致性问题

#### CAS保证数据一致性

```sql
update User set balance = #balance# where id = #id# and updateTime = #updateTime# limit 1
```

```sql
update User set balance = #newBalance# where id = #id# and balance = #oldBalance# limit 1
```

#### 数据库锁保证数据一致性
