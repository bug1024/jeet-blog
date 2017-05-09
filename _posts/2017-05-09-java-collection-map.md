---
layout:     post
title:      "Java的List，Map，Set"
subtitle:   "Java中List，Map，Set的区别"
date:       2017-05-09
author:     "Bug1024"
header-img: "img/post-bg-mysql-cheat-sheet.jpeg"
tags:
    - Java
---

## 关系
```
    Collection
    |-List
    │ |-LinkedList
    │ |-ArrayList
    │ |-Vector
    │   |-Stack
    |
    |-Set

    Map
    |-Hashtable
    |-HashMap
    |-WeakHashMap
```

## 介绍
 - Collection Collection是最基本的集合接口，一个Collection代表一组Object。所有实现Collection接口的类都必须提供两个标准的构造函数：无参数的构造函数用于创建一个空的Collection，有一个 Collection参数的构造函数用于创建一个新的Collection，这个新的Collection与传入的Collection有相同的元素。后一个构造函数允许用户复制一个Collection。
 - LinkedList LinkedList实现了List接口，允许null元素。此外LinkedList提供额外的get，remove，insert方法在 LinkedList的首部或尾部。
 - ArrayList ArrayList实现了可变大小的数组。它允许所有元素，包括null。ArrayList没有同步。 size，isEmpty，get，set方法运行时间为常数。但是add方法开销为分摊的常数，添加n个元素需要O(n)的时间。其他的方法运行时间为线性。
 - Vector Vector非常类似ArrayList，但是Vector是同步的。
 - Stack Stack继承自Vector，实现一个后进先出的堆栈。
 - Set Set是一种不包含重复的元素的Collection，即任意的两个元素e1和e2都有e1.equals(e2)=false，Set最多有一个null元素。
 - Map 请注意，Map没有继承Collection接口，Map提供key到value的映射。一个Map中不能包含相同的key，每个key只能映射一个 value。Map接口提供3种集合的视图，Map的内容可以被当作一组key集合，一组value集合，或者一组key-value映射。
 - Hashtable Hashtable继承Map接口，实现一个key-value映射的哈希表。任何非空（non-null）的对象都可作为key或者value。
 - HashMap HashMap和Hashtable类似，不同之处在于HashMap是非同步的，并且允许null，即null value和null key。　
 - WeakHashMap WeakHashMap是一种改进的HashMap，它对key实行“弱引用”，如果一个key不再被外部所引用，那么该key可以被GC回收。

## Map
 - HashMap：基于散列表实现，是无序的；
 - TreeMap：基于红黑树实现，按Key排序；
 - LinkedHashMap：保存了插入顺序；
 - Hashtable：是同步的，与HashMap类似；


## 总结
 - 如果涉及到堆栈，队列等操作，应该考虑用List，对于需要快速插入，删除元素，应该使用LinkedList，如果需要快速随机访问元素，应该使用ArrayList。
 - 如果程序在单线程环境中，或者访问仅仅在一个线程中进行，考虑非同步的类，其效率较高，如果多个线程可能同时操作一个类，应该使用同步的类。
 - 要特别注意对哈希表的操作，作为key的对象要正确复写equals和hashCode方法。

