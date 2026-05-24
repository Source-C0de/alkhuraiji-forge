import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Apple, Beaker, FlaskConical, HeartPulse, ShoppingBag, Sparkles, Wrench } from "lucide-react";
import { useState } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { SectionHeading } from "@/components/ui-custom/SectionHeading";
import { BlueprintGrid } from "@/components/ui-custom/BlueprintGrid";
import { CTABanner } from "@/components/sections/CTABanner";
import { useI18n } from "@/i18n/context";
import products from "@/assets/industries-products.jpg";

const ICONS = { food: Apple, cosmetics: Sparkles, chemicals: FlaskConical, consumer: ShoppingBag, industrial: Wrench, healthcare: HeartPulse, retail: Beaker } as const;

export const Route = createFileRoute("/industries")({
  component: IndustriesPage,
  head: () => ({
    meta: [
      { title: "Industries — AlKhuraiji Factory" },
      { name: "description", content: "Manufacturing expertise across food, cosmetics, chemicals, consumer goods, industrial, healthcare and retail." },
      { property: "og:title", content: "Industries Served — AlKhuraiji Factory" },
      { property: "og:description", content: "Production expertise across regulated, consumer and industrial categories." },
      { property: "og:url", content: "/industries" },
    ],
    links: [{ rel: "canonical", href: "/industries" }],
  }),
});

function IndustriesPage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<string>("all");
  const items = filter === "all" ? t.industries.items : t.industries.items.filter((i) => i.id === filter);

  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden pt-32 pb-16 md:pt-40">
        <BlueprintGrid />
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading eyebrow={t.nav.industries} title={<span className="text-gradient-gold">{t.industries.title}</span>} subtitle={t.industries.subtitle} />
        </div>
      </section>

      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition ${filter === "all" ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground/80 hover:border-primary/60"}`}
            >
              {t.common.all}
            </button>
            {t.industries.items.map((i) => (
              <button
                key={i.id}
                onClick={() => setFilter(i.id)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] transition ${filter === i.id ? "border-primary bg-primary text-primary-foreground" : "border-border text-foreground/80 hover:border-primary/60"}`}
              >
                {i.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((ind, i) => {
              const Icon = ICONS[ind.id as keyof typeof ICONS] ?? Wrench;
              return (
                <motion.div
                  key={ind.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="group relative overflow-hidden rounded-3xl border border-border bg-card"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={products} alt="" loading="lazy" className="h-full w-full object-cover opacity-50 transition duration-700 group-hover:scale-105 group-hover:opacity-70" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-transparent" />
                    <div className="absolute bottom-4 start-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary backdrop-blur ring-1 ring-primary/30">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="font-display text-lg font-semibold">{ind.title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ind.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <CTABanner />
    </PageTransition>
  );
}
