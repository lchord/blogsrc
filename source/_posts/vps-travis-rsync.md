---
title: 使用Travis CI自动部署（VPS篇）
date: 2018.11.05
tag: [hexo,Travis CI,rsync]
category: 笔记
---
博客换回到VPS上了，由于性能较低，不想用动态博客，而hexo的第一个解决的问题就是部署。最先想到的是利用git，提交到VPS后在通过钩子复制到网站目录。但是，遇到了一些困难，包括钩子不触发和权限问题（太不熟练了）。之后想到了对linux很友好的rsync，hexo也提供了rsync部署插件，但是这要求在`_config.yml`里写比较复杂的设置，并且出错时不便于在Travis CI里查看。所以，我还是使用了原生的rsync命令直接将文件同步到VPS。

To be continued...
