import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
  DollarSign,
  Lock,
  Unlock,
} from "lucide-react";
import { useAdminStore } from "@/store/adminStore";
import { useBuilderStore } from "@/store/useBuilderStore";
import { useTheme } from "@/components/ThemeProvider";
import baseImg from "@/assets/shape/base.png";
import circleGlass from "@/assets/shape/circle_glass.png";
import cylindricalGlass from "@/assets/shape/cyclindaric_glass.png";
import ovalGlass from "@/assets/shape/oval_glass.png";
import squareGlass from "@/assets/shape/square_glass.png";

// Pumps with collar (pwc)
import blackPwc from "@/assets/pumps/black_pwc.jpg";
import goldPwc from "@/assets/pumps/gold_pwc.jpg";
import rosePwc from "@/assets/pumps/rose_pwc.jpg";
import silverPwc from "@/assets/pumps/silver_pwc.jpg";

// Pumps without collar (pwtc)
import blackPwtc from "@/assets/pumps/black_pwtc.jpg";
import goldPwtc from "@/assets/pumps/gold_pwtc.jpg";
import rosePwtc from "@/assets/pumps/rose_pwtc.jpg";
import silverPwtc from "@/assets/pumps/silver_pwtc.jpg";

// Step collar (sc)
import blackSc from "@/assets/pumps/black_sc.jpg";
import goldSc from "@/assets/pumps/gold_sc.jpg";
import silverSc from "@/assets/pumps/silver_sc.jpg";

// Caps - organized by shape compatibility
import globOvalCap from "@/assets/caps/glob_oval_cap.jpg";
import kanoCap from "@/assets/caps/kano_cap.jpg";
import kingCap from "@/assets/caps/king_cap.jpg";
import ligaCylinderCap from "@/assets/caps/liga_cylinder_cap.jpg";
import nobelCylinderCap from "@/assets/caps/nobel_cylinder_cap.jpg";
import parisRoundCap from "@/assets/caps/paris_round_cap.jpg";
import prismSquareCap from "@/assets/caps/prism_square_cap.jpg";
import topDesenCap from "@/assets/caps/top_desen_konsept_m_cap.jpg";
import uvMagnetCap from "@/assets/caps/uv_magnet_black1_xl_cap.jpg";
import weedSquareCap from "@/assets/caps/weed_square_cap.jpg";

const SHAPE_IMAGES: Record<string, string> = {
  Round: circleGlass,
  Cylindrical: cylindricalGlass,
  Oval: ovalGlass,
  Square: squareGlass,
};

const getShapeImage = (name: string) => {
  if (name.includes("Round") || name.includes("Circle")) return circleGlass;
  if (name.includes("Cylinder") || name.includes("Cylindrical")) return cylindricalGlass;
  if (name.includes("Oval")) return ovalGlass;
  if (name.includes("Square") || name.includes("Cube")) return squareGlass;
  return null;
};

// Convert a hex color to an HSL hue value (0-360)
const hexToHue = (hex: string): number => {
  const cleaned = hex.replace("#", "");
  if (cleaned.length !== 6) return 0;
  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return 0;
  const d = max - min;
  let h = 0;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  return h;
};

// Build a CSS filter that tints the bottle image based on the selected color
const getColorFilter = (colorName: string): string => {
  switch (colorName) {
    case "Transparent":
      return "none";
    case "Black Frosted":
      return "grayscale(100%) brightness(0.45) contrast(1.1)";
    case "Amber":
      return "sepia(100%) saturate(250%) hue-rotate(-15deg) brightness(0.95)";
    case "Emerald":
      return "sepia(100%) saturate(300%) hue-rotate(75deg) brightness(0.9)";
    case "Royal Blue":
      return "sepia(100%) saturate(350%) hue-rotate(175deg) brightness(0.85)";
    case "Rose Gold":
      return "sepia(60%) saturate(220%) hue-rotate(310deg) brightness(1.05)";
    case "White Matte":
      return "grayscale(100%) brightness(1.25) contrast(0.9)";
    case "Gradient Luxe":
      return "sepia(80%) saturate(300%) hue-rotate(-10deg) brightness(1.1)";
    default:
      return "none";
  }
};

export const Route = createFileRoute("/builder")({
  component: BuilderPage,
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

// Note: MATERIALS, CAPACITIES, BOTTLE_COLORS, and CAP_COLORS are no longer
// defined here. They are now read from `useAdminStore()` inside `BuilderPage`
// so that admin toggles flow through to the live configurator.

// Cap structure: organized by bottle shape compatibility
// Each cap belongs to one or more shape categories (round, square, oval, cylinder, universal)
type CapShape = "round" | "square" | "oval" | "cylinder" | "universal";

interface CapVariant {
  id: string; // unique id used in store
  name: string; // display name
  price: number;
  image: string;
  shapes: CapShape[]; // which bottle silhouettes this cap fits
}

interface CapCategory {
  id: CapShape;
  name: string;
  description: string;
  variants: CapVariant[];
}

const CAP_CATEGORIES: CapCategory[] = [
  {
    id: "round",
    name: "Round Caps",
    description: "Caps designed for round / circular bottles",
    variants: [
      {
        id: "cap-paris-round",
        name: "Paris Round",
        price: 25,
        image: parisRoundCap,
        shapes: ["round", "universal"],
      },
      { id: "cap-king", name: "King", price: 28, image: kingCap, shapes: ["round", "universal"] },
    ],
  },
  {
    id: "square",
    name: "Square Caps",
    description: "Caps designed for square / cube bottles",
    variants: [
      {
        id: "cap-prism-square",
        name: "Prism Square",
        price: 32,
        image: prismSquareCap,
        shapes: ["square", "universal"],
      },
      {
        id: "cap-weed-square",
        name: "Weed Square",
        price: 28,
        image: weedSquareCap,
        shapes: ["square", "universal"],
      },
    ],
  },
  {
    id: "oval",
    name: "Oval Caps",
    description: "Caps designed for oval bottles",
    variants: [
      {
        id: "cap-glob-oval",
        name: "Glob Oval",
        price: 26,
        image: globOvalCap,
        shapes: ["oval", "round", "universal"],
      },
    ],
  },
  {
    id: "cylinder",
    name: "Cylinder Caps",
    description: "Caps designed for cylindrical bottles",
    variants: [
      {
        id: "cap-liga-cylinder",
        name: "Liga Cylinder",
        price: 24,
        image: ligaCylinderCap,
        shapes: ["cylinder", "universal"],
      },
      {
        id: "cap-nobel-cylinder",
        name: "Nobel Cylinder",
        price: 35,
        image: nobelCylinderCap,
        shapes: ["cylinder", "universal"],
      },
    ],
  },
  {
    id: "universal",
    name: "Universal Caps",
    description: "Premium caps compatible with all bottle shapes",
    variants: [{ id: "cap-kano", name: "Kano", price: 22, image: kanoCap, shapes: ["universal"] }],
  },
];

// Lookup map for fast image retrieval by cap id
const CAP_IMAGES: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  CAP_CATEGORIES.forEach((cat) => {
    cat.variants.forEach((v) => {
      map[v.id] = v.image;
    });
  });
  return map;
})();

