---
name: Recall AI Planner
colors:
  surface: '#f8fafa'
  surface-dim: '#d8dada'
  surface-bright: '#f8fafa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f4'
  surface-container: '#eceeee'
  surface-container-high: '#e6e8e8'
  surface-container-highest: '#e1e3e3'
  on-surface: '#191c1d'
  on-surface-variant: '#404750'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#eff1f1'
  outline: '#717881'
  outline-variant: '#c0c7d2'
  surface-tint: '#00629e'
  primary: '#005082'
  on-primary: '#ffffff'
  primary-container: '#0069a8'
  on-primary-container: '#d0e5ff'
  inverse-primary: '#99cbff'
  secondary: '#5d5e60'
  on-secondary: '#ffffff'
  secondary-container: '#dfdfe0'
  on-secondary-container: '#616364'
  tertiary: '#005939'
  on-tertiary: '#ffffff'
  tertiary-container: '#00744c'
  on-tertiary-container: '#83fabe'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#99cbff'
  on-primary-fixed: '#001d34'
  on-primary-fixed-variant: '#004a78'
  secondary-fixed: '#e2e2e3'
  secondary-fixed-dim: '#c6c6c7'
  on-secondary-fixed: '#1a1c1d'
  on-secondary-fixed-variant: '#454748'
  tertiary-fixed: '#82f9be'
  tertiary-fixed-dim: '#65dca3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005234'
  background: '#ffffff'
  on-background: '#191c1d'
  surface-variant: '#e1e3e3'
  success: '#009966'
  warning: '#f79d00'
  danger: '#e7000b'
  text-primary: '#090b0c'
  text-muted: '#67787c'
  remediate: '#f47700'
typography:
  h1:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  h2:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  h3:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  h4:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  caption:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  quarter: 2px
  half: 4px
  base: 8px
  1.5x: 12px
  2x: 16px
  3x: 24px
  4x: 32px
  6x: 48px
  8x: 64px
---

## Brand & Style
The design system for this product is built on a **Corporate / Modern** foundation with a focus on cognitive clarity and educational efficiency. The brand personality is that of a reliable, intelligent mentor—professional yet approachable. It aims to evoke a sense of organized focus, reducing the "mental load" of the learner through a clean, systematic interface.

The visual style leverages high-quality typography and a spacious layout to maintain a calm atmosphere for deep learning. It uses subtle shadows and soft radii to create a tactile, approachable feel, while the use of OKLCH-derived colors ensures a vibrance that feels modern and high-tech without being overwhelming. The interface emphasizes "Mastery" through a clear semantic color language, allowing users to intuitively grasp their learning progress at a glance.

## Colors
The color palette is architected around a "Trust/AI" blue as the primary driver for action and brand recognition. Semantic colors are critical for this system, as they map directly to the "Mastery" levels of the AI planner:
- **Primary (#0069a8):** Used for main actions, active navigation states, and core branding.
- **Success (#009966):** Represents "Strong" mastery and positive progress.
- **Warning (#f79d00):** Represents "Learning" states or active focus sessions.
- **Danger (#e7000b):** Flags "Weak" mastery or destructive actions.
- **Neutral (#f1f3f3):** Used for surface accents and subtle borders.

The default mode is **Light**, utilizing a pure white background for maximum contrast and readability, while the dark mode (for late-night study) transitions to a deep Navy (#090b0c) to minimize eye strain.

## Typography
This design system utilizes the **Geist** font family exclusively. This mono-linear, high-legibility typeface bridges the gap between technical precision and human readability. 

The hierarchy is structured to support information-dense environments. Bold H1s are reserved for page entry points, while H3 and H4 roles handle the majority of card-based titling. Body text is set with a generous 150% line height to ensure long-form educational content is comfortable to consume. On mobile devices, H1 should scale down slightly to avoid excessive wrapping, while body sizes remain constant for accessibility.

## Layout & Spacing
The layout follows a **8px base unit** spacing rhythm. This ensures mathematical harmony across all components and viewports. 

A **12-column fluid grid** is recommended for desktop views, transitioning to a **4-column grid** for mobile. 
- **Margins:** 24px (Desktop) / 16px (Mobile).
- **Gutters:** 16px constant.
- **Component Spacing:** Use `base (8px)` for internal element grouping and `2x (16px)` or `3x (24px)` for section-level spacing.

Cards and content containers should utilize the `3x (24px)` padding value to maintain a premium, airy feel that prevents the UI from feeling cluttered during intensive study sessions.

## Elevation & Depth
Elevation is conveyed through a mix of **Tonal Layers** and **Ambient Shadows**. 

The background is kept flat white, with cards and "Mastery Nodes" sitting just above the surface. 
- **Default State:** A very soft, low-opacity shadow (`0px 1px 2px rgba(0,0,0,0.05)`) provides a slight lift.
- **Interaction/Hover:** For interactive elements like cards, the shadow deepens and diffuses (`0px 4px 6px rgba(0,0,0,0.1)`) accompanied by a subtle -2px Y-axis translation to simulate physical lifting.
- **Modals:** Use a **Glassmorphism** approach for the backdrop, featuring a 10% black overlay with a backdrop-blur effect (8px-12px blur radius) to focus the user's attention on the dialog without losing environmental context.

## Shapes
The shape language is deliberately soft to counteract the "strictness" often associated with AI and learning. 
- **Small (8px):** Applied to utility components like checkboxes and small decorative accents.
- **Medium (11px):** The standard for action-oriented elements including Buttons and Input fields. This specific radius creates a distinct, custom feel.
- **Large (14px):** Used for the primary containers of the system—Cards, Modals, and the "Mastery Concept Nodes."
- **Pill (9999px):** Reserved strictly for Badges and Chips to differentiate them as status indicators rather than interactive buttons.

## Components

### Buttons
- **Primary:** Solid #0069a8 background, white text. Hover state deepens the blue slightly.
- **Secondary:** Neutral #f4f4f5 background, #090b0c text.
- **Outline:** 1px border using #f1f3f3, transparent background.
- **Destructive:** Solid #e7000b background.
- **Loading:** Use the current button variant with a centered spinner icon; disable pointer events.
- **Radius:** Always 11px.

### Input Fields
- **Default:** 1px border (#f1f3f3), 11px radius, 8px/12px padding.
- **Focused:** Border color transitions to #9ca8ab (Text Muted) with a subtle ring glow.
- **Error:** Border color changes to #e7000b.

### Mastery Concept Nodes
These are specialized cards representing learning units:
- **Strong:** Success green border/accent.
- **Learning:** Warning yellow border/accent.
- **Weak:** Danger red border/accent.
- **Untested:** Neutral gray border/accent.
- **Radius:** 14px for a soft, approachable card appearance.

### Badges
- **Style:** Pill-shaped (9999px), high-contrast text on a lightened version of the semantic color.
- **Variants:** Primary, Success, Warning, Danger, Neutral.

### Sidebar & Navbar
- Use the **Secondary** or **Neutral** colors for background surfaces to distinguish from the primary white content area.
- Active links should use the **Primary** blue for both the icon/text and a subtle vertical indicator bar.

### Dialog / Modal
- Content boxes must have **24px padding** and **14px radius**. 
- The backdrop must feature a 10% black overlay with **backdrop-blur**.