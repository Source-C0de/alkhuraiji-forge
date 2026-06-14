import { useBuilderStore } from "@/store/useBuilderStore";
import { motion, AnimatePresence } from "framer-motion";

// Base placeholder (wireframe stage + bottle silhouette mask)
import baseImg from "@/assets/shape/base.png";

// Bottle shape images (predefined silhouettes)
import circleGlass from "@/assets/shape/circle_glass.png";
import cylindricalGlass from "@/assets/shape/cyclindaric_glass.png";
import ovalGlass from "@/assets/shape/oval_glass.png";
import squareGlass from "@/assets/shape/square_glass.png";

// Cap images
import capKingCap from "@/assets/caps/king_cap.jpg";
import capUvMagnet from "@/assets/caps/weed_square_cap.jpg"; // was: uv_magnet_black1_xl_cap.jpg (missing - using dark cap as fallback)
import capParis from "@/assets/caps/paris_round_cap.jpg";
import capLiga from "@/assets/caps/liga_cylinder_cap.jpg";
import capNobel from "@/assets/caps/nobel_cylinder_cap.jpg";
import capGlob from "@/assets/caps/glob_oval_cap.jpg";
import capKano from "@/assets/caps/kano_cap.jpg";
import capPrism from "@/assets/caps/prism_square_cap.jpg";
import capTopDesen from "@/assets/caps/top_desen_konsept_m_cap.jpg";
import capWBall from "@/assets/caps/kano_cap.jpg"; // was: w_ball_cap.jpg (missing - using kano_cap as fallback)
import capWeed from "@/assets/caps/weed_square_cap.jpg";

// Pump images
import pumpBlackPwc from "@/assets/pumps/black_pwc.jpg";
import pumpBlackPwtc from "@/assets/pumps/black_pwtc.jpg";
import pumpBlackSc from "@/assets/pumps/black_sc.jpg";
import pumpGoldPwc from "@/assets/pumps/gold_pwc.jpg";
import pumpGoldPwtc from "@/assets/pumps/gold_pwtc.jpg";
import pumpGoldSc from "@/assets/pumps/gold_sc.jpg";
import pumpRosePwc from "@/assets/pumps/rose_pwc.jpg";
import pumpRosePwtc from "@/assets/pumps/rose_pwtc.jpg";
import pumpSilverPwc from "@/assets/pumps/silver_pwc.jpg";
import pumpSilverPwtc from "@/assets/pumps/silver_pwtc.jpg";
import pumpSilverSc from "@/assets/pumps/silver_sc.jpg";

// --- Shape mapping ---
const SHAPE_MAP: Record<string, string> = {
  Round: circleGlass,
  Circle: circleGlass,
  Prestige: circleGlass,
  Cylinder: cylindricalGlass,
  Cylindrical: cylindricalGlass,
  Oval: ovalGlass,
  Square: squareGlass,
  Cube: squareGlass,
};

// --- Cap mapping ---
const CAP_MAP: Record<string, string> = {
  "Metallic Gold": capKingCap,
  "Matte Black": capUvMagnet,
  "Gloss Silver": capParis,
  "Wooden Luxury": capNobel,
  "Crystal Crown": capWBall,
  "Colored Cap": capKano,
  // fallback below
};

// --- Pump mapping ---
const PUMP_MAP: Record<string, string> = {
  "Standard Spray": pumpBlackPwc,
  "Fine Mist": pumpBlackPwtc,
  "Luxury Atomizer": pumpGoldPwc,
  "Oil Roller": pumpSilverSc,
};

const getShapeImage = (silhouette: string): string | null => {
  for (const [key, img] of Object.entries(SHAPE_MAP)) {
    if (silhouette.includes(key)) return img;
  }
  return null;
};

