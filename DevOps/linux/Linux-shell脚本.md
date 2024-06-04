---
prev:
  text: 'Linux软件包管理'
  link: '/DevOps/linux/Linux软件包管理'

next:
  text: 'Linux-vim编辑器'
  link: '/DevOps/linux/Linux-vim编辑器'
---

>Shell 脚本（shell script），是一种为 shell 编写的脚本程序。它有众多的分类，例如C Shell（/usr/bin/csh）、K Shell（/usr/bin/ksh）、Bourne Shell（/usr/bin/sh或/bin/sh）、Bourne Again Shell（/bin/bash）等。在国内，使用广泛的是Bourne Again Shell（即bash）

## shell脚本格式要求
- 脚本文件的后缀通常以`.sh`结尾，例如test.sh
- 脚本内容以#!/bin/bash 开头
- 脚本需要有可执行权限

### shell脚本的执行方式
1. 输入脚本的绝对路径或相对路径（需要赋予脚本执行权限（x），再执行脚本）
```bash
chmod u+x test.sh # 给创建test.sh的用户赋予该文件执行的权限
./test.sh #执行test.sh
```

2. sh + 脚本（不用赋予脚本x权限，直接执行）
```bash
sh test.sh
```

## 输出字符串案例 
1. 创建test.sh文件并使用`echo`命令将'hello，world'打印到终端
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/HT2uWT0e.png"/>
</p>
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/j1CQXRlb.png"  />
</p>

2. 添加执行权限后可以看到文件名已经变成绿色
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/pqivgaaF.png"\ />
</p>

3. 执行test.sh脚本。可以看到‘hello,world’字符串已经打印到终端了
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/59KJzwPJ.png"  />
</p>

## shell变量
在Linux中，有系统变量和用户自定义变量。系统变量例如 `$HOME`、`$USER`、`$SHELL`等，可以使用set命令查看所有的系统变量：
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/iHf2cOid.png" />
</p>

### shell变量的定义
- 定义变量 ： `变量=值` **注意不能有空格**
- 撤销变量 : `unset [值]`
- 声明静态变量 ： `readonly [变量]`（静态变量不能unset）
- 输出变量时要加`$`
- 将命令的返回值赋给变量:

    -  A=\`date`，将反引号中的内容执行后赋值给A
    <p align='center'>
       <img src="https://img2.imgtp.com/2024/05/12/qzc1VRHq.png" />
    </p>
     <p align='center'>
       <img src="https://img2.imgtp.com/2024/05/12/BWAk1RtY.png"/>
    </p>

    -  A=$(date)，这种方式等价于反引号
     <p align='center'>
       <img src="https://img2.imgtp.com/2024/05/12/u2rSalqm.png" />
    </p>
     <p align='center'>
       <img src="https://img2.imgtp.com/2024/05/12/C84T2DGE.png"  />
    </p>
### 变量定义的规则
1. 变量名称可以由字母、数字和下划线组成，但是不能以数字开头。
2. 等号两侧不能有空格
3. 变量名称一般习惯为大写

## 环境变量设置
环境变量是方便多个shell脚本用到同一个变量值所设定的，即在任何一个shell脚本中都可以使用这个变量，类似于其他语言中的全局变量概念，可以在/etc/profile文件中配置，设置步骤如下：
1. export 变量名=变量值（将变量输出为环境变量（即全局变量））
  <p align='center'>
      <img src="https://img2.imgtp.com/2024/05/12/OUEDKKy2.png" />
    </p>

2. source 配置文件 （让修改后的配置文件立即生效）
  <p align='center'>
     <img src="https://img2.imgtp.com/2024/05/12/YwyZoQny.png"  />
    </p>

3. echo $变量名 （查询环境变量的值）。可以从上述图中看到JAVA_HOME环境变量已经配置成功