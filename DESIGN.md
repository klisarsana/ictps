---
name: Integrated Talent Management System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464f'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#757780'
  outline-variant: '#c5c6d0'
  surface-tint: '#4c5d8c'
  primary: '#000b2c'
  on-primary: '#ffffff'
  primary-container: '#0d214d'
  on-primary-container: '#7889bb'
  inverse-primary: '#b4c5fb'
  secondary: '#4a3ee6'
  on-secondary: '#ffffff'
  secondary-container: '#645cff'
  on-secondary-container: '#fffbff'
  tertiary: '#000f1b'
  on-tertiary: '#ffffff'
  tertiary-container: '#00263b'
  on-tertiary-container: '#1b93d1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b4c5fb'
  on-primary-fixed: '#031945'
  on-primary-fixed-variant: '#344573'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#321ed2'
  tertiary-fixed: '#cae6ff'
  tertiary-fixed-dim: '#8ccdff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004b6f'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-point:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  sidebar-width: 260px
  container-padding: 32px
  card-gap: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

This design system is built for a professional, enterprise-grade talent management environment. It prioritizes clarity, structural integrity, and cognitive ease. The personality is authoritative yet supportive, using a deep corporate foundation balanced by vibrant, functional accents.

The visual style follows a **Modern Corporate** aesthetic with subtle **Tonal Layering**. It utilizes high-contrast navigation to ground the user, while the primary content area uses soft elevations and ample whitespace to reduce density in data-heavy views. The system establishes trust through precise alignment and a clear hierarchy of information.

## Colors

The palette is anchored by a **Deep Navy (#0D214D)** used for primary navigation and branding, providing a stable frame for the application. 

The system employs a specific **Semantic Accent Logic**:
- **Performance Analysis:** Deep Purple (#5E48BA)
- **Coaching Record:** Forest Green (#2D8A5B)
- **Portfolio Update:** Vibrant Orange (#F27121)

Backgrounds utilize a very light neutral gray/blue wash to differentiate the workspace from white content cards. Success states use high-vibrancy greens with low-opacity backgrounds for "badges," ensuring legibility without overwhelming the layout.

## Typography

The system uses **Plus Jakarta Sans** across all levels to maintain a contemporary, approachable professional feel. The type scale is optimized for dashboard readability:
- **Headlines:** Use semi-bold or bold weights with tight letter spacing for a punchy, structured feel.
- **Data Points:** Key metrics are emphasized with increased weight and size to stand out within cards.
- **Labels:** Small caps are used for sidebar category headers to create clear visual separation between navigation groups.
- **Secondary Info:** Uses a lighter gray color (e.g., #64748B) to reduce visual noise for meta-information like timestamps.

## Layout & Spacing

The layout utilizes a **Fixed Sidebar + Fluid Content** model. 

1. **Sidebar:** A persistent 260px vertical navigation bar.
2. **Main Canvas:** A fluid area with a 32px inner margin on all sides.
3. **Grid:** A 12-column system is used for card placement. High-level dashboard cards typically span 4 columns (1/3 width) on desktop, reflowing to 6 columns on tablet and 12 on mobile.
4. **Spacing Rhythm:** Based on an 8px baseline. Use 24px (3 units) for spacing between major components and 8px/16px for internal card padding and element grouping.

## Elevation & Depth

This system uses **Subtle Tonal Elevation** rather than aggressive shadows. 

- **Surface Level 0:** The main application background (Neutral #F8FAFC).
- **Surface Level 1 (Cards):** Pure white (#FFFFFF) with a very soft, diffused shadow (0px 4px 20px rgba(0,0,0,0.05)) and a thin 1px border (#E2E8F0) to define edges.
- **Surface Level 2 (Interactions):** Active cards or hovered elements may increase shadow depth or add a 2px colored border matching the module's accent color.
- **Navigation:** The sidebar uses a flat, dark treatment with high-contrast active states (Background tint + white text) to signify the "root" level of the application.

## Shapes

The design system uses a **Rounded** language to soften the density of enterprise data.
- **Standard Cards:** 0.75rem (12px) corner radius.
- **Buttons & Inputs:** 0.5rem (8px) corner radius to match the base roundedness.
- **Badges/Chips:** Fully rounded (pill-shaped) for status indicators.
- **Icons:** Contained within soft-rounded squares with 20% opacity background tints of their respective accent colors.

## Components

### Buttons
Primary buttons use solid fills of the module-specific accent colors. They include a chevron-right icon in the trailing position for "Action" buttons (e.g., "Lihat Detail"). Secondary buttons should use an outlined style with a 1px border.

### Cards
Cards are the primary container. They must include a header section with an icon, title, and optional badge. Internal content is separated by subtle horizontal rules or light-colored background blocks (Surface Level 0).

### Status Badges
Small, pill-shaped indicators with high-contrast text and low-opacity backgrounds (e.g., Light Green background with Dark Green text for "Aktual").

### Sidebar Navigation
Menu items feature a 24px icon, clear label, and a subtle hover state. The active state uses a solid primary color background (Primary-Light) and a high-contrast text color to ensure the user's location is always clear.

### Progress Bars
Used for "Performance Analysis" metrics. These are 8px tall with rounded caps, using the primary accent color for the fill and a light gray for the track.