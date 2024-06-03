---
title: 硬盘
---

> 对于 Linux 来说，不论有几个分区，最终是建立在根分区的基础之上的。每个分区都是用来组成整个文件系统的一部分。采用“载入”的方式，将目录与分区连接起来形成一一对应的关系。

<p align="center">
<img src="https://pic.imgdb.cn/item/6628757a0ea9cb140353b2f7.png" alt="">
</p>

## 硬盘

分为 IDE 和 SCSI 硬盘，基本上是 SCSI。对于 IDE 硬盘，其标识符是 hdx~.对于 SCSI 标识符为 sdx~.x 为盘号（a:基本盘，b:基本从属盘，c:辅助主盘，d:辅助从属盘。也可以直接叫第一块到第四块硬盘）。“~”代表分区，前四个分区用数字 1 到 4 表示，它们是主分区或扩展分区，从 5 开始就是逻辑分区。

```css
sda3 : 代表第一个SCSI硬盘的第三个主分区或扩展分区
```

### 查看所有设备挂载情况

使用`lsblk`或者`lsblk -f`命令查看

<p align="center">
<img src="https://pic.imgdb.cn/item/662876620ea9cb1403571a08.png" alt="">
</p>

### 查看磁盘情况

1. df -h [选项]：查询系统整体磁盘的使用情况

```text
选项说明
-s 指定目录占用大小汇总
-h 带计量单位
-a 含文件
--max-depth=n 子目录深度为n
-c 列以明细的同时增加汇总值
```

2. df -h /目录名：查询指定目录的磁盘情况，默认为当前目录。例如查询/opt 目录的磁盘占用情况，深度为 1：
<p align="center">
<img src="https://pic.imgdb.cn/item/662876ef0ea9cb140357e61f.png" alt="">
</p>

3. tree 目录名：以树状显示目录结构（默认没有安装 tree 命令，使用`yum install tree`命令安装）
<p align="center">
<img src="https://pic.imgdb.cn/item/662877480ea9cb1403586f8e.png" alt="">
</p>

## 磁盘分区并永久挂载

在实际开发中，必定会遇到磁盘空间不足的情况，在对磁盘进行扩容之后，就有必要对磁盘空间进行分区了，以便文件的更好管理。例如将/dev/sdb 分区为两个分区，总计 40GB，第一个分区 20.5GB，第二个分区 19.5G。

1. 使用`fdisk`命令进行分区：fdisk /dev/sdb
<p align="center">
<img src="https://pic.imgdb.cn/item/662878600ea9cb14035a30c7.png" alt="">
</p>

2. 根据提示填写相应信息。开始分区后输入 n，新增分区，然后选择 p，分区类型为主分区。分区号代表之后会有几个分区（默认 1）两次回车默认剩余全部空间。最后输入 w 写入分区并退出，若不保存退出输入 q。
<p align="center">
<img src="https://pic.imgdb.cn/item/662878a20ea9cb14035aa71a.png" alt="">
</p>

3. 格式化磁盘，使用`mkfs`命令进行：mkfs -t ext4 /dev/sdb1(ext4 是分区类型，sdb1 是分好区后的分区名)。
<p align="center">
<img src="https://pic.imgdb.cn/item/66287a580ea9cb14035d47c4.png" alt="">
</p>

4. 使用`mount`命令将分区与目录联系起来，命令格式为：mount [设备名称] [挂载目录]。例如 mount /dev/sdb1 /newdisk
<p align="center">
<img src="https://pic.imgdb.cn/item/66287b330ea9cb14035e9050.png" alt="">
</p>
若想取消分区与目录之间的关系，即卸载分区，那么可以使用`umount`命令取消，例如umount /dev/sdb1 /newdisk

5. 通过修改/etc/fstab 文件永久挂载分区，因为用上述命令行的方式(mount /dev/sdb1 /newdisk)挂载后，当系统重启后原先的挂载关系会失效。所以需要修改/etc/fstab 文件以实现分区的永久挂载，修改后执行`mount -a`命令即刻生效，或者重启系统也可以。
<p align="center">
<img src="https://pic.imgdb.cn/item/66287e750ea9cb14036341b5.png" alt="">
</p>

## 相关实用指令

```shell
ls -l /opt | grep "^-"|wc -l ## 统计/opt文件夹下文件的个数
ls -l /opt | grep "^d" | wc -l ## 统计/opt文件夹下目录的个数
ls -lR /opt | grep "^-" |wc -l ## 统计/opt文件夹下文件的个数，包括子文件夹里的
ls -lR /opt | grep "^d" |wc -l ## 统计/opt文件夹下目录的个数，包括子文件夹里的
```

> 在日常维护中离不开和磁盘打交道，例如空间不足需要删除缓存文件或者对磁盘进行扩容等都是非常实际且高频的需求。所以在磁盘处理方面的技能水平还是要非常熟练的，毕竟磁盘管理得好坏直接关系到整个系统的性能问题，以上就是对磁盘管理及分区命令的简要总结，更多细则请结合官方文档使用~
