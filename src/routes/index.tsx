import { createFileRoute } from "@tanstack/react-router";
import { PRESETS } from "@/lib/presets";
import { Panel, Tag } from "@/components/site/kit";
import { SiteFrame } from "@/components/site/SiteFrame";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <SiteFrame>
      {/* Hero */}
      <div style={{ textAlign: "center", padding: "42px 0 34px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.25em", color: "#c8371e", marginBottom: 14 }}>
          PDFCN · TAKUMI WASM · TANSTACK START
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 900, margin: "0 0 16px", letterSpacing: "0.04em" }}>
          文匠 <span style={{ color: "#c8371e" }}>DocSmith</span>
        </h1>
        <p style={{ fontSize: 17, color: "#6b675e", maxWidth: 640, margin: "0 auto 26px", lineHeight: 1.7 }}>
          用 <b>JSON</b> 写文档，像匠人打磨纸张一样生成 <b>PDF</b>。<br />
          无浏览器进程、无 Puppeteer —— 一台服务器、一份模板，日百万页。
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <a href="/playground" style={{ textDecoration: "none" }}>
            <BigBtn tone="accent">🛠 打开 Playground</BigBtn>
          </a>
          <a href="/learn" style={{ textDecoration: "none" }}>
            <BigBtn>📖 学习中心</BigBtn>
          </a>
        </div>
      </div>

      {/* 架构一览 */}
      <Panel style={{ padding: "18px 22px", marginBottom: 30, background: "#1a1a1a", color: "#f5f1e8" }}>
        <div style={{ fontFamily: "ui-monospace, monospace", fontSize: 13, lineHeight: 2, textAlign: "center" }}>
          <span style={{ color: "#4cc3ff" }}>JSON DocSpec</span>
          <span style={{ color: "#8a857a" }}> ──zod 校验──▶ </span>
          <span style={{ color: "#ffd166" }}>pdfcn React 组件树</span>
          <span style={{ color: "#8a857a" }}> ──▶ </span>
          <span style={{ color: "#ff8b66" }}>Takumi WASM</span>
          <span style={{ color: "#8a857a" }}> ──▶ </span>
          <span style={{ color: "#7ee0a3" }}>矢量 PDF</span>
          <div style={{ fontSize: 11.5, color: "#8a857a", marginTop: 4 }}>
            文字可选中 · CJK 字体内嵌 · 书签 / 水印 / 表单 / 二维码
          </div>
        </div>
      </Panel>

      {/* 场景预设卡 */}
      <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 6px" }}>七个真实场景</h2>
      <p style={{ color: "#6b675e", fontSize: 14, margin: "0 0 18px" }}>
        每个场景都是一份可直接渲染的 DocSpec JSON —— 在 Playground 里打开即可改数据看效果
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {PRESETS.map((p) => (
          <a key={p.id} href={`/playground?p=${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <Panel style={{ padding: 18, height: "100%", cursor: "pointer" }}>
              <div style={{ fontSize: 30, marginBottom: 8 }}>{p.emoji}</div>
              <div style={{ fontWeight: 900, fontSize: 16, marginBottom: 6 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: "#6b675e", lineHeight: 1.6, marginBottom: 12 }}>{p.desc}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.features.slice(0, 3).map((f) => (
                  <Tag key={f} tone="ink">{f}</Tag>
                ))}
                {p.features.length > 3 && <Tag tone="gold">+{p.features.length - 3}</Tag>}
              </div>
            </Panel>
          </a>
        ))}
      </div>

      {/* 站点导览 */}
      <h2 style={{ fontSize: 22, fontWeight: 900, margin: "34px 0 16px" }}>探索站点</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
        {[
          ["/playground", "🛠 Playground", "JSON → PDF 实时调试台，改一处立刻出新文档"],
          ["/gallery", "🧩 组件画廊", "24 个 pdfcn 组件逐一渲染样例 + 服务端实时出图"],
          ["/themes", "🎨 主题工作室", "9 套主题预设并排对比，同一份内容 9 种气质"],
          ["/learn", "📖 学习中心", "快速开始 + DSL 节点手册 + 服务端集成指南"],
        ].map(([href, title, desc]) => (
          <a key={href} href={href} style={{ textDecoration: "none", color: "inherit" }}>
            <Panel style={{ padding: 16, cursor: "pointer" }}>
              <div style={{ fontWeight: 900, fontSize: 15, marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 12.5, color: "#6b675e", lineHeight: 1.6 }}>{desc}</div>
            </Panel>
          </a>
        ))}
      </div>
    </SiteFrame>
  );
}

function BigBtn({ children, tone }: { children: React.ReactNode; tone?: "accent" }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "12px 26px",
        fontSize: 15,
        fontWeight: 800,
        background: tone === "accent" ? "#c8371e" : "#1a1a1a",
        color: "#fff",
        border: "2px solid #1a1a1a",
        boxShadow: "4px 4px 0 rgba(26,26,26,.9)",
        cursor: "pointer",
      }}
    >
      {children}
    </span>
  );
}
