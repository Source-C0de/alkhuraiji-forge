import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { StatCounter } from "@/components/ui-custom/StatCounter";

export function StatsStrip() {
  const { t } = useI18n();
  return (
    <section className="relative border-y border-border bg-card/30 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 md:grid-cols-4 md:px-8">
        {t.home.stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <StatCounter value={s.value} suffix={s.suffix} label={s.label} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
