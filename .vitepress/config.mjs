import { defineConfig } from 'vitepress'
import sidebar from "../utils/sidebar.mjs";
import { set_sidebar } from "../utils/auto_sidebar.mjs";
// https://vitepress.dev/reference/site-config
export default defineConfig({
  outDir: './dist',
  head:[["link", { rel: "icon", href: "/logo.svg" }]],
  title: "KRABBY Personal Blogs",
  description: "A VitePress Site",
  search: {
    provider: 'local'
  },
  lastUpdated: {
      text: '文章最后更新于',
      formatOptions: {
          dateStyle: 'full',
          timeStyle: 'medium'
      }
  },
  markdown: {
    image: {
        // 图片懒加载
        lazyLoading: true
    }
  },
  navbar: true,
  themeConfig: {
    docFooter: { prev: '上一篇', next: '下一篇' },
    logo: '/logo.svg',
    outlineTitle:'文章目录',
    outline:[2,6],
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '前端',   items: [  //启用items即为展示下拉框
          { text: 'HTML', link: '/frontEnd/html/' },
          { text: 'CSS', link: '/frontEnd/css/' },
          { text: 'JavaScript', link: '/frontEnd/js/' },
          { text: 'TypeScript', link: '/frontEnd/ts/' },
          { text: 'Vue', link: '/frontEnd/vue/' },
          { text: '浏览器与网络', link: '/frontEnd/network/' },
          { text: '组件', link: '/frontEnd/components/' },
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
      { icon:
          {svg:'<svg t="1734938464093" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4274" width="280" height="280"><path d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667" fill="#231F20" p-id="4275"></path></svg>'},
          link: 'https://github.com/vuejs/vitepress'
      },
        {
            icon:{
                svg:"<svg t=\"1734941351294\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"7349\" width=\"200\" height=\"200\"><path d=\"M849.92 51.2H174.08c-67.8656 0-122.88 55.0144-122.88 122.88v675.84c0 67.8656 55.0144 122.88 122.88 122.88h675.84c67.8656 0 122.88-55.0144 122.88-122.88V174.08c0-67.8656-55.0144-122.88-122.88-122.88zM448.18432 230.94272c176.98304-53.95968 267.17696 110.98624 267.17696 110.98624-32.59392-17.78176-130.39104-37.53472-235.09504 16.7936s-126.4384 172.87168-126.4384 172.87168c-42.56256-45.4144-44.4928-118.6304-44.4928-118.6304 5.03296-137.41568 138.84928-182.02112 138.84928-182.02112zM393.50784 796.42112c-256.12288-49.6384-197.85216-273.38752-133.81632-371.95264 0 0-2.88256 138.13248 130.22208 214.4 0 0 15.82592 7.1936 10.79296 30.21312l-5.03808 29.49632s-6.656 20.1472 6.02624 22.30272c0 0 4.04992 0 13.39904-6.4768l48.92672-32.37376s10.07104-7.1936 23.01952-5.03808c12.94848 2.16064 95.68768 23.74656 177.70496-44.60032-0.00512 0-15.10912 213.67296-271.23712 164.02944z m256.8448-19.42016c16.54784-7.9104 97.1264-102.8864 58.98752-231.66464s-167.6288-157.55776-167.6288-157.55776c66.19136-28.0576 143.89248-7.19872 143.89248-7.19872 117.9904 34.5344 131.6608 146.77504 131.6608 146.77504 23.01952 200.71936-166.912 249.64608-166.912 249.64608z\" fill=\"#01CC7A\" p-id=\"7350\"></path></svg>"
            },
            title:"微信公众号",
            link:"./qrcode.png"
        }

    ],
    footer:{
      copyright:'Copyright @ 2024 KRABBY'
    },
    // sidebar: {
    //     "/DevOps/linux": set_sidebar("DevOps/linux"),
    //     "/DevOps/docker": set_sidebar("DevOps/docker"),
    //     "/frontEnd/html": set_sidebar("frontEnd/html"),
    //     "/frontEnd/js": set_sidebar("frontEnd/js"),
    //     "/frontEnd/ts": set_sidebar("frontEnd/ts"),
    // },
        sidebar:sidebar,
      // aside:"left",

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
