import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { PageTransition } from "@/components/layout/PageTransition";
import { SectionHeading } from "@/components/ui-custom/SectionHeading";
import { BlueprintGrid } from "@/components/ui-custom/BlueprintGrid";
import { StatCounter } from "@/components/ui-custom/StatCounter";
import { CTABanner } from "@/components/sections/CTABanner";
import { useI18n } from "@/i18n/context";
import about from "@/assets/about-factory.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — AlKhuraiji Factory" },
      { name: "description", content: "Two decades of precision manufacturing. Our story, vision, milestones and certifications." },
      { property: "og:title", content: "About — AlKhuraiji Factory" },
      { property: "og:description", content: "Two decades of precision manufacturing for the world's most demanding brands." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function AboutPage() {
  const { t } = useI18n();
  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden pt-32 pb-20 md:pt-40">
        <BlueprintGrid />
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading eyebrow={t.nav.about} title={<span className="text-gradient-gold">{t.about.title}</span>} subtitle={t.about.subtitle} />
        </div>
      </section>

      <section className="relative py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="overflow-hidden rounded-3xl border border-border">
            <img src={about} alt="" loading="lazy" width={1600} height={1000} className="h-full w-full object-cover" />
          </motion.div>
          <div>
            <h3 className="font-display text-3xl font-semibold">{t.about.storyTitle}</h3>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t.about.story}</p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t.about.visionTitle}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.about.vision}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t.about.missionTitle}</div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{t.about.mission}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/30 py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 md:grid-cols-4 md:px-8">
          {t.home.stats.map((s, i) => (
            <StatCounter key={i} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading title={t.about.milestonesTitle} />
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {t.about.milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="relative rounded-2xl border border-border bg-card p-6"
              >
                <div className="font-display text-3xl text-gradient-gold">{m.year}</div>
                <div className="mt-3 font-display text-base font-semibold">{m.title}</div>
                <p className="mt-1.5 text-sm text-muted-foreground">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading title={t.about.certsTitle} />
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {t.about.certs.map((c) => (
              <div key={c} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-medium">
                <Award className="h-4 w-4 text-primary" />
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </PageTransition>
  );
}
