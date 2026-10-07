import { defineConfig } from 'vitepress'
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sidebar from "../utils/sidebar.mjs";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// 统计正文字数（中文字符 + 英文单词），按每分钟约 320 字估算阅读时长
function getReadingStats(markdown) {
  const text = markdown
    .replace(/^---[\s\S]*?---/, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*`|\-[\]()!.]/g, " ");
  const cjk = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const latinWords = (text.match(/[a-zA-Z0-9_'-]+/g) || []).length;
  const words = cjk + latinWords;
  return { words, minutes: Math.max(1, Math.round(words / 320)) };
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  lang: 'zh-CN',
  // 暗色主题尚未适配自定义配色，先关闭切换，避免半亮半暗的撕裂效果
  appearance: false,
  outDir: './dist',
  head:[["link", { rel: "icon", href: "/logo.svg" }]],
  title: "KRABBY Personal Blogs",
  description: "KRABBY 的个人技术博客：前端、DevOps 与面试题的结构化笔记",
  transformPageData(pageData) {
    if (pageData.frontmatter.layout === "home") return;
    const file = path.resolve(dirname, "..", pageData.relativePath);
    if (!file.endsWith(".md") || !fs.existsSync(file)) return;
    const stats = getReadingStats(fs.readFileSync(file, "utf-8"));
    pageData.frontmatter.wordCount = stats.words;
    pageData.frontmatter.readingTime = stats.minutes;
  },
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
          { text: 'JavaScript', link: '/frontEnd/js/' },
        ]
      },
      { text: 'DevOps', items: [
          { text: 'Linux', link: '/DevOps/linux/' },
          { text: 'Docker', link: '/DevOps/docker/' },
        ]
      },
      { text: '面试题', link: '/exam/interview/' },
    ],

    socialLinks: [
      { icon:
          {svg:'<svg t="1734938464093" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4274" width="280" height="280"><path d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667" fill="#231F20" p-id="4275"></path></svg>'},
          link: 'https://github.com/kkippy/Blog'
      },
    ],
    footer:{
      copyright:'Copyright © 2024-2026 KRABBY'
    },
    sidebar:sidebar,

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
