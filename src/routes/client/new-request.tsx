import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sparkles, ChevronRight, ChevronLeft, Check, Upload,
  Send, RotateCcw, FlaskConical, Layers, Plus, X,
  Droplets, Star, Palette, Package, ArrowRight,
} from "lucide-react";
import { useClientStore } from "@/store/clientStore";

export const Route = createFileRoute("/client/new-request")({
  component: NewRequest,
});

// ─── Constants ───────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: "Category" },
  { id: 2, label: "Details" },
  { id: 3, label: "Builder" },
  { id: 4, label: "Assets" },
  { id: 5, label: "Review" },
];

// Fragrance Notes Data
const TOP_NOTES = ["Bergamot", "Lemon", "Grapefruit", "Lime", "Mandarin", "Black Pepper", "Cardamom", "Pink Pepper", "Aldehydes", "Green Tea"];
const HEART_NOTES = ["Rose", "Jasmine", "Oud", "Iris", "Neroli", "Ylang Ylang", "Geranium", "Tuberose", "Violet", "Peony"];
const BASE_NOTES = ["Musk", "Amber", "Sandalwood", "Patchouli", "Vetiver", "Cedarwood", "Vanilla", "Benzoin", "Labdanum", "Oakmoss"];

const FRAG_FAMILIES = ["Oriental", "Floral", "Woody", "Fresh", "Chypre", "Gourmand", "Aquatic", "Fougère"];
const CONCENTRATIONS = [
  { id: "attar", label: "Attar / Pure Oil", desc: "100% — Alcohol-free" },
  { id: "parfum", label: "Parfum", desc: "20–30% — Strongest" },
  { id: "edp", label: "Eau de Parfum", desc: "15–20% — Long lasting" },
  { id: "edt", label: "Eau de Toilette", desc: "5–15% — Moderate" },
  { id: "edc", label: "Eau de Cologne", desc: "2–4% — Light & fresh" },
];

const BOTTLE_SHAPES = ["Round", "Square", "Rectangular", "Oval", "Cylindrical", "Faceted", "Tapered", "Asymmetric"];
const BOTTLE_MATERIALS = ["Clear Glass", "Frosted Glass", "Colored Glass", "Crystal", "Acrylic", "Metal Clad"];
const BOTTLE_COLORS = [
  { id: "clear", label: "Clear", hex: "rgba(200,230,255,0.3)" },
  { id: "amber", label: "Amber", hex: "rgba(180,110,30,0.75)" },
  { id: "cobalt", label: "Cobalt", hex: "rgba(25,55,180,0.75)" },
  { id: "black", label: "Matte Black", hex: "rgba(18,18,18,0.95)" },
  { id: "blush", label: "Blush Pink", hex: "rgba(225,160,160,0.7)" },
  { id: "emerald", label: "Emerald", hex: "rgba(15,130,80,0.75)" },
  { id: "smoke", label: "Smoke Grey", hex: "rgba(100,110,120,0.7)" },
  { id: "gold-tint", label: "Champagne", hex: "rgba(210,185,120,0.65)" },
];
const CAP_STYLES = [
  { id: "flatgold", label: "Flat Gold", color: "#C9A84C" },
  { id: "silver", label: "Rounded Silver", color: "#C0C0C0" },
  { id: "wooden", label: "Wooden", color: "#8B6914" },
  { id: "crystal", label: "Crystal", color: "rgba(200,230,255,0.6)" },
  { id: "magnetic", label: "Magnetic", color: "#555" },
  { id: "tapered", label: "Tapered Black", color: "#222" },
];
const ATOMIZER_TYPES = ["Classic Spray", "Bulb Atomizer", "Pump Spray", "Roll-on", "Reed Diffuser", "Splash Bottle"];
const LABEL_STYLES = ["Embossed", "Printed", "Engraved", "Hot Stamp Gold", "No Label"];
const BOX_TYPES = ["Rigid Gift Box", "Sleeve Box", "Drawer Box", "Eco Kraft", "Magnetic Closure Box", "No Box"];
const PERF_VOLUMES = ["5ml", "10ml", "30ml", "50ml", "75ml", "100ml", "150ml", "200ml", "Custom"];

// Cosmetics Data
const COSMETIC_TYPES = [
  { id: "lip", label: "Lip Products", icon: "💄", desc: "Lipstick, gloss, liner, balm" },
  { id: "eye", label: "Eye Products", icon: "👁️", desc: "Mascara, eyeshadow, liner, brow" },
  { id: "face", label: "Face Products", icon: "✨", desc: "Foundation, concealer, blush, contour" },
  { id: "skin", label: "Skincare", icon: "🌿", desc: "Serum, moisturizer, mask, SPF" },
  { id: "body", label: "Body Care", icon: "🧴", desc: "Lotion, scrub, oil, mist" },
  { id: "nail", label: "Nail Products", icon: "💅", desc: "Polish, gel, treatment, art" },
];

const LIP_SUBTYPES = ["Lipstick", "Lip Gloss", "Lip Liner", "Lip Balm", "Lip Tint", "Lip Plumper", "Lip Stain", "Lip Oil"];
const EYE_SUBTYPES = ["Mascara", "Eyeshadow Palette", "Eyeliner", "Eyebrow Pencil", "Eye Primer", "Setting Spray", "Eyelash Serum"];
const FACE_SUBTYPES = ["Foundation", "Concealer", "Blush", "Bronzer", "Highlighter", "Setting Powder", "Face Primer", "BB/CC Cream"];
const SKIN_SUBTYPES = ["Serum", "Moisturizer", "Face Mask", "Toner", "SPF/Sunscreen", "Eye Cream", "Exfoliant", "Cleansing Oil"];
const BODY_SUBTYPES = ["Body Lotion", "Body Butter", "Body Scrub", "Body Oil", "Body Mist", "Hand Cream", "Foot Cream"];
const NAIL_SUBTYPES = ["Nail Polish", "Gel Polish", "Base Coat", "Top Coat", "Nail Treatment", "Cuticle Oil"];

const FORMULA_TYPES = ["Liquid", "Cream", "Powder", "Gel", "Stick", "Foam", "Serum", "Oil", "Balm", "Whip"];
const FINISHES = ["Matte", "Satin", "Glossy", "Metallic", "Shimmer", "Glitter", "Natural", "Dewy", "Velvet"];
const COVERAGE = ["Sheer", "Light", "Medium", "Full", "Buildable"];
const SKIN_TYPES = ["All Skin Types", "Dry Skin", "Oily Skin", "Combination", "Sensitive", "Mature Skin"];
const CERTIFICATIONS = ["Vegan", "Cruelty-Free", "Halal", "Organic", "Paraben-Free", "Sulfate-Free", "Dermatologist Tested"];

