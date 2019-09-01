---
title:  Certbot使用记录
date: 2019.9.1
category: 笔记
---

之前一直用的一键脚本签发的证书，有时候不太方便，决定用Certbot签发Let's Encrypt通配符证书。  
[Certbot网站](https://certbot.eff.org/)提供了Web Server和System的选择，进而给出相应的步骤。我的是Nginx和Ubuntu 18.04，首先是安装
```
sudo apt-get update
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot python-certbot-nginx
```
由于我要申请通配符证书，所以还需要安装DNS插件（为了偷懒）。Certbot提供了对应的[插件列表和说明](https://certbot.eff.org/docs/using.html#dns-plugins)（当然也可以手动设置）。我的NS是Cloudflare：
```
sudo apt-get install python3-certbot-dns-cloudflare
```
这里为了进行验证，Certbot还需要一份配置文件`cloudflare.ini`供插件使用，内容包含Cloudflare账号的邮箱和全局API:
```
# cloudflare.ini
# Cloudflare API credentials used by Certbot
dns_cloudflare_email = cloudflare@example.com
dns_cloudflare_api_key = 0123456789abcdef0123456789abcdef01234567
```
由于包含了全局API，所以有较高的安全级别，Certbot建议设置`cloudflare.ini`权限为`600`，并保存在安全的目录下。  
设置完成后，就可以开始获得证书。这里建议是只获得证书，之后手动安装。如果用Certbot安装容易破坏Nginx配置。
```
certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /path/to/cloudflare.ini \ 
  -d *.example.com \
  -d example.com
```
这里`/path/to/cloudflare.ini`为绝对路径。另外，签发证书的时候带上一级域名，因为通配符证书是给二级域名使用的。运行完毕后，证书的信息和文件路径会给出，只需要对应地填入网站的Nginx文件就可以了。`fullchain.pem`对应`ssl_certificate`，`privkey.pem`对应`ssl_certificate_key`。



## 参考
1. https://certbot.eff.org/lets-encrypt/ubuntubionic-nginx
2. https://certbot-dns-cloudflare.readthedocs.io/en/stable/
3. https://certbot.eff.org/docs/
