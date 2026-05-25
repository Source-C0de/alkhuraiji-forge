import { createFileRoute } from "@tanstack/react-router";
import { PageTransition } from "@/components/layout/PageTransition";
import { SectionHeading } from "@/components/ui-custom/SectionHeading";
import { BlueprintGrid } from "@/components/ui-custom/BlueprintGrid";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CTABanner } from "@/components/sections/CTABanner";
import { useI18n } from "@/i18n/context";
import machinery from "@/assets/process_1.png";

export const Route = createFileRoute("/process")({
  component: ProcessPage,
  head: () => ({
    meta: [
      { title: "Production Process — AlKhuraiji Factory" },
      { name: "description", content: "From brief to shipment: a seven-stage manufacturing workflow engineered for predictability." },
      { property: "og:title", content: "Production Process — AlKhuraiji Factory" },
      { property: "og:description", content: "Seven-stage production workflow engineered for predictability." },
      { property: "og:url", content: "/process" },
    ],
    links: [{ rel: "canonical", href: "/process" }],
  }),
});

function ProcessPage() {
  const { t } = useI18n();
  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden pt-32 pb-16 md:pt-40">
        <BlueprintGrid />
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading eyebrow={t.nav.process} title={<span className="text-gradient-gold">{t.process.title}</span>} subtitle={t.process.subtitle} />
        </div>
      </section>

      <section className="relative pb-16">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border shadow-elevated">
            <img src={machinery} alt="" loading="lazy" width={1600} height={1000} className="h-72 w-full object-cover md:h-[420px]" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          </div>
        </div>
      </section>

      <ProcessTimeline />
      <CTABanner />
    </PageTransition>
  );
}
