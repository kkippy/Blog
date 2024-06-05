---
prev:
  text: 'Linux-shell脚本'
  link: '/DevOps/linux/Linux-shell脚本'

next:
  text: 'Linux-vim编辑器'
  link: '/DevOps/linux/Linux-vim编辑器'
---

> 在 shell 脚本中，也存在着多种运算符，例如算数运算符、关系运算符、布尔运算符等。
> 原生 bash 不支持简单的数学运算，但是可以通过其他指令来实现，例如 awk 和 expr，expr 命令最常用。expr 命令是一个手工命令行计数器，用于在 Linux 中求表达式变量的值，一般用于整数值，也可用于字符串。

expr 命令格式如下：expr [表达式]

```txt
表达式说明：
用空格隔开每个项；
对包含空格和其他特殊字符的字符串要用引号括起来
```

例如获取字符串长度：`expr length 'hello,world'` 输出 11

## 基本语法

1. `$((运算式))`或`$[运算式]`或者使用`expr m + n`
2. 注意`expr`运算符间要有空格，如果希望将`expr`的结果赋给某个变量，使用``（反引号）
3. `expr \*` (乘法)，`expr /`(除法)，`expr %`(取余)
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/HaYTBD1s.png" />
</p>
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/O8ctb4FV.png"  />
</p>

### 应用案例

计算 （2+7）x 8 的值,注意在使用`expr`时要分两步进行运算

<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/3G1rm0FX.png"  />
</p>
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/C6dYAvV7.png"/>
</p>

## 位置参数变量
当我们执行一个shell脚本时，如果希望获取到命令行的参数信息，就可以使用到位置参数变量<br>
其参数解释如下：
- \$n (n为数字，\$0代表命令本身，\$1-\$9代表第一到第九个参数，十以上的参数，十以上的参数需要用大括号包含，如${10})
- \$\* (代表命令行中所有的参数，$*把所有的参数看成一个整体)
- \$@ (代表命令行中所有的参数，不过$@把每个参数区分对待)
- \$# (代表命令行中所有参数的个数) 

比如执行`sh position.sh 10 20`,这个就是一个执行shell的命令行，可以在position脚本中获取到参数信息
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/ZQPXh972.png" />
</p>
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/3LXMRret.png"  />
</p>

## 关系运算符
关系运算符只支持数字，不支持字符串，除非字符串的值是数字。
有以下几种常用的关系运算符
```bash
-lt 小于
-le 小于等于 
-eq 等于
-gt 大于
-ge 大于等于
-ne 不等于
```
例如下列的例子，其中的流程判断会在之后的文章中介绍
```bash
#!/bin/bash
a=10
b=20
if [ $a -eq $b ]
then
   echo "$a -eq $b : a 等于 b"
else
   echo "$a -eq $b: a 不等于 b"
fi

#输出 10 -eq 20: a 不等于 b
```

## 布尔运算符
```bash
! : 非运算，表达式为true返回false，否则返回true。
-o : 或运算，有一个表达式为true则返回true (一真则真)。
-a ：与运算，两个表达式都为true才返回true (一假则假)。
```
```bash
#!/bin/bash
a=10
b=20
if [ $a != $b ]
then
   echo "$a != $b : a 不等于 b"
else
   echo "$a == $b: a 等于 b"
fi
#输出 10 != 20 : a 不等于 b
```

## 字符串运算符
```bash
= ：检测两个字符串是否相等，相等返回 true
!= ：检测两个字符串是否不相等，不相等返回 true
-z ：检测字符串长度是否为0，为0返回 true。
-n ：检测字符串长度是否不为 0，不为 0 返回 true。
```
```bash
#!/bin/bash
a="abc"
b="def"
if [ $a = $b ]
then
   echo "$a = $b : a字符串与b字符串相等"
else
   echo "$a = $b: a字符串与b字符串不相等"
fi
#输出 abc = def: a字符串与b字符串不相等
```

## 文件测试运算符
该运算符用于检测文件的各种属性,这里列举几个常用的运算符
```bash
-r file	检测文件是否可读，如果是，则返回 true。
-w file	检测文件是否可写，如果是，则返回 true。
-x file	检测文件是否可执行，如果是，则返回 true。

-d file	检测文件是否是目录，如果是，则返回 true。
-e file	检测文件（包括目录）是否存在，如果是，则返回 true。
-f file	检测文件是否是普通文件（既不是目录，也不是设备文件），如果是，则返回 true。
```
已知/usr/local/test.sh文件具有rwx权限，使用下列的文件测试运算符：
```bash
#!/bin/bash
file="/usr/local/test.sh"
if [ -r $file ]
then
   echo "该文件可读"
else
   echo "该文件不可读"
fi

if [ -f $file ]
then
   echo "该文件是普通文件"
else
   echo "该文件是特殊文件"
fi
#输出 
#该文件可读
#该文件是普通文件
```
