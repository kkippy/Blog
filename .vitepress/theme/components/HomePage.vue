<script setup>
const proofPoints = [
  { value: '18+', label: '持续沉淀的内容' },
  { value: '3', label: '核心知识栏目' },
  { value: 'Now', label: '正在整理 Promise 面试题' },
]

const columns = [
  {
    index: '01',
    title: '面试题整理',
    link: '/exam/interview/',
    description: '把零散的高频题目重写为结构化文档，适合复习、查漏补缺和二次回顾。',
    meta: 'Promise / 高频题 / Interview',
  },
  {
    index: '02',
    title: '前端笔记',
    link: '/frontEnd/js/',
    description: '围绕 HTML、JavaScript 与基础概念做长期可复用的知识沉淀。',
    meta: 'HTML / JavaScript / 基础',
  },
  {
    index: '03',
    title: 'DevOps 笔记',
    link: '/DevOps/docker/',
    description: '记录 Linux、Docker 与服务管理中的实操经验和排障过程。',
    meta: 'Linux / Docker / 实战',
  },
]

const featuredEntry = {
  title: 'Promise 面试题',
  link: '/exam/interview/Promise面试题',
  intro: '把 Notion 中的原始笔记重构成可阅读、可背诵、可快速复盘的一篇面试文档。',
  summary:
    '覆盖 Promise 状态流转、then / catch / finally、静态方法、async / await 与执行顺序等高频问题。',
}

const latestEntries = [
  {
    type: 'Interview',
    title: 'Promise 面试题',
    link: '/exam/interview/Promise面试题',
    desc: '适合作为 JavaScript 异步能力的系统复盘入口。',
  },
  {
    type: 'DevOps',
    title: 'Docker 初印象',
    link: '/DevOps/docker/Docker初印象',
    desc: '从容器的基本认知切入，建立 DevOps 学习的第一层地图。',
  },
  {
    type: 'Frontend',
    title: 'let、const、var 三剑客',
    link: '/frontEnd/js/let、const、var三剑客',
    desc: '从作用域和变量提升理解声明方式的真实差异。',
  },
]
</script>

<template>
  <div class="signature-home">
    <section class="signature-hero">
      <div class="hero-copy">
        <p class="hero-kicker">KRABBY / PERSONAL BRAND BLOG</p>
        <h1>把博客写成一份持续生长的个人作品集。</h1>
        <p class="hero-lead">
          这里不只是文章归档，而是把前端、DevOps 与面试题整理成一套可阅读、可展示、可复习的知识资产。
        </p>

        <div class="hero-actions">
          <a class="hero-button hero-button--primary" href="/exam/interview/">进入面试题</a>
          <a class="hero-button hero-button--secondary" href="/frontEnd/js/">查看前端笔记</a>
        </div>

        <div class="proof-strip">
          <div v-for="item in proofPoints" :key="item.label" class="proof-item">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>

      <div class="hero-composition">
        <div class="brand-frame">
          <div class="brand-frame__top">
            <p class="frame-label">Editorial Snapshot</p>
            <span class="frame-note">Knowledge, writing, and proof of work</span>
          </div>

          <div class="brand-frame__body">
            <div class="brand-portrait">
              <div class="brand-portrait__halo"></div>
              <img src="/avatar.png" alt="KRABBY avatar" />
            </div>

            <div class="brand-note">
              <p class="brand-note__eyebrow">Current Focus</p>
              <h2>用一篇篇高质量整理文档，逐步建立个人可信度。</h2>
              <p>
                当前重点是把 Promise 面试题和基础知识重写成结构清晰、便于回顾的内容，让博客既能服务学习，也能体现方法论。
              </p>
            </div>
          </div>

          <div class="brand-frame__bottom">
            <a class="frame-entry" :href="featuredEntry.link">
              <span>Latest Feature</span>
              <strong>{{ featuredEntry.title }}</strong>
            </a>
            <p class="frame-summary">
              用结构化写作而不是简单摘录，把每一篇文章都做成长期可复用的知识单元。
            </p>
          </div>
        </div>

        <div class="floating-manifesto">
          <span>Method</span>
          <p>Collect → Rewrite → Structure → Revisit</p>
        </div>
      </div>
    </section>

    <section class="signature-grid signature-grid--primary">
      <a class="spotlight-card" :href="featuredEntry.link">
        <p class="spotlight-card__eyebrow">Featured Reading</p>
        <h2>{{ featuredEntry.title }}</h2>
        <p class="spotlight-card__intro">{{ featuredEntry.intro }}</p>
        <p class="spotlight-card__summary">{{ featuredEntry.summary }}</p>
        <span class="spotlight-card__action">查看文章</span>
      </a>

      <div class="column-panel">
        <div class="section-heading">
          <p>Core Sections</p>
          <h2>内容结构不做铺满式罗列，而是先强调长期价值。</h2>
        </div>

        <div class="column-list">
          <a v-for="column in columns" :key="column.title" class="column-item" :href="column.link">
            <span class="column-item__index">{{ column.index }}</span>
            <div class="column-item__body">
              <strong>{{ column.title }}</strong>
              <p>{{ column.description }}</p>
              <span>{{ column.meta }}</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="signature-grid signature-grid--secondary">
      <div class="about-panel">
        <div class="section-heading">
          <p>About</p>
          <h2>写博客的人</h2>
        </div>

        <div class="about-panel__body">
          <img class="about-panel__avatar" src="/avatar.png" alt="KRABBY avatar" />
          <div class="about-panel__text">
            <p>
              前端 + DevOps 双料选手，相信"不会就学，就这么简单"。
              这个博客是我的知识管理方法：先收集，再重写，把零散笔记变成可以反复调用的认知资产。
            </p>
            <div class="about-panel__links">
              <a href="https://github.com/kkippy" target="_blank" rel="noopener noreferrer">GitHub 主页</a>
              <a href="/exam/interview/">从精选内容开始读</a>
            </div>
          </div>
        </div>
      </div>

      <div class="entry-panel">
        <div class="section-heading">
          <p>Selected Reads</p>
          <h2>第一次进入博客，可以先从这些内容快速建立认知地图。</h2>
        </div>

        <div class="entry-list">
          <a v-for="entry in latestEntries" :key="entry.title" class="entry-row" :href="entry.link">
            <span class="entry-row__type">{{ entry.type }}</span>
            <div class="entry-row__body">
              <strong>{{ entry.title }}</strong>
              <p>{{ entry.desc }}</p>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="signature-cta">
      <p class="signature-cta__eyebrow">Next</p>
      <div class="signature-cta__content">
        <h2>接下来，这里会继续向"前端基础 + DevOps + 面试整理"的品牌方向收拢。</h2>
        <a href="/exam/interview/">从面试题部分开始阅读</a>
      </div>
    </section>
  </div>
</template>
