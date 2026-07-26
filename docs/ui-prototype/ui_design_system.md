---
name: Recall AI Planner
version: "2.2"
description: >
  Design System for RecallAI — AI-powered learning planner.
  Calibrated from Figma exports. Light Mode + Dark Mode.
  8px grid · Geist typeface.
---

## 1. Colors

### Light Mode

| Role               | Hex       | Usage                                                     |
| ------------------ | --------- | --------------------------------------------------------- |
| **Primary**        | `#2563eb` | CTA buttons, active nav, progress bar, links              |
| **Primary Hover**  | `#1d4ed8` | Hover/pressed state of primary                            |
| **Primary Muted**  | `#dbeafe` | Sidebar active bg, "LEARNING" badge bg                    |
| **Secondary**      | `#6b7280` | Secondary text, inactive tabs                             |
| **Success**        | `#16a34a` | Strong mastery node (Mastered ≥80%), completed badge      |
| **Success Muted**  | `#dcfce7` | "Active" badge bg                                         |
| **Warning**        | `#ea580c` | Medium mastery node (Learning 60–80%)                     |
| **Warning Muted**  | `#ffedd5` | Warning badge bg                                          |
| **Danger**         | `#dc2626` | Weak mastery node (Needs Review <60%), destructive action |
| **Danger Muted**   | `#fee2e2` | Danger zone bg ("Reset all progress")                     |
| **Neutral**        | `#9ca3af` | Borders, placeholder text, disabled                       |
| **Neutral Muted**  | `#e5e7eb` | Dividers, input border default, track progress            |
| **Neutral Subtle** | `#f3f4f6` | Hover bg, sidebar item hover, day-column bg               |
| **Background**     | `#f3f4f6` | Main page background (light gray)                         |
| **Surface**        | `#ffffff` | Cards, Sidebar, Navbar bg                                 |
| **Text Primary**   | `#111827` | Headings, card titles                                     |
| **Text Secondary** | `#374151` | Body text, card descriptions                              |
| **Text Muted**     | `#6b7280` | Captions, section labels (WORKSPACE, INTELLIGENCE), dates |
| **Text Disabled**  | `#9ca3af` | Disabled state text                                       |
| **Border**         | `#e5e7eb` | Default card border, input border, dividers               |

### Dark Mode

| Role               | Hex       | Usage                              |
| ------------------ | --------- | ---------------------------------- |
| **Primary**        | `#3b82f6` | CTA buttons dark (1 shade lighter) |
| **Primary Hover**  | `#2563eb` | Hover dark                         |
| **Primary Muted**  | `#1e3a5f` | Sidebar active bg dark             |
| **Secondary**      | `#9ca3af` | Secondary text dark                |
| **Success**        | `#16a34a` | Strong mastery dark                |
| **Success Muted**  | `#14532d` | Success badge bg dark              |
| **Warning**        | `#ea580c` | Warning dark                       |
| **Warning Muted**  | `#7c2d12` | Warning badge bg dark              |
| **Danger**         | `#dc2626` | Danger dark                        |
| **Danger Muted**   | `#7f1d1d` | Danger zone bg dark                |
| **Neutral**        | `#6b7280` | Borders dark, placeholder          |
| **Neutral Muted**  | `#374151` | Dividers dark                      |
| **Neutral Subtle** | `#1f2937` | Hover bg dark                      |
| **Background**     | `#111827` | Main page background dark          |
| **Surface**        | `#1f2937` | Cards, Sidebar, Navbar bg dark     |
| **Text Primary**   | `#f9fafb` | Headings dark                      |
| **Text Secondary** | `#d1d5db` | Body text dark                     |
| **Text Muted**     | `#9ca3af` | Captions, labels dark              |
| **Text Disabled**  | `#6b7280` | Disabled dark                      |
| **Border**         | `#374151` | Default border dark                |

---

## 2. Typography

