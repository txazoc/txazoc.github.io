---
layout:     article
categories: [mybatis]
title:      MyBatis初始化分析
tags:       [mybatis]
date:       2016-07-28
---

MyBatis的初始化就是构建`SqlSessionFactory`的过程。

```java
public static void main(String[] args) throws IOException {
    String resource = "mybatis.xml";
    InputStream inputStream = Resources.getResourceAsStream(resource);
    SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
}
```

来看`SqlSessionFactoryBuilder`的源码。

```java
public class SqlSessionFactoryBuilder {

    public SqlSessionFactory build(InputStream inputStream) {
        return build(inputStream, null, null);
    }

    public SqlSessionFactory build(InputStream inputStream, String environment, Properties properties) {
        XMLConfigBuilder parser = new XMLConfigBuilder(inputStream, environment, properties);
        return build(parser.parse());
    }

    public SqlSessionFactory build(Configuration config) {
        return new DefaultSqlSessionFactory(config);
    }

}
```

`build()`的过程: 先创建XML配置解析器`XMLConfigBuilder`，然后调用`parse()`解析MyBatis的XML配置为`Configuration`对象，最后实例化`DefaultSqlSessionFactory`，并传入`Configuration`对象。

进入`XMLConfigBuilder`查看`parse()`的源码。

```java
public class XMLConfigBuilder {

    public Configuration parse() {
        if (parsed) {
            throw new BuilderException("Each XMLConfigBuilder can only be used once.");
        }
        parsed = true;
        parseConfiguration(parser.evalNode("/configuration"));
        return configuration;
    }

    private void parseConfiguration(XNode root) {
        try {
            // 解析settings配置
            Properties settings = settingsAsPropertiess(root.evalNode("settings"));

            // 解析properties配置
            propertiesElement(root.evalNode("properties"));

            // 加载自定义的文件系统
            loadCustomVfs(settings);

            // 解析类型别名配置
            typeAliasesElement(root.evalNode("typeAliases"));

            // 解析插件配置
            pluginElement(root.evalNode("plugins"));

            // 解析对象工厂
            objectFactoryElement(root.evalNode("objectFactory"));

            // 解析对象包装工厂
            objectWrapperFactoryElement(root.evalNode("objectWrapperFactory"));

            // 解析反射工厂
            reflectionFactoryElement(root.evalNode("reflectionFactory"));

            // 设置自定义的settings配置到Configuration中
            settingsElement(settings);

            // 解析数据库环境配置
            environmentsElement(root.evalNode("environments"));

            // 解析数据库ID提供者
            databaseIdProviderElement(root.evalNode("databaseIdProvider"));

            // 解析类型转换
            typeHandlerElement(root.evalNode("typeHandlers"));

            // 解析Mapper映射
            mapperElement(root.evalNode("mappers"));
        } catch (Exception e) {
            throw new BuilderException("Error parsing SQL Mapper Configuration. Cause: " + e, e);
        }
    }

}
```

可以看出`parse()`里面的逻辑就是逐条解析MyBatis的XML标签，下面一一给出XML标签的示例和解析过程。

#### settingsAsPropertiess()

`settings`标签配置:

```xml
<settings>
    <setting name="cacheEnabled" value="false"/>
</settings>
```

`settingsAsPropertiess()`逻辑: 解析`settings`配置为Properties，setting的name-value对应为Properties的key-value，并检查name的合法性。

#### propertiesElement()

`properties`标签配置:

```xml
<properties resource="config/server.properties">
    <property name="user" value="root"/>
</properties>

<properties url="http://127.0.0.1:8080/config/server.properties"/>
```

`propertiesElement()`逻辑: 合并url或resource(不可同时存在)中对应的键值对和property对应的键值对，添加到`configuration`的`variables`变量中。

#### loadCustomVfs()

`loadCustomVfs()`逻辑: 读取上面`settings`中配置的`vfsImpl`，`vfsImpl`必须是`org.apache.ibatis.io.VFS`的子类的类名，如果`vfsImpl`对应的属性值存在的话。

#### typeAliasesElement()

`typeAliases`标签配置:

```xml
<typeAliases>
    <typeAlias type="test.mybatis.entity.Mobile"/>

    <typeAlias alias="mobile1" type="test.mybatis.entity.Mobile"/>

    <package name="test.mybatis.entity"/>
</typeAliases>
```

`typeAliasesElement()`逻辑: 解析类型别名配置。类型别名就是`Class`的别名，对应就是`TypeAliasRegistry`的`TYPE_ALIASES`，

```java
public class TypeAliasRegistry {

    private final Map<String, Class<?>> TYPE_ALIASES = new HashMap<String, Class<?>>();

    public TypeAliasRegistry() {
        registerAlias("string", String.class);
        registerAlias("byte", Byte.class);
        registerAlias("long", Long.class);
        registerAlias("short", Short.class);
        registerAlias("int", Integer.class);
        registerAlias("integer", Integer.class);
        registerAlias("double", Double.class);
        registerAlias("float", Float.class);
        registerAlias("boolean", Boolean.class);
    }

}
```

#### pluginElement()

#### objectFactoryElement()

#### objectWrapperFactoryElement()

#### reflectionFactoryElement()

#### settingsElement()

#### environmentsElement()

#### databaseIdProviderElement()

#### typeHandlerElement()

#### mapperElement()
