import type { CSSProperties, ReactNode } from "react";

/* 文匠站点设计令牌（新粗野主义 × 出版排版风） */
export const T = {
  bg: "#f5f1e8",
  ink: "#1a1a1a",
  accent: "#c8371e",
  accent2: "#2d5a3d",
  gold: "#b8860b",
  border: "#1a1a1a",
  card: "#fffdf8",
  muted: "#6b675e",
};

export function blueprintTokens() {
  return {
    bg: "#10141c",
    ink: "#dfe8f2",
    border: "#3b4b63",
    card: "#161c28",
    accent: "#4cc3ff",
    muted: "#8fa3bd",
  };
}

export function Tag({
  children,
  tone = "ink",
}: {
  children: ReactNode;
  tone?: "ink" | "accent" | "green" | "gold";
}) {
  const colors: Record<string, CSSProperties> = {
    ink: { background: T.ink, color: T.bg },
    accent: { background: T.accent, color: "#fff" },
    green: { background: T.accent2, color: "#fff" },
    gold: { background: T.gold, color: "#fff" },
  };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        border: `2px solid ${T.border}`,
        fontSize: 11,
        fontWeight: 700,
        fontFamily: "ui-monospace, monospace",
        letterSpacing: "0.04em",
        boxShadow: "2px 2px 0 #1a1a1a",
        ...colors[tone],
      }}
    >
      {children}
    </span>
  );
}

export function Panel({
  children,
  style,
  onClick,
}: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: T.card,
        border: `2px solid ${T.border}`,
        boxShadow: "4px 4px 0 #1a1a1a",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  tone = "ink",
  disabled,
  style,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "ink" | "accent" | "green";
  disabled?: boolean;
  style?: CSSProperties;
}) {
  const bg = tone === "accent" ? T.accent : tone === "green" ? T.accent2 : T.ink;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        background: bg,
        color: "#fff",
        border: `2px solid ${T.border}`,
        padding: "8px 16px",
        fontWeight: 700,
        fontSize: 13,
        fontFamily: "inherit",
        boxShadow: "3px 3px 0 #1a1a1a",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Hero({
  title,
  sub,
  children,
}: {
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 26 }}>
      <h1 style={{ fontSize: 34, fontWeight: 900, margin: "0 0 8px", letterSpacing: "0.02em" }}>
        {title}
      </h1>
      {sub ? <p style={{ fontSize: 15, color: T.muted, margin: 0 }}>{sub}</p> : null}
      {children}
    </div>
  );
}
