<script setup>
import { useCoverTransition } from '../coverTransition.js'

const onOpen = useCoverTransition()

const finished = [
  {
    kicker: '前端',
    title: 'Vue 面试题',
    href: '/frontEnd/vue/Vue面试题',
  },
  {
    kicker: '面试题',
    title: 'Promise',
    href: '/exam/interview/Promise面试题',
  },
  {
    kicker: 'Docker',
    title: 'Docker 初印象',
    href: '/DevOps/docker/Docker初印象',
  },
]
</script>

<template>
  <div class="paper-page not-found-page">
    <p class="not-found-page__code">404</p>
    <h1>这篇还不在这儿。</h1>
    <p class="paper-lead">链接可能写错了，或者我还没把这篇放上来。下面这几篇是写完的，可以从这儿接着看。也可以点左上角搜一下。</p>

    <section class="writing-card">
      <div>
        <p class="writing-card__kicker">走错页了</p>
        <h2>不会就学，就这么简单。</h2>
        <p>先回首页，或者打开一篇已经写完的笔记。</p>
        <a class="writing-card__link" href="/" @pointerup="onOpen">回首页 →</a>
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
  </div>
</template>