const SHADE_PALETTE = [
  { id: "nude1", label: "Porcelain", hex: "#F4E4D0" },
  { id: "nude2", label: "Ivory", hex: "#EDD9B8" },
  { id: "nude3", label: "Sand", hex: "#D4B896" },
  { id: "nude4", label: "Caramel", hex: "#C09670" },
  { id: "nude5", label: "Toffee", hex: "#A07850" },
  { id: "nude6", label: "Espresso", hex: "#7A5030" },
  { id: "rose1", label: "Baby Rose", hex: "#F4A8B0" },
  { id: "rose2", label: "Dusty Rose", hex: "#D98090" },
  { id: "rose3", label: "Berry Rose", hex: "#C05070" },
  { id: "red1", label: "Classic Red", hex: "#D43040" },
  { id: "red2", label: "Cherry", hex: "#B01830" },
  { id: "red3", label: "Wine", hex: "#802030" },
  { id: "pink1", label: "Coral Pink", hex: "#F08070" },
  { id: "pink2", label: "Hot Pink", hex: "#E0509A" },
  { id: "mauve1", label: "Mauve", hex: "#B08090" },
  { id: "brown1", label: "Cocoa", hex: "#905838" },
  { id: "plum1", label: "Plum", hex: "#703060" },
  { id: "bold1", label: "Burgundy", hex: "#601828" },
  { id: "neutral1", label: "Brick", hex: "#A04030" },
  { id: "neutral2", label: "Terracotta", hex: "#C06848" },
  { id: "gold1", label: "Gold Rush", hex: "#C9A84C" },
  { id: "brown2", label: "Chestnut", hex: "#784020" },
  { id: "dark1", label: "Oxblood", hex: "#501018" },
  { id: "dark2", label: "Noir", hex: "#1A0A10" },
];

const COSMETIC_VOLUMES = ["3.5g", "5ml", "10ml", "15ml", "30ml", "50ml", "100ml", "Custom"];

// ─── SVG Preview Components ───────────────────────────────────────────────────

function PerfumeBottlePreview({ shape, colorHex, capColor, atomizer }: {
  shape: string;
  colorHex: string;
  capColor: string;
  atomizer: string;
}) {
  const rx = shape === "Round" ? 40 : shape === "Oval" ? 30 : shape === "Faceted" ? 0 : shape === "Tapered" ? 14 : 6;
  const isWide = shape === "Rectangular" || shape === "Oval";
  const bw = isWide ? 88 : 68;

  return (
    <motion.svg
      key={`${shape}-${colorHex}-${capColor}`}
      viewBox="0 0 160 260"
      className="w-full h-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        <radialGradient id="bottleGrad" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="black" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="capGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="0.3" />
          <stop offset="100%" stopColor="black" stopOpacity="0.1" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0,0,0,0.5)" />
        </filter>
      </defs>

      {/* Shadow */}
      <ellipse cx="80" cy="252" rx="34" ry="6" fill="rgba(0,0,0,0.3)" />

      {/* Bottle body */}
      <rect
        x={(160 - bw) / 2}
        y={110}
        width={bw}
        height={132}
        rx={rx}
        ry={rx}
        fill={colorHex}
        filter="url(#shadow)"
      />
      <rect
        x={(160 - bw) / 2}
        y={110}
        width={bw}
        height={132}
        rx={rx}
        ry={rx}
        fill="url(#bottleGrad)"
      />
      {/* Shine streak */}
      <rect
        x={(160 - bw) / 2 + 8}
        y={118}
        width={10}
        height={110}
        rx={5}
        fill="white"
        opacity={0.1}
      />

      {/* Neck */}
      <rect x="70" y="88" width="20" height="26" rx="4" fill={colorHex} />
      <rect x="70" y="88" width="20" height="26" rx="4" fill="url(#bottleGrad)" />

      {/* Cap */}
      <rect x="58" y="52" width="44" height="40" rx={rx > 20 ? 22 : 8} fill={capColor} filter="url(#glow)" />
      <rect x="58" y="52" width="44" height="40" rx={rx > 20 ? 22 : 8} fill="url(#capGrad)" />

      {/* Atomizer nozzle (if spray) */}
      {(atomizer === "Classic Spray" || atomizer === "Pump Spray") && (
        <>
          <rect x="88" y="36" width="6" height="20" rx="3" fill={capColor} />
          <ellipse cx="97" cy="36" rx="5" ry="4" fill={capColor} />
        </>
      )}
      {atomizer === "Bulb Atomizer" && (
        <ellipse cx="108" cy="52" rx="14" ry="10" fill={capColor} opacity="0.8" />
      )}

      {/* Label */}
      <rect x={(160 - bw) / 2 + 10} y={148} width={bw - 20} height={52} rx="3" fill="white" opacity={0.08} />
    </motion.svg>
  );
}

