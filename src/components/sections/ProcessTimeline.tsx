import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";
import { SectionHeading } from "@/components/ui-custom/SectionHeading";

export function ProcessTimeline({ embedded = false }: { embedded?: boolean }) {
  const { t } = useI18n();
  return (
    <section className={`relative ${embedded ? "py-16" : "py-24"}`}>
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {!embedded && (
          <SectionHeading eyebrow={t.nav.process} title={t.process.title} subtitle={t.process.subtitle} />
        )}
        <div className="relative mt-14">
          <div className="absolute start-4 top-0 bottom-0 w-px bg-gradient-to-b from-primary/60 via-border to-transparent md:start-1/2 md:-translate-x-1/2" />
          <ol className="space-y-10">
            {t.process.steps.map((step, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="relative ps-12 md:grid md:grid-cols-2 md:gap-12 md:ps-0"
              >
                <span className="absolute start-0 top-1.5 grid h-9 w-9 place-items-center rounded-full border border-primary/40 bg-background font-display text-xs font-semibold text-primary md:start-1/2 md:-translate-x-1/2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={`${i % 2 === 0 ? "md:text-end md:pe-16" : "md:col-start-2 md:ps-16"}`}>
                  <div className="font-display text-xl font-semibold md:text-2xl">{step.title}</div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">{step.desc}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
