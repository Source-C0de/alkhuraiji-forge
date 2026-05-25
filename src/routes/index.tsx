import { createFileRoute } from "@tanstack/react-router";
import { AnimatedHero } from "@/components/sections/AnimatedHero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { PartnerLogos } from "@/components/sections/PartnerLogos";
import { CapabilitiesGrid } from "@/components/sections/CapabilitiesGrid";
import { BuilderPromo } from "@/components/sections/BuilderPromo";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { WhyUs } from "@/components/sections/WhyUs";
import { IndustriesStrip } from "@/components/sections/IndustriesStrip";
import { Testimonials } from "@/components/sections/Testimonials";
import { CTABanner } from "@/components/sections/CTABanner";
import { PageTransition } from "@/components/layout/PageTransition";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AlKhuraiji Beauty — Premium Private Label Cosmetic & Perfume Manufacturing" },
      { name: "description", content: "Engineering world-class luxury cosmetics, OEM and private label perfume production for global brands." },
      { property: "og:title", content: "AlKhuraiji Beauty — Luxury Manufacturing" },
      { property: "og:description", content: "World-class luxury cosmetic manufacturing solutions for global brands." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

function Index() {
  return (
    <PageTransition>
      <AnimatedHero />
      <StatsStrip />
      <CapabilitiesGrid />
      <BuilderPromo />
      <ProcessTimeline />
      <WhyUs />
      <IndustriesStrip />
      <Testimonials />
      <PartnerLogos />
      <CTABanner />
    </PageTransition>
  );
}
