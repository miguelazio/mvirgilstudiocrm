---
name: Architectural Noir
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c7c6c4'
  on-secondary: '#303130'
  secondary-container: '#464746'
  on-secondary-container: '#b5b5b3'
  tertiary: '#d0cdcd'
  on-tertiary: '#313030'
  tertiary-container: '#b4b2b2'
  on-tertiary-container: '#454544'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e3e2e0'
  secondary-fixed-dim: '#c7c6c4'
  on-secondary-fixed: '#1b1c1b'
  on-secondary-fixed-variant: '#464746'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-xl:
    fontFamily: Noto Serif
    fontSize: 80px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.0'
    letterSpacing: 0.15em
spacing:
  unit: 8px
  container-max: 1440px
  gutter: 32px
  margin-edge: 64px
  section-gap: 160px
---

## Brand & Style

This design system targets an elite demographic of developers, architects, and luxury real estate investors. The brand personality is authoritative, visionary, and hyper-exclusive. It bridges the gap between the physical and digital worlds (Phygital) by blending timeless architectural elegance with cutting-edge spatial technology.

The design style is **Technological Minimalism** fused with **High-Contrast Noir**. It prioritizes extreme negative space to allow 3D renders and architectural visualizations to breathe. The UI should evoke the feeling of a high-end physical gallery or a luxury timepiece: silent, precise, and undeniably premium. Use subtle motion and microscopic interactions to reinforce the technological aspect without sacrificing the understated elegance.

## Colors

The palette is rooted in a "Deep Black" (#0A0A0A) foundation to ensure absolute depth and focus on visual assets. 

- **Primary (Champagne Gold):** Used sparingly for call-to-actions, active states, and critical highlights. It represents luxury and the "human touch" in architecture.
- **Secondary (Platinum Silver):** A cool-toned metallic used for borders, secondary icons, and low-priority accents to provide a technological contrast to the gold.
- **Tertiary (Graphite):** Employed for container backgrounds and section dividers to create subtle structural hierarchy without breaking the dark aesthetic.
- **Surface Tints:** Use 5-10% opacity whites over the black base to create "elevated" surfaces that feel like brushed metal or polished stone.

## Typography

This design system utilizes a high-contrast typographic pairing to signal both heritage and innovation.

- **Headlines:** **Noto Serif** provides the intellectual and classic weight required for luxury real estate. Large display sizes should use tighter letter spacing to feel "locked" and intentional.
- **Body & Interface:** **Inter** provides a neutral, geometric clarity that balances the decorative nature of the serif. It handles technical data and descriptions with professional ease.
- **Labels:** Small caps with wide tracking are used for metadata, category labels, and secondary navigation to mimic architectural blueprint annotations.

## Layout & Spacing

The layout follows a **Fixed 12-Column Grid** for desktop, emphasizing symmetry and balance. 

- **Breathable Voids:** Large vertical gaps (160px+) between sections are mandatory to maintain a high-end "gallery" feel. 
- **Asymmetric Balance:** While the grid is fixed, content should often be offset (e.g., text spanning columns 2-6 while an image spans 7-12) to create dynamic visual interest.
- **Rhythm:** All spacing must be multiples of the 8px base unit. Margins are generous to ensure the UI never feels crowded against the screen edges.

## Elevation & Depth

Depth is communicated through **Tonal Layering** and **Micro-Glows** rather than traditional shadows.

- **Planes:** Since the background is pure black, elevated elements use a slightly lighter "Graphite" fill (#141414).
- **Glassmorphism:** Use high-diffusion backdrop blurs (40px+) on navigation bars and modal overlays to simulate frosted architectural glass.
- **Stroke Depth:** Instead of shadows, use 1px "inner-glow" strokes. A top border with 15% white opacity and a bottom border with 5% white opacity creates a subtle 3D "milled metal" effect.
- **Luminescence:** Interactive elements may emit a faint, soft glow in the Primary Gold color when hovered, suggesting a backlit interface.

## Shapes

The shape language is **Sharp and Architectural**. 

- **Edges:** Buttons, cards, and input fields use 0px border-radius (Sharp). This reflects the hard lines of modern architecture and the precision of digital blueprints.
- **Ratios:** Containers should favor the Golden Ratio or strict square formats. 
- **Dividers:** Use hairline-thin (1px) silver strokes to separate content sections. Dividers should never span the full width; they should terminate 10% from the edges to feel more refined.

## Components

- **Buttons:** Primary buttons are solid Champagne Gold with black text, strictly rectangular. Secondary buttons are "Ghost" style with a 1px Silver border and a subtle hover fill.
- **Input Fields:** Minimalist underlines only, rather than full boxes. Labels use the "label-caps" style and float above the line when active.
- **Cards:** No borders or shadows. Cards are defined by their content (usually high-resolution images) and a subtle change in background tone on hover.
- **Progress Indicators:** Ultra-thin lines (2px) that crawl along the top of the viewport or section, signifying technological precision.
- **Interactive Map/Viewer:** A specialized component for Archviz, featuring "Floating Silver Controls"—small, sharp-edged squares containing iconography for zoom, rotate, and floor-plan toggles.
- **Breadcrumbs:** Use "Label Caps" style with a simple "/" separator, keeping the path clear and understated.
