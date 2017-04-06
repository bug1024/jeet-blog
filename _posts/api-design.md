---
layout:     post
title:      "API设计"
subtitle:   "API设计方案"
date:       2017-03-30
author:     "Bug1024"
header-img: "img/post-bg-uml.jpeg"
tags:
    - API
---

## 风格

## 命名

## 参数

## 返回
最基础的需要返回状态码，状态信息，数据
```javascript
    // bad data不建议直接返回jsonArray，因为扩展性不好，后期如果要加字段比较麻烦
    {
        "code": 123,
        "msg": "success",
        "data":[]
    }
    // good
    {
        "code": 123,
        "msg": "success",
        "data": {
            'list': [],
            'total': 100
        }
    }
```

## 粒度
绝大部分企业中，业务逻辑还是在后端实现，同时前端开发门通常又喜欢后端吐出的数据一步到位，因此如果把控不好那么接口往往会变得很重。

## 统计

## 安全