**Font family:** `Geist, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

| Style       | Size | Weight | Line Height | Letter Spacing | Usage                                        |
| ----------- | ---- | ------ | ----------- | -------------- | -------------------------------------------- |
| **H1**      | 24px | 700    | 32px        | -0.01em        | Page title ("Study Plans")                   |
| **H2**      | 20px | 600    | 28px        | —              | Large card title ("JavaScript Advanced")     |
| **H3**      | 16px | 600    | 24px        | —              | Section heading, panel title                 |
| **H4**      | 14px | 600    | 20px        | —              | Compact heading ("REVISION PROGRESS"), label |
| **Body**    | 16px | 400    | 24px        | —              | Main content, descriptions                   |
| **Body SM** | 14px | 400    | 20px        | —              | Card metadata, dates, breadcrumb             |
| **Caption** | 12px | 400    | 16px        | +0.04em        | "WORKSPACE", "INTELLIGENCE" — ALL CAPS       |
| **Label**   | 12px | 500    | 16px        | +0.02em        | Badge text, form labels                      |

---

## 3. Spacing & Grid

**Base unit: 8px**

| Token      | Value | Usage                                  |
| ---------- | ----- | -------------------------------------- |
| `space-1`  | 4px   | Icon gap, tight padding                |
| `space-2`  | 8px   | Button padding-y, item gap             |
| `space-3`  | 12px  | Input padding-y, compact card          |
| `space-4`  | 16px  | Card padding, sidebar item padding-x   |
| `space-5`  | 20px  | Section gap                            |
| `space-6`  | 24px  | Card padding (standard), modal padding |
| `space-8`  | 32px  | Between card groups                    |
| `space-10` | 40px  | Section-level spacing                  |
| `space-12` | 48px  | Page header gap                        |

**Grid:**

- Desktop (≥1024px): 12-column · margin 24px · gutter 16px
- Tablet (768–1023px): 8-column · margin 20px · gutter 16px
- Mobile (<768px): 4-column · margin 16px · gutter 12px

**Breakpoints:** `375px · 640px · 768px · 1024px · 1280px · 1440px`

**Border Radius:**

- `xs` = 4px — checkbox, small tag
- `sm` = 6px — badge pill (combined with `full`)
- `md` = 8px — button, input
- `card` = 12px — card, modal, concept node
- `full` = 9999px — badge/chip, avatar, progress bar

---

## 4. Components

### Button

Height: 36–40px (desktop) · 44px (mobile)
Radius: `md` (8px) · Min-width: 80px

#### Light Mode

| Variant         | Background  | Text      | Border        | Hover bg  |
| --------------- | ----------- | --------- | ------------- | --------- |
| **Primary**     | `#2563eb`   | `#ffffff` | —             | `#1d4ed8` |
| **Secondary**   | `#ffffff`   | `#374151` | 1px `#e5e7eb` | `#f3f4f6` |
| **Outline**     | transparent | `#2563eb` | 1px `#2563eb` | `#dbeafe` |
| **Ghost**       | transparent | `#374151` | —             | `#f3f4f6` |
| **Destructive** | `#dc2626`   | `#ffffff` | —             | `#b91c1c` |

#### Dark Mode

| Variant         | Background  | Text      | Border        | Hover bg  |
| --------------- | ----------- | --------- | ------------- | --------- |
| **Primary**     | `#3b82f6`   | `#ffffff` | —             | `#2563eb` |
| **Secondary**   | `#374151`   | `#d1d5db` | 1px `#4b5563` | `#4b5563` |
| **Outline**     | transparent | `#93c5fd` | 1px `#3b82f6` | `#1e3a5f` |
| **Ghost**       | transparent | `#d1d5db` | —             | `#374151` |
| **Destructive** | `#991b1b`   | `#fecaca` | —             | `#7f1d1d` |

#### States (all variants)

| State      | Behavior                                                    |
| ---------- | ----------------------------------------------------------- |
| `hover`    | Deepen bg/border according to the table above               |
| `active`   | `scale(0.97)` + deepen further                              |
| `focus`    | `box-shadow: 0 0 0 3px rgba(37,99,235,0.30)` — NEVER remove |
| `loading`  | Spinner centered · `pointer-events: none` · `opacity: 0.75` |
| `disabled` | `opacity: 0.40` · `cursor: not-allowed`                     |

---

### Input

Height: 40px · Radius: `md` (8px) · Padding: 8px 12px
Label: always visible above input — placeholder does NOT replace label

