---
layout: topic
module: 项目总结
title:  统一订单中心
date:   2016-12-14
---

#### 统一订单中心简介

统一订单中心是，各业务通过统一订单中心接入到大众点评App我的订单

大众点评App - 我的订单列表页:

<img src="/images/topic/project/uniorder/order.jpg" style="width: 240px" title="我的订单列表" />

<img src="/images/topic/project/uniorder/uniordermonitor.png" style="width: 540px" title="统一订单中心监控" />

#### 统一订单模型

#### 统一订单服务

```java
public interface UniOrderService {

    List<UniOrder> getAllOrders(UniOrderRequest request);

    List<UniOrder> getAvailableOrders(UniOrderRequest request);

    List<UniOrder> getUnpaidOrders(UniOrderRequest request);

    List<UniOrder> getRefundOrders(UniOrderRequest request);

    int getAvailableOrderCount(UniOrderCountRequest request);

    int getUnpaidOrderCount(UniOrderCountRequest request);

    int getRefundOrderCount(UniOrderCountRequest request);

    boolean deleteOrder(UniOrderDeleteRequest request);

}
```

#### 接入

#### 日志

#### 订单查询
