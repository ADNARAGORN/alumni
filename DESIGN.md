# DESIGN.md — Alumni Tracking System

> **Format Standard:** [`VoltAgent/awesome-design-md`](https://github.com/VoltAgent/awesome-design-md) / [`getdesign.md`](https://getdesign.md) (9-Section AI-First Design Specification)  
> **Curated Reference Blend:**
> * **Typography & Editorial Warmth:** [`Claude`](https://getdesign.md/claude/design-md) *(warm ivory canvas, humanist editorial serif headlines, calm typographic hierarchy)*
> * **Buttons & Sharp Geometry:** [`WIRED`](https://getdesign.md/wired/design-md) *(**Square corners, no compromise** — `0px` sharp buttons, crisp `1.5px` frames, editorial hairline rules)*
> * **Data Tables:** [`Notion`](https://getdesign.md/notion/design-md) *(borderless vertical columns, `1px` horizontal hairlines, clean scannable directory rows)*
> * **Category Cards & Premium Gallery Polish:** [`Tesla`](https://getdesign.md/tesla/design-md) + [`Apple`](https://getdesign.md/apple/design-md) *(radical subtraction, `12px` full-bleed architectural category cards, weight-500 clean labels, museum-grade breathing room)*

---

## 1. Visual Theme & Atmosphere

**Editorial Academic Prestige meets Architectural Minimalism.**  
Warm ivory editorial surfaces (*Claude*) and sharp, uncompromising `0px` square buttons (*WIRED*) anchor a whisper-clean, gallery-like showcase (*Apple* & *Tesla*) paired with highly readable structured data tables (*Notion*).

* **Mood:** Authoritative, calm, razor-sharp, premium, and distraction-free.
* **Color Personality:** Oxford Navy (`#0B1F3A`) + Heritage Gold (`#C8922B`) on Warm Ivory (`#FAF8F4`).
* **Structural Principle:** Radical subtraction — zero visual clutter, zero muddy drop shadows, crisp `1px` hairlines.

---

## 2. Color Palette & Roles

Aligned strictly with [`brand.md`](./brand.md):

| Role | Token | Hex | Usage Rule |
| :--- | :--- | :---: | :--- |
| **Canvas (Surface 0)** | `--color-ivory` | `#FAF8F4` | Universal page background across all routes |
| **Card / Table Surface** | `--color-surface` | `#FFFFFF` | Data table containers, forms, detail cards |
| **Primary Brand / Dark Gallery** | `--color-navy` | `#0B1F3A` | Primary square buttons, headings, dark gallery category cards |
| **Primary Hover** | `--color-navy-soft` | `#16325B` | Hover state for Navy actions and dark surfaces |
| **Signature Accent** | `--color-gold` | `#C8922B` | Serif italic focal emphasis, accent square buttons, active hairlines |
| **Accent Soft Tint** | `--color-gold-light` | `#F3E6C8` | Subtle status tags and editorial eyebrows (`#7D5813` text) |
| **Primary Ink** | `--color-ink` | `#111827` | Body copy, primary table values, inputs |
| **Muted Ink** | `--color-muted` | `#5A6577` | Metadata, table headers, secondary nav links |
| **Hairline Divider** | `--color-border` | `#E6E0D5` | `1px` editorial dividers, Notion-style table row rules, input borders |
| **Semantic Success** | `--color-success` | `#0F766E` | Live status dots, accepted badges (`#CCFBF1` tint) |
| **Semantic Warning** | `--color-warning` | `#D97706` | Edit actions, interview badges (`#FEF3C7` tint) |
| **Semantic Danger** | `--color-danger` | `#DC2626` | Delete actions, `404` & `409 Conflict` banners (`#FEF2F2` tint) |

---

## 3. Typography Rules *(Claude Reference)*

Warm humanist editorial typography with generous breathing room and sharp hierarchy:

* **Display / Headings (Claude Editorial Serif):** `'Playfair Display', 'Newsreader', Georgia, serif`
  * `H1 (Hero)`: `clamp(38px, 5.2vw, 60px)`, Weight `600/700`, Line-height `1.08`, Tracking `-0.025em`. Single emphasized phrase in italic Heritage Gold (`#C8922B`).
  * `H2 (Section Titles)`: `30px–36px`, Weight `600`, Line-height `1.18`, Tracking `-0.015em`.
  * `Display Numerals`: `36px`, Weight `600`, `font-variant-numeric: tabular-nums`.
* **Body / UI Copy (Clean Humanist Sans):** `'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif`
  * `Body / Lead`: `16px–18px`, Weight `400`, Line-height `1.65`, Max width `62ch`.
  * `Tesla Category Card Labels`: Weight `500` (medium), default letter-spacing (`0em`), crisp white on dark gallery canvas.
  * `Notion Table Cells`: `14px`, Weight `400/500`, clean scannable contrast.
  * `WIRED Button & Section Eyebrow Labels`: `12px–13px`, Weight `700`, uppercase, Tracking `0.08em`.
* **Monospace (Technical IDs / Routes):** `'JetBrains Mono', ui-monospace, monospace`, `12px–13px`.

---

## 4. Component Stylings

### 4.1. Buttons — *WIRED ("Square Corners, No Compromise")*
* **Corner Radius:** Strictly **`0px`** (`border-radius: 0`). Never rounded or pill-shaped.
* **Geometry:** Crisp `1.5px` solid border, padding `13px 24px`, uppercase `12px` bold typography with `0.08em` letter-spacing.
* **Variants:**
  * **Primary (`btn-primary`):** Solid `#0B1F3A` fill, `#FFFFFF` text; hover shifts decisively to `#C8922B` (Heritage Gold) fill & border.
  * **Outline (`btn-outline`):** Transparent fill, `1.5px solid #0B1F3A` border, `#0B1F3A` text; hover inverts to `#0B1F3A` fill + `#FFFFFF` text.
  * **Accent (`btn-gold`):** Solid `#C8922B` fill, `#FFFFFF` text; hover `#0B1F3A`.

### 4.2. Category Cards — *Tesla & Apple Premium Gallery*
* **Container Radius:** Strictly **`12px`** (`rounded.lg` per Tesla Category Card spec).
* **Visual Language:** Edge-to-edge architectural dark/monochrome gallery surfaces with subtle radial lighting, **zero decorative borders and zero muddy shadows** (radical subtraction).
* **Typography Inside Card:** Category label at top-left in crisp `500` weight with natural tracking, large refined title & clean single-line value proposition, paired with a sharp `0px` WIRED action button at bottom-left.
* **Hover:** Subtle `scale(1.015)` micro-zoom (`320ms cubic-bezier(0.22, 1, 0.36, 1)`) for an unmistakable Apple/Tesla tactile feel.

### 4.3. Data Tables — *Notion Directory Style*
* **Structure:** Full-width clean table inside `#FFFFFF` surface with `1px solid #E6E0D5` outer frame and **strictly horizontal `1px` row hairlines** (zero vertical borders).
* **Header:** `#FAF8F4` subtle background, `11px` uppercase `#5A6577` labels (`0.06em` tracking).
* **Rows:** Generous `15px 18px` cell padding, monospace `#ID` column, gentle `#FAF8F4` hover state, inline square status tags (`0px` radius).

### 4.4. Navigation Bar — *Apple Precision + Distinct Clickable Targets*
* Sticky top bar (`height: 72px`), frosted Warm Ivory (`rgba(250, 248, 244, 0.88)` + `backdrop-filter: blur(16px)`), crisp `1px solid #E6E0D5` hairline bottom rule.
* Square `0px` Oxford Navy monogram logo (`A`) on the left, sharp `0px` primary CTA on the right.
* **Distinct Interactive Nav Links (`Mezunlar`, `İş İlanları`, `Başvurular`, `Duyurular`, `Swagger UI`):** Clean and boxless (no rectangular border box), yet unmistakably clickable via warm **Heritage Gold (`#A67518` / `#C8922B`)** bold uppercase text (`12px`, `0.07em` tracking); hover or active state transitions to `#0B1F3A` with a crisp `2px solid #C8922B` bottom underline.

---

## 5. Layout Principles

* **Grid & Whitespace:** Generous Apple-style vertical rhythm (`72px–96px` between major sections) separated by crisp WIRED `1px` full-width hairlines.
* **Max Container:** `1200px` centered with `28px` horizontal padding.
* **Homepage Architecture:**
  1. Frosted minimal sticky navbar (*Apple*)
  2. Editorial serif Hero with square WIRED CTAs + architectural live metric bar (*Claude + WIRED*)
  3. 4-Card Full-Bleed **Category Cards** showcase (*Tesla + Apple*: Mezunlar, İş İlanları, Başvurular, Duyurular)
  4. Live **Notion-Style Data Table** showing real open job postings directly from `/api/jobs` + live editorial announcements list from `/api/announcements`

---

## 6. Depth & Elevation

* **Radical Subtraction:** Rely on surface contrast (`#FAF8F4` vs `#FFFFFF` vs `#0B1F3A`) and `1px` hairline rules rather than heavy box-shadows.
* **Category Cards (`12px` radius):** Flat architectural depth with subtle internal atmospheric lighting; smooth `320ms` transform on hover.
* **Interactive Elements (`0px` buttons/inputs):** Zero blur shadow — crisp color inversion on hover (`180ms ease`).

---

## 7. Do's and Don'ts (Design Guardrails)

* **Do:** Keep every button strictly **`0px` square corners** (*WIRED rule — no compromise*).
* **Do:** Keep Category Cards at **`12px` radius** with clean weight-500 labels and zero borders (*Tesla rule*).
* **Do:** Keep all directory/listing tables borderless vertically with `1px` horizontal hairlines (*Notion rule*).
* **Do:** Use **Claude-style** warm editorial serif (`Playfair Display`) on headings and `#FAF8F4` Warm Ivory canvas everywhere.
* **Don't:** Use pill-shaped (`999px`) buttons anywhere — square corners only for buttons.
* **Don't:** Add decorative gradients, busy icons, or heavy drop shadows onto data tables or category cards.

---

## 8. Responsive Behavior

* **Desktop (`> 1024px`):** 2x2 or 4-column Tesla Category Cards grid, full horizontal navbar, full-width Notion table.
* **Tablet (`641px – 1024px`):** 2-column Category Cards, stacked editorial feed, horizontal scroll on wide tables.
* **Mobile (`<= 640px`):** Single-column layout, compact `44px` square touch buttons, `overflow-x: auto` table wrapper.

---

## 9. Agent Prompt Guide

> **Directive for AI Coding Agents:** Follow this exact 4-brand blend on top of [`brand.md`](./brand.md)'s Oxford Navy (`#0B1F3A`), Heritage Gold (`#C8922B`), and Warm Ivory (`#FAF8F4`) palette:
> 1. **Typography (Claude):** `Playfair Display` editorial serif headlines + `Plus Jakarta Sans` readable body.
> 2. **Buttons (WIRED):** `border-radius: 0` square corners, no compromise, crisp `1.5px` frames, uppercase tracked labels.
> 3. **Category Cards (Tesla + Apple):** `border-radius: 12px`, borderless dark/gallery surfaces, weight-500 natural-tracked labels, generous whitespace.
> 4. **Data Tables (Notion):** Horizontal `1px` hairlines only, `#FAF8F4` headers, generous row padding, clean hover highlight.
