---
layout:     post
title:      "MySQL数据类型"
subtitle:   "MySQL系列一"
date:       2017-10-29
author:     "Bug1024"
header-img: "img/post-bg-mysql-cheat-sheet.jpeg"
tags:
    - MySQL
---

## 前言
框架用的多了，已经不会写野生的SQL语句了，于是决定系统地阅读一下MySQL的[官方文档](https://dev.mysql.com/doc/refman/5.7/en/)，如果没有特殊说明文章中的MySQL版本皆为5.7。

## 数字型
* `BIT[(M)]`
位， M表示每个值占的bit数, 取值范围[1, 64]，越界后默认值为1

* `TINYINT[(M)] [UNSIGNED] [ZEROFILL]`
范围极小的整数， signed取值范围：[-128, 127]，unsigned取值范围：[0, 255]

* `BOOL, BOOLEAN`
可以用TINYINT(1)替代， 值为0被视为false，值非0视为ture

* `SMALLINT[(M)] [UNSIGNED] [ZEROFILL]`
范围很小的整数，signed取值范围：[-32768, 32767]，unsigned取值范围：[0, 255]

* `INT[(M)] [UNSIGNED] [ZEROFILL]`
范围中等的整数，signed：[-2147483648, 2147483647]，unsigned：[0, 4294967295]

* `BIGINT[(M)] [UNSIGNED] [ZEROFILL]`
范围很大的整数，signed：[-9223372036854775808, 9223372036854775807]，unsigned：[0, 18446744073709551615]

* `DECIMAL[(M[,D])] [UNSIGNED] [ZEROFILL]`
精确小数， M是数字的总数（精度），D是小数点后的数字（刻度）, M最大65，溢出后默认值为10，D最大30，溢出后默认值为0

* `FLOAT[(M,D)] [UNSIGNED] [ZEROFILL]`
范围较小的单精度浮点数

* `DOUBLE[(M,D)] [UNSIGNED] [ZEROFILL]`
范围中等的双精度浮点数

## 日期型
![格式](http://bug1024.com/img/mysql-data-type-date.jpeg)

## 整型数比较
![整型数](http://bug1024.com/img/mysql-data-type-integer.jpeg)
