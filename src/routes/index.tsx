import { createFileRoute } from "@tanstack/react-router";
import { AnimatedHero } from "@/components/sections/AnimatedHero";
import { StatsStrip } from "@/components/sections/StatsStrip";
import { CapabilitiesGrid } from "@/components/sections/CapabilitiesGrid";
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
      { title: "AlKhuraiji Factory — Precision Manufacturing & Private Label" },
      { name: "description", content: "Engineering world-class manufacturing, OEM and private label production for global brands. 480+ partners across 38 countries." },
      { property: "og:title", content: "AlKhuraiji Factory — Precision Manufacturing" },
      { property: "og:description", content: "World-class manufacturing solutions for global brands." },
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
      <ProcessTimeline />
      <WhyUs />
      <IndustriesStrip />
      <Testimonials />
      <CTABanner />
    </PageTransition>
  );
}
