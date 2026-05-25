import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Droplet, Package, Sparkles } from "lucide-react";
import { useRef } from "react";
import { useI18n } from "@/i18n/context";

const cards = [
  {
    id: "perfume",
    title: "Perfume Builder",
    desc: "Design custom luxury fragrance bottles, caps, and olfactive notes.",
    icon: Sparkles,
    color: "from-[#FDFBF7] to-[#F5F0E6]",
    borderColor: "border-[#E8DFCE]",
  },
  {
    id: "skincare",
    title: "Skincare Builder",
    desc: "Configure jars, serums, and premium pump dispensers.",
    icon: Droplet,
    color: "from-[#FAFAFA] to-[#F0F0F0]",
    borderColor: "border-[#E0E0E0]",
  },
  {
    id: "packaging",
    title: "Packaging Configurator",
    desc: "Select secondary luxury boxes, finishes, and foils.",
    icon: Package,
    color: "from-[#FDFBF7] to-[#F5F0E6]",
    borderColor: "border-[#E8DFCE]",
  },
];

export function BuilderPromo() {
  const { dir } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-background py-32">
      {/* Soft luxury glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              <Sparkles className="h-3 w-3" />
              Interactive Studio
            </div>
            <h2 className="font-display text-4xl font-light tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
              Build Your <br/>
              <span className="font-semibold text-gradient-gold">Custom Cosmetic</span> Product
            </h2>
            <p className="max-w-xl text-lg text-muted-foreground mb-10 mx-auto lg:mx-0">
              Experience our 3D interactive studio. Select premium vessels, customize materials, choose luxury caps, and visualize your private label product before production.
            </p>
            <Link
              to="/builder"
              className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-gold-glow transition hover:opacity-90"
            >
              Launch 3D Builder
              <ArrowRight className={`h-4 w-4 transition group-hover:translate-x-1 ${dir === "rtl" ? "rotate-180" : ""}`} />
            </Link>
          </motion.div>

          <motion.div 
            style={{ y }}
            className="flex-1 grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 w-full"
          >
            {cards.map((card, i) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className={`group relative overflow-hidden rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.color} p-8 transition-shadow hover:shadow-xl`}
              >
                <div className="absolute right-0 top-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition group-hover:bg-primary/10" />
                <card.icon className="h-8 w-8 text-primary mb-6" strokeWidth={1.5} />
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.desc}</p>
                
                {card.id === "perfume" && (
                  <div className="absolute right-6 bottom-6 opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <Link to="/builder" className="text-primary hover:underline text-sm font-medium">Try Now &rarr;</Link>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
