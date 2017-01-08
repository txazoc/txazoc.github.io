var Topics = ['热点', '临时', '中间件', '项目总结', '开源框架', '网络', '数据库', 'Java', 'JDK', 'HotSpot', '多线程', '服务器', 'Linux', 'Mac', 'CSS', 'Ruby', 'Python', '监控', '工具'];
var TopicModule = {"\u76d1\u63a7": [{"path": "/monitor/cpu.html", "module": "\u76d1\u63a7", "title": "cpu"}, {"path": "/monitor/disk-io.html", "module": "\u76d1\u63a7", "title": "\u78c1\u76d8IO"}, {"path": "/monitor/memory.html", "module": "\u76d1\u63a7", "title": "\u5185\u5b58"}, {"path": "/monitor/network-io.html", "module": "\u76d1\u63a7", "title": "\u7f51\u7edcIO"}], "\u4e34\u65f6": [{"path": "/temporary/java-feature.html", "module": "\u4e34\u65f6", "title": "Java\u7279\u6027"}, {"path": "/temporary/javac.html", "module": "\u4e34\u65f6", "title": "javac\u7f16\u8bd1\u5668"}], "\u670d\u52a1\u5668": [{"path": "/server/nginx-real-ip.html", "module": "\u670d\u52a1\u5668", "title": "Nginx\u771f\u5b9eip"}], "\u9879\u76ee\u603b\u7ed3": [{"path": "/project/api-test-tool.html", "module": "\u9879\u76ee\u603b\u7ed3", "title": "\u63a5\u53e3\u6d4b\u8bd5\u5de5\u5177"}, {"path": "/project/channel-apk-update.html", "module": "\u9879\u76ee\u603b\u7ed3", "title": "Android\u6e20\u9053\u5305\u66f4\u65b0"}, {"path": "/project/uni-order-center.html", "module": "\u9879\u76ee\u603b\u7ed3", "title": "\u7edf\u4e00\u8ba2\u5355\u4e2d\u5fc3"}], "Java": [{"path": "/java/annotation.html", "module": "Java", "title": "\u6ce8\u89e3"}, {"path": "/java/aop.html", "module": "Java", "title": "AOP"}, {"path": "/java/gzip.html", "module": "Java", "title": "GZIP"}, {"path": "/java/io.html", "module": "Java", "title": "IO"}, {"path": "/java/list.html", "module": "Java", "title": "List"}, {"path": "/java/map.html", "module": "Java", "title": "Map"}, {"path": "/java/nio.html", "module": "Java", "title": "NIO"}, {"path": "/java/thread-pool.html", "module": "Java", "title": "\u7ebf\u7a0b\u6c60"}, {"path": "/java/threadlocal.html", "module": "Java", "title": "ThreadLocal"}], "JDK": [{"path": "/jdk/attach-api.html", "module": "JDK", "title": "Attach API"}, {"path": "/jdk/jar.html", "module": "JDK", "title": "jar"}, {"path": "/jdk/javap.html", "module": "JDK", "title": "javap"}, {"path": "/jdk/jcmd.html", "module": "JDK", "title": "jcmd"}, {"path": "/jdk/jconsole.html", "module": "JDK", "title": "jconsole"}, {"path": "/jdk/jdb.html", "module": "JDK", "title": "jdb"}, {"path": "/jdk/jhat.html", "module": "JDK", "title": "jhat"}, {"path": "/jdk/jinfo.html", "module": "JDK", "title": "jinfo"}, {"path": "/jdk/jmap.html", "module": "JDK", "title": "jmap"}, {"path": "/jdk/jmx.html", "module": "JDK", "title": "JMX"}, {"path": "/jdk/jps.html", "module": "JDK", "title": "jps"}, {"path": "/jdk/jstack.html", "module": "JDK", "title": "jstack"}, {"path": "/jdk/jstat.html", "module": "JDK", "title": "jstat"}, {"path": "/jdk/jvisualvm.html", "module": "JDK", "title": "jvisualvm"}, {"path": "/jdk/monitor-manage.html", "module": "JDK", "title": "\u76d1\u63a7\u548c\u7ba1\u7406"}], "Python": [{"path": "/python/dict.html", "module": "Python", "title": "\u5b57\u5178"}, {"path": "/python/file.html", "module": "Python", "title": "\u6587\u4ef6"}, {"path": "/python/list.html", "module": "Python", "title": "\u5217\u8868"}, {"path": "/python/tuple.html", "module": "Python", "title": "\u5143\u7ec4"}], "\u591a\u7ebf\u7a0b": [{"path": "/thread/interrupt.html", "module": "\u591a\u7ebf\u7a0b", "title": "\u4e2d\u65ad"}], "\u7f51\u7edc": [{"path": "/network/arp.html", "module": "\u7f51\u7edc", "title": "ARP"}, {"path": "/network/http-proxy.html", "module": "\u7f51\u7edc", "title": "Http\u4ee3\u7406"}, {"path": "/network/http.html", "module": "\u7f51\u7edc", "title": "HTTP"}, {"path": "/network/https.html", "module": "\u7f51\u7edc", "title": "HTTPS"}, {"path": "/network/socks-proxy.html", "module": "\u7f51\u7edc", "title": "Socks\u4ee3\u7406"}, {"path": "/network/tcp.html", "module": "\u7f51\u7edc", "title": "TCP"}, {"path": "/network/vpn.html", "module": "\u7f51\u7edc", "title": "VPN"}, {"path": "/network/websocket.html", "module": "\u7f51\u7edc", "title": "WebSocket"}], "HotSpot": [{"path": "/hotspot/assembly.html", "module": "HotSpot", "title": "\u6c47\u7f16"}, {"path": "/hotspot/class-load.html", "module": "HotSpot", "title": "\u7c7b\u52a0\u8f7d"}, {"path": "/hotspot/field.html", "module": "HotSpot", "title": "\u5b57\u6bb5"}, {"path": "/hotspot/hsdb.html", "module": "HotSpot", "title": "HSDB"}, {"path": "/hotspot/jdb-debug.html", "module": "HotSpot", "title": "GDB\u8c03\u8bd5"}, {"path": "/hotspot/jvm-option.html", "module": "HotSpot", "title": "VM\u9009\u9879"}, {"path": "/hotspot/memory-allocation.html", "module": "HotSpot", "title": "\u5185\u5b58\u5206\u914d"}, {"path": "/hotspot/memory-management.html", "module": "HotSpot", "title": "\u81ea\u52a8\u5185\u5b58\u7ba1\u7406"}, {"path": "/hotspot/oopklass.html", "module": "HotSpot", "title": "Oop/Klass"}, {"path": "/hotspot/program-counter.html", "module": "HotSpot", "title": "\u7a0b\u5e8f\u8ba1\u6570\u5668"}, {"path": "/hotspot/sa.html", "module": "HotSpot", "title": "SA"}], "\u4e2d\u95f4\u4ef6": [{"path": "/middleware/configuration.html", "module": "\u4e2d\u95f4\u4ef6", "title": "\u914d\u7f6e\u4e2d\u5fc3"}, {"path": "/middleware/database-middleware.html", "module": "\u4e2d\u95f4\u4ef6", "title": "\u6570\u636e\u5e93\u4e2d\u95f4\u4ef6"}, {"path": "/middleware/kafka.html", "module": "\u4e2d\u95f4\u4ef6", "title": "Kafka"}, {"path": "/middleware/logcenter.html", "module": "\u4e2d\u95f4\u4ef6", "title": "\u65e5\u5fd7\u4e2d\u5fc3"}, {"path": "/middleware/memcached.html", "module": "\u4e2d\u95f4\u4ef6", "title": "Memcached"}, {"path": "/middleware/monitor.html", "module": "\u4e2d\u95f4\u4ef6", "title": "\u76d1\u63a7\u4e2d\u5fc3"}, {"path": "/middleware/redis.html", "module": "\u4e2d\u95f4\u4ef6", "title": "Redis"}, {"path": "/middleware/rpc.html", "module": "\u4e2d\u95f4\u4ef6", "title": "RPC\u670d\u52a1"}, {"path": "/middleware/scheduling.html", "module": "\u4e2d\u95f4\u4ef6", "title": "\u8c03\u5ea6\u5e73\u53f0"}, {"path": "/middleware/serialization-protocol.html", "module": "\u4e2d\u95f4\u4ef6", "title": "\u5e8f\u5217\u5316\u534f\u8bae"}], "\u6570\u636e\u5e93": [{"path": "/database/mysql-index.html", "module": "\u6570\u636e\u5e93", "title": "MySQL\u7d22\u5f15"}, {"path": "/database/mysql-lock.html", "module": "\u6570\u636e\u5e93", "title": "\u6570\u636e\u5e93\u9501\u673a\u5236"}, {"path": "/database/mysql-optimize.html", "module": "\u6570\u636e\u5e93", "title": "SQL\u4f18\u5316"}, {"path": "/database/mysql-transaction.html", "module": "\u6570\u636e\u5e93", "title": "\u6570\u636e\u5e93\u4e8b\u52a1"}], "Mac": [{"path": "/mac/common.html", "module": "Mac", "title": "\u5e38\u89c1\u95ee\u9898"}, {"path": "/mac/sudo.html", "module": "Mac", "title": "sudo\u514d\u5bc6"}], "\u5f00\u6e90\u6846\u67b6": [{"path": "/opensourceframework/httpclient.html", "module": "\u5f00\u6e90\u6846\u67b6", "title": "HttpClient"}, {"path": "/opensourceframework/spring-redis-pub-sub.html", "module": "\u5f00\u6e90\u6846\u67b6", "title": "Spring-Redis\u53d1\u5e03\u8ba2\u9605"}, {"path": "/opensourceframework/spring-websocket.html", "module": "\u5f00\u6e90\u6846\u67b6", "title": "Spring-WebSocket"}], "Linux": [{"path": "/linux/charles.html", "module": "Linux", "title": "Charles"}], "\u5de5\u5177": [{"path": "/tool/draw.html", "module": "\u5de5\u5177", "title": "\u4f5c\u56fe"}, {"path": "/tool/screenshot.html", "module": "\u5de5\u5177", "title": "\u622a\u56fe"}], "Ruby": [{"path": "/ruby/array.html", "module": "Ruby", "title": "\u6570\u7ec4"}, {"path": "/ruby/hash.html", "module": "Ruby", "title": "\u54c8\u5e0c"}], "CSS": [{"path": "/css/common-problem.html", "module": "CSS", "title": "\u5e38\u89c1\u95ee\u9898"}], "\u70ed\u70b9": [{"path": "/top/document.html", "module": "\u70ed\u70b9", "title": "\u6587\u6863\u8d44\u6599"}]};