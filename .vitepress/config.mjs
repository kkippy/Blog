import { defineConfig } from 'vitepress'
import { set_sidebar } from "../utils/auto_sidebar.mjs";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  outDir: './dist',
  head:[["link", { rel: "icon", href: "/logo.svg" }]],
  title: "KRABBY Personal Blogs",
  description: "A VitePress Site",
  // navbar: true,
  themeConfig: {
    docFooter: { prev: '上一篇', next: '下一篇' },
    logo: '/logo.svg',
    outlineTitle:'文章目录',
    outline:[2,6],
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '前端',   items: [  //启用items即为展示下拉框
          { text: 'HTML', link: '/fontEnd/html/' },
          { text: 'CSS', link: '/fontEnd/css/' },
          { text: 'JavaScript', link: '/fontEnd/js/' },
          { text: 'TypeScript', link: '/fontEnd/ts/' },
          { text: 'Vue', link: '/fontEnd/vue/' },
          { text: '浏览器与网络', link: '/fontEnd/network/' },
          { text: '组件', link: '/fontEnd/components/' },
        ]
      },
      { text: 'DevOps', items: [
          { text: 'Linux', link: '/DevOps/linux/' },
          { text: 'Docker', link: '/DevOps/docker/' },
          { text: 'Nginx ', link: '/DevOps/nginx/' },
          { text: 'CI-CD ', link: '/DevOps/ci-cd/' },
        ]
      },
      { text: '笔面试', items: [
          { text: '笔试', link: '/exam/written/' },
          { text: '面试', link: '/exam/interview/' },
        ]
      },
      { text: '开发工具', items: [
          { text: 'Git', link: '/tool/git/' },
          { text: 'ApiFox', link: '/tool/apifox/' },
        ]
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer:{
      copyright:'Copyright @ 2024 KRABBY'
    },
    sidebar: { "/DevOps/linux": set_sidebar("DevOps/linux") },
    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换",
            },
          },
        },
      },
    },
  }
})
