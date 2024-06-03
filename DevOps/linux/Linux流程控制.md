<br>

>针对不同情况，需要执行不同的代码。这在编程中是非常常见的。而在Linux的shell脚本中也存在这样的流程控制。包括if else、case、for、while等，本文对常见的流程控制加以介绍。
需要注意的是，不论是哪种流程控制语句，**在其条件判断的方括号内，首尾必须要有空格**，这是和其他语言不太一样的地方。详情见下列的具体介绍。

## if 、if else、if else-if else语句 
与其他语言不同的是，如果else分支中没有执行的代码，那就不要写else。在语句结尾时要反写if，即fi。这是与其他语言最不同的地方，可能要花点时间适应。其命令格式如下：
```bash
 #if 语句
if [ 条件 ] (条件前后必须要有空格！)
 then
     #代码
 fi
 
 #if else语句
if [ 条件 ]
    #代码
else
    #代码
fi
 
 #if else-if else语句
if [ 条件 ] 
 then
   #代码
elif[ 条件 ]
then 
   #代码
else
   #代码
fi
```

## case语句
该语句和其他语言中的`switch ... case`语句类似，是一种多分支选择结构。不同的是右括号表示语句开始，两个分号;;表示跳出整个语句，即break。结束时依旧是反写case，即以esac结尾。其语法格式如下：
```bash
case 值 in
 "值1")
    #若变量值等于值1，则运行程序1
;;
 "值2")
    #若变量值等于值2，则运行程序2
;;
...... #此处省略若干分支
  *)  #*)类似else语句
    #若变量值都不满足以上的情况，则运行此程序
;;
esac
```
```bash
#!/bin/bash
case 100 in
    100)  echo '变量值为100'
    ;;
    200)  echo '变量值为200'
    ;;
    *)  echo '默认值'
    ;;
esac
#输出 变量值为100
```

## for语句
与其他语言类似，Shell支持for循环。注意在for循环中是以done为结尾的，其命令格式如下：
```bash
for 变量 in 值1 值2 值3
 do 
    #代码
 done 
 
或者：
for ((初始值;循环控制条件;变量变化))
do 
    #代码
done 
```
```bash
#!/bin/bash
for numbers in 1 2 3 4 
do 
  echo  "$numbers "
done
# 输出结果
# 1 
# 2
# 3
# 4

#实现1-100的累加
SUM=0
for(( i=1;i<=100;i++ ))
do 
SUM=$[SUM+$i]
done
#输出结果 5050
```

## while 语句
```bash
while [ 条件判断式 ] （注意条件判断式前后要有空格）
do 
    #程序代码
done 
```
下列的例子：若int小于等于5则继续循环，每次循环int加1，直到int大于5结束循环
```bash
#!/bin/bash
int=1
while(( $int<=5 ))
do
    echo $int
    let "int++"
done
#输出
# 1
# 2
# 3
# 4
# 5
```