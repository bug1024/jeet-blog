---
layout:     post
title:      "Mybatis"
subtitle:   "Mybatis使用"
date:       2017-03-12
author:     "Bug1024"
header-img: "img/post-bg-mybatis-demo.jpeg"
tags:
    - Java
---

## 文件结构
![mybatis](http://bug1024.com/img/mybatis-tree.jpeg =250)

## pom.xml中引入依赖
```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <project xmlns="http://maven.apache.org/POM/4.0.0"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
        <modelVersion>4.0.0</modelVersion>

        <groupId>my-java-demo</groupId>
        <artifactId>mybatis</artifactId>
        <version>1.0-SNAPSHOT</version>

        <dependencies>
            <dependency>
                <!--3.0的junit是使用编程的方式来进行测试，而junit4是使用注解的方式来运行junit-->
                <groupId>junit</groupId>
                <artifactId>junit</artifactId>
                <version>4.11</version>
                <scope>test</scope>
            </dependency>

            <!--1.数据库相关依赖-->
            <dependency>
                <groupId>mysql</groupId>
                <artifactId>mysql-connector-java</artifactId>
                <version>5.1.35</version>
                <scope>runtime</scope>
            </dependency>
            <dependency>
                <groupId>c3p0</groupId>
                <artifactId>c3p0</artifactId>
                <version>0.9.1.1</version>
            </dependency>

            <!--2.dao框架:MyBatis依赖-->
            <dependency>
                <groupId>org.mybatis</groupId>
                <artifactId>mybatis</artifactId>
                <version>3.3.0</version>
            </dependency>
            <!--mybatis自身实现的spring整合依赖-->
            <dependency>
                <groupId>org.mybatis</groupId>
                <artifactId>mybatis-spring</artifactId>
                <version>1.2.3</version>
            </dependency>

            <!--4:spring依赖-->
            <!--1)spring核心依赖-->
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-core</artifactId>
                <version>4.1.7.RELEASE</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-beans</artifactId>
                <version>4.1.7.RELEASE</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-context</artifactId>
                <version>4.1.7.RELEASE</version>
            </dependency>
            <!--2)spring dao层依赖-->
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-jdbc</artifactId>
                <version>4.1.7.RELEASE</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-tx</artifactId>
                <version>4.1.7.RELEASE</version>
            </dependency>
            <!--3)springweb相关依赖-->
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-web</artifactId>
                <version>4.1.7.RELEASE</version>
            </dependency>
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-webmvc</artifactId>
                <version>4.1.7.RELEASE</version>
            </dependency>
            <!--4)spring test相关依赖-->
            <dependency>
                <groupId>org.springframework</groupId>
                <artifactId>spring-test</artifactId>
                <version>4.1.7.RELEASE</version>
            </dependency>
        </dependencies>

    </project>
```
## 配置mybatis-config.xml
```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE configuration
            PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
            "http://mybatis.org/dtd/mybatis-3-config.dtd">
    <configuration>
        <settings>
            <setting name="cacheEnabled" value="false" />
            <setting name="localCacheScope" value="STATEMENT" />
            <setting name="mapUnderscoreToCamelCase" value="true" />
            <setting name="useGeneratedKeys" value="true" />
            <setting name="defaultStatementTimeout" value="1" />
        </settings>
    </configuration>
```
## 配置jdbc.properties
```
    driver=com.mysql.jdbc.Driver
    url=jdbc:mysql://127.0.0.1:3306/develop?setUnicode=true&characterEncoding=utf8
    username=root
    password=
```

## 编写dao接口和entity类
 - dao接口可不用实现
 - entity类中只需要添加属性以及getter和setter即可

## 添加mapper
 - 在resource中添加dao对应的mapper，mapper中写sql语句

## 添加spirng-dao.xml
 - 将spring和mybatis整合起来需要一个配置文件
```xml
    <?xml version="1.0" encoding="UTF-8"?>
    <beans xmlns="http://www.springframework.org/schema/beans"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           xmlns:context="http://www.springframework.org/schema/context"
           xsi:schemaLocation="http://www.springframework.org/schema/beans
            http://www.springframework.org/schema/beans/spring-beans.xsd
            http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd">

        <!--配置整合mybatis过程
        1.配置数据库相关参数-->
        <context:property-placeholder location="classpath:jdbc.properties"/>

        <!--2.数据库连接池-->
        <bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
            <!--配置连接池属性-->
            <property name="driverClass" value="${driver}" />

            <!-- 基本属性 url、user、password -->
            <property name="jdbcUrl" value="${url}" />
            <property name="user" value="${username}" />
            <property name="password" value="${password}" />

            <!--c3p0私有属性-->
            <property name="maxPoolSize" value="30"/>
            <property name="minPoolSize" value="10"/>
            <!--关闭连接后不自动commit-->
            <property name="autoCommitOnClose" value="false"/>

            <!--获取连接超时时间-->
            <property name="checkoutTimeout" value="1000"/>
            <!--当获取连接失败重试次数-->
            <property name="acquireRetryAttempts" value="2"/>
        </bean>

        <!--约定大于配置-->
        <!--３.配置SqlSessionFactory对象-->
        <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
            <!--往下才是mybatis和spring真正整合的配置-->
            <!--注入数据库连接池-->
            <property name="dataSource" ref="dataSource"/>
            <!--配置mybatis全局配置文件:mybatis-config.xml-->
            <property name="configLocation" value="classpath:mybatis-config.xml"/>
            <!--扫描entity包,使用别名,多个用;隔开-->
            <property name="typeAliasesPackage" value="com.demo.entity"/>
            <!--扫描sql配置文件:mapper需要的xml文件-->
            <property name="mapperLocations" value="classpath:mapper/*.xml"/>
        </bean>

        <!--４:配置扫描Dao接口包,动态实现DAO接口,注入到spring容器-->
        <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
            <!--注入SqlSessionFactory-->
            <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"/>
            <!-- 给出需要扫描的Dao接口-->
            <property name="basePackage" value="com.demo.dao"/>
        </bean>

    </beans>
```

