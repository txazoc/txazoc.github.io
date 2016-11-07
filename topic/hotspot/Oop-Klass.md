---
layout: topic
module: HotSpot
title:  Oop/Klass
date:   2016-10-25
---

#### 对象头(markOop)

#### 对象(instanceOop)

```console
instanceOop {
    markOop     _mark       // 对象头
    _metadata   _metadata   // 元数据指针
    ...                     // 实例数据
}
```

#### 数组(arrayOop)

```console
arrayOop {
    markOop     _mark       // 对象头
    _metadata   _metadata   // 元数据指针
    jint        length      // 数组长度
    ...                     // 实例数据
}
```

```console
typedef juint narrowOop;
typedef class klassOopDesc* wideKlassOop;

union _metadata {
    wideKlassOop    _klass
    narrowOop       _compressed_klass   // 压缩指针
}
```

#### Java类(instanceKlass)

```console
instanceKlass {
    
}
```
