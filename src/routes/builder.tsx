import { createFileRoute } from "@tanstack/react-router";
import { BuilderSidebar } from "@/components/builder/BuilderSidebar";
import { BuilderPreview } from "@/components/builder/BuilderPreview";
import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Sparkles, Home, Box } from "lucide-react";

export const Route = createFileRoute("/builder")({
  component: BuilderPage,
});

const CATEGORIES = [
  { id: "perfume", name: "Perfume", description: "Design your custom signature fragrance", icon: Droplets },
  { id: "cosmetics", name: "Cosmetics", description: "Premium skincare and makeup products", icon: Sparkles },
  { id: "home", name: "Home Fragrance", description: "Luxury candles and diffusers", icon: Home },
  { id: "personal", name: "Personal Care", description: "Bath, body, and grooming essentials", icon: Box },
];

function BuilderPage() {
  const [category, setCategory] = useState<string | null>(null);

  if (!category) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-16 px-4 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-gradient-gold">
            Select Product Category
          </h1>
          <p className="mt-4 text-muted-foreground text-lg">
            Choose a manufacturing vertical to begin configuring your private label product.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto w-full">
          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => cat.id === "perfume" ? setCategory(cat.id) : alert("Coming soon!")}
              className="group relative flex flex-col items-center text-center p-8 rounded-2xl border border-border bg-card hover:border-primary/50 hover:shadow-gold-glow transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all duration-500">
                <cat.icon className="w-8 h-8 opacity-70 group-hover:opacity-100" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{cat.name}</h3>
              <p className="text-sm text-muted-foreground">{cat.description}</p>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background overflow-hidden relative">
      <button 
        onClick={() => setCategory(null)}
        className="absolute top-24 left-8 z-50 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
      >
        ← Back to Categories
      </button>

      <div className="w-full lg:w-1/2 h-screen overflow-y-auto pt-32 relative z-10 scrollbar-hide">
        <BuilderSidebar />
      </div>
      <div className="hidden lg:flex lg:w-1/2 h-screen fixed right-0 top-0 pt-20 bg-background overflow-hidden z-0">
        <BuilderPreview />
      </div>
    </div>
  );
}
