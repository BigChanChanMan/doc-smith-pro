import type { ReactNode } from "react";

import type { Style } from "@/lib/pdf/pdf-primitives";

/** 公共 props：所有 pdfcn 组件都接受 children 与 style（数组或对象）。 */
export interface PDFComponentProps {
  children?: ReactNode;
  style?: Style | Style[];
}
