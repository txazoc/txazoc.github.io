---
layout: topic
module: 项目总结
title:  Android渠道包更新
date:   2016-12-14
---

#### Android渠道包

首先，Android版本升级，都会打相应版本的apk包

其次，在市场投放时，为方便分渠道统计用户安装apk包后的注册、激活等数据，将渠道名写入到apk包中，即为渠道包

打包时，指定`渠道名`和`版本号`，就可以打出相应版本的渠道包

渠道包命名规则: 前缀\_渠道名\_版本号.apk，例如: `dp_uc_1.2.1.apk`

#### 综合链接

`综合链接`: 对外市场投放的Android下载链接

综合链接由`综合链接id`唯一标识，综合链接id对应一个渠道包下载链接，例如:

* 综合链接: [http://www.dp.com/link?id=1245](http://www.dp.com/link?id=1245)
* 综合链接id: 1245
* 渠道包下载链接: [http://www.dpfile.com/download/channel/apk/dp_uc_1.0.1.apk](http://www.dpfile.com/download/channel/apk/dp_uc_1.0.1.apk)

当访问综合链接 [http://www.dp.com/link?id=1245](http://www.dp.com/link?id=1245) 时，会跳转到渠道包下载链接 [http://www.dpfile.com/download/channel/apk/dp_uc_1.0.1.apk](http://www.dpfile.com/download/channel/apk/dp_uc_1.0.1.apk) ，下载渠道包

市场投放时，只投放综合链接 [http://www.dp.com/link?id=1245](http://www.dp.com/link?id=1245) ，当Android版本升级或更换渠道投放时，打新的渠道包并更新渠道包下载链接即可

![综合链接](/images/topic/project/channel-apk-update-1.png =540x)

#### 传统的渠道包更新方式

* 打渠道包: 渠道名 + 版本号
* 上传渠道包到ftp服务器
* 更新指定综合链接id的渠道包下载链接

传统的渠道包更新方式，需要三步手动操作，效率低且容易出错

#### 渠道包一键更新

***1. 引入渠道模板***

渠道模板就是综合链接id和渠道名的映射集合

映射关系: 多对一，一个综合链接id可以映射多个渠道名

渠道模板示例:

| 综合链接id | 渠道名 |
| ---       | ---   |
| 1001      | name_1 |
| 1002      | name_1 |
| 1003      | name_2 |
| 1004      | name_3 |

***2. 一键更新任务***

选择版本号和渠道模板，创建渠道包更新任务，实现一键更新

具体的更新步骤包括:

* 提交版本号和渠道模板中的渠道名集合到Android打包系统
* Android打包平台根据版本号和渠道名打渠道包，按照渠道包命名规则命名
* 渠道包打包成功后，通知渠道包更新系统，附带任务id和渠道包的根路径
* 渠道包更新系统生成各个渠道包的链接，下载并上传到ftp服务器
* 进行cdn预热，生成渠道包下载链接
* 根据渠道模板中的映射关系，更新相应综合链接id的渠道包下载链接

***3. 版本升级自动更新*** 
