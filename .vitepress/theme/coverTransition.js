import { nextTick } from 'vue'
import { useRouter } from 'vitepress'
import { mountSectionAccordion } from './sectionAccordion.js'

let active = false

export function isCoverTransition() {
  return active
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

/**
 * VitePress 在 window 的捕获阶段就处理点击，组件里的 click 赶不上。
 * 松开按键时先拿掉 href，封面抬一下，再淡入文章。导航留在原地。
 */
export function useCoverTransition() {
  const router = useRouter()

  return (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (prefersReducedMotion() || typeof document.startViewTransition !== 'function') return

    const link = event.currentTarget
    const href = link?.getAttribute?.('href')
    if (!href || active) return

    const source = link.closest('.note-cover, .writing-card') || link
    source.classList.add('is-lifting')
    link.removeAttribute('href')
    active = true

    const finish = () => {
      active = false
      source.classList.remove('is-lifting')
      if (link.isConnected && !link.getAttribute('href')) link.setAttribute('href', href)
    }

    wait(180)
      .then(() => {
        const transition = document.startViewTransition(async () => {
          await router.go(href)
          await nextTick()
          mountSectionAccordion()
        })
        transition.finished.then(finish, finish)
      })
      .catch((error) => {
        finish()
        throw error
      })
  }
}
