---
layout:     post
title:      "MySQL调优"
subtitle:   "MySQL常用调优策略"
date:       2017-12-09
author:     "Bug1024"
header-img: "img/maple.jpg"
tags:
    - MySQL
---

## 硬件层相关优化
修改服务器BIOS设置
* 选择DAPC（Performance Per Wait Optimized）模式，发挥CPU最大性能
* Memory Frequency（内存频率）选择Maximum Performance（最佳性能）
* 内存设置菜单中，启用Node Interleaving，避免NUMA问题

## 磁盘I/O相关
* 使用SSD盘
* 如果是磁盘阵列存储，建议阵列卡配备CACHE和BBU模块，可提升IOPS
* raid级别尽量选择raid10，而不是raid5

## 文件系统层优化
* 使用deadline/noop这两种I/O调度器，别用cfq
* 使用xfs文件系统，别用ext3，ext4勉强可用，如果业务量大的话一定要用xfs
* 文件系统mount参数中增加noatime/nodiratime/nobarrier几个选项，其中nobarrier是xfs文件系统特有的

## 内核参数优化
* 优化vm.swappiness参数，降低swap使用率。RHEL7/centos7以上慎重设置为0，可能导致OOM
* 调整vm.dirty_background_ratio/vm.dirty_ratio，确保将脏数据持续刷到磁盘中，避免瞬间I/O过高，产生等待
* 调整net.ipv4.tcp_tw_recycle/net.ipv4.ctp_tw_reuse都设置为1，减少TIME_WAIT，提高TCP效率

## MySQL参数优化
* 建议设置默认引擎为InnoDB，强烈不建议使用MyISAM引擎
* 调整innodb_buffer_pool_size的大小，如果单实例且绝大多数是InnoDB引擎表的话，可考虑设置为物理内存的50%-70%
* 设置innodb_file_per_table=1，使用独立表空间
* 调整innodb_data_file_path = ibdata1:1G:autoextend，不用默认的10M，在高并发场景下性能有很大提升
* 设置innodb_log_file_size=256M，设置innodb_log_file_in_group=2，可基本满足大部分应用场景
* 调整max_connection/max_connection_error，根据业务量大小进行设置
* open_file_limit/innodb_open_files/table_open_cache/table_definitiion_cache可设置大约为max_connection的10倍左右大小
* key_buffer_size/max_heap_table_size不用设置过大
* sort_buffer_size/join_buffer_size/read_buffer_size/read_rmd_buffer_size也不要设置过大

