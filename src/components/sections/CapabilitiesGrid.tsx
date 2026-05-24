import { motion } from "framer-motion";
import { Beaker, Boxes, Factory, Layers, ShieldCheck, Sparkles, Truck, Wrench } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";
import { SectionHeading } from "@/components/ui-custom/SectionHeading";

const ICONS = [Factory, Layers, Sparkles, Boxes, ShieldCheck, Wrench, Beaker, Truck] as const;

export function CapabilitiesGrid() {
  const { t } = useI18n();
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading eyebrow={t.home.eyebrow} title={t.home.capabilitiesTitle} subtitle={t.home.capabilitiesSubtitle} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {t.services.items.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: (i % 4) * 0.08 }}
              >
                <Link
                  to="/services"
                  className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/60 hover:shadow-elevated"
                >
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-lg font-semibold leading-tight">{s.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
