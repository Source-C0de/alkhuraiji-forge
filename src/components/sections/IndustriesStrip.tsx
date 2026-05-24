import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Apple, Beaker, FlaskConical, HeartPulse, ShoppingBag, Sparkles, Wrench } from "lucide-react";
import { useI18n } from "@/i18n/context";
import { SectionHeading } from "@/components/ui-custom/SectionHeading";

const ICONS = { food: Apple, cosmetics: Sparkles, chemicals: FlaskConical, consumer: ShoppingBag, industrial: Wrench, healthcare: HeartPulse, retail: Beaker } as const;

export function IndustriesStrip() {
  const { t } = useI18n();
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading title={t.home.industriesTitle} />
        <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {t.industries.items.map((ind, i) => {
            const Icon = ICONS[ind.id as keyof typeof ICONS] ?? Wrench;
            return (
              <motion.div
                key={ind.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Link
                  to="/industries"
                  className="group flex aspect-square flex-col items-center justify-center rounded-2xl border border-border bg-card p-4 text-center transition hover:-translate-y-1 hover:border-primary/60"
                >
                  <Icon className="mb-2 h-6 w-6 text-primary transition group-hover:scale-110" />
                  <div className="text-xs font-medium leading-tight">{ind.title}</div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
