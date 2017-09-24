---
layout: topic
module: Java
title:  引用
date:   2017-09-23
---

#### 强引用

* 在Java中创建的普通对象都是强引用

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
     * Treated specially by GC
     * 
     * 被垃圾收集器特殊对待, 这个可以这么理解
     * 如果按普通对象的逻辑, referent被Reference强引用了
     * 但这里, 垃圾收集器在处理时, Reference对referent引用不算强引用的范畴
     * -----------------------------------------------------------------
     */
    private T referent;

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

    /**
     * 锁对象, 用于和垃圾收集器同步
     * 
     * 在每个gc周期开始时, 垃圾收集器必须先获取锁对象, 因此, 为了不影响gc, 代码中任何
     * 获取锁对象地方, 必须尽快释放, 避免分配新对象或调用用户代码
     */
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
                // 此处lock后很快就释放
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

```java
public class SoftReference<T> extends Reference<T> {

    // 系统时钟, 由垃圾收集器负责更新
    static private long clock;

    // 时间戳, get()方法调用时更新, 垃圾收集器可能会使用该字段来选择清除哪些SoftReference
    private long timestamp;

    public SoftReference(T referent) {
        super(referent);
        this.timestamp = clock;
    }

    public SoftReference(T referent, ReferenceQueue<? super T> q) {
        super(referent, q);
        this.timestamp = clock;
    }

    public T get() {
        T o = super.get();
        if (o != null && this.timestamp != clock) {
            // 更新时间戳
            this.timestamp = clock;
        }
        return o;
    }

}
```

#### 弱引用 - WeakReference

#### 虚引用 - PhantomReference

#### Final引用 - FinalReference