function CosmeticsPreview({ cosmeticType, subType, selectedShades, finish }: {
  cosmeticType: string;
  subType: string;
  selectedShades: string[];
  finish: string;
}) {
  const isLip = cosmeticType === "lip";
  const isFace = cosmeticType === "face";
  const primaryShade = selectedShades[0] ? SHADE_PALETTE.find(s => s.id === selectedShades[0])?.hex ?? "#D98090" : "#D98090";
  const secondaryShade = selectedShades[1] ? SHADE_PALETTE.find(s => s.id === selectedShades[1])?.hex ?? "#C05070" : "#C05070";
  const allShades = selectedShades.slice(0, 6).map(id => SHADE_PALETTE.find(s => s.id === id)?.hex ?? "#aaa");

  if (isLip && (subType === "Lipstick" || !subType)) {
    // Lipstick preview
    return (
      <motion.svg
        viewBox="0 0 160 260"
        className="w-full h-full"
        key={`${primaryShade}-${finish}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <defs>
          <linearGradient id="tubeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.12" />
            <stop offset="100%" stopColor="black" stopOpacity="0.12" />
          </linearGradient>
          <filter id="shadow2"><feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="rgba(0,0,0,0.5)" /></filter>
        </defs>
        <ellipse cx="80" cy="254" rx="26" ry="5" fill="rgba(0,0,0,0.3)" />

        {/* Tube body */}
        <rect x="60" y="130" width="40" height="118" rx="6" fill="#1A1A1A" filter="url(#shadow2)" />
        <rect x="60" y="130" width="40" height="118" rx="6" fill="url(#tubeGrad)" />
        {/* Gold band */}
        <rect x="60" y="168" width="40" height="6" fill="#C9A84C" />

        {/* Bullet holder */}
        <rect x="62" y="108" width="36" height="26" rx="4" fill="#222" />

        {/* Lipstick bullet */}
        <rect x="66" y="68" width="28" height="44" rx="4" fill={primaryShade} />
        {/* Angled tip */}
        <polygon points="66,68 94,68 80,52" fill={secondaryShade} />
        <rect x="66" y="68" width="28" height="44" rx="4" fill="url(#tubeGrad)" />
        {/* Shine */}
        <rect x="70" y="70" width="6" height="36" rx="3" fill="white" opacity={finish === "Glossy" ? 0.25 : 0.08} />
      </motion.svg>
    );
  }

  if (cosmeticType === "eye" || subType?.includes("Palette") || subType === "Eyeshadow Palette") {
    // Palette preview
    return (
      <motion.svg
        viewBox="0 0 220 160"
        className="w-full h-auto"
        key={JSON.stringify(selectedShades)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <defs>
          <filter id="palShadow"><feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.5)" /></filter>
        </defs>
        {/* Compact body */}
        <rect x="10" y="10" width="200" height="140" rx="12" fill="#1A1A1A" filter="url(#palShadow)" />
        <rect x="10" y="10" width="200" height="140" rx="12" fill="#C9A84C" opacity={0.04} />
        {/* Gold rim */}
        <rect x="10" y="10" width="200" height="140" rx="12" fill="none" stroke="#C9A84C" strokeWidth="1.5" opacity={0.3} />
        {/* Shade pans in 3x2 grid */}
        {[0,1,2,3,4,5].map((i) => {
          const col = i % 3;
          const row = Math.floor(i / 3);
          const shade = allShades[i] ?? "#333";
          return (
            <g key={i}>
              <circle cx={48 + col * 56} cy={54 + row * 56} r={22} fill={shade} />
              <circle cx={48 + col * 56} cy={54 + row * 56} r={22} fill="white" opacity={0.07} />
            </g>
          );
        })}
      </motion.svg>
    );
  }

  if (isFace) {
    // Foundation bottle preview
    return (
      <motion.svg
        viewBox="0 0 160 260"
        className="w-full h-full"
        key={`${primaryShade}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <defs>
          <linearGradient id="foundGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="black" stopOpacity="0.08" />
          </linearGradient>
          <filter id="foundShadow"><feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0,0,0,0.5)" /></filter>
        </defs>
        <ellipse cx="80" cy="254" rx="30" ry="5" fill="rgba(0,0,0,0.3)" />
        {/* Body */}
        <rect x="50" y="90" width="60" height="154" rx="8" fill={primaryShade} filter="url(#foundShadow)" />
        <rect x="50" y="90" width="60" height="154" rx="8" fill="url(#foundGrad)" />
        {/* Pump head */}
        <rect x="70" y="60" width="20" height="34" rx="6" fill="#1A1A1A" />
        <rect x="78" y="50" width="6" height="14" rx="3" fill="#C9A84C" />
        <ellipse cx="81" cy="50" rx="7" ry="5" fill="#C9A84C" />
        {/* Label area */}
        <rect x="58" y="130" width="44" height="70" rx="4" fill="white" opacity={0.08} />
        {/* Shine */}
        <rect x="56" y="96" width="8" height="130" rx="4" fill="white" opacity={0.07} />
      </motion.svg>
    );
  }

  // Generic jar / tube for skin / body
  return (
    <motion.svg
      viewBox="0 0 160 200"
      className="w-full h-auto"
      key={`${primaryShade}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <defs>
        <filter id="jarShadow"><feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0,0,0,0.5)" /></filter>
        <linearGradient id="jarGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="black" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="192" rx="42" ry="6" fill="rgba(0,0,0,0.3)" />
      {/* Jar body */}
      <rect x="28" y="94" width="104" height="90" rx="10" fill={primaryShade} filter="url(#jarShadow)" />
      <rect x="28" y="94" width="104" height="90" rx="10" fill="url(#jarGrad)" />
      {/* Lid */}
      <rect x="24" y="72" width="112" height="26" rx="10" fill="#1A1A1A" />
      <rect x="24" y="72" width="112" height="26" rx="10" fill="url(#jarGrad)" />
      {/* Gold rim */}
      <rect x="24" y="94" width="112" height="4" rx="0" fill="#C9A84C" opacity={0.5} />
      {/* Label */}
      <rect x="38" y="118" width="84" height="44" rx="4" fill="white" opacity={0.08} />
    </motion.svg>
  );
}

// ─── Shared UI Helpers ────────────────────────────────────────────────────────

function PillChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
        selected
          ? "bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#C9A84C]"
          : "bg-white/[0.03] border-white/[0.06] text-white/50 hover:border-white/20 hover:text-white/80"
      }`}
    >
      {selected && <span className="mr-1">✓</span>}
      {label}
    </motion.button>
  );
}

