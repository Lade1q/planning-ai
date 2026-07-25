# RecallAI — Design Handoff

> **Single source of truth** for the Frontend team. Use this document to map Figma designs to code without needing to open Figma for every token.

---

## Figma Source File

| Item                     | Link                                                                                                                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Figma File**           | [RecallAI — Figma Design](https://www.figma.com/design/Xw978kqnMs9efJNzrSTPJf/RecallAI?node-id=1-4&t=1UhucRL5Y9jeZb4e-1) |
| **Access Level**         | View-only (request edit access from Design team)                                                                         |
| **Screens to implement** | All frames ending in `--lightmode` (primary) and `--darkmode` (dark mode variant)                                        |

---

## Color Palette

### Light Mode

| Role               | Hex       | CSS Variable             | Usage                                                     |
| ------------------ | --------- | ------------------------ | --------------------------------------------------------- |
| **Primary**        | `#2563eb` | `--color-primary`        | CTA buttons, active nav, progress bar, links              |
| **Primary Hover**  | `#1d4ed8` | `--color-primary-hover`  | Hover / pressed state of primary                          |
| **Primary Muted**  | `#dbeafe` | `--color-primary-muted`  | Sidebar active bg, "LEARNING" badge bg                    |
| **Secondary**      | `#6b7280` | `--color-secondary`      | Secondary text, inactive tabs                             |
| **Success**        | `#16a34a` | `--color-success`        | Mastered node (≥80%), completed badge                     |
| **Success Muted**  | `#dcfce7` | `--color-success-muted`  | "Active" badge bg                                         |
| **Warning**        | `#ea580c` | `--color-warning`        | Medium mastery node (Learning 60–80%)                     |
| **Warning Muted**  | `#ffedd5` | `--color-warning-muted`  | Warning badge bg                                          |
| **Danger**         | `#dc2626` | `--color-danger`         | Weak mastery node (<60%), destructive action              |
| **Danger Muted**   | `#fee2e2` | `--color-danger-muted`   | Danger zone bg ("Reset all progress")                     |
| **Neutral**        | `#9ca3af` | `--color-neutral`        | Borders, placeholder text, disabled                       |
| **Neutral Muted**  | `#e5e7eb` | `--color-neutral-muted`  | Dividers, input border default, track progress            |
| **Neutral Subtle** | `#f3f4f6` | `--color-neutral-subtle` | Hover bg, sidebar item hover, day-column bg               |
| **Background**     | `#f3f4f6` | `--color-background`     | Main page background (light gray)                         |
| **Surface**        | `#ffffff` | `--color-surface`        | Cards, Sidebar, Navbar bg                                 |
| **Text Primary**   | `#111827` | `--color-text-primary`   | Headings, card titles                                     |
| **Text Secondary** | `#374151` | `--color-text-secondary` | Body text, card descriptions                              |
| **Text Muted**     | `#6b7280` | `--color-text-muted`     | Captions, section labels (WORKSPACE, INTELLIGENCE), dates |
| **Text Disabled**  | `#9ca3af` | `--color-text-disabled`  | Disabled state text                                       |
| **Border**         | `#e5e7eb` | `--color-border`         | Default card border, input border, dividers               |

### Dark Mode

| Role               | Hex       | CSS Variable             | Usage                              |
| ------------------ | --------- | ------------------------ | ---------------------------------- |
| **Primary**        | `#3b82f6` | `--color-primary`        | CTA buttons dark (1 shade lighter) |
| **Primary Hover**  | `#2563eb` | `--color-primary-hover`  | Hover dark                         |
| **Primary Muted**  | `#1e3a5f` | `--color-primary-muted`  | Sidebar active bg dark             |
| **Secondary**      | `#9ca3af` | `--color-secondary`      | Secondary text dark                |
| **Success**        | `#16a34a` | `--color-success`        | Strong mastery dark                |
| **Success Muted**  | `#14532d` | `--color-success-muted`  | Success badge bg dark              |
| **Warning**        | `#ea580c` | `--color-warning`        | Warning dark                       |
| **Warning Muted**  | `#7c2d12` | `--color-warning-muted`  | Warning badge bg dark              |
| **Danger**         | `#dc2626` | `--color-danger`         | Danger dark                        |
| **Danger Muted**   | `#7f1d1d` | `--color-danger-muted`   | Danger zone bg dark                |
| **Neutral**        | `#6b7280` | `--color-neutral`        | Borders dark, placeholder          |
| **Neutral Muted**  | `#374151` | `--color-neutral-muted`  | Dividers dark                      |
| **Neutral Subtle** | `#1f2937` | `--color-neutral-subtle` | Hover bg dark                      |
| **Background**     | `#111827` | `--color-background`     | Main page background dark          |
| **Surface**        | `#1f2937` | `--color-surface`        | Cards, Sidebar, Navbar bg dark     |
| **Text Primary**   | `#f9fafb` | `--color-text-primary`   | Headings dark                      |
| **Text Secondary** | `#d1d5db` | `--color-text-secondary` | Body text dark                     |
| **Text Muted**     | `#9ca3af` | `--color-text-muted`     | Captions, labels dark              |
| **Text Disabled**  | `#6b7280` | `--color-text-disabled`  | Disabled dark                      |
| **Border**         | `#374151` | `--color-border`         | Default border dark                |

---

## Typography

**Font family:** `Geist, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

> Install via: [Geist on Vercel](https://vercel.com/font) or use the `geist` npm package.

### Type Scale

| Style       | Size | Weight | Line Height | Letter Spacing | Usage                                             |
| ----------- | ---- | ------ | ----------- | -------------- | ------------------------------------------------- |
| **H1**      | 24px | 700    | 32px        | -0.01em        | Page title (e.g. "Study Plans")                   |
| **H2**      | 20px | 600    | 28px        | —              | Large card title (e.g. "JavaScript Advanced")     |
| **H3**      | 16px | 600    | 24px        | —              | Section heading, panel title                      |
| **H4**      | 14px | 600    | 20px        | —              | Compact heading ("REVISION PROGRESS"), form label |
| **Body**    | 16px | 400    | 24px        | —              | Main content, descriptions                        |
| **Body SM** | 14px | 400    | 20px        | —              | Card metadata, dates, breadcrumb                  |
| **Caption** | 12px | 400    | 16px        | +0.04em        | Section group labels — always ALL CAPS            |
| **Label**   | 12px | 500    | 16px        | +0.02em        | Badge text, form field labels                     |

### Tailwind CSS Config Snippet

```js
// tailwind.config.js
fontFamily: {
  sans: ['Geist', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
},
fontSize: {
  h1:       ['24px', { lineHeight: '32px', fontWeight: '700', letterSpacing: '-0.01em' }],
  h2:       ['20px', { lineHeight: '28px', fontWeight: '600' }],
  h3:       ['16px', { lineHeight: '24px', fontWeight: '600' }],
  h4:       ['14px', { lineHeight: '20px', fontWeight: '600' }],
  body:     ['16px', { lineHeight: '24px', fontWeight: '400' }],
  'body-sm':['14px', { lineHeight: '20px', fontWeight: '400' }],
  caption:  ['12px', { lineHeight: '16px', fontWeight: '400', letterSpacing: '0.04em' }],
  label:    ['12px', { lineHeight: '16px', fontWeight: '500', letterSpacing: '0.02em' }],
},
```

---

## Spacing & Grid

| Token      | Value | Tailwind          | Usage                                  |
| ---------- | ----- | ----------------- | -------------------------------------- |
| `space-1`  | 4px   | `p-1` / `gap-1`   | Icon gap, tight padding                |
| `space-2`  | 8px   | `p-2` / `gap-2`   | Button padding-y, item gap             |
| `space-3`  | 12px  | `p-3` / `gap-3`   | Input padding-y, compact card          |
| `space-4`  | 16px  | `p-4` / `gap-4`   | Card padding, sidebar item padding-x   |
| `space-5`  | 20px  | `p-5` / `gap-5`   | Section gap                            |
| `space-6`  | 24px  | `p-6` / `gap-6`   | Card padding (standard), modal padding |
| `space-8`  | 32px  | `p-8` / `gap-8`   | Between card groups                    |
| `space-10` | 40px  | `p-10` / `gap-10` | Section-level spacing                  |
| `space-12` | 48px  | `p-12` / `gap-12` | Page header gap                        |

**Border Radius:**

| Token  | Value  | Usage                            |
| ------ | ------ | -------------------------------- |
| `xs`   | 4px    | Checkbox, small tag              |
| `sm`   | 6px    | Badge pill (with `full`)         |
| `md`   | 8px    | Button, input                    |
| `card` | 12px   | Card, modal, concept node        |
| `full` | 9999px | Badge/chip, avatar, progress bar |

---

## Component → shadcn/ui Mapping

| Figma Component      | shadcn/ui Component              | Notes                             |
| -------------------- | -------------------------------- | --------------------------------- |
| Primary Button       | `<Button>`                       | variant="default"                 |
| Secondary Button     | `<Button variant="secondary">`   |                                   |
| Outline Button       | `<Button variant="outline">`     |                                   |
| Ghost Button         | `<Button variant="ghost">`       |                                   |
| Destructive Button   | `<Button variant="destructive">` |                                   |
| Text Input           | `<Input>`                        | Always show label above           |
| Plan Card            | `<Card>` + `<CardContent>`       | radius 12px                       |
| Badge / Chip         | `<Badge>`                        | variant per mastery level         |
| Sidebar Nav          | `<NavigationMenu>` + custom      | 260px fixed width                 |
| Top Navbar           | Custom sticky header             | height 56px                       |
| Modal / Dialog       | `<Dialog>`                       | max-w-[560px], blur-none backdrop |
| Concept Graph        | `react-flow`                     | custom node colors per mastery    |
| Date Picker          | `<Calendar>` + `<Popover>`       |                                   |
| Progress Bar         | `<Progress>`                     | custom color via CSS var          |
| Toast / Notification | `<Toast>`                        |                                   |

---

## Screen Gallery

### Light Mode Screens

**Study Plans — Main List**
![Study Plans (Light)](./Recall%20AI-figma-light_mode/study%20plans--lightmode.png)

**Study Plans — Concept Graph**
![Concept Graph (Light)](./Recall%20AI-figma-light_mode/study%20plans-concept%20graph--lightmode.png)

**Concept Graph — Filter: All**
![Concept Graph Filter All (Light)](./Recall%20AI-figma-light_mode/study%20plans-concept%20graph-filter-all--lightmode.png)

**Concept Graph — Filter: Not Reviewed**
![Concept Graph Filter Not Reviewed (Light)](./Recall%20AI-figma-light_mode/study%20plans-concept%20graph-filter-not%20reviewed--lightmode.png)

**Concept Graph — Filter: Weak**
![Concept Graph Filter Weak (Light)](./Recall%20AI-figma-light_mode/study%20plans-concept%20graph-filter-weak--lightmode.png)

**Create New Study Plan — Info Step**
![Create Study Plan Info (Light)](./Recall%20AI-figma-light_mode/study%20plans-create%20new%20study%20plan-info--lightmode.png)

**Create New Study Plan — Verify Step**
![Create Study Plan Verify (Light)](./Recall%20AI-figma-light_mode/study%20plans-create%20new%20study%20plan-verify--lightmode.png)

**Create New Study Plan — Edit Concept**
![Create Study Plan Edit Concept (Light)](./Recall%20AI-figma-light_mode/study%20plans-create%20new%20study%20plan-verify-edit%20concept--lightmode.png)

**Review Schedule**
![Review Schedule (Light)](./Recall%20AI-figma-light_mode/study%20plans-review%20schedule--lightmode.png)

**Successfully Created Graph**
![Successfully Created Graph (Light)](./Recall%20AI-figma-light_mode/study%20plans-successfully%20created%20graph--lightmode.png)

**Successfully Created Graph — Detailed Definition**
![Graph Detailed Definition (Light)](./Recall%20AI-figma-light_mode/study%20plans-successfully%20created%20graph-detailed%20definition--lightmode.png)

**Update Document**
![Update Document (Light)](./Recall%20AI-figma-light_mode/study%20plans-update%20document--lightmode.png)

**Update Document — Confirm**
![Update Document Confirm (Light)](./Recall%20AI-figma-light_mode/study%20plans-update%20document-confirm--lightmode.png)

---

### Dark Mode Screens

**Study Plans — Main List**
![Study Plans (Dark)](./Recall%20AI-figma-dark_mode/study%20plans--darkmode.png)

**Concept Graph — Filter: All**
![Concept Graph Filter All (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-concept%20graph-filter-all--darkmode.png)

**Concept Graph — Filter: Not Reviewed**
![Concept Graph Filter Not Reviewed (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-concept%20graph-filter-not%20reviewed--darkmode.png)

**Concept Graph — Filter: Weak**
![Concept Graph Filter Weak (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-concept%20graph-filter-weak--darkmode.png)

**Create New Study Plan — Info Step**
![Create Study Plan Info (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-create%20new%20study%20plan-info--darkmode.png)

**Create New Study Plan — Verify Step**
![Create Study Plan Verify (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-create%20new%20study%20plan-verify--darkmode.png)

**Create New Study Plan — Edit Concept**
![Create Study Plan Edit Concept (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-create%20new%20study%20plan-verify-edit%20concept--darkmode.png)

**Review Schedule**
![Review Schedule (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-review%20schedule--darkmode.png)

**Successfully Created Graph**
![Successfully Created Graph (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-successfully%20created%20graph--darkmode.png)

**Successfully Created Graph — Detailed Definition**
![Graph Detailed Definition (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-successfully%20created%20graph-detailed%20definition--darkmode.png)

**Successfully Created Graph — Edit Definition**
![Graph Edit Definition (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-successfully%20created%20graph-edit%20definition--darkmode.png)

**Update Document**
![Update Document (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-update%20document--darkmode.png)

**Update Document — Confirm**
![Update Document Confirm (Dark)](./Recall%20AI-figma-dark_mode/study%20plans-update%20document-confirm--darkmode.png)

---
