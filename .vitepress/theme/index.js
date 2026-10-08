// https://vitepress.dev/guide/custom-theme
import { defineComponent, h, nextTick, onMounted, watch } from 'vue'
import { useData, useRoute, inBrowser } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import HomePage from './components/HomePage.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import BackToTop from './components/BackToTop.vue'
import DocMeta from './components/DocMeta.vue'
import FocusReading from './components/FocusReading.vue'
import WeChatQR from './components/WeChatQR.vue'
import './style.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: defineComponent({
    setup() {
      const { frontmatter } = useData()
      const route = useRoute()

      if (inBrowser) {
        // 文章图片点击放大，路由切换后重新挂载
        let zoom
        const attachZoom = () => {
          zoom?.detach()
          zoom = mediumZoom('.vp-doc img', {
            background: 'rgba(246, 242, 233, 0.92)',
            margin: 24,
          })
        }
        onMounted(() => nextTick(attachZoom))
        watch(() => route.path, () => nextTick(attachZoom))

        // 只在路径变化后播一次正文入场。锚点跳转不改 route.path，不会触发。
        watch(
          () => route.path,
          async () => {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
            await nextTick()
            const target = document.querySelector('.vp-doc, .VPHome')
            if (!target) return
            target.classList.remove('kr-page-enter')
            void target.offsetWidth
            target.classList.add('kr-page-enter')
          },
          { flush: 'post' }
        )
      }

      return () => {
        const slots = {
          // https://vitepress.dev/guide/extending-default-theme#layout-slots
          'layout-top': () => [h(ReadingProgress), h(BackToTop)],
          'doc-before': () =>
            frontmatter.value.layout === 'home'
              ? null
              : h('div', { class: 'doc-before-row' }, [h(DocMeta), h(FocusReading)]),
          'nav-bar-content-after': () => h(WeChatQR),
          'nav-screen-content-after': () => h(WeChatQR),
        }

        if (frontmatter.value.layout === 'home') {
          slots['home-hero-before'] = () => h(HomePage)
        }

        return h(DefaultTheme.Layout, null, slots)
      }
    },
  }),
}
