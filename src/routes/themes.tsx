/**
 * 主题工作室 — 9 套主题同内容对比，服务端批量渲染真实 PDF
 */
import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { safeGeneratePdf } from "@/lib/pdf/api";
import { THEME_NAMES, type ThemeName } from "@/lib/pdf/dsl";
import { THEME_LIST } from "@/lib/pdf/theme-map";
import { Panel, Tag } from "@/components/site/kit";
import { SiteFrame } from "@/components/site/SiteFrame";

export const Route = createFileRoute("/themes")({
  component: ThemesPage,
});

/** 对比用内容片段（覆盖标题/正文/表格/徽章/提示） */
const DEMO_BODY = [
  { type: "heading", text: "云链科技季度简报", level: 1 },
  { type: "text", text: "同一段内容，九种主题气质 —— 主题决定排印尺度、色板与间距节奏。", color: "mutedForeground", variant: "sm" },
  { type: "badge", label: "2026 Q2", variant: "primary" },
  { type: "data-table", stripe: true, size: "compact", columns: [
    { key: "k", header: "指标" }, { key: "v", header: "数值", align: "right" },
  ], rows: [
    { k: "营业收入", v: "¥8,420 万" },
    { k: "毛利率", v: "61.8%" },
  ], footer: { k: "同比", v: "+23.6%" } },
  { type: "alert", variant: "info", text: "主题切换即整体换装，组件代码零改动。" },
] as const;

function ThemesPage() {
  return (
    <SiteFrame>
      <ThemesInner />
    </SiteFrame>
  );
}

function ThemesInner() {
  const [results, setResults] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(true);

  const renderAll = async () => {
    setBusy(true);
    for (const name of THEME_NAMES) {
      try {
        const r = await safeGeneratePdf({
          theme: name as ThemeName,
          metadata: { title: `主题样例 · ${name}`, lang: "zh-CN" },
          page: { size: "a4", margin: 40 },
          body: DEMO_BODY as never,
        });
        if (r.ok) {
          setResults((p) => ({ ...p, [name]: URL.createObjectURL(base64ToBlob(r.base64)) }));
        } else {
          setErrors((p) => ({ ...p, [name]: r.error }));
        }
      } catch (e) {
        setErrors((p) => ({ ...p, [name]: String(e) }));
      }
    }
    setBusy(false);
  };

  useEffect(() => { void renderAll(); }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>🎨 主题工作室</h1>
        <button
          onClick={() => void renderAll()}
          disabled={busy}
          style={{ cursor: "pointer", background: "#1a1a1a", color: "#f5f1e8", border: "2px solid #1a1a1a", padding: "6px 14px", fontSize: 12.5, fontWeight: 700, boxShadow: "2px 2px 0 #c8371e" }}
        >
          {busy ? "⏳ 渲染中…" : "↻ 全部重渲"}
        </button>
      </div>
      <p style={{ color: "#6b675e", fontSize: 14, margin: "0 0 20px" }}>
        9 套主题 × 同一份内容，全部由服务端真实渲染。点卡片打开 PDF。
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
        {THEME_LIST.map((t) => {
          const url = results[t.name];
          const err = errors[t.name];
          return (
            <Panel key={t.name} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontWeight: 900, fontSize: 15, textTransform: "capitalize" }}>{t.name}</span>
                <Tag tone="ink">{t.headingFont.split(",")[0]}</Tag>
                {busy && !url && !err && <span style={{ marginLeft: "auto", fontSize: 11 }}>⏳</span>}
              </div>
              {/* 主题色板 */}
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {(["primary", "accent", "success", "warning", "destructive", "info"] as const).map((c) => (
                  <div key={c} title={c} style={{ width: 26, height: 18, border: "1.5px solid #1a1a1a", background: (t.colors as unknown as Record<string, string>)[c] }} />
                ))}
              </div>
              {url ? (
                <a href={url} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, fontWeight: 700, color: "#2d5a3d" }}>
                  📄 查看该主题 PDF →
                </a>
              ) : err ? (
                <div style={{ fontSize: 12, color: "#c8371e" }}>✗ {err}</div>
              ) : (
                <div style={{ fontSize: 12, color: "#6b675e" }}>渲染中…</div>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}

function base64ToBlob(b64: string): Blob {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: "application/pdf" });
}
