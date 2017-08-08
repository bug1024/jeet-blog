---
layout:     post
title:      "MySQL InnoDB"
subtitle:   "MySQL InnoDB引擎"
date:       2017-03-07
author:     "Bug1024"
header-img: "img/post-bg-mysql-cheat-sheet.jpeg"
tags:
    - MySQL
---

# MySQL实例
在Unix上，启动一个MySQL实例通常会产生两个进程，mysqld 就是真正的数据库服务守护进程，而mysqld_safe是一个用于检查和设置mysqld启动的控制程序，它负责监控于重启。

# 数据存储
在InnoDB存储引擎中，所有的数据都被逻辑地存放在表空间中，表空间（tablespace）是存储引擎中最高的存储逻辑单位，在表空间的下面又包括段（segment）、区（extent）、页（page)

# 存储表
MySQL使用InnoDB存储表时，会将表的定义和数据索引等信息分开存储，其中前者存储在.frm 文件中，后者存储在.ibd 文件中

# 存储记录
与现有的大多数存储引擎一样，InnoDB 使用页作为磁盘管理的最小单位；数据在 InnoDB 存储引擎中都是按行存储的，每个 16KB 大小的页中可以存放 2-200 行的记录。
