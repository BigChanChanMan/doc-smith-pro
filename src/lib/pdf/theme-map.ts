/**
 * 文匠 DocSmith — 9 套主题注册表
 */
import type { PdfcnTheme } from "@/components/pdf/theme-provider";
import type { ThemeName } from "./dsl";
import { professionalTheme } from "@/lib/pdf/themes/professional";
import { modernTheme } from "@/lib/pdf/themes/modern";
import { minimalTheme } from "@/lib/pdf/themes/minimal";
import { executiveTheme } from "@/lib/pdf/themes/executive";
import { corporateTheme } from "@/lib/pdf/themes/corporate";
import { elegantTheme } from "@/lib/pdf/themes/elegant";
import { vividTheme } from "@/lib/pdf/themes/vivid";
import { forestTheme } from "@/lib/pdf/themes/forest";
import { blueprintTheme } from "@/lib/pdf/themes/blueprint";

export const THEMES: Record<ThemeName, PdfcnTheme> = {
  professional: professionalTheme,
  modern: modernTheme,
  minimal: minimalTheme,
  executive: executiveTheme,
  corporate: corporateTheme,
  elegant: elegantTheme,
  vivid: vividTheme,
  forest: forestTheme,
  blueprint: blueprintTheme,
};

export const THEME_LIST = Object.entries(THEMES).map(([name, theme]) => ({
  name: name as ThemeName,
  colors: theme.colors,
  headingFont: theme.typography.heading.fontFamily,
  bodyFont: theme.typography.body.fontFamily,
}));

export function getTheme(name: ThemeName): PdfcnTheme {
  return THEMES[name] ?? professionalTheme;
}
