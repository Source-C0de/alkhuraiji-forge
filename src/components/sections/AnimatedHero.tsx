import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useI18n } from "@/i18n/context";
import hero1 from "@/assets/home_1.png";
import hero2 from "@/assets/home_2.png";

const heroImages = [hero1, hero2];

export function AnimatedHero() {
  const { t, dir } = useI18n();
  const { heroTitle, heroSubtitle } = useAdminStore();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const lines = heroTitle.split("\n");

  return (
    <section ref={ref} className="relative isolate min-h-[100svh] overflow-hidden bg-background">
      <motion.div style={{ scale, y }} className="absolute inset-0 -z-10 bg-background">
        <AnimatePresence>
          <motion.img 
            key={currentImageIndex}
            src={heroImages[currentImageIndex]} 
            alt="Luxury Manufacturing" 
            className="absolute inset-0 h-full w-full object-cover object-center"
            initial={{ scale: 1.1, opacity: 0, filter: "brightness(0.5) blur(10px)" }}
            animate={{ scale: 1.05, opacity: 1, filter: "brightness(0.9) blur(0px)" }}
            exit={{ scale: 1.05, opacity: 0, filter: "brightness(0.5) blur(10px)", transition: { duration: 2, ease: "easeInOut" } }}
            transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
        {/* Premium multi-layered vignette and gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
        <div className="absolute inset-0 bg-gold/5 mix-blend-overlay" />
      </motion.div>

      {/* Soft luxury floating light effect */}
      <motion.div
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-50"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div style={{ opacity }} className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-4 pb-24 pt-32 md:px-8 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-primary"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
          {t.home.eyebrow}
        </motion.div>

        <h1 className="font-display text-5xl font-light leading-[1.1] tracking-tight md:text-7xl lg:text-[5.5rem]">
          {lines.map((line, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="block"
            >
              {i === lines.length - 1 ? <span className="text-gradient-gold font-medium">{line}</span> : line}
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
            to="/builder"
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