const getCapPrice = (capId: string): number => {
  for (const cat of CAP_CATEGORIES) {
    const v = cat.variants.find((x) => x.id === capId);
    if (v) return v.price;
  }
  return 15;
};

// Returns the shape key (round/square/oval/cylinder/universal) for a bottle silhouette
const getBottleShapeKey = (silhouette: string): CapShape => {
  const sil = silhouette.toLowerCase();
  if (sil.includes("round") || sil.includes("circle") || sil.includes("prestige")) return "round";
  if (sil.includes("square") || sil.includes("cube")) return "square";
  if (sil.includes("oval")) return "oval";
  if (sil.includes("cylinder") || sil.includes("cylindrical")) return "cylinder";
  return "universal";
};

// Returns cap variant objects that match the given bottle shape
const getCompatibleCaps = (silhouette: string): CapVariant[] => {
  const shapeKey = getBottleShapeKey(silhouette);
  const compatible: CapVariant[] = [];
  CAP_CATEGORIES.forEach((cat) => {
    cat.variants.forEach((v) => {
      if (v.shapes.includes(shapeKey) || v.shapes.includes("universal")) {
        compatible.push(v);
      }
    });
  });
  return compatible;
};

// See note above: CAP_COLORS is now read from useAdminStore() inside BuilderPage.

// Pump structure: 3 categories, each with color variants.
// Image suffix: pwc = pump with collar, pwtc = pump without collar, sc = step collar
type PumpColor = "Black" | "Gold" | "Rose" | "Silver";

interface PumpVariant {
  id: string; // unique id used in store
  name: string; // display name
  color: PumpColor;
  price: number;
  image: string;
}

interface PumpCategory {
  id: "pwc" | "pwtc" | "sc";
  name: string;
  description: string;
  variants: PumpVariant[];
}

const PUMP_CATEGORIES: PumpCategory[] = [
  {
    id: "pwc",
    name: "Pump with Collar",
    description: "Premium spray pump with decorative collar neck",
    variants: [
      { id: "pwc-black", name: "Black", color: "Black", price: 18, image: blackPwc },
      { id: "pwc-gold", name: "Gold", color: "Gold", price: 28, image: goldPwc },
      { id: "pwc-rose", name: "Rose", color: "Rose", price: 26, image: rosePwc },
      { id: "pwc-silver", name: "Silver", color: "Silver", price: 22, image: silverPwc },
    ],
  },
  {
    id: "pwtc",
    name: "Pump without Collar",
    description: "Sleek minimalist spray pump, no collar",
    variants: [
      { id: "pwtc-black", name: "Black", color: "Black", price: 14, image: blackPwtc },
      { id: "pwtc-gold", name: "Gold", color: "Gold", price: 22, image: goldPwtc },
      { id: "pwtc-rose", name: "Rose", color: "Rose", price: 20, image: rosePwtc },
      { id: "pwtc-silver", name: "Silver", color: "Silver", price: 18, image: silverPwtc },
    ],
  },
  {
    id: "sc",
    name: "Step Collar",
    description: "Stepped collar for premium threaded closures",
    variants: [
      { id: "sc-black", name: "Black", color: "Black", price: 16, image: blackSc },
      { id: "sc-gold", name: "Gold", color: "Gold", price: 24, image: goldSc },
      { id: "sc-silver", name: "Silver", color: "Silver", price: 20, image: silverSc },
    ],
  },
];

// Lookup map for fast image retrieval by pump id
const PUMP_IMAGES: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  PUMP_CATEGORIES.forEach((cat) => {
    cat.variants.forEach((v) => {
      map[v.id] = v.image;
    });
  });
  return map;
})();

