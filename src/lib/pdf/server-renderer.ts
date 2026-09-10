/**
 * 文匠 DocSmith — 服务端 PDF 渲染核心
 *
 * 渲染链路: DocSpec(JSON) → dslToReact → pdfcn React 树 → takumi-pdf (WASM) → PDF 字节流
 * pdfcn 组件（View/Text 等）本质是内联样式的 div/span，
 * 所以整棵 React 树可以直接交给 takumi，无需 DOM。
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PdfRenderer } from "takumi-pdf";
import { dslToReact, headerElement, footerElement } from "./dsl-to-react";
import type { DocSpec } from "./dsl";

/* ─────────────────── 字体（进程级单例） ─────────────────── */

let cachedFonts: ReturnType<typeof buildFontSet> | null = null;

function buildFontSet() {
  const notoDir = "/usr/share/fonts/opentype/noto";
  const dejavu = "/usr/share/fonts/truetype/dejavu";
  return {
    sans: readFileSync(join(notoDir, "NotoSansCJK-Regular.ttc")),
    sansBold: readFileSync(join(notoDir, "NotoSansCJK-Bold.ttc")),
    serif: readFileSync(join(dejavu, "DejaVuSerif.ttf")),
    serifBold: readFileSync(join(dejavu, "DejaVuSerif-Bold.ttf")),
    mono: readFileSync(join(dejavu, "DejaVuSansMono.ttf")),
  };
}

export function loadPdfFonts() {
  if (!cachedFonts) cachedFonts = buildFontSet();
  return cachedFonts;
}

export const PDF_FONT_FAMILIES = [
  "Noto Sans CJK SC",
  "DejaVu Serif",
  "DejaVu Sans Mono",
];

function fontLoaders() {
  const f = loadPdfFonts();
  return [
    { name: "Noto Sans CJK SC", data: f.sans },
    { name: "Noto Sans CJK SC Bold", data: f.sansBold },
    { name: "DejaVu Serif", data: f.serif },
    { name: "DejaVu Serif Bold", data: f.serifBold },
    { name: "DejaVu Sans Mono", data: f.mono },
  ];
}

/* ─────────────────── 共享渲染器 ─────────────────── */

let sharedRenderer: PdfRenderer | null = null;

function getSharedRenderer(): PdfRenderer {
  if (!sharedRenderer) {
    sharedRenderer = new PdfRenderer();
    for (const font of fontLoaders()) {
      sharedRenderer.registerFont(font as never);
    }
  }
  return sharedRenderer;
}

/* ─────────────────── 图片预取 ─────────────────── */

/** 从 DSL 中收集所有 http(s) 图片并预取字节（takumi 不自行抓取远程资源） */
async function prefetchImages(spec: DocSpec) {
  const urls: string[] = [];
  const walk = (nodes: DocSpec["body"]) => {
    for (const n of nodes) {
      if (n.type === "image" && /^https?:\/\//.test(n.src)) urls.push(n.src);
      if ("children" in n && Array.isArray(n.children)) walk(n.children as never);
    }
  };
  walk(spec.body);
  if (!urls.length) return undefined;
  const unique = [...new Set(urls)];
  const images = await Promise.all(
    unique.map(async (src) => {
      try {
        const res = await fetch(src, { signal: AbortSignal.timeout(10_000) });
        if (!res.ok) throw new Error(String(res.status));
        return { src, data: new Uint8Array(await res.arrayBuffer()) };
      } catch {
        return null; // 失败的图片跳过，避免整单渲染失败
      }
    }),
  );
  const ok = images.filter(Boolean) as { src: string; data: Uint8Array }[];
  return ok.length ? ok : undefined;
}

/* ─────────────────── 渲染入口 ─────────────────── */

export interface RenderResult {
  pdf: Uint8Array;
  elapsedMs: number;
}

export async function renderDocSpec(spec: DocSpec): Promise<RenderResult> {
  const started = Date.now();
  const renderer = getSharedRenderer();
  const images = await prefetchImages(spec);

  const element = dslToReact(spec);

  const header =
    spec.header && !spec.viewport ? headerElement(spec.header) : undefined;
  const footer =
    spec.footer && !spec.viewport ? footerElement(spec.footer) : undefined;

  const common = {
    fonts: fontLoaders(),
    fontFamilies: PDF_FONT_FAMILIES,
    images,
    lang: spec.metadata?.lang ?? "zh-CN",
    css: `* { font-family: "Noto Sans CJK SC", "DejaVu Serif", "DejaVu Sans Mono", sans-serif; }`,
  };

  const options = spec.viewport
    ? {
        viewport: spec.viewport,
        ...common,
      }
    : {
        size: spec.page?.size ?? "a4",
        landscape: spec.page?.landscape,
        margin: spec.page?.margin ?? 48,
        header,
        footer,
        outline: spec.outline,
        ...common,
      };

  const pdf = await renderer.render(element, options as never);

  return { pdf, elapsedMs: Date.now() - started };
}

/** 预热：进程启动后首次调用会加载 WASM + 字体，之后毫秒级 */
export async function warmup() {
  const { Text } = await import("@/components/pdf/text/text");
  const { PdfcnThemeProvider } = await import("@/components/pdf/theme-provider");
  await renderDocSpec({
    theme: "professional",
    metadata: { title: "warmup" },
    body: [{ type: "text", text: "预热" }],
  });
}
