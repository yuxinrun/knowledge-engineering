/**
 * 图表与数据层的统一色板（SVG / Recharts / React Flow 需要具体 hex）。
 * 与 app/globals.css 的 CSS 变量、tailwind.config.ts 的语义色保持一致。
 */
export const palette = {
  brand: "#0E9F8A",
  brandSoft: "#5CC9B5",
  brandDeep: "#0B7C6D",
  accent: "#E2683C",
  azure: "#3B6FE0",
  violet: "#7C5CD6",
  leaf: "#12A150",
  amber: "#D9A441",
  rose: "#D2555A",
  slate: "#7A827A",
  ink: "#102A24",
  canvas: "#F6F4EE",
  darkCanvas: "#0B1220",
} as const;

export type PaletteTone = "blue" | "cyan" | "purple" | "green" | "amber" | "rose" | "neutral" | "teal";

/** 组件里按 tone 取色的统一映射，避免各图表各自硬编码。 */
export const toneColors: Record<PaletteTone, string> = {
  teal: palette.brand,
  blue: palette.azure,
  cyan: palette.brandSoft,
  purple: palette.violet,
  green: palette.leaf,
  amber: palette.amber,
  rose: palette.rose,
  neutral: palette.slate,
};
