---
title: SSH工具连接Google Cloud Platform
date: 2018.10.31
tag: [ssh]
category: 笔记
---

在Google Cloud Platform创建实例后，通过SSH工具连接可以方便在本地操作使用。我用的是Windows下的mobaXterm，其他类似的SSH工具设置都差不多。

## 本地

首先在Windows PowerShell里生成使用公钥和私钥

```
cd .ssh # 进入当前用户的.ssh文件夹
ssh-keygen -f gcp-key # 生成密钥文件
Enter passphrase (empty for no passphrase): # 增加密码提高安全性
Enter same passphrase again:
Your identification has been saved in gcp-key. # 私钥存入了gcp-key文件
Your public key has been saved in gcp-key.pub. # 公钥存入了gcp-key.pub文件
...
```

这样在当前用户文件夹下的`.ssh`文件夹中就创建了一对公钥和私钥文件。用编辑器打开`gcp-key.pub`公钥文件，复制其中的内容备用。

## Google Cloud Platform

进入实例，打开提供的命令行工具。进入用户文件夹下的`.ssh`文件夹。

```
cd ~/.ssh
```

其中有一个名为`authorized_keys`的文件。内容大致如下：

```
# Added by Google
ssh-rsa AAAAB3Nza..........
```

里面存放的是Google生成的公钥，我们要做的是把我们自己的公钥复制粘贴进去(注意不要更改以前的内容，如果担心操作失误可以提前备份)。

```
vi authorized_keys

# Added by Google
ssh-rsa AAAAB3Nza.......... # 以前的密钥内容保持不变

# gcp-key
ssh-rsa .......... # 在以前内容后面粘贴自己公钥文件的内容

:wq
```

另外，操作时可能需要注意权限问题。

## 本地使用SSH工具连接

我使用的是mobaXterm。点击工具栏中的Session -> SSH。在Basic SSH settings中Remote host填写实例的外部ip，这里可以不指定Specify username，端口填写自己的SSH端口，默认22。之后点击下面的Advanced SSH settings，勾选Use private key，输入或者浏览选择之前生成的私钥文件，最后OK确认。左侧单击Sessions，连接时，选择我们刚才设置的ip地址，双击进入。Shell显示如下：

```
Passphrase for OpenSSH private key: # 输入设置的passphrase
login as: # 输入用户名，注意不是实例名
Authenticating with public key "Imported-Openssh-Key: C:\Users\${username}\.ssh\gcp-key"
```

完成验证后就可以使用Shell远程操作了。

