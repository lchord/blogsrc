---
title: 使用Travis CI自动部署Hexo博客到VPS
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

一般来说，这样私钥文件为`~/.ssh/id_rsa`，对应的公钥为`~/.ssh/id_rsa.pub`。这里需要把公钥文件里的内容完整的复制到VPS上用来连接登录rsync的用户主目录下的`authorized_keys`的文件上。举个栗子：因为rsync同步需要指定用户，若用户名为`john`，就要把内容粘贴到VPS系统中`/home/john/.ssh/authorized_keys`中，如果没有这个文件，可以自己创建。

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

由于私钥属于敏感文件，所以不应直接提交到Github仓库里；另外，通过ssh方式使用rsync同步文件需要指明ssh端口和用户名，这也属于敏感信息。对于用户可以通过限制用户登录权限的方式提高安全性，但是ssh端口暴露确实不好，一般来说VPS提供商也会建议修改默认ssh端口。

由于我没有找到较好的隐藏ssh端口信息的方法，我这里用了一种笨办法，即不把命令写在`.travis.yml`文件里，而是写一个脚本，然后把脚本文件加密，上传到Travis后解密运行。

脚本内容：

```
#!/bin/sh
# 使用rsync将public文件夹内的文件同步到VPS上网站的根目录，并在Travis构建过程中显示文件详情。
# ${port}替换为ssh端口，${username}替换为指定用户名，
# ${host_ip}替换为VPS的ip，/path/to/site替换为网站根目录的绝对路径。
rsync -av --delete -e 'ssh -p ${port}' public/ ${username}@${host_ip}:/path/to/site
```

将脚本保存为`after_script.sh`，并移动到本地操作的博客源码目录。

由于在Travis CI构建过程中，我们是不能操作的，所以需要提前将VPS的ip加入到`known_hosts`中，具体只需在`.travis.yml`中的script段前加入：

```
addons:
  ssh_known_hosts: ${host_ip} # ip地址
```

接下来进行加密，按照官方文档来，官方建议对多个文件进行打包以后直接加密（不要逐个加密，据说有bug），在此之前，记得将私钥文件`id_rsa`和刚才创建的脚本文件移动到博客根目录。

```
travis login --org
tar cvf secrets.tar id_rsa after_script.sh
travis encrypt-file secrets.tar
```

加密完成后，travis会在输出信息里提供解密信息，可能需要手动加入到`.travis.yml`中，解密、解压和其他配置内容如下：

```
before_install:
  - openssl aes-256-cbc -K $encrypted_5880cf525281_key -iv $encrypted_5880cf525281_iv -in secrets.tar.enc -out secrets.tar -d # 这里的encrypted_5880cf525281_key，encrypted_5880cf525281_iv需根据自己情况填写
  - tar xvf secrets.tar # 解压
  - chmod +x after_script.sh # 可执行权限
  - mv id_rsa ~/.ssh/id_rsa # 移动到目标文件夹
  - chmod 600 ~/.ssh/id_rsa # 赋予权限

...
...
...

after_script:
  - ./after_script.sh # 运行脚本，rsync同步
```

以上是rsync所需的相关配置，此外还要根据具体情况完成`.travis.yml`的其他内容。