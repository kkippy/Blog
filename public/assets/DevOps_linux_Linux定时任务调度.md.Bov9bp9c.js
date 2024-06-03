import{_ as s,c as i,o as a,a4 as n}from"./chunks/framework.BMnk781U.js";const o=JSON.parse('{"title":"定时任务调度","description":"","frontmatter":{"title":"定时任务调度"},"headers":[],"relativePath":"DevOps/linux/Linux定时任务调度.md","filePath":"DevOps/linux/Linux定时任务调度.md"}'),t={name:"DevOps/linux/Linux定时任务调度.md"},l=n(`<blockquote><p>在 Linux 中，存在一些需要特定时间去执行某个命令或者程序的需求。相当于给指定的命令或者程序定个闹钟，时间一到就去执行。有点类似 JAVA 中的定时器。在 Linux 中，这一概念被称为定时任务调度，使用<code>crond</code>相关指令执行。任务调度分为两种，一种是系统工作（必须周周而复始执行的重要操作，如系统的病毒扫描），第二种则是用户工作（是用户想要执行的某些程序，例如重要文件的定期备份）。下面介绍其相关语法及一次性的定时任务。</p></blockquote><h2 id="定时任务调度" tabindex="-1">定时任务调度 <a class="header-anchor" href="#定时任务调度" aria-label="Permalink to &quot;定时任务调度&quot;">​</a></h2><p>设置任务调度的流程：使用<code>crontab -e</code>创建个人任务调度 → 输入任务到调度文件。例如：</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">crontab</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -e</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/1 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">*</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;"> *</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ls -l /etc/ </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">&gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> /tmp/to.txt  //代表每小时的每一分钟都会执行一次该命令（将etc目录下的文件按照列表形式展示并重复该到/tmp/to.txt文件中）</span></span></code></pre></div><p>接下来解释语法中各个参数的具体含义：</p><ul><li>第一个*：代表一小时当中的第几分钟（0-59）</li><li>第二个*：代表一天当中的第几个小时（0-23）</li><li>第三个*：代表一个月当中的第几天（1-31）</li><li>第四个*：代表一年当中的第几个月（1-12）</li><li>第五个*：代表一周当中的星期几（0-7,0 和 7 都表示星期天）</li><li>“,”：代表不连续的时间（0 3,6,8 * * * 代表每天的 3 点 0 分，6 点 0 分，8 点 0 分都执行一次）</li><li>“-”：代表连续时间（0 5 * * 1-6 代表星期一到星期六，每天 5 点执行命令）</li><li>“_/n”：代表每隔过久执行一次（ _/10 * * * * 代表每 10 分钟执行一次）</li></ul><p>其他指令：</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">crontab</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -r</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 终止任务调度</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">crontab</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -l</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 列出当前都有哪些任务调度</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">service</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> crond</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> restart</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 重启任务调度</span></span></code></pre></div><h2 id="at-定时任务" tabindex="-1">at 定时任务 <a class="header-anchor" href="#at-定时任务" aria-label="Permalink to &quot;at 定时任务&quot;">​</a></h2><p>at 命令是一次性定时计划任务，at 的守护进程 atd 会以后台模式运行，检查作业队列来运行。默认情况下，atd 守护进程每 60 秒检查作业队列，有作业时，会检查作业运行时间，如果时间与当前时间匹配，则运行此作业。注意，执行该命令之前要确保 atd 进程处于开启状态（可使用<code>ps -ef</code>命令查看）。可使用<code>atq</code>命令查看系统中有没有执行的工作任务<br> 指令格式：at [选项] 时间。通过两次 Ctrl + D 结束命令的输入</p><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">选项解释：</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-m</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 当指定的任务被完成后，将给用户发送邮件，即使没有标准输出</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-I</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> atq的别名</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> atrm的别名</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-v</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 显示任务将被执行的时间</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-c</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 打印任务的内容到标准输出</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-V</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 显示版本信息</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-q</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 队列：使用指定的队列</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-f</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 文件：从指定文件读入任务而不是从标准输入读入</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-t</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 时间参数：以时间参数的形式提交要运行的任务</span></span></code></pre></div><div class="language-shell vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">shell</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">时间部分的定义：</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> hh:mm的格式</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> ：例如04:00</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 使用midnight，noon等比较模糊的时间词语</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 使用12小时计时制，即加上AM或者PM,例如3am</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">上午三点</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">,7pm</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">下午7点</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 使用具体日期。格式为month</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> day</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">月日</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">或mm/dd/yy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">月/日/年</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">或dd.mm.yy</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">日.月.年</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">，指定的日期必须跟在指定时间的后面。</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 例如:04:00</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 2021-03-1</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 使用相对计时法。格式为now</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> +</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> count</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> time-units，now就是当前时间，time-units是时间单位这里能够是minutes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">分钟</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">、hours</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">小时</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">、days</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">天</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">、weeks</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">星期</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">。count是时间的数量</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">几小时，几天</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">。例如:now</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> +5</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> minutes</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 直接使用today</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">今天</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">、tomorrow</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">明天</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">来指定完成命令的时间</span></span></code></pre></div><p>这里针对 at 一次性定时任务举几个例子</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>2天后的下午5点执行/bin/ls /home</span></span>
<span class="line"><span>at 5pm +2 days</span></span>
<span class="line"><span>at&gt; /bin/ls /home</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>明天17点，输出时间到/root/date200.log内</span></span>
<span class="line"><span>at 5pm tomorrow</span></span>
<span class="line"><span>at&gt; date &gt; /root/date200.log</span></span>
<span class="line"><span></span></span>
<span class="line"><span>2分钟后，输出时间到/root/date100.log内</span></span>
<span class="line"><span>at now +2 minutes</span></span>
<span class="line"><span>at&gt; date &gt; /root/date100.log</span></span></code></pre></div><blockquote><p>合理使用任务调度，会在处理一些业务需求时起到事半功倍的效果，或者在功能的实现过程中更加智能化、自动化，减少重复的操作行为。不只是命令，还可以定时的制定自定义的脚本，例如使用<code>dump</code>命令编辑文件备份脚本，结合任务调度就可以做到系统的无人值守备份。所以任务调度对于运维开发来说还是非常重要的~</p></blockquote>`,15),h=[l];function p(k,e,d,F,r,g){return a(),i("div",null,h)}const y=s(t,[["render",p]]);export{o as __pageData,y as default};
