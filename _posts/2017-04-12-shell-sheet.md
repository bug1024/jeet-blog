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
```

## 运行
```shell
    # 标准输出和错误都被重定向到info.log中, 2>&1表示标准错误拷贝了标准输出的行为
    your_command >info.log &2>1
    # 不挂起后台运行，并忽略所有输出
    nohup your_command  >/dev/null  2>&1 &
```
