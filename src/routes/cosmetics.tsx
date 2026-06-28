import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ShieldCheck,
  Layers,
  Award,
  Droplets,
  FlaskConical,
  Package,
  Palette,
  Wind,
  Tag,
  Sparkles,
  ChevronLeft,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export const Route = createFileRoute("/cosmetics")({
  component: CosmeticsBuilderPage,
  validateSearch: (search: Record<string, unknown>) => ({
    product: typeof search.product === "string" ? search.product : undefined,
  }),
});

// ─── DATA DEFINITIONS ───────────────────────────────────────────────────────

const PRODUCT_CATEGORIES = [
  { id: "face-cream",   name: "Face Cream",     desc: "Anti-aging moisturizers & day creams",   basePrice: 45 },
  { id: "serum",        name: "Serum",          desc: "Advanced active ingredient serums",      basePrice: 65 },
  { id: "hair-oil",     name: "Hair Oil",        desc: "Nourishing scalp & hair treatment oils", basePrice: 40 },
  { id: "shampoo",      name: "Shampoo",         desc: "Sulfate-free luxury cleansing formulas", basePrice: 35 },
  { id: "conditioner",  name: "Conditioner",     desc: "Deep conditioning & repair treatments",  basePrice: 35 },
  { id: "body-lotion",  name: "Body Lotion",     desc: "Hydrating & firming body emulsions",     basePrice: 30 },
  { id: "face-wash",    name: "Face Wash",       desc: "Gentle & brightening cleansers",        basePrice: 28 },
  { id: "sunscreen",    name: "Sunscreen",        desc: "SPF 30–50+ broad spectrum protection",  basePrice: 55 },
  { id: "beard-oil",    name: "Beard Oil",      desc: "Premium grooming & conditioning oils",  basePrice: 42 },
  { id: "lip-balm",     name: "Lip Balm",       desc: "Tinted & therapeutic lip treatments",   basePrice: 18 },
  { id: "body-butter",  name: "Body Butter",    desc: "Rich whipped body butter formulations", basePrice: 38 },
  { id: "hand-cream",   name: "Hand Cream",     desc: "Repair & moisturizing hand care",       basePrice: 22 },
];

const CONTAINER_TYPES = {
  Bottles: [
    { name: "Dropper Bottle",  price: 18, svg: "dropper",  desc: "Precision dose serums & oils" },
    { name: "Pump Bottle",     price: 22, svg: "pump",     desc: "Easy-dispensing lotions & creams" },
    { name: "Spray Bottle",    price: 20, svg: "spray",    desc: "Mist-application toners & sprays" },
    { name: "Glass Bottle",    price: 30, svg: "glass",    desc: "Premium glass for luxury lines" },
  ],
  Jars: [
    { name: "Luxury Jar",  price: 25, svg: "jar",     desc: "Wide-mouth cream & butter jars" },
    { name: "Frosted Jar", price: 28, svg: "frosted",  desc: "Elegant frosted glass finish" },
    { name: "Acrylic Jar", price: 20, svg: "acrylic",  desc: "Clear lightweight acrylic jars" },
  ],
  Tubes: [
    { name: "Matte Tube",     price: 15, svg: "tube",  desc: "Soft-touch laminate tubes" },
    { name: "Gloss Tube",     price: 14, svg: "tube",  desc: "High-shine laminate finish" },
    { name: "Metallic Tube",  price: 18, svg: "tube",  desc: "Reflective metallic foil tubes" },
  ],
};

const MATERIALS = [
  { name: "Clear Glass",        price: 20, desc: "Transparent premium glass",      gradient: "from-blue-100/20 to-white/20" },
  { name: "Frosted Glass",      price: 25, desc: "Elegant satin frosted finish",   gradient: "from-slate-200/20 to-gray-100/20" },
  { name: "PET Plastic",        price: 8,  desc: "Lightweight & shatter-proof",    gradient: "from-cyan-100/20 to-teal-50/20" },
  { name: "Acrylic",            price: 12, desc: "Crystal-clear luxury acrylic",   gradient: "from-indigo-50/20 to-purple-50/20" },
  { name: "Recycled Material",  price: 10, desc: "Eco-certified sustainable PCR",  gradient: "from-green-100/20 to-emerald-50/20" },
  { name: "Luxury Matte",       price: 30, desc: "Velvety soft-touch matte ABS",   gradient: "from-stone-200/20 to-neutral-200/20" },
];

const CAPACITIES = [
  { size: "15ml",  price: 0,  scaleFactor: 0.60 },
  { size: "30ml",  price: 5,  scaleFactor: 0.72 },
  { size: "50ml",  price: 8,  scaleFactor: 0.82 },
  { size: "100ml", price: 12, scaleFactor: 1.00 },
  { size: "200ml", price: 18, scaleFactor: 1.18 },
];

const COLOR_FINISHES = [
  { name: "Pearl White",    hex: "#f8f6f0", price: 8 },
  { name: "Matte Black",    hex: "#1a1a1a", price: 10 },
  { name: "Rose Gold",      hex: "#c9956c", price: 15 },
  { name: "Sage Green",     hex: "#8fad88", price: 10 },
  { name: "Navy Blue",      hex: "#243b6e", price: 10 },
  { name: "Champagne",      hex: "#f7e7ce", price: 12 },
  { name: "Frosted Clear",  hex: "rgba(200,210,220,0.4)", price: 8 },
  { name: "Gradient Luxe",  hex: "linear-gradient(135deg,#f6d365,#fda085)", price: 22 },
];

