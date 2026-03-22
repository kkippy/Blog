// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomePage from './components/HomePage.vue'
import './style.css'

/** @type {import('vitepress').Theme} */
export default {
  extends: DefaultTheme,
  Layout: () => {
    const { frontmatter } = useData()

    if (frontmatter.value.layout === 'home') {
      return h(DefaultTheme.Layout, null, {
        'home-hero-before': () => h(HomePage),
      })
    }

    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  },
}
