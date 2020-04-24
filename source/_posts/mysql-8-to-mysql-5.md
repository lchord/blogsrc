---
title: MySQL8.0备份导入MySQL5.6
date: 2020-04-24 11:04:48
tags: mysql
category: 笔记
---

昨天导入`.sql`文件时有`Unknown collation`错误，发现是MySQL8.0的备份，采用了默认的排序规则`utf8mb4_0900_ai_ci`，而MySQL5.6不能识别，因而报错。  

解决方法也很简单，由于这里备份的数据库存的都是很简单的字符内容，直接换一种MySQL5.6兼容的排序就可以了。比如`utf8mb4_general_ci`。备份好原文件后（避免出错），直接用VS Code打开`.sql`文件，`Ctrl`+`H`可以进行搜索替换。5.6版本兼容字符集`utf8mb4`，可以不用替换。  

![mysql8.png](https://img.lchord.com/images/2020/04/24/mysql8.png)  

如果是在VPS的SSH中可以vim或者nano修改`.sql`文件进行查找替换。