export function BuilderPreview() {
  const state = useBuilderStore();

  const shapeImage = getShapeImage(state.bottleSilhouette);
  const capImage = state.capStyle ? (CAP_MAP[state.capStyle] || capUvMagnet) : null;
  const pumpImage = state.pumpType ? (PUMP_MAP[state.pumpType] || pumpBlackPwc) : null;

  // Determine what's on top: cap or pump (mutually exclusive in store)
  const topImage = capImage || pumpImage;
  const topType = capImage ? "cap" : pumpImage ? "pump" : null;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* ===== 600x700 Fixed Preview Canvas ===== */}
      <div
        className="relative flex-shrink-0"
        style={{ width: 600, height: 700 }}
      >
        {/* Layer 0: Base wireframe placeholder — always visible as background */}
        <img
          src={baseImg}
          alt="Base placeholder"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none opacity-40"
          draggable={false}
        />

        {/* Layer 1: Fixed Bottle Placeholder — normalized container that matches the
            bottle area inside base.png. Every dynamic bottle image (predefined silhouette
            OR admin upload) is rendered with object-fit: contain, which guarantees:
              • same displayed height & width bounds for all images
              • centered horizontally & vertically
              • aspect ratio preserved (no stretch, no distortion)
              • tall images auto-shrink to height, wide images auto-shrink to width
            The base.png wireframe (Layer 0) sits behind/over this and acts as the visual frame. */}
        <AnimatePresence mode="wait">
          {shapeImage && (
            <motion.img
              key={shapeImage}
              src={shapeImage}
              alt={state.bottleSilhouette}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              draggable={false}
              className="absolute pointer-events-none select-none"
              style={{
                zIndex: 5,
                // Fixed container that exactly matches the bottle area in base.png
                top: "18%",
                left: "50%",
                transform: "translateX(-50%)",
                width: "55%",
                height: "62%",
                // Auto-fit logic: contain = scale down so the whole image fits inside
                // the container while preserving the original aspect ratio. Centered.
                objectFit: "contain",
                objectPosition: "center center",
              }}
            />
          )}
        </AnimatePresence>

        {/* Layer 2: Cap or Pump — sits on the bottle neck */}
        <AnimatePresence mode="wait">
          {topImage && (
            <motion.img
              key={topImage}
              src={topImage}
              alt={topType === "cap" ? "Cap" : "Pump"}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              draggable={false}
              className="absolute pointer-events-none select-none mix-blend-multiply"
              style={{
                // Position cap/pump at the neck of the bottle
                // The bottle container starts at top: 18% and the bottle's
                // visible neck is roughly 7% into that container (~25% of canvas).
                // The cap image has internal whitespace, so we push the cap
                // container down so its bottom edge meets the bottle's neck.
                // Cap sits flush on the bottle neck
                top: topType === "cap" ? "7%" : "9%",

                left: "50%",
                transform: "translateX(-50%)",
                width: topType === "cap" ? "20%" : "16%",
                height: topType === "cap" ? "18%" : "16%",
                objectFit: "contain",
                objectPosition: "center bottom",
                zIndex: 20,
              }}
            />
          )}
        </AnimatePresence>

        {/* Layer 3: Label overlay — sits on the bottle body center */}
        <div
          className="absolute z-30 bg-background/90 p-3 flex flex-col items-center justify-center text-center shadow-lg border border-border"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 130,
            minHeight: 96,
            borderRadius: state.label.shape === "Rounded" ? "12px" : "0px",
            fontFamily: state.label.font === "Elegant Serif" ? "serif" : "sans-serif",
          }}
        >
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
            EAU DE PARFUM
          </span>
          <span className="font-display font-bold text-lg leading-tight text-foreground">
            {state.label.name || "YOUR BRAND"}
          </span>
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground mt-2">
            100 ML / 3.4 FL.OZ
          </span>
        </div>

        {/* Layer 4: Packaging box preview — shows on Step 4+ */}
        <AnimatePresence>
          {state.step >= 4 && (
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, x: 60 }}
              className="absolute top-1/2 -translate-y-1/2 right-0 w-40 h-64 bg-card border border-border shadow-2xl rounded-sm flex items-center justify-center z-10"
              style={{
                background:
                  state.packaging.finish === "Matte" ? "#111" : "#f5f5f5",
                color:
                  state.packaging.finish === "Matte" ? "#fff" : "#000",
              }}
            >
              <div className="text-center p-3 border border-current/20 w-4/5 h-4/5 flex flex-col items-center justify-center">
                <span className="font-display text-base">
                  {state.label.name || "YOUR BRAND"}
                </span>
                <span className="text-[10px] uppercase mt-2 opacity-60 tracking-widest">
                  {state.packaging.type}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
