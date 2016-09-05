---
layout:     article
categories: [java]
title:      Java线程池测试
tags:       [java, 线程池]
date:       2016-09-02
---

写了个简单的测试代码，用来测试JDK的线程池`ThreadPoolExecutor`。

```java
public class ThreadPoolExecutorTest {

    @Test
    public void test() throws Exception {
        testThreadPool(1000, 20, 1000, 20000, new ThreadPoolExecutor(5, 10, 0L, TimeUnit.MILLISECONDS, new ArrayBlockingQueue<Runnable>(5), new RejectedExecutionHandler() {

            @Override
            public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
                System.out.println("[" + getTime() + "]\t" + r.toString() + " rejected");
            }

        }));
    }

    private static void testThreadPool(int monitorIntervalTime, int threadCount, int threadIntervalTime, final int threadSleepTime, ThreadPoolExecutor threadPool) throws Exception {
        new Thread(new ThreadPoolExecutorMonitor(monitorIntervalTime, threadPool)).start();

        for (int i = 0; i < threadCount; i++) {
            threadPool.submit(new Runnable() {

                @Override
                public void run() {
                    try {
                        if (threadSleepTime > 0) {
                            Thread.sleep(threadSleepTime);
                        }
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }

            });

            if (threadIntervalTime > 0) {
                Thread.sleep(threadIntervalTime);
            }
        }

        System.in.read();
    }

    private static String getTime() {
        return DateFormatUtils.format(System.currentTimeMillis(), "yyyy-MM-dd HH:mm:ss");
    }

    private static class ThreadPoolExecutorMonitor implements Runnable {

        private static long ctlOffset;
        private static long corePoolSizeOffset;
        private static long maximumPoolSizeOffset;
        private static long workQueueOffset;

        private final int monitorIntervalTime;
        private final ThreadPoolExecutor threadPool;
        private int corePoolSize;
        private int maximumPoolSize;

        static {
            try {
                ctlOffset = UnsafeHolder.unsafe.objectFieldOffset(ThreadPoolExecutor.class.getDeclaredField("ctl"));
                corePoolSizeOffset = UnsafeHolder.unsafe.objectFieldOffset(ThreadPoolExecutor.class.getDeclaredField("corePoolSize"));
                maximumPoolSizeOffset = UnsafeHolder.unsafe.objectFieldOffset(ThreadPoolExecutor.class.getDeclaredField("maximumPoolSize"));
                workQueueOffset = UnsafeHolder.unsafe.objectFieldOffset(ThreadPoolExecutor.class.getDeclaredField("workQueue"));
            } catch (NoSuchFieldException e) {
                e.printStackTrace();
            }
        }

        public ThreadPoolExecutorMonitor(int monitorIntervalTime, ThreadPoolExecutor threadPool) {
            this.monitorIntervalTime = monitorIntervalTime;
            this.threadPool = threadPool;
            corePoolSize = UnsafeHolder.unsafe.getInt(threadPool, corePoolSizeOffset);
            maximumPoolSize = UnsafeHolder.unsafe.getInt(threadPool, maximumPoolSizeOffset);
        }

        @Override
        public void run() {
            while (true) {
                System.out.println("[" + getTime() + "]\tcorePoolSize " + corePoolSize + "\tmaximumPoolSize " + maximumPoolSize + "\tworkerCount " + getWorkerCount() + "\tworkQueueSize " + getWorkQueueSize());
                try {
                    Thread.sleep(monitorIntervalTime);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }

        private int getWorkerCount() {
            AtomicInteger ctl = (AtomicInteger) UnsafeHolder.unsafe.getObject(threadPool, ctlOffset);
            return ctl.get() & ((1 << (Integer.SIZE - 3)) - 1);
        }

        private int getWorkQueueSize() {
            BlockingQueue<Runnable> workQueue = (BlockingQueue<Runnable>) UnsafeHolder.unsafe.getObject(threadPool, workQueueOffset);
            return workQueue.size();
        }

    }

    private static class UnsafeHolder {

        public static final Unsafe unsafe;

        static {
            try {
                Field field = Unsafe.class.getDeclaredField("theUnsafe");
                field.setAccessible(true);
                unsafe = (Unsafe) field.get(null);
            } catch (Exception e) {
                throw new Error(e);
            }
        }

    }

}
```

测试结果如下。

