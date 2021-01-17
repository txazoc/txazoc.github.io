var Topics = ['热点', '临时', '中间件', '项目总结', '开源框架', '性能优化', '网络', '数据库', '搜索', '大数据', 'Java', 'JDK', 'HotSpot', '设计模式', '操作系统', '汇编', '数据结构与算法', '服务器', 'Linux', 'Mac', 'CSS', 'Ruby', 'Python', '监控', '开发工具', '品质生活'];var TopicModule = {"Java": [{"path": "/java/reference.html", "module": "Java", "title": "\u5f15\u7528"}, {"path": "/java/collection/map.html", "module": "Java", "title": "Map"}, {"path": "/java/sugar.html", "module": "Java", "title": "\u8bed\u6cd5\u7cd6"}, {"path": "/java/javac.html", "module": "Java", "title": "javac\u7f16\u8bd1\u5668"}, {"path": "/java/java-feature.html", "module": "Java", "title": "Java\u7279\u6027"}, {"path": "/java/concurrent/memory-barrier.html", "module": "Java", "title": "\u5185\u5b58\u5c4f\u969c"}, {"path": "/java/concurrent/volatile.html", "module": "Java", "title": "Volatile"}, {"path": "/java/concurrent/thread-pool.html", "module": "Java", "title": "\u7ebf\u7a0b\u6c60"}, {"path": "/java/concurrent/park.html", "module": "Java", "title": "Park/Unpark"}, {"path": "/java/nio/direct-byte-buffer.html", "module": "Java", "title": "DirectByteBuffer"}, {"path": "/java/hot-deployment.html", "module": "Java", "title": "\u70ed\u90e8\u7f72"}, {"path": "/java/gzip.html", "module": "Java", "title": "GZIP"}, {"path": "/java/memory-model.html", "module": "Java", "title": "Java\u5185\u5b58\u6a21\u578b"}, {"path": "/java/thread/sleep.html", "module": "Java", "title": "Sleep"}, {"path": "/java/thread/yield.html", "module": "Java", "title": "Yield"}, {"path": "/java/thread/thread.html", "module": "Java", "title": "Thread"}, {"path": "/java/thread/wait-notify.html", "module": "Java", "title": "Wait/Notify"}, {"path": "/java/thread/join.html", "module": "Java", "title": "Join"}, {"path": "/java/reflection.html", "module": "Java", "title": "\u53cd\u5c04"}], "JDK": [{"path": "/jdk/jstat.html", "module": "JDK", "title": "jstat"}, {"path": "/jdk/jmap.html", "module": "JDK", "title": "jmap"}, {"path": "/jdk/jmx.html", "module": "JDK", "title": "JMX"}, {"path": "/jdk/jdb.html", "module": "JDK", "title": "jdb"}, {"path": "/jdk/javap.html", "module": "JDK", "title": "javap"}, {"path": "/jdk/attach-api.html", "module": "JDK", "title": "Attach API"}, {"path": "/jdk/jinfo.html", "module": "JDK", "title": "jinfo"}, {"path": "/jdk/jconsole.html", "module": "JDK", "title": "jconsole"}, {"path": "/jdk/jps.html", "module": "JDK", "title": "jps"}, {"path": "/jdk/jstack.html", "module": "JDK", "title": "jstack"}, {"path": "/jdk/jhat.html", "module": "JDK", "title": "jhat"}, {"path": "/jdk/jcmd.html", "module": "JDK", "title": "jcmd"}, {"path": "/jdk/jvisualvm.html", "module": "JDK", "title": "jvisualvm"}], "Linux": [{"path": "/linux/socket.html", "module": "Linux", "title": "Socket"}, {"path": "/linux/keepalived.html", "module": "Linux", "title": "Keepalived"}], "\u591a\u7ebf\u7a0b": [{"path": "/java/thread/interrupt.html", "module": "\u591a\u7ebf\u7a0b", "title": "\u7ebf\u7a0b\u4e2d\u65ad"}], "\u9879\u76ee\u603b\u7ed3": [{"path": "/project/uni-order-center.html", "module": "\u9879\u76ee\u603b\u7ed3", "title": "\u7edf\u4e00\u8ba2\u5355\u4e2d\u5fc3"}, {"path": "/project/mobile-operating-platform.html", "module": "\u9879\u76ee\u603b\u7ed3", "title": "\u79fb\u52a8\u8fd0\u8425\u5e73\u53f0"}, {"path": "/project/app-mock.html", "module": "\u9879\u76ee\u603b\u7ed3", "title": "AppMock"}, {"path": "/project/channel-apk-update.html", "module": "\u9879\u76ee\u603b\u7ed3", "title": "Android\u6e20\u9053\u5305\u66f4\u65b0"}, {"path": "/project/api-test-tool.html", "module": "\u9879\u76ee\u603b\u7ed3", "title": "\u63a5\u53e3\u6d4b\u8bd5\u5de5\u5177"}], "HotSpot": [{"path": "/hotspot/hsdb.html", "module": "HotSpot", "title": "HSDB"}, {"path": "/hotspot/jvm-garbage-collector.html", "module": "HotSpot", "title": "Java\u5783\u573e\u6536\u96c6\u5668"}, {"path": "/hotspot/class-load.html", "module": "HotSpot", "title": "\u7c7b\u52a0\u8f7d"}, {"path": "/hotspot/sa.html", "module": "HotSpot", "title": "SA"}, {"path": "/hotspot/jdb-debug.html", "module": "HotSpot", "title": "GDB\u8c03\u8bd5"}, {"path": "/hotspot/memory-management.html", "module": "HotSpot", "title": "\u81ea\u52a8\u5185\u5b58\u7ba1\u7406"}, {"path": "/hotspot/concurrent-implementation.html", "module": "HotSpot", "title": "\u5e76\u53d1\u5b9e\u73b0"}, {"path": "/hotspot/sourcecode/gc-process.html", "module": "HotSpot", "title": "GC\u8fc7\u7a0b\u5206\u6790"}, {"path": "/hotspot/sourcecode/new-object.html", "module": "HotSpot", "title": "\u5bf9\u8c61\u521b\u5efa\u5206\u6790"}, {"path": "/hotspot/sourcecode/heap-init.html", "module": "HotSpot", "title": "\u5806\u521d\u59cb\u5316"}], "\u4e2d\u95f4\u4ef6": [{"path": "/middleware/kafka.html", "module": "\u4e2d\u95f4\u4ef6", "title": "Kafka"}, {"path": "/middleware/rpc.html", "module": "\u4e2d\u95f4\u4ef6", "title": "RPC"}, {"path": "/middleware/logcenter.html", "module": "\u4e2d\u95f4\u4ef6", "title": "\u65e5\u5fd7\u4e2d\u5fc3"}, {"path": "/middleware/serialization-protocol.html", "module": "\u4e2d\u95f4\u4ef6", "title": "\u5e8f\u5217\u5316\u534f\u8bae"}, {"path": "/middleware/memcached.html", "module": "\u4e2d\u95f4\u4ef6", "title": "Memcached"}], "Mac": [{"path": "/mac/wifi.html", "module": "Mac", "title": "Mac\u4e0b\u7834\u89e3wifi\u5bc6\u7801"}], "\u7f51\u7edc": [{"path": "/network/arp.html", "module": "\u7f51\u7edc", "title": "ARP"}, {"path": "/network/ip.html", "module": "\u7f51\u7edc", "title": "IP"}, {"path": "/network/cdn.html", "module": "\u7f51\u7edc", "title": "CDN"}, {"path": "/network/client-server.html", "module": "\u7f51\u7edc", "title": "Client/Server"}, {"path": "/network/http-proxy.html", "module": "\u7f51\u7edc", "title": "Http\u4ee3\u7406"}, {"path": "/network/dns.html", "module": "\u7f51\u7edc", "title": "DNS"}]};