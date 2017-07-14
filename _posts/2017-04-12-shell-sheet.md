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

## 内置变量
```shell
    $0 脚本名称
    $n 传给脚本/函数的第n个参数
    $$ 脚本的PID
    $! 上一个被执行的命令的PID(后台运行的进程)
    $? 上一个命令的退出状态(管道命令使用${PIPESTATUS})
    $# 传递给脚本/函数的参数个数
    $@ 传递给脚本/函数的所有参数(识别每个参数)
    $* 传递给脚本/函数的所有参数(把所有参数当成一个字符串)
```

## 调试
```shell
    # 抓包
    tcpdump -i eth2 -w capture.cap tcp port 9501 and dst host 172.16.1.31
    # 跟踪系统调用
    strace -o strace.log -tt -f -e {call} -p {pid}
    # 开启coredump  Mac下的cordump文件不在当前运行目录下，而是在系统指定目录，通常是/cores
    ulimit -c unlimited
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

## 文本处理
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
    # 消除重复行
    sort unsort.txt | uniq
    # 统计各行在文件中出现的次数
    sort unsort.txt | uniq -c
    # 找出重复行
    sort unsort.txt | uniq -d
    # 统计行数，单词数，字符数
    wc -[l][w][c] file
```
## 磁盘管理
 ```shell
    # 查看当前目录所占空间大小
    du -sh
    # 查看当前目录下所有子文件夹排序后的大小:
    du -sh `ls` | sort
```

## 进程管理
```shell
    # 查看8080端口
    lsof -i:8080
    # 查看占用8080端口的进程
    netstat -pan|grep 8080
    # 查看用户username的进程所打开的文件
    lsof -u username
    # 查询nginx进程当前打开的文件
    lsof -c nginx
    # 查询指定的进程ID(23295)打开的文件：
    lsof -p 23295
```

## 性能监控
```shell
    # 查看页面交换发生状况 页面发生交换时，服务器的吞吐量会大幅下降，通常是内存不足导致，每秒采样1次，共采样3次
    # sar不可用时，可以使用以下工具替代：linux下有 vmstat、Unix系统有prstat
    sar -W 1 3
```

## 定时任务
```shell
    # 实例1：每1分钟执行一次myCommand
    * * * * * myCommand
    # 实例2：每小时的第3和第15分钟执行
    #3,15 * * * * myCommand
    # 实例3：在上午8点到11点的第3和第15分钟执行
    3,15 8-11 * * * myCommand
    # 实例4：每隔两天的上午8点到11点的第3和第15分钟执行
    3,15 8-11 */2  *  * myCommand
    # 实例5：每周一上午8点到11点的第3和第15分钟执行
    3,15 8-11 * * 1 myCommand
    # 实例6：每晚的21:30重启smb
    30 21 * * * /etc/init.d/smb restart
    # 实例7：每月1、10、22日的4 : 45重启smb
    45 4 1,10,22 * * /etc/init.d/smb restart
    # 实例8：每周六、周日的1 : 10重启smb
    10 1 * * 6,0 /etc/init.d/smb restart
    # 实例9：每天18 : 00至23 : 00之间每隔30分钟重启smb
    0,30 18-23 * * * /etc/init.d/smb restart
    # 实例10：每星期六的晚上11 : 00 pm重启smb
    0 23 * * 6 /etc/init.d/smb restart
    # 实例11：每一小时重启smb
    * */1 * * * /etc/init.d/smb restart
    # 实例12：晚上11点到早上7点之间，每隔一小时重启smb
    0 23-7 * * * /etc/init.d/smb restart
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
    # checkout远程某个文件
    git checkout origin/branch_name -- file1 file2
    # 追加最近一次的commit
    git commit --amend
    # push到远程分支, 通常local和remote的分支名是一样的
    git push origin local_branch_name:remote_branch_name
    # 删除远程分支
    git push origin :remote_branch_name
    # 强推
    git push -f
    # 更新远程分支
    git remote update -p
    # checkout指定文件
    git checkout origin/remote_branch_name -- file_path
```

## 压测
```shell
    ab -n100 -c5 http://www.baidu.com/
    # Request per sencond 每秒处理的请求数量
    # Time per request 第一个值为每次并发消耗的平均时间，第二个为每次请求所消耗的平均时间
    # Complete requests 完成的请求数量
    # Failed requests 失败的请求数量

    #wrk 使用的是 HTTP/1.1，缺省开启的是长连接，而 ab 使用的是 HTTP/1.0，缺省开启的是短链接
    wrk -c 100 -d 10 http://www.baidu.com/
```

## 其他
```shell
    # TCP ESTABLISHED数量
    netstat -n|grep ^tcp|awk '{print $NF}'|sort -nr|uniq -c

    #之所以能用到xargs这个命令，关键是由于很多命令不支持|管道来传递参数，而日常工作中有有这个必要，所以就有了xargs命令，例如：
    find /sbin -perm +700 |ls -l       这个命令是错误的
    find /sbin -perm +700 |xargs ls -l   这样才是正确的
```
