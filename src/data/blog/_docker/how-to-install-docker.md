---
author: lavie
pubDatetime: 2024-12-13T06:56:43Z
modDatetime: 2025-12-25T03:23:36Z
title: 服务器安装docker
featured: false
draft: false
private: false
tags:
  - linux 
  - docker
description: 如何在Linux服务器上安装Docker和Docker Compose环境
---

 Docker 是一个开源的应用容器引擎，基于Go语言并遵从 Apache2.0 协议开源。Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。容器是完全使用沙箱机制，相互之间不会有任何接口（类似 iPhone 的 app）,更重要的是容器性能开销极低。这篇文章主要介绍如何在服务器上安装Docker和Docker Compose环境。

## centos安装教程

### 1.安装docker

安装依赖包

```shell
yum install -y yum-utils device-mapper-persistent-data lvm2
```

设置源

```shell
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo # 官方
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo # 阿里
```

安装docker

```shell
yum install docker-ce docker-ce-cli containerd.io
```

启动docker

```shell
systemctl enable docker # 设置开机自启
systemctl start docker
```

### 2.安装docker-compose

拉取文件，先去github查看最新的版本，替换版本号

```shell
curl -L "https://github.com/docker/compose/releases/download/v2.4.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

设置权限

```shell
chmod +x /usr/local/bin/docker-compose
```

迁移目录

- 停止docker  
  `systemctl stop docker`
- 迁移目录  
  `cp -pdr /var/lib/docker/* /data/docker/`
- 删除原目录  
  `rm -rf /var/lib/docker`
- 建立软链接  
  `ln -s /data/docker /var/lib/docker`
- 添加权限  
  `chmod 777 -R /data/docker/`
- 重启docker  
  `systemctl start docker`

## Debian安装教程

### 1.安装docker

更新包列表

```shell
sudo apt-get update
```

安装依赖

```shell
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
```

添加 Docker 的官方 GPG 密钥

```shell
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

设置 Docker 的稳定版仓库：

```shell
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

再次更新包列表：

```shell
sudo apt-get update
```

安装 Docker 引擎：

```shell
sudo apt-get install -y docker-ce docker-ce-cli containerd.io
```

启动 Docker 并设置开机自启动：

```shell
sudo systemctl enable docker
sudo systemctl start docker
```

验证 Docker 安装：

```shell
docker --version
```

### 2.安装docker-compose

参照Centos下安装docker-compose的过程