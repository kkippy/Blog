<script setup>
import { useCoverTransition } from '../coverTransition.js'

const onOpen = useCoverTransition()

const finished = [
  {
    kicker: '前端',
    title: 'let、const、var',
    href: '/frontEnd/js/let、const、var三剑客',
  },
  {
    kicker: '前端',
    title: 'HTML5 语义化',
    href: '/frontEnd/html/基础知识',
  },
  {
    kicker: 'Docker',
    title: 'Docker 初印象',
    href: '/DevOps/docker/Docker初印象',
  },
]

const drafts = ['事件循环', '闭包', 'this', '原型链']
</script>

<template>
  <div class="paper-page">
    <h1>不会就学，<br>就这么简单。</h1>
    <p class="paper-lead">做前端，也在学 Docker。笔记和面试题都放这儿，写完的才能点。给自己复习，也给别人看看。</p>

    <section class="writing-card">
      <div>
        <p class="writing-card__kicker">最近在写</p>
        <h2>Promise 只有三种状态。变了，就不会再变。</h2>
        <p>pending、fulfilled、rejected。then 和 catch 的返回值，面试时很容易说反。</p>
        <a class="writing-card__link" href="/exam/interview/Promise面试题" @pointerup="onOpen">打开这篇 →</a>
      </div>
      <img class="writing-card__mascot" src="/mascot.png" alt="" />
    </section>

    <section class="note-block">
      <h3>写完的</h3>
      <p class="note-block__hint">可以从头读到尾。</p>
      <div class="note-covers">
        <a v-for="item in finished" :key="item.href" class="note-cover" :href="item.href" @pointerup="onOpen">
          <span class="note-cover__kicker">{{ item.kicker }}</span>
          <span class="note-cover__title">{{ item.title }}</span>
        </a>
      </div>
    </section>

    <section class="note-block">
      <h3>还在写</h3>
      <div class="note-covers note-covers--small">
        <div v-for="title in drafts" :key="title" class="note-cover">
          <span class="note-cover__title">{{ title }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
