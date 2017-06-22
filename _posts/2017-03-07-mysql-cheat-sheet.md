---
layout:     post
title:      "MySQL命令"
subtitle:   "MySQL常用命令清单"
date:       2017-03-07
author:     "Bug1024"
header-img: "img/post-bg-mysql-cheat-sheet.jpeg"
tags:
    - MySQL
---

## 创建表

```sql
    CREATE TABLE `user_info` (
      `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
      `username` int(11) unsigned NOT NULL DEFAULT 0 COMMENT '用户名',
      `real_name` varchar(10) NOT NULL DEFAULT '' COMMENT '真实姓名',
      `add_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
      `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
      PRIMARY KEY (`id`),
      UNIQUE KEY `uni_username` (`username`),
      KEY `idx_add_time` (`add_time`)
    ) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```

## 修改表名
```sql
    alter table user_info rename user;
```

## 增加字段
```sql
    alter table user add column `status` tinyint(2) NOT NULL DEFAULT 0 COMMENT '状态';
```

## 修改字段属性
```sql
    alter table user modify column `real_name` varchar(50) NOT NULL DEFAULT '' COMMENT '真实姓名';
```

## 修改字段名
```sql
    alter table user change column add_time create_time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间';
```

## 修改索引

```sql
    -- 增加索引
    alter table user add index idx_update_time (update_time) ;
    -- 增加唯一索引
    alter table user add unique (column_list) ;
    -- 增加主键
    alter table user add primary key (column_list) ;
    -- 删除索引
    alter table user drop index idx_update_time;
    -- 删除主键
    alter table user drop primary key;
```

## 批量插入
```sql
    insert into user (username, create_time, status) values(10000, '2017-03-01 12:12:12', 1), (10001, '2017-03-01 12:13:14', 1);
```

## 批量更新
```sql
    UPDATE user
        SET username = CASE id
            WHEN 1 THEN 3
            WHEN 2 THEN 4
            WHEN 3 THEN 5
            ELSE username
        END,
        status = CASE id
            WHEN 3 THEN 3
            WHEN 4 THEN 4
            ELSE status
        END
    WHERE id IN (1, 2, 3, 4);
```

## 批量插入若存在则更新
```sql
    insert into user (username, create_time, status) values(10002, '2017-03-01 12:12:12', 1), (10001, '2017-03-01 12:13:14', 2) on duplicate key update status = values(status);
```

## 导入导出
```sql
    -- 导出某个库
    mysqldump -uroot -proot db_name > db_name.sql
    -- 导出某张表
    mysqldump -uroot -proot db_name table_name > table_name.sql
    -- 导出数据库所有表结构
    mysqldump -uroot -proot db_name  -d --add-drop-table db_name > db.sql
    -- 导入
    mysqldump -uroot -proot < import.sql
    -- 使用source方式导入，source import.sql
```
