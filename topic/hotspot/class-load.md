---
layout: topic
module: HotSpot
title:  类加载
date:   2016-10-21
---

* java.lang.ClassLoader.loadClass(String)
* java.net.URLClassLoader.findClass(String)
* java.lang.ClassLoader.defineClass(String, ByteBuffer, ProtectionDomain)
* jdk/src/share/native/java/lang/ClassLoader.c

```c
jclass Java_java_lang_ClassLoader_defineClass1() {
    jclass result = JVM_DefineClassWithSource(env, utfName, loader, body, length, pd, utfSource);
    return result;
}
```

* hotspot/src/share/vm/prims/jvm.cpp

```c
JVM_ENTRY(jclass, JVM_DefineClassWithSource(JNIEnv *env, const char *name, jobject loader, const jbyte *buf, jsize len, jobject pd, const char *source))
    JVMWrapper2("JVM_DefineClassWithSource %s", name);
    return jvm_define_class_common(env, name, loader, buf, len, pd, source, true, THREAD);
JVM_END

static jclass jvm_define_class_common() {
    // 类文件流
    ClassFileStream st((u1 *) buf, len, (char *) source);
    klassOop k = SystemDictionary::resolve_from_stream(class_name, class_loader, protection_domain, &st, verify != 0, CHECK_NULL);
    return (jclass) JNIHandles::make_local(env, Klass::cast(k)->java_mirror());
}
```

* hotspot/src/share/vm/classfile/systemDictionary.cpp

```c
klassOop SystemDictionary::parse_stream() {
    // 解析类文件
    instanceKlassHandle k = ClassFileParser(st).parseClassFile(class_name, class_loader, protection_domain, host_klass, cp_patches, parsed_name, true, THREAD);
    return k();
}
```

* hotspot/src/share/vm/classfile/classFileParser.cpp

```c
instanceKlassHandle ClassFileParser::parseClassFile() {
    // 魔数
    u4 magic = cfs->get_u4_fast();
    // 魔数校验
    guarantee_property(magic == JAVA_CLASSFILE_MAGIC, "Incompatible magic value %u in class file %s", magic,
                       CHECK_(nullHandle));

    // 次版本号
    u2 minor_version = cfs->get_u2_fast();
    // 主版本号
    u2 major_version = cfs->get_u2_fast();
    // 版本号校验
    if (!is_supported_version(major_version, minor_version)) {
        Exceptions::fthrow(THREAD_AND_LOCATION, vmSymbols::java_lang_UnsupportedClassVersionError(),
                           "%s : Unsupported major.minor version %u.%u", name->as_C_string(), major_version,
                           minor_version);
        return nullHandle;
    }

    // 解析常量池
    constantPoolHandle cp = parse_constant_pool(class_loader, CHECK_(nullHandle));

    // 常量池大小
    int cp_size = cp->length();

    // 访问标识
    jint flags = cfs->get_u2_fast() & JVM_RECOGNIZED_CLASS_MODIFIERS;

    // 当前类索引
    u2 this_class_index = cfs->get_u2_fast();
    // 当前类的符号引用
    Symbol *class_name = cp->unresolved_klass_at(this_class_index);

    // 父类索引
    u2 super_class_index = cfs->get_u2_fast();

    // 接口数量
    u2 itfs_len = cfs->get_u2_fast();
    if (itfs_len == 0) {
        // 解析接口
        local_interfaces = parse_interfaces(cp, itfs_len, class_loader, protection_domain, _class_name,
                                            CHECK_(nullHandle));
    }

    // 字段数量
    u2 java_fields_count = 0;
    // 解析字段
    typeArrayHandle fields = parse_fields(class_name, cp, access_flags.is_interface(), &fac, &fields_annotations,
                                          &java_fields_count, CHECK_(nullHandle));

    // 解析方法
    objArrayHandle methods = parse_methods(class_loader, cp, access_flags.is_interface(), &promoted_flags,
                                           &has_final_method, &methods_annotations_oop,
                                           &methods_parameter_annotations_oop, &methods_default_annotations_oop,
                                           CHECK_(nullHandle));

    // 解析属性
    parse_classfile_attributes(class_loader, cp, &parsed_annotations, CHECK_(nullHandle));

    // 虚函数表大小
    int vtable_size = 0;
    int itable_size = 0;

    klassVtable::compute_vtable_size_and_num_mirandas(vtable_size, num_miranda_methods, super_klass(), methods(),
                                                      access_flags, class_loader, class_name, local_interfaces(),
                                                      CHECK_(nullHandle));
    itable_size = access_flags.is_interface() ? 0 : klassItable::compute_itable_size(transitive_interfaces);

    // 实例大小
    int instance_size = align_object_size(next_nonstatic_type_offset / wordSize);

    klassOop ik = oopFactory::new_instanceKlass(name, vtable_size, itable_size, static_field_size, total_oop_map_count,
                                                access_flags, rt, host_klass, CHECK_(nullHandle));

    instanceKlassHandle this_klass(THREAD, ik);
    // 填充this_klass
    this_klass->set_class_loader(class_loader());
    this_klass->set_nonstatic_field_size(nonstatic_field_size);
    // ...

    // 创建类的Class实例并初始化静态字段
    java_lang_Class::create_mirror(this_klass, class_loader, CHECK_(nullHandle));

    return this_klass;
}
```