```java
final class Finalizer extends FinalReference<Object> {

    // 引用队列
    private static ReferenceQueue<Object> queue = new ReferenceQueue<>();
    // 未被finalized的Finalizer链表, Finalizer创建时添加, finalize时删除
    private static Finalizer unfinalized = null;
    // 锁对象
    private static final Object lock = new Object();
    // 后/前一个Finalizer元素
    private Finalizer next = null, prev = null;

    /**
     * 是否已被finalized
     */
    private boolean hasBeenFinalized() {
        return (next == this);
    }

    /**
     * 添加到unfinalized链表
     */
    private void add() {
        synchronized (lock) {
            if (unfinalized != null) {
                this.next = unfinalized;
                unfinalized.prev = this;
            }
            unfinalized = this;
        }
    }

    /**
     * 从unfinalized链表中删除
     */
    private void remove() {
        synchronized (lock) {
            if (unfinalized == this) {
                if (this.next != null) {
                    unfinalized = this.next;
                } else {
                    unfinalized = this.prev;
                }
            }
            if (this.next != null) {
                this.next.prev = this.prev;
            }
            if (this.prev != null) {
                this.prev.next = this.next;
            }
            // 表明当前对象已被finalized
            this.next = this;
            this.prev = this;
        }
    }

    private Finalizer(Object finalizee) {
        super(finalizee, queue);
        add();
    }

    /**
     * 注册, Invoked by VM
     */
    static void register(Object finalizee) {
        new Finalizer(finalizee);
    }

    private void runFinalizer(JavaLangAccess jla) {
        synchronized (this) {
            if (hasBeenFinalized()) {
                // 已被finalized, return
                return;
            }

            // 从unfinalized链表中删除
            remove();
        }
        try {
            // 引用对象
            Object finalizee = this.get();
            if (finalizee != null && !(finalizee instanceof java.lang.Enum)) {
                // 调用引用对象的finalize()方法
                jla.invokeFinalize(finalizee);
                finalizee = null;
            }
        } catch (Throwable x) {
        }

        // 清除引用对象
        super.clear();
    }

    /**
     * 创建并启动SecondaryFinalizer线程
     */
    private static void forkSecondaryFinalizer(final Runnable proc) {
        AccessController.doPrivileged(
                new PrivilegedAction<Void>() {
                
                    public Void run() {
                        ThreadGroup tg = Thread.currentThread().getThreadGroup();
                        for (ThreadGroup tgn = tg; tgn != null; tg = tgn, tgn = tg.getParent()) ;
                        Thread sft = new Thread(tg, proc, "Secondary finalizer");
                        sft.start();
                        try {
                            sft.join();
                        } catch (InterruptedException x) {
                        }
                        return null;
                    }
                    
                });
    }

    /**
     * Called by Runtime.runFinalization()
     */
    static void runFinalization() {
        if (!VM.isBooted()) {
            return;
        }

        forkSecondaryFinalizer(new Runnable() {

            private volatile boolean running;

            public void run() {
                if (running) {
                    return;
                }
                final JavaLangAccess jla = SharedSecrets.getJavaLangAccess();
                running = true;
                // 处理引用队列中剩余的Finalizer
                for (; ; ) {
                    // 从引用队列中poll直到队列为空
                    Finalizer f = (Finalizer) queue.poll();
                    if (f == null) {
                        break;
                    }
                    f.runFinalizer(jla);
                }
            }
            
        });
    }

    /**
     * Invoked by java.lang.Shutdown
     */
    static void runAllFinalizers() {
        if (!VM.isBooted()) {
            return;
        }

        forkSecondaryFinalizer(new Runnable() {

            private volatile boolean running;

            public void run() {
                if (running) {
                    return;
                }
                final JavaLangAccess jla = SharedSecrets.getJavaLangAccess();
                running = true;
                // 处理unfinalized链表中剩余的Finalizer
                for (; ; ) {
                    Finalizer f;
                    synchronized (lock) {
                        f = unfinalized;
                        if (f == null) {
                            break;
                        }
                        unfinalized = f.next;
                    }
                    f.runFinalizer(jla);
                }
            }
            
        });
    }

    /**
     * Finalizer线程
     */
    private static class FinalizerThread extends Thread {

        // 运行标识
        private volatile boolean running;

        FinalizerThread(ThreadGroup g) {
            super(g, "Finalizer");
        }

        public void run() {
            if (running) {
                return;
            }

            while (!VM.isBooted()) {
                try {
                    // 等待虚拟机启动完成
                    VM.awaitBooted();
                } catch (InterruptedException x) {
                }
            }

            final JavaLangAccess jla = SharedSecrets.getJavaLangAccess();
            running = true;
            for (; ; ) {
                try {
                    // 从引用队列中删除一个Finalizer, 引用队列为空时阻塞等待
                    Finalizer f = (Finalizer) queue.remove();
                    f.runFinalizer(jla);
                } catch (InterruptedException x) {
                }
            }
        }
        
    }

    static {
        // 初始化并启动FinalizerThread线程
        ThreadGroup tg = Thread.currentThread().getThreadGroup();
        for (ThreadGroup tgn = tg; tgn != null; tg = tgn, tgn = tg.getParent()) ;
        Thread finalizer = new FinalizerThread(tg);
        finalizer.setPriority(Thread.MAX_PRIORITY - 2);
        finalizer.setDaemon(true);
        finalizer.start();
    }

}
```

```java
public final class System {

    private static void initializeSystemClass() {
        setJavaLangAccess();
    }

    private static void setJavaLangAccess() {
        sun.misc.SharedSecrets.setJavaLangAccess(new sun.misc.JavaLangAccess() {

            public void invokeFinalize(Object o) throws Throwable {
                o.finalize();
            }

        });
    }

}
```

***何时创建Finalizer***

