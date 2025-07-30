
# PROJECT BUILD

## Frameworks & Tools

- **Vite**
- **Lit** v2.8.0
- **GSAP** v3.12.5 (ScrollTrigger, ScrollSmoother)

---

## Page Structure (7 Sections)

Each section must be a standalone Lit Web Component.

**Section Flow:**

1. **HOME**         (→ horizontal →)
2. **WHAT I DO**    (↓ vertical ↓)
3. **PROJECT 1**    (↓ vertical ↓)
4. **PROJECT 2**    (↓ vertical ↓)
5. **ARCHIVE**      (→ horizontal →)
6. **ABOUT**        (→ horizontal →)
7. **SAY HI**       (final section)

---

## Project Structure

krystian/
├── src/
│   ├── components/
│   │   ├── home-section.js
│   │   ├── what-i-do-section.js
│   │   ├── project1-section.js
│   │   ├── project2-section.js
│   │   ├── archive-section.js
│   │   ├── about-section.js
│   │   ├── say-hi-section.js
│   │   └── app-container.js (wraps all sections)
│   ├── styles/
│   │   └── index.css
│   ├── utils/
│   │   └── viewport.js
│   └── main.js
├── index.html
├── vite.config.js
├── package.json
└── .gitignore

---

## Scroll Behavior

**Horizontal:**

- HOME → WHAT I DO
- ARCHIVE → ABOUT
- ABOUT → SAY HI

**Vertical:**

- WHAT I DO → PROJECT 1 → PROJECT 2 → ARCHIVE

Use **ScrollTrigger** and **ScrollSmoother** from GSAP.
Ensure section transitions are smooth and responsive.

---

## CSS

- Each section: `100vw` x `100vh`
- `overflow: hidden`
- No padding or margin

---

## Component Guidelines

- Use `aria-label`, `role="region"`
- `data-section-type="horizontal"` or `"vertical"`
- Use GSAP to animate visibility, pin, and translateX/Y

---

## Mobile

- Viewport height fix via JS (set `--vh` var)
- Disable horizontal slides on very small screens

---

## Dev Environment

- Node >= 18
- npm >= 9
- VS Code + recommended extensions:
  - ESLint
  - Prettier
  - Lit plugin

---

## Dependencies

- `lit`: `^2.8.0`
- `gsap`: `^3.12.5`
- `vite`: `^7.0.4`
