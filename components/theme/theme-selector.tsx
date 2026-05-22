"use client";

import { useTheme, THEMES, type ThemeName } from "./theme-provider";
import { Check, Palette } from "lucide-react";

export function ThemeSelector() {
  const { theme, themeName, setTheme, themes } = useTheme();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
        <Palette className="w-4 h-4" />
        Theme
      </div>
      <div className="grid grid-cols-1 gap-2">
        {themes.map((t) => {
          const config = THEMES[t];
          const isActive = themeName === t;
          return (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                isActive
                  ? "border-[var(--hv-accent)] bg-[var(--hv-accent)]/5"
                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div
                className="w-8 h-8 rounded-full shrink-0"
                style={{ background: `linear-gradient(135deg, ${config.accent}, ${config.accentLight})` }}
              />
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${isActive ? "text-[var(--hv-accent)]" : "text-gray-900"}`}>
                  {config.name}
                </div>
                <div className="text-xs text-gray-400 truncate">{config.description}</div>
              </div>
              {isActive && <Check className="w-4 h-4 text-[var(--hv-accent)] shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ThemeSwatch({ name, onClick }: { name: ThemeName; onClick?: () => void }) {
  const config = THEMES[name];
  return (
    <button
      onClick={onClick}
      className="w-6 h-6 rounded-full border border-white/10 transition-transform hover:scale-110"
      style={{ background: config.accent }}
      title={config.name}
    />
  );
}
