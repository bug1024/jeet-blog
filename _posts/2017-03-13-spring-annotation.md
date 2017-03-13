---
layout:     post
title:      "Spring注解"
subtitle:   "Spring常用注解"
date:       2017-03-13
author:     "Bug1024"
header-img: "img/post-bg-php-java.jpeg"
tags:
    - Java
    - Spring
---

## 引入的原因
 - 在一个稍大的项目中，通常会有上百个组件，如果这些组件采用xml的bean定义来配置，显然会增加配置文件的体积，维护成本太高
 - Spring2.5引入了组件自动扫描机制，它可以在类路径底下寻找标注了@Component，@Service，@Controller，@Repository注解的类，并把这些类纳入进spring容器中管理
 - 注解的作用和在xml文件中使用bean节点配置组件时一样的

## 使用场景
 - @Service服务层组件，用于标注业务层组件,表示定义一个bean，自动根据bean的类名实例化一个首写字母为小写的bean，例如Chinese实例化为chinese，如果需要自己改名字则:@Service("你自己改的bean名")
 - @Controller用于标注控制层组件(如struts中的action)
 - @Repository持久层组件，用于标注数据访问组件，即DAO组件
 - @Component泛指组件，当组件不好归类的时候，我们可以使用这个注解进行标注

 待续...
