---
prev:
  text: 'Docker常规软件的安装'
  link: '/DevOps/docker/Docker常规软件的安装'
  
next:
  text: '三主三从redis集群扩缩容配置'
  link: '/DevOps/docker/基础命令2'
---

# 预期效果
主服务器3307修改的数据在从服务器3308中能进行同步

## 具体实施步骤

1. 新建主服务器3307
```bash
docker run -p 3307:3306 --name mysql-master -v
/mydata/mysql-master/log:/varlog/mysql -v
/mydata/mysql-master/data:/var/lib/mysql  -v
/mydata/mysql-master/conf.d:/etc/mysql -e MYSQL_ROOT_PASSWORD=root -d mysql:5.7
```

2. 进入`/mydata/mysql-master/conf.d`目录下新建`my.cnf`文件
```bash
[mysqld]
##设置server id，同一局域网中需要唯一
server_id=101
##指定不需要同步的数据库名称
binlog-ignore-db=mysql
##开启二进制日志功能
log-bin=mall-mysql-bin
##设置二进制日志使用内存大小(事务)
binlog_cache_size=1M
##设置使用的二进制日志格式(mixed,statement，row)
binlog_format=mixed
##二进制日志过期清理时间。默认值为0，表示不自动清理
expire_logs_days=7
##跳过主从复制中遇到的所有错误或指定类型的错误，避免slave端复制中断
## 如:1062错误是指一些主键重复，1032错误是因为主从数据库数据不一致
slave_skip_errors=1062
```

3. 修改完之后重启master实例：`docker restart mysql-master`

4. 进入mysql-master容器
```bash
docker exec -it mysql-master /bin/bash
mysql -uroot -p 之后输入密码root即可进入数据库
```

5. master容器内创建数据同步用户
```bash
CREATE USER 'slave'@'%' IDENTIFIED BY '123456'; #创建slave用户以123456的密码登录并授权给其相关的操作权限 
#或使用create user 'slave'@'%' identified by '123456';
GRANT REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'slave'@'%';
#或使用grant replication slave, replication client on *.* to 'slave'@'%';
```

6.	新建从服务器3308

