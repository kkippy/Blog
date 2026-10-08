<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const STORAGE_KEY = 'kr-focus-reading'
const active = ref(false)
const route = useRoute()

const apply = (on) => {
  document.documentElement.classList.toggle('focus-reading', on)
}

onMounted(() => {
  active.value = localStorage.getItem(STORAGE_KEY) === '1'
  apply(active.value)
})

watch(active, (on) => {
  apply(on)
  localStorage.setItem(STORAGE_KEY, on ? '1' : '0')
})

// 路由切换后类名仍在 documentElement 上，这里只是防止中途被清掉
watch(() => route.path, () => apply(active.value))

onBeforeUnmount(() => apply(false))

const toggle = () => {
  active.value = !active.value
}
</script>

<template>
  <button
    type="button"
    class="focus-reading__button"
    :class="{ 'is-active': active }"
    :aria-pressed="active"
    :title="active ? '退出专注阅读，恢复两侧目录和默认行宽' : '收起两侧目录，加宽正文'"
    @click="toggle"
  >
    <svg v-if="!active" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 7h4M4 12h4M4 17h4" />
      <path d="M16 7h4M16 12h4M16 17h4" />
      <path d="M10 5v14M14 5v14" />
    </svg>
    <svg v-else viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M8 8h8v8H8z" />
      <path d="M4 9V5h4M20 9V5h-4M4 15v4h4M20 15v4h-4" />
    </svg>
    <span>{{ active ? '退出专注' : '专注阅读' }}</span>
  </button>
</template>

<style scoped>
.focus-reading__button {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  height: 32px;
  padding: 0 12px 0 10px;
  border-radius: 999px;
  border: 1px solid var(--kr-line-2);
  background: var(--kr-card-solid);
  color: var(--kr-ink-2);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  box-shadow: 0 8px 18px var(--kr-shadow);
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    transform 0.2s ease;
}

.focus-reading__button:hover {
  color: var(--kr-ink-1);
  border-color: var(--kr-brand);
  transform: translateY(-1px);
}

.focus-reading__button.is-active {
  position: fixed;
  top: 78px;
  left: 28px;
  z-index: 90;
  color: var(--kr-ink-1);
  border-color: var(--kr-line-2);
  background: var(--kr-card-solid);
  box-shadow: 0 12px 28px var(--kr-shadow);
}

.focus-reading__button:focus-visible {
  outline: 2px solid var(--kr-brand);
  outline-offset: 3px;
}

@media (max-width: 959px) {
  .focus-reading__button {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .focus-reading__button {
    transition: none;
  }
}
</style>
