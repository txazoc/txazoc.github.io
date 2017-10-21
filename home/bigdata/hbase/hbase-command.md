---
layout: home
title:  HBase命令
date:   2017-10-20
---

```linux
bin/hbase shell
```

#### 通用命令

```shell
status
version
table_help
whoami
```

#### 表操作

```shell
create 'test', 'cf1', 'cf2', 'cf3'

desc 'test'

put 'test', '1', 'cf1:c1', '11'
put 'test', '1', 'cf1:c2', '12'
put 'test', '1', 'cf2:c1', '21'
put 'test', '1', 'cf2:c2', '22'
put 'test', '1', 'cf3:c1', '31'
put 'test', '1', 'cf3:c2', '32'

scan 'test'
get 'test', '1'
get 'test', '1', 'cf1'
get 'test', '1', 'cf1:c1'
get 'test', '1', ['cf1', 'cf2:c1']
get 'test', '1', {COLUMN => 'cf1'}
get 'test', '1', {COLUMN => ['cf1', 'cf2:c1']}
count 'test'
```

#### 表变量

```shell
t = create 't', 'f'
# t = get_table 't'
t.describe
t.put 'r', 'f', 'v'
t.scan
```
