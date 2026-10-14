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

/**
 * VitePress 在 window 的捕获阶段就处理点击，组件里的 click 赶不上。
 * 松开按键时先拿掉 href，让这次点击不再被它接走，再淡入文章。
 * 封面和标题形状差得太远，拉在一起会叠成两层字，所以只做整页淡入淡出，导航留在原地。
 */
export function useCoverTransition() {
  const router = useRouter()

  return (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (prefersReducedMotion() || typeof document.startViewTransition !== 'function') return

    const link = event.currentTarget
    const href = link?.getAttribute?.('href')
    if (!href || active) return

    link.removeAttribute('href')
    active = true

    let transition
    try {
      transition = document.startViewTransition(async () => {
        await router.go(href)
        await nextTick()
        mountSectionAccordion()
      })
    } catch (error) {
      active = false
      link.setAttribute('href', href)
      throw error
    }

    const finish = () => {
      active = false
      if (link.isConnected && !link.getAttribute('href')) link.setAttribute('href', href)
    }
    transition.finished.then(finish, finish)
  }
}
