---
title: 使用Travis CI自动部署Hexo博客到VPS
date: 2018.11.05
tag: [hexo,Travis CI,rsync]
category: 笔记
---

## 前言

（文章已于2019年9月24日更新）

博客换回到VPS上了，由于性能较低，不想用动态博客，而hexo的第一个解决的问题就是部署。最先想到的是利用git，提交到VPS后在通过钩子复制到网站目录。但是，遇到了一些困难，包括钩子不触发和权限问题（对这个太不熟练了）。之后想到了对linux很友好的rsync，hexo也提供了rsync部署插件，但是这要求在`_config.yml`里写比较复杂的设置，并且出错时不便于在Travis CI里查看。所以，我还是使用了原生的rsync直接将文件同步到VPS。

## 准备

1. 首先要在Github创建并在Travis-CI中开启存放hexo博客源码的仓库。
2. 需要macOS或者Linux等环境，WSL也可以。因为`travis`的文件加密功能在Windows环境上“[不起作用](https://docs.travis-ci.com/user/encrypting-files/#caveat)”。

## 安装travis（本地）

我使用的是Ubuntu 18.04，由于新安装不久，下载解压压缩包后，使用`ruby setup.rb`安装RubyGems时会报错，一般是缺少build-essential造成的，需要运行：

```
sudo apt install ruby ruby-dev # 如果没有安装Ruby，需要先运行这一步
sudo apt install build-essential # 如缺少，安装travis也可能报错
```

来到下载的RubyGems的源码目录，运行：

```
sudo ruby setup.rb
```

接着运行：

```
sudo gem install travis
```

## 文件的准备（本地）

rsync使用ssh方式，所以要准备一对私钥和公钥。直接运行：  

```
ssh-keygen
```

一般来说，这样私钥文件为`~/.ssh/id_rsa`，对应的公钥为`~/.ssh/id_rsa.pub`。这里需要把公钥文件里的内容完整的复制到VPS上用来连接登录rsync的用户主目录下的`authorized_keys`的文件上。举个栗子：因为rsync同步要指定用户，若用户名为`john`，就把内容粘贴到VPS`/home/john/.ssh/authorized_keys`中，如果没有这个文件，可以自己创建。  

由于私钥属于敏感文件，所以不应直接提交到Github仓库里；另外，通过ssh方式使用rsync同步文件需要指明ssh端口和用户名，这也属于敏感信息。对于用户可以通过限制用户登录权限的方式提高安全性，但是ssh端口暴露确实不好，一般来说VPS提供商也会建议修改默认ssh端口。  

我这里用了一种笨办法，即不把命令写在`.travis.yml`文件里，而是写一个脚本，然后把脚本文件加密，上传到Travis后解密运行。

脚本内容：  

```
#!/bin/sh
# 使用rsync将public文件夹内的文件同步到VPS上网站的根目录，并在Travis构建过程中显示文件详情。
# ${port}替换为ssh端口，${username}替换为指定用户名，
# ${host_ip}替换为VPS的ip，/path/to/site替换为网站根目录的绝对路径。
rsync -av --delete -e 'ssh -p ${port}' public/ ${username}@${host_ip}:/path/to/site
```

将脚本保存为`after_script.sh`。

由于在Travis CI构建过程中，我们是不能操作的，所以需要提前将VPS的信息（公共密钥）加入到`known_hosts`中。这里我没有使用在配置文件`.travis.yml`的`addons`里添加信息的方法，而是将服务器的public key添加到`known_hosts`。  

先在本地机器与VPS完成一次ssh登录，然后在本地运行：  

```
ssh-keygen -F [192.168.1.1]:22 # 换成自己的VPS的ip地址和ssh端口，带上方括号  
```

新建文件`pubkey.txt`，将刚才的输出内容完整复制到文本文件中，另外在第一行行首回车，空出第一行（避免将文件内容进行添加时直接连接到`known_hosts`原有内容的结尾）。  

经过以上步骤，得到了三个文件(私钥、脚本、pubkey.txt)，将他们移动的统一目录下，打包：    

```
tar cvf secrets.tar id_rsa after_script.sh pubkey.txt
```

将`secrets.tar`移动到博客根目录，即github仓库。

## 加密和配置

官方建议对多个文件进行打包以后直接加密（逐个加密可能产生bug），所以这里直接对`secrets.tar`进行加密。需要注意的是，`travis login --org`中的选项可为`--org`或`--com`，这里取决于仓库位于travis-ci.org或是travis-ci.com，不能混淆。  

```
travis login --org
travis encrypt-file secrets.tar
```

加密完成后，删除未加密的`secrets.tar`以避免提交，另外travis会在加密完成的输出信息里提供解密信息，可能需要手动加入到`.travis.yml`中，解密、解压和其他配置内容如下：  

```
...
...
before_install:
  - openssl aes-256-cbc -K $encrypted_5880cf525281_key -iv $encrypted_5880cf525281_iv -in secrets.tar.enc -out secrets.tar -d 
  # 解密，这里的encrypted_5880cf525281_key，encrypted_5880cf525281_iv需根据自己情况填写
  - tar xvf secrets.tar # 解压
  - chmod +x after_script.sh # 可执行权限
  - mv id_rsa ~/.ssh/id_rsa # 移动到目标文件夹
  - chmod 600 ~/.ssh/id_rsa # 赋予权限
  - cat pubkey.txt >> ~/.ssh/known_hosts #将密钥信息添加到known_hosts
...
...

after_script:
  - ./after_script.sh # 运行脚本，rsync同步
```

以上是rsync所需的相关配置，此外还要根据具体情况完成`.travis.yml`的其他内容，详见[仓库](https://github.com/lchord/blogsrc/)。  

## 参考
1. https://docs.travis-ci.com/user/tutorial/
2. https://docs.travis-ci.com/user/ssh-known-hosts/
