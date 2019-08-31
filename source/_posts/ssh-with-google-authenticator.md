---
title:  使用Google Authenticator为SSH登录添加两步验证
date: 2019.8.31
category: 笔记
tag: [ssh,2fa]
---

最近在多地使用ssh登录服务器，使用密码登录时为了提高安全性可以使用Google Authenticator添加两步验证。 
## 安装和设置

服务器系统是ubuntu，安装很方便：  
```
sudo apt update
sudo apt install libpam-google-authenticator
```
这一过程一般会一同安装libqrencode。安装完成后切换到希望设置两步验证的用户，运行：  
```
google-authenticator
```
之后会有几次选择，根据需求选择yes or no。  
```
Do you want authentication tokens to be time-based (y/n) y

Do you want me to update your "~/.google_authenticator" file (y/n) y

...
```
这一步结束后会给出一条url以及对应的一张二维码，可以通过Google Authenticator App扫描设定验证码。  

## 设置ssh

接着还要对ssh进行设置：  
```
sudo vim /etc/pam.d/sshd
```
在最后添加：  
```
auth required pam_google_authenticator.so nullok
```
选项nullok表示允许未设置google-authenticator的用户正常登录，建议带上，防止无法登录。等所需用户都设置成功以后可以删除。  
```
sudo vim /etc/ssh/sshd_config
```
找到`ChallengeResponseAuthentication`一行，修改如下：  
```
ChallengeResponseAuthentication yes
```
最后重启ssh服务：  
```
sudo systemctl restart sshd.service
```
## 使用
再次ssh登录时，正确输入密码后会提示输入Verification code，打开手机上的Google Authenticator App，输入6位验证码登录。

## 参考
1. https://github.com/google/google-authenticator-libpam
2. https://www.digitalocean.com/community/tutorials/how-to-set-up-multi-factor-authentication-for-ssh-on-ubuntu-16-04