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
* [CopyOnWriteArrayList](#CopyOnWriteArrayList)
* [Collections.synchronizedList()](#synchronizedList)

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

* 数组实现，线程不安全
* 大小: 默认为10，动态扩容，每次扩容1/2；扩容时，申请新的内存空间并copy数组；初始化时指定合适的大小，避免频繁扩容
* 实现RandomAccess接口: 支持快速随机访问
* modCount: add或remove时，modCount++
* iterator遍历: 遍历时modCount改变会抛出ConcurrentModificationException，remove时同步modCount
* 常用方法  
  add(E): O(1) + [扩容]  
  add(int, E): O(1) + copy数组 + [扩容]  
  remove(int): O(1) + copy数组  
  remove(E): O(n) + copy数组  
  get(int): O(1)  
  set(int, E): O(1)

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

* 链表实现，线程不安全
* 大小: 不限
* 实现Deque接口: 双向链表
* modCount: 同ArrayList
* iterator遍历: 同ArrayList
* 常用方法  
  add(E): O(1)  
  add(int, E): O(n)    
  remove(int): O(n)  
  remove(E): O(n)  
  get(int): O(n)  
  set(int): O(n)

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

* 数组实现，线程安全(synchronized)
* 大小：默认为10，动态扩容，capacityIncrement大于0时，扩容大小为capacityIncrement；否则，扩容一倍
* iterator遍历: next和remove操作都是线程同步的
* 其它同ArrayList

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

* 栈: LIFO(后进先出)
* 继承自Vector，线程安全
* 栈操作  
  入栈: push(E)  
  出栈: pop()  
  栈顶: peek()

#### <a id="CopyOnWriteArrayList">CopyOnWriteArrayList</a>

***数据结构***

```java
public class CopyOnWriteArrayList<E> implements List<E>, RandomAccess {

    // 元素数组
    private volatile transient Object[] array;
    // 锁
    transient final ReentrantLock lock = new ReentrantLock();

    final Object[] getArray() {
        return array;
    }

    final void setArray(Object[] a) {
        array = a;
    }

    public E get(int index) {
        return (E) getArray()[index];
    }

    // 同remove set
    public boolean add(E e) {
        final ReentrantLock lock = this.lock;
        // 加锁
        lock.lock();
        try {
            // 获取原数组
            Object[] elements = getArray();
            int len = elements.length;
            // 原数组copy到新数组
            Object[] newElements = Arrays.copyOf(elements, len + 1);
            // 修改新数组
            newElements[len] = e;
            // 原数组替换为新数组
            setArray(newElements);
            return true;
        } finally {
            // 解锁
            lock.unlock();
        }
    }

}
```

***特点***

* 线程安全的List
* 实现原理: volatile + 数组copy
* get: 不加速
* add remove set
    * 加锁
    * 获取原数组
    * 原数组copy到新数组
    * 修改新数组
    * 原数组替换为新数组
    * 解锁
* iterator遍历: 不存在并发问题, 不支持remove操作
* 适用场景: 读多写少
* 注意事项: 每次修改操作都会导致数组copy, 容易引发GC问题

#### <a id="synchronizedList">Collections.synchronizedList()</a>

***特点***

* List包装为线程安全的List
* synchronized实现

```java
synchronized (mutex) {
}
```
