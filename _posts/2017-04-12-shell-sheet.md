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
