import { useMemo, useState, type ReactNode } from "react";
import { blueprintTokens, T } from "./kit";

const NAV = [
  ["/", "首页"],
  ["/playground", "Playground"],
  ["/gallery", "组件画廊"],
  ["/themes", "主题工作室"],
  ["/learn", "学习中心"],
] as const;

export function SiteFrame({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"sepia" | "blueprint">("sepia");
  const bp = mode === "blueprint";
  const tk = useMemo(
    () => (bp ? { ...T, ...blueprintTokens() } : T),
    [bp],
  );

  const value = useMemo(
    () => ({
      mode,
      toggle: () => setMode((m) => (m === "sepia" ? "blueprint" : "sepia")),
    }),
    [mode],
  );

  return (
    <div style={{ background: tk.bg, color: tk.ink, minHeight: "100vh", fontFamily: "'PingFang SC', 'Noto Sans SC', system-ui, sans-serif", transition: "background .25s, color .25s" }}>
      <header style={{ borderBottom: `2px solid ${tk.border}`, background: bp ? "#0c1017" : "#efe9db", position: "sticky", top: 0, zIndex: 50 }}>
        <nav style={{ maxWidth: 1240, margin: "0 auto", padding: "0 20px", height: 60, display: "flex", alignItems: "center", gap: 18 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, background: tk.accent, color: "#fff", border: `2px solid ${tk.border}`, fontWeight: 900, fontSize: 18, boxShadow: `2px 2px 0 ${tk.border}` }}>匠</span>
            <span style={{ fontWeight: 900, fontSize: 17, letterSpacing: "0.06em" }}>
              文匠 <span style={{ color: tk.accent }}>DocSmith</span>
            </span>
          </a>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 2 }}>
            {NAV.map(([href, label]) => (
              <a key={href} href={href} style={{ padding: "7px 12px", fontSize: 13.5, fontWeight: 600, color: "inherit", textDecoration: "none", border: "2px solid transparent" }}>
                {label}
              </a>
            ))}
            <button
              onClick={value.toggle}
              style={{ marginLeft: 8, cursor: "pointer", background: "transparent", border: `2px solid ${tk.border}`, padding: "5px 10px", fontSize: 12, fontWeight: 700, color: "inherit", boxShadow: `2px 2px 0 ${tk.border}` }}
            >
              {bp ? "☀️ 纸色" : "🌌 图纸"}
            </button>
          </div>
        </nav>
      </header>
        <main style={{ maxWidth: 1240, margin: "0 auto", padding: "28px 20px 80px" }}>{children}</main>
        <footer style={{ borderTop: `2px solid ${tk.border}`, padding: "18px 20px", textAlign: "center", fontSize: 12.5, color: tk.muted }}>
          文匠 DocSmith — 用 JSON 写文档 · 引擎 pdfcn + Takumi (WASM) · TanStack Start
        </footer>
    </div>
  );
}
