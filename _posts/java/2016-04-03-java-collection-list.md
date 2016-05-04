---
layout:     article
categories: [java]
title:      Java List
tags:       [java, 集合]
date:       2016-04-03
---

> List，有序的集合(也称序列)。

List是一个有序的集合，其中的元素允许重复。

List继承自`java.util.Collection`，常见的实现类有`ArrayList`、`LinkedList`、`Vector`、`Stack`、`CopyOnWriteArrayList`。

#### ArrayList

ArrayList是数组实现的List，是线程不安全的。

ArrayList的数据结构如下：

```java
public class ArrayList<E> {

    private int size;
    private transient Object[] elementData;

}
```

ArrayList主要有size和elementData两个属性，size代表list的实际大小，elementData是一个对象数组，存放list的元素。

ArrayList的elementData默认大小为10，可以在初始化时指定。当size大小达到elementData的长度时，就会对elementData进行扩容，每次扩容1/2。扩容时，分配一块新的数组空间，并将原始数组复制到新的数组中。初始化时指定合适的大小，避免频繁扩容。

ArrayList基于数组实现，而数组在内存中是一块连续的内存空间。

#### LinkedList

LinkedList是链表实现的List，是线程不安全的。

LinkedList的数据结构如下：

```java
public class LinkedList<E> {

    // 链表大小
    transient int size = 0;
    // 链表头节点
    transient Node<E> first;
    // 链表尾节点
    transient Node<E> last;

    /**
     * 链表节点
     */
    private static class Node<E> {

        // 节点元素
        E item;
        // 后一个节点
        Node<E> next;
        // 前一个节点
        Node<E> prev;

    }

}
```

LinkedList有头节点和尾节点，是一个双向链表。

#### Vector

Vector是数组的List，是线程安全的。

Vector的数据结构如下：

```java
public class Vector<E> {

    // 扩容增量
    protected int elementCount;
    // 实际大小
    protected int capacityIncrement;
    // 元素数组
    protected Object[] elementData;

}
```

Vector的elementData大小也是默认为10，可以在初始化时指定大小。当elementCount达到elementData的大小时，就会进行扩容，扩容时，如果capacityIncrement大于0，容量增加capacityIncrement，否则扩容一倍。使用时，应在初始化时指定合适的大小，避免频繁扩容。

Vector是线程安全的，这是Vector和ArrayList最主要的区别。Vector线程安全的实现是对方法添加synchronized，并发访问时，效率比较低。

#### Stack

Stack是一个FILO(`先进后出`)栈，继承自Vector。

Stack的操作都是基于Vector，push，将元素插入到元素数组末尾，pop，返回元素数组末尾的元素，并删除，peek，返回元素数组末尾的元素，不删除

#### CopyOnWriteArrayList

#### Collections.synchronizedList(List)

Collections.synchronizedList(List)用来返回线程安全的List。

Collections.synchronizedList(List)内部使用SynchronizedList或SynchronizedList的子类SynchronizedRandomAccessList对List进行包装，SynchronizedList内部有一个mutex的Object对象，使用synchronized对List的方法进行包装。

```java
static class SynchronizedList<E> {

    final Object mutex;
    final List<E> list;

    public E get(int index) {
        synchronized (mutex) {
            return list.get(index);
        }
    }

}
```

#### Collections.unmodifiableList(List)

Collections.synchronizedList(List)用来返回不可修改的List。

Collections.synchronizedList(List)内容使用UnmodifiableList或UnmodifiableList的子类UnmodifiableRandomAccessList对List进行包装，当对List进行增删改操作时，跑出UnsupportedOperationException异常，以此避免修改List的内容。

```java
static class UnmodifiableList<E> {

    public E set(int index, E element) {
        throw new UnsupportedOperationException();
    }

}
```

#### Collections.singletonList(T)

Collections.singletonList(T)用来返回只包含一个元素的不可变的List。

```java
private static class SingletonList<E> extends AbstractList<E> {

    // List的唯一元素, final类型
    private final E element;

    SingletonList(E obj) {
        element = obj;
    }

    public Iterator<E> iterator() {
        // 单个元素的迭代器实现
        return singletonIterator(element);
    }

    public int size() {
        // 大小固定为1
        return 1;
    }

    public boolean contains(Object obj) {
        // 直接判断obj和element是否同一个对象或equals
        return eq(obj, element);
    }

    public E get(int index) {
        if (index != 0) {
            // index大于0，抛出IndexOutOfBoundsException异常            
            throw new IndexOutOfBoundsException("Index: " + index + ", Size: 1");
        }
        return element;
    }

}
```

#### Collections.emptyList()

Collections.emptyList()返回空的List。

#### Collections中List相关的操作

* Collections.sort(List)，排序List。
* Collections.binarySearch(List, Object)，二分查找List中元素的位置。
* Collections.reverse(List)，倒排List。
* Collections.shuffle(List)，乱排List。
* Collections.copy(List dest, List src)，复制List。

#### List迭代器ListIterator

#### List快速随机访问RandomAccess

RandomAccess是List的实现，表明支持`快速随机访问`。RandomAccess的主要目的是在进行随机或顺序访问List时，可以通过改变算法以达到更高的性能。
