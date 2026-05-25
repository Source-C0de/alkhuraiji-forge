import { useBuilderStore } from "@/store/useBuilderStore";
import { motion } from "framer-motion";

export function HeroStep() {
  const nextStep = useBuilderStore((s) => s.nextStep);

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gradient-gold">
          Create Your Private Label Perfume
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          Design every detail of your custom fragrance product — from bottle to fragrance composition.
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex gap-4"
      >
        <button
          onClick={nextStep}
          className="px-8 py-4 rounded-full bg-primary text-primary-foreground text-sm font-semibold uppercase tracking-widest shadow-gold-glow transition hover:opacity-90"
        >
          Start Customizing
        </button>
      </motion.div>
    </div>
  );
}
