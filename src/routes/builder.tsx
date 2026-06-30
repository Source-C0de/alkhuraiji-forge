import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Droplet, Sparkles, Home, Box, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/builder")({
  component: BuilderLayout,
});

const CATEGORIES = [
  {
    id: "perfume",
    name: "Perfume",
    description: "Design your custom signature fragrance",
    icon: Droplet,
  },
  {
    id: "cosmetics",
    name: "Cosmetics",
    description: "Premium skincare and makeup products",
    icon: Sparkles,
  },
  { id: "home", name: "Home Fragrance", description: "Luxury candles and diffusers", icon: Home },
  {
    id: "personal",
    name: "Personal Care",
    description: "Bath, body, and grooming essentials",
    icon: Box,
  },
];

function BuilderLayout() {
  const navigate = useNavigate();
  // Track the current pathname so we only show the catalog at the exact
  // /builder URL. When the user is on a child route (e.g. /builder/perfume),
  // we hide the catalog entirely so the configurator renders full-screen.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const showCatalog = pathname === "/builder";

  const handleCategoryClick = (id: string) => {
    if (id === "perfume") {
      navigate({ to: "/builder/perfume" });
    } else if (id === "cosmetics") {
      navigate({ to: "/cosmetics" });
    } else {
      alert("Home Fragrance and Personal Care coming soon!");
    }
  };

  return (
    <>
      {showCatalog && (
        <div className="builder-theme min-h-screen bg-background text-foreground pt-32 pb-16 px-4 flex flex-col items-center relative overflow-hidden transition-colors duration-300">
        {/* Soft immersive accent halo */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-40 pointer-events-none" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-20 relative z-10"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold mb-6">
            Private Label Manufacturing Configurator
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight text-foreground leading-tight mb-6">
            Craft Your Luxury <span className="text-gradient-gold font-medium">Brand Identity</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light leading-relaxed">
            Select a custom cosmetic or fragrance manufacturing catalog below to enter our high-end
            3D customization configurator.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto w-full relative z-10">
          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleCategoryClick(cat.id)}
              className="group relative flex flex-col items-center text-center p-10 rounded-2xl border border-border bg-card/30 backdrop-blur-xl hover:border-gold/30 hover:shadow-gold-glow transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 rounded-full bg-secondary/30 border border-border flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-gold/20 group-hover:text-gold group-hover:border-gold/30 transition-all duration-500">
                <cat.icon className="w-10 h-10 text-muted-foreground group-hover:text-gold transition-colors" />
              </div>
              <h3 className="font-display text-2xl font-medium mb-3 text-foreground">{cat.name}</h3>
              <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">
                {cat.description}
              </p>

              <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                Enter Studio <ArrowRight className="h-3 w-3" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      )}
      {/* Child route (e.g. /builder/perfume) renders here when navigated */}
      <Outlet />
    </>
  );
}