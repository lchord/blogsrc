---
title: 使用Travis CI自动部署Hexo博客到Github Pages
date: 2017.12.16
tag: [hexo,Travis CI]
category: 笔记
---
之前放弃hexo的主要原因就是因为部署的问题，那个时候GitHub还经常抽风。不过现在好多了，加上Travis CI这个工具，再也不用为部署而操心了。
 
我使用Travis CI的主要方法是生成public文件夹，然后将其中内容提交到静态页面仓库。之所以不使用原生的`hexo g`，是因为需要设置SSH才能免密自动提交。但是Travis CI的加密解密让人很困惑，开始我以为是本地Windows系统的原因（使用Windows生成的私钥文件确实不能正常使用），于是我换用Ubuntu，使用其中的`ssh-keygen`命令生成的密钥也不能正常使用，之后我还在vps上试了试，仍然出错。  

不过GitHub提供了token，通过在Travis CI内设置变量，避免在公开文件上设置信息，这样就可以直接安全的把public文件夹进行提交了。
