---
layout: dict
title:  Lucene倒排索引
date:   2020-09-23
tags:   [elasticsearch]
---

#### Lucene倒排索引

`Term Index` -&gt; `Term Dictionary` -&gt; `Posting List`

##### Term

##### Term Index(term前缀索引)

term前缀，FST

##### Term Dictionary(term字典)

term字典，对所有的term排序，二分查找

##### Posting List(倒排列表)

有序

<img src="/images/lucene/lucene_index.jpg" style="width: 480px; border-width: 2px 0 2px 2px; border-color: black;" />

#### Lucene查询过程

* 例如，查询条件: `age = 25 and height = 175`
* 先查询条件`age = 25`
    * 从`Term Index`中找到25在`Term Dictionary`的大概位置
    * 从`Term Dictionary`里精确找到25这个term
    * 然后可以得到`age = 25`的`Posting List`
* 同理，再查询条件`height = 175`，可以得到`height = 175`的`Posting List`
* 对两个`Posting List`做一个“与”的合并
    * skip list
    * bitset
