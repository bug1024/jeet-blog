---
layout:     post
title:      "ZooKeeper"
subtitle:   "分布式应用程序协调服务"
date:       2017-03-08
author:     "Bug1024"
header-img: "img/post-bg-zookeeper.jpg"
tags:
    - 开源
---

Apache Hadoop 的一个子项目，基于Java的分布式应用程序协调服务

## 使用场景
 - 数据发布与订阅（配置中心）
 - 负载均衡
 - 命名服务
 - 分布式协调
 - 集群管理与Master选举
 - 分布式锁

## Server角色
 - 领导者（Leader) : 领导者不接受client的请求，负责进行投票的发起和决议，最终更新状态。
 - 跟随者（Follower）: Follower用于接收客户请求并返回客户结果。参与Leader发起的投票。
 - 观察者（observer）: Oberserver可以接收客户端连接，将写请求转发给leader节点。但是Observer不参加投票过程，只是同步leader的状态。Observer为系统扩展提供了一种方法。

## 原理
 - Master选举：针对Master选举的需求，通常情况下，我们可以选择常见的关系型数据库中的主键特性来实现：希望成为Master的机器都向数据库中插入一条相同主键ID的记录，数据库会帮我们进行主键冲突检查

## zkClient
 生成环境中经常遭遇session expire异常，zkClient解决watcher一次性注册问题，将znode的事件重新定于为子节点的变化，数据的变化，链接即状态的变化三类。

