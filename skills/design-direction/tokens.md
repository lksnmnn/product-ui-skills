# Tokens

How to turn a direction into the values a build uses. Each step starts from the brand and the
interview, never from a library's defaults. Write the result into the project's token file
(CSS custom properties, a Tailwind theme, a tokens JSON) and use only those names afterwards.

## Palette

1. **Anchor.** Start from the brand colour of step 1, or, without one, from a colour of the
   product's world (a material, a marking, a uniform). Note why it fits.
2. **Ramps.** Build each colour as a ramp of 9–12 steps in OKLCH: hold the hue, step the
   lightness evenly, ease the chroma down at both ends. Equal lightness steps keep contrast
   predictable across hues.
3. **Neutrals.** Tint the grey ramp toward the anchor hue (chroma 0.005–0.02). Pure grey reads
   as a default; a warm or cool tint reads as a decision.
4. **Roles.** Name colours by role, not hue: `surface`, `surface-raised`, `border`, `text`,
   `text-muted`, `accent`, `accent-text`, `focus`, `success`, `warning`, `danger`, `info`. A build
   uses roles only.
5. **Status.** Derive status colours so they sit with the palette (same lightness and chroma
   range), and keep them for status.
6. **Check.** Every text role meets 4.5:1 on every surface it sits on, borders of controls 3:1.
   Check with a contrast tool, not by eye.
7. **Dark theme**, when the product has one: its own surface steps (lighter means raised), the
   accent re-tuned for the dark ground (usually lighter, less saturated), shadows replaced by
   lighter surfaces or borders. Run the check of step 6 again.

## Type

- Choose the typeface from the direction's personality and world, not from habit. A face that is
  everywhere this year (see defaults.md) needs a reason. Check its weights, tabular figures, and
  the scripts and languages the product ships in.
- Give the product a **second voice** where it helps: a display face for headings, a serif for
  long reading, a mono for ids and data. Two families are enough.
- Scale: in an Operate surface, body 14–16px and a tight ratio (1.125–1.2); in a Persuade
  surface, a wider ratio (1.25–1.5) with one size clearly leading. Name steps by role
  (`display`, `h1`, `h2`, `body`, `body-s`, `label`, `mono`).
- Line height falls as size rises (body ~1.5, headings ~1.1–1.25). Measure ≤ 75 characters.
- `tabular-nums` for every number that is compared or updated.

## Shape

Radius, border and elevation are one decision, and the shape language of the direction's world
drives it.

- **Radius**: pick one base (0, 2, 4, 6, 8px …) and derive the rest from it (nested radius = outer
  radius − padding). A sharp product and a soft product are both fine; the same `rounded-xl` as
  every other app is not a choice.
- **Borders vs. shadows**: choose which one separates surfaces. Mixing both on every block is
  the default look.
- **Elevation**: at most three levels (flat, raised, overlay), each with a reason.

## Space and density

- A 4px base unit; a spacing scale of named steps (4, 8, 12, 16, 24, 32, 48, 64).
- Density follows the interview's dense — airy scale: control heights (28 / 32 / 36 / 40px) and
  row heights come from it, and so does the gap between groups.

## Motion

- Durations: 100–150ms for small state changes, 200–250ms for panels and dialogs.
- One easing curve for entering, one for leaving. A signature motion, if any, belongs to the
  signature move and appears in one place.

## Iconography

- One icon set, one stroke weight and size grid, matched to the type's weight. A custom or less
  common set, or a few drawn icons for the product's own objects, does more for distinctiveness
  than any colour.
