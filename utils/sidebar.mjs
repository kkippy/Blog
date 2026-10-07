import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const docsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// 只扫描内容目录，避免把 node_modules、工具目录等扫进侧边栏
const CONTENT_DIRS = ["frontEnd", "DevOps", "exam"];

// 从 frontmatter 中读取 prev/next 链接，用于恢复作者在文章里声明的阅读顺序
function readFrontmatterLinks(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return { prev: null, next: null };
    const fm = match[1];
    const pick = (key) => {
        const m = fm.match(new RegExp(`^${key}:\\s*\\n\\s*text:[^\\n]*\\n\\s*link:\\s*'([^']+)'`, "m"));
        return m ? m[1] : null;
    };
    return { prev: pick("prev"), next: pick("next") };
}

// 同目录内按 prev/next 链排序；不在链上的文件按拼音/字母排在后面
function orderFiles(dir, files) {
    const byLink = new Map(files.map((f) => [f.link, f]));
    const nextMap = new Map();

    files.forEach((f) => {
        const { next } = readFrontmatterLinks(path.join(dir, f.name));
        if (next && byLink.has(next)) nextMap.set(f.link, next);
    });

    const isChainTarget = new Set(nextMap.values());
    const heads = files.filter((f) => !isChainTarget.has(f.link));

    const ordered = [];
    const visited = new Set();
    const walk = (start) => {
        let cur = start;
        while (cur && !visited.has(cur.link)) {
            visited.add(cur.link);
            ordered.push(cur);
            cur = byLink.get(nextMap.get(cur.link));
        }
    };
    heads.forEach(walk);
    files.forEach((f) => {
        if (!visited.has(f.link)) ordered.push(f);
    });
    return ordered;
}

function generateSidebar(dir, basePath = "") {
    let sidebar = [];
    const entries = fs
        .readdirSync(dir, { withFileTypes: true })
        // 按拼音/字母排序，保证不同机器上构建结果一致
        .sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));

    entries.forEach((entry) => {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            const subdirBasePath = basePath ? `${basePath}/${entry.name}` : entry.name;
            const subdirSidebar = generateSidebar(fullPath, subdirBasePath);
            if (subdirSidebar.length > 0) {
                sidebar.push({ text: entry.name, items: subdirSidebar });
            }
        }
    });

    const files = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md")
        .map((entry) => ({
            name: entry.name,
            text: entry.name.replace(/\.md$/, ""),
            link: `/${basePath}/${entry.name.replace(/\.md$/, "")}`,
        }));

    orderFiles(dir, files).forEach((f) => {
        sidebar.push({ text: f.text, link: f.link });
    });

    return sidebar;
}

const sidebar = {};
CONTENT_DIRS.forEach((dirName) => {
    const absDir = path.join(docsRoot, dirName);
    if (!fs.existsSync(absDir)) return;
    const items = generateSidebar(absDir, dirName);
    if (items.length > 0) {
        sidebar["/" + dirName + "/"] = items;
    }
});

export default sidebar;
