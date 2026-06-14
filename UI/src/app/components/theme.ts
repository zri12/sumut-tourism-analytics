// Shared design tokens for the research platform.
// Neutral, editorial palette — no gradients, subtle shadows only.

export const t = {
  // Surfaces
  bg: "#FAFAFA",
  surface: "#FFFFFF",
  surfaceMuted: "#F9FAFB",

  // Brand
  primary: "#2563EB",
  primarySoft: "#EFF4FF",
  primaryBorder: "#DBE5FF",

  // Text
  text: "#111827",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",

  // Lines
  border: "#E5E7EB",
  borderSoft: "#F3F4F6",

  // Status
  success: "#10B981",
  successSoft: "#ECFDF5",
  warning: "#D97706",
  warningSoft: "#FFFBEB",
  danger: "#DC2626",

  // Elevation
  shadowSm: "0 1px 2px rgba(16,24,40,0.04)",
  shadow: "0 1px 3px rgba(16,24,40,0.06), 0 1px 2px rgba(16,24,40,0.04)",

  radius: 16,
  radiusSm: 10,

  font: "'Inter', sans-serif",
} as const;

// Cluster identity — monochrome blue scale + neutral gray, restrained and academic.
export const cluster = {
  Ramai: { dot: "#2563EB", text: "#1D4ED8", soft: "#EFF4FF", border: "#DBE5FF" },
  Sedang: { dot: "#0D9488", text: "#0F766E", soft: "#ECFDF8", border: "#CCFBEF" },
  Sepi: { dot: "#9CA3AF", text: "#6B7280", soft: "#F3F4F6", border: "#E5E7EB" },
} as const;

export type ClusterName = keyof typeof cluster;
