# UI DESIGN TOKENS — UNIFIED (Invo Mobile + HotelsVendors Web)

> Canonical brand spec for BOTH apps. Replaces the orange `--accent-base` family
> (web globals.css) and the green `#39FF7E` (mobile theme). Decided 2026-08-04.
> Motto: institutional-grade, grey/white hierarchy, ONE restrained accent, zero neon,
> zero gradients-as-backgrounds. This is what kills the "generic AI look."

## Brand
- **Logo:** HotelsVendors logo + wordmark EVERYWHERE (web hero, mobile splash/header/auth).
- **Sub-brand:** mobile product is called **Invo** as text wordmark under the HV logo
  (no separate Invo logo mark, no separate Invo color).
- **Oliv:** the Oliv logo appears ONLY on the `/financing/oliv` partner page (web).
  Nowhere in heroes, dashboards, or the mobile app. (Oliv referral stays CHV000.)
- **Deprecated tokens (must die in both apps):** orange `#ff7e1a` family,
  `--purple-base`, `--accent-muted` orange, green `#39FF7E`. All status colors stay
  semantic only (success/warning/error/info), never brand.

## Surfaces — TWO VARIANTS (decided 2026-08-04)
**Invo mobile = Variant A (grey/black, dark institutional — G7 glass).**
**HotelsVendors web = Variant B (grey/white, light institutional).**
Same accent, same type/radius/spacing scales on both. No mixing within an app.

### Variant A — mobile (dark, G7 dark glassmorphism)
| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#0B0D12` | app background (near-black grey, not pure black) |
| `--bg-elevated` | `rgba(255,255,255,0.04)` | cards, glass panels |
| `--bg-elevated-hover` | `rgba(255,255,255,0.08)` | hover/interactive glass |
| `--bg-input` | `rgba(255,255,255,0.06)` | inputs |
| `--surface` | `#FFFFFF` | solid white surfaces (buttons on accent) |
| `--border` | `rgba(255,255,255,0.10)` | hairline borders |
| `--border-strong` | `rgba(255,255,255,0.16)` | focus/active borders |
| `--text-primary` | `#F2F4F8` | headings, primary |
| `--text-secondary` | `rgba(242,244,248,0.72)` | body |
| `--text-muted` | `rgba(242,244,248,0.48)` | captions, placeholders |
| `--text-inverse` | `#0B0D12` | text on solid white |

### Variant B — web (light institutional)
| Token | Value | Use |
|---|---|---|
| `--bg-base` | `#F6F7F9` | page background (light grey) |
| `--bg-elevated` | `#FFFFFF` | cards, panels |
| `--bg-elevated-hover` | `#EFF1F4` | hover surfaces |
| `--bg-input` | `#FFFFFF` | inputs |
| `--surface` | `#0B0D12` | solid dark surfaces (primary buttons) |
| `--border` | `#E4E7EC` | hairline borders |
| `--border-strong` | `#C9CEDA` | focus/active borders |
| `--text-primary` | `#1A1D23` | headings, primary |
| `--text-secondary` | `rgba(26,29,35,0.72)` | body |
| `--text-muted` | `rgba(26,29,35,0.48)` | captions, placeholders |
| `--text-inverse` | `#FFFFFF` | text on dark surfaces |

## THE single restrained accent
| Token | Value | Use |
|---|---|---|
| `--accent-base` | `#4F6BFF` | ONE accent: primary CTA, active tab, focus ring, key links |
| `--accent-hover` | `#6B84FF` | hover state of accent |
| `--accent-soft` | `rgba(79,107,255,0.12)` | accent-tinted backgrounds, pill fills |
| `--accent-rgb` | `79,107,255` | for alpha utilities (`rgba(var(--accent-rgb),0.25)`) |

Accent usage rule: accent is ≤5% of any screen's painted pixels. It marks the ONE
primary action, never decorates. Layout, density, and type carry the identity.
On Variant B (light web) the accent `#4F6BFF` must hold ≥4.5:1 contrast against
`#FFFFFF` buttons' text (use `--text-inverse`).

## Semantic status (never brand)
| Token | Value |
|---|---|
| `--success` | `#22C55E` |
| `--warning` | `#F59E0B` |
| `--error` | `#EF4444` |
| `--info` | `#3B82F6` |

## Type (both apps)
- Scale: 11 / 13 / 15 / 18 / 22 / 28 (caption → h1), tight tracking on headings
  (-0.5px), system font stack (SF / Roboto). No display font, no weight >700 except
  big numerals (stat/timeline counters).
- Mobile `src/theme/index.ts` typography block mirrors this exactly (already close).

## Radius / spacing (both apps)
- Radii: sm 8 / md 12 / lg 16 / xl 20 / full 999 (matches mobile theme).
- Spacing scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 (matches mobile theme).

## Migration notes
- Web (Variant B light): redefine the token map in `app/globals.css` (orange → above light
  map), then grep-and-replace every `--accent-base`, `--purple-base`, `--accent-muted`, and raw
  orange hex across components. This is a dark→light flip: check `--text-*` inverse pairs and
  glass cards (`bg-white/5` → solid white). RBAC/functionality untouched — colors only.
- Mobile (Variant A dark): rewrite `src/theme/index.ts` to the dark map (delete green), then
  restyle screens from tokens only (see UI_RESEARCH_REDESIGN_TOOL.md).
- DoD proof in both: `grep -rn "#ff7e1a\|#39FF7E\|purple" src/ app/` returns nothing except
  semantic status + the Olivier partner page.
