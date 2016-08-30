---
layout:     article
categories: [spring]
title:      Spring源码 - 标签
tags:       [spring]
date:       2016-08-18
---

本文主要分析Spring的xml配置文件中标签的`验证`和`解析`过程。

下面，先给出一个最简单的Spring容器启动的例子。

```java
public static void main(String[] args) throws IOException {
    String[] configLocations = {"spring.xml"};
    ApplicationContext applicationContext = new ClassPathXmlApplicationContext(configLocations);
    System.in.read();
}
```

`spring.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
            http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/context
            http://www.springframework.org/schema/context/spring-context.xsd">

</beans>
```

在`ClassPathXmlApplicationContext`的构造函数中，会调用`AbstractApplicationContext`的`refresh()`方法启动Spring容器。`refresh()`方法中，先创建好`BeanFactory`，然后调用`AbstractXmlApplicationContext`的`loadBeanDefinitions`加载`BeanDefinition`。

```java
@Override
protected void loadBeanDefinitions(DefaultListableBeanFactory beanFactory) throws BeansException, IOException {
    // 创建XmlBeanDefinitionReader, 用于读取xml中的BeanDefinition
    XmlBeanDefinitionReader beanDefinitionReader = new XmlBeanDefinitionReader(beanFactory);

    beanDefinitionReader.setEnvironment(this.getEnvironment());
    beanDefinitionReader.setResourceLoader(this);
    // 设置EntityResolver
    beanDefinitionReader.setEntityResolver(new ResourceEntityResolver(this));

    initBeanDefinitionReader(beanDefinitionReader);
    loadBeanDefinitions(beanDefinitionReader);
}
```

继续跟进`loadBeanDefinitions()`方法，直到`XmlBeanDefinitionReader`的`loadBeanDefinitions()`方法。

```java
public int loadBeanDefinitions(EncodedResource encodedResource) throws BeanDefinitionStoreException {
    InputStream inputStream = encodedResource.getResource().getInputStream();
    try {
        // xml文件流封装为InputSource
        InputSource inputSource = new InputSource(inputStream);
        if (encodedResource.getEncoding() != null) {
            inputSource.setEncoding(encodedResource.getEncoding());
        }
        return doLoadBeanDefinitions(inputSource, encodedResource.getResource());
    } finally {
        inputStream.close();
    }
}

protected int doLoadBeanDefinitions(InputSource inputSource, Resource resource) throws BeanDefinitionStoreException {
    // 解析xml文件为Document
    Document doc = doLoadDocument(inputSource, resource);
    return registerBeanDefinitions(doc, resource);
}

protected Document doLoadDocument(InputSource inputSource, Resource resource) throws Exception {
    return this.documentLoader.loadDocument(inputSource, getEntityResolver(), this.errorHandler, getValidationModeForResource(resource), isNamespaceAware());
}
```

`this.documentLoader.loadDocument()`的逻辑就是使用`sax`的方式解析xml文件流为Document，解析过程中，会调用`EntityResolver`的`resolveEntity()`方法，这里的`EntityResolver`的即为上面`loadBeanDefinitions()`方法中创建的`ResourceEntityResolver`对象。

来看看`ResourceEntityResolver`类。

```java
public class ResourceEntityResolver extends DelegatingEntityResolver {

    @Override
    public InputSource resolveEntity(String publicId, String systemId) throws SAXException, IOException {
        InputSource source = super.resolveEntity(publicId, systemId);
        return source;
    }

}
```

`ResourceEntityResolver`继承自`DelegatingEntityResolver`类，`resolveEntity()`方法中调用父类的`resolveEntity()`方法。

```java
public class DelegatingEntityResolver implements EntityResolver {

    public static final String DTD_SUFFIX = ".dtd";
    public static final String XSD_SUFFIX = ".xsd";

    private final EntityResolver dtdResolver;
    private final EntityResolver schemaResolver;

    public DelegatingEntityResolver(ClassLoader classLoader) {
        this.dtdResolver = new BeansDtdResolver();
        // 初始化xsd解析器
        this.schemaResolver = new PluggableSchemaResolver(classLoader);
    }

    @Override
    public InputSource resolveEntity(String publicId, String systemId) throws SAXException, IOException {
        if (systemId != null) {
            if (systemId.endsWith(DTD_SUFFIX)) {
                return this.dtdResolver.resolveEntity(publicId, systemId);
            } else if (systemId.endsWith(XSD_SUFFIX)) {
                return this.schemaResolver.resolveEntity(publicId, systemId);
            }
        }
        return null;
    }

}
```

`DelegatingEntityResolver`的构造函数中创建了xsd解析器`PluggableSchemaResolver`，`resolveEntity()`方法中，判断systemId以`.xsd`结尾，即使用xsd的验证方式时，调用`PluggableSchemaResolver`的`resolveEntity()`方法。

