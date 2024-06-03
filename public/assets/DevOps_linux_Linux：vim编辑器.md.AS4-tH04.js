import{_ as e,c as o,o as i,a4 as t}from"./chunks/framework.BMnk781U.js";const u=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"DevOps/linux/Linux：vim编辑器.md","filePath":"DevOps/linux/Linux：vim编辑器.md"}'),l={name:"DevOps/linux/Linux：vim编辑器.md"},a=t('<br><blockquote><p>在Linux中，当我们需要编辑文件时，就会使用到vi与vim。vi是Linux内置的文本编辑器，而vim可以看做是vi的升级版本，提供代码补全、颜色区分、错误跳转等编辑功能，被广泛的运用在日常开发中。本文就来着重介绍vim</p></blockquote><h2 id="常用模式" tabindex="-1">常用模式 <a class="header-anchor" href="#常用模式" aria-label="Permalink to &quot;常用模式&quot;">​</a></h2><p>在vim中，有三种常用的模式。分别是正常模式、插入模式、命令行模式</p><p align="center"><img src="https://img2.imgtp.com/2024/05/12/umNtSelc.png"></p><h3 id="普通模式-normal-mode" tabindex="-1">普通模式（Normal Mode） <a class="header-anchor" href="#普通模式-normal-mode" aria-label="Permalink to &quot;普通模式（Normal Mode）&quot;">​</a></h3><p>普通模式是 Vim 的默认模式，你可以在该模式下执行各种命令，如移动光标、复制、粘贴、删除等。在普通模式下，键入的字符会被解释为命令而不是文本内容。可以按下<code>Esc</code>键来从其他模式返回普通模式。</p><h3 id="插入模式-insert-mode" tabindex="-1">插入模式（Insert Mode） <a class="header-anchor" href="#插入模式-insert-mode" aria-label="Permalink to &quot;插入模式（Insert Mode）&quot;">​</a></h3><p>按下i、I 、o 、O、a、A、r、R的任意一个字母后进入该模式。一般使用i即可。在插入模式下，你可以像普通文本编辑器一样输入文本内容，按下<code>Esc</code>键来从其他模式返回普通模式。</p><h3 id="命令行模式-command-line-mode" tabindex="-1">命令行模式（Command-Line Mode） <a class="header-anchor" href="#命令行模式-command-line-mode" aria-label="Permalink to &quot;命令行模式（Command-Line Mode）&quot;">​</a></h3><p>在命令行模式下，可以执行各种命令，如保存文件、退出vim、搜索文本等。可以按下<code>:</code>键进入命令行模式。在命令行模式下，你可以输入各种命令，并按下<code>Enter</code>键执行。执行完命令后，vim会返回到普通模式。</p><h2 id="编写-hello-world-文本案例" tabindex="-1">编写‘hello，world’文本案例 <a class="header-anchor" href="#编写-hello-world-文本案例" aria-label="Permalink to &quot;编写‘hello，world’文本案例&quot;">​</a></h2><ol><li>vim helloworld.txt 回车后进入下图页面</li></ol><p align="center"><img src="https://img2.imgtp.com/2024/05/12/l2bw6Cjv.PNG"></p><ol start="2"><li>按下<code>i</code>之后进入插入模式，输入&#39;hello，world&#39;字符串</li></ol><p align="center"><img src="https://img2.imgtp.com/2024/05/12/VDZ0Mngg.PNG"></p><ol start="3"><li>输入完‘hello，world’之后按下<code>esc</code>键进入普通模式</li></ol><p align="center"><img src="https://img2.imgtp.com/2024/05/12/4PBTnhaP.png"></p><ol start="4"><li>按下<code>:</code>键进入命令行模式，对刚才编辑的txt文件内容进行保存并退出（输入:wq指令后回车退出）</li></ol><p align="center"><img src="https://img2.imgtp.com/2024/05/12/fNNdR4ph.png"></p><ol start="5"><li>现在用<code>cat</code>指令查看下刚才的文本有没有保存。可以看到是没有问题的</li></ol><p align="center"><img src="https://img2.imgtp.com/2024/05/12/vSC6WWOG.png"></p><h2 id="常用快捷键" tabindex="-1">常用快捷键 <a class="header-anchor" href="#常用快捷键" aria-label="Permalink to &quot;常用快捷键&quot;">​</a></h2><ol><li><code>yy</code>：拷贝当前行；xyy：当前行向下拷贝x行</li><li><code>p</code>(小写)：粘贴剪贴板内容到光标下方</li><li><code>P</code>(大写)：粘贴剪贴板内容到光标上方</li><li><code>dd</code>：删除当前行；xdd：当前行向下删除x行</li><li>在文件中查找某个单词 在<strong>命令模式</strong>下 <code>/单词</code> 后回车查找，输入n查找下一个</li><li><code>:set nu</code> <code>:set nonu</code> ：设置和不设置文件行号，在命令模式下</li><li><code>G</code>：文档的最末行，<code>gg</code>：文档最首行,<strong>在一般模式下使用</strong></li><li><code>u</code>：撤销上一次操作,<strong>在一般模式下使用</strong></li><li><code>shift + g</code> ：快速定位到文档某一行，<code>shift + g x</code>表示要定位到x行(例如shift + g 20表示定位到文档的第20行) ,<strong>在一般模式下使用</strong></li></ol><p>更多常用快捷键请查阅相关整理文档，如菜鸟教程：<a href="https://www.runoob.com/linux/linux-vim.html" target="_blank" rel="noreferrer">https://www.runoob.com/linux/linux-vim.html</a></p>',25),c=[a];function r(d,n,m,s,h,p){return i(),o("div",null,c)}const _=e(l,[["render",r]]);export{u as __pageData,_ as default};
