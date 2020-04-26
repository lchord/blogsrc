---
title: Ghost使用MySQL数据库遇到的问题
date: 2020-04-26 13:15:25
tags: 
    - mysql
    - ghost
category: 笔记
---
记录一个很蠢的问题。  

使用Ghost博客平台连接MySQL数据库，  
按照安装流程，不管是使用root用户自动设置，
或是用预先设置好数据库权限的ghost账号，  
总是出现错误：`Access denied for user 'ghost@127.0.0.1'`。  

此次解决方法：  
之前设置的ghost用户的主机名为`localhost`，  
在phpMyAdmin中再添加一个用户ghost，只是主机名手动填`127.0.0.1`，  
设好权限，按照安装流程进行就没有这个错误了。  
有点迷。🙃

