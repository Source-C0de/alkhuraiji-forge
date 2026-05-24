
# AlKhuraiji Factory — Phase 1 Plan

Build the core marketing site on the existing TanStack Start + React + Tailwind + Framer Motion stack. Phase 2 (Private Label Portal, Client Dashboard mock, Careers) comes later.

## Pages (Phase 1)

1. `/` Home — hero, stats, capabilities, process timeline, why-us, industries, testimonials, CTA
2. `/about` — story, vision/mission, milestones timeline, certifications
3. `/services` — 8 service cards (Private Label, OEM, Product Dev, Custom Packaging, QA, Industrial Consulting, Mass Production, Supply Chain), each opens a detail modal
4. `/process` — animated 7-step production workflow
5. `/industries` — filterable showcase (Food & Beverage, Cosmetics, Chemicals, Consumer Goods, Industrial, Healthcare, Retail)
6. `/contact` — full inquiry form, map placeholder, WhatsApp/email/callback CTAs

Shared shell: animated navbar with mega menu, footer, language switcher.

## Design system

- Palette: deep navy `#0A1628`, steel `#1F2937` / `#475569`, off-white `#F5F5F4`, gold accent `#C9A14A`
- Typography: Inter (EN body), Manrope (EN headings), Cairo + Tajawal (AR). All loaded via Google Fonts.
- Tokens added to `src/styles.css` as oklch CSS variables (no hardcoded colors in components). Tailwind classes only.
- Subtle animated backgrounds: blueprint grid SVG, particle drift, gradient sweeps on section reveal.

## Internationalization (EN / AR + RTL)

- Lightweight custom i18n context (`useI18n()`) — no external lib needed for static copy.
- All UI strings in `src/i18n/en.ts` and `src/i18n/ar.ts` (typed dictionary).
- Language persisted to `localStorage`. Toggle in navbar.
- On language change: set `<html lang dir>` (Arabic flips dir="rtl") and swap font stack via CSS variable.
- Tailwind utilities use logical properties where layout matters (`ms-`, `me-`, `ps-`, `pe-`, `text-start`).

## Animation strategy

- Framer Motion for: page transitions (fade/slide via `AnimatePresence` on `<Outlet />`), section reveal (`whileInView`), hover microinteractions, animated counters, testimonial carousel.
- Scroll-triggered parallax in hero. Animated SVG production-flow lines on the process page.
- Counters use `motion` with `useInView` + `useMotionValue`.

## Reusable components

`Navbar`, `Footer`, `LanguageSwitcher`, `AnimatedHero`, `StatCounter`, `ServiceCard`, `ServiceModal`, `ProcessTimeline`, `IndustryGrid`, `TestimonialCarousel`, `CTABanner`, `BlueprintGrid` (animated bg), `SectionHeading`, `InquiryForm`.

## Assets

- Uploaded Arabic logo → `src/assets/logo.png`, used in navbar and footer.
- 4–6 AI-generated factory/industrial images via imagegen (hero, about, industries hero, CTA banner). Saved under `src/assets/`.

## SEO

- Per-route `head()` with unique title/description/og tags (EN baseline; future enhancement: localized meta).
- JSON-LD Organization in `__root.tsx`. Canonical only on leaves.

## Technical structure

```
src/
  routes/
    __root.tsx        (i18n provider, navbar, footer, page transitions)
    index.tsx         (Home)
    about.tsx
    services.tsx
    process.tsx
    industries.tsx
    contact.tsx
  components/
    layout/  (Navbar, Footer, LanguageSwitcher, PageTransition)
    sections/ (Hero, Stats, Capabilities, ProcessTimeline, WhyUs, Industries, Testimonials, CTABanner)
    ui-custom/ (StatCounter, ServiceCard, ServiceModal, BlueprintGrid, SectionHeading)
  i18n/
    context.tsx, en.ts, ar.ts
  assets/  (logo + generated imagery)
  styles.css (extended tokens + RTL helpers + Arabic font face)
```

## Out of scope (Phase 2)

Private Label Portal, Client Dashboard (login/register/dashboard mock), Careers page, file-upload UI on contact. Phase 1 contact form is functional UI only (no submission backend).

## Deliverable

Complete browsable marketing site in EN + AR with RTL, premium animated design, fully responsive. Ready to expand with Phase 2 pages.
