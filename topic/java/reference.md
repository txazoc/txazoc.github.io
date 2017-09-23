---
layout: topic
module: Java
title:  引用
date:   2017-09-23
---

#### 强引用

在Java中创建的普通对象都是强引用

#### 引用 - Reference

```java
public abstract class Reference<T> {

    /**
     * 引用对象
     *
     * 4种状态
     * -----------------------------------------------------------------
     * - Active     活跃状态, 新创建实例的状态, 垃圾收集器检测到referent的可达性
     * -            变为合适的状态后, 改变实例的状态到Pending或Inactive, 取决于
     * -            实例创建时是否被注册到一个引用队列
     * - Pending    等待状态, pending列表中的一个元素, 等待被ReferenceHandler
     * -            线程入队列, 未注册引用队列的实例不会处于这个状态
     * - Enqueued   入队状态, 实例创建时注册的引用队列中的一个元素, 当实例从引用队
     * -            列中删除时, 状态变为Inactive, 未注册引用队列的实例不会处于这
     * -            个状态
     * - Inactive   不活跃状态, 没有更多的事可做, 实例的状态不会再改变
     * -----------------------------------------------------------------
     */
    private T referent; /* Treated specially by GC */

    /**
     * 引用队列
     *
     * Active       创建时注册的引用队列或ReferenceQueue.NULL(未注册引用队列)
     * Pending      创建时注册的引用队列
     * Enqueued     ReferenceQueue.ENQUEUED, 代表引用对象已入队
     * Inactive     ReferenceQueue.NULL, 代表引用对象已出队或未注册引用队列
     */
    volatile ReferenceQueue<? super T> queue;

    /**
     * 垃圾收集器通过检测next来决定引用对象是否要被特殊对待
     *
     * Active       NULL
     * Pending      this
     * Enqueued     queue中的下一个引用对象
     * Inactive     this
     */
    Reference next;

    /**
     * 垃圾收集器用来链接发现的引用对象, 同时也用于链接pending列表中的引用对象
     *
     * Active       由垃圾收集器维护的discovered引用列表的下一个元素
     * Pending      pending中下一个元素
     * Otherwise    NULL
     */
    transient private Reference<T> discovered; /* used by VM */

    static private class Lock {
    }

    // 锁对象, 用于与垃圾收集器同步
    private static Lock lock = new Lock();

    /**
     * 等待入队的引用对象列表, 垃圾收集器添加引用对象到列表中, ReferenceHandler线程
     * 则负责删除, pending被lock锁对象保护, 同时使用discovered来链接元素
     */
    private static Reference<Object> pending = null;

    /**
     * 引用处理线程, 高优先级线程, 用来入队等待的引用对象
     */
    private static class ReferenceHandler extends Thread {

        ReferenceHandler(ThreadGroup g, String name) {
            super(g, name);
        }

        public void run() {
            for (; ; ) {
                Reference<Object> r;
                synchronized (lock) {
                    // pending不为null
                    if (pending != null) {
                        // pending列表出列一个引用对象
                        r = pending;
                        // pending指向pending列表中下一个元素
                        pending = r.discovered;
                        r.discovered = null;
                    } else {
                        // pending为null, 进入阻塞等待
                        try {
                            try {
                                /**
                                 * 此处wait()可能导致OOME, 因为会尝试分配异常
                                 * 对象, 所以catch住以避免ReferenceHandler
                                 * 线程退出
                                 */
                                lock.wait();
                            } catch (OutOfMemoryError x) {
                            }
                        } catch (InterruptedException x) {
                        }
                        continue;
                    }
                }

                // 引用对象为Cleaner类型
                if (r instanceof Cleaner) {
                    // 调用clean()方法清理, DirectByteBuffer的清理在此处进行
                    ((Cleaner) r).clean();
                    continue;
                }

                ReferenceQueue<Object> q = r.queue;
                if (q != ReferenceQueue.NULL) {
                    // 引用对象入队列
                    q.enqueue(r);
                }
            }
        }

    }

    static {
        ThreadGroup tg = Thread.currentThread().getThreadGroup();
        // 获取父线程组
        for (ThreadGroup tgn = tg; tgn != null; tg = tgn, tgn = tg.getParent()) ;
        // 创建ReferenceHandler线程
        Thread handler = new ReferenceHandler(tg, "Reference Handler");
        // 设置最高优先级
        handler.setPriority(Thread.MAX_PRIORITY);
        // 设置为守护线程
        handler.setDaemon(true);
        // 启动线程
        handler.start();
    }

    Reference(T referent) {
        this(referent, null);
    }

    Reference(T referent, ReferenceQueue<? super T> queue) {
        this.referent = referent;
        this.queue = (queue == null) ? ReferenceQueue.NULL : queue;
    }

    /**
     * 返回引用对象, 当引用对象被程序或垃圾收集器清除后, 返回null
     */
    public T get() {
        return this.referent;
    }

    /**
     * 清除引用对象, 调用该方法不会导致引用对象入队列, 该方法只会由Java代码调用,
     * 垃圾收集器清除引用对象时不会调用该方法
     */
    public void clear() {
        this.referent = null;
    }

    /**
     * 是否已入队列, 实例创建未注册引用队列时, 始终返回false
     */
    public boolean isEnqueued() {
        return (this.queue == ReferenceQueue.ENQUEUED);
    }

    /**
     * 入队列, 引用对象添加到注册的引用队列中
     */
    public boolean enqueue() {
        return this.queue.enqueue(this);
    }

}
```

