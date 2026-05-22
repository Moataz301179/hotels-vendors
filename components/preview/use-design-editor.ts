import { useState, useCallback } from "react";

export interface DesignConfig {
  heroBg: string;
  heroAccent: string;
  accentColor: string;
  accentDark: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  canvasBg: string;
  sectionPadding: number;
  cardRadius: number;
  fontSizeHero: number;
  fontSizeSection: number;
  fontSizeBody: number;
  showPlatform: boolean;
  showWorkflow: boolean;
  showCoverage: boolean;
  showModules: boolean;
  showTrust: boolean;
  showCTA: boolean;
}

export const DEFAULT_CONFIG: DesignConfig = {
  heroBg: "#050505",
  heroAccent: "#8b5cf6",
  accentColor: "#8b5cf6",
  accentDark: "#6d28d9",
  cardBg: "rgba(255,255,255,0.02)",
  cardBorder: "rgba(255,255,255,0.06)",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.50)",
  textMuted: "rgba(255,255,255,0.30)",
  canvasBg: "#050505",
  sectionPadding: 96,
  cardRadius: 16,
  fontSizeHero: 64,
  fontSizeSection: 36,
  fontSizeBody: 15,
  showPlatform: true,
  showWorkflow: true,
  showCoverage: true,
  showModules: true,
  showTrust: true,
  showCTA: true,
};

export function useDesignEditor() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<DesignConfig>(DEFAULT_CONFIG);

  const update = useCallback((patch: Partial<DesignConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => setConfig(DEFAULT_CONFIG), []);

  const exportConfig = useCallback(() => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "design-config.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [config]);

  const applyStyles = useCallback(() => {
    const root = document.documentElement;
    root.style.setProperty("--preview-hero-bg", config.heroBg);
    root.style.setProperty("--preview-accent", config.accentColor);
    root.style.setProperty("--preview-accent-dark", config.accentDark);
    root.style.setProperty("--preview-canvas", config.canvasBg);
    root.style.setProperty("--preview-card-bg", config.cardBg);
    root.style.setProperty("--preview-card-border", config.cardBorder);
    root.style.setProperty("--preview-text-primary", config.textPrimary);
    root.style.setProperty("--preview-text-secondary", config.textSecondary);
    root.style.setProperty("--preview-text-muted", config.textMuted);
    root.style.setProperty("--preview-section-padding", `${config.sectionPadding}px`);
    root.style.setProperty("--preview-card-radius", `${config.cardRadius}px`);
    root.style.setProperty("--preview-font-hero", `${config.fontSizeHero}px`);
    root.style.setProperty("--preview-font-section", `${config.fontSizeSection}px`);
    root.style.setProperty("--preview-font-body", `${config.fontSizeBody}px`);
  }, [config]);

  return { open, setOpen, config, update, reset, exportConfig, applyStyles };
}
