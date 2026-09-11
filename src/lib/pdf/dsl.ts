/**
 * 文匠 DocSmith — 文档 DSL（JSON → PDF）
 *
 * 节点类型与 props 和 pdfcn 组件一一对应：
 * 学会写 DSL 就等于学会了 pdfcn 组件 API，反之亦然。
 *
 * 类型层手写（支持递归），zod 只做浅校验（children 交给渲染层报错）。
 */
import { z } from "zod";

/* ═════════════════ 主题 ═════════════════ */

export const THEME_NAMES = [
  "professional",
  "modern",
  "minimal",
  "executive",
  "corporate",
  "elegant",
  "vivid",
  "forest",
  "blueprint",
] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

/* ═════════════════ 节点类型（手写递归） ═════════════════ */

interface WithChildren {
  children?: Node[];
}

export interface TextNodeDsl {
  type: "text";
  text?: string;
  variant?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl";
  weight?: "normal" | "medium" | "semibold" | "bold";
  align?: "left" | "center" | "right" | "justify";
  color?: string;
  italic?: boolean;
  decoration?: "underline" | "line-through" | "none";
  transform?: "uppercase" | "lowercase" | "capitalize";
  noMargin?: boolean;
}

export interface HeadingNodeDsl {
  type: "heading";
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: "left" | "center" | "right";
  color?: string;
  weight?: "normal" | "medium" | "semibold" | "bold";
  tracking?: "tighter" | "tight" | "normal" | "wide" | "wider";
  noMargin?: boolean;
}

export interface LinkNodeDsl {
  type: "link";
  text: string;
  href: string;
  variant?: "default" | "muted" | "primary";
  align?: "left" | "center" | "right";
  color?: string;
}

export interface AlertNodeDsl {
  type: "alert";
  text: string;
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  showIcon?: boolean;
  showBorder?: boolean;
}

export interface BadgeNodeDsl {
  type: "badge";
  label: string;
  variant?: "default" | "primary" | "success" | "warning" | "destructive" | "outline";
  size?: "sm" | "md" | "lg";
}

export interface DividerNodeDsl {
  type: "divider";
  variant?: "solid" | "dashed" | "dotted";
  label?: string;
  color?: string;
}

export interface PageBreakNodeDsl {
  type: "page-break";
}

export interface StackNodeDsl extends WithChildren {
  type: "stack";
  gap?: "none" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
}

export interface SectionNodeDsl extends WithChildren {
  type: "section";
  title?: string;
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  padding?: "none" | "sm" | "md" | "lg";
  background?: string;
  border?: boolean;
  variant?: "default" | "callout" | "highlight" | "card";
  accentColor?: string;
}

export interface CardNodeDsl extends WithChildren {
  type: "card";
  title?: string;
  variant?: "default" | "bordered" | "muted";
  padding?: "sm" | "md" | "lg";
}

export interface KeepTogetherNodeDsl extends WithChildren {
  type: "keep-together";
}

export interface KeyValueNodeDsl {
  type: "key-value";
  items: { label: string; value: string; color?: string }[];
  size?: "sm" | "md" | "lg";
}

export interface DataTableNodeDsl {
  type: "data-table";
  columns: {
    key: string;
    header: string;
    align?: "left" | "center" | "right";
    width?: string | number;
  }[];
  rows: Record<string, string | number>[];
  footer?: Record<string, string | number>;
  stripe?: boolean;
  size?: "default" | "compact";
  variant?: "grid" | "line" | "minimal";
  noWrap?: boolean;
}

export interface ListNodeDsl {
  type: "list";
  items: {
    text: string;
    description?: string;
    checked?: boolean;
    children?: ListNodeDsl["items"];
  }[];
  variant?: "bullet" | "numbered" | "checklist" | "icon" | "multi-level" | "descriptive";
  gap?: "xs" | "sm" | "md";
}

export interface FormNodeDsl {
  type: "form";
  title?: string;
  subtitle?: string;
  groups: {
    title?: string;
    layout?: "single" | "two-column" | "three-column";
    fields: { label: string; hint?: string; height?: number }[];
  }[];
  variant?: "underline" | "box" | "outlined" | "ghost";
  labelPosition?: "above" | "left";
}

export interface GraphNodeDsl {
  type: "graph";
  variant?: "bar" | "horizontal-bar" | "line" | "area" | "pie" | "donut";
  data:
    | { label: string; value: number; color?: string }[]
    | { name: string; data: { label: string; value: number }[]; color?: string }[];
  title?: string;
  subtitle?: string;
  xLabel?: string;
  yLabel?: string;
  width?: number;
  height?: number;
  fullWidth?: boolean;
  colors?: string[];
  showValues?: boolean;
  showGrid?: boolean;
  legend?: "bottom" | "right" | "none";
  showDots?: boolean;
  smooth?: boolean;
  yTicks?: number;
}

