---
layout:     post
title:      "Redis"
subtitle:   "Redis总结"
date:       2017-01-07
author:     "Bug1024"
header-img: "img/post-bg-redis.jpg"
tags:
    - Redis
---

## 特点
 - 高性能Key-Value存储
 - 丰富的数据结构：string、list、hash、set、zset、hypeloglog
 - 支持数据过期：主动过期+惰性过期
 - 支持多种LRU策略：volatile-lru、volatile-ttl 等
 - 内存管理：tcmaloc、jemalloc
 - 内存存储+磁盘持久化: rdb、aof
 - 支持主从复制
 - 单线程

## 配置

aof配置
```
    appendonly yes 是否打开aof日志功能
    appendfsync always 每一个命令都立刻同步到aof,安全但是速度慢
    appendfsync everysec 折衷方案每秒一次,一般选用这种。
    appendfsync no 交给操作系统,由操作系统判断缓冲区大小，同意写入aof中,频率低速度快。
    no-appendfsync-on-rewrite yes 正在导出rdb文件，是否要停止aof
    auto-aof-rewrite-percentage 100 aof文件比起上次重写时的大小，增长率是百分之百时重写。
    auto-aof-rewrite-min-size 64mb 至少超过64m重写。

```
rdb配置
```
    save 10 100 10s后如果至少100个key发生变化则生成rdb
    save 100 50 可以多个，任意一个条件满足即可触发
    dbfilename dump.rdb 指定rdb保存到本地数据库文件名
    stop-writes-on-bgsave-error yes 当硬盘因为权限等原因无法写入时，停止写入
    rdbchecksum yes 对rdb文件进行校验

```

## 持久化
同时开启两种持久化方式, 当redis重启的时候会优先载入AOF文件来恢复原始的数据,因为在通常情况下AOF文件保存的数据集要比RDB文件
保存的数据集要完整

## 主从同步原理
 - slave向master发送sync指令，master接收到时调用bgsave指令fork一个子进程进行持久化工作，该期间master的写指令都缓存在内存中
 - bgsave指令完成后master会将rdb文件发送给slave，slave接收到后将其存在磁盘上，然后读入内存，这个动作完成后master会将这段时间缓存的写指令再以redis协议的格式发送给slave
 - 2.8版版本引入增量同步机制

## 事务
 - MULTI用来组装一个事务
 - EC用来执行一个事
 - DISCARD用来取消一个事务
 - WATCH用来监视一些key，一旦这些key在事务执行之前被改变，则取消事务的执行

## Redis Cluster
 - Redis 集群不像单机Redis 那样支持多数据库功能， 集群只使用默认的 0 号数据库， 并且不能使用 SELECT 命令。
 - 节点之间使用Gossip 协议 来进行以下工作

## 数据结构
 - String SDS 二进制安全 记录length

## 分布式方案
 - Codis 豌豆荚出品
 - twemproxy 推特出品


