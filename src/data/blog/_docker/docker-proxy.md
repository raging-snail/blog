---
author: lavie
pubDatetime: 2025-01-10T09:23:04Z
modDatetime: 2025-12-25T03:23:35Z
title: 搭建docker镜像加速
featured: true
draft: false
private: false
tags:
  - docker
description: 如何使用国外服务器搭建自己的docker镜像加速
---

 由于国内政策无法访问docker，网上的docker镜像又经常失效，所以使用[Docker-Proxy](https://github.com/dqzboy/Docker-Proxy)项目自行搭建docker镜像加速。

## 1.安装dockerhub加速和ui
> 注意： 你需要对哪个镜像仓库进行加速，就下载哪个配置。docker-compose.yaml文件默认是部署所有的国外镜像仓库的加速服务，同样也是你部署哪个就配置哪个，其余的删除掉即可！

[Docker-Proxy项目地址](https://github.com/dqzboy/Docker-Proxy)

+ 下载[config](https://github.com/dqzboy/Docker-Proxy/tree/main/config)目录下对应的yml文件到你本地机器上
+ 下载[docker-compose.yaml](https://github.com/dqzboy/Docker-Proxy/blob/main/docker-compose.yaml)文件到你本地机器上，和上面的文件在同级目录下
+ 启动服务，只需要dockerhub就可以了，ui界面非必要
  ```docker
    docker compose up -d dockerhub
    docker compose up -d registry-ui
  ```
+ 到这一步已经可以通过ip:port方式访问了

## 2.申请ssl证书
使用acme.sh和cloudflare dns申请域名证书

### 2.1 修改默认ca
由于最新acme.sh脚本默认ca变成了zerossl，现执行下面命令修改脚本默认ca为letsencrypt
```sh
acme.sh --set-default-ca --server letsencrypt
```

### 2.2 创建Cloudflare Api令牌
登录cloudflare官网后，点击头像进入个人信息页面，创建令牌，选择`编辑区域DNS`模板，添加`区域-DNS-编辑`和`区域-区域-读取`权限，区域资源里面选择`包括-账户的所有区域-你的账户`。
**注意此令牌token只会出现一次，切记保存，切记保存，切记保存！！！**

### 2.3 申请ssl证书
```sh
# 执行此命令设置变量的值，acme.sh脚本执行过程会读取
export CF_Token="xxxxxxx"
export CF_Account_ID="aaaaaaa"
# 此项非必须，上面两项需要提供
export CF_Zone_ID="bbbbbbbb"   

# 申请证书
acme.sh --issue -d dockerhub.xxxx.com --dns dns_cf -k ec-256
```
### 2.4 安装证书到指定位置
假定linux主机里已有/root/ssl目录，现在要把证书和key安装到此目录下，那么执行下面的命令即可：
```sh
acme.sh --installcert -d dockerhub.xxxx.com --fullchain-file /root/ssl/dockerhub.xxxx.com.crt --key-file /root/ssl/dockerhub.xxxx.com.key --ecc
```

## 3.配置Nginx反向代理
+ 下载仓库下的nginx配置文件[registry-proxy.conf](https://raw.githubusercontent.com/dqzboy/Docker-Proxy/main/nginx/registry-proxy.conf)到你的nginx服务的conf.d目录下
+ 这里只需要dockerhub和ui相关内容，多余部分删除
+ 修改配置里的域名和证书部分

## 4.使用方法
### 方式1：直接使用
原拉取镜像方式
```sh
docker pull library/alpine:latest
```
加速拉取镜像命令
```
# 将前缀改为你申请的dockerhub的域名
docker pull dockerhub.xxxx.com/library/alpine:latest
```
### 方式2：设置镜像源
设置镜像源
```sh
sudo tee /etc/docker/daemon.json <<EOF
{
    "registry-mirrors": ["https://dockerhub.xxxx.com"]
}
EOF
```
重新加载配置
```sh
sudo systemctl daemon-reload
```
重启docker
```sh
sudo systemctl restart docker
```
