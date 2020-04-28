---
title: Ubuntu 20.04 LTS升级记录
date: 2020-04-28 15:17:01
categories: 笔记
tags: ubuntu
---

Ubuntu 20.04 LTS前几天正式发布了，在VPS上试着升级了一下。记录一下过程和问题。  

## 过程

可以参考官方的升级步骤，升级前一定要备份，特别是配置文件。  

> - Install update-manager-core if it is not already installed.
> - Make sure the `Prompt` line in `/etc/update-manager/release-upgrades` is set to `normal` if you want non-LTS upgrades, or `lts` if you only  want LTS upgrades.
> - Launch the upgrade tool with the command `sudo do-release-upgrade -d`
> - Follow the on-screen instructions.  

注意`Prompt=lts`才会更新到LTS版本，另外`do-release-upgrade -d`要带上`-d`，不然检查不到20.04更新。  

更新前建议先尽可能停止VPS中运行的服务。官方提到会使用screen来避免断连问题，但是建议手动创建一个screen。  

```bash
screen -S upgrade # 创建一个名为upgrade的窗口

do-release-upgrade -d
...

screen -r upgrade # 如果更新过程中ssh断连，重连后可手动恢复升级窗口
```

安装过程中会暂时禁用第三方软件源，升级结束后可以自己在`/etc/apt/sources.list.d`中恢复。  

## 问题

主要有两个问题。  

更新完后可以开启nginx服务，但是网站都打不开，开始以为是覆盖掉了配置文件，替换备份后出现了初始页。这时才发现Ubuntu给我整了一个新的nginx。原来的nginx我自己安装在其他位置。于是卸载掉新的nginx，在按原来的位置重新安装设置了一遍nginx。  

php-fpm服务不能正常开启，看了下是依赖问题，我不想管依赖，索性把php重新升级安装了...😑