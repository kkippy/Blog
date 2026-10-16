export default {
  databaseId: '3fafd69d419480eb93b0d72da2d4869b',

  properties: {
    category: '栏目',
    status: '状态',
  },
  publishedStatus: '已发布',

  // 栏目选项 → 内容目录（相对仓库根目录）
  categories: {
    HTML: 'frontEnd/html',
    JavaScript: 'frontEnd/js',
    Vue: 'frontEnd/vue',
    React: 'frontEnd/react',
    Linux: 'DevOps/linux',
    Docker: 'DevOps/docker',
    面试题: 'exam/interview',
  },

  // 扫描 notion_id 的内容根目录，与 utils/sidebar.mjs 的 CONTENT_DIRS 保持一致
  contentDirs: ['frontEnd', 'DevOps', 'exam'],

  // 同步脚本永远不写这些文件（包括接链时修改 next）
  protected: ['exam/interview/Promise面试题.md'],

  assetsDir: 'assets/notion',
  image: {
    maxBytes: 10 * 1024 * 1024,
    contentTypes: {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/avif': 'avif',
    },
  },

  maxFileNameLength: 80,
}
