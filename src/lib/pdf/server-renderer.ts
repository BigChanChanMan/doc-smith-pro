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
  // 字体随项目打包（fonts/ 目录），不依赖宿主机已装字体。
  // ponytail: 假设进程从项目根目录启动；若 systemd 改了 WorkingDirectory，改用 FONTS_DIR 环境变量。
  const fontsDir = process.env.FONTS_DIR ?? join(process.cwd(), "fonts");
  return {
    sans: readFileSync(join(fontsDir, "NotoSansSC-Regular.otf")),
    sansBold: readFileSync(join(fontsDir, "NotoSansSC-Bold.otf")),
  };
}

export function loadPdfFonts() {
  if (!cachedFonts) cachedFonts = buildFontSet();
  return cachedFonts;
}

export const PDF_FONT_FAMILIES = ["Noto Sans SC"];

function fontLoaders() {
  const f = loadPdfFonts();
  return [
    { name: "Noto Sans SC", data: f.sans },
    { name: "Noto Sans SC Bold", data: f.sansBold },
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
    css: `* { font-family: "Noto Sans SC", sans-serif; }`,
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
  await renderDocSpec({
    theme: "professional",
    metadata: { title: "warmup" },
    body: [{ type: "text", text: "预热" }],
  });
}
