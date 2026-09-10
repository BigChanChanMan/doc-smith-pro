# 文匠 DocSmith

> 用 JSON 写文档，像匠人打磨纸张一样生成 PDF。
> pdfcn + Takumi WASM + TanStack Start · 无浏览器进程 · 中文可选中 · 日百万页级渲染

线上地址：https://pil6gjozz.zhaomi.cn/

## 五个页面

| 路由 | 内容 |
|------|------|
| `/` | 管线总览 + 7 大场景入口 |
| `/playground` | JSON → PDF 实时调试台（编辑 / 渲染 / 预览 / 下载） |
| `/gallery` | 20 种 DSL 节点样例，点开 JSON 即学即渲 |
| `/themes` | 9 套主题 × 同一内容，服务端批量真实渲染对比 |
| `/learn` | 快速开始 + 节点手册 + 服务端集成指南 |

## 7 大场景预设

🧾 中文发票（QR 验真+水印+圆环图） · 📈 财务季报（多图表+书签） · 🏅 结业证书（横版单页） · 🧾 热敏小票（302px） · 📄 简历 · 📜 服务合同（多页+留白签章） · 📖 组件速查手册

## 文档

- [docs/项目架构.md](docs/项目架构.md) — 技术栈 / 渲染管线 / 目录结构 / 踩坑记录
- [docs/组件手册.md](docs/组件手册.md) — 20 种 DSL 节点与 pdfcn 组件对照

## 运行

```bash
NODE_ENV=development npm i --include=dev
npx vite dev --port 3000     # 开发
npx vite build               # 构建
PORT=5177 node scripts/prod-server.mjs   # 生产
```
