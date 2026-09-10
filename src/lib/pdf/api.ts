/**
 * 文匠 DocSmith — Server Functions（PDF 渲染 API）
 */
import { createServerFn } from "@tanstack/react-start";
import type { DocSpec } from "@/lib/pdf/dsl";
import { validateDocSpec } from "@/lib/pdf/dsl";
import { renderDocSpec } from "@/lib/pdf/server-renderer";

/** 渲染 DSL → base64 PDF（返回元信息 + 数据，客户端转 blob 预览/下载） */
export const generatePdf = createServerFn({ method: "POST" })
  .validator((data: unknown) => { const err = validateDocSpec(data); if (err) throw new Error(`DSL 校验失败: ${err}`); return data as DocSpec; })
  .handler(async ({ data }) => {
    const { pdf, elapsedMs } = await renderDocSpec(data);
    return {
      ok: true as const,
      base64: Buffer.from(pdf).toString("base64"),
      sizeBytes: pdf.byteLength,
      elapsedMs,
    };
  });

/** 渲染错误（校验失败/渲染异常）的结构化返回 */
export type GenerateResult =
  | { ok: true; base64: string; sizeBytes: number; elapsedMs: number }
  | { ok: false; error: string };

export async function safeGeneratePdf(
  spec: unknown,
): Promise<GenerateResult> {
  try {
    return await generatePdf({ data: spec });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    // zod 4 的错误信息截断首行即可读
    return { ok: false, error: msg.split("\n")[0].slice(0, 300) };
  }
}
