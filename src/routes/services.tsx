import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Beaker, Boxes, Factory, Layers, ShieldCheck, Sparkles, Truck, Wrench, X } from "lucide-react";
import { useState } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { SectionHeading } from "@/components/ui-custom/SectionHeading";
import { BlueprintGrid } from "@/components/ui-custom/BlueprintGrid";
import { CTABanner } from "@/components/sections/CTABanner";
import { useI18n } from "@/i18n/context";

const ICONS = [Factory, Layers, Sparkles, Boxes, ShieldCheck, Wrench, Beaker, Truck] as const;

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Services — AlKhuraiji Factory" },
      { name: "description", content: "Private label, OEM production, packaging, QA, mass production and supply chain solutions for global brands." },
      { property: "og:title", content: "Manufacturing Services — AlKhuraiji Factory" },
      { property: "og:description", content: "Eight end-to-end manufacturing capabilities for global brands." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
});

function ServicesPage() {
  const { t, dir } = useI18n();
  const [active, setActive] = useState<number | null>(null);
  const item = active !== null ? t.services.items[active] : null;

  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden pt-32 pb-16 md:pt-40">
        <BlueprintGrid />
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading eyebrow={t.nav.services} title={<span className="text-gradient-gold">{t.services.title}</span>} subtitle={t.services.subtitle} />
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {t.services.items.map((s, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <motion.button
                  key={s.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                  onClick={() => setActive(i)}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 text-start transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-elevated"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">0{i + 1}</span>
                  </div>
                  <div className="font-display text-xl font-semibold leading-tight">{s.title}</div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {t.common.readMore}
                    <ArrowRight className={`h-3.5 w-3.5 transition group-hover:translate-x-1 ${dir === "rtl" ? "rotate-180" : ""}`} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {item && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center p-4 md:items-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setActive(null)} />
            <motion.div
              initial={{ y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-8 shadow-elevated md:p-10"
            >
              <button onClick={() => setActive(null)} className="absolute end-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground" aria-label={t.common.close}>
                <X className="h-4 w-4" />
              </button>
              <div className="text-[10px] uppercase tracking-[0.22em] text-primary">{t.nav.services}</div>
              <h3 className="mt-2 font-display text-3xl font-semibold">{item.title}</h3>
              <p className="mt-4 leading-relaxed text-muted-foreground">{item.long}</p>
              <a href="/contact" className="mt-8 inline-flex items-center gap-3 rounded-full bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-gold-glow">
                {t.common.requestProduction}
                <ArrowRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CTABanner />
    </PageTransition>
  );
}