const CAP_TYPES = [
  { name: "Screw Cap",       price: 5,  desc: "Standard precision screw closure" },
  { name: "Snap Cap",        price: 6,  desc: "One-click secure snap closure" },
  { name: "Gold Metal Cap",  price: 18, desc: "Luxury plated metal crown cap" },
  { name: "Wooden Cap",      price: 14, desc: "Natural bamboo / wood cap" },
  { name: "Acrylic Cap",     price: 10, desc: "Crystal-clear acrylic disc cap" },
  { name: "Pump Cap",        price: 15, desc: "All-in-one integrated pump cap" },
];

const LABEL_OPTIONS = [
  { name: "Wraparound Label", price: 12, desc: "Full 360° container wrap" },
  { name: "Front + Back",     price: 10, desc: "Dual-panel front & back labels" },
  { name: "Die-Cut Label",    price: 18, desc: "Custom-shape premium die cut" },
  { name: "Embossed Label",   price: 25, desc: "Raised 3D embossed lettering" },
  { name: "No Label",         price: 0,  desc: "Direct print / bare container" },
];

const LABEL_FONTS = ["Elegant Serif", "Modern Sans", "Minimal Script", "Bold Display"];
const LABEL_SHAPES = ["Rectangle", "Oval", "Custom Die-Cut"];

const OUTER_PACKAGING = [
  { name: "No Outer Box",        price: 0,  desc: "Container only, no box" },
  { name: "Standard Carton",     price: 15, desc: "Kraft or white folding carton" },
  { name: "Magnetic Luxury Box", price: 48, desc: "Rigid magnetic closure box" },
  { name: "Drawer Slide Box",    price: 35, desc: "Elegant sliding sleeve box" },
  { name: "Clear Window Box",    price: 22, desc: "Carton with product view window" },
  { name: "Eco Kraft Box",       price: 18, desc: "Sustainable recycled kraft board" },
];

const PACKAGING_FINISHES = [
  { name: "Matte Lamination",  price: 8  },
  { name: "Gloss Lamination",  price: 6  },
  { name: "Soft-Touch",        price: 18 },
  { name: "Velvet Finish",     price: 28 },
];

const PACKAGING_ADDONS = [
  { name: "Gold Foil Stamping", price: 15 },
  { name: "Embossing/Deboss",   price: 15 },
  { name: "Spot UV Coating",    price: 12 },
  { name: "Ribbon Pull",        price: 10 },
  { name: "Magnetic Insert",    price: 20 },
];

const FORMULA_TYPES: Record<string, string[]> = {
  "face-cream":   ["Anti-Aging Complex", "Brightening Formula", "Deep Hydration", "Barrier Repair", "Retinol Infused"],
  "serum":        ["Hyaluronic Acid 2%", "Niacinamide 10%", "Vitamin C Serum", "AHA/BHA Blend", "Peptide Complex"],
  "hair-oil":     ["Argan Oil Blend", "Coconut & Keratin", "Black Seed Oil", "Rosemary Growth", "Multi-Oil Fusion"],
  "shampoo":      ["Keratin Repair", "Moisture Balance", "Scalp Purifying", "Anti-Dandruff", "Color Safe"],
  "conditioner":  ["Deep Repair", "Lightweight Hydration", "Protein Treatment", "Frizz Control", "Bond Builder"],
  "body-lotion":  ["Shea & Cocoa Butter", "Hyaluronic Fusion", "Firming Complex", "Glow Formula", "Sensitive Skin"],
  "face-wash":    ["Gentle Foam", "Micellar Cleanse", "Exfoliating Gel", "Brightening Milk", "Oil-Control"],
  "sunscreen":    ["SPF 30 PA++", "SPF 50 PA+++", "Tinted SPF 40", "Chemical Filter", "Mineral Zinc"],
  "beard-oil":    ["Argan & Jojoba", "Sandalwood Blend", "Growth Stimulating", "Fragrance-Free", "Deep Conditioning"],
  "lip-balm":     ["Shea Butter Classic", "Tinted SPF 15", "Peptide Plumping", "Vitamin E & C", "Overnight Repair"],
  "body-butter":  ["Pure Shea Whip", "Cocoa Mango Blend", "Vitamin Infused", "Anti-Stretch Mark", "Glow Illuminating"],
  "hand-cream":   ["Intensive Repair", "Anti-Age Renew", "Brightening Complex", "Fast-Absorb Light", "Keratin Protect"],
};

const SCENT_OPTIONS = [
  { name: "Unscented",       price: 0  },
  { name: "Rose & Oud",      price: 12 },
  { name: "Jasmine Bloom",   price: 10 },
  { name: "Fresh Citrus",    price: 8  },
  { name: "Vanilla Musk",    price: 10 },
  { name: "Sandalwood",      price: 12 },
  { name: "Green Tea",       price: 8  },
  { name: "Lavender Calm",   price: 9  },
  { name: "Custom Blend",    price: 25 },
];

