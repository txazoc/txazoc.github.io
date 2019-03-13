---
layout: index
title:  Disruptor
---

#### Disruptor高性能

* RingBuffer
* CAS
* 伪共享: 缓存行填充

#### RingBuffer(环形缓冲区)

* 数组(预分配)

#### SingleProducerSequencer(单线程生产者)

* 占坑: 防止生产者追尾最慢消费者
* 填充event
* 更新`cursor`
* signalAll(): 唤醒等待的消费者

#### MultiProducerSequencer(多线程生产者)

* 占坑: 防止生产者追尾最慢消费者
* 抢占`cursor`: CAS
* 填充event
* 写availableBuffer: int[] availableBuffer，圈数
* signalAll(): 唤醒等待的消费者

#### BatchEventProcessor(单线程批量消费)

* `cursor` < nextSequence: await()
* `dependentSequence` < nextSequence: spin-wait loop
* 获取可消费的最大序列值
    * 单生产者: availableSequence = min(`cursor`, `dependentSequence`)
    * 多生产者: `availableBuffer`检查是否可消费
* 批量消费: EventHandler.onEvent()
* update `sequence`

#### WorkProcessor(多线程并发消费)

* `cursor` < nextSequence: await()
* `dependentSequence` < nextSequence: spin-wait loop
* 获取可消费的最大序列值
    * 单生产者: availableSequence = min(`cursor`, `dependentSequence`)
    * 多生产者: `availableBuffer`检查是否可消费
* 抢占`workSequence`: CAS
* WorkHandler.onEvent()
