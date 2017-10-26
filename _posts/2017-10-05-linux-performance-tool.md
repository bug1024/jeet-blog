---
layout:     post
title:      "Linux性能调优工具"
subtitle:   "Linux常见性能排查命令"
keyword:    "Linux,性能排查"
description: "Linux性能排查命令"
date:       2017-10-05
author:     "Bug1024"
header-img: "img/post-bg-unix-linux.jpg"
tags:
    - Linux
---

## 监控指标
 - load 特定事时间间隔内运行队列中的平均线程数
 - user time CPU执行用户进程所占用的时间
 - system time CPU在内核所花费的时间
 - nice time 系统在调整进程优先级的时候所花费的时间
 - idle time 系统空闲等待进程运行的时间
 - waiting time CPU在等待IO操作所花费的时间
 - hard irq time 系统处理硬件中断所占用的时间
 - soft irq time 系统处理软件中断所占用的时间
 - steal time 被强制等待虚拟机CPU的时间，占比较高表示当前虚拟机与该宿主其他虚拟机争用CPU频繁
 - 磁盘剩余空间 使用df和du命令查看
 - 网络traffic 使用sar命令查看 sar -n DEV 1 1
 - 磁盘IO 使用iostat命令查看 iostat -d -k
 - 内存使用 使用free命令查看
 - swap IO 使用vmstat命令查看

## CPU
* 使用`top`或`uptime`看过去1分钟、5分钟、15分钟机器的负载。按照经验，若数值小于 0.7 * CPU核数，则系统工作正常
* 通过`vmstat`查看CPU上下文切换次数， 上下文切换的场景：
    * 时间片用完，CPU正常调度下一个任务
    * 被其它优先级更高的任务抢占
    * 执行任务碰到I/O阻塞，挂起当前任务，切换到下一个任务
    * 户代码主动挂起当前任务让出CPU
    * 多任务抢占资源，由于没有抢到被挂起
    * 硬件中断

## Memory
* 操作系统角度，内存关注应用进程是否足够，可以使用`free –m`查看内存的使用情况。
![查看内存](http://bug1024.com/img/free-m.jpeg)
* 通过`top`查看进程使用的虚拟内存`VIRT`和物理内存`RES`，根据公式VIRT = SWAP + RES可以推算出具体应用使用的交换分区（Swap）情况

## I/O
* `I/O`包括`磁盘I/O`和`网络 I/O`，一般情况下磁盘更容易出现`I/O瓶颈`。
* 通过`iostat`可查看磁盘的读写情况，通过CPU的`I/O wait`可以看出磁盘I/O是否正常。

## System Call
`strace`常用来跟踪进程执行时的系统调用和所接收的信，常见选项:
* -c 统计每一系统调用的所执行的时间,次数和出错的次数等
* -d 输出strace关于标准错误的调试信息
* -f 跟踪由fork调用所产生的子进程
* -ff 如果提供-o filename,则所有进程的跟踪结果输出到相应的filename.pid中, pid是各进程的进程号
* -F 尝试跟踪vfork调用.在-f时,vfork不被跟踪
* -h 输出简要的帮助信息
* -i 输出系统调用的入口指针
* -q 禁止输出关于脱离的消息
* -r 打印出相对时间关于,,每一个系统调用
* -t 在输出中的每一行前加上时间信息
* -tt 在输出中的每一行前加上时间信息,微秒级
* -ttt 微秒级输出,以秒了表示时间
* -T 显示每一调用所耗的时间
* -v 输出所有的系统调用一些调用关于环境变量,状态,输入输出等调用由于使用频繁,默认不输出
* -V 输出strace的版本信息

```
    strace -tt -f -p {pid}
```

## Others
```shell
    # 抓包
    tcpdump -i eth2 -w capture.cap tcp port 9501 and dst host 172.16.1.31
```
