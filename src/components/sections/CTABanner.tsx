import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/context";
import cta from "@/assets/cta-engineer.jpg";

export function CTABanner() {
  const { t, dir } = useI18n();
  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-elevated">
          <img src={cta} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
          <div className="relative grid gap-8 p-10 md:grid-cols-[1.4fr_1fr] md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
                {t.home.eyebrow}
              </div>
              <h3 className="font-display text-3xl font-semibold leading-tight md:text-5xl">{t.home.ctaTitle}</h3>
              <p className="mt-4 max-w-xl text-base text-muted-foreground md:text-lg">{t.home.ctaSubtitle}</p>
            </motion.div>
            <div className="flex items-end justify-start md:justify-end">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-gold-glow transition hover:opacity-90"
              >
                {t.common.requestProduction}
                <ArrowRight className={`h-4 w-4 transition group-hover:translate-x-1 ${dir === "rtl" ? "rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0" : ""}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
