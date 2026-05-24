import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useRef } from "react";
import { useI18n } from "@/i18n/context";
import hero from "@/assets/hero-factory.jpg";

export function AnimatedHero() {
  const { t, dir } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const lines = t.home.heroTitle.split("\n");

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden">
      <motion.div style={{ scale, y }} className="absolute inset-0 -z-10">
        <img src={hero} alt="" width={1920} height={1080} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
        <div className="absolute inset-0 bg-blueprint opacity-[0.08]" />
      </motion.div>

      {/* animated production-line accents */}
      <motion.div
        className="absolute inset-x-0 top-1/2 -z-10 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />

      <motion.div style={{ opacity }} className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pb-24 pt-32 md:px-8 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-primary"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          {t.home.eyebrow}
        </motion.div>

        <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl lg:text-[5.5rem]">
          {lines.map((line, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {i === lines.length - 1 ? <span className="text-gradient-gold">{line}</span> : line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
        >
          {t.home.heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            to="/contact"
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-gold-glow transition hover:opacity-90"
          >
            {t.common.getStarted}
            <ArrowRight className={`h-4 w-4 transition group-hover:translate-x-1 ${dir === "rtl" ? "rotate-180" : ""}`} />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 rounded-full border border-border bg-card/40 px-6 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-foreground transition hover:border-primary hover:text-primary"
          >
            {t.common.requestProduction}
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-2 py-2 text-sm font-medium text-foreground/80 transition hover:text-primary"
          >
            <PlayCircle className="h-5 w-5 text-primary" />
            {t.common.explore}
          </Link>
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background" />
    </section>
  );
}
