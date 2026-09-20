# About Page Refinement Plan

## Project Context
- **Framework**: React 18 + TypeScript + Vite
- **Routing**: HashRouter (react-router-dom)
- **Styling**: CSS with design tokens in `src/index.css` (CSS custom properties)
- **Design Language**: Warm vintage café aesthetic — light/bright, professional but approachable, editorial typography (Instrument Serif + DM Sans), gold/coffee color palette
- **Existing Patterns**: PageBanner component for page headers, shared `.btn` variants, `.section`/`.container` layout utilities, scroll-reveal animations (`.reveal-up` + `.is-visible`)

---

## Current About Page Analysis
**File**: `src/pages/AboutPage.tsx` + `src/pages/AboutPage.css`

**Issues to Address**:
1. Uses custom "brutalist" CSS (`brutal-*` classes) that don't align with the shared design system
2. Hardcodes invented statistics (500+ graduates, 6+ years, 95% placement) — requirements explicitly forbid this
3. Doesn't use `PageBanner` component like all other pages
4. Duplicate video/content also exists in `src/components/About/About.tsx` (homepage snippet)
5. No clear separation of the three training areas (Barista, Café & Bar, Chef)
6. Chef training presented as active trainer rather than "upcoming/expanding"

---

## Implementation Plan

### 1. Replace AboutPage.tsx Entirely
**New structure using shared design system**:

```
AboutPage
├── PageBanner (hero) — reuse component
├── Section: About the Business (mission + what we do)
├── Section: Training Approach (hands-on philosophy)
├── Section: Training Areas (3 cards: Barista, Café & Bar, Chef)
├── Section: Image + Story (optional, using existing assets)
├── Section: CTA (reuse Contact component or button pattern)
```

### 2. Hero — PageBanner Component
- **Props**:
  - `title`: "About Bravo"
  - `subtitle`: "Nepal's premier hands-on hospitality training school — where coffee, bar, and culinary craft meet real-world practice."
  - `badge`: "Est. 2019 · Kathmandu"
  - `bgImage`: `IMAGES.team` or `IMAGES.teamGroup` (team/atmosphere shot)
  - `breadcrumbs`: `[{ label: 'About' }]`
- **Why**: Consistent with all other pages (BaristaPage, CafeBarTrainingPage, ChefPage, etc.)

### 3. Section: About the Business / Mission
- **Layout**: `.section.section--white` + `.container` + two-column grid (text + image) on desktop, stacked on mobile
- **Content**:
  - Eyebrow: "Our Purpose"
  - Heading: "Bridging Classroom Theory and Commercial Reality"
  - Body copy explaining: founded 2019, operates as both academy + working café/bar, covers three disciplines
  - **No invented stats** — keep copy qualitative
- **Image**: `IMAGES.cafeInterior` or `IMAGES.teamCafe` (shows the dual academy/café environment)

### 4. Section: Training Approach
- **Layout**: `.section.section--gray` (uses `--color-surface-muted`)
- **Heading**: "How We Train"
- **Subtext**: "Practical immersion on commercial equipment, not domestic appliances in empty classrooms."
- **Three pillars** (cards or icon+text layout):
  1. **Real Equipment** — FAEMA multi-group machines, commercial grinders, speed rails
  2. **Live Service** — Students train during actual café/bar hours with real customers
  3. **Mentor-Led** — Industry veterans (barista champions, mixologists, executive chefs)
- **Styling**: Reuse card pattern from ChefPage (`.chef-curr-card` adapted) or simple text blocks with subtle dividers

### 5. Section: Training Areas (Core Requirement)
- **Layout**: `.section.section--white` + three-column grid (`.chef-curriculum-grid` pattern)
- **Heading**: "What We Teach"
- **Three cards** — each links to respective program page:
  1. **Barista Training** → `/barista-training`
     - Espresso extraction, latte art, manual brewing, sensory skills
     - Image: `IMAGES.baristaTraining1` or `IMAGES.baristaStudent`
  2. **Café & Bar Training** → `/cafe-bar-training`
     - Cocktails, mocktails, flair, bar operations, hospitality service
     - Image: `IMAGES.barAction` or `IMAGES.cafeBar`
  3. **Chef Training** → `/chef-training` (badge: "Coming Soon")
     - Knife skills, mother sauces, hot kitchen, HACCP, plating
     - Image: `IMAGES.groupTraining2` (used on HomePage for chef)
     - Visual indicator: "Pre-registration open" or similar
- **Card pattern**: Reuse `.chef-curr-card` styles (clean, minimal border, hover lift)

