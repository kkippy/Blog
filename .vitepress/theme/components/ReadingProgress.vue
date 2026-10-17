<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()
const progress = ref(0)
const enabled = computed(() => frontmatter.value.layout !== 'home')

let ticking = false
const update = () => {
  const el = document.documentElement
  const total = el.scrollHeight - el.clientHeight
  progress.value = total > 0 ? Math.min(100, Math.max(0, (el.scrollTop / total) * 100)) : 0
  ticking = false
}
const onScroll = () => {
  if (!ticking) {
    ticking = true
    requestAnimationFrame(update)
  }
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
  update()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <div
    v-if="enabled"
    class="reading-progress"
    role="progressbar"
    aria-label="阅读进度"
    :aria-valuenow="Math.round(progress)"
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div class="reading-progress__bar" :style="{ width: progress + '%' }" />
  </div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 100;
  pointer-events: none;
}

.reading-progress__bar {
  height: 100%;
  background: linear-gradient(90deg, var(--kr-brand), var(--kr-accent));
  border-radius: 0 999px 999px 0;
  transition: width 0.1s linear;
}

@media (prefers-reduced-motion: reduce) {
  .reading-progress__bar {
    transition: none;
  }
}
</style>
