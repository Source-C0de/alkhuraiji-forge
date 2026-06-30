import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { SectionHeading } from "@/components/ui-custom/SectionHeading";

type IndustryItem = {
  id: string;
  title: string;
  desc: string;
};

// ---------- Marquee (auto-scrolling rail) -----------------------------------

function Marquee({
  items,
  prefersReducedMotion,
}: {
  items: IndustryItem[];
  prefersReducedMotion: boolean;
}) {
  // Tripled for seamless wrap on wide screens
  const loop = [...items, ...items, ...items];

  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const speed = 30; // px per second

  useAnimationFrame((_t, delta) => {
    if (prefersReducedMotion || paused) return;
    const track = trackRef.current;
    if (!track) return;
    const oneThird = track.scrollWidth / 3;
    let next = x.get() - speed * (delta / 1000);
    if (-next >= oneThird) next += oneThird;
    x.set(next);
  });

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative w-full overflow-hidden"
      aria-hidden
    >
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

      <motion.div
        ref={trackRef}
        style={{ x }}
        className="flex w-max gap-3 py-2 will-change-transform"
      >
        {loop.map((ind, i) => {
          return (
            <div
              key={`${ind.id}-${i}`}
              className="group/pill relative flex shrink-0 items-center rounded-full border border-border bg-card/80 px-5 py-2.5 backdrop-blur transition-colors hover:border-primary/60 hover:bg-card"
            >
              <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.15em] text-foreground/85">
                {ind.title}
              </span>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}

// ---------- Spotlight (featured industry) -----------------------------------

function Spotlight({
  items,
  activeIndex,
  setActiveIndex,
  prefersReducedMotion,
}: {
  items: IndustryItem[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  prefersReducedMotion: boolean;
}) {
  const active = items[activeIndex];

  // Auto-rotate
  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = window.setInterval(() => {
      setActiveIndex((activeIndex + 1) % items.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [activeIndex, items.length, prefersReducedMotion, setActiveIndex]);

  return (
    <div className="relative">
      {/* Animated dashed border traveling around the spotlight */}
      {!prefersReducedMotion && (
        <div className="pointer-events-none absolute -inset-[1px] rounded-3xl overflow-hidden">
          <motion.div
            aria-hidden
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-50%]"
            style={{
              background:
                "conic-gradient(from 0deg, transparent 0deg, hsl(var(--primary)) 80deg, transparent 160deg)",
              filter: "blur(2px)",
              opacity: 0.45,
            }}
          />
        </div>
      )}

      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-12 shadow-elevated">
        {/* Background ambient glow */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                Featured Sector
              </div>

              <h3 className="font-display text-3xl font-semibold leading-tight text-foreground md:text-4xl">
                {active.title}
              </h3>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                {active.desc}
              </p>

              <Link
                to="/industries"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-gold-glow transition hover:opacity-90"
              >
                Explore Sector
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </AnimatePresence>

          {/* Side dots indicator */}
          <div className="flex flex-row gap-2 md:flex-col md:gap-3">
            {items.map((ind, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={ind.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Show ${ind.title}`}
                  className="group relative h-2.5 w-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  style={{
                    backgroundColor: isActive ? "hsl(var(--primary))" : "hsl(var(--border))",
                    transform: isActive ? "scale(1.4)" : "scale(1)",
                  }}
                >
                  <span className="absolute -inset-2 rounded-full" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Chip row (clickable, controls spotlight) ------------------------

function ChipRow({
  items,
  activeIndex,
  setActiveIndex,
  prefersReducedMotion,
}: {
  items: IndustryItem[];
  activeIndex: number;
  setActiveIndex: (i: number) => void;
  prefersReducedMotion: boolean;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
      {items.map((ind, i) => {
        const isActive = i === activeIndex;
        return (
          <button
            key={ind.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-pressed={isActive}
            className={`group relative flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isActive
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-card/60 text-foreground/70 hover:border-primary/40 hover:text-foreground"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="chip-active-pill"
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="absolute inset-0 rounded-full bg-primary/15 ring-1 ring-primary/40"
              />
            )}
            <span className="relative whitespace-nowrap">{ind.title}</span>
            <span
              className={`relative inline-flex transition-opacity ${
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <ArrowUpRight className="h-3 w-3 text-primary" />
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ---------- Section --------------------------------------------------------

export function IndustriesStrip() {
  const { t } = useI18n();
  const prefersReducedMotion = !!useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Parallax background orbs
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const orb1Y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [60, -60]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-40, 80]);
  const headingY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [30, -30]);

  // t.industries.items is a readonly tuple — cast through unknown to avoid TS mutability error
  const items = t.industries.items as unknown as readonly IndustryItem[];

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-28">
      {/* Parallax floating orbs */}
      <motion.div
        aria-hidden
        style={{ y: orb1Y }}
        className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-gold/15 blur-3xl"
      />
      <motion.div
        aria-hidden
        style={{ y: orb2Y }}
        className="pointer-events-none absolute -right-32 bottom-20 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl"
      />

      {/* Slow rotating rings */}
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]"
        >
          <div className="h-[60rem] w-[60rem] rounded-full border border-foreground" />
          <div className="absolute inset-12 rounded-full border border-foreground" />
          <div className="absolute inset-24 rounded-full border border-foreground" />
        </motion.div>
      )}

      {/* Subtle dotted grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <motion.div style={{ y: headingY }}>
          <SectionHeading
            eyebrow={t.home.eyebrow}
            title={t.home.industriesTitle}
            subtitle={t.industries.subtitle}
          />
        </motion.div>

        {/* Spotlight */}
        <div className="mt-14">
          <Spotlight
            items={items as IndustryItem[]}
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>

        {/* Auto-scrolling marquee */}
        <div className="mt-10">
          <Marquee items={items as IndustryItem[]} prefersReducedMotion={prefersReducedMotion} />
        </div>

        {/* Chip row */}
        <ChipRow
          items={items as IndustryItem[]}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          prefersReducedMotion={prefersReducedMotion}
        />
      </div>
    </section>
  );
}