#### 引用队列 - ReferenceQueue

> 检测到引用对象的可达性变为合适的状态后，`垃圾收集器就将已注册的引用对象添加到此队列中`

```java
public class ReferenceQueue<T> {

    public ReferenceQueue() {
    }

    // 空队列
    private static class Null<S> extends ReferenceQueue<S> {

        boolean enqueue(Reference<? extends S> r) {
            return false;
        }

    }

    // 出队标识
    static ReferenceQueue<Object> NULL = new Null<>();
    // 入队标识
    static ReferenceQueue<Object> ENQUEUED = new Null<>();

    static private class Lock {
    }

    // 锁对象
    private Lock lock = new Lock();
    // 链表头节点
    private volatile Reference<? extends T> head = null;
    // 队列长度
    private long queueLength = 0;

    /**
     * 入队列
     */
    boolean enqueue(Reference<? extends T> r) {
        synchronized (lock) {
            ReferenceQueue<?> queue = r.queue;
            // 检查引用对象的队列是否为空队列
            if ((queue == NULL) || (queue == ENQUEUED)) {
                return false;
            }
            // 检查引用对象的队列是否当前队列
            assert queue == this;
            // 设置入队标识
            r.queue = ENQUEUED;
            // 插入到头节点
            r.next = (head == null) ? r : head;
            head = r;
            // 队列长度加1
            queueLength++;
            if (r instanceof FinalReference) {
                // Final引用计数加1
                sun.misc.VM.addFinalRefCount(1);
            }
            // 唤醒remove()中的wait()
            lock.notifyAll();
            return true;
        }
    }

    /**
     * 出队列
     */
    private Reference<? extends T> reallyPoll() {
        Reference<? extends T> r = head;
        if (r != null) {
            // 头节点出队列
            head = (r.next == r) ? null : r.next;
            // 设置出队标识
            r.queue = NULL;
            // next指向自己
            r.next = r;
            // 队列长度减1
            queueLength--;
            if (r instanceof FinalReference) {
                // Final引用计数减1
                sun.misc.VM.addFinalRefCount(-1);
            }
            return r;
        }
        return null;
    }

    /**
     * 出队列
     */
    public Reference<? extends T> poll() {
        if (head == null) {
            return null;
        }
        synchronized (lock) {
            return reallyPoll();
        }
    }

    /**
     * 删除下一个引用对象
     */
    public Reference<? extends T> remove(long timeout) throws IllegalArgumentException, InterruptedException {
        if (timeout < 0) {
            throw new IllegalArgumentException("Negative timeout value");
        }
        // 加锁
        synchronized (lock) {
            Reference<? extends T> r = reallyPoll();
            if (r != null) {
                // 删除成功, 返回
                return r;
            }
            long start = (timeout == 0) ? 0 : System.nanoTime();
            for (; ; ) {
                // wait直到有可删除的引用对象或超时
                lock.wait(timeout);
                r = reallyPoll();
                if (r != null) {
                    // 删除成功, 返回
                    return r;
                }
                if (timeout != 0) {
                    long end = System.nanoTime();
                    timeout -= (end - start) / 1000_000;
                    if (timeout <= 0) {
                        // 超时, 返回
                        return null;
                    }
                    start = end;
                }
            }
        }
    }

    /**
     * 删除下一个引用对象, 阻塞直到有可删除的引用对象
     */
    public Reference<? extends T> remove() throws InterruptedException {
        return remove(0);
    }

}
```

#### 软引用 - SoftReference

* 在内存足够时，不会被回收
* 在内存不足即将抛出`OutOfMemoryError`时，会被回收
* 可用来实现高速缓存

***回收过程***

* 回收referent占用的内存
* referent = null
* enqueue

#### 弱引用 - WeakReference

* GC时被发现, 就会被回收

***回收过程***

* 回收referent占用的内存
* referent = null
* enqueue

#### 虚引用 - PhantomReference

#### FinalReference

***回收过程***

* enqueue
