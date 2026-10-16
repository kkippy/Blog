#!/usr/bin/env node
// 把 Notion 数据库里「已发布」的页面同步成博客 Markdown。
// 用法：npm run notion:sync -- [--dry-run] [--only <pageId>] [--force]
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { Client, APIResponseError } from '@notionhq/client'
import { NotionToMarkdown } from 'notion-to-md'
import config from './notion-sync.config.mjs'
import { orderFiles } from '../utils/sidebar.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const NOTION_VERSION = '2025-09-03'
const LEGACY_NOTION_VERSION = '2022-06-28'
const SYNC_KEYS = ['title', 'notion_id', 'notion_last_edited', 'notion_hash']

// ---------- 通用工具 ----------

const toPosix = (p) => p.split(path.sep).join('/')
const relFromRoot = (abs) => toPosix(path.relative(root, abs))
const plain = (richText) => (richText || []).map((t) => t.plain_text).join('')
const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex')
const normalizeBody = (s) => s.replace(/\r\n/g, '\n').replace(/\s+$/, '')
const yamlQuote = (s) => `'${String(s).replace(/[\r\n]+/g, ' ').replace(/'/g, "''")}'`
const laterOf = (a, b) => (new Date(a) >= new Date(b) ? a : b)
const sameTime = (a, b) => !!a && !!b && new Date(a).getTime() === new Date(b).getTime()

function normalizeId(s) {
  const m = String(s || '').replace(/-/g, '').match(/[0-9a-f]{32}/i)
  return m ? m[0].toLowerCase() : null
}

// 只输出状态码 / 错误码 / 说明，绝不带请求头或令牌
function safeError(e) {
  if (e instanceof APIResponseError) return `Notion API ${e.status} ${e.code}: ${e.message}`
  if (e?.name === 'TimeoutError' || e?.code === 'notionhq_client_request_timeout') return '请求超时'
  return e?.message || String(e)
}

function parseArgs(argv) {
  const opts = { dryRun: false, force: false, only: null }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--dry-run') opts.dryRun = true
    else if (a === '--force') opts.force = true
    else if (a === '--only' || a.startsWith('--only=')) {
      const v = a === '--only' ? argv[++i] : a.slice('--only='.length)
      opts.only = normalizeId(v)
      if (!opts.only) throw new Error('--only 需要一个 Notion 页面 id 或链接')
    } else throw new Error(`未知参数：${a}`)
  }
  return opts
}

function loadToken() {
  if (!process.env.NOTION_TOKEN) {
    const envFile = path.join(root, '.env.local')
    if (fs.existsSync(envFile)) process.loadEnvFile(envFile)
  }
  return process.env.NOTION_TOKEN
}

// ---------- 本地文件 ----------

function readMarkdown(abs) {
  const raw = fs.readFileSync(abs, 'utf-8')
  const text = raw.replace(/\r\n/g, '\n')
  const m = text.match(/^---\n([\s\S]*?)\n?---[ \t]*(?:\n|$)/)
  return {
    raw,
    eol: raw.includes('\r\n') ? '\r\n' : '\n',
    fm: m ? m[1] : null,
    body: m ? text.slice(m[0].length) : text,
  }
}

function fmValue(fm, key) {
  const m = fm?.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'))
  if (!m) return undefined
  const v = m[1].trim()
  if (v.startsWith("'") && v.endsWith("'") && v.length >= 2) return v.slice(1, -1).replace(/''/g, "'")
  if (v.startsWith('"') && v.endsWith('"') && v.length >= 2) {
    try { return JSON.parse(v) } catch { return v.slice(1, -1) }
  }
  return v
}

function walkMarkdown(dirAbs, out = []) {
  if (!fs.existsSync(dirAbs)) return out
  for (const entry of fs.readdirSync(dirAbs, { withFileTypes: true })) {
    const abs = path.join(dirAbs, entry.name)
    if (entry.isDirectory()) walkMarkdown(abs, out)
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(abs)
  }
  return out
}

function buildLocalIndex(notes) {
  const byId = new Map()
  for (const dir of config.contentDirs) {
    for (const abs of walkMarkdown(path.join(root, dir))) {
      const id = normalizeId(fmValue(readMarkdown(abs).fm, 'notion_id'))
      if (!id) continue
      if (!byId.has(id)) byId.set(id, [])
      byId.get(id).push(abs)
    }
  }
  for (const [id, files] of byId) {
    if (files.length > 1) notes.push(`notion_id ${id} 出现在多个文件里：${files.map(relFromRoot).join('、')}，该页面不会同步`)
  }
  return byId
}

