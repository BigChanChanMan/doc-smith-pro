/**
 * 文匠 DocSmith — DSL → pdfcn React 树映射器
 *
 * 每个节点类型对应一个 pdfcn 组件；这是「学 pdfcn 用法」最直接的参照表。
 */
import type { ReactNode } from "react";
import type { Node, DocSpec } from "./dsl";
import { getTheme } from "./theme-map";
import { PdfcnThemeProvider } from "@/components/pdf/theme-provider";
import { Text } from "@/components/pdf/text/text";
import { Heading } from "@/components/pdf/heading/heading";
import { Link } from "@/components/pdf/link/link";
import { PdfAlert } from "@/components/pdf/alert/alert";
import { Badge } from "@/components/pdf/badge/badge";
import { Divider } from "@/components/pdf/divider/divider";
import { PageBreak } from "@/components/pdf/page-break/page-break";
import { Stack } from "@/components/pdf/stack/stack";
import { Section } from "@/components/pdf/section/section";
import { PdfCard } from "@/components/pdf/card/card";
import { KeepTogether } from "@/components/pdf/keep-together/keep-together";
import { KeyValue } from "@/components/pdf/key-value/key-value";
import { DataTable } from "@/components/pdf/data-table/data-table";
import { PdfList } from "@/components/pdf/list/list";
import { PdfForm } from "@/components/pdf/form/form";
import { PdfGraph } from "@/components/pdf/graph/graph";
import { PdfImage } from "@/components/pdf/pdf-image/pdf-image";
import { PdfQRCode } from "@/components/pdf/qrcode/qrcode";
import { PdfSignatureBlock } from "@/components/pdf/signature/signature";
import { PdfWatermark } from "@/components/pdf/watermark/watermark";
import { PageHeader } from "@/components/pdf/page-header/page-header";
import { PageFooter } from "@/components/pdf/page-footer/page-footer";
import { PageNumber } from "@/components/pdf/page-number/page-number";
import { TotalPages } from "takumi-pdf/primitives";
import { Document, Page, View } from "@/lib/pdf/pdf-primitives";

/* ─────────────────── 节点 → pdfcn 组件 ─────────────────── */

