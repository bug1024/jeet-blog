---
layout:     post
title:      "PHP扩展开发"
subtitle:   "PHP扩展开发入门"
date:       2017-05-27
author:     "Bug1024"
header-img: "img/post-bg-mysql-cheat-sheet.jpeg"
tags:
    - PHP
---

## 内核基础-变量
变量存储结构
```c
    typedef struct _zval_struct zval;
    ...
    struct _zval_struct {
        // 变量值
        zvalue_value value;
        // 引用计数
        zend_uint refcount__gc;
        // 变量类型
        zend_uchar type;
        // 是否引用
        zend_uchar is_ref__gc;
    };
```

变量值存储结构
```c
    // 使用联合体提升空间利用率
    typedef union _zvalue_value {
        long lval;
        double dval;
        // 存储字符串时多了一个字符串长度的字段
        struct {
            char *val;
            int len;
        } str;
        // 数组Array基于此实现，通常使用拉链法来避免值冲突
        HashTable *ht;
        // 对象Object，PHP的对象只有在运行时才会被创建
        zend_object_value obj;
    } zvalue_value;
```

 - __FILE__等常量其实相当于一个常量模板，或者说是一个占位符，在词法解析时这些模板或占位符就被替换成实际的值

 - GET、POST这些变量是存储在一个集中的地方：EG(symbol_table)

## 准备工作
 - 下载源码

## 生成骨架
```shell
    ./ext_skel --extname=your_extname --proto=your_extname.proto
```

## 函数声明

## 编译


