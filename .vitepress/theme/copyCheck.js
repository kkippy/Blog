/**
 * 复制成功后画一笔对勾，稍停再回到复制图标。
 * VitePress 默认会把「已复制」留两秒，这里提前收回。
 */
export function polishCopyButtons() {
  document.querySelectorAll('div[class*="language-"] > button.copy').forEach((button) => {
    button.removeAttribute('title')
    if (!button.getAttribute('aria-label')) button.setAttribute('aria-label', '复制')
  })
}

export function bindCopyCheck() {
  polishCopyButtons()
  window.addEventListener('click', (event) => {
    const button = event.target instanceof Element
      ? event.target.closest('div[class*="language-"] > button.copy')
      : null
    if (!button) return
    if (!button.querySelector('.kr-check')) {
      button.insertAdjacentHTML(
        'beforeend',
        '<svg class="kr-check" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5 10 17.5 19 7" /></svg>'
      )
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hold = reduced ? 700 : 1400
    const started = performance.now()
    const watch = () => {
      if (button.classList.contains('copied')) {
        const wait = Math.max(0, hold - (performance.now() - started))
        window.setTimeout(() => button.classList.remove('copied'), wait)
        return
      }
      if (performance.now() - started < 1200) requestAnimationFrame(watch)
    }
    requestAnimationFrame(watch)
  })
}
