import { motion } from "framer-motion";
import { useI18n } from "@/i18n/context";

// Import all 17 logos from assets
import abdulSamad from "@/assets/logos/abdul_samad_al_qurashi.png";
import afnan from "@/assets/logos/afnan_perfumes.png";
import ajmal from "@/assets/logos/ajmal.png";
import alHaramain from "@/assets/logos/al_haramain.png";
import arabianOud from "@/assets/logos/arabian_oud.png";
import armaf from "@/assets/logos/armaf_club_de_nuit.png";
import bdk from "@/assets/logos/bdk_parfums.png";
import calvinKlein from "@/assets/logos/calvin_klein.png";
import creed from "@/assets/logos/creed___royal_oud.png";
import genie from "@/assets/logos/genie_collection.png";
import lattafa from "@/assets/logos/lattafa.png";
import lattafaRaghba from "@/assets/logos/lattafa_raghba_wood.png";
import alhambra from "@/assets/logos/maison_alhambra.png";
import majestic from "@/assets/logos/majestic_special_oud.png";
import rasasi from "@/assets/logos/rasasi.png";
import swissArabian from "@/assets/logos/swiss_arabian.png";
import tfk from "@/assets/logos/the_fragrance_kitchen.png";

const ROW1_LOGOS = [
  { name: "Abdul Samad Al Qurashi", logo: abdulSamad },
  { name: "Afnan Perfumes", logo: afnan },
  { name: "Ajmal", logo: ajmal },
  { name: "Al Haramain", logo: alHaramain },
  { name: "Arabian Oud", logo: arabianOud },
  { name: "Armaf Club de Nuit", logo: armaf },
  { name: "BDK Parfums", logo: bdk },
  { name: "Calvin Klein", logo: calvinKlein },
  { name: "Creed Royal Oud", logo: creed },
];

const ROW2_LOGOS = [
  { name: "Genie Collection", logo: genie },
  { name: "Lattafa", logo: lattafa },
  { name: "Lattafa Raghba", logo: lattafaRaghba },
  { name: "Maison Alhambra", logo: alhambra },
  { name: "Majestic Oud", logo: majestic },
  { name: "Rasasi", logo: rasasi },
  { name: "Swiss Arabian", logo: swissArabian },
  { name: "The Fragrance Kitchen", logo: tfk },
];

export function PartnerLogos() {
  const { t } = useI18n();

  // Multiply lists to ensure smooth continuous scrolling on ultra-wide screens
  const row1Items = [...ROW1_LOGOS, ...ROW1_LOGOS, ...ROW1_LOGOS];
  const row2Items = [...ROW2_LOGOS, ...ROW2_LOGOS, ...ROW2_LOGOS];

  return (
    <section className="relative py-20 overflow-hidden bg-background">
      {/* Stylesheet injector for local isolated keyframe animations and hovers */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scrollLeftLoop {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        @keyframes scrollRightLoop {
          0% { transform: translate3d(-33.333%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .scroll-left-track {
          animation: scrollLeftLoop 40s linear infinite;
        }
        .scroll-right-track {
          animation: scrollRightLoop 45s linear infinite;
        }
        .partner-carousel-group:hover .scroll-left-track,
        .partner-carousel-group:hover .scroll-right-track {
          animation-play-state: paused;
        }
      `}} />

      <div className="mx-auto max-w-7xl px-4 md:px-8 mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-gold bg-gold/5 border border-gold/20 px-3 py-1.5 rounded-full inline-block mb-4 shadow-sm">
            Partnered Brands
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-light tracking-tight text-foreground">
            Bespoke Formulations for <span className="text-gradient-gold font-medium">Elite Brands</span>
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
            Proudly engineering and manufacturing luxury perfume OEM/ODM solutions for leading houses across the Gulf and globally.
          </p>
        </motion.div>
      </div>

      {/* Main Carousel viewport container */}
      <div className="partner-carousel-group relative w-full flex flex-col gap-6 select-none py-4 cursor-pointer overflow-hidden">
        
        {/* Left / Right soft fading vignette edge overlay for infinite loops */}
        <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-background via-transparent to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-background via-transparent to-transparent z-10 pointer-events-none" />

        {/* Row 1: Scrolls Left-to-Right */}
        <div className="flex w-full overflow-hidden">
          <div className="scroll-right-track flex gap-5 whitespace-nowrap pl-5">
            {row1Items.map((item, idx) => (
              <div
                key={`row1-${idx}`}
                className="w-40 md:w-44 h-20 md:h-24 flex items-center justify-center p-4 rounded-xl border border-border bg-card/25 hover:border-gold/40 hover:shadow-gold-glow/5 transition-all duration-300 relative group overflow-hidden flex-shrink-0"
              >
                {/* Micro corner indicators for luxury style */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-gold/0 group-hover:border-gold/30 transition-all duration-300" />
                <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-gold/0 group-hover:border-gold/30 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-gold/0 group-hover:border-gold/30 transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-gold/0 group-hover:border-gold/30 transition-all duration-300" />
                
                <img
                  src={item.logo}
                  alt={item.name}
                  className="h-8 md:h-10 max-w-[120px] md:max-w-[130px] object-contain transition-all duration-500 filter grayscale contrast-125 brightness-90 hover:grayscale-0 dark:brightness-0 dark:invert dark:opacity-40 dark:hover:opacity-90 opacity-80 hover:opacity-100 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolls Right-to-Left */}
        <div className="flex w-full overflow-hidden">
          <div className="scroll-left-track flex gap-5 whitespace-nowrap pl-5">
            {row2Items.map((item, idx) => (
              <div
                key={`row2-${idx}`}
                className="w-40 md:w-44 h-20 md:h-24 flex items-center justify-center p-4 rounded-xl border border-border bg-card/25 hover:border-gold/40 hover:shadow-gold-glow/5 transition-all duration-300 relative group overflow-hidden flex-shrink-0"
              >
                {/* Micro corner indicators for luxury style */}
                <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-gold/0 group-hover:border-gold/30 transition-all duration-300" />
                <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-gold/0 group-hover:border-gold/30 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-gold/0 group-hover:border-gold/30 transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-gold/0 group-hover:border-gold/30 transition-all duration-300" />

                <img
                  src={item.logo}
                  alt={item.name}
                  className="h-8 md:h-10 max-w-[120px] md:max-w-[130px] object-contain transition-all duration-500 filter grayscale contrast-125 brightness-90 hover:grayscale-0 dark:brightness-0 dark:invert dark:opacity-40 dark:hover:opacity-90 opacity-80 hover:opacity-100 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
