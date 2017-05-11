---
layout:     post
title:      "常用shell"
subtitle:   "shell清单"
date:       2017-04-12
author:     "Bug1024"
header-img: "img/post-bg-unix-linux.jpg"
tags:
    - Linux
    - Shell
---

## 调试
```shell
    tcpdump -i eth2 -w capture.cap tcp port 9501 and dst host 172.16.1.31
    strace -o strace.log -tt -f -e {call} -p {pid}
```

## 用户
```shell
    # 新增用户
    useradd user1
    # 设置密码
    passwd user1
    # 新建用户组
    groupadd group1
    # 用户组新增用户
    gpasswd -a user1 group1
    # 修改目录所有者
    chown -R user1:group1 dir1
```

## 搜索
```shell
    # 遍历查找当前目录下同时包含xxx和yyy的行
    grep -r "xxx" . | grep "yyy"
    # 遍历查找当前目录下包含xxx或者yyy的行
    grep -r . -e "xxx" -e "yyy"
    # 遍历查找当前目录下包含xxx但不包含yyy的行
    grep -r "xxx" . | grep -v "yyy"
    # 查找7天内没访问过的文件
    find path -atime +7
    # 查找7天内访问过的文件
    find path -atime -7
```

## 端口进程
```shell
    # 查看8080端口
    lsof -i:8080
    # 查看占用8080端口的进程
    netstat -pan|grep 8080
```

## 运行
```shell
    # 标准输出和错误都被重定向到info.log中, 2>&1表示标准错误拷贝了标准输出的行为
    your_command >info.log &2>1
    # 不挂起后台运行，并忽略所有输出
    nohup your_command  >/dev/null  2>&1 &
```

## Git
```shell
    # 不clone历史commit，可加快clone速度
    git clone --depth=1 git_repo_url
    # 切换到远程分支
    git checkout -b branch_name origin/branch_name
    # 撤销add过但未commit的文件
    git reset file
    # 追加最近一次的commit
    git commit --amend
    # push到远程分支, 通常local和remote的分支名是一样的
    git push origin local_branch_name:remote_branch_name
    # 删除远程分支
    git push origin :remote_branch_name
    # 强推
    git push -f
```

## 压测
```shell
    ab -n100 -c5 http://www.baidu.com/
    # Request per sencond 每秒处理的请求数量
    # Time per request 第一个值为每次并发消耗的平均时间，第二个为每次请求所消耗的平均时间
    # Complete requests 完成的请求数量
    # Failed requests 失败的请求数量
```

## 其他
```shell
    # TCP ESTABLISHED数量
    netstat -n|grep ^tcp|awk '{print $NF}'|sort -nr|uniq -c

    #之所以能用到xargs这个命令，关键是由于很多命令不支持|管道来传递参数，而日常工作中有有这个必要，所以就有了xargs命令，例如：
    find /sbin -perm +700 |ls -l       这个命令是错误的
    find /sbin -perm +700 |xargs ls -l   这样才是正确的
```
