/**
 * pdfcn theme 类型统一出口。
 * 真正的类型层级定义在 lib/pdf/themes/theme-types.ts，
 * 这里按 pdfcn 官方导入路径 @/types/pdf-themes 转发，组件代码零改动。
 */
export type {
  TypographyScale,
  SpacingScale,
  FontWeights,
  LineHeights,
  BorderRadiusScale,
  LetterSpacingScale,
  PrimitiveTokens,
  ColorTokens,
  TypographyTokens,
  SpacingTokens,
  PageTokens,
  PdfcnTheme,
} from "@/lib/pdf/themes/theme-types";
