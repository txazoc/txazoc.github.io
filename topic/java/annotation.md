---
layout: topic
module: Java
title:  注解
date:   2016-11-11
---

定义一个注解

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface Client {

    String type() default "ios";

}
```

反编译: `javap -v Client.class`

```javap
Classfile /Users/txazo/TxazoProject/java/target/classes/Client.class
  Last modified 2016-11-16; size 436 bytes
  MD5 checksum 3c82efe5cf4b7d6f8c3f203e0980b341
  Compiled from "Client.java"
public interface Client extends java.lang.annotation.Annotation
  SourceFile: "Client.java"
  RuntimeVisibleAnnotations:
    0: #11(#12=[e#13.#14])
    1: #15(#12=e#16.#17)
  minor version: 0
  major version: 51
  flags: ACC_PUBLIC, ACC_INTERFACE, ACC_ABSTRACT, ACC_ANNOTATION
Constant pool:
   #1 = Class              #18            //  Client
   #2 = Class              #19            //  java/lang/Object
   #3 = Class              #20            //  java/lang/annotation/Annotation
   #4 = Utf8               type
   #5 = Utf8               ()Ljava/lang/String;
   #6 = Utf8               AnnotationDefault
   #7 = Utf8               ios
   #8 = Utf8               SourceFile
   #9 = Utf8               Client.java
  #10 = Utf8               RuntimeVisibleAnnotations
  #11 = Utf8               Ljava/lang/annotation/Target;
  #12 = Utf8               value
  #13 = Utf8               Ljava/lang/annotation/ElementType;
  #14 = Utf8               TYPE
  #15 = Utf8               Ljava/lang/annotation/Retention;
  #16 = Utf8               Ljava/lang/annotation/RetentionPolicy;
  #17 = Utf8               RUNTIME
  #18 = Utf8               Client
  #19 = Utf8               java/lang/Object
  #20 = Utf8               java/lang/annotation/Annotation
{
  public abstract java.lang.String type();
    flags: ACC_PUBLIC, ACC_ABSTRACT
    AnnotationDefault:
      default_value: s#7}
```

* 注解是一个接口，继承自`java.lang.annotation.Annotation`接口
* `ACC_ANNOTATION`访问标志
* `AnnotationDefault`，参考下面的注解方法默认值
* `RuntimeVisibleAnnotations`

```java
public interface Annotation {

    boolean equals(Object obj);

    int hashCode();

    String toString();

    Class<? extends Annotation> annotationType();

}
```

跟踪`Class.getAnnotation()`方法的源码，查看注解实例的生成过程

```java
public class AnnotationParser {

    public static Annotation annotationForMap(Class<? extends Annotation> type, Map<String, Object> memberValues) {
        return (Annotation) Proxy.newProxyInstance(type.getClassLoader(), new Class[]{type}, new AnnotationInvocationHandler(type, memberValues));
    }

}
```

注解实例是通过动态代理生成的，代理类`sun.reflect.annotation.AnnotationInvocationHandler`

```java
class AnnotationInvocationHandler implements InvocationHandler, Serializable {

    private static final long serialVersionUID = 6182022883658399397L;

    // 注解class
    private final Class<? extends Annotation> type;
    // 注解方法返回值集合
    private final Map<String, Object> memberValues;

    AnnotationInvocationHandler(Class<? extends Annotation> type, Map<String, Object> memberValues) {
        Class<?>[] superInterfaces = type.getInterfaces();
        // 注解校验
        if (!type.isAnnotation() || superInterfaces.length != 1 || superInterfaces[0] != java.lang.annotation.Annotation.class) {
            throw new AnnotationFormatError("Attempt to create proxy for a non-annotation type.");
        }
        this.type = type;
        this.memberValues = memberValues;
    }

    public Object invoke(Object proxy, Method method, Object[] args) {
        // 方法名
        String member = method.getName();
        // 方法参数
        Class<?>[] paramTypes = method.getParameterTypes();

        // equals()方法
        if (member.equals("equals") && paramTypes.length == 1 && paramTypes[0] == Object.class) {
            return equalsImpl(args[0]);
        }

        // 除equals()外, 注解的其它方法都不带参数
        if (paramTypes.length != 0) {
            throw new AssertionError("Too many parameters for an annotation method");
        }

        switch (member) {
            // toString()方法
            case "toString":
                return toStringImpl();
            // hashCode()方法
            case "hashCode":
                return hashCodeImpl();
            // annotationType()方法
            case "annotationType":
                return type;
        }

        // 下面是注解自定义方法处理逻辑

        // 注解方法的返回值
        Object result = memberValues.get(member);

        // 注解方法的返回值为null, 抛出异常
        if (result == null) {
            throw new IncompleteAnnotationException(type, member);
        }

        // 返回值异常
        if (result instanceof ExceptionProxy)
            throw ((ExceptionProxy) result).generateException();

        // 返回值是数组类型, 克隆数组
        if (result.getClass().isArray() && Array.getLength(result) != 0) {
            result = cloneArray(result);
        }

        // 返回值
        return result;
    }

}
```

反编译生成的注解代理类: `javap -public \$Proxy1.class`

```javap
public final class com.sun.proxy.$Proxy1 extends java.lang.reflect.Proxy implements Client {
  public com.sun.proxy.$Proxy1(java.lang.reflect.InvocationHandler) throws ;
  public final boolean equals(java.lang.Object) throws ;
  public final int hashCode() throws ;
  public final java.lang.Class annotationType() throws ;
  public final java.lang.String type() throws ;
  public final java.lang.String toString() throws ;
}
```

#### 注解方法默认值

在class文件中，注解方法默认值被添加到方法的`AnnotationDefault`属性

```c
AnnotationDefault_attribute {
    u2            attribute_name_index;
    u4            attribute_length;
    element_value default_value;
}
```

注解实例使用了缓存

```java
public final class Class<T> {

    private transient Map<Class<? extends Annotation>, Annotation> annotations;

    public <A extends Annotation> A getAnnotation(Class<A> annotationClass) {
        if (annotationClass == null) {
            throw new NullPointerException();
        }

        initAnnotationsIfNecessary();
        return (A) annotations.get(annotationClass);
    }

}
```

```c
RuntimeVisibleAnnotations_attribute {
    u2         attribute_name_index;
    u4         attribute_length;
    u2         num_annotations;
    annotation annotations[num_annotations];
}
```

```c
annotation {
    u2 type_index;
    u2 num_element_value_pairs;
    {   u2            element_name_index;
        element_value value;
    } element_value_pairs[num_element_value_pairs];
}
```

```c
element_value {
    u1 tag;
    union {
        u2 const_value_index;

        {   u2 type_name_index;
            u2 const_name_index;
        } enum_const_value;

        u2 class_info_index;

        annotation annotation_value;

        {   u2            num_values;
            element_value values[num_values];
        } array_value;
    } value;
}
```

```java
@Client(type = "android")
public class Request {
}
```

反编译: `javap -v Request.class`

```javap
Classfile /Users/txazo/TxazoProject/java/target/classes/Request.class
  Last modified 2016-11-16; size 319 bytes
  MD5 checksum 9f4c8f2ab56b10e8d110add81961a469
  Compiled from "Request.java"
public class Request
  SourceFile: "Request.java"
  RuntimeVisibleAnnotations:
    0: #14(#15=s#16)
  minor version: 0
  major version: 51
  flags: ACC_PUBLIC, ACC_SUPER
Constant pool:
   #1 = Methodref          #3.#17         //  java/lang/Object."<init>":()V
   #2 = Class              #18            //  Request
   #3 = Class              #19            //  java/lang/Object
   #4 = Utf8               <init>
   #5 = Utf8               ()V
   #6 = Utf8               Code
   #7 = Utf8               LineNumberTable
   #8 = Utf8               LocalVariableTable
   #9 = Utf8               this
  #10 = Utf8               LRequest;
  #11 = Utf8               SourceFile
  #12 = Utf8               Request.java
  #13 = Utf8               RuntimeVisibleAnnotations
  #14 = Utf8               LClient;
  #15 = Utf8               type
  #16 = Utf8               android
  #17 = NameAndType        #4:#5          //  "<init>":()V
  #18 = Utf8               Request
  #19 = Utf8               java/lang/Object
{
  public Request();
    flags: ACC_PUBLIC
    Code:
      stack=1, locals=1, args_size=1
         0: aload_0       
         1: invokespecial #1                  // Method java/lang/Object."<init>":()V
         4: return        
      LineNumberTable:
        line 2: 0
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
               0       5     0  this   LRequest;
}
```

主要来关注这一部分

```javap
RuntimeVisibleAnnotations:
  0: #14(#15=s#16)
```

* `RuntimeVisibleAnnotations`: 运行时可见注解
* `0`: 第0个注解
* `#14`: 注解的类型 LClient;
* `#15`: 注解方法名 type
* `s`: 注解方法的返回类型 s(String)
* `#16`: 注解方法的值 android

使用`JavaClassViewer`工具可以看到对应的字节码

```console
00  0D          // RuntimeVisibleAnnotations
00  00  00  0B  // byte长度: 11
00  01          // 注解数量: 1
00  0E          // 常量池14: LClient;
00  01          // 注解的元素值对数量: 1
00  0F          // 常量池15: type
73              // Ascii码: s(String)
00  10          // 常量池16: android
```

```java
public class AnnotationParser {

    private static Map<Class<? extends Annotation>, Annotation> parseAnnotations2(byte[] rawAnnotations, ConstantPool constPool, Class<?> container, Class<? extends Annotation>[] selectAnnotationClasses) {
        Map<Class<? extends Annotation>, Annotation> result = new LinkedHashMap<>();
        ByteBuffer buf = ByteBuffer.wrap(rawAnnotations);
        // 注解数量
        int numAnnotations = buf.getShort() & 0xFFFF;
        for (int i = 0; i < numAnnotations; i++) {
            Annotation a = parseAnnotation2(buf, constPool, container, false, selectAnnotationClasses);
            if (a != null) {
                Class<? extends Annotation> klass = a.annotationType();
                result.put(klass, a);
            }
        }
        return result;
    }

    private static Annotation parseAnnotation2(ByteBuffer buf, ConstantPool constPool, Class<?> container, boolean exceptionOnMissingAnnotationClass, Class<? extends Annotation>[] selectAnnotationClasses) {
        // 注解类型index
        int typeIndex = buf.getShort() & 0xFFFF;
        Class<? extends Annotation> annotationClass = null;
        String sig = "[unknown]";
        try {
            sig = constPool.getUTF8At(typeIndex);
            annotationClass = (Class<? extends Annotation>) parseSig(sig, container);
        } catch (IllegalArgumentException ex) {
            annotationClass = constPool.getClassAt(typeIndex);
        }

        AnnotationType type = null;
        try {
            type = AnnotationType.getInstance(annotationClass);
        } catch (IllegalArgumentException e) {
            skipAnnotation(buf, false);
            return null;
        }

        Map<String, Class<?>> memberTypes = type.memberTypes();
        // 传入注解默认值初始化
        Map<String, Object> memberValues = new LinkedHashMap<>(type.memberDefaults());

        // 注解的元素值对数量
        int numMembers = buf.getShort() & 0xFFFF;
        for (int i = 0; i < numMembers; i++) {
            // 元素值对名称index
            int memberNameIndex = buf.getShort() & 0xFFFF;
            // 元素值对名称
            String memberName = constPool.getUTF8At(memberNameIndex);
            // 元素值对类型
            Class<?> memberType = memberTypes.get(memberName);
            if (memberType == null) {
                skipMemberValue(buf);
            } else {
                Object value = parseMemberValue(memberType, buf, constPool, container);
                memberValues.put(memberName, value);
            }
        }
        return annotationForMap(annotationClass, memberValues);
    }

    public static Object parseMemberValue(Class<?> memberType, ByteBuffer buf, ConstantPool constPool, Class<?> container) {
        Object result = null;
        int tag = buf.get();
        switch (tag) {
            case 'e':
                return parseEnumValue((Class<? extends Enum<?>>) memberType, buf, constPool, container);
            case 'c':
                result = parseClassValue(buf, constPool, container);
                break;
            case '@':
                result = parseAnnotation(buf, constPool, container, true);
                break;
            case '[':
                return parseArray(memberType, buf, constPool, container);
            default:
                result = parseConst(tag, buf, constPool);
        }

        if (!(result instanceof ExceptionProxy) && !memberType.isInstance(result)) {
            result = new AnnotationTypeMismatchExceptionProxy(result.getClass() + "[" + result + "]");
        }

        return result;
    }

}
```
