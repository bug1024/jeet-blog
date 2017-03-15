---
layout:     post
title:      "PHP中的json_decode"
subtitle:   "PHP判断字符串是否是合法的json格式"
date:       2017-03-15
author:     "Bug1024"
header-img: "img/post-bg-books.jpg"
tags:
    - PHP
---

判断一个字符串是否是合法的json串通常有以下两种方式

```php
    // 不推荐使用
    function isValidJson($json) {
        return is_null(json_decode($json));
    }

    // 推荐使用
    function isValidJson($json) {
        json_decode($json);
        return json_last_error() === JSON_ERROR_NONE;
    }
```

但是无意中发现直接json_decode一个数字123或者一个字符串"abc"也是可以的
```php
    $a = json_decode(123); // $a值为123
    $b = json_last_error() === JSON_ERROR_NONE; // $b值为true
```

## JSON
 - JSON 是文本格式，能用于在不同编程语言中交换结构化数据
 - 早期的 RFC 4627 中，JSON 文本（即 JSON 的根值）只允许对象和数组类型，直至 ECMA-404 和 RFC 7159 才放松了规定，容许 7 种类型都能为 JSON 文本
 - 所有 JSON 都是合法的 JS 脚本（反之非必然），但在 JS 中为了安全考虑通常是使用 JSON.parse() 来解析成 JS 对象

JSON 的值通常有三种类型：简单值(字符串, 数字, 布尔, NULL), 对象，数组，其中NULL解码后仍是NULL，这也是不推荐使用方法1的原因