function sanitizeFileName(title) {
  let s = title
    .normalize('NFC')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    // ' # % 会破坏侧边栏正则或页面链接，一并去掉
    .replace(/[/\\:*?"<>|'#%]/g, '')
    .replace(/\.{2,}/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[.\s]+/, '')
  s = [...s].slice(0, config.maxFileNameLength).join('').replace(/[.\s]+$/, '')
  if (!s || s.toLowerCase() === 'index') return null
  return s
}

function resolveArticlePath(dirRel, name) {
  if (!Object.values(config.categories).includes(dirRel)) throw new Error(`目录 ${dirRel} 不在白名单里`)
  const dirAbs = path.resolve(root, dirRel)
  const abs = path.resolve(dirAbs, `${name}.md`)
  if (path.dirname(abs) !== dirAbs || !abs.startsWith(root + path.sep)) throw new Error(`拼出的路径越界：${name}`)
  return abs
}

function resolveAssetDir(pageId) {
  const base = path.resolve(root, config.assetsDir)
  const abs = path.resolve(base, pageId)
  if (path.dirname(abs) !== base || !/^[0-9a-f]{32}$/.test(pageId)) throw new Error(`图片目录越界：${pageId}`)
  return abs
}

const protectedSet = new Set(config.protected.map((p) => toPosix(path.normalize(p))))
const isProtected = (abs) => protectedSet.has(relFromRoot(abs))
const docLink = (abs) => '/' + relFromRoot(abs).replace(/\.md$/, '')

function linkBlock(key, text, link) {
  return [`${key}:`, `  text: ${yamlQuote(text)}`, `  link: ${yamlQuote(link)}`]
}

// 目录里侧边栏顺序的最后一篇，排序规则与 utils/sidebar.mjs 完全一致
function findChainTail(dirAbs) {
  if (!fs.existsSync(dirAbs)) return null
  const dirRel = relFromRoot(dirAbs)
  const files = fs
    .readdirSync(dirAbs, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
    .filter((e) => e.isFile() && e.name.endsWith('.md') && e.name !== 'index.md')
    .map((e) => ({ name: e.name, text: e.name.replace(/\.md$/, ''), link: `/${dirRel}/${e.name.replace(/\.md$/, '')}` }))
  const ordered = orderFiles(dirAbs, files)
  if (!ordered.length) return null
  const last = ordered[ordered.length - 1]
  return { abs: path.join(dirAbs, last.name), text: last.text }
}

// 只替换（或补上）next 这一段，文件其余内容原样保留
function setNextLink(abs, text, link) {
  const { raw, eol } = readMarkdown(abs)
  const lines = raw.replace(/\r\n/g, '\n').split('\n')
  const block = linkBlock('next', text, link)
  let out
  if (lines[0] !== '---' || lines.indexOf('---', 1) === -1) {
    out = ['---', ...block, '---', '', ...lines]
  } else {
    const end = lines.indexOf('---', 1)
    const start = lines.slice(1, end).findIndex((l) => /^next:/.test(l))
    if (start === -1) {
      out = [...lines.slice(0, end), ...block, ...lines.slice(end)]
    } else {
      const i = start + 1
      let j = i + 1
      while (j < end && /^\s+(text|link):/.test(lines[j])) j++
      out = [...lines.slice(0, i), ...block, ...lines.slice(j)]
    }
  }
  fs.writeFileSync(abs, out.join(eol))
}

function buildFrontmatter(existingFm, values, extraLines = []) {
  const keep = (existingFm ? existingFm.split('\n') : []).filter(
    (l) => !SYNC_KEYS.some((k) => l.startsWith(`${k}:`))
  )
  while (keep.length && !keep[0].trim()) keep.shift()
  const head = SYNC_KEYS.map((k) => `${k}: ${yamlQuote(values[k])}`)
  return ['---', ...head, ...extraLines, ...keep, '---'].join('\n')
}

// ---------- Notion 读取 ----------

async function collect(fetchPage) {
  const out = []
  let cursor
  do {
    const res = await fetchPage(cursor)
    out.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return out
}

async function fetchDatabasePages(notion, token) {
  const id = config.databaseId
  let sources = null
  try {
    const db = await notion.databases.retrieve({ database_id: id })
    if (Array.isArray(db.data_sources) && db.data_sources.length) sources = db.data_sources.map((s) => s.id)
    else {
      // 旧版 API 结构：数据库本身就能查询
      const legacy = new Client({ auth: token, notionVersion: LEGACY_NOTION_VERSION, logger: () => {} })
      return collect((cursor) =>
        legacy.request({ path: `databases/${id}/query`, method: 'post', body: { page_size: 100, start_cursor: cursor } })
      )
    }
  } catch (e) {
    if (!(e instanceof APIResponseError) || e.code !== 'object_not_found') throw e
    // 配置的 id 也可能直接是 data source
    try {
      await notion.dataSources.retrieve({ data_source_id: id })
      sources = [id]
    } catch (e2) {
      if (e2 instanceof APIResponseError && e2.code === 'object_not_found') {
        throw new Error(
          `找不到数据库 ${id}。通常是集成没有加进这个数据库的「连接」：在 Notion 打开数据库 → 右上角 ··· → 连接 → 添加你的集成。`
        )
      }
      throw e2
    }
  }
  const pages = []
  for (const sourceId of sources) {
    pages.push(
      ...(await collect((cursor) =>
        notion.dataSources.query({ data_source_id: sourceId, page_size: 100, start_cursor: cursor })
      ))
    )
  }
  return pages
}

function readPage(page) {
  const props = page.properties || {}
  const titleProp = Object.values(props).find((p) => p.type === 'title')
  const select = (name) => {
    const p = props[name]
    if (p?.type === 'select') return p.select?.name ?? null
    if (p?.type === 'status') return p.status?.name ?? null
    return null
  }
  return {
    id: normalizeId(page.id),
    rawId: page.id,
    title: plain(titleProp?.title).trim(),
    category: select(config.properties.category),
    status: select(config.properties.status),
    lastEdited: page.last_edited_time,
    archived: !!(page.archived || page.in_trash),
  }
}

// 外层页面正文只有一个子页面 / 页面链接时，把那个页面当作正文来源
async function resolveSource(notion, page) {
  const blocks = await collect((cursor) =>
    notion.blocks.children.list({ block_id: page.rawId, page_size: 100, start_cursor: cursor })
  )
  const meaningful = blocks.filter(
    (b) => !(b.type === 'paragraph' && !plain(b.paragraph.rich_text).trim() && !b.has_children)
  )
  let target = null
  if (meaningful.length === 1) {
    const b = meaningful[0]
    if (b.type === 'child_page') target = b.id
    else if (b.type === 'link_to_page' && b.link_to_page.type === 'page_id') target = b.link_to_page.page_id
    else if (b.type === 'paragraph' && !b.has_children) {
      const parts = b.paragraph.rich_text.filter((t) => t.plain_text.trim())
      if (parts.length === 1 && parts[0].type === 'mention' && parts[0].mention.type === 'page') {
        target = parts[0].mention.page.id
      }
    }
  }
  if (!target) return { blockId: page.rawId, lastEdited: page.lastEdited, expandedFrom: null }
  const child = await notion.pages.retrieve({ page_id: target })
  const childTitle = plain(Object.values(child.properties || {}).find((p) => p.type === 'title')?.title)
  return {
    blockId: target,
    lastEdited: laterOf(page.lastEdited, child.last_edited_time),
    expandedFrom: childTitle || target,
  }
}

// ---------- Markdown 转换 ----------

// VitePress 会把 Markdown 当 Vue 模板编译，普通文本里的 < > {{ 必须转义
function escapeText(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{\{/g, '<span v-pre>{{</span>')
}

// Notion 段落里的软换行（Shift+Enter）在 Markdown 里会被合并成一行
const SOFT_BREAK_BLOCKS = new Set(['paragraph', 'bulleted_list_item', 'numbered_list_item', 'to_do', 'quote', 'callout'])

function escapeRichText(t, softBreak = false) {
  if (t.type === 'equation' || t.annotations?.code) return
  const fix = (s) => {
    const escaped = escapeText(s)
    return softBreak ? escaped.replace(/\n/g, '<br>\n') : escaped
  }
  t.plain_text = fix(t.plain_text)
  if (t.type === 'text' && t.text) t.text.content = fix(t.text.content)
}

function escapeBlock(block) {
  if (block.type === 'code' || block.type === 'equation') return
  const data = block[block.type]
  if (!data) return
  if (Array.isArray(data.rich_text)) data.rich_text.forEach((t) => escapeRichText(t, SOFT_BREAK_BLOCKS.has(block.type)))
  if (Array.isArray(data.caption)) data.caption.forEach((t) => escapeRichText(t))
  if (block.type === 'table_row') data.cells.forEach((cell) => cell.forEach(escapeRichText))
}

function tidyMarkdown(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const out = []
  let inFence = false
  let blank = 0
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    if (/^\s*```/.test(line)) inFence = !inFence
    if (!inFence) {
      // 段落末尾的软换行会留下孤立或悬空的 <br>
      if (line.trim() === '<br>') line = ''
      else if (line.endsWith('<br>') && !(lines[i + 1] ?? '').replace('<br>', '').trim()) line = line.slice(0, -4)
    }
    if (!inFence && !line.trim()) {
      if (++blank > 1) continue
    } else blank = 0
    out.push(inFence ? line : line.replace(/\s+$/, ''))
  }
  return out.join('\n').trim()
}

function sniffImage(buf) {
  const hex = buf.subarray(0, 12).toString('hex')
  if (hex.startsWith('89504e47')) return 'png'
  if (hex.startsWith('ffd8ff')) return 'jpg'
  if (hex.startsWith('47494638')) return 'gif'
  if (hex.startsWith('52494646') && buf.subarray(8, 12).toString() === 'WEBP') return 'webp'
  if (buf.subarray(4, 12).toString().startsWith('ftypavi')) return 'avif'
  return null
}

async function downloadImage(url, n, ctx) {
  const fail = (why) => {
    ctx.warnings.push(`第 ${n} 张图片未下载：${why}`)
    return null
  }
  let res
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  } catch (e) {
    return fail(e?.name === 'TimeoutError' ? '下载超时' : '网络错误')
  }
  if (!res.ok) return fail(`HTTP ${res.status}`)
  const max = config.image.maxBytes
  if (Number(res.headers.get('content-length')) > max) return fail(`超过 ${max / 1024 / 1024} MB`)
  const chunks = []
  let total = 0
  for await (const chunk of res.body) {
    total += chunk.length
    if (total > max) return fail(`超过 ${max / 1024 / 1024} MB`)
    chunks.push(chunk)
  }
  const buf = Buffer.concat(chunks)
  const type = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
  const ext = sniffImage(buf)
  const allowed = new Set(Object.values(config.image.contentTypes))
  if (!ext || !allowed.has(ext)) return fail(`不支持的图片格式（${type || '未知类型'}）`)
  fs.mkdirSync(ctx.stagingDir, { recursive: true })
  const fileName = `${n}.${ext}`
  fs.writeFileSync(path.join(ctx.stagingDir, fileName), buf)
  return toPosix(path.relative(path.dirname(ctx.fileAbs), path.join(ctx.assetDir, fileName)))
}

function createConverter(notion, ctx) {
  const client = {
    blocks: {
      children: {
        list: async (args) => {
          const res = await notion.blocks.children.list(args)
          res.results.forEach(escapeBlock)
          return res
        },
      },
    },
  }
  const n2m = new NotionToMarkdown({ notionClient: client, config: { parseChildPages: true, separateChildPage: false } })
  const renderChildren = async (blockId) => tidyMarkdown(n2m.toMarkdownString(await n2m.pageToMarkdown(blockId)).parent ?? '')
  const renderInline = (richText) =>
    n2m.blockToMarkdown({ type: 'paragraph', paragraph: { rich_text: richText, color: 'default' } })

  const skipPage = (kind) => (block) => {
    ctx.warnings.push(`跳过${kind}「${block[block.type]?.title || block.id}」`)
    return ''
  }
  n2m.setCustomTransformer('child_page', skipPage('子页面'))
  n2m.setCustomTransformer('child_database', skipPage('内嵌数据库'))

  n2m.setCustomTransformer('callout', async (block) => {
    const text = await renderInline(block.callout.rich_text)
    const children = block.has_children ? await renderChildren(block.id) : ''
    return `::: tip\n${[text, children].filter((s) => s.trim()).join('\n\n')}\n:::`
  })

  n2m.setCustomTransformer('toggle', async (block) => {
    const summary = plain(block.toggle.rich_text).trim() || '展开'
    const children = block.has_children ? await renderChildren(block.id) : ''
    return `<details>\n<summary>${summary}</summary>\n\n${children}\n\n</details>`
  })

  // 段落下的子块在 Markdown 里没有对应的缩进语义，缩进反而会变成代码块，所以平铺输出
  n2m.setCustomTransformer('paragraph', async (block) => {
    if (!block.has_children) return false
    const text = await renderInline(block.paragraph.rich_text)
    return [text, await renderChildren(block.id)].filter((s) => s.trim()).join('\n\n')
  })

  for (const level of [1, 2, 3]) {
    const type = `heading_${level}`
    n2m.setCustomTransformer(type, async (block) => {
      if (!block[type].is_toggleable || !block.has_children) return false
      const text = await renderInline(block[type].rich_text)
      return `${'#'.repeat(level)} ${text}\n\n${await renderChildren(block.id)}`
    })
  }

  n2m.setCustomTransformer('image', async (block) => {
    const img = block.image
    const alt = plain(img.caption).replace(/[[\]\n]/g, ' ').trim()
    if (img.type === 'external') return `![${alt}](${img.external.url.replace(/ /g, '%20')})`
    if (img.type !== 'file') {
      ctx.warnings.push(`跳过不支持的图片类型：${img.type}`)
      return ''
    }
    const n = ++ctx.imageCount
    if (ctx.dryRun) return `![${alt}](notion-image-${n})`
    const rel = await downloadImage(img.file.url, n, ctx)
    return rel ? `![${alt}](${rel})` : ''
  })

  return { render: renderChildren }
}

// ---------- 单页同步 ----------

async function syncPage(notion, page, localIndex, opts) {
  const result = { title: page.title || '(无标题)', id: page.id, file: null, warnings: [] }
  const skip = (reason) => Object.assign(result, { status: 'skipped', reason })

  if (page.status !== config.publishedStatus) return skip(`状态为「${page.status ?? '空'}」，只同步「${config.publishedStatus}」`)
  if (!page.title) return skip('缺少标题')
  const dirRel = config.categories[page.category]
  if (!dirRel) return skip(page.category ? `栏目「${page.category}」没有对应目录` : '缺少栏目')

  const existing = localIndex.get(page.id)
  if (existing && existing.length > 1) return skip('本地有多个文件使用同一个 notion_id')

  let fileAbs
  let local = null
  if (existing) {
    fileAbs = existing[0]
    local = readMarkdown(fileAbs)
    result.file = relFromRoot(fileAbs)
    if (isProtected(fileAbs)) return skip('在保护名单里')
    if (String(fmValue(local.fm, 'notion_sync')) === 'false') return skip('frontmatter 设置了 notion_sync: false')
    if (path.dirname(relFromRoot(fileAbs)) !== dirRel) {
      result.warnings.push(`Notion 栏目对应 ${dirRel}，本地文件保留在原路径`)
    }
  } else {
    const name = sanitizeFileName(page.title)
    if (!name) return skip('标题净化后为空，无法作为文件名')
    fileAbs = resolveArticlePath(dirRel, name)
    result.file = relFromRoot(fileAbs)
    if (isProtected(fileAbs)) return skip('目标文件在保护名单里')
    if (fs.existsSync(fileAbs)) return skip('目标文件已存在且没有对应的 notion_id（与手写文章重名）')
  }

  const source = await resolveSource(notion, page)
  if (source.expandedFrom) result.warnings.push(`正文只有一个子页面，已展开「${source.expandedFrom}」作为正文`)

  if (local) {
    const unchanged = sameTime(fmValue(local.fm, 'notion_last_edited'), source.lastEdited)
    const localHash = sha256(normalizeBody(local.body))
    const modified = fmValue(local.fm, 'notion_hash') !== localHash
    if (modified) result.warnings.push('本地正文和上次同步时不一致（同步后本地改过）')
    if (unchanged && !opts.force) return Object.assign(result, { status: 'unchanged' })
    if (modified && !opts.force) return skip('同步后本地改过正文（哈希不一致），用 --force 覆盖')
  }

  const assetDir = resolveAssetDir(page.id)
  const ctx = {
    dryRun: opts.dryRun,
    fileAbs,
    assetDir,
    stagingDir: `${assetDir}.tmp`,
    imageCount: 0,
    warnings: result.warnings,
  }
  if (!opts.dryRun) fs.rmSync(ctx.stagingDir, { recursive: true, force: true })
  let markdown
  try {
    markdown = await createConverter(notion, ctx).render(source.blockId)
  } catch (e) {
    fs.rmSync(ctx.stagingDir, { recursive: true, force: true })
    throw e
  }
  const body = `# ${escapeText(page.title)}\n\n${markdown}\n`
  const values = {
    title: page.title,
    notion_id: page.id,
    notion_last_edited: source.lastEdited,
    notion_hash: sha256(normalizeBody(body)),
  }
  if (ctx.imageCount) result.warnings.push(`Notion 图片 ${ctx.imageCount} 张`)
  const notionLinks = markdown.match(/\]\(https?:\/\/(?:www\.|app\.)?notion\.(?:so|com)\//g)
  if (notionLinks) result.warnings.push(`正文里有 ${notionLinks.length} 处 Notion 内部链接，发布后读者可能打不开`)

  let chain = []
  let tail = null
  if (!local) {
    tail = findChainTail(path.dirname(fileAbs))
    const prev = tail
      ? { text: tail.text, link: docLink(tail.abs) }
      : { text: '章节介绍', link: `/${dirRel}/index` }
    chain = linkBlock('prev', prev.text, prev.link)
    if (tail && (isProtected(tail.abs) || String(fmValue(readMarkdown(tail.abs).fm, 'notion_sync')) === 'false')) {
      result.warnings.push(`上一篇 ${relFromRoot(tail.abs)} 受保护，没有修改它的 next，侧边栏会按拼音排序`)
      tail = null
    } else if (tail) {
      result.warnings.push(`${opts.dryRun ? '将把' : '已把'} ${relFromRoot(tail.abs)} 的 next 指向本文`)
    }
  }

  result.status = local ? 'updated' : 'created'
  if (opts.dryRun) return result

  const content = `${buildFrontmatter(local?.fm, values, chain)}\n\n${body}`
  fs.rmSync(assetDir, { recursive: true, force: true })
  if (fs.existsSync(ctx.stagingDir)) fs.renameSync(ctx.stagingDir, assetDir)
  fs.writeFileSync(fileAbs, content)
  if (tail) setNextLink(tail.abs, path.basename(fileAbs, '.md'), docLink(fileAbs))
  return result
}

// ---------- 报告 ----------

const LABELS = {
  created: ['新增', '将新增'],
  updated: ['更新', '将更新'],
  unchanged: ['未变化', '未变化'],
  skipped: ['跳过', '跳过'],
  failed: ['失败', '失败'],
}

function printReport(results, notes, opts) {
  console.log(`\nNotion 同步报告${opts.dryRun ? '（dry-run，未写入任何文件）' : ''}`)
  for (const status of Object.keys(LABELS)) {
    const group = results.filter((r) => r.status === status)
    if (!group.length) continue
    console.log(`\n【${LABELS[status][opts.dryRun ? 1 : 0]}】${group.length}`)
    for (const r of group) {
      console.log(`  - ${r.title}（${r.id}）${r.file ? ` → ${r.file}` : ''}${r.reason ? `：${r.reason}` : ''}`)
      for (const w of r.warnings) console.log(`      · ${w}`)
    }
  }
  if (notes.length) {
    console.log('\n【提示】')
    for (const n of notes) console.log(`  - ${n}`)
  }
}

// ---------- 入口 ----------

async function main() {
  const opts = parseArgs(process.argv.slice(2))
  const token = loadToken()
  if (!token) throw new Error('没有找到 NOTION_TOKEN，请设置环境变量或写进 .env.local')
  const notion = new Client({ auth: token, notionVersion: NOTION_VERSION, logger: () => {} })

  const notes = []
  const localIndex = buildLocalIndex(notes)
  const pages = (await fetchDatabasePages(notion, token)).filter((p) => p.object === 'page').map(readPage)

  let targets = pages
  if (opts.only) {
    targets = pages.filter((p) => p.id === opts.only)
    if (!targets.length) throw new Error(`数据库里没有页面 ${opts.only}`)
  } else {
    const remote = new Map(pages.map((p) => [p.id, p]))
    for (const [id, files] of localIndex) {
      const p = remote.get(id)
      if (!p || p.archived) notes.push(`${files.map(relFromRoot).join('、')}：Notion 中已删除或归档，本地文件保留`)
      else if (p.status !== config.publishedStatus) notes.push(`${files.map(relFromRoot).join('、')}：Notion 中已不是「${config.publishedStatus}」，本地文件保留`)
    }
  }

  const results = []
  for (const page of targets) {
    if (page.archived) continue
    try {
      results.push(await syncPage(notion, page, localIndex, opts))
    } catch (e) {
      results.push({ title: page.title || '(无标题)', id: page.id, status: 'failed', reason: safeError(e), warnings: [] })
    }
  }

  printReport(results, notes, opts)
  if (results.some((r) => r.status === 'failed')) process.exitCode = 1
}

main().catch((e) => {
  console.error(`同步中止：${safeError(e)}`)
  process.exitCode = 1
})
