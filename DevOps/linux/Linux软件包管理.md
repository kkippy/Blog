---
prev:
  text: 'Linux组与权限'
  link: '/DevOps/linux/Linux组与权限'

#next:
#  text: 'Linux-shell脚本'
#  link: '/DevOps/linux/Linux-shell脚本'
---

## rpm
rpm包管理器（RPM）（最初是Red Hat Package Manager，现在是递归首字母缩写）是一个免费的开源包管理系统。RPM是指.rpm文件格式和包管理器程序本身。RPM主要用于Linux发行版;其常用的命令如下：
1.  rpm -qa | grep xxx : 用来查询已安装的rpm列表并过滤显示指定名称的rpm
2.  rpm -q [软件包名] ： 查询指定包是否安装
3.  rpm -qi [软件包名] ： 查询软件包信息
4.  rpm -ql [软件包名] ： 查询软件包中的文件
5.  rpm -qf [文件全路径名] ： 查询文件所属的软件包
6.  rpm -e [RPM包的名称] ： 卸载rpm包
7.  rpm -ivh [RPM包全路径名称] : 安装rpm包（i代表安装；v代表提示；h代表进度条

### rpm包的基本格式
以下列包名为例：<br>
firefox-60.2.2-1.el7.centos.x86 64

- `firefox`为名称
- `60.2.2-1`为版本号
- `el7.centos.x86 64`为适用操作系统。若显示为`noarch`则表示通用。若为i686、i386则表示32位系统

## yum
yum基于 RPM 包管理，能够从指定的服务器自动下载 RPM 包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包，无须繁琐地一次次下载、安装。其语法格式如下：<br>
yum [options] [command] [packageName]
- options：可选，选项包括-h（帮助），-y（当安装过程提示选择全部为 "yes"）等等
- command：要进行的操作
- packageName：安装的包名<br>
这里介绍几个常用的yum命令。
```shell
yum list ： 列出所有可安裝的软件清单
yum install <package_name> ： 安装下载指定的包
yum check-update：列出所有可更新的软件清单
yum update ：更新所有软件
yum update <package_name> ：更新指定的包
```

### yum应用实例
- 使用yum的方式来安装和卸载pam-devel
<p align='cneter'>
<img src="https://img2.imgtp.com/2024/05/08/2N1StPZE.PNG" />
</p>
<p align='cneter'>
<img src="https://img2.imgtp.com/2024/05/08/FchM2iwu.PNG"  />
</p>