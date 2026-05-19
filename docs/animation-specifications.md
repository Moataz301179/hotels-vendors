# Animation Specifications — Enterprise OLED Design System

## Overview

This document defines the enterprise-grade micro-interaction specifications for the Hotels Vendors platform. All animations are designed for OLED displays with accessibility in mind.

---

## Animation Philosophy

**"Invisible Motion"** — Animations should guide, not distract. Every motion serves a purpose.

### Principles
1. **Purposeful** — Every animation solves a UX problem
2. **Performant** — GPU-accelerated, 60fps consistently
3. **Accessible** — Respects `prefers-reduced-motion`
4. **Consistent** — Same easing and duration patterns throughout

---

## Easing Functions

| Name | CSS Value | Use Case |
|------|-----------|----------|
| **Enterprise** | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary transitions, UI reveals (expo-out) |
| **Premium** | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Smooth deceleration for natural motion |
| **Spring** | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bouncy micro-interactions (page elements) |
| **Linear** | `linear` | Continuous animations (spinners, progress) |

### Implementation
```css
:root {
  --ease-enterprise: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-premium: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## Duration Scale

| Token | Value | Use Case |
|-------|-------|----------|
| `--duration-fast` | 150ms | Hover states, immediate feedback |
| `--duration-normal` | 200ms | Micro-interactions, button presses |
| `--duration-premium` | 300ms | Page transitions, card reveals |
| `--duration-slow` | 400ms | Toast messages, modals |
| `--duration-enter` | 500ms | Full-page entrances |

---

## Micro-interactions

### Button Interactions

#### Primary Button
```
Default State:
- Background: gradient to #8B0000
- Shadow: 0 1px 2px rgba(0,0,0,0.3)

Hover State (200ms, ease-enterprise):
- translateY: -1px
- Shadow: 0 4px 16px rgba(139,0,0,0.4)
- Border brightness increased

Active State (100ms, ease-enterprise):
- scale: 0.98
- translateY: 0
- Shadow reduced

Focus State:
- ring: 2px solid var(--crimson-primary)
- ring-offset: 2px
```

#### Ghost Button
```
Hover State (200ms):
- Background: rgba(255,255,255,0.03)
- Border: var(--border-default)
- Text: white
```

### Card Interactions

#### Enterprise Card (Hover)
```
Duration: 300ms
Easing: --ease-enterprise