```console
// 过程一
[2016-09-02 17:13:28]	corePoolSize 5	maximumPoolSize 10	workerCount 1	workQueueSize 0
[2016-09-02 17:13:29]	corePoolSize 5	maximumPoolSize 10	workerCount 2	workQueueSize 0
[2016-09-02 17:13:30]	corePoolSize 5	maximumPoolSize 10	workerCount 3	workQueueSize 0
[2016-09-02 17:13:31]	corePoolSize 5	maximumPoolSize 10	workerCount 4	workQueueSize 0
[2016-09-02 17:13:32]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 0

// 过程二
[2016-09-02 17:13:33]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 1
[2016-09-02 17:13:34]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 2
[2016-09-02 17:13:35]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 3
[2016-09-02 17:13:36]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 4
[2016-09-02 17:13:37]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 5

// 过程三
[2016-09-02 17:13:38]	corePoolSize 5	maximumPoolSize 10	workerCount 6	workQueueSize 5
[2016-09-02 17:13:39]	corePoolSize 5	maximumPoolSize 10	workerCount 7	workQueueSize 5
[2016-09-02 17:13:40]	corePoolSize 5	maximumPoolSize 10	workerCount 8	workQueueSize 5
[2016-09-02 17:13:41]	corePoolSize 5	maximumPoolSize 10	workerCount 9	workQueueSize 5
[2016-09-02 17:13:42]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 5

// 过程四
[2016-09-02 17:13:43]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 5
[2016-09-02 17:13:43]   java.util.concurrent.FutureTask@2c12e42b rejected
[2016-09-02 17:13:44]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 5
[2016-09-02 17:13:44]   java.util.concurrent.FutureTask@c41d9a8c rejected
[2016-09-02 17:13:45]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 5
[2016-09-02 17:13:45]   java.util.concurrent.FutureTask@3738aae1 rejected
[2016-09-02 17:13:46]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 5
[2016-09-02 17:13:46]   java.util.concurrent.FutureTask@695ab619 rejected
[2016-09-02 17:13:47]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 5
[2016-09-02 17:13:47]   java.util.concurrent.FutureTask@42695958 rejected

// 过程五
[2016-09-02 17:13:48]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 4
[2016-09-02 17:13:49]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 3
[2016-09-02 17:13:50]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 2
[2016-09-02 17:13:51]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 1
[2016-09-02 17:13:52]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 0

// 过程六
[2016-09-02 17:13:53]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 0
[2016-09-02 17:13:54]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 0
[2016-09-02 17:13:55]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 0
[2016-09-02 17:13:56]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 0
[2016-09-02 17:13:57]	corePoolSize 5	maximumPoolSize 10	workerCount 10	workQueueSize 0

// 过程七
[2016-09-02 17:13:58]	corePoolSize 5	maximumPoolSize 10	workerCount 9	workQueueSize 0
[2016-09-02 17:13:59]	corePoolSize 5	maximumPoolSize 10	workerCount 8	workQueueSize 0
[2016-09-02 17:14:00]	corePoolSize 5	maximumPoolSize 10	workerCount 7	workQueueSize 0
[2016-09-02 17:14:01]	corePoolSize 5	maximumPoolSize 10	workerCount 6	workQueueSize 0
[2016-09-02 17:14:02]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 0

// 过程八
[2016-09-02 17:14:03]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 0
[2016-09-02 17:14:04]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 0
[2016-09-02 17:14:05]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 0
[2016-09-02 17:14:06]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 0
[2016-09-02 17:14:07]	corePoolSize 5	maximumPoolSize 10	workerCount 5	workQueueSize 0
```

解释:

* `corePoolSize`: 核心线程池大小
* `maximumPoolSize`: 最大线程池大小
* `workerCount`: 工作线程数
* `workQueueSize`: 等待队列中的线程数

解释:

* **过程一**: `workerCount` < `corePoolSize`，创建新的工作线程执行任务
* **过程二**: `workerCount` >= `corePoolSize`，等待队列未满，任务添加到等待队列
* **过程三**: `workerCount` >= `corePoolSize`，等待队列已满，`workerCount` < `maximumPoolSize`，创建新的工作线程执行任务
* **过程四**: `workerCount` >= `corePoolSize`，等待队列已满，`workerCount`>= `maximumPoolSize`，执行拒绝策略
* **过程五**: 工作线程执行完任务，从等待队列中获取任务执行
* **过程六**: 工作线程执行任务中
* **过程七**: 工作线程执行完任务，等待队列为空，且`workerCount` > `corePoolSize`，
* **过程八**: 工作线程执行完任务，等待队列为空，`workerCount` == `corePoolSize`，等待从等待队列中获取任务

```java
public class ThreadPoolExecutor {

    // 执行任务
    public void execute(Runnable command) {
        if (command == null) {
            throw new NullPointerException();
        }

        int c = ctl.get();
        if (workerCountOf(c) < corePoolSize) {
            // 对应过程一
            if (addWorker(command, true))
                return;
            c = ctl.get();
        }
        if (isRunning(c) && workQueue.offer(command)) {
            // 对应过程二
            int recheck = ctl.get();
            if (!isRunning(recheck) && remove(command))
                reject(command);
            else if (workerCountOf(recheck) == 0)
                addWorker(null, false);
            // 对应过程三
        } else if (!addWorker(command, false))
            // 对应过程四
            reject(command);
    }

    // 执行工作线程(代码有精简)
    final void runWorker(Worker w) {
        Runnable task = w.firstTask;
        try {
            // 对应过程五、八
            while (task != null || (task = getTask()) != null) {
                // 对应过程六
                task.run();
            }
        } finally {
            // 对应过程七
            processWorkerExit(w, completedAbruptly);
        }
    }

    // 从等待队列中获取任务(代码有精简)
    private Runnable getTask() {
        for (; ; ) {
            int c = ctl.get();
            int rs = runStateOf(c);
            boolean timed;
            for (; ; ) {
                int wc = workerCountOf(c);
                timed = allowCoreThreadTimeOut || wc > corePoolSize;
            }

            Runnable r = timed ?
                    workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :
                    workQueue.take();
            if (r != null)
                return r;
        }
    }

}
```