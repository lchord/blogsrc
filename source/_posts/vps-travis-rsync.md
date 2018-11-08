---
title: 使用Travis CI自动部署（VPS篇）
date: 2018.11.05
tag: [hexo,Travis CI,rsync]
category: 笔记
---

博客换回到VPS上了，由于性能较低，不想用动态博客，而hexo的第一个解决的问题就是部署。最先想到的是利用git，提交到VPS后在通过钩子复制到网站目录。但是，遇到了一些困难，包括钩子不触发和权限问题（对这个太不熟练了）。之后想到了对linux很友好的rsync，hexo也提供了rsync部署插件，但是这要求在`_config.yml`里写比较复杂的设置，并且出错时不便于在Travis CI里查看。所以，我还是使用了原生的rsync命令直接将文件同步到VPS。

## 准备（本地和VPS）

首先要在Github创建并在Travis-CI中开启存放hexo博客源码的仓库。之后会用到`travis`的文件加密功能，该功能不支持直接在Windows系统上操作（known problem），可使用Windows 10上的子系统功能（也可用ssh直接连接VPS进行操作），或者使用macOS，再者使用Linux等。另外，使用`travis`命令需要通过RubyGems安装。

另外，由于要使用到rsyn要使用到ssh方式，所以也要准备一对私钥和公钥。直接运行：

```
ssh-keygen
```

一般来说，这样私钥文件为`~/.ssh/id_rsa`,对应的公钥为`~/.ssh/id_rsa.pub`。这里需要把公钥文件里的内容完整的复制到VPS上用来连接登录rsync的用户主目录下的`authorized_keys`的文件上。举个栗子：因为rsync同步需要指定用户，若用户名为`john`，就要把内容粘贴到VPS系统中`/home/john/.ssh/authorized_keys`中，如果没有这个文件，可以自己创建。

## 安装（本地）

我使用的是Ubuntu 18.04，由于新安装不久，下载解压压缩包后，使用`ruby setup.rb`安装RubyGems时会报错，一般是缺少build-essential造成的，需要运行：

```
sudo apt install ruby ruby-dev # 如果没有安装Ruby，需要先运行这一步
sudo apt install build-essential
```
来到下载的RubyGems的源码目录，运行：

```
sudo ruby setup.rb
```

接着运行：

```
sudo gem install travis
```

## 文件加密、配置与提交（本地）

To be continued...
