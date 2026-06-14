import { useState } from "react";
import { Search, Bell } from "lucide-react";
import { t } from "./theme";

export type Page = "dashboard" | "dataset" | "clustering" | "results" | "recommendations";

const tabs: { id: Page; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "dataset", label: "Dataset" },
  { id: "clustering", label: "Clustering" },
  { id: "results", label: "Results" },
  { id: "recommendations", label: "Recommendations" },
];

export function TopNav({
  activePage,
  onNavigate,
}: {
  activePage: Page;
  onNavigate: (p: Page) => void;
}) {
  const [hover, setHover] = useState<Page | null>(null);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "saturate(180%) blur(12px)",
        borderBottom: `1px solid ${t.border}`,
      }}
    >
      {/*
       * 5-item flex row:  brand | flex-spacer | tabs | flex-spacer | actions
       * Both spacers have flex:1 so they split leftover space equally,
       * keeping tabs perfectly centred without overflow.
       * Brand and actions are flex: 0 0 auto (never grow or shrink).
       */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 60,
          padding: "0 24px",
        }}
      >
        {/* ── Brand ─────────────────────────────────────────── */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: t.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
              KM
            </span>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: t.text, lineHeight: 1.3, whiteSpace: "nowrap" }}>
              K-Means Tourism Research
            </p>
            <p style={{ fontSize: 10.5, color: t.textMuted, lineHeight: 1.2, whiteSpace: "nowrap" }}>
              Sumatera Utara · Visit Pattern Analysis
            </p>
          </div>
        </div>

        {/* ── Left spacer ───────────────────────────────────── */}
        <div style={{ flex: 1 }} />

        {/* ── Navigation tabs ───────────────────────────────── */}
        <nav style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 1 }}>
          {tabs.map((tab) => {
            const active = activePage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                onMouseEnter={() => setHover(tab.id)}
                onMouseLeave={() => setHover(null)}
                style={{
                  background: active ? t.primarySoft : hover === tab.id ? t.surfaceMuted : "transparent",
                  border: "none",
                  borderRadius: 7,
                  padding: "6px 12px",
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? t.primary : t.textSecondary,
                  cursor: "pointer",
                  transition: "background 120ms ease, color 120ms ease",
                  whiteSpace: "nowrap",
                  fontFamily: t.font,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* ── Right spacer ──────────────────────────────────── */}
        <div style={{ flex: 1 }} />

        {/* ── Actions ───────────────────────────────────────── */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              width: 152,
              height: 34,
              padding: "0 10px",
              borderRadius: 9,
              background: t.surfaceMuted,
              border: `1px solid ${t.border}`,
            }}
          >
            <Search size={13} color={t.textMuted} style={{ flexShrink: 0 }} />
            <input
              placeholder="Search…"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                fontSize: 12.5,
                color: t.text,
                width: "100%",
                fontFamily: t.font,
              }}
            />
            <kbd
              style={{
                fontSize: 10,
                color: t.textMuted,
                background: t.surface,
                border: `1px solid ${t.border}`,
                borderRadius: 4,
                padding: "1px 4px",
                fontFamily: t.font,
                flexShrink: 0,
              }}
            >
              ⌘K
            </kbd>
          </div>

          {/* Bell */}
          <button
            aria-label="Notifications"
            style={{
              position: "relative",
              width: 34,
              height: 34,
              borderRadius: 9,
              background: t.surface,
              border: `1px solid ${t.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Bell size={15} color={t.textSecondary} />
            <span
              style={{
                position: "absolute",
                top: 7,
                right: 8,
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: t.primary,
                border: `1.5px solid ${t.surface}`,
              }}
            />
          </button>

          {/* Profile */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              height: 34,
              padding: "0 10px 0 5px",
              borderRadius: 9,
              background: t.surface,
              border: `1px solid ${t.border}`,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "#111827",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>RP</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: t.text, whiteSpace: "nowrap" }}>
              Researcher
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
