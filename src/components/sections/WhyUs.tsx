import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { SectionHeading } from "@/components/ui-custom/SectionHeading";
import about from "@/assets/about-factory.jpg";

export function WhyUs() {
  const { t } = useI18n();
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading title={t.home.whyTitle} subtitle={t.home.whySubtitle} />
        <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl border border-border shadow-elevated"
          >
            <img src={about} alt="" loading="lazy" width={1600} height={1000} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-border/80 bg-background/70 p-4 backdrop-blur-md">
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary">{t.tagline}</div>
              <div className="mt-1 font-display text-lg font-semibold">{t.brand}</div>
            </div>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            {t.home.whyPoints.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </div>
                <div className="font-display text-base font-semibold">{p.title}</div>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
