<script setup>
import { ref } from 'vue'
import { useCoverTransition } from '../coverTransition.js'

const onOpen = useCoverTransition()
const shelf = ref('done')

const finished = [
  {
    kicker: '前端',
    title: 'let、const、var',
    href: '/frontEnd/js/let、const、var三剑客',
    cover: '/covers/cover-js-let.webp',
    excerpt: '三种声明差在哪，面试时容易混。',
    minutes: 4,
  },
  {
    kicker: '前端',
    title: 'HTML5 语义化',
    href: '/frontEnd/html/基础知识',
    cover: '/covers/cover-html.webp',
    excerpt: '标签先说出结构，再谈样式。',
    minutes: 3,
  },
  {
    kicker: 'Docker',
    title: 'Docker 初印象',
    href: '/DevOps/docker/Docker初印象',
    cover: '/covers/cover-docker.webp',
    excerpt: '先建立容器是什么，再碰命令。',
    minutes: 5,
  },
]

const drafts = ['事件循环', '闭包', 'this', '原型链']

function canTilt() {
  return (
    window.matchMedia('(pointer: fine)').matches &&
    window.matchMedia('(hover: hover)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function onTilt(event) {
  if (!canTilt()) return
  const el = event.currentTarget
  const box = el.getBoundingClientRect()
  const x = (event.clientX - box.left) / box.width
  const y = (event.clientY - box.top) / box.height
  el.style.setProperty('--tilt-x', `${((0.5 - y) * 5).toFixed(2)}deg`)
  el.style.setProperty('--tilt-y', `${((x - 0.5) * 6).toFixed(2)}deg`)
}

function resetTilt(event) {
  event.currentTarget.style.setProperty('--tilt-x', '0deg')
  event.currentTarget.style.setProperty('--tilt-y', '0deg')
}
</script>

<template>
  <div class="paper-page paper-home">
    <h1>不会就学，<br>就这么简单。</h1>
    <p class="paper-lead">做前端，也在学 Docker。笔记和面试题都放这儿，写完的才能点。给自己复习，也给别人看看。</p>

    <section class="writing-card">
      <div>
        <p class="writing-card__kicker">摊开的一本 · 可以开始读</p>
        <h2>Promise 只有三种状态。变了，就不会再变。</h2>
        <p>pending、fulfilled、rejected。then 和 catch 的返回值，面试时很容易说反。</p>
        <p class="writing-card__meta">大约 6 分钟</p>
        <a class="writing-card__link" href="/exam/interview/Promise面试题" @pointerup="onOpen">打开这篇 →</a>
      </div>
      <img class="writing-card__mascot" src="/mascot.png" alt="" />
    </section>

    <section class="note-block">
      <div class="note-tabs" role="tablist" aria-label="笔记目录">
        <button
          type="button"
          class="note-tab"
          role="tab"
          :aria-selected="shelf === 'done'"
          @click="shelf = 'done'"
        >
          写完的
        </button>
        <button
          type="button"
          class="note-tab"
          role="tab"
          :aria-selected="shelf === 'draft'"
          @click="shelf = 'draft'"
        >
          还在写
        </button>
      </div>
      <p class="note-block__hint">{{ shelf === 'done' ? '可以从头读到尾。' : '名字先留着，还不能点。' }}</p>

      <div v-if="shelf === 'done'" class="note-covers">
        <a
          v-for="item in finished"
          :key="item.href"
          class="note-cover note-cover--book"
          :href="item.href"
          @pointermove="onTilt"
          @pointerleave="resetTilt"
          @pointerup="onOpen"
        >
          <span class="note-cover__face">
            <img class="note-cover__art" :src="item.cover" alt="" loading="lazy" decoding="async" />
          </span>
          <span class="note-cover__kicker">{{ item.kicker }}</span>
          <span class="note-cover__title">{{ item.title }}</span>
          <span class="note-cover__excerpt">{{ item.excerpt }}</span>
          <span class="note-cover__mins">大约 {{ item.minutes }} 分钟</span>
        </a>
      </div>

      <ul v-else class="note-drafts">
        <li v-for="title in drafts" :key="title">{{ title }}</li>
      </ul>
    </section>
  </div>
</template>
