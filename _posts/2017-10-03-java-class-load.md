---
layout:     post
title:      "Java类加载"
subtitle:   "Java类加载机制"
date:       2017-10-03
author:     "Bug1024"
header-img: "img/post-bg-mysql-cheat-sheet.jpeg"
tags:
    - Java
---
>>虚拟机把描述类的数据从Class文件加载到内存，并对数据进行校验、转换解析和初始化，最终形成可以被虚拟机直接使用的Java类型，这便是虚拟机的类加载机制。

## 加载 Loading
* 通过一个类的全限定名来获取定义此类的二进制字节流
* 将字节流所代表静态存储结果转化为方法区运行时数据结构
* 在内存中生成一个代表这个类的java.lang.Class对象作为方法区这个类各种数据的访问入口

## 验证 Verification
* 文件格式验证
* 元数据验证
* 字节码验证
* 符号引用验证

## 准备 Preparation
* 正式为类变量（被static修饰的变量）分配内存并初始化变量值

## 解析 Resolution
* 类或接口的解析
* 字段解析
* 类方法解析
* 接口方法解析

## 初始化 Initialization
* 真正开始执行字节码

## 使用 Using

## 卸载 Unloading
