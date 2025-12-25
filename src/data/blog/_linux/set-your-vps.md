---
author: lavie
pubDatetime: 2025-11-14T02:51:36Z
modDatetime: 2025-12-25T03:23:38Z
title: 服务器设置
featured: false
draft: false
private: false
tags:
  - linux
description: 一篇关于设置一台新服务器的文章。本教程涵盖了必要的初始配置，包括更新软件包、设置防火墙、通过自定义端口和密钥认证来加固 SSH、启用 BBR 以提高网络性能，以及安装 Docker。
---

这篇文章将引导您逐步完成必要的服务器配置，创建一个安全高效的服务器环境，涵盖内容：更新软件包、设置防火墙规则、使用 SSH 密钥认证等安全措施，以及启用 BBR 等性能优化的所有内容。

##  一、基础设置

### 1.更新软件包
```bash
sudo apt update
```
### 2.安装常用软件包
```bash
sudo apt install curl wget vim
```
### 3.开启防火墙ufw
+ 安装ufw
```bash
sudo apt install ufw
```
在启用 UFW 之前，一定要先开放ssh端口，否则可能无法ssh连接服务器
+ 开放常用端口
```bash
# 开放ssh端口
sudo ufw allow 22/tcp
# 开放常用端口
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp
```
+ 启用 UFW
```bash
sudo ufw enable
```
+ 检查状态
```bash
sudo ufw status verbose
```

##  二、修改ssh端口
### 1.开放新的ssh端口
```bash
# 假设新端口是 2222
sudo ufw allow 2222/tcp
```
### 2.修改配置文件
```bash
sudo nano /etc/ssh/sshd_config
```
在文件中找到这一行:
```
#Port 22
```
将其修改为新端口：去掉 # 注释符，并更改端口号
```
Port 2222
```
### 3.重启 SSH 服务
```bash
sudo systemctl restart ssh
```

### 4.检查新端口是否设置成功（重要）
**保持当前的 SSH 窗口不要关闭！**
打开一个新的本地终端窗口，尝试使用新端口登录服务器：
+ 如果登录成功： 可以选择执行第 5 步。
+ 如果登录失败： **不要关闭旧 SSH 窗口！** 检查配置文件和防火墙规则是否有误，然后重新尝试。

### 5.关闭22端口（可选）
确认新端口可以进行ssh连接后，可以关闭22端口，提高安全性。
```bash
# 删除名为 "ssh" 的规则
sudo ufw delete allow ssh
# 或者按端口号删除
sudo ufw delete allow 22/tcp
```

##  三、密钥登录
### 1.创建密钥

在本地电脑上运行 ssh-keygen 命令生成密钥对：

```bash
ssh-keygen -t ed25519 -f /path/to/your/keyfile_name
```
会在指定目录生成两个文件，例如：
+ id_ed25519 (私钥 - 绝不能泄露给任何人)
+ id_ed25519.pub (公钥 - 这个是我们要上传到服务器的)

### 2.复制公钥到服务器

使用 ssh-copy-id 命令
```bash
# 替换 [公钥路径] [端口号]、[用户名] 和 [服务器IP]
ssh-copy-id -i [公钥路径] -p [端口号] [用户名]@[服务器IP]
```
系统会提示输入服务器的当前密码。
输入密码后，会自动将公钥内容追加到服务器上 **~/.ssh/authorized_keys** 文件的末尾，并设置正确的文件权限。


### 3.测试密钥登录
**不要关闭当前的 SSH 窗口！**

打开一个新的本地终端窗口。

```bash
ssh -p [端口号] [用户名]@[服务器IP]
```
验证：如果系统仍然提示输入 "password" ，说明操作失败了，检查上述步骤是否正确执行。

### 4.禁用密码登录
**只有在确认密钥登录成功后，才能执行此步骤！**

编辑 sshd_config 文件：
```bash
sudo nano /etc/ssh/sshd_config
```
找到并修改以下几行 (确保去掉了行首的 # 注释)：
```
# 确保公钥认证是开启的 (通常默认开启)
PubkeyAuthentication yes

# 禁用密码登录
PasswordAuthentication no

# 禁用 "challenge-response" 认证，它也可能允许密码
ChallengeResponseAuthentication no

# (可选) 如果您只允许密钥登录，可以禁用 PAM
UsePAM no
```

重启 SSH 服务：

```bash
sudo systemctl restart ssh
```
### 5.最终验证
打开新的终端窗口，尝试再次登录：

```bash
ssh -p [端口号] [用户名]@[服务器IP]
```
应该只能密钥登录。

尝试强制使用密码登录，看看是否会被拒绝：

```bash

ssh -o PubkeyAuthentication=no -p [端口号] [用户名]@[服务器IP]
```
此时，它应该会提示输入密码，但无论您输入什么（即使是正确的密码），它最终都会显示 "Permission denied (publickey,password)" 或类似信息，确认密码登录已被彻底禁用。

##  四、拥塞控制算法

+ 确认内核版本支持 BBR（需要 4.9+）：
```bash
uname -r
```
+ 开启BBR
```bash
sudo sh -c 'cat > /etc/sysctl.d/yuju-bbr.conf << EOF
net.core.default_qdisc=fq
net.ipv4.tcp_congestion_control=bbr
EOF' && sudo sysctl -p /etc/sysctl.d/yuju-bbr.conf
```
+ 查看配置是否生效
```bash
# 查看当前使用的拥塞控制算法
sysctl net.ipv4.tcp_congestion_control
# 查看系统支持的所有拥塞控制算法
sysctl net.ipv4.tcp_available_congestion_control
# 查看默认的队列调度器
sysctl net.core.default_qdisc
# 检查BBR模块是否加载
lsmod | grep bbr
```
##  五、安装docker和docker compose
Docker 从 18.06.0-ce 版本开始自带 Docker Compose，因此，只需要安装docker。
+ 安装命令
```bash
wget -qO- get.docker.com | bash
```
+ 开机自启
```bash
sudo systemctl enable docker
```
+ 检查是否安装成功
```bash
docker -v
docker compose version
```
+ 卸载命令
```bash
sudo apt-get purge docker-ce docker-ce-cli containerd.io
sudo apt-get remove docker docker-engine
sudo rm -rf /var/lib/docker
sudo rm -rf /var/lib/containerd
```