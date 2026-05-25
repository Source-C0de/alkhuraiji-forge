import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { 
  Droplet, 
  Sparkles, 
  Home, 
  Box, 
  Check, 
  ShieldCheck, 
  TrendingDown, 
  Layers, 
  Award, 
  ArrowRight, 
  Calendar,
  DollarSign
} from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { useBuilderStore } from "@/store/useBuilderStore";

export const Route = createFileRoute("/builder")({
  component: BuilderPage,
});

const CATEGORIES = [
  { id: "perfume", name: "Perfume", description: "Design your custom signature fragrance", icon: Droplet },
  { id: "cosmetics", name: "Cosmetics", description: "Premium skincare and makeup products", icon: Sparkles },
  { id: "home", name: "Home Fragrance", description: "Luxury candles and diffusers", icon: Home },
  { id: "personal", name: "Personal Care", description: "Bath, body, and grooming essentials", icon: Box },
];

const MATERIALS = ["Glass", "Plastic", "Frosted Glass", "Crystal", "Matte Glass", "Recycled"];
const CAPACITIES = ["10ml", "30ml", "50ml", "75ml", "100ml", "150ml", "250ml"];
const BOTTLE_COLORS = [
  { name: "Transparent", hex: "transparent", price: 0 },
  { name: "Black Frosted", hex: "#222", price: 15 },
  { name: "Amber", hex: "#b45f06", price: 10 },
  { name: "Emerald", hex: "#274e13", price: 12 },
  { name: "Royal Blue", hex: "#0b5394", price: 12 },
  { name: "Rose Gold", hex: "#b4a7d6", price: 25 },
  { name: "White Matte", hex: "#f3f4f6", price: 15 },
  { name: "Gradient Luxe", hex: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", price: 30 },
];

const CAPS = [
  { name: "Metallic Gold", price: 25 },
  { name: "Matte Black", price: 15 },
  { name: "Gloss Silver", price: 18 },
  { name: "Wooden Luxury", price: 30 },
  { name: "Crystal Crown", price: 45 },
  { name: "Colored Cap", price: 20 },
];

const CAP_COLORS = [
  { name: "Transparent", hex: "transparent", price: 0 },
  { name: "Black Frosted", hex: "#222", price: 8 },
  { name: "Amber", hex: "#b45f06", price: 8 },
  { name: "Emerald", hex: "#274e13", price: 8 },
  { name: "Royal Blue", hex: "#0b5394", price: 8 },
  { name: "Rose Gold", hex: "#b4a7d6", price: 8 },
  { name: "White Matte", hex: "#f3f4f6", price: 8 },
  { name: "Gradient Luxe", hex: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", price: 8 },
];

const PUMPS = [
  { name: "Standard Spray", price: 10 },
  { name: "Fine Mist", price: 15 },
  { name: "Luxury Atomizer", price: 30 },
  { name: "Oil Roller", price: 12 },
];

const PACKAGING_TYPES = [
  { name: "Standard Box", price: 15 },
  { name: "Magnetic Luxury Box", price: 45 },
  { name: "Drawer Style Box", price: 35 },
  { name: "Premium Rigid Box", price: 50 },
];

const PACKAGING_FINISHES = [
  { name: "Matte", price: 10 },
  { name: "Gloss", price: 8 },
  { name: "Soft Touch", price: 20 },
  { name: "Velvet Finish", price: 30 },
];

const PACKAGING_ADDONS = [
  { name: "Foil Stamping", price: 15 },
  { name: "Embossing", price: 15 },
  { name: "Spot UV", price: 12 },
  { name: "Ribbon Wrap", price: 18 },
];

const NOTES = {
  top: ["Citrus", "Bergamot", "Lemon", "Lavender", "Mint"],
  middle: ["Rose", "Jasmine", "Oud", "Cinnamon", "Vanilla"],
  base: ["Musk", "Sandalwood", "Amber", "Patchouli", "Leather"],
};

const INTENSITIES = [
  { name: "Light", price: 25 },
  { name: "Balanced", price: 35 },
  { name: "Strong", price: 45 },
  { name: "Signature Intense", price: 60 },
];

const FONTS = ["Modern Sans", "Elegant Serif", "Minimal Script"];
const SHAPES = ["Rectangle", "Rounded", "Vertical Strip"];

function BuilderPage() {
  const [category, setCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("bottle"); // bottle, cap, fragrance, packaging, branding
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  // Client Representative Details
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const store = useBuilderStore();
  const { builderBottles } = useAdminStore();
  const activeBottles = builderBottles.filter((b) => b.active);

  const TABS = ["bottle", "cap", "fragrance", "packaging", "branding"];
  const activeIndex = TABS.indexOf(activeTab);
  const handlePrevTab = () => {
    if (activeIndex > 0) {
      setActiveTab(TABS[activeIndex - 1]);
    }
  };
  const handleNextTab = () => {
    if (activeIndex < TABS.length - 1) {
      setActiveTab(TABS[activeIndex + 1]);
    }
  };

  const getCapacityScale = (capacity: string) => {
    switch (capacity) {
      case "10ml": return 0.65;
      case "30ml": return 0.75;
      case "50ml": return 0.85;
      case "75ml": return 0.92;
      case "100ml": return 1.0;
      case "150ml": return 1.08;
      case "250ml": return 1.18;
      default: return 1.0;
    }
  };
  const scale = getCapacityScale(store.bottleCapacity);

  const getBottleDimensions = (silhouette: string) => {
    const sil = silhouette.toLowerCase();
    if (sil.includes("round")) {
      return {
        width: "200px",
        height: "200px",
        borderRadius: "9999px",
      };
    } else if (sil.includes("square") || sil.includes("cube")) {
      return {
        width: "170px",
        height: "230px",
        borderRadius: "16px",
      };
    } else if (sil.includes("oval")) {
      return {
        width: "175px",
        height: "240px",
        borderRadius: "100px 100px 120px 120px",
      };
    } else if (sil.includes("cylinder") || sil.includes("cylindrical")) {
      return {
        width: "140px",
        height: "260px",
        borderRadius: "9999px",
      };
    } else {
      return {
        width: "160px",
        height: "250px",
        borderRadius: "24px",
      };
    }
  };
  const dims = getBottleDimensions(store.bottleSilhouette);

  // Parallax rotation tracking for immersive Stage
  const rotateY = useMotionValue(0);
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    rotateY.set(x * 0.1);
  };
  const handleMouseLeave = () => {
    rotateY.set(0);
  };

  // Fragrance Layer Multi-Notes Toggles
  const toggleFragranceNote = (layer: "top" | "middle" | "base", note: string) => {
    const current = store.fragrance[layer] || [];
    if (current.includes(note)) {
      store.updateFragrance({ [layer]: current.filter((n) => n !== note) });
    } else {
      if (current.length < 3) {
        store.updateFragrance({ [layer]: [...current, note] });
      }
    }
  };

  // Box Presentation Addons
  const toggleAddon = (addon: string) => {
    const current = store.packaging.addons || [];
    if (current.includes(addon)) {
      store.updatePackaging({ addons: current.filter((a) => a !== addon) });
    } else {
      store.updatePackaging({ addons: [...current, addon] });
    }
  };

  // Pricing Engine Calculations in SAR (Saudi Riyals)
  const getSelectionsWithPrices = () => {
    const bottleBase = 35; // Base shape wholesale cost
    
    const matPrice = store.bottleMaterial === "Crystal" ? 35 : 
                     store.bottleMaterial === "Frosted Glass" ? 15 : 
                     store.bottleMaterial === "Glass" ? 10 : 
                     store.bottleMaterial === "Matte Glass" ? 20 : 
                     store.bottleMaterial === "Recycled" ? 12 : 5;
                     
    const colPrice = BOTTLE_COLORS.find(c => c.name === store.bottleColor)?.price || 0;
    
    const capStylePrice = CAPS.find(c => c.name === store.capStyle)?.price || 15;
    const capColorPrice = store.capStyle === "Colored Cap" ? (CAP_COLORS.find(c => c.name === store.capColor)?.price || 0) : 0;
    const capPrice = capStylePrice + capColorPrice;

    const pumpPrice = PUMPS.find(p => p.name === store.pumpType)?.price || 10;
    
    // Scent Blend custom selection calculation
    const noteCount = (store.fragrance.top?.length || 0) + (store.fragrance.middle?.length || 0) + (store.fragrance.base?.length || 0);
    const notesPrice = noteCount * 4;
    const intensityPrice = INTENSITIES.find(i => i.name === store.fragrance.intensity)?.price || 35;
    const fragranceTotalPrice = notesPrice + intensityPrice;

    // Presentation box pricing
    const boxPrice = PACKAGING_TYPES.find(p => p.name === store.packaging.type)?.price || 15;
    const finishPrice = PACKAGING_FINISHES.find(p => p.name === store.packaging.finish)?.price || 10;
    const addonsPrice = (store.packaging.addons || []).reduce((sum, ad) => sum + (PACKAGING_ADDONS.find(a => a.name === ad)?.price || 0), 0);
    const packagingTotalPrice = boxPrice + finishPrice + addonsPrice;

    const brandPrice = 5; // customized layout imprint charge

    const unitPriceBeforeDiscount = bottleBase + matPrice + colPrice + capPrice + pumpPrice + fragranceTotalPrice + packagingTotalPrice + brandPrice;
    
    // B2B Wholesale discount multiplier
    let discount = 0;
    if (store.quantity >= 5000) discount = 0.40;
    else if (store.quantity >= 1000) discount = 0.25;
    else if (store.quantity >= 500) discount = 0.15;

    const finalUnitPrice = Number((unitPriceBeforeDiscount * (1 - discount)).toFixed(2));
    const totalPrice = Number((finalUnitPrice * store.quantity).toFixed(0));

    return {
      bottleBase,
      matPrice,
      colPrice,
      capPrice,
      pumpPrice,
      fragranceTotalPrice,
      packagingTotalPrice,
      brandPrice,
      unitPrice: finalUnitPrice,
      totalPrice,
      discountPercent: Math.round(discount * 100)
    };
  };

  const pricing = getSelectionsWithPrices();

  // Custom styling completeness progress
  const getProgress = () => {
    let completed = 2; // base initial
    if (store.bottleColor !== "Transparent") completed++;
    if (store.capStyle !== "Metallic Gold") completed++;
    if (store.packaging.type !== "Standard Box") completed++;
    if (store.fragrance.intensity !== "Balanced") completed++;
    if (store.label.name !== "L'ELEGANCE") completed++;
    return Math.min(Math.round((completed / 7) * 100), 100);
  };

  const progress = getProgress();

  if (!category) {
    return (
      <div className="builder-theme min-h-screen bg-[#06060B] text-white pt-32 pb-16 px-4 flex flex-col items-center relative overflow-hidden">
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
          <h1 className="font-display text-4xl md:text-6xl font-light tracking-tight text-white leading-tight mb-6">
            Craft Your Luxury <span className="text-gradient-gold font-medium">Brand Identity</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto font-light leading-relaxed">
            Select a custom cosmetic or fragrance manufacturing catalog below to enter our high-end 3D customization configurator.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto w-full relative z-10">
          {CATEGORIES.map((cat, idx) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => cat.id === "perfume" ? setCategory(cat.id) : alert("Cosmetics and Home Fragrances coming soon!")}
              className="group relative flex flex-col items-center text-center p-10 rounded-2xl border border-white/5 bg-card/30 backdrop-blur-xl hover:border-gold/30 hover:shadow-gold-glow transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-gold/20 group-hover:text-gold group-hover:border-gold/30 transition-all duration-500">
                <cat.icon className="w-10 h-10 text-muted-foreground group-hover:text-gold transition-colors" />
              </div>
              <h3 className="font-display text-2xl font-medium mb-3 text-white">{cat.name}</h3>
              <p className="text-sm text-muted-foreground/80 font-light leading-relaxed">{cat.description}</p>
              
              <div className="mt-8 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                Enter Studio <ArrowRight className="h-3 w-3" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#05050A] text-white flex flex-col lg:flex-row overflow-hidden relative">
      
      {/* Dynamic luxury dark space highlight backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0d0d1e] via-[#05050a] to-[#020205] pointer-events-none z-0" />

      {/* Catalog Home */}
      <button 
        onClick={() => setCategory(null)}
        className="absolute top-6 left-6 z-50 px-4 py-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-gold/30 transition-all text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-white"
      >
        ← Catalogs
      </button>

      {/* ================= COLUMN 1: LEFT SIDEBAR OPTIONS (380px) ================= */}
      <aside className="w-full lg:w-[380px] lg:flex-shrink-0 border-r border-white/5 bg-[#07070F]/90 backdrop-blur-3xl z-10 flex flex-col h-screen pt-20">
        
        {/* Brand configuration text entry */}
        <div className="p-6 border-b border-white/5 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-soft">Premium OEM/ODM</span>
            <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">{progress}% Complete</span>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-light text-white">Your Brand Design</h2>
            <input 
              type="text"
              value={store.label.name}
              onChange={(e) => store.updateLabel({ name: e.target.value.toUpperCase() })}
              placeholder="ENTER BRAND NAME..."
              className="w-full bg-black/40 border border-white/10 focus:border-gold rounded-lg px-4 py-2.5 text-xs outline-none text-white tracking-widest font-medium uppercase transition-colors"
            />
          </div>
        </div>

        {/* Tab Buttons (Bottle, Cap, Fragrance, Packaging, Branding) */}
        <div className="flex border-b border-white/5 bg-black/20 overflow-x-auto scrollbar-hide flex-shrink-0">
          {[
            { id: "bottle", label: "Bottle" },
            { id: "cap", label: "Cap" },
            { id: "fragrance", label: "Fragrance" },
            { id: "packaging", label: "Packaging" },
            { id: "branding", label: "Branding" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-center text-[10px] font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap ${
                activeTab === tab.id ? "text-gold" : "text-muted-foreground hover:text-white"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div layoutId="activeStepLine" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-gold-soft" />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic configuration tabs body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-24">
          <AnimatePresence mode="wait">
            
            {/* 1. BOTTLE SHAPE & SPECIFICATIONS */}
            {activeTab === "bottle" && (
              <motion.div key="bottle-wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">1. Silhouette Shape</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {activeBottles.map((bottle) => (
                      <button
                        key={bottle.id}
                        onClick={() => store.setBottleSilhouette(bottle.name)}
                        className={`p-4 rounded-xl border text-left transition-all duration-300 relative group overflow-hidden ${
                          store.bottleSilhouette === bottle.name 
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div className="text-xs font-semibold text-white mb-1">{bottle.name}</div>
                        <div className="text-[9px] text-muted-foreground uppercase">{bottle.category}</div>
                        {store.bottleSilhouette === bottle.name && (
                          <div className="absolute right-3 top-3 h-4 w-4 bg-gold rounded-full flex items-center justify-center text-black">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">2. Material Selection</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {MATERIALS.map((mat) => (
                      <button
                        key={mat}
                        onClick={() => store.setBottleMaterial(mat)}
                        className={`p-3 rounded-lg border text-center text-xs font-medium transition-all ${
                          store.bottleMaterial === mat 
                            ? "bg-gold/10 border-gold text-gold font-semibold" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                      >
                        {mat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">3. Capacity</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {CAPACITIES.map((cap) => (
                      <button
                        key={cap}
                        onClick={() => store.setBottleCapacity(cap)}
                        className={`py-2.5 rounded-lg border text-center text-xs font-medium transition-all ${
                          store.bottleCapacity === cap 
                            ? "bg-gold/10 border-gold text-gold font-bold" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                      >
                        {cap}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">4. Glass Color & Finish</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {BOTTLE_COLORS.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => store.setBottleColor(color.name)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                          store.bottleColor === color.name ? "border-gold bg-white/5" : "border-transparent hover:bg-white/5"
                        }`}
                      >
                        <div 
                          className="w-10 h-10 rounded-full border border-white/20 shadow-lg relative overflow-hidden"
                          style={{ background: color.hex }}
                        >
                          {store.bottleColor === color.name && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Check className="h-4 w-4 text-gold" />
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-muted-foreground text-center truncate w-full">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. CAPS & PUMPS */}
            {activeTab === "cap" && (
              <motion.div key="cap-wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Cap Crown Style</h3>
                  <div className="space-y-2.5">
                    {CAPS.map((cap) => (
                      <button
                        key={cap.name}
                        onClick={() => store.setCapStyle(cap.name)}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          store.capStyle === cap.name 
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">{cap.name}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5">High-end premium crown finish</div>
                        </div>
                        <div className="text-xs font-bold text-gold">+{cap.price} SAR</div>
                      </button>
                    ))}
                  </div>
                </div>

                {store.capStyle === "Colored Cap" && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Cap Color Selection</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {CAP_COLORS.map((color) => (
                        <button
                          key={color.name}
                          onClick={() => store.setCapColor(color.name)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                            store.capColor === color.name ? "border-gold bg-white/5" : "border-transparent hover:bg-white/5"
                          }`}
                        >
                          <div 
                            className="w-10 h-10 rounded-full border border-white/20 shadow-lg relative overflow-hidden"
                            style={{ background: color.hex }}
                          >
                            {store.capColor === color.name && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Check className="h-4 w-4 text-gold" />
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] text-muted-foreground text-center truncate w-full">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Pump & Atomizer Accents</h3>
                  <div className="space-y-2.5">
                    {PUMPS.map((pump) => (
                      <button
                        key={pump.name}
                        onClick={() => store.setPumpType(pump.name)}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          store.pumpType === pump.name 
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">{pump.name}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5">High-fidelity wholesale spray valves</div>
                        </div>
                        <div className="text-xs font-bold text-gold">+{pump.price} SAR</div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. FRAGRANCE NOTE COMPOSITION */}
            {activeTab === "fragrance" && (
              <motion.div key="fragrance-wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-1">Olfactive Note Mixer</h3>
                  <p className="text-[10px] text-muted-foreground mb-4">Select up to 3 luxury notes per composition layer (+4 SAR per note).</p>
                  
                  {/* Top, Middle, Base Notes Layers */}
                  {(Object.keys(NOTES) as Array<"top" | "middle" | "base">).map((layer) => {
                    const selected = store.fragrance[layer] || [];
                    return (
                      <div key={layer} className="space-y-2.5 mb-4">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground capitalize">{layer} Notes</label>
                        <div className="flex flex-wrap gap-2">
                          {NOTES[layer].map((note) => {
                            const isAct = selected.includes(note);
                            return (
                              <button
                                key={note}
                                onClick={() => toggleFragranceNote(layer, note)}
                                className={`px-4 py-2 rounded-full border text-[10px] font-medium transition-all ${
                                  isAct 
                                    ? "bg-gold/20 border-gold text-gold shadow-[inset_0_0_0_1px_rgba(212,175,55,0.2)]" 
                                    : "bg-white/5 border-white/5 hover:border-white/20 text-white"
                                }`}
                              >
                                {note}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-white/5">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Scent Intensity & Blend</h3>
                  <div className="space-y-2.5">
                    {INTENSITIES.map((int) => (
                      <button
                        key={int.name}
                        onClick={() => store.updateFragrance({ intensity: int.name })}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          store.fragrance.intensity === int.name 
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">{int.name}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5">Custom scent density composition</div>
                        </div>
                        <div className="text-xs font-bold text-gold">+{int.price} SAR</div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. OUTER PACKAGING DESIGN */}
            {activeTab === "packaging" && (
              <motion.div key="packaging-wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Outer Box Style</h3>
                  <div className="space-y-2.5">
                    {PACKAGING_TYPES.map((pack) => (
                      <button
                        key={pack.name}
                        onClick={() => store.updatePackaging({ type: pack.name })}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          store.packaging.type === pack.name 
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-white">{pack.name}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5">Heavy cardboard wholesale box base</div>
                        </div>
                        <div className="text-xs font-bold text-gold">+{pack.price} SAR</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Box Texture & Finish</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {PACKAGING_FINISHES.map((finish) => (
                      <button
                        key={finish.name}
                        onClick={() => store.updatePackaging({ finish: finish.name })}
                        className={`p-3 rounded-lg border text-center text-xs font-medium transition-all ${
                          store.packaging.finish === finish.name 
                            ? "bg-gold/10 border-gold text-gold" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                      >
                        {finish.name} (+{finish.price} SAR)
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Embellishments & Add-ons</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {PACKAGING_ADDONS.map((addon) => {
                      const isAct = (store.packaging.addons || []).includes(addon.name);
                      return (
                        <button
                          key={addon.name}
                          onClick={() => toggleAddon(addon.name)}
                          className={`p-3 rounded-lg border text-center text-xs font-medium transition-all ${
                            isAct 
                              ? "bg-gold/10 border-gold text-gold" 
                              : "bg-white/5 border-white/5 hover:border-white/20"
                          }`}
                        >
                          {addon.name} (+{addon.price} SAR)
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* 5. BRANDING & FONTS */}
            {activeTab === "branding" && (
              <motion.div key="branding-wizard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Branding Typography</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {FONTS.map((font) => (
                      <button
                        key={font}
                        onClick={() => store.updateLabel({ font })}
                        className={`py-3 rounded-lg border text-center text-[10px] transition-all ${
                          store.label.font === font 
                            ? "bg-gold/10 border-gold text-gold font-semibold" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                        style={{ fontFamily: font === "Elegant Serif" ? "serif" : "sans-serif" }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Label Silhouette</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {SHAPES.map((shape) => (
                      <button
                        key={shape}
                        onClick={() => store.updateLabel({ shape })}
                        className={`py-3 rounded-lg border text-center text-xs font-medium transition-all ${
                          store.label.shape === shape 
                            ? "bg-gold/10 border-gold text-gold" 
                            : "bg-white/5 border-white/5 hover:border-white/20"
                        }`}
                      >
                        {shape}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Sticky Segment Navigation Controls */}
        <div className="border-t border-white/5 bg-black/60 p-4 flex items-center justify-between gap-3 flex-shrink-0 z-20">
          <button
            onClick={handlePrevTab}
            disabled={activeIndex === 0}
            className={`flex-1 py-3 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeIndex === 0
                ? "border-white/5 text-muted-foreground/30 cursor-not-allowed"
                : "border-white/10 hover:border-gold/30 hover:bg-white/5 text-white active:scale-[0.98]"
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={handleNextTab}
            disabled={activeIndex === TABS.length - 1}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeIndex === TABS.length - 1
                ? "bg-white/5 border border-white/5 text-muted-foreground/30 cursor-not-allowed"
                : "bg-gold hover:bg-gold-soft text-black active:scale-[0.98] shadow-gold-glow"
            }`}
          >
            Next →
          </button>
        </div>
      </aside>

      {/* ================= COLUMN 2: IMMERSIVE 3D INTERACTIVE Viewport (CENTER) ================= */}
      <main 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="flex-1 h-screen flex flex-col justify-center items-center relative p-8 select-none z-0"
      >
        
        {/* Overhead Spotlighting Gold Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[550px] bg-gradient-to-b from-gold/15 to-transparent blur-[80px] pointer-events-none rounded-full" />
        
        {/* Slide instructions */}
        <div className="absolute top-8 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Interactive 3D Stage</span>
          <p className="text-[8px] text-muted-foreground/50 mt-1">Move your cursor to rotate customized private label bottle</p>
        </div>

        {/* 50% Screen height floating flask */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ rotateY, transformStyle: "preserve-3d" }}
          className="relative w-full max-w-sm h-[50vh] flex items-center justify-center perspective-1000"
        >
          {/* Glass reflections */}
          <div className="absolute inset-0 bg-radial-gradient(circle, rgba(255,255,255,0.02), transparent) pointer-events-none" />

          {/* Core Dynamic Custom Perfume Bottle */}
          <motion.div
            className="border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.85),_inset_0_0_20px_rgba(255,255,255,0.1)] flex flex-col items-center relative"
            animate={{ 
              scale,
              width: dims.width,
              height: dims.height,
              borderRadius: dims.borderRadius
            }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            style={{
              backdropFilter: store.bottleMaterial === "Frosted Glass" ? "blur(20px)" : store.bottleMaterial === "Crystal" ? "blur(4px)" : "blur(10px)",
              background: store.bottleColor === "Transparent" ? "rgba(255,255,255,0.03)" : BOTTLE_COLORS.find(c => c.name === store.bottleColor)?.hex,
            }}
          >
            
            {/* Spray Pump */}
            <div 
              className="absolute -top-6 left-1/2 w-8 h-6 shadow-md transition-all"
              style={{
                background: store.pumpType === "Standard Spray" ? "#aaa" : 
                            store.pumpType === "Luxury Atomizer" ? "linear-gradient(135deg, #bf953f, #fcf6ba, #bf953f)" : 
                            store.pumpType === "Fine Mist" ? "#ddd" : "#666",
                borderRadius: store.pumpType === "Oil Roller" ? "50%" : "6px 6px 0 0",
                transform: "translateX(-50%)"
              }}
            >
              {store.pumpType === "Luxury Atomizer" && (
                <div className="absolute top-1/2 -right-8 w-10 h-10 rounded-full border border-gold bg-gold/15 backdrop-blur-md transform -translate-y-1/2 flex items-center justify-center">
                  <span className="text-[6px] font-bold text-gold uppercase tracking-wider">Atomizer</span>
                </div>
              )}
            </div>

            {/* Cap Crown */}
            <div 
              className="absolute -top-16 left-1/2 w-16 h-12 shadow-2xl transition-all"
              style={{
                background: store.capStyle === "Metallic Gold" ? "linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7)" :
                            store.capStyle === "Matte Black" ? "#111" :
                            store.capStyle === "Gloss Silver" ? "linear-gradient(to right, #d1d5db, #ffffff, #d1d5db)" :
                            store.capStyle === "Wooden Luxury" ? "#8B5A2B" : 
                            store.capStyle === "Colored Cap" ? CAP_COLORS.find(c => c.name === store.capColor)?.hex || "#333" : "rgba(255,255,255,0.15)",
                border: store.capStyle === "Crystal Crown" ? "1px solid rgba(255,255,255,0.4)" : "none",
                borderRadius: store.capStyle === "Crystal Crown" ? "18px" : store.capStyle === "Wooden Luxury" ? "2px" : "6px 6px 0 0",
                transform: "translateX(-50%)"
              }}
            />

            {/* Brand Imprint Label */}
            <div 
              className="absolute top-1/2 left-1/2 w-32 min-h-24 bg-black/90 p-4 flex flex-col items-center justify-center text-center shadow-2xl border border-white/10"
              style={{
                borderRadius: store.label.shape === "Rounded" ? "12px" : "0px",
                height: store.label.shape === "Vertical Strip" ? "75%" : "auto",
                fontFamily: store.label.font === "Elegant Serif" ? "serif" : "sans-serif",
                transform: "translate(-50%, -50%) translateZ(40px)"
              }}
            >
              <span className="text-[8px] uppercase tracking-[0.25em] text-gold-soft mb-1 font-bold">EAU DE PARFUM</span>
              <span className="font-display font-medium text-lg leading-tight text-white tracking-widest break-words w-full">
                {store.label.name || "YOUR BRAND"}
              </span>
              <span className="text-[7px] uppercase tracking-widest text-muted-foreground mt-3 font-semibold">
                {store.bottleCapacity} / 3.4 FL.OZ
              </span>
            </div>

            {/* Reflection Overlay Reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-[inherit]" />
          </motion.div>
        </motion.div>

        {/* Quality Badging */}
        <div className="absolute bottom-16 flex gap-6 z-10">
          {[
            { icon: ShieldCheck, text: "GMP Certified" },
            { icon: Award, text: "IFRA Compliant" },
            { icon: Layers, text: "Sustainably Sourced" }
          ].map((badge) => (
            <div key={badge.text} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-md shadow-lg text-[10px] text-muted-foreground">
              <badge.icon className="h-3.5 w-3.5 text-gold" />
              <span>{badge.text}</span>
            </div>
          ))}
        </div>

      </main>

      {/* ================= COLUMN 3: STICKY WHOLESALE PRICING (RIGHT) ================= */}
      <aside className="w-full lg:w-[340px] lg:flex-shrink-0 border-l border-white/5 bg-[#07070F]/90 backdrop-blur-3xl z-10 flex flex-col h-screen pt-20 justify-between">
        
        {/* Selection items summaries with specific price markup indicators */}
        <div className="p-6 border-b border-white/5 flex-1 overflow-y-auto scrollbar-hide">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-4">Design Specs & Pricing</h3>
          
          <div className="space-y-3.5">
            {[
              { label: "Silhouette Shape", value: store.bottleSilhouette, price: pricing.bottleBase },
              { label: "Glass Material", value: store.bottleMaterial, price: pricing.matPrice },
              { label: "Glass Finishing", value: store.bottleColor, price: pricing.colPrice },
              { label: "Cap Style Accent", value: store.capStyle, price: pricing.capPrice },
              { label: "Atomizer Spray", value: store.pumpType, price: pricing.pumpPrice },
              { label: "Olfactive Fragrance", value: store.fragrance.intensity || "Balanced", price: pricing.fragranceTotalPrice },
              { label: "Outer Box Pack", value: store.packaging.type, price: pricing.packagingTotalPrice }
            ].map((spec) => (
              <div key={spec.label} className="flex justify-between items-start text-xs border-b border-white/5 pb-2">
                <div className="space-y-0.5">
                  <div className="text-muted-foreground font-light text-[10px] uppercase tracking-wider">{spec.label}</div>
                  <div className="text-white font-medium">{spec.value}</div>
                </div>
                <div className="text-[10px] font-bold text-gold-soft whitespace-nowrap">+{spec.price} SAR</div>
              </div>
            ))}
          </div>

          {/* Wholesale B2B parameters */}
          <div className="mt-8 p-4 rounded-xl border border-white/5 bg-black/40 space-y-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-4 w-4 text-gold-soft" />
              <span>Est. Delivery: <strong className="text-white">18 - 24 Days</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-gold-soft" />
              <span>Wholesale MOQ: <strong className="text-white">100 Units</strong></span>
            </div>
          </div>
        </div>

        {/* Dynamic bulk calculator */}
        <div className="p-6 border-t border-white/5 bg-black/50 flex-shrink-0">
          
          {/* Slider */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Production Units</span>
              <span className="font-bold text-gold">{store.quantity.toLocaleString()} Bottles</span>
            </div>
            <input 
              type="range"
              min="100"
              max="5000"
              step="100"
              value={store.quantity}
              onChange={(e) => store.setQuantity(Number(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
            />
            {pricing.discountPercent > 0 && (
              <div className="flex items-center gap-1.5 text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>{pricing.discountPercent}% High-Volume Discount Applied</span>
              </div>
            )}
          </div>

          {/* Price display in Riyal */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Wholesale Rate / Unit</span>
              <span className="text-xs font-semibold text-white">{pricing.unitPrice.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-muted-foreground pb-1">Total Estimated wholesale</span>
              <div className="text-right">
                <div className="flex items-baseline justify-end text-gold">
                  <span className="font-display text-2xl font-bold tracking-tight">
                    {pricing.totalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider ml-1 text-gold-soft">SAR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            <button 
              onClick={() => setInquiryModalOpen(true)}
              className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-soft text-black font-bold uppercase tracking-wider transition-all shadow-gold-glow flex items-center justify-center gap-2 text-xs"
            >
              <DollarSign className="h-4 w-4" /> Request Samples & Wholesale Quote
            </button>
            <button 
              onClick={() => setSuccessModalOpen(true)}
              className="w-full py-2.5 rounded-xl border border-white/10 hover:border-gold/30 hover:bg-white/5 transition-all text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-white"
            >
              Save Brand Design Draft
            </button>
          </div>
        </div>

      </aside>

      {/* ================= INQUIRY MODALS ================= */}
      {/* 1. Request Quotation Form */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-8 rounded-2xl bg-card border border-white/10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-soft" />
            <h2 className="font-display text-2xl font-semibold mb-2">Request OEM Quotation</h2>
            <p className="text-xs text-muted-foreground mb-6">Enter your contact credentials below. A dedicated corporate AlKhuraiji consultant will get back to you with custom wholesale pricing quotes within 24 hours.</p>
            
            <form onSubmit={(e) => { e.preventDefault(); setInquiryModalOpen(false); setSuccessModalOpen(true); }} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Representative Name</label>
                <input 
                  type="text" 
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full mt-1.5 px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-gold outline-none text-white transition-colors text-sm"
                  placeholder="Representative Name"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Business Email Address</label>
                <input 
                  type="email" 
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full mt-1.5 px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-gold outline-none text-white transition-colors text-sm"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Contact Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full mt-1.5 px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-gold outline-none text-white transition-colors text-sm"
                  placeholder="+966 50 000 0000"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setInquiryModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 rounded-xl bg-gold hover:bg-gold-soft text-black font-bold uppercase tracking-wider transition-colors shadow-gold-glow text-xs"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 2. Success dialog */}
      {successModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm p-8 rounded-2xl bg-card border border-white/10 text-center shadow-2xl relative"
          >
            <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-gold stroke-[2.5]" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2">Inquiry Logged</h2>
            <p className="text-xs text-muted-foreground mb-6">Your bespoke packaging & fragrance specifications have been logged securely. Sample kits will be arranged.</p>
            
            <button 
              onClick={() => setSuccessModalOpen(false)}
              className="w-full py-3 rounded-xl bg-gold hover:bg-gold-soft text-black font-bold uppercase tracking-wider transition-colors shadow-gold-glow text-xs"
            >
              Continue Customization
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
