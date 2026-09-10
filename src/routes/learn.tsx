/**
 * 学习中心 — 快速开始 / DSL 节点手册 / 服务端集成
 */
import { createFileRoute } from "@tanstack/react-router";
import { Panel, Tag } from "@/components/site/kit";
import { SiteFrame } from "@/components/site/SiteFrame";

export const Route = createFileRoute("/learn")({
  component: LearnPage,
});

const NODE_TABLE: [string, string, string][] = [
  ["text", "Text", "正文：variant 七档字号 / weight / align / color / decoration"],
  ["heading", "Heading", "标题：level 1-6，自动生成 PDF 书签"],
  ["link", "Link", "可点击链接（PDF 注释）"],
  ["alert", "Alert", "提示框：info / success / warning / error"],
  ["badge", "Badge", "状态徽章：六色三档"],
  ["divider", "Divider", "分隔线：solid / dashed / dotted + 居中标签"],
  ["stack", "Stack", "纵向堆叠容器：gap / align"],
  ["section", "Section", "小节容器：标题 + 留白 + 边框变体"],
  ["card", "Card", "卡片：default / bordered / muted"],
  ["keep-together", "KeepTogether", "内部整体不分页（break-inside: avoid）"],
  ["key-value", "KeyValue", "键值列表：表单型字段展示"],
  ["data-table", "DataTable", "数据表：列定义 / 合计行 / 斑马纹"],
  ["list", "List", "列表：bullet / numbered / checklist / descriptive"],
  ["form", "Form", "打印留白表单：单列/双列/三列分组"],
  ["graph", "PdfGraph", "SVG 图表：bar / horizontal-bar / line / area / pie / donut"],
  ["image", "PdfImage", "图片：URL 或 data:，SVG 以矢量嵌入"],
  ["qrcode", "PdfQRCode", "二维码：value 驱动 + 可选说明文字"],
  ["signature", "PdfSignatureBlock", "签名块：单签 / 双签 / 行内"],
  ["watermark", "PdfWatermark", "水印：五方位斜排，页面级悬浮"],
  ["page-break", "PageBreak", "强制分页"],
];

function LearnPage() {
  return (
    <SiteFrame>
      <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px" }}>📖 学习中心</h1>
      <p style={{ color: "#6b675e", fontSize: 14, margin: "0 0 22px" }}>
        从 30 秒上手到服务端集成 —— 全部示例都可在 Playground 直接运行。
      </p>

      {/* 快速开始 */}
      <Panel style={{ padding: 20, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 12px" }}>⚡ 三步上手</h2>
        <ol style={{ lineHeight: 2, fontSize: 14, margin: 0, paddingLeft: 20 }}>
          <li>打开 <a href="/playground" style={{ color: "#c8371e", fontWeight: 700 }}>Playground</a>，选一个场景预设</li>
          <li>改左侧 JSON 里的任意文字 / 数据 / 颜色</li>
          <li>点「⚡ 渲染 PDF」—— 右侧立即出现矢量 PDF，可下载</li>
        </ol>
        <div style={{ marginTop: 14 }}>
          <Tag tone="green">提示</Tag>
          <span style={{ fontSize: 13, marginLeft: 8, color: "#6b675e" }}>
            19 种节点可自由嵌套，JSON 结构 = 最终 PDF 版面
          </span>
        </div>
      </Panel>

      {/* DSL 节点手册 */}
      <Panel style={{ padding: 20, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 12px" }}>🧩 DSL 节点手册（20 种）</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #1a1a1a", textAlign: "left" }}>
                <th style={{ padding: "8px 10px" }}>节点 type</th>
                <th style={{ padding: "8px 10px" }}>pdfcn 组件</th>
                <th style={{ padding: "8px 10px" }}>能力</th>
              </tr>
            </thead>
            <tbody>
              {NODE_TABLE.map(([t, c, d], i) => (
                <tr key={t} style={{ background: i % 2 ? "#f4efe3" : "transparent" }}>
                  <td style={{ padding: "7px 10px", fontFamily: "ui-monospace, monospace", fontWeight: 700 }}>{t}</td>
                  <td style={{ padding: "7px 10px", fontFamily: "ui-monospace, monospace", color: "#2d5a3d" }}>&lt;{c} /&gt;</td>
                  <td style={{ padding: "7px 10px", color: "#444" }}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      {/* 服务端集成 */}
      <Panel style={{ padding: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 900, margin: "0 0 12px" }}>🏗 架构与服务端集成</h2>
        <pre style={{ background: "#1a1a1a", color: "#d8e8d8", padding: 16, fontSize: 12, lineHeight: 1.7, overflowX: "auto", borderRadius: 4 }}>
{`JSON DocSpec ──zod 校验──▶ dslToReact() ──▶ pdfcn 组件树
                                              │
                                    Takumi WASM（无浏览器）
                                              │
                                    矢量 PDF（可选中/内嵌 CJK 字体）`}
        </pre>
        <p style={{ fontSize: 13.5, lineHeight: 1.9, color: "#444", margin: "14px 0 0" }}>
          <b>渲染核心</b>（<code>src/lib/pdf/server-renderer.ts</code>）：
          进程级 <code>PdfRenderer</code> 单例 + Noto CJK 字体启动时注册一次，后续每份文档毫秒级渲染。
          <br />
          <b>对外 API</b>（<code>src/lib/pdf/api.ts</code>）：
          <code>generatePdf</code> 是 TanStack Start server function —— 前端 <code>import</code> 直调，
          也可包装成 <code>POST /api/pdf</code> 供 Java/Python 系统调用，返回 base64 或 <code>application/pdf</code> 字节流。
          <br />
          <b>扩展方向</b>：模板市场（保存 DSL）、异步批量队列、PDF/A-3 电子发票归档（takumi 原生支持）。
        </p>
      </Panel>
    </SiteFrame>
  );
}