```c
// 重写Object.<init>
void Rewriter::rewrite_Object_init(methodHandle method, TRAPS) {
    RawBytecodeStream bcs(method);
    while (!bcs.is_last_bytecode()) {
        Bytecodes::Code opcode = bcs.raw_next();
        switch (opcode) {
            case Bytecodes::_return:
                // return指令替换为_return_register_finalizer指令
                *bcs.bcp() = Bytecodes::_return_register_finalizer;
                break;
                // ...
        }
    }
}

void TemplateTable::_return(TosState state) {
    // ...
    if (_desc->bytecode() == Bytecodes::_return_register_finalizer) {
        // ...
        __ call_VM(noreg, CAST_FROM_FN_PTR(address, InterpreterRuntime::register_finalizer), rax);
        __ bind(skip_register_finalizer);
    }
    // ...
}

IRT_ENTRY(void, InterpreterRuntime::register_finalizer(JavaThread* thread, oopDesc* obj))
    InstanceKlass::register_finalizer(instanceOop(obj), CHECK);
IRT_END

instanceOop InstanceKlass::register_finalizer(instanceOop i, TRAPS) {
    instanceHandle h_i(THREAD, i);
    JavaValue result(T_VOID);
    JavaCallArguments args(h_i);
    // Finalizer.register()方法
    methodHandle mh(THREAD, Universe::finalizer_register_method());
    JavaCalls::call(&result, mh, &args, CHECK_NULL);
    return h_i();
}
```

#### Cleaner

* 继承自PhantomReference

```java
public class Cleaner extends PhantomReference<Object> {

    // 虚引用队列, 空队列, Cleaner不会enqueue, 而是在ReferenceHandler中直接调用clean()方法返回
    private static final ReferenceQueue<Object> dummyQueue = new ReferenceQueue<>();

    // 双向链表, 防止Cleaner在referent之前被垃圾收集器回收

    // 链表头节点
    static private Cleaner first = null;

    // 后一个/前一个Cleaner
    private Cleaner next = null, prev = null;

    /**
     * 添加Cleaner到链表头部
     */
    private static synchronized Cleaner add(Cleaner cl) {
        if (first != null) {
            cl.next = first;
            first.prev = cl;
        }
        first = cl;
        return cl;
    }

    /**
     * 删除Cleaner
     */
    private static synchronized boolean remove(Cleaner cl) {
        if (cl.next == cl) {
            // 已经被删除, return
            return false;
        }

        if (first == cl) {
            if (cl.next != null) {
                first = cl.next;
            } else {
                first = cl.prev;
            }
        }
        if (cl.next != null) {
            cl.next.prev = cl.prev;
        }
        if (cl.prev != null) {
            cl.prev.next = cl.next;
        }

        // 指向自己用来表明Cleaner已被删除
        cl.next = cl;
        cl.prev = cl;
        return true;
    }

    // 清理任务
    private final Runnable thunk;

    private Cleaner(Object referent, Runnable thunk) {
        super(referent, dummyQueue);
        this.thunk = thunk;
    }

    /**
     * 创建Cleaner
     */
    public static Cleaner create(Object ob, Runnable thunk) {
        // thunk不可为null
        if (thunk == null) {
            return null;
        }
        // 新建Cleaner并添加到链表
        return add(new Cleaner(ob, thunk));
    }

    /**
     * 清除
     */
    public void clean() {
        // 已被删除, 代表已经执行过clean()
        if (!remove(this)) {
            return;
        }
        try {
            // 执行清理任务
            thunk.run();
        } catch (final Throwable x) {
            AccessController.doPrivileged(new PrivilegedAction<Void>() {

                public Void run() {
                    // 打印异常信息
                    if (System.err != null) {
                        new Error("Cleaner terminated abnormally", x).printStackTrace();
                    }
                    // JVM退出
                    System.exit(1);
                    return null;
                }

            });
        }
    }

}
```

#### GC处理Reference

```c
DiscoveredList* _discoveredSoftRefs;        // SoftReference链表
DiscoveredList* _discoveredWeakRefs;        // WeakReference链表
DiscoveredList* _discoveredFinalRefs;       // FinalReference链表
DiscoveredList* _discoveredPhantomRefs;     // PhantomReference链表
DiscoveredList* _discoveredCleanerRefs;     // Cleaner链表
```