```java
public class PluggableSchemaResolver implements EntityResolver {

    public static final String DEFAULT_SCHEMA_MAPPINGS_LOCATION = "META-INF/spring.schemas";

    private final String schemaMappingsLocation;
    private volatile Map<String, String> schemaMappings;

    public PluggableSchemaResolver(ClassLoader classLoader) {
        this.classLoader = classLoader;
        this.schemaMappingsLocation = DEFAULT_SCHEMA_MAPPINGS_LOCATION;
    }

    @Override
    public InputSource resolveEntity(String publicId, String systemId) throws IOException {
        if (systemId != null) {
            String resourceLocation = getSchemaMappings().get(systemId);
            if (resourceLocation != null) {
                Resource resource = new ClassPathResource(resourceLocation, this.classLoader);
                try {
                    InputSource source = new InputSource(resource.getInputStream());
                    source.setPublicId(publicId);
                    source.setSystemId(systemId);
                    return source;
                } catch (FileNotFoundException ex) {
                }
            }
        }
        return null;
    }

    private Map<String, String> getSchemaMappings() {
        if (this.schemaMappings == null) {
            synchronized (this) {
                if (this.schemaMappings == null) {
                    try {
                        Properties mappings = PropertiesLoaderUtils.loadAllProperties(this.schemaMappingsLocation, this.classLoader);
                        Map<String, String> schemaMappings = new ConcurrentHashMap<String, String>(mappings.size());
                        CollectionUtils.mergePropertiesIntoMap(mappings, schemaMappings);
                        this.schemaMappings = schemaMappings;
                    } catch (IOException ex) {
                        throw new IllegalStateException("Unable to load schema mappings from location [" + this.schemaMappingsLocation + "]", ex);
                    }
                }
            }
        }
        return this.schemaMappings;
    }

}
```

`PluggableSchemaResolver`中，先通过`getSchemaMappings()`方法读取`META-INF/spring.schemas`文件中的schema映射配置，然后查找systemId对应的本地文件xsd路径，加载xsd文件并封装为InputSource返回，sax解析会使用返回的xsd文件验证xml中的标签。

`META-INF/spring.schemas`中的内容如下。

```console
http\://www.springframework.org/schema/beans/spring-beans-2.0.xsd=org/springframework/beans/factory/xml/spring-beans-2.0.xsd
http\://www.springframework.org/schema/beans/spring-beans-2.5.xsd=org/springframework/beans/factory/xml/spring-beans-2.5.xsd
http\://www.springframework.org/schema/beans/spring-beans-3.0.xsd=org/springframework/beans/factory/xml/spring-beans-3.0.xsd
http\://www.springframework.org/schema/beans/spring-beans-3.1.xsd=org/springframework/beans/factory/xml/spring-beans-3.1.xsd
http\://www.springframework.org/schema/beans/spring-beans-3.2.xsd=org/springframework/beans/factory/xml/spring-beans-3.2.xsd
http\://www.springframework.org/schema/beans/spring-beans-4.0.xsd=org/springframework/beans/factory/xml/spring-beans-4.0.xsd
http\://www.springframework.org/schema/beans/spring-beans-4.1.xsd=org/springframework/beans/factory/xml/spring-beans-4.1.xsd
http\://www.springframework.org/schema/beans/spring-beans-4.2.xsd=org/springframework/beans/factory/xml/spring-beans-4.2.xsd
http\://www.springframework.org/schema/beans/spring-beans-4.3.xsd=org/springframework/beans/factory/xml/spring-beans-4.3.xsd
http\://www.springframework.org/schema/beans/spring-beans.xsd=org/springframework/beans/factory/xml/spring-beans-4.3.xsd

http\://www.springframework.org/schema/context/spring-context-2.5.xsd=org/springframework/context/config/spring-context-2.5.xsd
...
```

至此，xml文件的验证解析过程完成了。

继续上面`doLoadBeanDefinitions()`方法中的`registerBeanDefinitions()`。

`registerBeanDefinitions()`方法中，先创建`NamespaceHandlerResolver`的默认实现类`DefaultNamespaceHandlerResolver`。

