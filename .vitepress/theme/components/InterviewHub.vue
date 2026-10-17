<script setup>
import { useCoverTransition } from '../coverTransition.js'

const onOpen = useCoverTransition()
const drafts = [
  { title: '事件循环', cover: '/covers/cover-event-loop.webp' },
  { title: '宏任务 / 微任务', cover: '/covers/cover-microtask.webp' },
  { title: 'async / await', cover: '/covers/cover-async.webp' },
  { title: '闭包', cover: '/covers/cover-closure.webp' },
  { title: '原型链', cover: '/covers/cover-prototype.webp' },
  { title: 'this', cover: '/covers/cover-this.webp' },
  { title: '浏览器缓存', cover: '/covers/cover-cache.webp' },
  { title: '网络基础', cover: '/covers/cover-network.webp' },
]
</script>

<template>
  <div class="paper-page">
    <h1>面试题</h1>
    <p class="paper-lead">面试前我会回来翻。写完的在上面，没写完的先记名字。</p>

    <section class="writing-card">
      <div>
        <p class="writing-card__kicker">写完的 · 可以开始读</p>
        <h2>Promise 只有三种状态。变了，就不会再变。</h2>
        <p>链式调用看的是上一个 then 返回了什么，不是把状态原样抄过去。</p>
        <a class="writing-card__link" href="/exam/interview/Promise面试题" @pointerup="onOpen">打开这篇 →</a>
      </div>
      <img class="writing-card__mascot" src="/mascot.png" alt="" />
    </section>

    <section class="note-block">
      <h3>还在写</h3>
      <p class="note-block__hint">名字先留着，还不能点。</p>
      <div class="note-covers note-covers--small">
        <div v-for="item in drafts" :key="item.title" class="note-cover">
          <img class="note-cover__art" :src="item.cover" alt="" loading="lazy" decoding="async" />
          <span class="note-cover__title">{{ item.title }}</span>
        </div>
      </div>
    </section>
  </div>
</template>
