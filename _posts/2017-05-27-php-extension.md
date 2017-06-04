---
layout:     post
title:      "PHP扩展开发"
subtitle:   "PHP扩展开发入门"
date:       2017-05-27
author:     "Bug1024"
header-img: "img/post-bg-mysql-cheat-sheet.jpeg"
tags:
    - PHP
---

## PHP生命周期
 - 模块初始化阶段
    * 注册常量
    * 注册核心php.ini
    * 注册GET、POST等全局变量
    * 注册内部核心扩展
    * 根据php.ini注册加载其他扩展
    * 调用扩展的PHP_MINIT()
 - 请求初始化阶段
    * 初始化编译器
    * 初始化EG、全局符号表、include file数组、词法分析器
    * 初始化SG
    * 调用扩展的PHP_RINIT()
 - 脚本执行阶段
    * 编译opcode
    * 执行zvm
 - 请求关闭阶段
    * 调用register_shutdown_fucntion()
    * 清理EG
    * 销毁全局变量PG
    * 调用扩展的PHP_RSHUTDOWN()
    * 关闭编译器、执行器、内存管理器
 - 模块关闭阶段
    * 调用扩展的PHP_MSHUTDOWN()
    * 清理ini HashTable元素
    * 关闭output
    * 释放PG

## 内核基础-变量
变量存储结构
```c
    typedef struct _zval_struct zval;
    ...
    struct _zval_struct {
        // 变量值
        zvalue_value value;
        // 引用计数
        zend_uint refcount__gc;
        // 变量类型
        zend_uchar type;
        // 是否引用
        zend_uchar is_ref__gc;
    };
```

变量值存储结构
```c
    // 使用联合体提升空间利用率
    typedef union _zvalue_value {
        long lval;
        double dval;
        // 存储字符串时多了一个字符串长度的字段
        struct {
            char *val;
            int len;
        } str;
        // 数组Array基于此实现，通常使用拉链法来避免值冲突
        HashTable *ht;
        // 对象Object，PHP的对象只有在运行时才会被创建
        zend_object_value obj;
    } zvalue_value;
```

 - __FILE__等常量其实相当于一个常量模板，或者说是一个占位符，在词法解析时这些模板或占位符就被替换成实际的值

 - GET、POST这些变量是存储在一个集中的地方：EG(symbol_table)

## 内核基础-函数和类
PHP函数
```c
    PHP_FUNCTION(count) {
        zval *array;
        long mode = COUNT_NORMAL;
        // 参数个数 + 宏 + 参数类型 + 接收参数的指针
        if (zend_parse_parameters(ZEND_NUM_ARGS() TSRMLS_CC, "z|l", &array, &mode) == FAILURE) {
            return;
        }
        ... //省略

        // 返回值，其余的有RETURN_DOUBLE、RETURN_STRING、RETURN_BOOL、RETURN_NULL、RETURN_EMPTY_STRING、RETURN_REAOURCE
        RETURN_LONG
    }
```

PHP类实现
```c
    struct _zend_class_entry {
        // 类型：ZEND_INTERNAL_CLASS / ZEND_USER_CLASS
        char type;
        // 类名称
        char *name;
        // 即sizeof(name) - 1
        zend_uint name_length;
        // 继承的父类
        struct　_zend_class_entry *parent;
        // 引用数
        int refcount;
        zend_bool constants_updated;

        zend_uint ce_flags; // ZEND_ACC_IMPLICIT_ABSTRACT_CLASS: 类存在abstract方法
        // ZEND_ACC_EXPLICIT_ABSTRACT_CLASS: 在类名称前加了abstract关键字
        // ZEND_ACC_FINAL_CLASS
        // ZEND_ACC_INTERFACE
        HashTable function_table;      // 方法
        HashTable default_properties;  // 默认属性
        HashTable properties_info;     // 属性信息
        HashTable default_static_members;// 类本身所具有的静态变量
        HashTable *static_members; // type == ZEND_USER_CLASS时，取&default_static_members;
        // type == ZEND_INTERAL_CLASS时，设为NULL
        HashTable constants_table; // 常量
        struct _zend_function_entry *builtin_functions;// 方法定义入口

        union _zend_function *constructor;
        union _zend_function *destructor;
        union _zend_function *clone;

        // 魔术方法
        union _zend_function *__get;
        union _zend_function *__set;
        union _zend_function *__unset;
        union _zend_function *__isset;
        union _zend_function *__call;
        union _zend_function *__tostring;
        union _zend_function *serialize_func;
        union _zend_function *unserialize_func;
        // 迭代
        zend_class_iterator_funcs iterator_funcs;

        // 类句柄
        zend_object_value (*create_object)(zend_class_entry *class_type TSRMLS_DC);
        zend_object_iterator *(*get_iterator)(zend_class_entry *ce, zval *object, intby_ref TSRMLS_DC);

        // 类声明的接口
        int(*interface_gets_implemented)(zend_class_entry *iface, zend_class_entry *class_type TSRMLS_DC);

        // 序列化回调函数指针
        int(*serialize)(zval *object， unsignedchar**buffer, zend_uint *buf_len, zend_serialize_data *data TSRMLS_DC);
        int(*unserialize)(zval **object, zend_class_entry *ce, constunsignedchar*buf, zend_uint buf_len, zend_unserialize_data *data TSRMLS_DC);

        // 类实现的接口
        zend_class_entry **interfaces;
        // 类实现的接口数
        zend_uint num_interfaces;
        // 类的存放文件地址 绝对地址
        char *filename;
        // 类定义的开始行
        zend_uint line_start;
        // 类定义的结束行
        zend_uint line_end;
        char *doc_comment;
        zend_uint doc_comment_len;
        // 类所在的模块入口：EG(current_module)
        struct _zend_module_entry *module;
    };
```

  函数和方法的异同 函数和方法都是在编译阶段注册到compiler_globals变量中的，二者都使用相同的内核处理函数zend_do_begin_function_declaration() 和zend_do_end_function_declaration()来完成这一过程，不同的的地方在于定义（注册）的实现和调用的实现

## 编写扩展的基本步骤
* 下载php-src源码
* 通过ext目录下ext_skel脚本生成扩展的基本框架：./ext_skel --extname=your_extname；
* 修改config.m4配置：设置编译配置参数、设置扩展的源文件、依赖库/函数检查等等；
* 编写扩展要实现的功能：按照PHP扩展的格式以及PHP提供的API编写功能；
* 生成configure：扩展编写完成后执行phpize脚本生成configure及其它配置文件；
* 编译&安装：./configure、make、make install，然后将扩展的.so路径添加到php.ini中。

## 扩展中参数的解析
 使用zend_parse_parameters方法进行解析，PHP7中推荐使用 Fast Parameter Parsing API
```c
    PHP_FUNCTION(array_slice) {
    // 省略...
    #ifndef FAST_ZPP
        if (zend_parse_parameters(ZEND_NUM_ARGS(), "al|zb", &input, &offset, &z_length, &preserve_keys) == FAILURE) {
            return;
        }
    #else
        ZEND_PARSE_PARAMETERS_START(2, 4) // 最少参数数和最多参数数
            Z_PARAM_ARRAY(input)
            Z_PARAM_LONG(offset)
            Z_PARAM_OPTIONAL
            Z_PARAM_ZVAL(z_length)
            Z_PARAM_BOOL(preserve_keys)
        ZEND_PARSE_PARAMETERS_END();
    #endif
    // 省略...
    }
```

未完待续。。。