export interface ImageNodeDsl {
  type: "image";
  src: string;
  width?: number | string;
  height?: number | string;
  fit?: "cover" | "contain" | "fill" | "none";
  caption?: string;
}

export interface QRCodeNodeDsl {
  type: "qrcode";
  value: string;
  size?: number;
  color?: string;
  caption?: string;
  errorLevel?: "L" | "M" | "Q" | "H";
}

export interface SignatureNodeDsl {
  type: "signature";
  variant?: "single" | "double" | "inline";
  label?: string;
  name?: string;
  title?: string;
  date?: string;
  signers?: [
    { label?: string; name?: string; title?: string; date?: string },
    { label?: string; name?: string; title?: string; date?: string },
  ];
}

export interface WatermarkNodeDsl {
  type: "watermark";
  text: string;
  opacity?: number;
  fontSize?: number;
  color?: string;
  angle?: number;
  position?: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export type Node =
  | TextNodeDsl
  | HeadingNodeDsl
  | LinkNodeDsl
  | AlertNodeDsl
  | BadgeNodeDsl
  | DividerNodeDsl
  | PageBreakNodeDsl
  | StackNodeDsl
  | SectionNodeDsl
  | CardNodeDsl
  | KeepTogetherNodeDsl
  | KeyValueNodeDsl
  | DataTableNodeDsl
  | ListNodeDsl
  | FormNodeDsl
  | GraphNodeDsl
  | ImageNodeDsl
  | QRCodeNodeDsl
  | SignatureNodeDsl
  | WatermarkNodeDsl;

/* ═════════════════ 文档规格 ═════════════════ */

export interface DocSpec {
  page?: {
    size?: "a3" | "a4" | "a5" | "b4" | "b5" | "letter" | "legal" | "ledger";
    landscape?: boolean;
    margin?: number | { top?: number; right?: number; bottom?: number; left?: number };
  };
  /** 单页模式（证书/小票），与 page 二选一 */
  viewport?: { width: number; height?: number };
  theme?: ThemeName;
  metadata?: { title?: string; author?: string; lang?: string };
  /** 由标题生成 PDF 书签目录 */
  outline?: boolean;
  header?: {
    title: string;
    subtitle?: string;
    variant?: "simple" | "centered" | "minimal" | "branded" | "logo-left" | "logo-right";
  };
  footer?: {
    left?: string;
    center?: string;
    pageNumbers?: boolean;
    pageNumberFormat?: "decimal" | "cjk-decimal" | "trad-chinese-informal" | "decimal-leading-zero";
  };
  body: Node[];
}

/* ═════════════════ zod 运行时校验（浅校验） ═════════════════ */

export const DocSpecSchema = z.object({
  page: z
    .object({
      size: z.enum(["a3", "a4", "a5", "b4", "b5", "letter", "legal", "ledger"]).optional(),
      landscape: z.boolean().optional(),
      margin: z.union([z.number(), z.object({ top: z.number().optional(), right: z.number().optional(), bottom: z.number().optional(), left: z.number().optional() })]).optional(),
    })
    .optional(),
  viewport: z.object({ width: z.number(), height: z.number().optional() }).optional(),
  theme: z.enum(THEME_NAMES).optional(),
  metadata: z.object({ title: z.string().optional(), author: z.string().optional(), lang: z.string().optional() }).optional(),
  outline: z.boolean().optional(),
  header: z.object({ title: z.string(), subtitle: z.string().optional(), variant: z.enum(["simple", "centered", "minimal", "branded", "logo-left", "logo-right"]).optional() }).optional(),
  footer: z
    .object({
      left: z.string().optional(),
      center: z.string().optional(),
      pageNumbers: z.boolean().optional(),
      pageNumberFormat: z.enum(["decimal", "cjk-decimal", "trad-chinese-informal", "decimal-leading-zero"]).optional(),
    })
    .optional(),
  body: z.array(z.unknown()),
});

/** 便捷校验：返回错误消息或 null */
export function validateDocSpec(data: unknown): string | null {
  const r = DocSpecSchema.safeParse(data);
  if (r.success) return null;
  const issue = r.error.issues[0];
  return issue ? `${issue.path.join(".") || "(root)"}: ${issue.message}` : "参数错误";
}
