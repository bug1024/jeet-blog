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

## 强制使用索引
```sql
    select username from user force index(idx_update_time) where update_time > '2017-01-01 10:10:11'
```

## join语句
* INNER JOIN（内连接或等值连接）：产生同时符合左表和右表的记录。
* LEFT JOIN（左连接）：左连接从左表产生一套完整的记录，与匹配的记录(右表) ，如果没有匹配，右侧将包含null。
* RIGHT JOIN（右连接）：与LEFT JOIN相反
* mysql不支持Full join，不过可以通过UNION 关键字来合并 LEFT JOIN 与 RIGHT JOIN来模拟FULL join.

## 执行顺序
* FORM: 对FROM的左边的表和右边的表计算笛卡尔积。产生虚表VT1
* ON: 对虚表VT1进行ON筛选，只有那些符合<join-condition>的行才会被记录在虚表VT2中。
* JOIN： 如果指定了OUTER JOIN（比如left join、 right join），那么保留表中未匹配的行就会作为外部行添加到虚拟表VT2中，产生虚拟表VT3, rug from子句中包含两个以上的表的话，那么就会对上一个join连接产生的结果VT3和下一个表重复执行步骤1~3这三个步骤，一直到处理完所有的表为止。
* WHERE： 对虚拟表VT3进行WHERE条件过滤。只有符合<where-condition>的记录才会被插入到虚拟表VT4中。
* GROUP BY: 根据group by子句中的列，对VT4中的记录进行分组操作，产生VT5.
* CUBE | ROLLUP: 对表VT5进行cube或者rollup操作，产生表VT6.
* HAVING： 对虚拟表VT6应用having过滤，只有符合<having-condition>的记录才会被 插入到虚拟表VT7中。
* SELECT： 执行select操作，选择指定的列，插入到虚拟表VT8中。
* DISTINCT： 对VT8中的记录进行去重。产生虚拟表VT9.
* ORDER BY: 将虚拟表VT9中的记录按照<order_by_list>进行排序操作，产生虚拟表VT10.
* LIMIT：取出指定行的记录，产生虚拟表VT11, 并将结果返回。