function renderNode(node: Node, key: number): ReactNode {
  switch (node.type) {
    case "text":
      return (
        <Text
          key={key}
          variant={node.variant}
          weight={node.weight}
          align={node.align}
          color={node.color}
          italic={node.italic}
          decoration={node.decoration}
          transform={node.transform}
          noMargin={node.noMargin}
        >
          {node.text}
        </Text>
      );

    case "heading":
      return (
        <Heading
          key={key}
          level={node.level}
          align={node.align}
          color={node.color}
          weight={node.weight}
          tracking={node.tracking}
          noMargin={node.noMargin}
        >
          {node.text}
        </Heading>
      );

    case "link":
      return (
        <Link
          key={key}
          href={node.href}
          variant={node.variant}
          align={node.align}
          color={node.color}

        >
          {node.text}
        </Link>
      );

    case "alert":
      return (
        <PdfAlert
          key={key}
          variant={node.variant}
          title={node.title}
          showIcon={node.showIcon}
          showBorder={node.showBorder}
        >
          {node.text}
        </PdfAlert>
      );

    case "badge":
      return <Badge key={key} label={node.label} variant={node.variant} size={node.size} />;

    case "divider":
      return <Divider key={key} variant={node.variant} label={node.label} color={node.color} />;

    case "page-break":
      return <PageBreak key={key} />;

    case "stack":
      return (
        <Stack key={key} gap={node.gap} align={node.align}>
          {(node.children ?? []).map(renderNode)}
        </Stack>
      );

    case "section":
      // pdfcn 的 Section 无 title prop，标题用 Heading 组合实现
      return (
        <Section
          key={key}
          spacing={node.spacing}
          padding={node.padding}
          background={node.background}
          border={node.border}
          variant={node.variant}
          accentColor={node.accentColor}
        >
          {node.title ? (
            <Heading level={3} noMargin>
              {node.title}
            </Heading>
          ) : null}
          {(node.children ?? []).map(renderNode)}
        </Section>
      );

    case "card":
      return (
        <PdfCard key={key} title={node.title} variant={node.variant} padding={node.padding}>
          {(node.children ?? []).map(renderNode)}
        </PdfCard>
      );

    case "keep-together":
      return <KeepTogether key={key}>{(node.children ?? []).map(renderNode)}</KeepTogether>;

    case "key-value":
      return <KeyValue key={key} size={node.size} items={node.items.map((it) => ({ key: it.label, value: it.value, valueColor: it.color }))} />;

    case "data-table":
      return (
        <DataTable
          key={key}
          columns={node.columns}
          data={node.rows}
          footer={node.footer as never}
          stripe={node.stripe}
          size={node.size}
          variant={node.variant}
          noWrap={node.noWrap}
        />
      );

    case "list":
      return <PdfList key={key} items={node.items} variant={node.variant} gap={node.gap} />;

    case "form":
      return (
        <PdfForm
          key={key}
          title={node.title}
          subtitle={node.subtitle}
          groups={node.groups}
          variant={node.variant}
          labelPosition={node.labelPosition}
        />
      );

    case "graph":
      return (
        <PdfGraph
          key={key}
          variant={node.variant}
          data={node.data as never}
          title={node.title}
          subtitle={node.subtitle}
          xLabel={node.xLabel}
          yLabel={node.yLabel}
          width={node.width}
          height={node.height}
          fullWidth={node.fullWidth}
          colors={node.colors}
          showValues={node.showValues}
          showGrid={node.showGrid}
          legend={node.legend}
          showDots={node.showDots}
          smooth={node.smooth}
          yTicks={node.yTicks}
        />
      );

    case "image":
      return (
        <PdfImage
          key={key}
          src={node.src}
          width={node.width}
          height={node.height}
          fit={node.fit}
          caption={node.caption}
        />
      );

    case "qrcode":
      return (
        <PdfQRCode
          key={key}
          value={node.value}
          size={node.size}
          color={node.color}
          caption={node.caption}
          errorLevel={node.errorLevel}
        />
      );

    case "signature":
      return node.signers ? (
        <PdfSignatureBlock key={key} variant="double" signers={node.signers} />
      ) : (
        <PdfSignatureBlock
          key={key}
          variant={node.variant}
          label={node.label}
          name={node.name}
          title={node.title}
          date={node.date}
        />
      );

    case "watermark":
      return (
        <PdfWatermark
          key={key}
          text={node.text}
          opacity={node.opacity}
          fontSize={node.fontSize}
          color={node.color}
          angle={node.angle}
          position={node.position}
        />
      );
  }
}

/* ─────────────────── 页眉 / 页脚 ─────────────────── */

function headerElement(h: NonNullable<DocSpec["header"]>): ReactNode {
  return (
    <PageHeader
      title={h.title}
      subtitle={h.subtitle}
      variant={h.variant}
    />
  );
}

function footerElement(f: NonNullable<DocSpec["footer"]>): ReactNode {
  const format = f.pageNumberFormat ?? "decimal";
  const pageNum = f.pageNumbers ? (
    <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      <Text variant="xs" noMargin color="mutedForeground">
        第 <PageNumber format={format} /> 页 / 共 <TotalPages format={format} /> 页
      </Text>
    </View>
  ) : null;

  if (f.left || f.center || pageNum) {
    return (
      <PageFooter leftText={f.left} rightText={pageNum} />
    );
  }
  return pageNum;
}

/* ─────────────────── 文档组装 ─────────────────── */

/**
 * DSL → 完整文档 React 树。
 * 结构: PdfcnThemeProvider(主题) → Document → Page → 水印 + 正文
 * 服务端把它交给 takumi 渲染；浏览器把它作为结构化预览。
 */
export function dslToReact(spec: DocSpec): ReactNode {
  const theme = getTheme(spec.theme ?? "professional");

  // 水印只取第一个（takumi 的 fixed 元素每页重复）
  const wmNode = spec.body.find((n) => n.type === "watermark");
  const contentNodes = wmNode ? spec.body.filter((n) => n !== wmNode) : spec.body;

  const pageProps = spec.viewport
    ? {} // viewport 单页模式由 render 层处理几何，这里不重复设置
    : { size: spec.page?.size ?? "a4" };

  return (
    <PdfcnThemeProvider theme={theme}>
      <Document title={spec.metadata?.title}>
        <Page {...pageProps}>
          {wmNode ? renderNode(wmNode, -1) : null}
          {contentNodes.map(renderNode)}
        </Page>
      </Document>
    </PdfcnThemeProvider>
  );
}

export { headerElement, footerElement };
