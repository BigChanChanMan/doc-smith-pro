import type { ReactNode } from "react";

import { View } from "@/lib/pdf/pdf-primitives";
import type { Style } from "@/lib/pdf/pdf-primitives";

export interface KeepTogetherProps {
  children?: ReactNode;
  minPresenceAhead?: number;
  style?: Style;
}

export const KeepTogether = ({ children, style }: KeepTogetherProps) => (
  <View style={[{ breakInside: "avoid" }, style].filter(Boolean) as never}>
    {children}
  </View>
);
