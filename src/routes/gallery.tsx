/**
 * 组件画廊 — 每个节点类型的真实渲染样例
 * 「样例 JSON」即点即渲染，看 JSON 就学会了组件 API。
 */
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { safeGeneratePdf, type GenerateResult } from "@/lib/pdf/api";
import { Panel, Tag } from "@/components/site/kit";
import { SiteFrame } from "@/components/site/SiteFrame";
import type { Node } from "@/lib/pdf/dsl";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
});

interface Sample {
  type: string;
  comp: string;
  title: string;
  desc: string;
  node: Node;
}

const S = (type: string, comp: string, title: string, desc: string, node: Node): Sample => ({
  type, comp, title, desc, node,
});

const SAMPLES: Sample[] = [
  S("text", "Text", "文本", "字号档位/粗细/对齐/颜色/删除线，color 可用主题语义名", {
    type: "text", text: "支持 weight=bold · color=primary · decoration=underline 的正文文字", weight: "bold", color: "primary", decoration: "underline",
  }),
  S("heading", "Heading", "标题", "level 1-6 排印尺度，自动进入 PDF 书签大纲", {
    type: "heading", text: "二级标题示例", level: 2,
  }),
  S("link", "Link", "链接", "href 生成可点击的 PDF 注释", {
    type: "link", text: "访问 pdfcn.dev 文档", href: "https://www.pdfcn.dev",
  }),
  S("alert", "Alert", "提示框", "info/success/warning/error 四种语义 + 可选图标", {
    type: "alert", variant: "warning", title: "注意", text: "带图标与边界的警示样例。",
  }),
  S("badge", "Badge", "徽章", "状态小标签，六种配色", {
    type: "badge", label: "已审核", variant: "success", size: "md",
  }),
  S("divider", "Divider", "分隔线", "solid/dashed/dotted，可带居中文字", {
    type: "divider", variant: "dashed", label: "章节分隔",
  }),
  S("stack", "Stack", "垂直堆叠", "纵向布局容器，控制子元素间距", {
    type: "stack", gap: "sm", children: [
      { type: "text", text: "堆叠子元素 A", noMargin: true },
      { type: "text", text: "堆叠子元素 B", noMargin: true },
    ],
  }),
  S("section", "Section", "小节", "带标题与留白的分组容器", {
    type: "section", title: "小节标题", border: true, children: [
      { type: "text", text: "小节内容区。" },
    ],
  }),
  S("card", "Card", "卡片", "标题+内容的边框容器，三种变体", {
    type: "card", title: "卡片标题", variant: "bordered", children: [
      { type: "text", text: "卡片正文内容。" },
    ],
  }),
  S("keep-together", "KeepTogether", "防分页截断", "内部内容整体不分页", {
    type: "keep-together", children: [
      { type: "text", text: "这块内容若放不下会整体搬到下一页。", noMargin: true },
    ],
  }),
  S("key-value", "KeyValue", "键值对", "表单型字段列表，valueColor 上色", {
    type: "key-value", size: "md", items: [
      { label: "客户", value: "杭州云链科技有限公司" },
      { label: "金额", value: "¥225,600.00", color: "success" },
    ],
  }),
  S("data-table", "DataTable", "数据表", "列定义+合计行+斑马纹，财务票据核心", {
    type: "data-table", stripe: true, size: "compact", columns: [
      { key: "item", header: "项目" }, { key: "qty", header: "数量", align: "right" }, { key: "amount", header: "金额", align: "right" },
    ], rows: [
      { item: "引擎授权", qty: 1, amount: "¥120,000" },
      { item: "定制开发", qty: 24, amount: "¥76,800" },
    ], footer: { item: "合计", amount: "¥196,800" },
  }),
  S("list", "List", "列表", "bullet/numbered/checklist/descriptive", {
    type: "list", variant: "checklist", items: [
      { text: "已完成项", checked: true },
      { text: "待办项", checked: false },
    ],
  }),
  S("form", "Form", "填写表单", "留白区供打印后手写", {
    type: "form", title: "签署信息", groups: [
      { title: "甲方", layout: "two-column", fields: [{ label: "签署人" }, { label: "日期" }] },
    ],
  }),
  S("graph", "Graph", "图表", "bar/line/area/pie/donut SVG 矢量图", {
    type: "graph", variant: "bar", title: "季度营收（万）", height: 170, showValues: true, data: [
      { label: "Q1", value: 5120 }, { label: "Q2", value: 6150 }, { label: "Q3", value: 6890 }, { label: "Q4", value: 8420 },
    ],
  }),
  S("qrcode", "QRCode", "二维码", "value 驱动，验真/溯源必备", {
    type: "qrcode", value: "https://www.pdfcn.dev", size: 88, caption: "扫码访问文档",
  }),
  S("signature", "Signature", "签名块", "single/double 双签章布局", {
    type: "signature", variant: "double", signers: [
      { label: "甲方", name: "李明眸" }, { label: "乙方", name: "陈远山" },
    ],
  }),
  S("watermark", "Watermark", "水印", "五方位斜排水印，页面级悬浮", {
    type: "watermark", text: "DRAFT", opacity: 0.08, fontSize: 64, angle: -30,
  }),
  S("image", "PdfImage", "图片", "http/data 源，fit 控制裁剪", {
    type: "image", src: "data:image/svg+xml;base64," + btoa('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="60"><rect width="120" height="60" fill="#2d5a3d"/><text x="60" y="36" fill="#fff" font-size="16" text-anchor="middle">LOGO</text></svg>'), width: 120, caption: "SVG 以矢量嵌入",
  }),
  S("page-break", "PageBreak", "分页符", "强制开新页", {
    type: "page-break",
  }),
];

