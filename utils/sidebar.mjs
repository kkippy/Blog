import path from "node:path";
import fs from "node:fs";

function generateSidebar(dir, basePath = "") {
    let sidebar = [];
    const files = fs.readdirSync(dir, { withFileTypes: true });

    files.forEach((file) => {
        const fullPath = path.join(dir, file.name);
        const fullPathRelativeToDocs = path.relative("./", fullPath);

        if (file.isDirectory()) {
            // 如果是目录，递归处理 且下面没有 index.md 的情况

            const subdirBasePath = basePath ? `${basePath}/${file.name}` : file.name;
            const subdirSidebar = generateSidebar(fullPath, subdirBasePath);

            if (subdirSidebar.length > 0) {
                const obj = { text: file.name };
                obj.items = subdirSidebar;
                sidebar.push(obj);
            }
        } else if (file.name.endsWith(".md") && file.name !== "index.md") {
            // 如果是 Markdown 文件，添加到侧边栏
            // 使用 path.relative 来获取相对于 ./docs 的路径，并去除开头的 './'
            const relativePath = fullPathRelativeToDocs.startsWith(".") ? fullPathRelativeToDocs.slice(2) : fullPathRelativeToDocs;
            sidebar.push({
                text: file.name.replace(/\.md$/, ""),
                link: `/${relativePath.replace(/\\/g, "/").replace(/\.md$/, "")}`, // 将反斜杠替换为正斜杠
            });
        }
    });

    return sidebar;
}

const sidebarConfig = generateSidebar("./");
// console.log(JSON.stringify(sidebarConfig, null, 2));
let sidebar = {};
sidebarConfig.forEach((item) => {
    sidebar["/" + item.text + "/"] = item.items;
});
export default sidebar;

