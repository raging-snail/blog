---
author: lavie
pubDatetime: 2025-10-14T02:54:59Z
modDatetime: 
title: CentOS 磁盘数据迁移
featured: false
draft: false
private: false
tags:
  - linux
description: 本文档记录从旧磁盘迁移到新磁盘的完整过程，包括挂载、数据迁移、替换挂载点、自动挂载配置等步骤。
---

 本文档记录从旧磁盘迁移到新磁盘的完整过程，包括挂载、数据迁移、替换挂载点、自动挂载配置等步骤。

## Table of contents

## 一、挂载新磁盘

### 1. 查看磁盘信息

```bash
lsblk -f
```

示例输出：

```
NAME   FSTYPE  LABEL    UUID                                 MOUNTPOINT
sr0    iso9660 config-2 2022-03-17-13-56-18-00               
vda                                                          
└─vda1 ext4             21dbe030-aa71-4b3a-8610-3b942dd447fa /
vdb    ext4             d146ec53-8f3c-489b-9bd4-8760d74f5b63 
vdc    ext4             42a5b87c-690a-4eea-8c6c-3c59952f8486 /ssd 
```

假设新磁盘为 `/dev/vdb`。

---

### 2. 格式化分区

（根据需要选择文件系统类型）

```bash
sudo mkfs.ext4 /dev/vdb
```

---

### 3. 创建挂载目录并挂载

```bash
mkdir -p /mnt/newdisk
mount /dev/vdb /mnt/newdisk
```

验证挂载成功：
```bash
df -h | grep newdisk
```

---

## 二、迁移旧磁盘数据到新磁盘

假设旧磁盘挂载在 `/mnt/olddisk`。

使用 `rsync`（支持断点续传、保留权限、显示进度）：

```bash
rsync -avh --progress /mnt/olddisk/ /mnt/newdisk/
```

> 注意最后的 `/` 表示复制目录内的内容而非整个文件夹。

验证数据一致性：

```bash
rsync -avnc /mnt/olddisk/ /mnt/newdisk/
```
如果无输出，说明两边完全一致。

---

## 三、卸载旧磁盘并替换挂载点

### 1. 卸载旧磁盘

```bash
umount /mnt/olddisk
```

如果提示 “device is busy”，可执行：

```bash
fuser -km /mnt/olddisk
umount /mnt/olddisk
```

---

### 2. 卸载新磁盘（准备重新挂载到旧路径）

```bash
umount /mnt/newdisk
```

---

### 3. 挂载新磁盘到原旧磁盘路径

```bash
mount /dev/vdb /mnt/olddisk
```

验证：

```bash
df -h | grep olddisk
```

此时旧路径 `/mnt/olddisk` 已使用新磁盘的数据。

---

## 四、设置开机自动挂载

1. 编辑 `/etc/fstab`：

```bash
vim /etc/fstab
```

添加一行：

```bash
/dev/vdb /mnt/olddisk  ext4  defaults  0 2

# 或者使用磁盘UUID（lsblk -f命令查看）
UUID=9f8a0b2c-2d5a-4e80-9a1f-4c1d6c3b4a7e  /mnt/olddisk  ext4  defaults  0 2
```
> 

2. 测试配置是否正确：

```bash
mount -a
```

若无错误输出，则配置成功。

---

## 五、验证

1. 重启服务器：
```bash
reboot
```

2. 登录后检查挂载是否自动生效：
```bash
df -h | grep olddisk
```

确认 `/mnt/olddisk` 已挂载新磁盘。

---

## 六、可选：清理旧磁盘

确认数据迁移无误后，可以格式化旧磁盘以备他用：

```bash
mkfs.ext4 /dev/sda1
# 或 mkfs.xfs /dev/sda1
```

---

## 总结

| 步骤 | 操作 |
|------|------|
| 1 | 格式化新磁盘：`mkfs.ext4 /dev/vdb` |
| 2 | 挂载新磁盘：`mount /dev/vdb /mnt/newdisk` |
| 3 | 迁移数据：`rsync -avh --progress /mnt/olddisk/ /mnt/newdisk/` |
| 4 | 卸载旧磁盘：`umount /mnt/olddisk` |
| 5 | 卸载新磁盘：`umount /mnt/newddisk` |
| 6 | 重新挂载新磁盘到旧路径：`mount /dev/vdb /mnt/olddisk` |
| 7 | 设置自动挂载：编辑 `/etc/fstab` 并添加配置 |

---