# Bab Rrayan School — Design Rules

Follow these for every change to the site. They exist to keep it from looking like a generic template.

## Identity
- **Core motif: the gate (arch).** "Bab" = gate. Arch shapes are the one recurring form: logo, hero art, image frames. Do not add other decorative shapes (no blobs, orbs, circles-for-decoration).
- **Pattern:** a faint 8-point-star lattice, only on dark green surfaces, opacity <= 8%.
- **Voice:** plain, specific, warm. Say real things (class sizes, times, languages), never "excellence / bright future / inspiring minds".

## Color (only these)
| Token | Hex | Use |
|---|---|---|
| --ink | #10261f | text, headings |
| --green | #0e4a3c | dark sections, buttons |
| --green-2 | #1d6b57 | secondary greens, hover |
| --sage | #cfe3d8 | light accents on green |
| --stone | #f2f4ef | page ground |
| --paper | #fbfcf9 | raised surfaces (rare) |
| --saffron | #f0a81b | the ONE accent: primary CTA, small highlights |

Saffron is spent sparingly. No gradients on text, no purple/blue gradients, no glassmorphism.

## Typography
- Headings: Bricolage Grotesque (600-700). Body: Hanken Grotesk. Arabic wordmark: Reem Kufi.
- Never Inter, Space Grotesk, or a cream + serif combo.
- Body line length <= 65ch. Headings use `text-wrap: balance`.

## Layout
- Left-aligned and asymmetric. Do not center everything.
- Not everything is a card. Use rows, rules and whitespace. Cards/borders only where an item is truly a separate object.
- One radius language: arches (large top radius) and small 6px for controls. No `rounded-2xl` on everything.
- Numbers/markers only where order is real (timetable, admissions steps).
- No emoji as icons or markers.

## Motion (restrained)
- One orchestrated moment on load: hero arches rise in sequence.
- Scroll: gentle fade-up on content (<= 24px, once), timetable line draws with scroll.
- Hover: rows/links respond subtly. No infinite floating, no marquee, no tilt, no parallax on text.
- Content must be readable with JS off / reduced motion.

## Languages (Arabic default, French, English)
- Every visible text is `{ar, fr, en}` in `data.js`; fixed interface words live in `UI`. A missing translation falls back ar → fr → en.
- Arabic is right-to-left (`html[dir=rtl]`). Never use `left/right` in CSS: use logical properties (`inset-inline-start`, `padding-inline-end`, `text-align:start`).
- Arabic text: no letter-spacing, no uppercase (already forced in the RTL block). Latin font first, Arabic font second in `--f-head` / `--f-body`.
- Phone numbers and emails are wrapped in `<bdi dir="ltr">`.

## Content & admin
- All editable copy lives in `data.js` (DEFAULTS + SCHEMA). To make a new text editable: add it to both, then add a `data-c="section.key"` element or a renderer in `script.js`.
- Set the tone with real Moroccan school terms (Maternelle, Collège, Lycée, Baccalauréat, Massar, rentrée), MAD, +212, WhatsApp.
- Public pages never show raw user text unescaped: use `BR.esc()` / `BR.safeUrl()`.
- Admin pages reuse `style.css` tokens; no new colors.

## Build
- Plain HTML/CSS/JS only. Keep focus states visible. Mobile-first stacking at 900px and 600px.
