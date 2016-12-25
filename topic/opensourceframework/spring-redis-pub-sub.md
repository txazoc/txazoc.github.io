---
layout: topic
module: 开源框架
title:  Spring-Redis发布订阅
date:   2016-12-25
---

引入pom:

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.7.13</version>
</dependency>

<dependency>
    <groupId>org.springframework.data</groupId>
    <artifactId>spring-data-redis</artifactId>
    <version>1.7.6.RELEASE</version>
</dependency>
```

定义消息处理接口:

```java
public interface MessageDelegate {

    void handleMessage(String message);

    void handleMessage(Map message);

    void handleMessage(byte[] message);

    void handleMessage(Serializable message);

    void handleMessage(Serializable message, String channel);

}
```

实现消息处理接口:

```java
public class ProxyMessageDelegate implements MessageDelegate {

    @Override
    public void handleMessage(String message) {
        System.out.println("[Subscribe Message] " + message);
    }

    @Override
    public void handleMessage(Map message) {
        System.out.println("[Subscribe Message]");
    }

    @Override
    public void handleMessage(byte[] message) {
        System.out.println("[Subscribe Message]");
    }

    @Override
    public void handleMessage(Serializable message) {
        System.out.println("[Subscribe Message]");
    }

    @Override
    public void handleMessage(Serializable message, String channel) {
        System.out.println("[Subscribe Message]");
    }

}
```

Spring配置:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:redis="http://www.springframework.org/schema/redis"
       xsi:schemaLocation="
    http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.1.xsd
    http://www.springframework.org/schema/redis http://www.springframework.org/schema/redis/spring-redis-1.0.xsd">

    <bean id="jedisPoolConfig" class="redis.clients.jedis.JedisPoolConfig">
        <property name="maxTotal" value="100" /> <!-- 最大连接数 -->
        <property name="maxIdle" value="20" /> <!-- 最大空闲连接数 -->
        <property name="minIdle" value="5" /> <!-- 最小空闲连接数 -->
        <property name="maxWaitMillis" value="2000" /> <!-- 连接的最大等待毫秒数 -->
        <property name="testOnBorrow" value="true" />
        <property name="testOnReturn" value="true" />
    </bean>

    <bean id="redisConnectionFactory" class="org.springframework.data.redis.connection.jedis.JedisConnectionFactory">
        <property name="hostName" value="127.0.0.1" />
        <property name="port" value="6379" />
        <property name="timeout" value="5000" />
        <property name="poolConfig" ref="jedisPoolConfig" />
        <property name="usePool" value="true" />
    </bean>

    <bean id="redisSerializer" class="org.springframework.data.redis.serializer.StringRedisSerializer" />

    <bean id="redisTemplate" class="org.springframework.data.redis.core.RedisTemplate">
        <property name="connectionFactory" ref="redisConnectionFactory" />
        <property name="defaultSerializer" ref="redisSerializer" />
    </bean>

    <bean id="listener" class="test.ProxyMessageDelegate" />

    <redis:listener-container connection-factory="redisConnectionFactory">
        <!-- 订阅主题proxy, 消息订阅处理方法handleMessage -->
        <redis:listener ref="listener" method="handleMessage" topic="proxy" />
    </redis:listener-container>

</beans>
```

启动Redis和应用，向主题proxy发布消息