const getPumpPrice = (pumpId: string): number => {
  for (const cat of PUMP_CATEGORIES) {
    const v = cat.variants.find((x) => x.id === pumpId);
    if (v) return v.price;
  }
  return 10;
};

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
  const navigate = useNavigate();
  const [category, setCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("bottle"); // bottle, cap, fragrance, packaging, branding

  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const { theme } = useTheme();
  const [resolvedTheme, setResolvedTheme] = useState("dark");

  useEffect(() => {
    if (theme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setResolvedTheme(isDark ? "dark" : "light");
    } else {
      setResolvedTheme(theme || "dark");
    }
  }, [theme]);

  // Client Representative Details
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  const store = useBuilderStore();
  const {
    builderBottles,
    builderMaterials,
    builderCapacities,
    builderColors,
    capColors,
    showBottleMaterials,
    showBottleCapacity,
    showBottleColor,
    showCapColor,
  } = useAdminStore();
  const activeBottles = builderBottles.filter((b) => b.active);

  // Materials / capacities / bottle colors / cap colors are admin-controlled.
  // Filter to active items and skip entire sections when their visibility
  // flag is off. This is what makes admin toggles visible on this page.
  const materials = builderMaterials.filter((m) => m.active).map((m) => m.name);
  const capacities = builderCapacities.filter((c) => c.active).map((c) => c.name);
  const bottleColors = builderColors
    .filter((c) => c.active)
    .map((c) => ({ name: c.name, hex: c.hex, price: c.price ?? 0 }));
  const capColorsList = capColors
    .filter((c) => c.active)
    .map((c) => ({ name: c.name, hex: c.hex, price: c.price ?? 0 }));

  const TABS = ["bottle", "cap", "fragrance", "packaging", "branding"];
  const activeIndex = TABS.indexOf(activeTab);
  const handlePrevTab = () => {
    if (activeIndex > 0) {
      setActiveTab(TABS[activeIndex - 1]);
    }
  };
  const handleNextTab = () => {
    if (activeIndex < TABS.length - 1) {
      const next = TABS[activeIndex + 1];
      // Only allow advancing if the next step is unlocked
      if (isTabUnlocked(next)) {
        setActiveTab(next);
      }
    }
  };

  // Sequential step locking: only the first tab is unlocked by default.
  // The user must complete each step to unlock the next one.
  const [unlockedSteps, setUnlockedSteps] = useState<Set<string>>(() => new Set(["bottle"]));

  // Step completion checks
  const isBottleComplete = !!store.bottleSilhouette;
  const isCapComplete = !!store.capStyle;
  const isPumpComplete = !!store.pumpType;

  // Unlock the next step in sequence
  const unlockNext = (currentTab: string) => {
    const idx = TABS.indexOf(currentTab);
    if (idx >= 0 && idx < TABS.length - 1) {
      const next = TABS[idx + 1];
      setUnlockedSteps((prev) => {
        if (prev.has(next)) return prev;
        const nextSet = new Set(prev);
        nextSet.add(next);
        return nextSet;
      });
    }
  };

  const isTabUnlocked = (tabId: string) => unlockedSteps.has(tabId);

  const getCapacityScale = (capacity: string) => {
    switch (capacity) {
      case "10ml":
        return 0.65;
      case "30ml":
        return 0.75;
      case "50ml":
        return 0.85;
      case "75ml":
        return 0.92;
      case "100ml":
        return 1.0;
      case "150ml":
        return 1.08;
      case "250ml":
        return 1.18;
      default:
        return 1.0;
    }
  };
  const scale = getCapacityScale(store.bottleCapacity);

  // FIXED CANVAS SLOT — every silhouette renders inside the SAME
  // bounding box so they all line up identically in the preview.
  //
  //   • bottle slot: 280 × 416 (bottom 65% of the canvas)
  //   • pump slot : 280 × 96  (middle 15%)
  //   • cap slot  : 280 × 128 (top 20%)
  //   • canvas   : 280 × 640
  //
  // Each uploaded silhouette PNG is rendered with object-contain inside
  // the 280 × 416 bottle slot, anchored to the bottom-center. Because
  // the slot never changes size, Round / Square / Oval / Cylindrical
  // (and any future admin-uploaded shape) all land in exactly the same
  // horizontal/vertical position.
  const CANVAS_WIDTH = "280px";
  const CANVAS_HEIGHT = "640px";
  const BOTTLE_SLOT_W = "280px";
  const BOTTLE_SLOT_H = "416px";
  const BOTTLE_SLICE = "416px"; // 65% of 640
  const PUMP_SLICE = "96px"; // 15% of 640
  const CAP_SLICE = "128px"; // 20% of 640
  // The per-silhouette "borderRadius" hint is still exposed via dims
  // because some downstream effects (e.g. shadow tint) use it, but the
  // slot dimensions are NO LONGER driven by the silhouette.
  const dims = {
    width: CANVAS_WIDTH,
    height: BOTTLE_SLOT_H,
    borderRadius: "24px",
  };
  const shapeImage = getShapeImage(store.bottleSilhouette);

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

    const matPrice =
      store.bottleMaterial === "Crystal"
        ? 35
        : store.bottleMaterial === "Frosted Glass"
          ? 15
          : store.bottleMaterial === "Glass"
            ? 10
            : store.bottleMaterial === "Matte Glass"
              ? 20
              : store.bottleMaterial === "Recycled"
                ? 12
                : 5;

    const colPrice = bottleColors.find((c) => c.name === store.bottleColor)?.price ?? 0;

    const capStylePrice = getCapPrice(store.capStyle) || 15;
    const capColorPrice =
      store.capStyle === "Colored Cap"
        ? (capColorsList.find((c) => c.name === store.capColor)?.price ?? 0)
        : 0;
    const capPrice = capStylePrice + capColorPrice;

    const pumpPrice = getPumpPrice(store.pumpType) || 10;

    // Scent Blend custom selection calculation
    const noteCount =
      (store.fragrance.top?.length || 0) +
      (store.fragrance.middle?.length || 0) +
      (store.fragrance.base?.length || 0);
    const notesPrice = noteCount * 4;
    const intensityPrice =
      INTENSITIES.find((i) => i.name === store.fragrance.intensity)?.price || 35;
    const fragranceTotalPrice = notesPrice + intensityPrice;

    // Presentation box pricing
    const boxPrice = PACKAGING_TYPES.find((p) => p.name === store.packaging.type)?.price || 15;
    const finishPrice =
      PACKAGING_FINISHES.find((p) => p.name === store.packaging.finish)?.price || 10;
    const addonsPrice = (store.packaging.addons || []).reduce(
      (sum, ad) => sum + (PACKAGING_ADDONS.find((a) => a.name === ad)?.price || 0),
      0,
    );
    const packagingTotalPrice = boxPrice + finishPrice + addonsPrice;

    const brandPrice = 5; // customized layout imprint charge

    const unitPriceBeforeDiscount =
      bottleBase +
      matPrice +
      colPrice +
      capPrice +
      pumpPrice +
      fragranceTotalPrice +
      packagingTotalPrice +
      brandPrice;

    // B2B Wholesale discount multiplier
    let discount = 0;
    if (store.quantity >= 5000) discount = 0.4;
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
      discountPercent: Math.round(discount * 100),
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
              onClick={() => {
                if (cat.id === "perfume") {
                  setCategory(cat.id);
                } else if (cat.id === "cosmetics") {
                  navigate({ to: "/cosmetics" });
                } else {
                  alert("Home Fragrance and Personal Care coming soon!");
                }
              }}
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
    );
  }

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col lg:flex-row overflow-hidden relative transition-colors duration-300">
      {/* Dynamic luxury dark space highlight backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#f9f9fb] via-[#f0f0f5] to-[#e4e4eb] dark:from-[#0d0d1e] dark:via-[#05050a] dark:to-[#020205] pointer-events-none z-0 transition-all duration-300" />

      {/* Catalog Home */}
      <button
        onClick={() => setCategory(null)}
        className="absolute top-6 left-6 z-50 px-4 py-2 rounded-full border border-border bg-secondary/30 hover:bg-secondary/50 hover:border-gold/30 transition-all text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground"
      >
        ← Catalogs
      </button>

      {/* ================= COLUMN 1: LEFT SIDEBAR OPTIONS (380px) ================= */}
      <aside className="w-full lg:w-[380px] lg:flex-shrink-0 border-r border-border bg-card/90 backdrop-blur-3xl z-10 flex flex-col h-screen pt-20 transition-colors duration-300">
        {/* Brand configuration text entry */}
        <div className="p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold-soft">
              Premium OEM/ODM
            </span>
            <span className="text-xs font-semibold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
              {progress}% Complete
            </span>
          </div>
          <div className="space-y-2">
            <h2 className="font-display text-2xl font-light text-foreground">Your Brand Design</h2>
            <input
              type="text"
              value={store.label.name}
              onChange={(e) => store.updateLabel({ name: e.target.value.toUpperCase() })}
              placeholder="ENTER BRAND NAME..."
              className="w-full bg-secondary/30 border border-border focus:border-gold rounded-lg px-4 py-2.5 text-xs outline-none text-foreground tracking-widest font-medium uppercase transition-colors"
            />
          </div>
        </div>

        {/* Tab Buttons (Bottle, Cap, Fragrance, Packaging, Branding) - Sequential unlocking */}
        <div className="flex border-b border-border bg-secondary/10 overflow-x-auto scrollbar-hide flex-shrink-0">
          {[
            { id: "bottle", label: "Bottle" },
            { id: "cap", label: "Cap" },
            { id: "fragrance", label: "Fragrance" },
            { id: "packaging", label: "Packaging" },
            { id: "branding", label: "Branding" },
          ].map((tab) => {
            const unlocked = isTabUnlocked(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => unlocked && setActiveTab(tab.id)}
                disabled={!unlocked}
                className={`flex-1 py-3 px-4 text-center text-[10px] font-bold uppercase tracking-wider transition-colors relative whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? "text-gold"
                    : unlocked
                      ? "text-muted-foreground hover:text-foreground"
                      : "text-muted-foreground/30 cursor-not-allowed"
                }`}
              >
                {!unlocked && <Lock className="h-3 w-3" />}
                {tab.label}
                {activeTab === tab.id && unlocked && (
                  <motion.div
                    layoutId="activeStepLine"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold to-gold-soft"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic configuration tabs body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide pb-24">
          <AnimatePresence mode="wait">
            {/* 1. BOTTLE SHAPE & SPECIFICATIONS */}
            {activeTab === "bottle" && (
              <motion.div
                key="bottle-wizard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                    1. Silhouette Shape
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {activeBottles.map((bottle) => {
                      const shapeImg = getShapeImage(bottle.name);
                      return (
                        <button
                          key={bottle.id}
                          onClick={() => store.setBottleSilhouette(bottle.name)}
                          className={`p-4 rounded-xl border text-left transition-all duration-300 relative group overflow-hidden flex items-center gap-3 ${
                            store.bottleSilhouette === bottle.name
                              ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)] text-gold"
                              : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                          }`}
                        >
                          {shapeImg ? (
                            <img
                              src={shapeImg}
                              alt={bottle.name}
                              className="h-12 w-12 object-contain flex-shrink-0"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded bg-muted/50 border border-border" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-foreground mb-1 truncate">
                              {bottle.name}
                            </div>
                            <div className="text-[9px] text-muted-foreground uppercase truncate">
                              {bottle.category}
                            </div>
                          </div>
                          {store.bottleSilhouette === bottle.name && (
                            <div className="absolute right-3 top-3 h-4 w-4 bg-gold rounded-full flex items-center justify-center text-black">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {showBottleMaterials && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                      2. Material Selection
                    </h3>
                    {materials.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {materials.map((mat) => (
                          <button
                            key={mat}
                            onClick={() => store.setBottleMaterial(mat)}
                            className={`p-3 rounded-lg border text-center text-xs font-medium transition-all ${
                              store.bottleMaterial === mat
                                ? "bg-gold/10 border-gold text-gold font-semibold"
                                : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                            }`}
                          >
                            {mat}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic">
                        No material options available.
                      </p>
                    )}
                  </div>
                )}

                {showBottleCapacity && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                      3. Capacity
                    </h3>
                    {capacities.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {capacities.map((cap) => (
                          <button
                            key={cap}
                            onClick={() => store.setBottleCapacity(cap)}
                            className={`py-2.5 rounded-lg border text-center text-xs font-medium transition-all ${
                              store.bottleCapacity === cap
                                ? "bg-gold/10 border-gold text-gold font-bold"
                                : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                            }`}
                          >
                            {cap}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic">
                        No capacity options available.
                      </p>
                    )}
                  </div>
                )}

                {showBottleColor && (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                      4. Glass Color & Finish
                    </h3>
                    {bottleColors.length > 0 ? (
                      <div className="grid grid-cols-4 gap-3">
                        {bottleColors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => store.setBottleColor(color.name)}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                              store.bottleColor === color.name
                                ? "border-gold bg-secondary/30"
                                : "border-transparent hover:bg-secondary/20"
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-full border border-border shadow-lg relative overflow-hidden"
                              style={{ background: color.hex }}
                            >
                              {store.bottleColor === color.name && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Check className="h-4 w-4 text-gold" />
                                </div>
                              )}
                            </div>
                            <span className="text-[9px] text-muted-foreground text-center truncate w-full">
                              {color.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic">
                        No bottle color options available.
                      </p>
                    )}
                  </div>
                )}

                {/* Proceed to next step button */}
                <button
                  onClick={() => {
                    unlockNext("bottle");
                    setActiveTab("cap");
                  }}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gold hover:bg-gold-soft text-black text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-gold-glow"
                >
                  Proceed to Cap Selection <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}

            {/* 2. CAPS & PUMPS */}
            {activeTab === "cap" && (
              <motion.div
                key="cap-wizard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-1">
                    Cap Crown Style
                  </h3>
                  <p className="text-[10px] text-muted-foreground mb-4">
                    Showing caps compatible with your selected bottle shape:{" "}
                    <span className="text-gold font-semibold">{store.bottleSilhouette}</span>
                  </p>

                  <div className="space-y-5">
                    {CAP_CATEGORIES.map((cat) => {
                      // Filter variants to those that match the current bottle shape
                      const compatibleVariants = cat.variants.filter((v) => {
                        const shapeKey = getBottleShapeKey(store.bottleSilhouette);
                        return v.shapes.includes(shapeKey) || v.shapes.includes("universal");
                      });
                      if (compatibleVariants.length === 0) return null;
                      return (
                        <div key={cat.id}>
                          <div className="flex items-baseline justify-between mb-2">
                            <div>
                              <div className="text-xs font-bold text-foreground">{cat.name}</div>
                              <div className="text-[9px] text-muted-foreground">
                                {cat.description}
                              </div>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {compatibleVariants.map((v) => {
                              const isSelected = store.capStyle === v.id;
                              return (
                                <button
                                  key={v.id}
                                  onClick={() => store.setCapStyle(v.id)}
                                  className={`p-2 rounded-lg border text-center transition-all ${
                                    isSelected
                                      ? "bg-gold/10 border-gold shadow-[0_0_10px_rgba(212,175,55,0.15)]"
                                      : "bg-secondary/15 border-border hover:border-gold/30"
                                  }`}
                                >
                                  <div className="w-full aspect-square mb-1.5 flex items-center justify-center overflow-hidden rounded bg-background/40">
                                    <img
                                      src={v.image}
                                      alt={v.name}
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                  <div className="text-[10px] font-semibold text-foreground leading-tight">
                                    {v.name}
                                  </div>
                                  <div className="text-[8px] text-gold font-bold mt-0.5">
                                    +{v.price}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {store.capStyle === "Colored Cap" && showCapColor && (
                  <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                      Cap Color Selection
                    </h3>
                    {capColorsList.length > 0 ? (
                      <div className="grid grid-cols-4 gap-3">
                        {capColorsList.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => store.setCapColor(color.name)}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all ${
                              store.capColor === color.name
                                ? "border-gold bg-secondary/30"
                                : "border-transparent hover:bg-secondary/20"
                            }`}
                          >
                            <div
                              className="w-10 h-10 rounded-full border border-border shadow-lg relative overflow-hidden"
                              style={{ background: color.hex }}
                            >
                              {store.capColor === color.name && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <Check className="h-4 w-4 text-gold" />
                                </div>
                              )}
                            </div>
                            <span className="text-[9px] text-muted-foreground text-center truncate w-full">
                              {color.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground italic">
                        No cap color options available.
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-1">
                    Pump & Atomizer Accents
                  </h3>
                  <p className="text-[10px] text-muted-foreground mb-4">
                    Choose a category and color — the pump renders live in the preview above.
                  </p>

                  <div className="space-y-5">
                    {PUMP_CATEGORIES.map((cat) => (
                      <div key={cat.id}>
                        <div className="flex items-baseline justify-between mb-2">
                          <div>
                            <div className="text-xs font-bold text-foreground">{cat.name}</div>
                            <div className="text-[9px] text-muted-foreground">
                              {cat.description}
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                          {cat.variants.map((v) => {
                            const isSelected = store.pumpType === v.id;
                            return (
                              <button
                                key={v.id}
                                onClick={() => store.setPumpType(v.id)}
                                className={`p-2 rounded-lg border text-center transition-all ${
                                  isSelected
                                    ? "bg-gold/10 border-gold shadow-[0_0_10px_rgba(212,175,55,0.15)]"
                                    : "bg-secondary/15 border-border hover:border-gold/30"
                                }`}
                              >
                                <div className="w-full aspect-square mb-1.5 flex items-center justify-center overflow-hidden rounded bg-background/40">
                                  <img
                                    src={v.image}
                                    alt={v.name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>
                                <div className="text-[10px] font-semibold text-foreground leading-tight">
                                  {v.name}
                                </div>
                                <div className="text-[8px] text-gold font-bold mt-0.5">
                                  +{v.price}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proceed to next step button */}
                <button
                  onClick={() => {
                    unlockNext("cap");
                    setActiveTab("fragrance");
                  }}
                  className="w-full mt-2 py-3 px-4 rounded-xl bg-gold hover:bg-gold-soft text-black text-[11px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-gold-glow"
                >
                  Proceed to Fragrance Notes <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )}

            {/* 3. FRAGRANCE NOTE COMPOSITION */}
            {activeTab === "fragrance" && (
              <motion.div
                key="fragrance-wizard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-1">
                    Olfactive Note Mixer
                  </h3>
                  <p className="text-[10px] text-muted-foreground mb-4">
                    Select up to 3 luxury notes per composition layer (+4 SAR per note).
                  </p>

                  {/* Top, Middle, Base Notes Layers */}
                  {(Object.keys(NOTES) as Array<"top" | "middle" | "base">).map((layer) => {
                    const selected = store.fragrance[layer] || [];
                    return (
                      <div key={layer} className="space-y-2.5 mb-4">
                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground capitalize">
                          {layer} Notes
                        </label>
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
                                    : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
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

                <div className="pt-4 border-t border-border">
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                    Scent Intensity & Blend
                  </h3>
                  <div className="space-y-2.5">
                    {INTENSITIES.map((int) => (
                      <button
                        key={int.name}
                        onClick={() => store.updateFragrance({ intensity: int.name })}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          store.fragrance.intensity === int.name
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)] text-gold"
                            : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-foreground">{int.name}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5">
                            Custom scent density composition
                          </div>
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
              <motion.div
                key="packaging-wizard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                    Outer Box Style
                  </h3>
                  <div className="space-y-2.5">
                    {PACKAGING_TYPES.map((pack) => (
                      <button
                        key={pack.name}
                        onClick={() => store.updatePackaging({ type: pack.name })}
                        className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                          store.packaging.type === pack.name
                            ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)] text-gold"
                            : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-semibold text-foreground">{pack.name}</div>
                          <div className="text-[9px] text-muted-foreground mt-0.5">
                            Heavy cardboard wholesale box base
                          </div>
                        </div>
                        <div className="text-xs font-bold text-gold">+{pack.price} SAR</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                    Box Texture & Finish
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {PACKAGING_FINISHES.map((finish) => (
                      <button
                        key={finish.name}
                        onClick={() => store.updatePackaging({ finish: finish.name })}
                        className={`p-3 rounded-lg border text-center text-xs font-medium transition-all ${
                          store.packaging.finish === finish.name
                            ? "bg-gold/10 border-gold text-gold"
                            : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                        }`}
                      >
                        {finish.name} (+{finish.price} SAR)
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                    Embellishments & Add-ons
                  </h3>
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
                              : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
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
              <motion.div
                key="branding-wizard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                    Branding Typography
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {FONTS.map((font) => (
                      <button
                        key={font}
                        onClick={() => store.updateLabel({ font })}
                        className={`py-3 rounded-lg border text-center text-[10px] transition-all ${
                          store.label.font === font
                            ? "bg-gold/10 border-gold text-gold font-semibold"
                            : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
                        }`}
                        style={{ fontFamily: font === "Elegant Serif" ? "serif" : "sans-serif" }}
                      >
                        {font}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-3">
                    Label Silhouette
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {SHAPES.map((shape) => (
                      <button
                        key={shape}
                        onClick={() => store.updateLabel({ shape })}
                        className={`py-3 rounded-lg border text-center text-xs font-medium transition-all ${
                          store.label.shape === shape
                            ? "bg-gold/10 border-gold text-gold"
                            : "bg-secondary/15 border-border hover:border-gold/30 text-foreground"
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
        <div className="border-t border-border bg-background/80 p-4 flex items-center justify-between gap-3 flex-shrink-0 z-20 transition-colors duration-300">
          <button
            onClick={handlePrevTab}
            disabled={activeIndex === 0}
            className={`flex-1 py-3 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeIndex === 0
                ? "border-border text-muted-foreground/30 cursor-not-allowed"
                : "border-border hover:border-gold/30 hover:bg-secondary/40 text-foreground active:scale-[0.98]"
            }`}
          >
            ← Previous
          </button>
          <button
            onClick={handleNextTab}
            disabled={activeIndex === TABS.length - 1}
            className={`flex-1 py-3 px-4 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeIndex === TABS.length - 1
                ? "bg-secondary/20 border border-border text-muted-foreground/30 cursor-not-allowed"
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
        {/* <div className="absolute top-8 text-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Interactive 3D Stage</span>
          <p className="text-[8px] text-muted-foreground/50 mt-1">Move your cursor to rotate customized private label bottle</p>
        </div> */}

        {/* ================= IMMERSIVE 3D PRODUCT-DESIGNER STAGE =================
            The preview is presented as a large, framed product-designer canvas.
            - Animated gradient backdrop with a soft overhead spotlight
            - Subtle floor grid (perspective lines) for depth
            - Floor reflection of the bottle (mirrored, low opacity)
            - Dynamic shape label chip floating above the bottle
            - Tilt-on-cursor parallax preserved from previous build
            - The actual bottle/cap/pump stack is unchanged internally —
              only the surrounding stage chrome is upgraded.
        ======================================================================= */}
        <div className="relative w-full max-w-3xl h-[78vh] flex items-center justify-center perspective-1200">
          {/* ===== Stage frame: outer card with thin gold border + vignette ===== */}
          <div className="absolute inset-0 rounded-[28px] overflow-hidden border border-gold/15 bg-gradient-to-b from-secondary/30 via-background/40 to-secondary/20 shadow-[0_30px_120px_-20px_rgba(0,0,0,0.9)]">
            {/* Animated radial spotlight from above */}
            <motion.div
              className="absolute -top-32 left-1/2 -translate-x-1/2 w-[120%] h-[70%] bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,rgba(212,175,55,0.05)_35%,transparent_70%)] pointer-events-none"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Soft side glows for depth */}
            <div className="absolute top-1/3 -left-20 w-72 h-72 bg-gold/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-gold-soft/10 rounded-full blur-[100px] pointer-events-none" />
            {/* Perspective floor grid lines */}
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
            {/* Horizontal "horizon" line where the floor meets the wall */}
            <div className="absolute left-0 right-0 bottom-1/2 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent pointer-events-none" />
            {/* Vignette to focus the eye on the product */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)] pointer-events-none" />
            {/* Corner crosshairs (designer / blueprint feel) */}
            {[
              "top-4 left-4 border-t border-l",
              "top-4 right-4 border-t border-r",
              "bottom-4 left-4 border-b border-l",
              "bottom-4 right-4 border-b border-r",
            ].map((pos) => (
              <div
                key={pos}
                className={`absolute ${pos} w-5 h-5 border-gold/40 pointer-events-none`}
              />
            ))}
          </div>

          {/* ===== Floating product (bottle + cap/pump + reflection) ===== */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ rotateY, transformStyle: "preserve-3d" }}
            className="relative w-full h-full flex items-center justify-center"
          >
            {/* Floor reflection of the full assembly.
                Mirrored vertically, faded out, blurred — gives the illusion
                the bottle is sitting on a glossy surface inside the stage. */}
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                bottom: "8%",
                width: "60%",
                height: "55%",
                transform: "translateX(-50%) scaleY(-1)",
                opacity: 0.18,
                filter: "blur(6px)",
                WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 85%)",
                maskImage: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 85%)",
              }}
            >
              <div
                className="w-full h-full"
                style={{
                  filter: getColorFilter(store.bottleColor),
                }}
              >
                {shapeImage && (
                  <img
                    src={shapeImage}
                    alt=""
                    aria-hidden
                    className="w-full h-full object-contain"
                  />
                )}
                {isTabUnlocked("cap") && PUMP_IMAGES[store.pumpType] && !store.capStyle && (
                  <img
                    src={PUMP_IMAGES[store.pumpType]}
                    alt=""
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: 0,
                      width: "35%",
                      height: "49%",
                      objectFit: "contain",
                      objectPosition: "center bottom",
                    }}
                  />
                )}
                {isTabUnlocked("cap") && CAP_IMAGES[store.capStyle] && !store.pumpType && (
                  <img
                    src={CAP_IMAGES[store.capStyle]}
                    alt=""
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      top: 0,
                      width: "55%",
                      height: "77%",
                      objectFit: "contain",
                      objectPosition: "center bottom",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Ground contact shadow (elliptical, soft) */}
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                bottom: "8%",
                width: `calc(${dims.width} * 1.05)`,
                height: `calc(${dims.width} * 0.12)`,
                background:
                  "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)",
                filter: "blur(8px)",
                zIndex: 5,
              }}
            />

            {/* ===== Dynamic shape label chip (top of stage) ===== */}
            <AnimatePresence mode="wait">
              <motion.div
                key={store.bottleSilhouette}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35 }}
                className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-background/70 backdrop-blur-md shadow-lg"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                  {store.bottleSilhouette}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* ===== Spec readout chip (bottom of stage) ===== */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 px-4 py-2 rounded-full border border-border/60 bg-background/60 backdrop-blur-md text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="text-gold-soft">{store.bottleMaterial}</span>
              <span className="h-3 w-px bg-border" />
              <span className="text-foreground">{store.bottleColor}</span>
              <span className="h-3 w-px bg-border" />
              <span>{store.bottleCapacity}ml</span>
            </div>

            {/* ===== Layered bottle/cap/pump canvas (3-slice stack) =====
                ============================================================
                The preview canvas is a 400×640 unit grid (scaled by `s`)
                split into three vertical slices that stack exactly on
                top of one another, all centered on the same axis:

                  ┌──────────────────────────────┐  ← top (z-30: CAP)
                  │   CAP SLICE   (400 × 128)   │  20% of total height
                  ├──────────────────────────────┤
                  │   PUMP SLICE  (400 × 96)    │  15% of total height
                  ├──────────────────────────────┤
                  │   BOTTLE SLICE (400 × 416)  │  65% of total height
                  └──────────────────────────────┘  ← bottom (z-10: BOTTLE)

                Layer rules:
                - BASE LAYER (z-10): Bottle. Anchored to the BOTTLE
                  slice. The bottle's top-of-shoulders touches the top
                  pixel row of this slice. Always rendered.
                - MID LAYER (z-20): Pump. Anchored to the PUMP slice.
                  The pump's collar bottom touches the bottom pixel row
                  of this slice (so the visible pump base sits flush
                  against the top of the bottle slice). Renders ONLY
                  when a pump is selected AND no cap is active.
                - TOP LAYER (z-30): Cap. Anchored to the CAP slice.
                  The cap graphic is centered horizontally and
                  vertically inside this slice. Renders ONLY when a cap
                  is selected AND no pump is active.

                Because the slices are pixel-aligned to the same canvas,
                the cap/pump bottom edge and the bottle's top edge share
                the same Y-coordinate, producing a flush stack with no
                visible gap.
                ============================================================ */}
            {(() => {
              const showPump =
                isTabUnlocked("cap") && !!PUMP_IMAGES[store.pumpType] && !store.capStyle;
              const showCap =
                isTabUnlocked("cap") && !!CAP_IMAGES[store.capStyle] && !store.pumpType;
              // Scale factor: dims.width is the bottle's intrinsic width.
              // We want the canvas WIDTH to be ~dims.width * 1.0 (so the
              // bottle slice matches the bottle's natural width) and the
              // canvas HEIGHT to be dims.width * 1.6 (matching the
              // 400:640 ≈ 1:1.6 spec). All three slice heights derive
              // from that:
              //   cap   = canvas_h * 0.20 = dims.width * 0.32
              //   pump  = canvas_h * 0.15 = dims.width * 0.24
              //   botl  = canvas_h * 0.65 = dims.width * 1.04
              // The bottle slice then takes dims.height (= dims.width *
              // aspect) and the pump/cap fill the rest of the canvas.
              // To keep the bottle slice exactly dims.height tall while
              // preserving the 65% ratio, we set canvas_h = dims.height
              // / 0.65 and let the cap/pump slices scale accordingly.
              // Fixed 3-slice geometry. The bottle, pump, and cap slots
              // are sized independently of the active silhouette so every
              // PNG ends up in the same screen position.
              const bottleSlice = BOTTLE_SLICE;
              const canvasH = CANVAS_HEIGHT;
              const capH = CAP_SLICE;
              const pumpH = PUMP_SLICE;
              const canvasW = CANVAS_WIDTH;
              return (
                <div
                  className="relative"
                  style={{
                    width: canvasW,
                    height: canvasH,
                  }}
                >
                  {/* LAYER 0 (z-0): Base wireframe placeholder — always visible.
                      Shows base.png as the fixed frame/placeholder when no bottle
                      is selected. Once the user picks a silhouette, this stays as
                      a subtle reference frame behind the actual bottle image. */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{ zIndex: 0 }}
                  >
                    <img
                      src={baseImg}
                      alt="Bottle placeholder"
                      draggable={false}
                      className="max-w-full max-h-full object-contain select-none"
                      style={{
                        opacity: shapeImage ? 0.35 : 0.9,
                        transition: "opacity 0.4s ease",
                      }}
                    />
                  </div>

                  {/* BASE LAYER (z-10): Bottle — anchored to BOTTOM 65%
                      slice. The bottle's top-of-shoulders touches the
                      top pixel row of the bottle slice. Only rendered
                      when the user has selected a silhouette. */}
                  <div
                    className="absolute left-0 right-0 bottom-0"
                    style={{
                      height: bottleSlice,
                      zIndex: 10,
                    }}
                  >
                    {shapeImage ? (
                      <motion.img
                        key={`bottle-${store.bottleSilhouette}`}
                        src={shapeImage}
                        alt={store.bottleSilhouette}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        style={{
                          width: BOTTLE_SLOT_W,
                          height: BOTTLE_SLOT_H,
                          filter: getColorFilter(store.bottleColor),
                          transition: "filter 0.6s ease",
                        }}
                        // object-contain + object-bottom-center pins every
                        // silhouette to the SAME rectangle regardless of the
                        // PNG's intrinsic aspect ratio, so the bottle never
                        // shifts up/down or left/right when the shape changes.
                        className="object-contain object-bottom drop-shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
                      />
                    ) : null}
                  </div>

                  {/* MID LAYER (z-20): Pump — anchored to MIDDLE 15%
                      slice. Bottom edge of the pump collar touches the
                      bottom pixel row of this slice, which is the same
                      Y-coordinate as the top of the bottle slice — so
                      the pump's base sits flush on the bottle's
                      shoulder line. */}
                  <AnimatePresence>
                    {showPump && (
                      <div
                        key={`pump-${store.pumpType}`}
                        className="absolute left-0 right-0 flex items-end justify-center"
                        style={{
                          bottom: bottleSlice, // = top of bottle slice
                          height: pumpH,
                          zIndex: 20,
                        }}
                      >
                        <motion.img
                          src={PUMP_IMAGES[store.pumpType]}
                          alt="Pump"
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0, scale }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ type: "spring", stiffness: 120, damping: 20 }}
                          style={{
                            width: BOTTLE_SLOT_W,
                            height: pumpH,
                            display: "block",
                            objectFit: "contain",
                            objectPosition: "center bottom",
                          }}
                          className="drop-shadow-[0_12px_36px_rgba(0,0,0,0.7)]"
                        />
                      </div>
                    )}
                  </AnimatePresence>

                  {/* TOP LAYER (z-30): Cap — anchored directly above the bottle.
                      The cap sits flush on top of the bottle slice (same
                      Y-coordinate as the top of the bottle), with the
                      pump slice above it (when a pump is active). */}
                  <AnimatePresence>
                    {showCap && (
                      <div
                        key={`cap-${store.capStyle}`}
                        className="absolute left-0 right-0 bottom-0"
                        style={{
                          bottom: bottleSlice, // sit flush on top of the bottle
                          height: capH,
                          zIndex: 10,
                        }}
                      >
                        <motion.img
                          src={CAP_IMAGES[store.capStyle]}
                          alt="Cap"
                          initial={{ opacity: 0, y: -25 }}
                          animate={{ opacity: 1, y: 0, scale }}
                          exit={{ opacity: 0, y: -25 }}
                          transition={{ type: "spring", stiffness: 120, damping: 20 }}
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "block",
                            objectFit: "contain",
                            objectPosition: "center bottom",
                            transform: "translateY(20px)",
                          }}
                          className="drop-shadow-[0_18px_48px_rgba(0,0,0,0.8)]"
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}
          </motion.div>
        </div>

        {/* Quality Badging */}
        <div className="absolute bottom-16 flex gap-6 z-10">
          {[
            { icon: ShieldCheck, text: "GMP Certified" },
            { icon: Award, text: "IFRA Compliant" },
            { icon: Layers, text: "Sustainably Sourced" },
          ].map((badge) => (
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

      {/* ================= COLUMN 3: STICKY WHOLESALE PRICING (RIGHT) ================= */}
      <aside className="w-full lg:w-[340px] lg:flex-shrink-0 border-l border-border bg-card/90 backdrop-blur-3xl z-10 flex flex-col h-screen pt-20 justify-between transition-colors duration-300">
        {/* Selection items summaries with specific price markup indicators */}
        <div className="p-6 border-b border-border flex-1 overflow-y-auto scrollbar-hide">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-4">
            Design Specs & Pricing
          </h3>

          <div className="space-y-3.5">
            {[
              {
                label: "Silhouette Shape",
                value: store.bottleSilhouette,
                price: pricing.bottleBase,
              },
              { label: "Glass Material", value: store.bottleMaterial, price: pricing.matPrice },
              { label: "Glass Finishing", value: store.bottleColor, price: pricing.colPrice },
              {
                label: "Cap Style Accent",
                value: (() => {
                  for (const cat of CAP_CATEGORIES) {
                    const v = cat.variants.find((x) => x.id === store.capStyle);
                    if (v) return v.name;
                  }
                  return store.capStyle;
                })(),
                price: pricing.capPrice,
              },
              {
                label: "Pump",
                value: (() => {
                  for (const cat of PUMP_CATEGORIES) {
                    const v = cat.variants.find((x) => x.id === store.pumpType);
                    if (v) return `${cat.name} – ${v.name}`;
                  }
                  return store.pumpType;
                })(),
                price: pricing.pumpPrice,
              },
              {
                label: "Olfactive Fragrance",
                value: store.fragrance.intensity || "Balanced",
                price: pricing.fragranceTotalPrice,
              },
              {
                label: "Outer Box Pack",
                value: store.packaging.type,
                price: pricing.packagingTotalPrice,
              },
            ].map((spec) => (
              <div
                key={spec.label}
                className="flex justify-between items-start text-xs border-b border-border pb-2"
              >
                <div className="space-y-0.5">
                  <div className="text-muted-foreground font-light text-[10px] uppercase tracking-wider">
                    {spec.label}
                  </div>
                  <div className="text-foreground font-medium">{spec.value}</div>
                </div>
                <div className="text-[10px] font-bold text-gold-soft whitespace-nowrap">
                  +{spec.price} SAR
                </div>
              </div>
            ))}
          </div>

          {/* Wholesale B2B parameters */}
          <div className="mt-8 p-4 rounded-xl border border-border bg-secondary/20 space-y-3 flex-shrink-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-4 w-4 text-gold-soft" />
              <span>
                Est. Delivery: <strong className="text-foreground">18 - 24 Days</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-gold-soft" />
              <span>
                Wholesale MOQ: <strong className="text-foreground">100 Units</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic bulk calculator */}
        <div className="p-6 border-t border-border bg-secondary/15 flex-shrink-0">
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
              className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-gold"
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
              <span className="text-xs font-semibold text-foreground">
                {pricing.unitPrice.toFixed(2)} SAR
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xs text-muted-foreground pb-1">Total Estimated wholesale</span>
              <div className="text-right">
                <div className="flex items-baseline justify-end text-gold">
                  <span className="font-display text-2xl font-bold tracking-tight">
                    {pricing.totalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider ml-1 text-gold-soft">
                    SAR
                  </span>
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
              className="w-full py-2.5 rounded-xl border border-border hover:border-gold/30 hover:bg-secondary/40 transition-all text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
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
            <p className="text-xs text-muted-foreground mb-6">
              Enter your contact credentials below. A dedicated corporate AlKhuraiji consultant will
              get back to you with custom wholesale pricing quotes within 24 hours.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setInquiryModalOpen(false);
                setSuccessModalOpen(true);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Representative Name
                </label>
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
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Business Email Address
                </label>
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
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Contact Phone Number
                </label>
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
            <p className="text-xs text-muted-foreground mb-6">
              Your bespoke packaging & fragrance specifications have been logged securely. Sample
              kits will be arranged.
            </p>

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
