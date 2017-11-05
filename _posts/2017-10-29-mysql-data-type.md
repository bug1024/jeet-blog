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
框架用的多了，已经不会写野生的SQL语句了，于是决定系统地阅读一下MySQL的[官方文档](https://dev.mysql.com/doc/refman/5.7/en/)。

## 常用类型比较

|类型             | 范围                                                                              |   存储空间               | 备注 |
|-----------------|-----------------------------------------------------------------------------------|--------------------------|------|
|BIT(M)           |[1, 64]越界后默认值为1                                                             | (M+7)/8 bytes            |      |
|TINYINT(M)       |signed[-128, 127] unsigned[0, 255]                                                 | 1bytes                   |      |
|SMALLINT(M)      |signed[-32768, 32767] unsigned[0, 65535]                                           | 2bytes                   |      |
|MEDIUMINTINT(M)  |signed[-8388608, 8388607] unsigned[0, 16777605]                                    | 3bytes                   |      |
|INT(M)           |signed[-2147483648, 2147483647] unsigned[0, 4294967295]                             | 4bytes                  |      |
|BIGINT(M)        |signed[-9223372036854775808, 9223372036854775807] unsigned[0, 18446744073709551615] | 8bytes                  |      |
|DECIMAL[(M[,D])] |[~ -1E+66, ~1E+66]                                                                 | 8bytes                   |M数字的总数（精度），D是小数点后的数字（刻度）, M最大65，溢出后默认值为10，D最大30，溢出后默认值为0|
|DOUBLE[(M[,D])]  |[-1.7976931348623157E+308, 1.7976931348623157E+308]                                | 8bytes                   |      |
|FLOAT[(p)]       |[-3.402823466E+38,3.402823466E+38]                                                 | 4bytes, 0 <= p <= 24;8bytes, 25 <= p <= 53| |
|CHAR(M)          |当0 <= M <= 255时为M × w bytes 其中w为指定字符集下每个字符的大小                   |                           |     |
|VARCHAR(M)       |L + 1 bytes, L < =255;L + 2 bytes, L > 255                                         |                           |     |
|TEXT             |[0, 65535]                                                                         |L + 2 bytes                |     |
|MEDIUMTEXT       |[0, 167776150]                                                                     |L + 3 bytes                |     |
|LONGTEXT         |[0, 4294967295]                                                                    |L + 4 bytes                |     |
|YEAR             |[1901, 2155]                                                                       | 1bytes                    |     |
|DATE             |[1000-01-01，9999-12-31]                                                           | 3bytes                    |     |
|TIME             |[-838:59:59,  -838:59:59]                                                          | 3bytes                    |5.6.4开始 5.6.4开始 3 bytes + fractional seconds storage|
|DATETIME         |[1000-01-01 00:00:00, 9999-12-31 23:59:59]                                         | 8bytes                    |5.6.4开始 5 bytes + fractional seconds storage|
|TIMESTAMP        |[1970-01-01 08:00:01, 2038-01-19 11:14:07]                                         | 4bytes                    |5.6.4开始 4 bytes + fractional seconds storage|

备注：5.6.4开始，时间类型支持微秒(最大6位)，所占的存储空间原来基础上加上微秒部分


