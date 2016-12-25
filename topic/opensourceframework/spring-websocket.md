---
layout: topic
module: 开源框架
title:  Spring-WebSocket
date:   2016-12-25
---

引入pom

```xml
<dependency>
    <groupId>javax.websocket</groupId>
    <artifactId>javax.websocket-api</artifactId>
    <version>1.1</version>
</dependency>

<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-websocket</artifactId>
    <version>4.1.5.RELEASE</version>
</dependency>
```

实现`HandshakeInterceptor`接口的WebSocket握手拦截器:

```java
public class MyHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler handler, Map<String, Object> map) throws Exception {
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler handler, Exception e) {
    }

}
```

实现`WebSocketHandler`接口的WebSocket处理类:

```java
public class MyWebSocketHandler implements WebSocketHandler {

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Connection Established");
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) throws Exception {
        System.out.println("Receive Message");
        session.sendMessage(new TextMessage("server message"));
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable throwable) throws Exception {
        System.out.println("Transport Error");
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("Connection Closed");
    }

    @Override
    public boolean supportsPartialMessages() {
        return false;
    }

}
```

WebSocket配置:

```java
@Configuration
@EnableWebMvc
@EnableWebSocket
public class WebSocketConfig extends WebMvcConfigurerAdapter implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketHandler(), "/websocket/message")
                .addInterceptors(handshakeInterceptor())
                .setAllowedOrigins("*");
    }

    @Bean
    public WebSocketHandler webSocketHandler() {
        return new MyWebSocketHandler();
    }

    @Bean
    public HandshakeInterceptor handshakeInterceptor() {
        return new MyHandshakeInterceptor();
    }

}
```

js代码:

```js
if (!window.WebSocket) {
    alert('浏览器不支持WebSocket');
    return;
}

var socket = new WebSocket("ws://" + window.location.host + "/websocket/message");
socket.onopen = function (e) {
    display("[连接建立]");
    sendMessage();
};
socket.onmessage = function (e) {
    display("[接受消息] " + e.data);
    sendMessage();
};
socket.onerror = function (e) {
    display("[连接异常]");
};
socket.onclose = function (e) {
    display("[连接关闭]");
};
```
