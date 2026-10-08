<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter, page } = useData()

const wordCount = computed(() => Number(frontmatter.value.wordCount) || 0)
const readingTime = computed(() => Number(frontmatter.value.readingTime) || 1)

const updatedAt = computed(() => {
  const ts = page.value.lastUpdated
  if (!ts) return ''
  const d = new Date(ts)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mm}-${dd}`
})

// 栏目落地页（带自定义 class）和近乎空白的页面不显示元信息
const show = computed(() => wordCount.value >= 100 && !frontmatter.value.class)
</script>

<template>
  <p v-if="show" class="doc-meta">
    <span>约 {{ wordCount }} 字</span>
    <span class="doc-meta__dot" aria-hidden="true" />
    <span>阅读约需 {{ readingTime }} 分钟</span>
    <template v-if="updatedAt">
      <span class="doc-meta__dot" aria-hidden="true" />
      <span>更新于 {{ updatedAt }}</span>
    </template>
  </p>
</template>

<style scoped>
.doc-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin: 0 0 8px;
  font-size: 0.84rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--kr-ink-3);
}

.doc-meta__dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--kr-accent);
}
</style>