function OptionChip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border text-left ${
        selected
          ? "bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]"
          : "bg-white/[0.03] border-white/[0.06] text-white/50 hover:border-white/[0.15] hover:text-white/80"
      }`}
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-2">{children}</p>;
}

function FieldInput({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/20 text-sm transition-all"
      />
    </div>
  );
}

// ─── Step 1: Category ─────────────────────────────────────────────────────────

const MAIN_CATEGORIES = [
  {
    id: "perfume",
    label: "Perfume & Fragrance",
    icon: "🌹",
    desc: "Custom perfumes, attars, body sprays, and luxury fragrances",
    gradient: "from-[#C9A84C]/20 via-[#8B4513]/10 to-transparent",
    border: "border-[#C9A84C]/30",
    accent: "#C9A84C",
    tags: ["Attar", "EDP", "EDT", "Body Mist", "Cologne"],
  },
  {
    id: "cosmetics",
    label: "Cosmetics & Beauty",
    icon: "💄",
    desc: "Lip, eye, face, skin and body cosmetic formulations",
    gradient: "from-[#E05090]/20 via-[#901050]/10 to-transparent",
    border: "border-[#E05090]/30",
    accent: "#E05090",
    tags: ["Lipstick", "Foundation", "Serum", "Eyeshadow", "Body Lotion"],
  },
];

const OTHER_CATEGORIES = [
  { id: "hair_oil", label: "Hair Care", icon: "💧", desc: "Oils, serums, treatments" },
  { id: "packaging", label: "Custom Packaging", icon: "📦", desc: "Boxes, bags, gift sets" },
  { id: "private_label", label: "Private Label", icon: "🏷️", desc: "Ready formulas, rebranded" },
  { id: "other", label: "Other", icon: "⭐", desc: "Discuss with our team" },
];

function Step1({ draft, update }: { draft: any; update: (d: any) => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">What would you like to create?</h2>
        <p className="text-white/40 text-sm">Choose your primary product category to get started</p>
      </div>

      {/* Main categories — large hero cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MAIN_CATEGORIES.map((cat) => {
          const isSelected = draft.category === cat.id;
          return (
            <motion.button
              key={cat.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => update({ category: cat.id })}
              className={`relative p-6 rounded-2xl border text-left transition-all overflow-hidden ${
                isSelected ? `${cat.border} bg-gradient-to-br ${cat.gradient}` : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="main-cat-active"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse at 20% 20%, ${cat.accent}18, transparent 70%)` }}
                />
              )}
              {/* Check badge */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 h-6 w-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: cat.accent }}
                >
                  <Check className="h-3.5 w-3.5 text-black" />
                </motion.div>
              )}
              <span className="text-4xl block mb-4">{cat.icon}</span>
              <p className="font-bold text-white text-lg mb-1">{cat.label}</p>
              <p className="text-sm text-white/45 mb-4">{cat.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {cat.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/[0.08] text-white/35 bg-white/[0.03]">
                    {tag}
                  </span>
                ))}
              </div>
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-1.5 mt-4 text-xs font-semibold"
                  style={{ color: cat.accent }}
                >
                  <ArrowRight className="h-3.5 w-3.5" /> Selected — continue to details
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Other categories — smaller chips */}
      <div>
        <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-3">Other Categories</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {OTHER_CATEGORIES.map((cat) => {
            const isSelected = draft.category === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => update({ category: cat.id })}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-white/30 bg-white/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
                }`}
              >
                <span className="text-xl block mb-2">{cat.icon}</span>
                <p className="text-xs font-semibold text-white">{cat.label}</p>
                <p className="text-[10px] text-white/35 mt-0.5">{cat.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Details ──────────────────────────────────────────────────────────

function Step2Perfume({ draft, update }: { draft: any; update: (d: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🌹</span>
          <h2 className="text-2xl font-bold text-white">Perfume Details</h2>
        </div>
        <p className="text-white/40 text-sm">Define your fragrance vision and commercial specifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldInput label="Product Name" value={draft.name ?? ""} onChange={(v) => update({ name: v })} placeholder="e.g. Oud Noir Elixir" />
        <FieldInput label="Brand Name" value={draft.brand ?? ""} onChange={(v) => update({ brand: v })} placeholder="e.g. Lumière Parfums" />
        <FieldInput label="Target Market" value={draft.market ?? ""} onChange={(v) => update({ market: v })} placeholder="e.g. GCC, Europe, Global" />
        <FieldInput label="Intended Audience" value={draft.audience ?? ""} onChange={(v) => update({ audience: v })} placeholder="e.g. Luxury women 25–45" />
        <FieldInput label="Initial Quantity (MOQ)" value={draft.quantity ?? ""} onChange={(v) => update({ quantity: v })} placeholder="e.g. 1,000 units" />
        <FieldInput label="Target Retail Price" value={draft.price ?? ""} onChange={(v) => update({ price: v })} placeholder="e.g. $50–80 USD" />
      </div>

      {/* Fragrance Family */}
      <div>
        <SectionLabel>Fragrance Family</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {FRAG_FAMILIES.map((f) => (
            <OptionChip key={f} label={f} selected={draft.fragFamily === f} onClick={() => update({ fragFamily: f })} />
          ))}
        </div>
      </div>

      {/* Concentration */}
      <div>
        <SectionLabel>Concentration Type</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CONCENTRATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => update({ concentration: c.id })}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                draft.concentration === c.id
                  ? "border-[#C9A84C]/50 bg-[#C9A84C]/10"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14]"
              }`}
            >
              <p className={`text-sm font-semibold ${draft.concentration === c.id ? "text-[#C9A84C]" : "text-white"}`}>{c.label}</p>
              <p className="text-[11px] text-white/35 mt-0.5">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Volume */}
      <div>
        <SectionLabel>Bottle Volume(s)</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {PERF_VOLUMES.map((v) => {
            const sel = (draft.volumes ?? []).includes(v);
            return (
              <button
                key={v}
                onClick={() => {
                  const curr: string[] = draft.volumes ?? [];
                  update({ volumes: sel ? curr.filter((x: string) => x !== v) : [...curr, v] });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                  sel ? "bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]" : "bg-white/[0.03] border-white/[0.07] text-white/50 hover:border-white/20"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notes textarea */}
      <div>
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Additional Requirements</label>
        <textarea
          value={draft.notes ?? ""}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Describe any specific requirements, inspirations, or reference fragrances..."
          rows={3}
          className="w-full mt-1.5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/20 text-sm transition-all resize-none"
        />
      </div>
    </div>
  );
}

function Step2Cosmetics({ draft, update }: { draft: any; update: (d: any) => void }) {
  const subtypeMap: Record<string, string[]> = {
    lip: LIP_SUBTYPES, eye: EYE_SUBTYPES, face: FACE_SUBTYPES,
    skin: SKIN_SUBTYPES, body: BODY_SUBTYPES, nail: NAIL_SUBTYPES,
  };
  const subtypes = draft.cosmeticType ? subtypeMap[draft.cosmeticType] ?? [] : [];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">💄</span>
          <h2 className="text-2xl font-bold text-white">Cosmetics Details</h2>
        </div>
        <p className="text-white/40 text-sm">Define your cosmetic product category and specifications</p>
      </div>

      {/* Cosmetic Category */}
      <div>
        <SectionLabel>Product Category</SectionLabel>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {COSMETIC_TYPES.map((t) => (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => update({ cosmeticType: t.id, cosmeticSubType: "" })}
              className={`p-4 rounded-xl border text-left transition-all ${
                draft.cosmeticType === t.id
                  ? "border-[#E05090]/40 bg-[#E05090]/10"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14]"
              }`}
            >
              <span className="text-2xl block mb-2">{t.icon}</span>
              <p className={`text-sm font-semibold ${draft.cosmeticType === t.id ? "text-[#E05090]" : "text-white"}`}>{t.label}</p>
              <p className="text-[10px] text-white/35 mt-0.5">{t.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Sub-type */}
      {subtypes.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <SectionLabel>Product Type</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {subtypes.map((s) => (
              <OptionChip key={s} label={s} selected={draft.cosmeticSubType === s} onClick={() => update({ cosmeticSubType: s })} />
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldInput label="Product Name" value={draft.name ?? ""} onChange={(v) => update({ name: v })} placeholder="e.g. Velvet Rose Lipstick" />
        <FieldInput label="Brand Name" value={draft.brand ?? ""} onChange={(v) => update({ brand: v })} placeholder="e.g. Lumière Beauty" />
        <FieldInput label="Target Market" value={draft.market ?? ""} onChange={(v) => update({ market: v })} placeholder="e.g. GCC, US, Europe" />
        <FieldInput label="Intended Audience" value={draft.audience ?? ""} onChange={(v) => update({ audience: v })} placeholder="e.g. Women 18–35" />
        <FieldInput label="Initial Quantity (MOQ)" value={draft.quantity ?? ""} onChange={(v) => update({ quantity: v })} placeholder="e.g. 5,000 units" />
        <FieldInput label="Target Retail Price" value={draft.price ?? ""} onChange={(v) => update({ price: v })} placeholder="e.g. $15–25 USD" />
      </div>

      {/* Certifications */}
      <div>
        <SectionLabel>Required Certifications</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {CERTIFICATIONS.map((c) => {
            const sel = (draft.certifications ?? []).includes(c);
            return (
              <PillChip key={c} label={c} selected={sel} onClick={() => {
                const curr: string[] = draft.certifications ?? [];
                update({ certifications: sel ? curr.filter((x: string) => x !== c) : [...curr, c] });
              }} />
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Additional Requirements</label>
        <textarea
          value={draft.notes ?? ""}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Describe your product vision, reference products, or any special requirements..."
          rows={3}
          className="w-full mt-1.5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/20 text-sm transition-all resize-none"
        />
      </div>
    </div>
  );
}

function Step2Other({ draft, update }: { draft: any; update: (d: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Product Details</h2>
        <p className="text-white/40 text-sm">Tell us about your product vision</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FieldInput label="Product Name" value={draft.name ?? ""} onChange={(v) => update({ name: v })} placeholder="e.g. Argan Hair Serum" />
        <FieldInput label="Brand Name" value={draft.brand ?? ""} onChange={(v) => update({ brand: v })} placeholder="e.g. My Brand" />
        <FieldInput label="Target Market" value={draft.market ?? ""} onChange={(v) => update({ market: v })} placeholder="e.g. GCC, Global" />
        <FieldInput label="Intended Audience" value={draft.audience ?? ""} onChange={(v) => update({ audience: v })} placeholder="e.g. All ages" />
        <FieldInput label="Initial Quantity (MOQ)" value={draft.quantity ?? ""} onChange={(v) => update({ quantity: v })} placeholder="e.g. 1,000 units" />
        <FieldInput label="Target Retail Price" value={draft.price ?? ""} onChange={(v) => update({ price: v })} placeholder="e.g. $20–40 USD" />
      </div>
      <div>
        <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Additional Requirements</label>
        <textarea
          value={draft.notes ?? ""}
          onChange={(e) => update({ notes: e.target.value })}
          placeholder="Describe your product requirements in detail..."
          rows={4}
          className="w-full mt-1.5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/20 text-sm transition-all resize-none"
        />
      </div>
    </div>
  );
}

function Step2({ draft, update }: { draft: any; update: (d: any) => void }) {
  if (draft.category === "perfume") return <Step2Perfume draft={draft} update={update} />;
  if (draft.category === "cosmetics") return <Step2Cosmetics draft={draft} update={update} />;
  return <Step2Other draft={draft} update={update} />;
}

// ─── Step 3: Builder ──────────────────────────────────────────────────────────

function NoteSelector({ title, notes, selected, onToggle, color }: {
  title: string; notes: string[]; selected: string[]; onToggle: (n: string) => void; color: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
        <SectionLabel>{title}</SectionLabel>
        {selected.length > 0 && (
          <span className="text-[10px] text-white/30 ml-auto">{selected.length} selected</span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {notes.map((n) => (
          <PillChip key={n} label={n} selected={selected.includes(n)} onClick={() => onToggle(n)} />
        ))}
      </div>
    </div>
  );
}

function Step3Perfume({ draft, update }: { draft: any; update: (d: any) => void }) {
  const toggle = (field: string, val: string) => {
    const curr: string[] = draft[field] ?? [];
    update({ [field]: curr.includes(val) ? curr.filter((x: string) => x !== val) : [...curr, val] });
  };

  const selectedColor = BOTTLE_COLORS.find(c => c.id === (draft.bottleColor ?? "clear"));
  const selectedCap = CAP_STYLES.find(c => c.id === (draft.capStyle ?? "flatgold"));

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FlaskConical className="h-5 w-5 text-[#C9A84C]" />
          <h2 className="text-2xl font-bold text-white">Fragrance Builder</h2>
        </div>
        <p className="text-white/40 text-sm">Compose your scent profile and configure bottle design</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Formula & Bottle Config */}
        <div className="lg:col-span-3 space-y-6">
          {/* Fragrance Notes */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 space-y-5">
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <Droplets className="h-4 w-4 text-[#C9A84C]" /> Fragrance Notes Composition
            </p>
            <NoteSelector title="Top Notes — First Impression" notes={TOP_NOTES} selected={draft.topNotes ?? []} onToggle={(n) => toggle("topNotes", n)} color="#F4D03F" />
            <NoteSelector title="Heart Notes — Core Character" notes={HEART_NOTES} selected={draft.heartNotes ?? []} onToggle={(n) => toggle("heartNotes", n)} color="#E05090" />
            <NoteSelector title="Base Notes — Lasting Sillage" notes={BASE_NOTES} selected={draft.baseNotes ?? []} onToggle={(n) => toggle("baseNotes", n)} color="#C9A84C" />
          </div>

          {/* Bottle Design */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 space-y-5">
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <Package className="h-4 w-4 text-[#C9A84C]" /> Bottle & Packaging Design
            </p>

            <div>
              <SectionLabel>Bottle Shape</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {BOTTLE_SHAPES.map((s) => (
                  <OptionChip key={s} label={s} selected={draft.bottleShape === s} onClick={() => update({ bottleShape: s })} />
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Bottle Material</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {BOTTLE_MATERIALS.map((m) => (
                  <OptionChip key={m} label={m} selected={draft.bottleMaterial === m} onClick={() => update({ bottleMaterial: m })} />
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Bottle Color</SectionLabel>
              <div className="flex flex-wrap gap-2.5">
                {BOTTLE_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => update({ bottleColor: c.id })}
                    title={c.label}
                    className={`relative flex flex-col items-center gap-1 group`}
                  >
                    <div
                      className={`h-9 w-9 rounded-full border-2 transition-all ${draft.bottleColor === c.id ? "border-[#C9A84C] scale-110" : "border-white/10 hover:border-white/30"}`}
                      style={{ backgroundColor: c.hex, backdropFilter: "blur(4px)" }}
                    />
                    {draft.bottleColor === c.id && (
                      <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#C9A84C] flex items-center justify-center">
                        <Check className="h-2 w-2 text-black" />
                      </div>
                    )}
                    <span className="text-[9px] text-white/30 group-hover:text-white/50 transition-colors max-w-[52px] text-center leading-tight">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Cap Style</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {CAP_STYLES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => update({ capStyle: c.id })}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      draft.capStyle === c.id ? "border-[#C9A84C]/40 bg-[#C9A84C]/10 text-[#C9A84C]" : "border-white/[0.07] bg-white/[0.02] text-white/50 hover:border-white/20"
                    }`}
                  >
                    <div className="h-4 w-4 rounded-sm" style={{ backgroundColor: c.color }} />
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Atomizer / Dispenser</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {ATOMIZER_TYPES.map((a) => (
                  <OptionChip key={a} label={a} selected={draft.atomizer === a} onClick={() => update({ atomizer: a })} />
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Label Style</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {LABEL_STYLES.map((l) => (
                  <OptionChip key={l} label={l} selected={draft.labelStyle === l} onClick={() => update({ labelStyle: l })} />
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Box / Outer Packaging</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {BOX_TYPES.map((b) => (
                  <OptionChip key={b} label={b} selected={draft.boxPackaging === b} onClick={() => update({ boxPackaging: b })} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-[#C9A84C]" />
              <span className="text-xs font-semibold text-[#C9A84C] uppercase tracking-widest">Live Preview</span>
            </div>

            <div className="h-56 flex items-center justify-center">
              <PerfumeBottlePreview
                shape={draft.bottleShape ?? "Round"}
                colorHex={selectedColor?.hex ?? "rgba(200,220,255,0.35)"}
                capColor={selectedCap?.color ?? "#C9A84C"}
                atomizer={draft.atomizer ?? "Classic Spray"}
              />
            </div>

            {/* Scent pyramid */}
            {((draft.topNotes?.length ?? 0) + (draft.heartNotes?.length ?? 0) + (draft.baseNotes?.length ?? 0)) > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-[10px] text-white/30 uppercase tracking-widest">Scent Pyramid</p>
                {draft.topNotes?.length > 0 && (
                  <div className="text-[11px] flex gap-2">
                    <span className="text-yellow-400/70 font-medium w-12 flex-shrink-0">Top</span>
                    <span className="text-white/60">{draft.topNotes.join(", ")}</span>
                  </div>
                )}
                {draft.heartNotes?.length > 0 && (
                  <div className="text-[11px] flex gap-2">
                    <span className="text-pink-400/70 font-medium w-12 flex-shrink-0">Heart</span>
                    <span className="text-white/60">{draft.heartNotes.join(", ")}</span>
                  </div>
                )}
                {draft.baseNotes?.length > 0 && (
                  <div className="text-[11px] flex gap-2">
                    <span className="text-[#C9A84C]/70 font-medium w-12 flex-shrink-0">Base</span>
                    <span className="text-white/60">{draft.baseNotes.join(", ")}</span>
                  </div>
                )}
              </div>
            )}

            {/* Config summary */}
            <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4">
              {[
                ["Shape", draft.bottleShape],
                ["Color", selectedColor?.label],
                ["Cap", selectedCap?.label],
                ["Label", draft.labelStyle],
                ["Box", draft.boxPackaging],
              ].map(([k, v]) => v ? (
                <div key={k} className="flex justify-between text-[11px]">
                  <span className="text-white/30">{k}</span>
                  <span className="text-white/70 font-medium">{v}</span>
                </div>
              ) : null)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3Cosmetics({ draft, update }: { draft: any; update: (d: any) => void }) {
  const toggleShade = (id: string) => {
    const curr: string[] = draft.selectedShades ?? [];
    update({ selectedShades: curr.includes(id) ? curr.filter((x: string) => x !== id) : [...curr, id] });
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Palette className="h-5 w-5 text-[#E05090]" />
          <h2 className="text-2xl font-bold text-white">Cosmetics Builder</h2>
        </div>
        <p className="text-white/40 text-sm">Select shade range, formula type, and packaging configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left config */}
        <div className="lg:col-span-3 space-y-5">

          {/* Shade Palette */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white flex items-center gap-2">
                <Palette className="h-4 w-4 text-[#E05090]" /> Shade Palette Selection
              </p>
              {(draft.selectedShades?.length ?? 0) > 0 && (
                <span className="text-xs text-[#E05090] font-medium">{draft.selectedShades.length} shades selected</span>
              )}
            </div>
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {SHADE_PALETTE.map((shade) => {
                const selected = (draft.selectedShades ?? []).includes(shade.id);
                return (
                  <button
                    key={shade.id}
                    onClick={() => toggleShade(shade.id)}
                    title={shade.label}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div
                      className={`h-8 w-8 rounded-full border-2 transition-all relative ${
                        selected ? "border-white scale-110" : "border-transparent hover:border-white/30"
                      }`}
                      style={{ backgroundColor: shade.hex }}
                    >
                      {selected && (
                        <div className="absolute inset-0 rounded-full flex items-center justify-center">
                          <Check className="h-3 w-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] text-white/25 group-hover:text-white/50 transition-colors text-center leading-tight hidden sm:block">{shade.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-white/25 mt-3">Click shades to add them to your product range. Select multiple for a collection.</p>
          </div>

          {/* Formula */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 space-y-5">
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <FlaskConical className="h-4 w-4 text-[#E05090]" /> Formula Configuration
            </p>

            <div>
              <SectionLabel>Formula Type</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {FORMULA_TYPES.map((f) => (
                  <OptionChip key={f} label={f} selected={draft.formulaType === f} onClick={() => update({ formulaType: f })} />
                ))}
              </div>
            </div>

            <div>
              <SectionLabel>Finish</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {FINISHES.map((f) => (
                  <OptionChip key={f} label={f} selected={draft.finish === f} onClick={() => update({ finish: f })} />
                ))}
              </div>
            </div>

            {(draft.cosmeticType === "face" || draft.cosmeticType === "skin") && (
              <>
                <div>
                  <SectionLabel>Coverage Level</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {COVERAGE.map((c) => (
                      <OptionChip key={c} label={c} selected={draft.coverage === c} onClick={() => update({ coverage: c })} />
                    ))}
                  </div>
                </div>
                <div>
                  <SectionLabel>Target Skin Type</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {SKIN_TYPES.map((s) => (
                      <OptionChip key={s} label={s} selected={draft.skinType === s} onClick={() => update({ skinType: s })} />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Packaging */}
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 space-y-4">
            <p className="text-sm font-semibold text-white flex items-center gap-2">
              <Package className="h-4 w-4 text-[#E05090]" /> Packaging
            </p>
            <div>
              <SectionLabel>Volume / Size</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {COSMETIC_VOLUMES.map((v) => (
                  <OptionChip key={v} label={v} selected={draft.cosmeticVolume === v} onClick={() => update({ cosmeticVolume: v })} />
                ))}
              </div>
            </div>
            <div>
              <SectionLabel>Outer Packaging</SectionLabel>
              <div className="flex flex-wrap gap-2">
                {BOX_TYPES.map((b) => (
                  <OptionChip key={b} label={b} selected={draft.boxPackaging === b} onClick={() => update({ boxPackaging: b })} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Preview */}
        <div className="lg:col-span-2">
          <div className="sticky top-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent border border-white/[0.08] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-4 w-4 text-[#E05090]" />
              <span className="text-xs font-semibold text-[#E05090] uppercase tracking-widest">Live Preview</span>
            </div>

            <div className="flex items-center justify-center min-h-44">
              <CosmeticsPreview
                cosmeticType={draft.cosmeticType ?? "lip"}
                subType={draft.cosmeticSubType ?? "Lipstick"}
                selectedShades={draft.selectedShades ?? []}
                finish={draft.finish ?? "Matte"}
              />
            </div>

            {/* Selected shades swatch row */}
            {(draft.selectedShades?.length ?? 0) > 0 && (
              <div className="mt-4">
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Selected Shades</p>
                <div className="flex flex-wrap gap-1.5">
                  {draft.selectedShades.slice(0, 10).map((id: string) => {
                    const shade = SHADE_PALETTE.find(s => s.id === id);
                    return shade ? (
                      <div
                        key={id}
                        className="h-6 w-6 rounded-full border border-white/20 flex-shrink-0"
                        style={{ backgroundColor: shade.hex }}
                        title={shade.label}
                      />
                    ) : null;
                  })}
                  {draft.selectedShades.length > 10 && (
                    <div className="h-6 w-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[9px] text-white/50 font-bold">
                      +{draft.selectedShades.length - 10}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Config summary */}
            <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4">
              {[
                ["Formula", draft.formulaType],
                ["Finish", draft.finish],
                ["Coverage", draft.coverage],
                ["Volume", draft.cosmeticVolume],
                ["Box", draft.boxPackaging],
              ].map(([k, v]) => v ? (
                <div key={k} className="flex justify-between text-[11px]">
                  <span className="text-white/30">{k}</span>
                  <span className="text-white/70 font-medium">{v}</span>
                </div>
              ) : null)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step3Generic({ draft, update }: { draft: any; update: (d: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Product Configuration</h2>
        <p className="text-white/40 text-sm">Provide packaging and formula preferences</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div>
            <SectionLabel>Packaging Type</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {BOX_TYPES.map((b) => <OptionChip key={b} label={b} selected={draft.boxPackaging === b} onClick={() => update({ boxPackaging: b })} />)}
            </div>
          </div>
          <div>
            <SectionLabel>Formula Type</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {FORMULA_TYPES.slice(0, 6).map((f) => <OptionChip key={f} label={f} selected={draft.formulaType === f} onClick={() => update({ formulaType: f })} />)}
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Detailed Specifications</label>
          <textarea
            value={draft.specs ?? ""}
            onChange={(e) => update({ specs: e.target.value })}
            placeholder="Describe packaging materials, sizes, special requirements..."
            rows={8}
            className="w-full mt-1.5 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/20 text-sm transition-all resize-none"
          />
        </div>
      </div>
    </div>
  );
}

function Step3({ draft, update }: { draft: any; update: (d: any) => void }) {
  if (draft.category === "perfume") return <Step3Perfume draft={draft} update={update} />;
  if (draft.category === "cosmetics") return <Step3Cosmetics draft={draft} update={update} />;
  return <Step3Generic draft={draft} update={update} />;
}

// ─── Step 4: Assets ───────────────────────────────────────────────────────────

const UPLOAD_SLOTS = [
  { key: "logo", label: "Brand Logo", hint: "SVG, AI, EPS, PNG — Max 20MB", icon: "🎨" },
  { key: "designRef", label: "Design References", hint: "Images, PDF, Mood board — Max 50MB", icon: "🖼️" },
  { key: "packagingRef", label: "Packaging Inspiration", hint: "Photos, screenshots, sketches", icon: "📦" },
  { key: "formula", label: "Formula / Brief", hint: "PDF, DOCX — Ingredient requirements", icon: "📋" },
  { key: "brandGuide", label: "Brand Guidelines", hint: "Colors, fonts, style guide PDF", icon: "📐" },
  { key: "competitor", label: "Competitor References", hint: "Products you love or want to differentiate from", icon: "🔍" },
];

function Step4({ draft, update }: { draft: any; update: (d: any) => void }) {
  const [draggingKey, setDraggingKey] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Upload Brand Assets</h2>
        <p className="text-white/40 text-sm">Share your brand files, references and formula requirements — all fields are optional</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {UPLOAD_SLOTS.map((slot) => {
          const isDragging = draggingKey === slot.key;
          const hasFile = !!draft[slot.key];
          return (
            <div
              key={slot.key}
              onDragOver={(e) => { e.preventDefault(); setDraggingKey(slot.key); }}
              onDragLeave={() => setDraggingKey(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDraggingKey(null);
                update({ [slot.key]: e.dataTransfer.files[0]?.name ?? "File uploaded" });
              }}
              className={`relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-[#C9A84C]/60 bg-[#C9A84C]/8 scale-[1.02]"
                  : hasFile
                  ? "border-emerald-400/30 bg-emerald-400/5"
                  : "border-white/[0.08] hover:border-white/[0.2] bg-white/[0.01]"
              }`}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => update({ [slot.key]: e.target.files?.[0]?.name ?? "File uploaded" })}
              />
              <div className="flex flex-col items-center gap-2.5 pointer-events-none">
                {hasFile ? (
                  <>
                    <div className="h-10 w-10 rounded-full bg-emerald-400/15 flex items-center justify-center">
                      <Check className="h-5 w-5 text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-emerald-400">Uploaded</p>
                    <p className="text-[11px] text-white/30 truncate max-w-[160px]">{draft[slot.key]}</p>
                    <button
                      className="pointer-events-auto mt-1 text-[10px] text-white/25 hover:text-red-400 transition-colors flex items-center gap-1"
                      onClick={(e) => { e.stopPropagation(); update({ [slot.key]: undefined }); }}
                    >
                      <X className="h-3 w-3" /> Remove
                    </button>
                  </>
                ) : (
                  <>
                    <div className="h-10 w-10 rounded-full bg-white/[0.04] flex items-center justify-center text-2xl">
                      {slot.icon}
                    </div>
                    <p className="text-sm font-medium text-white/70">{slot.label}</p>
                    <p className="text-[11px] text-white/30">{slot.hint}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Upload className="h-3.5 w-3.5 text-white/25" />
                      <p className="text-[10px] text-white/25">Drag & drop or click</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
        <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Pantone / Color References</p>
        <input
          value={draft.pantone ?? ""}
          onChange={(e) => update({ pantone: e.target.value })}
          placeholder="e.g. PMS 872 C (Gold), PMS 100 C (Cream) — Add any Pantone codes for your brand colors"
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/20 text-sm transition-all"
        />
      </div>
    </div>
  );
}

// ─── Step 5: Review ───────────────────────────────────────────────────────────

function ReviewSection({ title, icon, items }: { title: string; icon: React.ReactNode; items: [string, any][] }) {
  const filtered = items.filter(([, v]) => v && (Array.isArray(v) ? v.length > 0 : true));
  if (filtered.length === 0) return null;
  return (
    <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-2.5">
        {filtered.map(([k, v]) => (
          <div key={k} className="flex justify-between text-sm gap-3">
            <span className="text-white/35 flex-shrink-0">{k}</span>
            <span className="text-white/80 font-medium text-right">
              {Array.isArray(v) ? v.join(", ") : String(v)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step5({ draft }: { draft: any }) {
  const catObj = [...MAIN_CATEGORIES, ...OTHER_CATEGORIES].find(c => c.id === draft.category);
  const selectedColor = BOTTLE_COLORS.find(c => c.id === draft.bottleColor);
  const selectedCap = CAP_STYLES.find(c => c.id === draft.capStyle);
  const uploadedCount = UPLOAD_SLOTS.filter(s => draft[s.key]).length;
  const shade = (draft.selectedShades ?? []).map((id: string) => SHADE_PALETTE.find(s => s.id === id)?.label ?? id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Review & Submit</h2>
        <p className="text-white/40 text-sm">Review all details before submitting to the production team</p>
      </div>

      {/* Summary header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#C9A84C]/10 to-transparent border border-[#C9A84C]/20 p-5 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-[#C9A84C]/15 flex items-center justify-center text-2xl flex-shrink-0">
          {catObj?.icon ?? "📋"}
        </div>
        <div>
          <p className="font-bold text-white text-lg">{draft.name || "Unnamed Product"}</p>
          <p className="text-sm text-white/50">{catObj?.label ?? draft.category} • {draft.brand ?? "—"} • Qty: {draft.quantity ?? "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ReviewSection
          title="Product Details"
          icon={<Layers className="h-3.5 w-3.5 text-[#C9A84C]" />}
          items={[
            ["Category", catObj?.label ?? draft.category],
            ["Product Name", draft.name],
            ["Brand", draft.brand],
            ["Market", draft.market],
            ["Audience", draft.audience],
            ["Quantity", draft.quantity],
            ["Retail Price", draft.price],
          ]}
        />

        {draft.category === "perfume" && (
          <ReviewSection
            title="Fragrance Profile"
            icon={<Droplets className="h-3.5 w-3.5 text-[#C9A84C]" />}
            items={[
              ["Family", draft.fragFamily],
              ["Concentration", CONCENTRATIONS.find(c => c.id === draft.concentration)?.label ?? draft.concentration],
              ["Volumes", (draft.volumes ?? []).join(", ")],
              ["Top Notes", draft.topNotes],
              ["Heart Notes", draft.heartNotes],
              ["Base Notes", draft.baseNotes],
            ]}
          />
        )}

        {draft.category === "cosmetics" && (
          <ReviewSection
            title="Formula & Shades"
            icon={<Palette className="h-3.5 w-3.5 text-[#C9A84C]" />}
            items={[
              ["Type", draft.cosmeticType],
              ["Sub-type", draft.cosmeticSubType],
              ["Formula", draft.formulaType],
              ["Finish", draft.finish],
              ["Coverage", draft.coverage],
              ["Shades", shade.length > 0 ? `${shade.length} shades` : undefined],
              ["Certifications", (draft.certifications ?? []).join(", ")],
            ]}
          />
        )}

        <ReviewSection
          title="Packaging & Design"
          icon={<Package className="h-3.5 w-3.5 text-[#C9A84C]" />}
          items={[
            ["Bottle Shape", draft.bottleShape],
            ["Material", draft.bottleMaterial],
            ["Color", selectedColor?.label ?? draft.bottleColor],
            ["Cap Style", selectedCap?.label ?? draft.capStyle],
            ["Label", draft.labelStyle],
            ["Box", draft.boxPackaging],
            ["Atomizer", draft.atomizer],
          ]}
        />

        <ReviewSection
          title="Brand Assets"
          icon={<Upload className="h-3.5 w-3.5 text-[#C9A84C]" />}
          items={[
            ["Logo", draft.logo ? `✓ ${draft.logo}` : undefined],
            ["Design Ref", draft.designRef ? `✓ ${draft.designRef}` : undefined],
            ["Packaging Ref", draft.packagingRef ? `✓ ${draft.packagingRef}` : undefined],
            ["Formula Brief", draft.formula ? `✓ ${draft.formula}` : undefined],
            ["Brand Guide", draft.brandGuide ? `✓ ${draft.brandGuide}` : undefined],
            ["Pantone Refs", draft.pantone],
          ]}
        />
      </div>

      {/* Notes */}
      {draft.notes && (
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
          <h3 className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wider mb-2">Additional Requirements</h3>
          <p className="text-sm text-white/60">{draft.notes}</p>
        </div>
      )}

      {/* Submit CTA */}
      <div className="rounded-2xl bg-[#C9A84C]/8 border border-[#C9A84C]/20 p-5 flex gap-3">
        <Sparkles className="h-5 w-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-white">Ready to submit your request</p>
          <p className="text-[12px] text-white/40 mt-1">
            Your dedicated project manager will review this request within 24 hours and reach out to confirm details, timeline, and next steps.
            {uploadedCount > 0 && ` ${uploadedCount} asset${uploadedCount > 1 ? "s" : ""} attached.`}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ name }: { name?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-sm"
      >
        {/* Animated rings */}
        <div className="relative h-24 w-24 mx-auto mb-6">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ delay: 0.4, duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border-2 border-emerald-400"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1.3, opacity: 0 }}
            transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
            className="absolute inset-0 rounded-full border border-emerald-400"
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 16 }}
            className="h-24 w-24 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center"
          >
            <Check className="h-12 w-12 text-emerald-400" />
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
          <p className="text-white/40 text-sm leading-relaxed">
            {name ? <><span className="text-white/60 font-medium">{name}</span> has been submitted. </> : "Your product request has been submitted. "}
            Your project manager will contact you within 24 hours.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-white/30">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Redirecting to your projects…
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function NewRequest() {
  const { requestStep, setRequestStep, requestDraft, updateRequestDraft, resetRequest, setActiveSection, submitProductRequest } = useClientStore();
  const [submitted, setSubmitted] = useState(false);

  const canNext = () => {
    if (requestStep === 1) return !!requestDraft.category;
    if (requestStep === 2) {
      if (requestDraft.category === "cosmetics") return !!(requestDraft.name && requestDraft.quantity && requestDraft.cosmeticType);
      return !!(requestDraft.name && requestDraft.quantity);
    }
    return true;
  };

  const handleSubmit = () => {
    submitProductRequest(requestDraft);
    setSubmitted(true);
    setTimeout(() => {
      resetRequest();
      setActiveSection("my-projects");
    }, 3000);
  };

  if (submitted) {
    return <SuccessScreen name={requestDraft.name as string | undefined} />;
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-9 w-9 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
            <Plus className="h-4.5 w-4.5 text-[#C9A84C]" style={{ width: 18, height: 18 }} />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">New Product Request</h1>
        </div>
        <p className="text-white/40 text-sm ml-12">Complete the wizard to submit your manufacturing request to our team</p>
      </div>

      {/* Step Progress */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((step, i) => {
          const isCompleted = step.id < requestStep;
          const isActive = step.id === requestStep;
          return (
            <div key={step.id} className="flex items-center flex-1 last:flex-none">
              <button
                onClick={() => isCompleted && setRequestStep(step.id)}
                className={`flex items-center gap-2.5 ${isCompleted ? "cursor-pointer" : "cursor-default"}`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all flex-shrink-0 ${
                  isCompleted ? "bg-[#C9A84C] border-[#C9A84C] text-black" :
                  isActive ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10 shadow-[0_0_16px_rgba(201,168,76,0.3)]" :
                  "border-white/[0.1] text-white/25 bg-transparent"
                }`}>
                  {isCompleted ? <Check className="h-4 w-4" /> : step.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  isActive ? "text-white" : isCompleted ? "text-white/55" : "text-white/20"
                }`}>
                  {step.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-px mx-3 bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isCompleted ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full bg-gradient-to-r from-[#C9A84C]/60 to-[#C9A84C]/30 origin-left"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content Card */}
      <div className="rounded-2xl bg-[#0D0D0D] border border-white/[0.06] p-6 md:p-8 min-h-[400px] relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#C9A84C]/[0.03] rounded-full blur-3xl pointer-events-none" />
        <AnimatePresence mode="wait">
          <motion.div
            key={requestStep}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10"
          >
            {requestStep === 1 && <Step1 draft={requestDraft} update={updateRequestDraft} />}
            {requestStep === 2 && <Step2 draft={requestDraft} update={updateRequestDraft} />}
            {requestStep === 3 && <Step3 draft={requestDraft} update={updateRequestDraft} />}
            {requestStep === 4 && <Step4 draft={requestDraft} update={updateRequestDraft} />}
            {requestStep === 5 && <Step5 draft={requestDraft} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Bar */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-2">
          {requestStep > 1 && (
            <motion.button
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setRequestStep(requestStep - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/70 font-medium text-sm transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </motion.button>
          )}
          <button
            onClick={resetRequest}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white/25 hover:text-white/50 font-medium text-sm transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>

        {/* Step indicator on mobile */}
        <span className="text-xs text-white/25 sm:hidden">Step {requestStep} / {STEPS.length}</span>

        {requestStep < 5 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => canNext() && setRequestStep(requestStep + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] text-black font-bold text-sm transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)] hover:shadow-[0_4px_28px_rgba(201,168,76,0.45)] disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] text-black font-bold text-sm transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)] hover:shadow-[0_4px_28px_rgba(201,168,76,0.45)]"
          >
            <Send className="h-4 w-4" /> Submit Request
          </motion.button>
        )}
      </div>
    </div>
  );
}