```java
public class DefaultNamespaceHandlerResolver implements NamespaceHandlerResolver {

    public static final String DEFAULT_HANDLER_MAPPINGS_LOCATION = "META-INF/spring.handlers";

    private final ClassLoader classLoader;
    private final String handlerMappingsLocation;
    // handler映射
    private volatile Map<String, Object> handlerMappings;

    public DefaultNamespaceHandlerResolver(ClassLoader classLoader) {
        this(classLoader, DEFAULT_HANDLER_MAPPINGS_LOCATION);
    }

    public DefaultNamespaceHandlerResolver(ClassLoader classLoader, String handlerMappingsLocation) {
        this.classLoader = (classLoader != null ? classLoader : ClassUtils.getDefaultClassLoader());
        this.handlerMappingsLocation = handlerMappingsLocation;
    }

    @Override
    public NamespaceHandler resolve(String namespaceUri) {
        Map<String, Object> handlerMappings = getHandlerMappings();
        Object handlerOrClassName = handlerMappings.get(namespaceUri);
        if (handlerOrClassName == null) {
            return null;
        } else if (handlerOrClassName instanceof NamespaceHandler) {
            return (NamespaceHandler) handlerOrClassName;
        } else {
            String className = (String) handlerOrClassName;
            try {
                Class<?> handlerClass = ClassUtils.forName(className, this.classLoader);
                if (!NamespaceHandler.class.isAssignableFrom(handlerClass)) {
                    throw new FatalBeanException("Class [" + className + "] for namespace [" + namespaceUri +
                            "] does not implement the [" + NamespaceHandler.class.getName() + "] interface");
                }
                // 实例化NamespaceHandler
                NamespaceHandler namespaceHandler = (NamespaceHandler) BeanUtils.instantiateClass(handlerClass);
                // 调用NamespaceHandler的init()方法
                namespaceHandler.init();
                handlerMappings.put(namespaceUri, namespaceHandler);
                return namespaceHandler;
            } catch (Exception e) {
            }
        }
    }

    private Map<String, Object> getHandlerMappings() {
        if (this.handlerMappings == null) {
            synchronized (this) {
                if (this.handlerMappings == null) {
                    try {
                        Properties mappings = PropertiesLoaderUtils.loadAllProperties(this.handlerMappingsLocation, this.classLoader);
                        Map<String, Object> handlerMappings = new ConcurrentHashMap<String, Object>(mappings.size());
                        CollectionUtils.mergePropertiesIntoMap(mappings, handlerMappings);
                        this.handlerMappings = handlerMappings;
                    } catch (IOException ex) {
                        throw new IllegalStateException("Unable to load NamespaceHandler mappings from location [" + this.handlerMappingsLocation + "]", ex);
                    }
                }
            }
        }
        return this.handlerMappings;
    }

}
```

`DefaultNamespaceHandlerResolver`类的作用是通过命名空间获取对应的`NamespaceHandler`，handler映射从`META-INF/spring.handlers`中读取。

`spring.handlers`

```console
http\://www.springframework.org/schema/aop=org.springframework.aop.config.AopNamespaceHandler
http\://www.springframework.org/schema/c=org.springframework.beans.factory.xml.SimpleConstructorNamespaceHandler
http\://www.springframework.org/schema/p=org.springframework.beans.factory.xml.SimplePropertyNamespaceHandler
http\://www.springframework.org/schema/util=org.springframework.beans.factory.xml.UtilNamespaceHandler
http\://www.springframework.org/schema/context=org.springframework.context.config.ContextNamespaceHandler
http\://www.springframework.org/schema/jee=org.springframework.ejb.config.JeeNamespaceHandler
http\://www.springframework.org/schema/lang=org.springframework.scripting.config.LangNamespaceHandler
http\://www.springframework.org/schema/task=org.springframework.scheduling.config.TaskNamespaceHandler
http\://www.springframework.org/schema/cache=org.springframework.cache.config.CacheNamespaceHandler
```

继续跟进，直到`DefaultBeanDefinitionDocumentReader`的`parseBeanDefinitions()`方法。

```java
protected void parseBeanDefinitions(Element root, BeanDefinitionParserDelegate delegate) {
    // 是否默认命名空间(http://www.springframework.org/schema/beans)
    if (delegate.isDefaultNamespace(root)) {
        NodeList nl = root.getChildNodes();
        for (int i = 0; i < nl.getLength(); i++) {
            Node node = nl.item(i);
            if (node instanceof Element) {
                Element ele = (Element) node;
                if (delegate.isDefaultNamespace(ele)) {
                    // 解析默认标签元素
                    parseDefaultElement(ele, delegate);
                } else {
                    delegate.parseCustomElement(ele);
                }
            }
        }
    } else {
        // 解析自定义标签元素
        delegate.parseCustomElement(root);
    }
}

private void parseDefaultElement(Element ele, BeanDefinitionParserDelegate delegate) {
    if (delegate.nodeNameEquals(ele, IMPORT_ELEMENT)) {
        // 解析import标签
        importBeanDefinitionResource(ele);
    } else if (delegate.nodeNameEquals(ele, ALIAS_ELEMENT)) {
        // 解析alias标签
        processAliasRegistration(ele);
    } else if (delegate.nodeNameEquals(ele, BEAN_ELEMENT)) {
        // 解析bean标签
        processBeanDefinition(ele, delegate);
    } else if (delegate.nodeNameEquals(ele, NESTED_BEANS_ELEMENT)) {
        // 解析beans标签
        doRegisterBeanDefinitions(ele);
    }
}   
```

