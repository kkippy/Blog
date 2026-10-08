<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const open = ref(false)
const root = ref(null)

const toggle = () => {
  open.value = !open.value
}
const onClickOutside = (e) => {
  if (root.value && !root.value.contains(e.target)) open.value = false
}
const onEscape = (e) => {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  document.addEventListener('keydown', onEscape)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
  document.removeEventListener('keydown', onEscape)
})
</script>

<template>
  <div ref="root" class="wechat-qr" :class="{ 'is-open': open }">
    <button
      type="button"
      class="wechat-qr__trigger"
      title="微信公众号"
      aria-label="微信公众号二维码"
      :aria-expanded="open"
      @click="toggle"
    >
      <svg viewBox="0 0 1024 1024" width="18" height="18" aria-hidden="true">
        <path
          d="M849.92 51.2H174.08c-67.8656 0-122.88 55.0144-122.88 122.88v675.84c0 67.8656 55.0144 122.88 122.88 122.88h675.84c67.8656 0 122.88-55.0144 122.88-122.88V174.08c0-67.8656-55.0144-122.88-122.88-122.88zM448.18432 230.94272c176.98304-53.95968 267.17696 110.98624 267.17696 110.98624-32.59392-17.78176-130.39104-37.53472-235.09504 16.7936s-126.4384 172.87168-126.4384 172.87168c-42.56256-45.4144-44.4928-118.6304-44.4928-118.6304 5.03296-137.41568 138.84928-182.02112 138.84928-182.02112zM393.50784 796.42112c-256.12288-49.6384-197.85216-273.38752-133.81632-371.95264 0 0-2.88256 138.13248 130.22208 214.4 0 0 15.82592 7.1936 10.79296 30.21312l-5.03808 29.49632s-6.656 20.1472 6.02624 22.30272c0 0 4.04992 0 13.39904-6.4768l48.92672-32.37376s10.07104-7.1936 23.01952-5.03808c12.94848 2.16064 95.68768 23.74656 177.70496-44.60032-0.00512 0-15.10912 213.67296-271.23712 164.02944z m256.8448-19.42016c16.54784-7.9104 97.1264-102.8864 58.98752-231.66464s-167.6288-157.55776-167.6288-157.55776c66.19136-28.0576 143.89248-7.19872 143.89248-7.19872 117.9904 34.5344 131.6608 146.77504 131.6608 146.77504 23.01952 200.71936-166.912 249.64608-166.912 249.64608z"
          fill="#01CC7A"
        />
      </svg>
    </button>

    <div class="wechat-qr__popover" role="dialog" aria-label="微信公众号二维码">
      <img src="/qrcode.png" alt="微信公众号二维码" loading="lazy" />
      <p>微信扫一扫，关注公众号</p>
    </div>
  </div>
</template>

<style scoped>
.wechat-qr {
  position: relative;
  display: inline-flex;
  margin-left: 10px;
}

.wechat-qr__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 999px;
  border: 1px solid var(--kr-line);
  background: var(--kr-card);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.wechat-qr__trigger:hover {
  transform: translateY(-1px);
  background: var(--kr-card-solid);
  box-shadow: 0 10px 22px var(--kr-shadow);
}

.wechat-qr__popover {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  z-index: 120;
  width: 320px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid var(--kr-line);
  background: var(--kr-popover);
  box-shadow: 0 18px 40px var(--kr-shadow);
  backdrop-filter: blur(16px);
  text-align: center;
  opacity: 0;
  transform: translateY(-6px);
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.wechat-qr__popover img {
  display: block;
  width: 100%;
  height: auto;
  margin: 0 auto;
  border-radius: 10px;
}

.wechat-qr__popover p {
  margin: 10px 0 0;
  font-size: 0.82rem;
  color: var(--kr-ink-2);
}

.wechat-qr.is-open .wechat-qr__popover {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

@media (hover: hover) {
  .wechat-qr:hover .wechat-qr__popover,
  .wechat-qr:focus-within .wechat-qr__popover {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wechat-qr__trigger,
  .wechat-qr__popover {
    transition: none;
  }
}
</style>
