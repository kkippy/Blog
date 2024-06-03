<br>

> 在Linux中，当我们需要编辑文件时，就会使用到vi与vim。vi是Linux内置的文本编辑器，而vim可以看做是vi的升级版本，提供代码补全、颜色区分、错误跳转等编辑功能，被广泛的运用在日常开发中。本文就来着重介绍vim

## 常用模式
在vim中，有三种常用的模式。分别是正常模式、插入模式、命令行模式
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/umNtSelc.png"  />
</p>

### 普通模式（Normal Mode）
普通模式是 Vim 的默认模式，你可以在该模式下执行各种命令，如移动光标、复制、粘贴、删除等。在普通模式下，键入的字符会被解释为命令而不是文本内容。可以按下`Esc`键来从其他模式返回普通模式。

### 插入模式（Insert Mode）
按下i、I 、o 、O、a、A、r、R的任意一个字母后进入该模式。一般使用i即可。在插入模式下，你可以像普通文本编辑器一样输入文本内容，按下`Esc`键来从其他模式返回普通模式。

### 命令行模式（Command-Line Mode）
在命令行模式下，可以执行各种命令，如保存文件、退出vim、搜索文本等。可以按下`:`键进入命令行模式。在命令行模式下，你可以输入各种命令，并按下`Enter`键执行。执行完命令后，vim会返回到普通模式。

## 编写‘hello，world’文本案例
1. vim helloworld.txt 回车后进入下图页面
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/l2bw6Cjv.PNG"  />
</p>

2. 按下`i`之后进入插入模式，输入'hello，world'字符串
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/VDZ0Mngg.PNG"  />
</p>

3. 输入完‘hello，world’之后按下`esc`键进入普通模式
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/4PBTnhaP.png"  />
</p>

4. 按下`:`键进入命令行模式，对刚才编辑的txt文件内容进行保存并退出（输入:wq指令后回车退出）
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/fNNdR4ph.png" />
</p>

5. 现在用`cat`指令查看下刚才的文本有没有保存。可以看到是没有问题的
<p align='center'>
<img src="https://img2.imgtp.com/2024/05/12/vSC6WWOG.png" />
</p>


## 常用快捷键
1. `yy`：拷贝当前行；xyy：当前行向下拷贝x行
2. `p`(小写)：粘贴剪贴板内容到光标下方
3. `P`(大写)：粘贴剪贴板内容到光标上方
4. `dd`：删除当前行；xdd：当前行向下删除x行 
5. 在文件中查找某个单词 在**命令模式**下 `/单词` 后回车查找，输入n查找下一个
6. `:set nu` `:set nonu` ：设置和不设置文件行号，在命令模式下
7. `G`：文档的最末行，`gg`：文档最首行,**在一般模式下使用**
8. `u`：撤销上一次操作,**在一般模式下使用**
9. `shift + g` ：快速定位到文档某一行，`shift + g  x`表示要定位到x行(例如shift + g  20表示定位到文档的第20行) ,**在一般模式下使用**

更多常用快捷键请查阅相关整理文档，如菜鸟教程：https://www.runoob.com/linux/linux-vim.html