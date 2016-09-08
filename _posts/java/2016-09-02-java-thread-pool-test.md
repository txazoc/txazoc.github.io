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
                System.out.println("[" + getTime() + "] " + r.toString() + " rejected");
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
                        Thread.sleep(threadSleepTime);
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }

            });

            Thread.sleep(threadIntervalTime);
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
        private static long workersOffset;
        private static long workQueueOffset;
        private static long completedTaskCountOffset;

        private final int monitorIntervalTime;
        private final ThreadPoolExecutor threadPool;
        private int corePoolSize;
        private int maximumPoolSize;

        static {
            try {
                ctlOffset = UnsafeHolder.unsafe.objectFieldOffset(ThreadPoolExecutor.class.getDeclaredField("ctl"));
                corePoolSizeOffset = UnsafeHolder.unsafe.objectFieldOffset(ThreadPoolExecutor.class.getDeclaredField("corePoolSize"));
                maximumPoolSizeOffset = UnsafeHolder.unsafe.objectFieldOffset(ThreadPoolExecutor.class.getDeclaredField("maximumPoolSize"));
                workersOffset = UnsafeHolder.unsafe.objectFieldOffset(ThreadPoolExecutor.class.getDeclaredField("workers"));
                workQueueOffset = UnsafeHolder.unsafe.objectFieldOffset(ThreadPoolExecutor.class.getDeclaredField("workQueue"));
                completedTaskCountOffset = UnsafeHolder.unsafe.objectFieldOffset(ThreadPoolExecutor.class.getDeclaredField("completedTaskCount"));
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
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            while (true) {
                try {
                    int activeWorkerCount = 0;
                    int completedTaskCount = UnsafeHolder.unsafe.getInt(threadPool, completedTaskCountOffset);
                    Set<?> workers = (Set<?>) UnsafeHolder.unsafe.getObject(threadPool, workersOffset);
                    for (Object worker : workers) {
                        Field field = worker.getClass().getDeclaredField("completedTasks");
                        field.setAccessible(true);
                        completedTaskCount += field.getLong(worker);

                        Method method = worker.getClass().getDeclaredMethod("isLocked");
                        method.setAccessible(true);
                        if ((Boolean) method.invoke(worker)) {
                            activeWorkerCount++;
                        }
                    }

                    StringBuilder out = new StringBuilder();
                    out.append("[").append(getTime()).append("] corePoolSize ");
                    out.append(fillBlank(corePoolSize));
                    out.append(" maximumPoolSize ");
                    out.append(fillBlank(maximumPoolSize));
                    out.append(" workerCount ");
                    out.append(fillBlank(getWorkerCount()));
                    out.append(" activeWorkerCount ");
                    out.append(fillBlank(activeWorkerCount));
                    out.append(" workQueueSize ");
                    out.append(fillBlank(getWorkQueueSize()));
                    out.append(" completedTaskCount ");
                    out.append(fillBlank(completedTaskCount));

                    System.out.println(out.toString());

                    Thread.sleep(monitorIntervalTime);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

        private static String fillBlank(int i) {
            return i < 10 ? " " + i : String.valueOf(i);
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
[2016-09-08 17:20:07] corePoolSize  5 maximumPoolSize 10 workerCount  1 activeWorkerCount  1 workQueueSize  0 completedTaskCount  0
[2016-09-08 17:20:08] corePoolSize  5 maximumPoolSize 10 workerCount  2 activeWorkerCount  2 workQueueSize  0 completedTaskCount  0
[2016-09-08 17:20:09] corePoolSize  5 maximumPoolSize 10 workerCount  3 activeWorkerCount  3 workQueueSize  0 completedTaskCount  0
[2016-09-08 17:20:10] corePoolSize  5 maximumPoolSize 10 workerCount  4 activeWorkerCount  4 workQueueSize  0 completedTaskCount  0
[2016-09-08 17:20:11] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  0 completedTaskCount  0

// 过程二
[2016-09-08 17:20:12] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  1 completedTaskCount  0
[2016-09-08 17:20:13] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  2 completedTaskCount  0
[2016-09-08 17:20:14] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  3 completedTaskCount  0
[2016-09-08 17:20:15] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  4 completedTaskCount  0
[2016-09-08 17:20:16] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  5 completedTaskCount  0

// 过程三
[2016-09-08 17:20:17] corePoolSize  5 maximumPoolSize 10 workerCount  6 activeWorkerCount  6 workQueueSize  5 completedTaskCount  0
[2016-09-08 17:20:18] corePoolSize  5 maximumPoolSize 10 workerCount  7 activeWorkerCount  7 workQueueSize  5 completedTaskCount  0
[2016-09-08 17:20:19] corePoolSize  5 maximumPoolSize 10 workerCount  8 activeWorkerCount  8 workQueueSize  5 completedTaskCount  0
[2016-09-08 17:20:20] corePoolSize  5 maximumPoolSize 10 workerCount  9 activeWorkerCount  9 workQueueSize  5 completedTaskCount  0
[2016-09-08 17:20:21] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  5 completedTaskCount  0

// 过程四
[2016-09-08 17:20:22] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  5 completedTaskCount  0
[2016-09-08 17:20:22] java.util.concurrent.FutureTask@1bb75db9 rejected
[2016-09-08 17:20:23] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  5 completedTaskCount  0
[2016-09-08 17:20:23] java.util.concurrent.FutureTask@236a2ae6 rejected
[2016-09-08 17:20:24] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  5 completedTaskCount  0
[2016-09-08 17:20:24] java.util.concurrent.FutureTask@f267434c rejected
[2016-09-08 17:20:25] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  5 completedTaskCount  0
[2016-09-08 17:20:25] java.util.concurrent.FutureTask@259709b1 rejected
[2016-09-08 17:20:26] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  5 completedTaskCount  0
[2016-09-08 17:20:26] java.util.concurrent.FutureTask@5efd56be rejected

// 过程五
[2016-09-08 17:20:27] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  4 completedTaskCount  1
[2016-09-08 17:20:28] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  3 completedTaskCount  2
[2016-09-08 17:20:29] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  2 completedTaskCount  3
[2016-09-08 17:20:30] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  1 completedTaskCount  4
[2016-09-08 17:20:31] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  0 completedTaskCount  5

// 过程六
[2016-09-08 17:20:32] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  0 completedTaskCount  5
[2016-09-08 17:20:33] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  0 completedTaskCount  5
[2016-09-08 17:20:34] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  0 completedTaskCount  5
[2016-09-08 17:20:35] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  0 completedTaskCount  5
[2016-09-08 17:20:36] corePoolSize  5 maximumPoolSize 10 workerCount 10 activeWorkerCount 10 workQueueSize  0 completedTaskCount  5

// 过程七
[2016-09-08 17:20:37] corePoolSize  5 maximumPoolSize 10 workerCount  9 activeWorkerCount  9 workQueueSize  0 completedTaskCount  6
[2016-09-08 17:20:38] corePoolSize  5 maximumPoolSize 10 workerCount  8 activeWorkerCount  8 workQueueSize  0 completedTaskCount  7
[2016-09-08 17:20:39] corePoolSize  5 maximumPoolSize 10 workerCount  7 activeWorkerCount  7 workQueueSize  0 completedTaskCount  8
[2016-09-08 17:20:40] corePoolSize  5 maximumPoolSize 10 workerCount  6 activeWorkerCount  6 workQueueSize  0 completedTaskCount  9
[2016-09-08 17:20:41] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  0 completedTaskCount 10

// 过程八
[2016-09-08 17:20:42] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  0 completedTaskCount 10
[2016-09-08 17:20:43] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  0 completedTaskCount 10
[2016-09-08 17:20:44] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  0 completedTaskCount 10
[2016-09-08 17:20:45] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  0 completedTaskCount 10
[2016-09-08 17:20:46] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  5 workQueueSize  0 completedTaskCount 10

// 过程九
[2016-09-08 17:20:47] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  4 workQueueSize  0 completedTaskCount 11
[2016-09-08 17:20:48] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  3 workQueueSize  0 completedTaskCount 12
[2016-09-08 17:20:49] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  2 workQueueSize  0 completedTaskCount 13
[2016-09-08 17:20:50] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  1 workQueueSize  0 completedTaskCount 14
[2016-09-08 17:20:51] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  0 workQueueSize  0 completedTaskCount 15

// 过程十
[2016-09-08 17:20:52] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  0 workQueueSize  0 completedTaskCount 15
[2016-09-08 17:20:53] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  0 workQueueSize  0 completedTaskCount 15
[2016-09-08 17:20:54] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  0 workQueueSize  0 completedTaskCount 15
[2016-09-08 17:20:55] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  0 workQueueSize  0 completedTaskCount 15
[2016-09-08 17:20:56] corePoolSize  5 maximumPoolSize 10 workerCount  5 activeWorkerCount  0 workQueueSize  0 completedTaskCount 15
```

输出结果中的名词解释:

* `corePoolSize`: 核心线程池大小
* `maximumPoolSize`: 最大线程池大小
* `workerCount`: 工作线程数
* `activeWorkerCount`: 活动的工作线程数
* `workQueueSize`: 等待队列中的任务数
* `completedTaskCount`: 已完成的任务数

测试结果的过程说明:

* **过程一**: `workerCount` < `corePoolSize`，创建新的工作线程执行任务
* **过程二**: `workerCount` >= `corePoolSize`，等待队列未满，任务添加到等待队列
* **过程三**: `workerCount` >= `corePoolSize`，等待队列已满，`workerCount` < `maximumPoolSize`，创建新的工作线程执行任务
* **过程四**: `workerCount` >= `corePoolSize`，等待队列已满，`workerCount`>= `maximumPoolSize`，执行拒绝策略
* **过程五**: 过程一中创建的工作线程执行完任务，从等待队列中获取任务继续执行
* **过程六**: 过程一和过程三中创建的工作线程执行任务中
* **过程七**: 过程三中创建的工作线程执行完任务，等待队列为空，`workerCount` > `corePoolSize`，销毁工作线程
* **过程八**: 过程一中创建的工作线程执行任务中
* **过程九**: 过程一中创建的工作线程执行完任务，等待队列为空，`workerCount` == `corePoolSize`，进入阻塞状态，当等待队列中有新的任务时，从等待队列中获取任务继续执行
* **过程十**: 所有任务执行完，无活动的工作线程

参考`ThreadPoolExecutor`的源码来对比上面的过程。

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
            // 对应过程五、九
            while (task != null || (task = getTask()) != null) {
                // 对应过程六，八
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