再来看看自定义标签元素的处理，`BeanDefinitionParserDelegate`的`parseCustomElement()`方法。

```java
public BeanDefinition parseCustomElement(Element ele, BeanDefinition containingBd) {
    // 命名空间uri
    String namespaceUri = getNamespaceURI(ele);
    // 查找命名空间对应的NamespaceHandler
    NamespaceHandler handler = this.readerContext.getNamespaceHandlerResolver().resolve(namespaceUri);
    if (handler == null) {
        return null;
    }
    // 解析自定义标签
    return handler.parse(ele, new ParserContext(this.readerContext, this, containingBd));
}
```

先通过上面的`DefaultNamespaceHandlerResolver`查找命名空间对应的`NamespaceHandler`，然后调用`NamespaceHandler`的`parse()`方法解析自定义标签。

比如，Spring中`context`标签的处理，对应`org.springframework.context.config.ContextNamespaceHandler`类。

```java
public class ContextNamespaceHandler extends NamespaceHandlerSupport {

    @Override
    public void init() {
        registerBeanDefinitionParser("property-placeholder", new PropertyPlaceholderBeanDefinitionParser());
        registerBeanDefinitionParser("property-override", new PropertyOverrideBeanDefinitionParser());
        registerBeanDefinitionParser("annotation-config", new AnnotationConfigBeanDefinitionParser());
        registerBeanDefinitionParser("component-scan", new ComponentScanBeanDefinitionParser());
        registerBeanDefinitionParser("load-time-weaver", new LoadTimeWeaverBeanDefinitionParser());
        registerBeanDefinitionParser("spring-configured", new SpringConfiguredBeanDefinitionParser());
        registerBeanDefinitionParser("mbean-export", new MBeanExportBeanDefinitionParser());
        registerBeanDefinitionParser("mbean-server", new MBeanServerBeanDefinitionParser());
    }

}
```

先实例化ContextNamespaceHandler，并调用`init()`方法完成初始化。然后，在解析`context`的标签节点时，调用`parse()`解析标签节点。

#### 自定义标签

* 1.自定义xsd

```xml
<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<xsd:schema xmlns="http://www.txazo.com/schema/txazo"
            xmlns:xsd="http://www.w3.org/2001/XMLSchema"
            xmlns:beans="http://www.springframework.org/schema/beans"
            targetNamespace="http://www.txazo.com/schema/txazo">

    <xsd:import namespace="http://www.w3.org/XML/1998/namespace" />
    <xsd:import namespace="http://www.springframework.org/schema/beans" />

    <xsd:element name="config">
        <xsd:complexType>
            <xsd:attribute name="init" type="xsd:boolean" default="true" />
        </xsd:complexType>
    </xsd:element>

</xsd:schema>
```

* 2.xml文件中使用自定义标签

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:txazo="http://www.txazo.com/schema/txazo"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
       http://www.txazo.com/schema/txazo http://www.txazo.com/schema/txazo/txazo.xsd">

    <txazo:config init="true" />

</beans>
```

* 3.自定义标签处理类，继承自`NamespaceHandlerSupport`

```java
public class TxazoNamespaceHandler extends NamespaceHandlerSupport {

    @Override
    public void init() {
        registerBeanDefinitionParser("config", new TxazoBeanDefinitionParser(TxazoConfig.class));
    }

}

public class TxazoBeanDefinitionParser implements BeanDefinitionParser {

    private final Class<?> beanClass;

    public TxazoBeanDefinitionParser(Class<?> beanClass) {
        this.beanClass = beanClass;
    }

    @Override
    public BeanDefinition parse(Element element, ParserContext parserContext) {
        RootBeanDefinition beanDefinition = new RootBeanDefinition();
        beanDefinition.setBeanClass(beanClass);
        beanDefinition.setLazyInit(false);
        if (!parserContext.getRegistry().containsBeanDefinition("txazo-config")) {
            parserContext.getRegistry().registerBeanDefinition("txazo-config", beanDefinition);
        }
        return beanDefinition;
    }

}
```

* 4.配置`spring.schemas`和`spring.handlers`

`spring.schemas`

```console
http\://www.txazo.com/schema/txazo/txazo.xsd=META-INF/txazo.xsd
```

`spring.handlers`

```console
http\://www.txazo.com/schema/txazo=org.txazo.config.spring.schema.TxazoNamespaceHandler
```