const TABS = ["bottle", "cap", "fragrance", "packaging", "branding"] as const;
type TabId = typeof TABS[number];

// ─── CONTAINER SVG PREVIEW ───────────────────────────────────────────────────
function ContainerPreview({
  containerName,
  colorHex,
  capacity,
  brandName,
  productName,
  resolvedTheme,
}: {
  containerName: string;
  colorHex: string;
  capacity: string;
  brandName: string;
  productName: string;
  resolvedTheme: string;
}) {
  const isGradient = colorHex.startsWith("linear-gradient");
  const fillColor = isGradient ? "url(#previewGrad)" : colorHex;
  const isDarkFill = ["#1a1a1a", "#243b6e"].includes(colorHex);
  const textColor = isDarkFill ? "#ffffff" : resolvedTheme === "dark" ? "#ffffff" : "#1a1a1a";
  const n = containerName.toLowerCase();

  const capColor = "#d4af37";

  // Detect container shape type
  const isJar = n.includes("jar") || n.includes("butter") || n.includes("cream");
  const isTube = n.includes("tube");
  const isDropper = n.includes("dropper");
  const isSpray = n.includes("spray");
  const isGlass = n.includes("glass bottle");
  const isPump = n.includes("pump");

  return (
    <svg viewBox="0 0 200 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl" style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.5))" }}>
      <defs>
        <linearGradient id="previewGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f6d365" />
          <stop offset="100%" stopColor="#fda085" />
        </linearGradient>
        <linearGradient id="capGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fcf6ba" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#9f7928" />
        </linearGradient>
        <linearGradient id="bodyShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="30%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="100" cy="305" rx="52" ry="8" fill="rgba(0,0,0,0.25)" />

      {isJar && (
        <>
          <rect x="38" y="130" width="124" height="140" rx="18" fill={fillColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <rect x="38" y="130" width="124" height="140" rx="18" fill="url(#bodyShine)" />
          <rect x="34" y="106" width="132" height="38" rx="10" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <rect x="34" y="106" width="132" height="38" rx="10" fill="url(#bodyShine)" />
          <rect x="52" y="162" width="96" height="68" rx="6" fill={resolvedTheme==="dark"?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.8)"} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
          <text x="100" y="184" textAnchor="middle" fontSize="7" fontFamily="serif" fill="#d4af37" letterSpacing="2" fontWeight="bold">{productName.toUpperCase().slice(0,12)}</text>
          <text x="100" y="200" textAnchor="middle" fontSize="10" fontFamily="serif" fill={textColor} fontWeight="600" letterSpacing="1">{brandName || "YOUR BRAND"}</text>
          <text x="100" y="216" textAnchor="middle" fontSize="6" fontFamily="sans-serif" fill="#999" letterSpacing="1">{capacity}</text>
        </>
      )}

      {isTube && (
        <>
          <rect x="62" y="80" width="76" height="190" rx="38" fill={fillColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <rect x="62" y="80" width="76" height="190" rx="38" fill="url(#bodyShine)" />
          <rect x="72" y="60" width="56" height="32" rx="8" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <rect x="70" y="148" width="60" height="60" rx="4" fill={resolvedTheme==="dark"?"rgba(0,0,0,0.55)":"rgba(255,255,255,0.75)"} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
          <text x="100" y="165" textAnchor="middle" fontSize="6" fill="#d4af37" letterSpacing="1.5" fontWeight="bold" fontFamily="serif">{productName.slice(0,10).toUpperCase()}</text>
          <text x="100" y="180" textAnchor="middle" fontSize="9" fill={textColor} fontWeight="600" fontFamily="serif">{brandName || "YOUR BRAND"}</text>
          <text x="100" y="195" textAnchor="middle" fontSize="6" fill="#999" fontFamily="sans-serif">{capacity}</text>
        </>
      )}

      {isDropper && (
        <>
          <rect x="68" y="120" width="64" height="160" rx="20" fill={fillColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <rect x="68" y="120" width="64" height="160" rx="20" fill="url(#bodyShine)" />
          <rect x="82" y="86" width="36" height="40" rx="6" fill={fillColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <ellipse cx="100" cy="72" rx="20" ry="16" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="100" y1="56" x2="100" y2="40" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
          <rect x="74" y="148" width="52" height="62" rx="4" fill={resolvedTheme==="dark"?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.8)"} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
          <text x="100" y="166" textAnchor="middle" fontSize="6" fill="#d4af37" letterSpacing="1.5" fontWeight="bold" fontFamily="serif">{productName.slice(0,10).toUpperCase()}</text>
          <text x="100" y="182" textAnchor="middle" fontSize="8.5" fill={textColor} fontWeight="600" fontFamily="serif">{brandName || "YOUR BRAND"}</text>
          <text x="100" y="198" textAnchor="middle" fontSize="6" fill="#999" fontFamily="sans-serif">{capacity}</text>
        </>
      )}

      {isSpray && (
        <>
          <rect x="58" y="110" width="84" height="170" rx="16" fill={fillColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <rect x="58" y="110" width="84" height="170" rx="16" fill="url(#bodyShine)" />
          <rect x="78" y="78" width="44" height="36" rx="8" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <rect x="118" y="82" width="28" height="12" rx="6" fill={capColor} />
          <rect x="66" y="148" width="68" height="66" rx="5" fill={resolvedTheme==="dark"?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.8)"} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
          <text x="100" y="166" textAnchor="middle" fontSize="6" fill="#d4af37" letterSpacing="1.5" fontWeight="bold" fontFamily="serif">{productName.slice(0,10).toUpperCase()}</text>
          <text x="100" y="182" textAnchor="middle" fontSize="9" fill={textColor} fontWeight="600" fontFamily="serif">{brandName || "YOUR BRAND"}</text>
          <text x="100" y="198" textAnchor="middle" fontSize="6" fill="#999" fontFamily="sans-serif">{capacity}</text>
        </>
      )}

      {(isPump || (!isJar && !isTube && !isDropper && !isSpray && !isGlass)) && (
        <>
          <rect x="55" y="108" width="90" height="172" rx="22" fill={fillColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <rect x="55" y="108" width="90" height="172" rx="22" fill="url(#bodyShine)" />
          <rect x="82" y="72" width="36" height="42" rx="6" fill={fillColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="74" y="52" width="52" height="26" rx="8" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <rect x="122" y="55" width="22" height="10" rx="5" fill={capColor} />
          <rect x="63" y="145" width="74" height="72" rx="5" fill={resolvedTheme==="dark"?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.82)"} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
          <text x="100" y="165" textAnchor="middle" fontSize="6" fill="#d4af37" letterSpacing="1.5" fontWeight="bold" fontFamily="serif">{productName.slice(0,12).toUpperCase()}</text>
          <text x="100" y="182" textAnchor="middle" fontSize="10" fill={textColor} fontWeight="600" fontFamily="serif">{brandName || "YOUR BRAND"}</text>
          <text x="100" y="198" textAnchor="middle" fontSize="6" fill="#999" fontFamily="sans-serif">{capacity}</text>
        </>
      )}

      {isGlass && (
        <>
          <path d="M76,280 Q56,270 56,200 L60,130 Q62,108 100,108 Q138,108 140,130 L144,200 Q144,270 124,280 Z" fill={fillColor} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <path d="M76,280 Q56,270 56,200 L60,130 Q62,108 100,108 Q138,108 140,130 L144,200 Q144,270 124,280 Z" fill="url(#bodyShine)" />
          <rect x="82" y="76" width="36" height="38" rx="5" fill={fillColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <rect x="78" y="56" width="44" height="26" rx="6" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <rect x="64" y="150" width="72" height="70" rx="5" fill={resolvedTheme==="dark"?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.82)"} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
          <text x="100" y="169" textAnchor="middle" fontSize="6" fill="#d4af37" letterSpacing="1.5" fontWeight="bold" fontFamily="serif">{productName.slice(0,12).toUpperCase()}</text>
          <text x="100" y="186" textAnchor="middle" fontSize="10" fill={textColor} fontWeight="600" fontFamily="serif">{brandName || "YOUR BRAND"}</text>
          <text x="100" y="202" textAnchor="middle" fontSize="6" fill="#999" fontFamily="sans-serif">{capacity}</text>
        </>
      )}
    </svg>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
function CosmeticsBuilderPage() {
  const { theme } = useTheme();
  const { product: productParam } = Route.useSearch();
  const [resolvedTheme, setResolvedTheme] = useState("dark");

  useEffect(() => {
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setResolvedTheme(isDark ? "dark" : "light");
    } else {
      setResolvedTheme(theme || "dark");
    }
  }, [theme]);

  // Resolve initial product from URL search param
  const initialProduct = PRODUCT_CATEGORIES.find(p => p.id === productParam) ?? PRODUCT_CATEGORIES[0];

  // Tab + review-modal state (mirrors perfume builder)
  const [activeTab, setActiveTab] = useState<TabId>("bottle");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastTab, setLastTab] = useState<TabId>("branding");

  // Configuration state
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [selectedContainer, setSelectedContainer] = useState(CONTAINER_TYPES.Bottles[1]); // Pump Bottle default
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);
  const [selectedCapacity, setSelectedCapacity] = useState(CAPACITIES[2]); // 50ml default
  const [selectedColor, setSelectedColor] = useState(COLOR_FINISHES[0]);
  const [selectedCap, setSelectedCap] = useState(CAP_TYPES[0]);
  const [selectedLabel, setSelectedLabel] = useState(LABEL_OPTIONS[0]);
  const [labelFont, setLabelFont] = useState(LABEL_FONTS[0]);
  const [labelShape, setLabelShape] = useState(LABEL_SHAPES[0]);
  const [brandName, setBrandName] = useState("");
  const [selectedPackaging, setSelectedPackaging] = useState(OUTER_PACKAGING[0]);
  const [selectedFinish, setSelectedFinish] = useState(PACKAGING_FINISHES[0]);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedFormula, setSelectedFormula] = useState("");
  const [selectedScent, setSelectedScent] = useState(SCENT_OPTIONS[0]);

  // Sync formula when product changes
  useEffect(() => {
    const formulas = FORMULA_TYPES[selectedProduct.id] || [];
    setSelectedFormula(formulas[0] || "");
  }, [selectedProduct]);

  const toggleAddon = useCallback((addon: string) => {
    setSelectedAddons(prev =>
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  }, []);

  const activeTabIndex = TABS.indexOf(activeTab);
  const progress = Math.round((activeTabIndex / (TABS.length - 1)) * 100);

  const handleNextTab = () => {
    const idx = TABS.indexOf(activeTab);
    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1]);
  };
  const handlePrevTab = () => {
    const idx = TABS.indexOf(activeTab);
    if (idx > 0) setActiveTab(TABS[idx - 1]);
  };

  // ─── BUILDER UI ────────────────────────────────────────────────────────────
  const formulas = FORMULA_TYPES[selectedProduct.id] || [];

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col lg:flex-row overflow-hidden relative transition-colors duration-300">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#f9f9fb] via-[#f0f0f5] to-[#e4e4eb] dark:from-[#0d0d1e] dark:via-[#05050a] dark:to-[#020205] pointer-events-none z-0 transition-all duration-300" />

      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-6 left-6 z-50 px-4 py-2 rounded-full border border-border bg-secondary/30 hover:bg-secondary/50 hover:border-gold/30 transition-all text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground flex items-center gap-1.5"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Home
      </Link>

      {/* ═══════ COLUMN 1 — CONFIGURATOR LEFT SIDEBAR (480px) ═══════ */}
      <aside className="w-full lg:w-[480px] lg:flex-shrink-0 border-r border-border bg-card/90 backdrop-blur-3xl z-10 flex flex-col h-screen transition-colors duration-300">

        {/* Header: Product category picker + brand name input */}
        <div className="p-6 border-b border-border flex-shrink-0 pt-20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-soft">
              Cosmetics Configurator
            </span>
            <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
              {progress}% Complete
            </span>
          </div>
          <h2 className="font-display text-2xl font-light text-foreground mb-4">Your Brand Design</h2>

          {/* Product category picker (persistent across tabs) */}
          <div className="mb-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Product Category
            </div>
            <div className="grid grid-cols-3 gap-1.5 max-h-[110px] overflow-y-auto scrollbar-hide pr-1">
              {PRODUCT_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedProduct(cat)}
                  className={`px-2 py-2 rounded-lg border text-left text-[10px] font-medium uppercase tracking-wide transition-all ${
                    selectedProduct.id === cat.id
                      ? "bg-gold/10 border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                      : "bg-secondary/15 border-border text-muted-foreground hover:border-gold/30 hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <input
            type="text"
            value={brandName}
            onChange={e => setBrandName(e.target.value.toUpperCase())}
            placeholder="ENTER BRAND NAME..."
            className="w-full bg-secondary/30 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-xs outline-none text-foreground tracking-widest font-medium uppercase transition-colors"
          />
        </div>

        {/* Tab strip (mirrors perfume) */}
        <div className="flex border-b border-border bg-secondary/10 overflow-x-auto scrollbar-hide flex-shrink-0">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 text-center text-[10px] font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap flex items-center justify-center gap-1.5 ${
                activeTab === tab
                  ? "text-gold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="activeCosmeticsTabLine"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-gold-soft"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.22 }}
              className="space-y-8"
            >

              {/* ───────── BOTTLE TAB ───────── */}
              {activeTab === "bottle" && (
                <>
                  <section className="space-y-5">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                      <Package className="h-3.5 w-3.5" /> Container Type
                    </h3>
                    {(Object.entries(CONTAINER_TYPES) as [string, typeof CONTAINER_TYPES.Bottles][]).map(([group, items]) => (
                      <div key={group}>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">{group}</div>
                        <div className="grid grid-cols-2 gap-2">
                          {items.map(item => (
                            <button
                              key={item.name}
                              onClick={() => setSelectedContainer(item)}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                selectedContainer.name === item.name
                                  ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                                  : "bg-secondary/15 border-border hover:border-gold/30"
                              }`}
                            >
                              <div className="text-[11px] font-semibold text-foreground">{item.name}</div>
                              <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{item.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5" /> Material
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {MATERIALS.map(mat => (
                        <button
                          key={mat.name}
                          onClick={() => setSelectedMaterial(mat)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedMaterial.name === mat.name
                              ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                              : "bg-secondary/15 border-border hover:border-gold/30"
                          }`}
                        >
                          <div className="text-[11px] font-semibold text-foreground">{mat.name}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{mat.desc}</div>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                      <Droplets className="h-3.5 w-3.5" /> Capacity
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {CAPACITIES.map(cap => (
                        <button
                          key={cap.size}
                          onClick={() => setSelectedCapacity(cap)}
                          className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${
                            selectedCapacity.size === cap.size
                              ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                              : "bg-secondary/15 border-border hover:border-gold/30"
                          }`}
                        >
                          <div className="w-1 rounded-full bg-gold/60 transition-all" style={{ height: `${cap.scaleFactor * 24}px` }} />
                          <div className="text-xs font-bold text-foreground">{cap.size}</div>
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                      <Palette className="h-3.5 w-3.5" /> Color & Finish
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {COLOR_FINISHES.map(col => (
                        <button
                          key={col.name}
                          onClick={() => setSelectedColor(col)}
                          className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                            selectedColor.name === col.name ? "border-gold bg-secondary/30" : "border-transparent hover:bg-secondary/20"
                          }`}
                        >
                          <div
                            className="w-9 h-9 rounded-full border border-border shadow-lg relative overflow-hidden"
                            style={{ background: col.hex }}
                          >
                            {selectedColor.name === col.name && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <Check className="h-4 w-4 text-gold" />
                              </div>
                            )}
                          </div>
                          <span className="text-[9px] text-muted-foreground text-center leading-tight w-full">{col.name}</span>
                        </button>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {/* ───────── CAP TAB ───────── */}
              {activeTab === "cap" && (
                <section className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                    <Award className="h-3.5 w-3.5" /> Cap & Closure
                  </h3>
                  <div className="space-y-2.5">
                    {CAP_TYPES.map(cap => (
                      <button
                        key={cap.name}
                        onClick={() => setSelectedCap(cap)}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          selectedCap.name === cap.name
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                            : "bg-secondary/15 border-border hover:border-gold/30"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-foreground">{cap.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{cap.desc}</div>
                        </div>
                        {selectedCap.name === cap.name && (
                          <Check className="h-4 w-4 text-gold" />
                        )}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* ───────── FRAGRANCE TAB ───────── */}
              {activeTab === "fragrance" && (
                <>
                  <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                      <FlaskConical className="h-3.5 w-3.5" /> Formula
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Active formula for <span className="text-foreground font-medium">{selectedProduct.name}</span>.
                    </p>
                    <div className="space-y-2.5">
                      {formulas.map(f => (
                        <button
                          key={f}
                          onClick={() => setSelectedFormula(f)}
                          className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                            selectedFormula === f
                              ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                              : "bg-secondary/15 border-border hover:border-gold/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <FlaskConical className={`h-4 w-4 ${selectedFormula === f ? "text-gold" : "text-muted-foreground"}`} />
                            <span className="text-xs font-semibold text-foreground">{f}</span>
                          </div>
                          {selectedFormula === f && <Check className="h-4 w-4 text-gold" />}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                      <Wind className="h-3.5 w-3.5" /> Signature Scent
                    </h3>
                    <div className="space-y-2.5">
                      {SCENT_OPTIONS.map(s => (
                        <button
                          key={s.name}
                          onClick={() => setSelectedScent(s)}
                          className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                            selectedScent.name === s.name
                              ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                              : "bg-secondary/15 border-border hover:border-gold/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Wind className={`h-4 w-4 ${selectedScent.name === s.name ? "text-gold" : "text-muted-foreground"}`} />
                            <span className="text-xs font-semibold text-foreground">{s.name}</span>
                          </div>
                          {selectedScent.name === s.name && <Check className="h-4 w-4 text-gold" />}
                        </button>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {/* ───────── PACKAGING TAB ───────── */}
              {activeTab === "packaging" && (
                <>
                  <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                      <Package className="h-3.5 w-3.5" /> Outer Box
                    </h3>
                    <div className="space-y-2.5">
                      {OUTER_PACKAGING.map(p => (
                        <button
                          key={p.name}
                          onClick={() => setSelectedPackaging(p)}
                          className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                            selectedPackaging.name === p.name
                              ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                              : "bg-secondary/15 border-border hover:border-gold/30"
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold text-foreground">{p.name}</div>
                            <div className="text-[10px] text-muted-foreground mt-0.5">{p.desc}</div>
                          </div>
                          {selectedPackaging.name === p.name && (
                            <Check className="h-4 w-4 text-gold" />
                          )}
                        </button>
                      ))}
                    </div>
                  </section>

                  {selectedPackaging.name !== "No Outer Box" && (
                    <>
                      <section className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                          <Layers className="h-3.5 w-3.5" /> Box Finish
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {PACKAGING_FINISHES.map(f => (
                            <button
                              key={f.name}
                              onClick={() => setSelectedFinish(f)}
                              className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
                                selectedFinish.name === f.name ? "bg-gold/10 border-gold text-gold" : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                              }`}
                            >
                              {f.name}
                            </button>
                          ))}
                        </div>
                      </section>

                      <section className="space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                          <Sparkles className="h-3.5 w-3.5" /> Embellishments
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                          {PACKAGING_ADDONS.map(a => {
                            const active = selectedAddons.includes(a.name);
                            return (
                              <button
                                key={a.name}
                                onClick={() => toggleAddon(a.name)}
                                className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
                                  active ? "bg-gold/10 border-gold text-gold" : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                                }`}
                              >
                                {a.name}
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    </>
                  )}
                </>
              )}

              {/* ───────── BRANDING TAB ───────── */}
              {activeTab === "branding" && (
                <>
                  <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
                      <Tag className="h-3.5 w-3.5" /> Label Style
                    </h3>
                    <div className="space-y-2">
                      {LABEL_OPTIONS.map(l => (
                        <button
                          key={l.name}
                          onClick={() => setSelectedLabel(l)}
                          className={`w-full p-3.5 rounded-xl border text-left flex justify-between items-center transition-all ${
                            selectedLabel.name === l.name
                              ? "bg-gold/10 border-gold"
                              : "bg-secondary/15 border-border hover:border-gold/30"
                          }`}
                        >
                          <div>
                            <div className="text-xs font-semibold text-foreground">{l.name}</div>
                            <div className="text-[10px] text-muted-foreground">{l.desc}</div>
                          </div>
                          {selectedLabel.name === l.name && (
                            <Check className="h-4 w-4 text-gold" />
                          )}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Typography</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {LABEL_FONTS.map(f => (
                        <button
                          key={f}
                          onClick={() => setLabelFont(f)}
                          className={`py-3 px-4 rounded-lg border text-xs font-medium transition-all ${
                            labelFont === f ? "bg-gold/10 border-gold text-gold" : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                          }`}
                          style={{ fontFamily: f === "Elegant Serif" ? "serif" : "sans-serif" }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Label Shape</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {LABEL_SHAPES.map(s => (
                        <button
                          key={s}
                          onClick={() => setLabelShape(s)}
                          className={`py-3 rounded-lg border text-[10px] font-medium text-center transition-all ${
                            labelShape === s ? "bg-gold/10 border-gold text-gold" : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </section>
                </>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sticky nav footer */}
        <div className="border-t border-border bg-background/80 p-4 flex items-center gap-3 flex-shrink-0 z-20 transition-colors duration-300">
          <button
            onClick={handlePrevTab}
            disabled={activeTabIndex === 0}
            className={`flex-1 py-3 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTabIndex === 0
                ? "border-border text-muted-foreground/30 cursor-not-allowed"
                : "border-border hover:border-gold/30 hover:bg-secondary/40 text-foreground active:scale-[0.98]"
            }`}
          >
            <ChevronLeft className="h-3 w-3" /> Previous
          </button>
          {activeTab === TABS[TABS.length - 1] ? (
            <button
              onClick={() => {
                setLastTab(activeTab);
                setReviewOpen(true);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-gold hover:bg-gold-soft text-black text-[10px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-gold-glow flex items-center justify-center gap-1.5"
            >
              Submit Quotation <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleNextTab}
              className="flex-1 py-3 px-4 rounded-xl bg-gold hover:bg-gold-soft text-black text-[10px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-gold-glow flex items-center justify-center gap-1.5"
            >
              Next <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </aside>

      {/* ═══════ COLUMN 2 — LIVE 3D PREVIEW (CENTER) ═══════ */}
      <main className="flex-1 h-screen flex flex-col justify-center items-center relative p-8 select-none z-0">
        {/* Gold spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[500px] bg-gradient-to-b from-gold/15 to-transparent blur-[80px] pointer-events-none rounded-full" />

        {/* Stage frame (mirrors perfume) */}
        <div className="relative w-full max-w-3xl h-[78vh] flex items-center justify-center perspective-1200">
          <div className="absolute inset-0 rounded-[28px] overflow-hidden border border-gold/15 bg-gradient-to-b from-secondary/30 via-background/40 to-secondary/20 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]">
            <motion.div
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120%] h-[70%] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0.05)_35%,transparent_70%)] pointer-events-none"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="absolute top-1/3 -left-20 w-72 h-72 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-gold-soft/10 rounded-full blur-[100px] pointer-events-none" />
            <div
              className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none opacity-[0.18]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(212,175,55,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(212,175,55,0.5) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
                transform: "perspective(600px) rotateX(60deg)",
                transformOrigin: "bottom center",
                maskImage:
                  "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
              }}
            />
            <div className="absolute left-0 right-0 bottom-1/2 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)] pointer-events-none" />
            {[
              "top-4 left-4 border-t border-l",
              "top-4 right-4 border-t border-r",
              "bottom-4 left-4 border-b border-l",
              "bottom-4 right-4 border-b border-r",
            ].map(pos => (
              <div
                key={pos}
                className={`absolute ${pos} w-5 h-5 border-gold/40 pointer-events-none`}
              />
            ))}
          </div>

          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-full max-w-[260px] h-[60vh] flex items-center justify-center"
            style={{ filter: `drop-shadow(0 0 40px ${selectedColor.hex.startsWith("linear") ? "rgba(246,211,101,0.2)" : selectedColor.hex + "30"})` }}
          >
            <ContainerPreview
              containerName={selectedContainer.name}
              colorHex={selectedColor.hex}
              capacity={selectedCapacity.size}
              brandName={brandName}
              productName={selectedProduct.name}
              resolvedTheme={resolvedTheme}
            />
          </motion.div>
        </div>

        {/* Selected-state badges (mirrors perfume) */}
        <div className="absolute bottom-16 flex flex-wrap justify-center gap-2 px-4 z-10">
          {[
            { label: selectedProduct.name,    icon: <Package className="h-3 w-3 text-gold" /> },
            { label: selectedContainer.name,  icon: <Layers className="h-3 w-3 text-gold" /> },
            { label: selectedCapacity.size,   icon: <Droplets className="h-3 w-3 text-gold" /> },
            { label: selectedColor.name,      icon: <Palette className="h-3 w-3 text-gold" /> },
          ].map(badge => (
            <div
              key={badge.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/40 backdrop-blur-md shadow-lg text-[10px] text-foreground transition-colors"
            >
              {badge.icon}
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Quality badges */}
        <div className="absolute bottom-4 flex gap-6 z-10">
          {[
            { icon: ShieldCheck, text: "ISO Certified" },
            { icon: Award, text: "HALAL Compliant" },
            { icon: Layers, text: "Eco-Sourced" },
          ].map(badge => (
            <div
              key={badge.text}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/25 backdrop-blur-md shadow-lg text-[10px] text-muted-foreground transition-colors duration-300"
            >
              <badge.icon className="h-3.5 w-3.5 text-gold" />
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </main>

      {/* ═══════ REVIEW & SUBMIT MODAL ═══════ */}
      <AnimatePresence>
        {reviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 240, damping: 24 }}
              className="w-full max-w-2xl my-8 bg-card border border-gold/20 rounded-2xl shadow-2xl relative overflow-hidden"
            >
              <div className="bg-gradient-to-r from-gold to-gold-soft h-1.5" />
              <div className="p-8">
                {submitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
                      <Check className="h-8 w-8 text-gold stroke-[2.5]" />
                    </div>
                    <h2 className="font-display text-2xl font-bold mb-2">
                      Quotation Request Sent
                    </h2>
                    <p className="text-sm text-muted-foreground mb-1">
                      Your specification document has been emailed to:
                    </p>
                    <p className="text-sm font-mono text-gold mb-8">
                      fshahriar@alkhuraii-afpc.com
                    </p>
                    <p className="text-xs text-muted-foreground mb-8">
                      Our luxury manufacturing consultant will respond within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setReviewOpen(false);
                        setSubmitted(false);
                      }}
                      className="w-full py-3 rounded-xl bg-gold hover:bg-gold-soft text-black font-bold uppercase tracking-wider transition-all shadow-gold-glow text-xs"
                    >
                      Return to Builder
                    </button>
                  </div>
                ) : submitting ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Sending your specification document...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Document header */}
                    <div className="text-center mb-6 pb-6 border-b border-border">
                      <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold mb-2">
                        Cosmetics Specification Document
                      </div>
                      <h2 className="font-display text-3xl font-bold mb-1">
                        {brandName || selectedProduct.name.toUpperCase()}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Prepared on{" "}
                        {new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    {/* Spec sections (no price card) */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-5 mb-6 text-xs">
                      <div className="col-span-2">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                          Product
                        </h4>
                      </div>
                      <SpecRow label="Category" value={selectedProduct.name} />
                      <SpecRow label="Brand Name" value={brandName || "—"} />

                      <div className="col-span-2 mt-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                          Container & Material
                        </h4>
                      </div>
                      <SpecRow label="Container Type" value={selectedContainer.name} />
                      <SpecRow label="Material" value={selectedMaterial.name} />

                      <div className="col-span-2 mt-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                          Capacity & Color
                        </h4>
                      </div>
                      <SpecRow label="Capacity" value={selectedCapacity.size} />
                      <SpecRow label="Color & Finish" value={selectedColor.name} />

                      <div className="col-span-2 mt-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                          Cap
                        </h4>
                      </div>
                      <SpecRow label="Cap Type" value={selectedCap.name} />

                      <div className="col-span-2 mt-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                          Fragrance Composition
                        </h4>
                      </div>
                      <SpecRow label="Formula" value={selectedFormula || "—"} />
                      <SpecRow label="Scent" value={selectedScent.name} />

                      <div className="col-span-2 mt-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                          Packaging
                        </h4>
                      </div>
                      <SpecRow label="Box Type" value={selectedPackaging.name} />
                      <SpecRow
                        label="Finish"
                        value={
                          selectedPackaging.name === "No Outer Box"
                            ? "—"
                            : selectedFinish.name
                        }
                      />
                      {selectedAddons.length > 0 && (
                        <div className="col-span-2">
                          <SpecRow
                            label="Add-Ons"
                            value={selectedAddons.join(", ")}
                          />
                        </div>
                      )}

                      <div className="col-span-2 mt-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-2">
                          Branding
                        </h4>
                      </div>
                      <SpecRow label="Label Style" value={selectedLabel.name} />
                      <SpecRow label="Label Font" value={labelFont} />
                      <SpecRow label="Label Shape" value={labelShape} />
                    </div>

                    {/* Action buttons (no price card) */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setReviewOpen(false);
                          setActiveTab(lastTab);
                        }}
                        className="flex-1 py-3 rounded-xl border border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground hover:border-gold/30 transition-all"
                      >
                        ← Modify
                      </button>
                      <button
                        onClick={() => {
                          setSubmitting(true);
                          setTimeout(() => {
                            setSubmitting(false);
                            setSubmitted(true);
                            // TODO: replace with real API call to POST /api/send-quotation
                            //       with body containing all selections. The API will
                            //       email the document to fshahriar@alkhuraii-afpc.com.
                          }, 1500);
                        }}
                        className="flex-1 py-3 rounded-xl bg-gold hover:bg-gold-soft text-black font-bold uppercase tracking-wider transition-all shadow-gold-glow text-xs"
                      >
                        Submit & Email →
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 py-1.5 border-b border-border/40">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-xs font-medium text-foreground text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
