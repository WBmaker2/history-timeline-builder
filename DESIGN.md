---
name: History Timeline Builder
description: An evidence wall where history events are pinned index cards connected by colored string.
colors:
  cork: "#8a6a3f"
  cork-dark: "#6b4f2a"
  cork-deep: "#4a3518"
  card: "#f4e6c8"
  card-warm: "#fff8dc"
  ink: "#2b1d0e"
  ink-soft: "#6b4f2a"
  muted: "#8a7355"
  string-red: "#c94a2a"
  string-blue: "#2a6a8a"
  string-amber: "#d4a020"
  string-green: "#4a7a3a"
  danger: "#a83a2a"
  white: "#ffffff"
  string-red-deep: "#8a2a14"
  danger-deep: "#6a1a10"
  overlay-dark-18: "rgba(0,0,0,.18)"
  overlay-dark-14: "rgba(0,0,0,.14)"
  overlay-dark-12: "rgba(0,0,0,.12)"
  overlay-dark-10: "rgba(0,0,0,.10)"
  overlay-paper: "rgba(244,241,232,.06)"
typography:
  display:
    fontFamily: "'Kalam', 'Bradley Hand', cursive"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1.1
  headline:
    fontFamily: "'Kalam', 'Bradley Hand', cursive"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "'Kalam', 'Bradley Hand', cursive"
    fontSize: "18px"
    fontWeight: 700
    lineHeight: 1.2
  subtitle:
    fontFamily: "'Kalam', 'Bradley Hand', cursive"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.2
  subhead:
    fontFamily: "'Kalam', 'Bradley Hand', cursive"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
  meta:
    fontFamily: "'Courier New', 'Menlo', monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0"
rounded:
  sm: "2px"
  md: "4px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
components:
  button-primary:
    backgroundColor: "{colors.string-red}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px"
  input:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "6px"
---

# Design System: History Timeline Builder

## Overview

**Creative North Star: "The Evidence Wall"**

A cork pin-board where history events are pinned index cards and causal relations are colored strings. The surface feels like a student's own evidence wall — warm, tactile, owned — not a neutral tool panel. Shadows are structural (hard offset, no blur) like paper resting on cork. Slight rotations and pushpins signal hand-made. The system refuses the generic Tailwind dashboard every timeline app ships.

**Key Characteristics:**
- Cork ground with pinhole texture; warm palette only.
- Index-card surfaces with hard offset shadows and pushpins.
- Colored string for relation arrows (red/blue/amber/green by type).
- Handwritten-feel titles over printed mono meta.
- Thick 2px borders; no 1px hairlines.

## Colors

Warm cork and paper palette; string colors carry meaning (relation type and state).

### Primary
- **String Red** (#c94a2a): primary action, causal relations (cause), selected state, pushpins.

### Secondary
- **String Blue** (#2a6a8a): influence relations, secondary accent.
- **String Amber** (#d4a020): sequence relations, highlight.
- **String Green** (#4a7a3a): success/positive state.

### Neutral
- **Cork** (#8a6a3f): ground surface.
- **Cork Dark** (#6b4f2a): panels, top bar.
- **Cork Deep** (#4a3518): borders, shadow color.
- **Card** (#f4e6c8): index-card surface, button surface.
- **Card Warm** (#fff8dc): notepad/input surface.
- **Ink** (#2b1d0e): primary text.
- **Ink Soft** (#6b4f2a): secondary text.
- **Muted** (#8a7355): tertiary text, axis ticks.
- **Danger** (#a83a2a): error/destructive state.

**The One Accent Rule.** Red is the only action color; blue/amber/green appear only as relation-type or state colors, never as decoration.

## Typography

**Display Font:** Kalam (self-hosted TTF) with Bradley Hand fallback (handwritten feel)
**Body Font:** system-ui, Segoe UI, Roboto, sans-serif
**Label/Mono Font:** Courier New / Menlo (mono)

**Character:** Handwritten titles over printed meta lines — like a labeled index card. Display sizes stay modest (14-22px) because cards are small.

### Hierarchy
- **Display** (700, 20-30px, 1.1): page titles, modal heads, empty states.
- **Title** (700, 14-18px, 1.2): card titles, section heads.
- **Body** (400, 13px, 1.5): form labels, descriptions.
- **Label** (400, 12px, 1.4): small buttons, hints, meta lines.
- **Meta** (400, 11px, 1.4): dates, counts, mono labels.

### Named Rules
**The Hand-Over-Print Rule.** Titles are handwritten; meta and data are mono. Never swap.

## Layout

3-column editor (palette 230px / canvas fluid / props 270px). Home centered max-width 1100px. Cards pinned with slight rotation. Responsive collapses to single column under 900px. Spacing rhythm 4/8/12/16px.

## Elevation & Depth

No blur shadows. Depth via hard offset shadows (2-4px) in cork-deep, like paper on cork. Panels are flat cork. Hover lifts by translating -2px/-2px and growing shadow.

### Shadow Vocabulary
- **Card rest** (`box-shadow: 3px 3px 0 #3a2812`): pinned cards.
- **Card hover** (`box-shadow: 5px 5px 0 #3a2812`): lifted.
- **Selected** (`box-shadow: 4px 4px 0 #c94a2a`): selected card, red shadow.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest; shadows appear as paper-on-cork depth, never as glow.

## Shapes

4px radius everywhere (cards, buttons, inputs, modals). 2px for image thumbnails. Borders are 2px solid cork-deep. No fully rounded pills. Slight rotations (±1deg) on cards for hand-made feel; reset on hover/selected.

## Components

### Buttons
- **Shape:** 4px radius, 2px cork-deep border, hard shadow.
- **Primary:** red background, white text, red border.
- **Secondary:** card background, ink text.
- **Hover:** translate -1px/-1px, shadow grows.

### Cards / Containers
- **Corner Style:** 4px radius.
- **Background:** card (#f4e6c8) for events/palette; cork for panels.
- **Shadow Strategy:** hard offset 3px.
- **Border:** 2px solid cork-deep.
- **Internal Padding:** 8px.

### Inputs / Fields
- **Style:** card background, 2px cork-deep border, 4px radius, hard shadow.
- **Focus:** red outline 3px.

### Navigation
- Top bar is a cork-dark strip with card-colored buttons.

### Signature Component: Pinned Event Card
Index card with color strip, handwritten title, mono date, optional image; pushpin implied by rotation and shadow. Selected state gets red border + red shadow.

## Do's and Don'ts

### Do:
- **Do** use hard offset shadows (no blur) for paper-on-cork depth.
- **Do** keep rotations subtle (±1deg) and reset on interaction.
- **Do** use string colors only for relation type / state.
- **Do** use handwritten titles over mono meta.

### Don't:
- **Don't** use 1px hairlines or neutral Tailwind grays.
- **Don't** use blur shadows or glassmorphism.
- **Don't** use string colors as decoration.
- **Don't** make panels look like a generic dashboard.