Transformations:
- translateY: -2px
- Border: var(--border-enterprise-visible)
- Background: var(--oled-raised)
- Shadow: 0 8px 32px rgba(0,0,0,0.4)
```

#### Press State
```
Duration: 100ms
- scale: 0.99
- translateY: 0
```

---

## Entrance Animations

### Fade Up (Primary Entrance)
```css
@keyframes enterpriseFadeUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```
- **Duration**: 500ms
- **Easing**: --ease-enterprise
- **Use**: Hero elements, main content

### Scale In (Modals, Dialogs)
```css
@keyframes enterpriseScaleIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```
- **Duration**: 300ms
- **Easing**: --ease-spring
- **Use**: Modals, popovers, notifications

### Slide In (Side Panels)
```css
@keyframes enterpriseSlideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```
- **Duration**: 200ms
- **Easing**: --ease-enterprise
- **Use**: Sidebar, navigation, drawers

### Count Up (Metrics)
```css
@keyframes countUpPremium {
  from {
    opacity: 0;
    transform: translateY(10px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
```
- **Duration**: 600ms
- **Easing**: --ease-enterprise
- **Use**: Statistics, KPI cards

---

## Continuous Animations

### Loading Skeleton Shimmer
```css
@keyframes shimmerPremium {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```
- **Duration**: 2s
- **Timing**: linear
- **Use**: Loading states, skeleton screens

### Glow Pulse
```css
@keyframes glowPulsePremium {
  0%, 100% { box-shadow: 0 0 20px rgba(139,0,0,0.15); }
  50% { box-shadow: 0 0 32px rgba(139,0,0,0.25); }
}
```
- **Duration**: 3s
- **Timing**: ease-in-out
- **Use**: Active states, CTA emphasis

### Dot Pulse (Status Indicators)
```css
@keyframes dotPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.2); }
}
```
- **Duration**: 2s
- **Timing**: ease-in-out
- **Use**: Live status indicators, syncing states

---

## Stagger Patterns

### List Items
```css
.stagger-enterprise > *:nth-child(n) {
  animation-delay: calc((n - 1) * 50ms);
}
```
- **Base delay**: 50ms between items
- **Maximum items**: 10 visible at once

### Bento Grid
```css
/* 2-column stagger */
grid-item:nth-child(odd) { animation-delay: 0ms; }
grid-item:nth-child(even) { animation-delay: 80ms; }
```

---

## Interaction Patterns

### Hover → Click Sequence
```
1. Mouse Enter (0ms)
   - Start hover transition (200ms)
   
2. Mouse Down (Xms)
   - Cancel hover
   - Start active state (100ms)
   
3. Mouse Up (X+Yms)
   - Trigger action
   - Return to hover/final state (200ms)
```

### Sequential Animations
```
Page Load Sequence:
├─ 0ms:    Skeleton appears
├─ 100ms:  Header fades in (fadeIn, 200ms)
├─ 200ms:  Content cards stagger in (fadeUp, 300ms each, 80ms delay)
├─ 600ms:  Stats counter animates (countUp, 600ms)
└─ 1000ms: Interactive elements become active
```

---

## Accessibility

### Reduced Motion Support
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Focus Indicators
- Always visible focus rings
- 2px solid outline with 2px offset
- High contrast against background

---

## Performance Guidelines

### GPU-Accelerated Properties
✅ **Use these for animations:**
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (with caution)

❌ **Avoid animating:**
- `width`, `height`, `top`, `left`
- `margin`, `padding`
- `border-width`

### Will-Change Usage
```css
/* Apply before animation starts */
.animating {
  will-change: transform, opacity;
}

/* Remove after animation completes */
.animation-complete {
  will-change: auto;
}
```

---

## Implementation Classes

### Available CSS Classes
```css
/* Animation triggers */
.an-enterprise-fade-up    /* Fade up entrance */
.an-enterprise-fade-in    /* Simple fade in */
.an-enterprise-scale-in   /* Scale entrance */
.an-enterprise-slide-in   /* Slide from left */
.an-glow-pulse            /* Continuous glow */
.an-shimmer               /* Loading shimmer */
.an-count-up              /* Counter animation */

/* Stagger groups */
.stagger-enterprise       /* Standard stagger */
.stagger-fast             /* 40ms delay */
.stagger-slow             /* 80ms delay */
```

### Tailwind Integration
```jsx
<button className="transition-all duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98]">
  Action
</button>

<Card className="transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
  Content
</Card>
```

---

## Best Practices

### Do
- ✅ Use consistent durations (150ms, 200ms, 300ms, 400ms)
- ✅ Use `--ease-enterprise` for 90% of transitions
- ✅ Test at 60fps on mobile OLED displays
- ✅ Respect `prefers-reduced-motion`
- ✅ Provide focus indicators

### Don't
- ❌ Animate expensive properties (layout triggers)
- ❌ Use random durations
- ❌ Over-animate — keep it minimal
- ❌ Ignore reduced motion preferences
- ❌ Create animations longer than 500ms

---

## Testing Checklist

- [ ] Animations run at 60fps on mobile devices
- [ ] Reduced motion preference disables animations
- [ ] Focus rings visible on keyboard navigation
- [ ] No layout thrashing during animations
- [ ] Animation completes before user can interact
- [ ] Loading states have clear progress indication

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-05-19 | Initial enterprise animation specifications |

*Last Updated: 2026-05-19*
*Owner: UI Design Team*
*Status: Approved for Implementation*
