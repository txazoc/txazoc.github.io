---
layout: topic
module: Java
title:  List
date:   2016-12-10
---

#### ***目录***

* [ArrayList](#ArrayList)   
* [LinkedList](#LinkedList)
* [Vector](#Vector)
* [Stack](#Stack)

#### <a id="ArrayList">ArrayList</a>

***数据结构***

```java
public class ArrayList<E> implements List<E>, RandomAccess {

    // 默认大小
    private static final int DEFAULT_CAPACITY = 10;

    // 大小
    private int size;
    // 修改次数
    protected transient int modCount = 0;
    // 元素数组
    private transient Object[] elementData;

}
```

***特点***

* 线程不安全
* 基于数组实现，支持快速随机访问
* 大小默认为10，动态扩容，每次扩容1/2；扩容时，申请一块新的数组内存空间；初始化时指定合适的大小，避免频繁扩容
* 顺序遍历：缓存行
* Iterator遍历
* 常用操作  
  get(int): O(1)  
  add(E): O(1)  
  add(int, E): O(1) + 数组copy    
  remove(int): O(1) + 数组copy  
  remove(Object): O(n)

#### <a id="LinkedList">LinkedList</a>

***数据结构***

```java
public class LinkedList<E> implements List<E>, Deque<E> {

    // 链表大小
    transient int size = 0;
    // 链表头节点
    transient Node<E> first;
    // 链表尾节点
    transient Node<E> last;
    // 修改次数
    protected transient int modCount = 0;

    // 链表节点
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

***特点***

* 线程不安全
* 双向链表实现
* 常用操作  
  get(int): O(n)  
  add(E): O(1)  
  add(int, E): O(n)    
  remove(int): O(n)  
  remove(Object): O(n)

#### <a id="Vector">Vector</a>

***数据结构***

```java
public class Vector<E> implements List<E>, RandomAccess {

    // 大小
    protected int elementCount;
    // 元素数组
    protected Object[] elementData;
    // 扩容增量
    protected int capacityIncrement;

}
```

***特点***

* 线程安全：synchronized实现
* 数组实现，同ArrayList
* 扩容：capacityIncrement大于0时，扩容大小为capacityIncrement；否则，扩容一倍

#### <a id="Stack">Stack</a>

***数据结构***

```java
public class Stack<E> extends Vector<E> {

    public E push(E item) {
        addElement(item);
        return item;
    }

    public synchronized E pop() {
        E obj;
        int len = size();
        obj = peek();
        removeElementAt(len - 1);
        return obj;
    }

    public synchronized E peek() {
        int len = size();
        if (len == 0) {
            throw new EmptyStackException();
        }
        return elementAt(len - 1);
    }

}
```

***特点***

* 线程安全
* 继承自Vector
* 后进先出栈