```c
ReferenceProcessorStats ReferenceProcessor::process_discovered_references() {
    // SoftReference: _current_soft_ref_policy, clear_referent = true
    process_discovered_reflist(_discoveredSoftRefs, _current_soft_ref_policy, true, is_alive, keep_alive, complete_gc, task_executor);

    // WeakReference: clear_referent = true
    process_discovered_reflist(_discoveredWeakRefs, NULL, true, is_alive, keep_alive, complete_gc, task_executor);

    // FinalReference: clear_referent = false
    process_discovered_reflist(_discoveredFinalRefs, NULL, false, is_alive, keep_alive, complete_gc, task_executor);

    // PhantomReference: clear_referent = false
    process_discovered_reflist(_discoveredPhantomRefs, NULL, false, is_alive, keep_alive, complete_gc, task_executor);

    // Cleaner: clear_referent = true
    process_discovered_reflist(_discoveredCleanerRefs, NULL, true, is_alive, keep_alive, complete_gc, task_executor);
}

size_t ReferenceProcessor::process_discovered_reflist(
        DiscoveredList refs_lists[],    // Reference列表
        ReferencePolicy *policy,        // SoftReference清除策略
        bool clear_referent,            // 是否清除referent
        BoolObjectClosure *is_alive,
        OopClosure *keep_alive,
        VoidClosure *complete_gc,
        AbstractRefProcTaskExecutor *task_executor) {
    /**
     * 第一阶段: 只处理SoftReference
     *
     * 1) SoftReference清除策略选择不清除referent, 从列表中排除
     */
    if (policy != NULL) {
        for (uint i = 0; i < _max_num_q; i++) {
            process_phase1(refs_lists[i], policy, is_alive, keep_alive, complete_gc);
        }
    }

    /**
     * 第二阶段: 继续存活的Reference对象, 从列表中排除
     */
    for (uint i = 0; i < _max_num_q; i++) {
        // pp2_work()
        process_phase2(refs_lists[i], is_alive, keep_alive, complete_gc);
    }

    /**
     * 第三阶段: 清除referent
     *
     * 1) clear_referent = true: 清除referent
     * 2) clear_referent = false: 不清除referent, 从列表中排除
     */
    for (uint i = 0; i < _max_num_q; i++) {
        process_phase3(refs_lists[i], clear_referent, is_alive, keep_alive, complete_gc);
    }
}

void ReferenceProcessor::process_phase1(DiscoveredList &refs_list,
                                        ReferencePolicy *policy,
                                        BoolObjectClosure *is_alive,
                                        OopClosure *keep_alive,
                                        VoidClosure *complete_gc) {
    DiscoveredListIterator iter(refs_list, keep_alive, is_alive);
    // 遍历
    while (iter.has_next()) {
        // referent是否存活
        bool referent_is_dead = (iter.referent() != NULL) && !iter.is_referent_alive();
        // referent为不存活状态, 由SoftReference清除策略来选择是否清楚referent
        if (referent_is_dead && !policy->should_clear_reference(iter.obj(), _soft_ref_timestamp_clock)) {
            // 不清楚referent

            // 从列表中删除Reference对象
            iter.remove();
            // Reference对象改为Active状态: Reference.next = NULL
            iter.make_active();
            // referent继续存活
            iter.make_referent_alive();
            iter.move_to_next();
        } else {
            iter.next();
        }
    }
}

void ReferenceProcessor::pp2_work(DiscoveredList &refs_list,
                                  BoolObjectClosure *is_alive,
                                  OopClosure *keep_alive) {
    DiscoveredListIterator iter(refs_list, keep_alive, is_alive);
    // 遍历
    while (iter.has_next()) {
        // referent为存活状态
        if (iter.is_referent_alive()) {
            // referent为可达状态

            // 从列表中删除Reference对象
            iter.remove();
            // referent继续存活
            iter.make_referent_alive();
            iter.move_to_next();
        } else {
            iter.next();
        }
    }
}

void ReferenceProcessor::process_phase3(DiscoveredList &refs_list,
                                        bool clear_referent,
                                        BoolObjectClosure *is_alive,
                                        OopClosure *keep_alive,
                                        VoidClosure *complete_gc) {
    DiscoveredListIterator iter(refs_list, keep_alive, is_alive);
    // 遍历
    while (iter.has_next()) {
        iter.update_discovered();
        // 是否清除referent
        if (clear_referent) {
            // 清除referent, referent = NULL
            iter.clear_referent();
        } else {
            // 不清除referent, referent继续存活
            iter.make_referent_alive();
        }
        iter.next();
    }
}
```
