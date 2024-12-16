---
prev:
  text: 'Linux定时任务调度'
  link: '/DevOps/linux/Linux定时任务调度'

next:
  text: 'Linux流程控制'
  link: '/DevOps/linux/Linux流程控制'
---


> 服务的本质就是进程，但是运行在后台的，通常监听某个端口，等待其他程序的请求，所以又称守护进程。可使用 service [服务名] [start | stop | resrart | reload | status]。当然在 centos7 之后使用`systemctl`命令代替`service`命令，本文着重介绍`systemctl`命令。

# 查看服务

可以使用`setup`命令查看到所有服务，其中前面有`*`号的任务则表示该任务会随着 Linux 的启动而启动，没有带`*`号则需要手动启动。下图是输入`setup`命令后的界面。

<p align = 'center'>
<img src="https://img2.imgtp.com/2024/05/05/dJNub4Vq.PNG"  />
</p>
<p align = 'center'>
<img src="https://img2.imgtp.com/2024/05/05/jU1Ux9lD.PNG" />
</p>

### 服务的运行级别

- 运行级别 0:系统停机状态，系统默认运行级别不能设为 0，否则不能正常启动
- 运行级别 1:单用户工作状态，root 权限，用于系统维护，禁止远程登陆
- 运行级别 2:多用户状态(没有 NFS)，不支持网络
- 运行级别 3:完全的多用户状态(有 NFS)，登陆后进入控制台命令行模式 （常用）
- 运行级别 4:系统未使用，保留
- 运行级别 5:X11 控制台，登陆后进入图形 GUI 模式 （常用）
- 运行级别 6:系统正常关闭并重启，默认运行级别不能设为 6，否则不能正常启动

### chkconfig 指令

通过该指令给服务器的各个运行级别设置自启动或关闭状态。相关的指令服务在/etc/init.d 中。这里只是简单介绍，后续的`systemctl`才是重点。

- chkconfig [--add][--del][--list][系统服务]
- chkconfig [--level <等级代号>][系统服务][on/off/reset]

```txt
--add 增加所指定的系统服务，让 chkconfig 指令得以管理它，并同时在系统启动的叙述文件内增加相关数据。
--del 删除所指定的系统服务，不再由 chkconfig 指令管理，并同时在系统启动的叙述文件内删除相关数据。
--level<等级代号> 指定读系统服务要在哪一个执行等级中开启或关闭。
```

这里举个例子：

```shell
chkconfig --list      //列出 chkconfig 所知道的所有的服务的情况

chkconfig telnet on   //开启 Telnet 服务
chkconfig telnet off  // 关闭 Telnet 服务
```

## systemctl

`systemctl`相关指令管理的服务在`/usr/lib/systemd/system`查看。常用的命令如下

1. systemctl [start l stop | restart | status] [服务名]
2. systemctl 设置服务的自启动状态

```shell
  1. systemctl list-unit-files [|grep 服务名] (查看服务开机启动状态,grep可以进行过滤）
  2. systemctl enable 服务名(设置服务开机启动)
  3. systemctl disable 服务名(关闭服务开机启动)
  4. systemctl is-enabled 服务名(查询某个服务是否是自启动的)
```

**上述的指令只是临时生效，当重启系统后还是会回归到之前的配置，想要永久生效要使用以下命令：**
`systemctl [enable | disable] [服务名]`

这里以防火墙服务为例

1. 查看防火墙服务状态
<p align = 'center'>
<img src="https://img2.imgtp.com/2024/05/05/ZCKAsTJX.png" />
</p>
2. 关闭防火墙服务
<p align = 'center'>
<img src="https://img2.imgtp.com/2024/05/05/WkMo48gr.png" />
</p>
3. 重启防火墙服务
<p align = 'center'>
<img src="https://img2.imgtp.com/2024/05/05/LziSrjmJ.png" />
</p>

## 动态监视进程

与 ps 指令很类似，但是 top 在执行一段时间可以更新正在运行的进程。命令：`top [选项]`

```shell
选项
-d [秒数] ： 指定top命令每隔几秒更新
-i ： 使top不显示任何闲置或者僵死状态
-p ： 通过指定监控进程ID来仅仅监控某个进程的状态
```

<p align = 'center'>
<img src="https://img2.imgtp.com/2024/05/05/KlJIaKx7.png" />
</p>
在top后展示的页面中可选择以下选项进行相关操作:

```shell
P 以CPU使用率排序，默认就是此项
M 以内存的使用率排序
N 以PID排序
q 退出top
u [用户名] ： 监视特定用户
k [PID号] ： 终止指定的进程
```

## 监控网络状态

该命令是一个监控 TCP/IP 网络的非常有用的工具，它可以显示路由表、实际的网络连接以及每一个网络接口设备的状态信息。Netstat 用于显示与 IP、TCP、UDP 和 ICMP 协议相关的统计数据，一般用于检验本机各端口的网络连接情况。

命令为`netstat [选项]`。这里介绍常见参数：

```shell
选项：
-a (all) 显示所有选项，默认不显示LISTEN相关。
-t (tcp) 仅显示tcp相关选项。
-u (udp) 仅显示udp相关选项。
-n 拒绝显示别名，能显示数字的全部转化成数字。
-l 仅列出有在 Listen (监听) 的服务状态。

-p 显示建立相关链接的程序名
-r 显示路由信息，路由表
-e 显示扩展信息，例如uid等
-s 按各个协议进行统计
-c 每隔一个固定时间，执行该netstat命令。
```

例如查找关于 sshd 的网络状态：

<p align = 'center'>
<img src="https://img2.imgtp.com/2024/05/05/ZR5SEkKu.png" />
</p>