### 6. Section: Image + Story (Optional, Strategic)
- **Only if it adds value** — don't fill space
- **Option**: Full-width image with overlay caption showing training in action
- **Image**: `IMAGES.groupTraining1` or `IMAGES.groupTraining3`
- **Caption**: "Students practicing espresso calibration during morning batch"

### 7. CTA Section
- **Layout**: `.section.section--dark` (coffee background, light text)
- **Content**: "Ready to Start Your Hospitality Career?"
- **Buttons** (reuse `.btn` variants):
  - Primary: "Explore Programs" → `/programs`
  - Secondary: "Contact Admissions" → `/contact` (outline-light)
- **Pattern**: Matches `HomePage` closing section (`.home-closing`)

---

## Assets to Use (from `src/data/images.ts`)

| Purpose | Asset Key | Path |
|---------|-----------|------|
| Hero background | `team` or `teamGroup` | `/assets/96404465_871493560003114_9097596256053624832_n.jpg` / `/assets/98377402_881994065619730_8370993961161981952_n.jpg` |
| About/Mission image | `cafeInterior` or `teamCafe` | `/assets/119116164_984810605338075_1097223667637434888_n.jpg` / `/assets/492356765_1256858429774026_3620093556861238375_n.jpg` |
| Barista card | `baristaTraining1` | `/assets/480787915_2055576728261452_1840383711896698557_n.jpg` |
| Café & Bar card | `barAction` or `cafeBar` | `/assets/480816279_2055576588261466_6237295885905362791_n.jpg` |
| Chef card | `groupTraining2` | `/assets/486279029_1224952272964642_705145699539085004_n.jpg` |
| Story image | `groupTraining1` or `groupTraining3` | `/assets/473005016_2027201254432333_223289293506585473_n.jpg` / `/assets/486362285_1224952486297954_6247054914801504378_n.jpg` |

**Optimization**: All images already in `/assets/` — no new uploads needed. Use `loading="lazy"` on below-fold images.

---

## CSS Strategy
- **Delete** `src/pages/AboutPage.css` (brutalist styles)
- **Create** new `src/pages/AboutPage.css` using **only** design tokens from `index.css`:
  - `.section`, `.container`, `.eyebrow`, `.divider`, `.btn`
  - Grid/flex utilities already defined
  - Reveal animations: `[data-reveal]` + `.is-revealed` (from HomePage) or `.reveal-up` + `.is-visible` (from index.css)
- **Responsive**: Mobile-first, breakpoints at 48rem/60rem/90rem (matching index.css)

---

## Components to Reuse (Zero Duplication)

| Component | Usage |
|-----------|-------|
| `PageBanner` | Hero section |
| `.btn` / `.btn--primary` / `.btn--outline-light` | CTAs |
| `.section` / `.container` | Layout |
| `.eyebrow` / `.divider` | Section headers |
| Scroll reveal (`useScrollReveal` hook) | Animations |
| `Link` from react-router-dom | Navigation |

---

## Files to Modify

1. **`src/pages/AboutPage.tsx`** — Complete rewrite
2. **`src/pages/AboutPage.css`** — Replace with design-system-only styles
3. **`src/data/images.ts`** — No changes (assets already mapped)

---

## Assumptions & Decisions

| Decision | Rationale |
|----------|-----------|
| Remove invented statistics (500+, 6+, 95%) | Requirements: "Do not invent statistics... not already present in the project/assets" |
| Chef training as "Coming Soon" with pre-registration | Consistent with HomePage (`meta: 'Coming soon · Culinary foundations · Pre-registration'`) and ChefPage badge |
| Use PageBanner for hero | All other pages use it; maintains consistency |
| Three training area cards linking to program pages | Matches HomePage PROGRAMS pattern; drives conversion |
| No video on About page (video exists on HomePage) | Avoid duplication; HomePage already has video hero + welcome video |
| Reuse ChefPage card styles for training areas | Proven pattern, consistent visual language |

---

## Validation Checklist (Post-Implementation)

- [ ] Page loads at `/about` with no console errors
- [ ] PageBanner renders with correct breadcrumb (Home → About)
- [ ] All three training area cards link to correct routes
- [ ] Chef card shows "Coming Soon" indicator
- [ ] Responsive: mobile (1 col), tablet (2 col), desktop (3 col)
- [ ] Scroll reveal animations work (no layout shift)
- [ ] Images lazy-load, no CLS issues
- [ ] Color contrast passes WCAG AA (design tokens already compliant)
- [ ] Focus states visible on all interactive elements
- [ ] No broken imports or TypeScript errors
- [ ] Build succeeds (`npm run build`)

---

## Out of Scope
- Modifying Header, Footer, or other pages
- Adding new components (reuse existing only)
- Changing design tokens or global styles
- Backend/API integration (CTA buttons link to existing routes)