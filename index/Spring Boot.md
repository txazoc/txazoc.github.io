---
layout: index
title:  Spring Boot
---

#### 最简单的Spring Boot

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>1.5.18.RELEASE</version>
    <relativePath/>
</parent>

<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
    </plugins>
</build>
```

```java
@SpringBootApplication
public class WebApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebApplication.class, args);
    }

}
```

```java
@RestController
public class IndexController {

    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String index() {
        return "index";
    }

}
```

#### Spring Boot配置文件

```console
application.properties
application-dev.properties
application-test.properties
application-prod.properties
```

```console
spring.profiles.active=dev
```

```java
@Value("${spring.application.name}")
```

#### Spring Boot Web注解

* `@Controller`
* `@RestController`
* `@RequestMapping`
* `@RequestBody`
* `@ResponseBody`

#### Swagger2

#### 统一异常处理

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    @ResponseBody
    @ExceptionHandler(value = Throwable.class)
    public Map<String, Object> jsonErrorHandler(HttpServletRequest req, Throwable t) throws Exception {
        Map<String, Object> data = new HashMap<String, Object>();
        data.put("code", 500);
        data.put("url", req.getRequestURL().toString());
        data.put("message", t.getClass().getName() + ": " + t.getMessage());
        return data;
    }

}
```

#### 事务管理

`@EnableTransactionManagement`开启事务支持

```java
@Transactional
```

#### 定时任务

`@EnableScheduling`启用定时任务

```java
@Scheduled(fixedRate = 5000)
@Scheduled(fixedDelay = 5000)
@Scheduled(cron = "*/5 * * * ?")
```

#### 异步调用

`@EnableAsync`开启异步调用

```java
@Async
@Async("taskExecutor")
```
