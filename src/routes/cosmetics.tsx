import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  ShieldCheck,
  TrendingDown,
  Layers,
  Award,
  Calendar,
  DollarSign,
  Droplets,
  FlaskConical,
  Package,
  Palette,
  Wind,
  Tag,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
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

const QUANTITY_TIERS = [
  { label: "500 Units",   value: 500,   discount: 0   },
  { label: "1,000 Units", value: 1000,  discount: 0.10 },
  { label: "2,500 Units", value: 2500,  discount: 0.20 },
  { label: "5,000 Units", value: 5000,  discount: 0.30 },
  { label: "10,000 Units",value: 10000, discount: 0.40 },
];

const STEPS = [
  { id: "product",    label: "Product",    icon: Star      },
  { id: "container",  label: "Container",  icon: Package   },
  { id: "material",   label: "Material",   icon: Layers    },
  { id: "capacity",   label: "Capacity",   icon: Droplets  },
  { id: "color",      label: "Color",      icon: Palette   },
  { id: "cap",        label: "Cap",        icon: Award     },
  { id: "label",      label: "Branding",   icon: Tag       },
  { id: "packaging",  label: "Packaging",  icon: Package   },
  { id: "formula",    label: "Formula",    icon: FlaskConical },
  { id: "scent",      label: "Scent",      icon: Wind      },
  { id: "quantity",   label: "Quantity",   icon: TrendingDown },
];

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

      {/* Ground shadow */}
      <ellipse cx="100" cy="305" rx="52" ry="8" fill="rgba(0,0,0,0.25)" />

      {isJar && (
        <>
          {/* Jar body */}
          <rect x="38" y="130" width="124" height="140" rx="18" fill={fillColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          {/* Jar shine */}
          <rect x="38" y="130" width="124" height="140" rx="18" fill="url(#bodyShine)" />
          {/* Jar lid */}
          <rect x="34" y="106" width="132" height="38" rx="10" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <rect x="34" y="106" width="132" height="38" rx="10" fill="url(#bodyShine)" />
          {/* label area */}
          <rect x="52" y="162" width="96" height="68" rx="6" fill={resolvedTheme==="dark"?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.8)"} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
          <text x="100" y="184" textAnchor="middle" fontSize="7" fontFamily="serif" fill="#d4af37" letterSpacing="2" fontWeight="bold">{productName.toUpperCase().slice(0,12)}</text>
          <text x="100" y="200" textAnchor="middle" fontSize="10" fontFamily="serif" fill={textColor} fontWeight="600" letterSpacing="1">{brandName || "YOUR BRAND"}</text>
          <text x="100" y="216" textAnchor="middle" fontSize="6" fontFamily="sans-serif" fill="#999" letterSpacing="1">{capacity}</text>
        </>
      )}

      {isTube && (
        <>
          {/* Tube body */}
          <rect x="62" y="80" width="76" height="190" rx="38" fill={fillColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <rect x="62" y="80" width="76" height="190" rx="38" fill="url(#bodyShine)" />
          {/* Tube cap */}
          <rect x="72" y="60" width="56" height="32" rx="8" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* Label */}
          <rect x="70" y="148" width="60" height="60" rx="4" fill={resolvedTheme==="dark"?"rgba(0,0,0,0.55)":"rgba(255,255,255,0.75)"} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
          <text x="100" y="165" textAnchor="middle" fontSize="6" fill="#d4af37" letterSpacing="1.5" fontWeight="bold" fontFamily="serif">{productName.slice(0,10).toUpperCase()}</text>
          <text x="100" y="180" textAnchor="middle" fontSize="9" fill={textColor} fontWeight="600" fontFamily="serif">{brandName || "YOUR BRAND"}</text>
          <text x="100" y="195" textAnchor="middle" fontSize="6" fill="#999" fontFamily="sans-serif">{capacity}</text>
        </>
      )}

      {isDropper && (
        <>
          {/* Bottle body */}
          <rect x="68" y="120" width="64" height="160" rx="20" fill={fillColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <rect x="68" y="120" width="64" height="160" rx="20" fill="url(#bodyShine)" />
          {/* Neck */}
          <rect x="82" y="86" width="36" height="40" rx="6" fill={fillColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Dropper bulb */}
          <ellipse cx="100" cy="72" rx="20" ry="16" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* Dropper needle */}
          <line x1="100" y1="56" x2="100" y2="40" stroke="#d4af37" strokeWidth="3" strokeLinecap="round" />
          {/* Label */}
          <rect x="74" y="148" width="52" height="62" rx="4" fill={resolvedTheme==="dark"?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.8)"} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
          <text x="100" y="166" textAnchor="middle" fontSize="6" fill="#d4af37" letterSpacing="1.5" fontWeight="bold" fontFamily="serif">{productName.slice(0,10).toUpperCase()}</text>
          <text x="100" y="182" textAnchor="middle" fontSize="8.5" fill={textColor} fontWeight="600" fontFamily="serif">{brandName || "YOUR BRAND"}</text>
          <text x="100" y="198" textAnchor="middle" fontSize="6" fill="#999" fontFamily="sans-serif">{capacity}</text>
        </>
      )}

      {isSpray && (
        <>
          {/* Bottle body */}
          <rect x="58" y="110" width="84" height="170" rx="16" fill={fillColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <rect x="58" y="110" width="84" height="170" rx="16" fill="url(#bodyShine)" />
          {/* Spray pump top */}
          <rect x="78" y="78" width="44" height="36" rx="8" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* Nozzle */}
          <rect x="118" y="82" width="28" height="12" rx="6" fill={capColor} />
          {/* Label */}
          <rect x="66" y="148" width="68" height="66" rx="5" fill={resolvedTheme==="dark"?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.8)"} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
          <text x="100" y="166" textAnchor="middle" fontSize="6" fill="#d4af37" letterSpacing="1.5" fontWeight="bold" fontFamily="serif">{productName.slice(0,10).toUpperCase()}</text>
          <text x="100" y="182" textAnchor="middle" fontSize="9" fill={textColor} fontWeight="600" fontFamily="serif">{brandName || "YOUR BRAND"}</text>
          <text x="100" y="198" textAnchor="middle" fontSize="6" fill="#999" fontFamily="sans-serif">{capacity}</text>
        </>
      )}

      {(isPump || (!isJar && !isTube && !isDropper && !isSpray && !isGlass)) && (
        <>
          {/* Pump bottle body */}
          <rect x="55" y="108" width="90" height="172" rx="22" fill={fillColor} stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
          <rect x="55" y="108" width="90" height="172" rx="22" fill="url(#bodyShine)" />
          {/* Pump neck */}
          <rect x="82" y="72" width="36" height="42" rx="6" fill={fillColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Pump head */}
          <rect x="74" y="52" width="52" height="26" rx="8" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* Nozzle */}
          <rect x="122" y="55" width="22" height="10" rx="5" fill={capColor} />
          {/* Label */}
          <rect x="63" y="145" width="74" height="72" rx="5" fill={resolvedTheme==="dark"?"rgba(0,0,0,0.6)":"rgba(255,255,255,0.82)"} stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
          <text x="100" y="165" textAnchor="middle" fontSize="6" fill="#d4af37" letterSpacing="1.5" fontWeight="bold" fontFamily="serif">{productName.slice(0,12).toUpperCase()}</text>
          <text x="100" y="182" textAnchor="middle" fontSize="10" fill={textColor} fontWeight="600" fontFamily="serif">{brandName || "YOUR BRAND"}</text>
          <text x="100" y="198" textAnchor="middle" fontSize="6" fill="#999" fontFamily="sans-serif">{capacity}</text>
        </>
      )}

      {isGlass && (
        <>
          {/* Elegant glass bottle */}
          <path d="M76,280 Q56,270 56,200 L60,130 Q62,108 100,108 Q138,108 140,130 L144,200 Q144,270 124,280 Z" fill={fillColor} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
          <path d="M76,280 Q56,270 56,200 L60,130 Q62,108 100,108 Q138,108 140,130 L144,200 Q144,270 124,280 Z" fill="url(#bodyShine)" />
          {/* Neck */}
          <rect x="82" y="76" width="36" height="38" rx="5" fill={fillColor} stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Cap */}
          <rect x="78" y="56" width="44" height="26" rx="6" fill="url(#capGold)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          {/* Label */}
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
  // Start at step 1 (container) if a product was pre-selected from the nav dropdown, else step 0
  const initialStep = productParam ? 1 : 0;

  const [currentStep, setCurrentStep] = useState(initialStep);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  // Form fields
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

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
  const [selectedQtyTier, setSelectedQtyTier] = useState(QUANTITY_TIERS[0]);
  const [customQty, setCustomQty] = useState(500);

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

  // ─── PRICING ENGINE ────────────────────────────────────────────────────────
  const pricing = (() => {
    const base     = selectedProduct.basePrice;
    const container = selectedContainer.price;
    const material = selectedMaterial.price;
    const capacity = selectedCapacity.price;
    const color    = selectedColor.price;
    const cap      = selectedCap.price;
    const label    = selectedLabel.price;
    const packaging = selectedPackaging.price;
    const finish   = selectedFinish.price;
    const addons   = selectedAddons.reduce((s, a) => s + (PACKAGING_ADDONS.find(x => x.name === a)?.price || 0), 0);
    const formula  = selectedFormula ? 20 : 0;
    const scent    = selectedScent.price;
    const branding = 5;

    const subtotal = base + container + material + capacity + color + cap + label + packaging + finish + addons + formula + scent + branding;
    const discount = selectedQtyTier.discount;
    const unitPrice = subtotal * (1 - discount);
    const qty = selectedQtyTier.value;
    const total = unitPrice * qty;

    return { base, container, material, capacity, color, cap, label, packaging, finish, addons, formula, scent, branding, subtotal, discount, unitPrice, total, qty, discountPct: Math.round(discount * 100) };
  })();

  const progress = Math.round(((currentStep) / (STEPS.length - 1)) * 100);

  // ─── BUILDER UI ────────────────────────────────────────────────────────────
  const step = STEPS[currentStep];
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

      {/* ═══════ COLUMN 1 — CONFIGURATOR LEFT SIDEBAR (390px) ═══════ */}
      <aside className="w-full lg:w-[390px] lg:flex-shrink-0 border-r border-border bg-card/90 backdrop-blur-3xl z-10 flex flex-col h-screen transition-colors duration-300">
        
        {/* Header with brand name input */}
        <div className="p-6 border-b border-border flex-shrink-0 pt-20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-gold-soft mb-0.5">Cosmetics Configurator</div>
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedProduct.emoji}</span>
                <h2 className="font-display text-lg font-semibold text-foreground">{selectedProduct.name}</h2>
              </div>
            </div>
            <span className="text-xs font-bold text-gold bg-gold/10 px-2.5 py-1 rounded-full">{progress}%</span>
          </div>
          <input
            type="text"
            value={brandName}
            onChange={e => setBrandName(e.target.value.toUpperCase())}
            placeholder="ENTER BRAND NAME..."
            className="w-full bg-secondary/30 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-xs outline-none text-foreground tracking-widest font-medium uppercase transition-colors mt-2"
          />
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 border-b border-border flex-shrink-0 bg-secondary/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-muted-foreground font-medium">
              Step {currentStep + 1} of {STEPS.length} — <span className="text-foreground font-semibold">{step.label}</span>
            </span>
          </div>
          <div className="w-full bg-secondary/30 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold to-gold-soft"
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          {/* Mini step dots */}
          <div className="flex gap-1 mt-3 justify-between">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(i)}
                  title={s.label}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    i < currentStep ? "bg-gold/60" : i === currentStep ? "bg-gold" : "bg-secondary/40"
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide pb-28">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >

              {/* STEP 0 — PRODUCT CATEGORY */}
              {step.id === "product" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Select Product Category</h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PRODUCT_CATEGORIES.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedProduct(cat)}
                        className={`p-3.5 rounded-xl border text-left transition-all relative group overflow-hidden ${
                          selectedProduct.id === cat.id
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                            : "bg-secondary/15 border-border hover:border-gold/30"
                        }`}
                      >
                        {selectedProduct.id === cat.id && (
                          <div className="absolute top-2 right-2 h-4 w-4 bg-gold rounded-full flex items-center justify-center">
                            <Check className="h-2.5 w-2.5 text-black stroke-[3]" />
                          </div>
                        )}
                        <div className="text-xl mb-1.5">{cat.emoji}</div>
                        <div className="text-xs font-semibold text-foreground">{cat.name}</div>
                        <div className="text-[9px] text-muted-foreground mt-0.5">from {cat.basePrice} SAR</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 1 — CONTAINER */}
              {step.id === "container" && (
                <div className="space-y-5">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Choose Container Type</h3>
                  {(Object.entries(CONTAINER_TYPES) as [string, typeof CONTAINER_TYPES.Bottles][]).map(([group, items]) => (
                    <div key={group}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2.5">{group}</div>
                      <div className="space-y-2">
                        {items.map(item => (
                          <button
                            key={item.name}
                            onClick={() => setSelectedContainer(item)}
                            className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                              selectedContainer.name === item.name
                                ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)] text-gold"
                                : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                            }`}
                          >
                            <div>
                              <div className="text-xs font-semibold">{item.name}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</div>
                            </div>
                            <div className="text-xs font-bold text-gold-soft whitespace-nowrap">+{item.price} SAR</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 2 — MATERIAL */}
              {step.id === "material" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Select Material</h3>
                  <div className="space-y-2.5">
                    {MATERIALS.map(mat => (
                      <button
                        key={mat.name}
                        onClick={() => setSelectedMaterial(mat)}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          selectedMaterial.name === mat.name
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                            : "bg-secondary/15 border-border hover:border-gold/30"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-foreground">{mat.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">{mat.desc}</div>
                        </div>
                        <div className="text-xs font-bold text-gold-soft">+{mat.price} SAR</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3 — CAPACITY */}
              {step.id === "capacity" && (
                <div className="space-y-5">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Select Capacity</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {CAPACITIES.map(cap => (
                      <button
                        key={cap.size}
                        onClick={() => setSelectedCapacity(cap)}
                        className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                          selectedCapacity.size === cap.size
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                            : "bg-secondary/15 border-border hover:border-gold/30"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-2 rounded-full bg-gold/60 transition-all`} style={{ height: `${cap.scaleFactor * 32}px` }} />
                          <div>
                            <div className="text-sm font-bold text-foreground">{cap.size}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {cap.size === "15ml" ? "Travel / Sample size" :
                               cap.size === "30ml" ? "Personal daily use" :
                               cap.size === "50ml" ? "Standard retail" :
                               cap.size === "100ml" ? "Professional / Premium" : "Salon / Bulk size"}
                            </div>
                          </div>
                        </div>
                        <div className="text-xs font-bold text-gold-soft">{cap.price > 0 ? `+${cap.price} SAR` : "Base"}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 4 — COLOR / FINISH */}
              {step.id === "color" && (
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Color & Finish</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {COLOR_FINISHES.map(col => (
                      <button
                        key={col.name}
                        onClick={() => setSelectedColor(col)}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all ${
                          selectedColor.name === col.name ? "border-gold bg-secondary/30" : "border-transparent hover:bg-secondary/20"
                        }`}
                      >
                        <div
                          className="w-11 h-11 rounded-full border border-border shadow-lg relative overflow-hidden"
                          style={{ background: col.hex }}
                        >
                          {selectedColor.name === col.name && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Check className="h-4 w-4 text-gold" />
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-muted-foreground text-center leading-tight w-full">{col.name}</span>
                        <span className="text-[8px] text-gold-soft">+{col.price}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 5 — CAP */}
              {step.id === "cap" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Cap & Closure</h3>
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
                        <div className="text-xs font-bold text-gold-soft">+{cap.price} SAR</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6 — LABEL / BRANDING */}
              {step.id === "label" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Label Style</h3>
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
                          <div className="text-xs font-bold text-gold-soft">{l.price > 0 ? `+${l.price} SAR` : "Free"}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Typography</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {LABEL_FONTS.map(f => (
                        <button key={f} onClick={() => setLabelFont(f)}
                          className={`py-3 px-4 rounded-lg border text-xs font-medium transition-all ${
                            labelFont === f ? "bg-gold/10 border-gold text-gold" : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                          }`}
                          style={{ fontFamily: f === "Elegant Serif" ? "serif" : "sans-serif" }}
                        >{f}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Label Shape</h3>
                    <div className="grid grid-cols-3 gap-2">
                      {LABEL_SHAPES.map(s => (
                        <button key={s} onClick={() => setLabelShape(s)}
                          className={`py-3 rounded-lg border text-[10px] font-medium text-center transition-all ${
                            labelShape === s ? "bg-gold/10 border-gold text-gold" : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                          }`}
                        >{s}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7 — PACKAGING */}
              {step.id === "packaging" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Outer Box</h3>
                    <div className="space-y-2.5">
                      {OUTER_PACKAGING.map(p => (
                        <button key={p.name} onClick={() => setSelectedPackaging(p)}
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
                          <div className="text-xs font-bold text-gold-soft">{p.price > 0 ? `+${p.price} SAR` : "None"}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedPackaging.name !== "No Outer Box" && (
                    <>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Box Finish</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {PACKAGING_FINISHES.map(f => (
                            <button key={f.name} onClick={() => setSelectedFinish(f)}
                              className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
                                selectedFinish.name === f.name ? "bg-gold/10 border-gold text-gold" : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                              }`}
                            >{f.name} (+{f.price} SAR)</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">Embellishments</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {PACKAGING_ADDONS.map(a => {
                            const active = selectedAddons.includes(a.name);
                            return (
                              <button key={a.name} onClick={() => toggleAddon(a.name)}
                                className={`p-3 rounded-lg border text-xs font-medium text-center transition-all ${
                                  active ? "bg-gold/10 border-gold text-gold" : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                                }`}
                              >{a.name} (+{a.price} SAR)</button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* STEP 8 — FORMULA */}
              {step.id === "formula" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Formula Selection</h3>
                  <p className="text-[11px] text-muted-foreground">Choose the active formula profile for your <span className="text-foreground font-medium">{selectedProduct.name}</span>. Each formula adds 20 SAR for custom blending.</p>
                  <div className="space-y-2.5">
                    {formulas.map(f => (
                      <button key={f} onClick={() => setSelectedFormula(f)}
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
                </div>
              )}

              {/* STEP 9 — SCENT */}
              {step.id === "scent" && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Fragrance / Scent</h3>
                  <p className="text-[11px] text-muted-foreground">Add a signature scent profile to your product formula.</p>
                  <div className="space-y-2.5">
                    {SCENT_OPTIONS.map(s => (
                      <button key={s.name} onClick={() => setSelectedScent(s)}
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
                        <div className="text-xs font-bold text-gold-soft">{s.price > 0 ? `+${s.price} SAR` : "Included"}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 10 — QUANTITY */}
              {step.id === "quantity" && (
                <div className="space-y-6">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Production Quantity</h3>
                  <div className="space-y-2.5">
                    {QUANTITY_TIERS.map(tier => (
                      <button key={tier.value} onClick={() => { setSelectedQtyTier(tier); setCustomQty(tier.value); }}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          selectedQtyTier.value === tier.value
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                            : "bg-secondary/15 border-border hover:border-gold/30"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-foreground">{tier.label}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {tier.discount > 0 ? `🎁 ${Math.round(tier.discount * 100)}% Bulk Discount` : "Standard MOQ"}
                          </div>
                        </div>
                        {tier.discount > 0 && (
                          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">−{Math.round(tier.discount * 100)}%</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div>
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-muted-foreground">Custom Quantity</span>
                      <span className="font-bold text-gold">{customQty.toLocaleString()} units</span>
                    </div>
                    <input
                      type="range" min={500} max={10000} step={100} value={customQty}
                      onChange={e => {
                        const v = Number(e.target.value);
                        setCustomQty(v);
                        const closest = QUANTITY_TIERS.reduce((prev, curr) =>
                          Math.abs(curr.value - v) < Math.abs(prev.value - v) ? curr : prev
                        );
                        setSelectedQtyTier(closest);
                      }}
                      className="w-full h-1 bg-border rounded-full appearance-none cursor-pointer accent-gold"
                    />
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="border-t border-border bg-background/80 p-4 flex items-center gap-3 flex-shrink-0 z-20 transition-colors duration-300">
          <button
            onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            className={`flex-1 py-3 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              currentStep === 0
                ? "border-border text-muted-foreground/30 cursor-not-allowed"
                : "border-border hover:border-gold/30 hover:bg-secondary/40 text-foreground active:scale-[0.98]"
            }`}
          >
            <ChevronLeft className="h-3 w-3" /> Previous
          </button>
          {currentStep === STEPS.length - 1 ? (
            <button
              onClick={() => setInquiryOpen(true)}
              className="flex-1 py-3 px-4 rounded-xl bg-gold hover:bg-gold-soft text-black text-[10px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-gold-glow flex items-center justify-center gap-1.5"
            >
              <DollarSign className="h-3 w-3" /> Get Quote
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(s => Math.min(STEPS.length - 1, s + 1))}
              className="flex-1 py-3 px-4 rounded-xl bg-gold hover:bg-gold-soft text-black text-[10px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] shadow-gold-glow flex items-center justify-center gap-1.5"
            >
              Next <ChevronRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </aside>

      {/* ═══════ COLUMN 2 — LIVE 3D PREVIEW (CENTER) ═══════ */}
      <main className="flex-1 h-screen flex flex-col justify-center items-center relative p-8 select-none z-0">
        {/* Gold spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[500px] bg-gradient-to-b from-gold/15 to-transparent blur-[80px] pointer-events-none rounded-full" />

        {/* Stage label */}
        <div className="absolute top-8 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Live Preview Studio</span>
          <p className="text-[8px] text-muted-foreground/50 mt-1">{selectedProduct.emoji} {selectedProduct.name} — {selectedContainer.name}</p>
        </div>

        {/* Container Preview */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-full max-w-[220px] h-[60vh] flex items-center justify-center"
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

        {/* Selected state badges */}
        <div className="absolute bottom-14 flex flex-wrap justify-center gap-3 px-4 z-10">
          {[
            { label: selectedProduct.name,    icon: selectedProduct.emoji },
            { label: selectedContainer.name,  icon: "📦" },
            { label: selectedCapacity.size,   icon: "💧" },
            { label: selectedColor.name,      icon: "🎨" },
          ].map(badge => (
            <div key={badge.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/25 backdrop-blur-md shadow text-[10px] text-muted-foreground transition-colors">
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </div>
          ))}
        </div>

        {/* Quality badges */}
        <div className="absolute bottom-4 flex gap-4 z-10">
          {[
            { icon: ShieldCheck, text: "ISO Certified" },
            { icon: Award, text: "HALAL Compliant" },
            { icon: Layers, text: "Eco-Sourced" },
          ].map(badge => (
            <div key={badge.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card/25 backdrop-blur-md shadow text-[10px] text-muted-foreground">
              <badge.icon className="h-3 w-3 text-gold" />
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </main>

      {/* ═══════ COLUMN 3 — PRICING PANEL (RIGHT) ═══════ */}
      <aside className="w-full lg:w-[340px] lg:flex-shrink-0 border-l border-border bg-card/90 backdrop-blur-3xl z-10 flex flex-col h-screen pt-20 justify-between transition-colors duration-300">
        
        {/* Specs & Pricing list */}
        <div className="p-6 border-b border-border flex-1 overflow-y-auto scrollbar-hide">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-5">Configuration & Pricing</h3>
          <div className="space-y-3">
            {[
              { label: "Product",    value: selectedProduct.name,    price: selectedProduct.basePrice },
              { label: "Container",  value: selectedContainer.name,  price: pricing.container },
              { label: "Material",   value: selectedMaterial.name,   price: pricing.material },
              { label: "Capacity",   value: selectedCapacity.size,   price: pricing.capacity },
              { label: "Color",      value: selectedColor.name,      price: pricing.color },
              { label: "Cap",        value: selectedCap.name,        price: pricing.cap },
              { label: "Label",      value: selectedLabel.name,      price: pricing.label },
              { label: "Packaging",  value: selectedPackaging.name,  price: pricing.packaging },
              { label: "Formula",    value: selectedFormula || "—",  price: pricing.formula },
              { label: "Scent",      value: selectedScent.name,      price: pricing.scent },
            ].map(spec => (
              <div key={spec.label} className="flex justify-between items-start text-xs border-b border-border/50 pb-2">
                <div className="space-y-0.5">
                  <div className="text-muted-foreground font-light text-[10px] uppercase tracking-wider">{spec.label}</div>
                  <div className="text-foreground font-medium">{spec.value}</div>
                </div>
                <div className="text-[10px] font-bold text-gold-soft whitespace-nowrap ml-2">+{spec.price} SAR</div>
              </div>
            ))}
            {pricing.addons > 0 && (
              <div className="flex justify-between items-start text-xs border-b border-border/50 pb-2">
                <div className="space-y-0.5">
                  <div className="text-muted-foreground font-light text-[10px] uppercase tracking-wider">Add-Ons</div>
                  <div className="text-foreground font-medium">{selectedAddons.join(", ")}</div>
                </div>
                <div className="text-[10px] font-bold text-gold-soft">+{pricing.addons} SAR</div>
              </div>
            )}
          </div>

          {/* Subtotal */}
          <div className="mt-5 pt-4 border-t border-border flex justify-between items-center">
            <span className="text-xs text-muted-foreground">Unit Subtotal</span>
            <span className="text-xs font-bold text-foreground">{pricing.subtotal} SAR</span>
          </div>

          {/* Delivery info */}
          <div className="mt-4 p-4 rounded-xl border border-border bg-secondary/20 space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-gold-soft" />
              <span>Est. Delivery: <strong className="text-foreground">21 – 28 Days</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-gold-soft" />
              <span>Min. Order: <strong className="text-foreground">500 Units</strong></span>
            </div>
          </div>
        </div>

        {/* Pricing footer */}
        <div className="p-6 border-t border-border bg-secondary/15 flex-shrink-0 space-y-4">
          {/* Qty & Discount */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Quantity</span>
              <span className="font-bold text-gold">{pricing.qty.toLocaleString()} Units</span>
            </div>
            {pricing.discountPct > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">
                <TrendingDown className="h-3.5 w-3.5" />
                <span>{pricing.discountPct}% Volume Discount Applied</span>
              </div>
            )}
          </div>

          {/* Unit & Total */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Wholesale / Unit</span>
              <span className="font-semibold text-foreground">{pricing.unitPrice.toFixed(2)} SAR</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-muted-foreground pb-1">Total Estimate</span>
              <div className="flex items-baseline text-gold">
                <span className="font-display text-2xl font-bold tracking-tight">
                  {Math.round(pricing.total).toLocaleString()}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider ml-1 text-gold-soft">SAR</span>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => setInquiryOpen(true)}
              className="w-full py-3.5 rounded-xl bg-gold hover:bg-gold-soft text-black font-bold uppercase tracking-wider transition-all shadow-gold-glow flex items-center justify-center gap-2 text-xs"
            >
              <DollarSign className="h-4 w-4" /> Request Samples & Quote
            </button>
            <button
              onClick={() => setSuccessOpen(true)}
              className="w-full py-2.5 rounded-xl border border-border hover:border-gold/30 hover:bg-secondary/40 transition-all text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
            >
              Save Design Draft
            </button>
          </div>
        </div>
      </aside>

      {/* ═══════ INQUIRY MODAL ═══════ */}
      <AnimatePresence>
        {inquiryOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md p-8 rounded-2xl bg-card border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-soft" />
              <button onClick={() => setInquiryOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold mb-1">{selectedProduct.emoji} {selectedProduct.name} Configurator</div>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-2">Request OEM Quotation</h2>
                <p className="text-xs text-muted-foreground">
                  A dedicated AlKhuraiji consultant will respond with your custom cosmetics wholesale pricing within 24 hours.
                </p>
              </div>
              <form onSubmit={e => { e.preventDefault(); setInquiryOpen(false); setSuccessOpen(true); }} className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Representative Name</label>
                  <input type="text" required value={clientName} onChange={e => setClientName(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-gold outline-none text-white transition-colors text-sm"
                    placeholder="Full Name" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Business Email</label>
                  <input type="email" required value={clientEmail} onChange={e => setClientEmail(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-gold outline-none text-white transition-colors text-sm"
                    placeholder="name@company.com" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                  <input type="tel" required value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                    className="w-full mt-1.5 px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-gold outline-none text-white transition-colors text-sm"
                    placeholder="+966 50 000 0000" />
                </div>
                {/* Quote Summary */}
                <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 space-y-1 text-xs">
                  <div className="flex justify-between text-muted-foreground"><span>Product</span><span className="text-foreground font-medium">{selectedProduct.name}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Container</span><span className="text-foreground font-medium">{selectedContainer.name}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Quantity</span><span className="text-foreground font-medium">{pricing.qty.toLocaleString()} Units</span></div>
                  <div className="flex justify-between text-gold font-bold border-t border-gold/20 pt-2 mt-2"><span>Estimate</span><span>{Math.round(pricing.total).toLocaleString()} SAR</span></div>
                </div>
                <div className="pt-2 flex gap-3">
                  <button type="button" onClick={() => setInquiryOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-white transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="flex-1 py-3 rounded-xl bg-gold hover:bg-gold-soft text-black font-bold uppercase tracking-wider transition-colors shadow-gold-glow text-xs">
                    Submit Inquiry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════ SUCCESS MODAL ═══════ */}
      <AnimatePresence>
        {successOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm p-8 rounded-2xl bg-card border border-white/10 text-center shadow-2xl relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-soft rounded-t-2xl" />
              <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-gold stroke-[2.5]" />
              </div>
              <div className="text-2xl mb-2">{selectedProduct.emoji}</div>
              <h2 className="font-display text-2xl font-semibold mb-2 text-foreground">Inquiry Submitted</h2>
              <p className="text-xs text-muted-foreground mb-2">
                Your <strong className="text-foreground">{selectedProduct.name}</strong> cosmetic configuration has been logged. Our team will prepare a sample kit and detailed quotation.
              </p>
              <p className="text-[10px] text-gold/80 font-medium mb-6">Response within 24 business hours</p>
              <button onClick={() => setSuccessOpen(false)}
                className="w-full py-3 rounded-xl bg-gold hover:bg-gold-soft text-black font-bold uppercase tracking-wider transition-colors shadow-gold-glow text-xs">
                Continue Designing
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
