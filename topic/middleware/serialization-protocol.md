---
layout: topic
module: 中间件
title:  序列化协议
date:   2016-12-30
---

在远程调用中，要传递结构化的数据，包含三种类型:

* 基本类型
* 结构体
* 集合

针对结构化的数据，会进行相应的序列化和反序列化

常见的序列化协议有java原生序列化、xml、json、hessian、thrift、protobuf

#### java原生序列化

#### xml

#### json

使用标准的json格式

优点:

* 可读性强

缺点:

* 非二进制
* key、分隔符(`{}[]:,`)

#### hessian

[Hessian 2.0序列化协议文档](http://hessian.caucho.com/doc/hessian-serialization.html)

#### thrift

#### 点评App API数据协议 - NVObject

NVObject协议同hessian比较相似，包含以下几种类型

***1. 基本类型***

基本类型格式: 标志符(1字节) + 值

| 类型    | 标志符 | 值(字节) |
| ---    | ---   | ---     |
| int    | `I`     | 4  |
| long   | `L`     | 8  |
| double | `D`     | 8  |
| true   | `T`     | 0  |
| false  | `F`     | 0  |

byte、short使用int表示，float使用double表示

***2. NULL***

NULL格式: 标志符`N`

***3. 时间***

时间格式: 标志符`U` + int(4字节)

时间被转换为秒使用int表示

***4. 字符串***

字符串格式: 标志符`S` + 长度(2字节) + 字符串byte[]

字符串长度限制32767

***5. 数组***

数组格式: 标志符`A` + 长度(2字节) + (NVObject1 [NVObject2 ...])

数组大小限制32767

***6. 对象***

* 对象格式: 开始标志符`O` + 对象名hash(2字节) + (对象成员1 [对象成员2 ...]) + 结束标志符`Z`
* 对象成员格式: 成员标志符`M` + 成员名hash(2字节) + NVObject

`注:` NVObject代表上面的6种类型

下面来重点解释下对象名hash和成员名hash，要解释这些，得先说下点评API得对象模型

***点评API的对象模型***

对象模型包含:

* 成员名
* 成员类型: 支持基本类型、字符串、时间、数组、对象
* hash: 成员名的hash值，由统一的hash算法生成

定义一个新的API时，先创建对应的对象模型，然后，后端开发和App开发根据定义好的对象模型进行开发

下面给出一个简答的对象模型的示例子:

对象Item

| 成员名  | 成员类型 | hash   |
| ---    | ---    | ---    |
| type   | int    | 0x372  |
| name   | string | 0x7ab8 |
| icon   | string | 0xb0bb |

对象Content

| 成员名  | 成员类型 | hash   |
| ---    | ---    | ---    |
| title  | string | 0x36e9 |
| item   | Item   | 0x2a78 |

下面，再回到上面的对象名hash和成员名hash，它们的作用就是在反序列化时匹配相应的成员