| State        | Light                                                      | Dark                                                        |
| ------------ | ---------------------------------------------------------- | ----------------------------------------------------------- |
| **Default**  | border `#e5e7eb` · bg `#ffffff` · text `#111827`           | border `#374151` · bg `#1f2937` · text `#f9fafb`            |
| **Focused**  | border `#2563eb` · shadow `0 0 0 3px rgba(37,99,235,0.30)` | border `#3b82f6` · shadow `0 0 0 3px rgba(59,130,246,0.40)` |
| **Error**    | border `#dc2626` · shadow `0 0 0 3px rgba(220,38,38,0.20)` | border `#dc2626`                                            |
| **Disabled** | bg `#f9fafb` · text `#9ca3af` · `cursor: not-allowed`      | bg `#111827` · text `#6b7280`                               |

Error message: displayed below input · caption typography · danger color

---

### Card

Radius: `card` (12px) · Padding: 16px · Default shadow: xs

| State       | Light                               | Dark                                |
| ----------- | ----------------------------------- | ----------------------------------- |
| **Default** | bg `#ffffff` · border 1px `#e5e7eb` | bg `#1f2937` · border 1px `#374151` |
| **Hover**   | `translateY(-2px)` · `shadow-md`    | `translateY(-2px)` · `shadow-md`    |

Shadow tokens:

- `shadow-xs`: `0 1px 2px rgba(0,0,0,0.05)` — default
- `shadow-sm`: `0 1px 3px rgba(0,0,0,0.08)` — navbar
- `shadow-md`: `0 4px 6px rgba(0,0,0,0.07)` — hover card
- `shadow-xl`: `0 20px 25px rgba(0,0,0,0.10)` — modal

---

### Badge / Chip

Shape: `full` (9999px) · Padding: 2px 8px · Typography: label (12px, 500)

| Variant                | Light bg  | Light text | Dark bg   | Dark text |
| ---------------------- | --------- | ---------- | --------- | --------- |
| **Primary** (LEARNING) | `#dbeafe` | `#2563eb`  | `#1e3a5f` | `#93c5fd` |
| **Success** (Active)   | `#dcfce7` | `#16a34a`  | `#14532d` | `#86efac` |
| **Warning**            | `#ffedd5` | `#ea580c`  | `#7c2d12` | `#fdba74` |
| **Danger**             | `#fee2e2` | `#dc2626`  | `#7f1d1d` | `#fca5a5` |
| **Neutral** (Draft)    | `#f3f4f6` | `#374151`  | `#374151` | `#9ca3af` |

---

### Sidebar

Width: 260px (desktop) · Drawer + overlay (mobile)

| Property        | Light                                                     | Dark                                                      |
| --------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| Background      | `#ffffff`                                                 | `#1f2937`                                                 |
| Border-right    | 1px `#e5e7eb`                                             | 1px `#374151`                                             |
| Section label   | `caption` · `#6b7280` · ALL CAPS                          | `caption` · `#9ca3af` · ALL CAPS                          |
| Item padding    | 8px 16px                                                  | 8px 16px                                                  |
| Hover item      | bg `#f3f4f6`                                              | bg `#374151`                                              |
| **Active item** | bg `#dbeafe` · text `#2563eb` · border-left 3px `#2563eb` | bg `#1e3a5f` · text `#3b82f6` · border-left 3px `#3b82f6` |

### Navbar

Height: 56px · sticky top-0 · z-index: 20

| Property      | Light         | Dark          |
| ------------- | ------------- | ------------- |
| Background    | `#ffffff`     | `#1f2937`     |
| Border-bottom | 1px `#e5e7eb` | 1px `#374151` |
| Shadow        | `shadow-sm`   | `shadow-sm`   |

---

### Modal / Dialog

Radius: `card` (12px) · Padding: 24px · Max-width: 560px (90vw mobile)
Must: `role="dialog"` · `aria-modal="true"` · focus trap · `Escape` to close

| Property   | Light                        | Dark                         |
| ---------- | ---------------------------- | ---------------------------- |
| Background | `#ffffff`                    | `#1f2937`                    |
| Shadow     | `shadow-xl`                  | `shadow-xl`                  |
| Backdrop   | `rgba(0,0,0,0.40)` — NO blur | `rgba(0,0,0,0.60)` — NO blur |
