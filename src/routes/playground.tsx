/**
 * 文匠 Playground — JSON DSL → PDF 实时调试台
 */
import { useCallback, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { safeGeneratePdf } from "@/lib/pdf/api";
import { PRESETS } from "@/lib/presets";
import { THEME_NAMES, type ThemeName } from "@/lib/pdf/dsl";
import { Btn, Panel, Tag } from "@/components/site/kit";

export const Route = createFileRoute("/playground")({
  component: PlaygroundPage,
});

function PlaygroundPage() {
  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [specText, setSpecText] = useState(() => JSON.stringify(PRESETS[0].spec, null, 2));
  const [result, setResult] = useState<GenerateResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const previewUrl = useRef<string | null>(null);

  const loadPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id);
    if (!p) return;
    setPresetId(id);
    setSpecText(JSON.stringify(p.spec, null, 2));
    setDirty(false);
  };

  const render = useCallback(async () => {
    setBusy(true);
    try {
      const spec = JSON.parse(specText);
      const r = await safeGeneratePdf(spec);
      setResult(r);
      setDirty(false);
    } catch (e) {
      setResult({ ok: false, error: `JSON 解析失败: ${e instanceof Error ? e.message : String(e)}` });
    } finally {
      setBusy(false);
    }
  }, [specText]);

  // 生成预览 URL（blob）
  const pdfUrl = result?.ok
    ? URL.createObjectURL(base64ToBlob(result.base64))
    : null;

  if (pdfUrl && previewUrl.current) URL.revokeObjectURL(previewUrl.current);
  if (pdfUrl) previewUrl.current = pdfUrl;

  return (
    <div>
      {/* 顶栏：预设 + 渲染 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>🛠 Playground</h1>
        <span style={{ color: "#6b675e", fontSize: 13.5 }}>改 JSON → 点渲染 → 看真 PDF，学会 pdfcn 最快的方式</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
          {dirty && <Tag tone="gold">未渲染修改</Tag>}
          <Btn tone="accent" onClick={render} disabled={busy}>
            {busy ? "⏳ 渲染中…" : "⚡ 渲染 PDF"}
          </Btn>
          {result?.ok && (
            <a
              href={pdfUrl ?? "#"}
              download={`docsmith-${presetId}.pdf`}
              style={{ textDecoration: "none" }}
            >
              <Btn tone="green">⬇ 下载</Btn>
            </a>
          )}
        </div>
      </div>

      {/* 场景预设条 */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 14 }}>
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => loadPreset(p.id)}
            title={`${p.desc}｜演示: ${p.features.join("、")}`}
            style={{
              cursor: "pointer",
              flexShrink: 0,
              background: p.id === presetId ? "#1a1a1a" : "#fffdf8",
              color: p.id === presetId ? "#f5f1e8" : "#1a1a1a",
              border: "2px solid #1a1a1a",
              boxShadow: p.id === presetId ? "none" : "3px 3px 0 #1a1a1a",
              padding: "7px 13px",
              fontSize: 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            {p.emoji} {p.name}
          </button>
        ))}
      </div>

      {/* 主体双栏 */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(420px, 5fr) 7fr", gap: 16, alignItems: "start" }}>
        {/* 左：JSON 编辑器 */}
        <Panel style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "10px 14px", borderBottom: "2px solid #1a1a1a", display: "flex", alignItems: "center", gap: 8, background: "#efe9db" }}>
            <Tag tone="ink">DocSpec JSON</Tag>
            <span style={{ fontSize: 12, color: "#6b675e" }}>zod 校验 · 19 种节点</span>
            <button
              onClick={() => {
                try {
                  setSpecText(JSON.stringify(JSON.parse(specText), null, 2));
                } catch { /* ignore */ }
              }}
              style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#c8371e" }}
            >
              格式化
            </button>
          </div>
          <textarea
            value={specText}
            onChange={(e) => {
              setSpecText(e.target.value);
              setDirty(true);
            }}
            spellCheck={false}
            style={{
              width: "100%",
              minHeight: 640,
              height: "calc(100vh - 320px)",
              border: "none",
              outline: "none",
              resize: "vertical",
              padding: 14,
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 12.5,
              lineHeight: 1.55,
              background: "#fffdf8",
              color: "#1a1a1a",
              boxSizing: "border-box",
            }}
          />
          {result && (
            <div
              style={{
                padding: "10px 14px",
                borderTop: "2px solid #1a1a1a",
                fontSize: 12.5,
                fontWeight: 600,
                background: result.ok ? "#e8f3ea" : "#f9e5e1",
                color: result.ok ? "#2d5a3d" : "#c8371e",
              }}
            >
              {result.ok
                ? `✓ 渲染成功 · ${(result.sizeBytes / 1024).toFixed(1)} KB · ${result.elapsedMs}ms`
                : `✗ ${result.error}`}
            </div>
          )}
        </Panel>

        {/* 右：PDF 预览 */}
        <Panel style={{ padding: 0, overflow: "hidden", minHeight: 640 }}>
          <div style={{ padding: "10px 14px", borderBottom: "2px solid #1a1a1a", display: "flex", alignItems: "center", gap: 8, background: "#efe9db" }}>
            <Tag tone="accent">PDF 预览</Tag>
            <span style={{ fontSize: 12, color: "#6b675e" }}>Takumi WASM 渲染 · 矢量可选中文字</span>
          </div>
          {pdfUrl ? (
            <iframe
              key={pdfUrl}
              src={pdfUrl}
              style={{ width: "100%", height: "calc(100vh - 260px)", minHeight: 600, border: "none" }}
              title="PDF Preview"
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 600, gap: 12, color: "#6b675e" }}>
              <div style={{ fontSize: 44 }}>📄</div>
              <div style={{ fontSize: 14 }}>点击「⚡ 渲染 PDF」查看效果</div>
              <div style={{ fontSize: 12 }}>或先从上方切换一个场景预设</div>
            </div>
          )}
        </Panel>
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