function GalleryPage() {
  return (
    <SiteFrame>
      <GalleryInner />
    </SiteFrame>
  );
}

function GalleryInner() {
  const [rendering, setRendering] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { url?: string; error?: string }>>({});

  const renderOne = async (s: Sample) => {
    setRendering(s.type);
    try {
      const spec = {
        theme: "vivid" as const,
        metadata: { title: `组件样例 · ${s.title}`, lang: "zh-CN" },
        page: { size: "a4" as const, margin: 40 },
        body: [s.node],
      };
      const r = await safeGeneratePdf(spec);
      if (r.ok) {
        const url = URL.createObjectURL(base64ToBlob(r.base64));
        setResults((prev) => ({ ...prev, [s.type]: { url } }));
      } else {
        setResults((prev) => ({ ...prev, [s.type]: { error: r.error } }));
      }
    } finally {
      setRendering(null);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px" }}>🧩 组件画廊</h1>
      <p style={{ color: "#6b675e", fontSize: 14, margin: "0 0 20px" }}>
        每张卡片 = 一种 DSL 节点 → 对应一个 pdfcn 组件。点「渲染」看真实 PDF 效果，样例 JSON 即用即学。
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
        {SAMPLES.map((s) => {
          const r = results[s.type];
          return (
            <Panel key={s.type} style={{ padding: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Tag tone="accent">{s.type}</Tag>
                <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, fontWeight: 700 }}>&lt;{s.comp} /&gt;</span>
                <button
                  onClick={() => renderOne(s)}
                  disabled={rendering === s.type}
                  style={{
                    marginLeft: "auto", cursor: "pointer", background: "#1a1a1a", color: "#f5f1e8",
                    border: "2px solid #1a1a1a", padding: "4px 12px", fontSize: 12, fontWeight: 700,
                    boxShadow: "2px 2px 0 #c8371e",
                  }}
                >
                  {rendering === s.type ? "⏳" : "▶ 渲染"}
                </button>
              </div>
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12.5, color: "#6b675e", lineHeight: 1.6, marginBottom: 10 }}>{s.desc}</div>
              <details>
                <summary style={{ cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#c8371e", marginBottom: 8 }}>
                  查看 DSL JSON
                </summary>
                <pre style={{
                  background: "#1a1a1a", color: "#d8e8d8", padding: 10, fontSize: 11, lineHeight: 1.5,
                  overflowX: "auto", borderRadius: 4, fontFamily: "ui-monospace, monospace",
                }}>
                  {JSON.stringify(s.node, null, 2)}
                </pre>
              </details>
              {r && (
                <div style={{ marginTop: 10 }}>
                  {r.url ? (
                    <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize: 12.5, fontWeight: 700, color: "#2d5a3d" }}>
                      📄 查看渲染结果 PDF →
                    </a>
                  ) : (
                    <div style={{ fontSize: 12, color: "#c8371e", fontWeight: 600 }}>✗ {r.error}</div>
                  )}
                </div>
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
