import { useBuilderStore } from "@/store/useBuilderStore";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import circleGlass from "@/assets/shape/circle_glass.png";
import cylindricalGlass from "@/assets/shape/cyclindaric_glass.png";
import ovalGlass from "@/assets/shape/oval_glass.png";
import squareGlass from "@/assets/shape/square_glass.png";

const getShapeImage = (silhouette: string) => {
  if (silhouette.includes("Round") || silhouette.includes("Circle") || silhouette.includes("Prestige")) return circleGlass;
  if (silhouette.includes("Cylinder") || silhouette.includes("Cylindrical")) return cylindricalGlass;
  if (silhouette.includes("Oval")) return ovalGlass;
  if (silhouette.includes("Square") || silhouette.includes("Cube")) return squareGlass;
  return null;
};

export function BuilderPreview() {
  const state = useBuilderStore();
  const rotateY = useMotionValue(0);

  const shapeImage = getShapeImage(state.bottleSilhouette);

  const handlePan = (e: any, info: any) => {
    rotateY.set(rotateY.get() + info.delta.x * 0.5);
  };

  const getColorHex = (colorName: string) => {
    switch (colorName) {
      case "Black Frosted": return "#222";
      case "Amber": return "#b45f06";
      case "Emerald": return "#274e13";
      case "Royal Blue": return "#0b5394";
      case "Rose Gold": return "#b4a7d6";
      case "White Matte": return "#f3f4f6";
      case "Gradient Luxe": return "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
      default: return "#eab308";
    }
  };

  const getBottleColor = () => getColorHex(state.bottleColor);

  const getCapacityScale = () => {
    switch(state.bottleCapacity) {
      case "10ml": return 0.5;
      case "30ml": return 0.7;
      case "50ml": return 0.85;
      case "75ml": return 0.95;
      case "100ml": return 1;
      case "150ml": return 1.1;
      case "250ml": return 1.25;
      default: return 1;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center p-12">
      {/* Background ambient light */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[500px] h-[500px] rounded-full blur-[100px] opacity-20"
          animate={{
            background: state.bottleColor === "Transparent" ? "#eab308" : getBottleColor()
          }}
          transition={{ duration: 1 }}
        />
      </div>

      <motion.div
        key={`${state.bottleSilhouette}-${state.bottleCapacity}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: getCapacityScale() }}
        transition={{ duration: 0.8, type: "spring" }}
        onPan={handlePan}
        style={{ rotateY, transformStyle: "preserve-3d" }}
        className="relative z-10 w-full max-w-sm aspect-[3/4] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing perspective-1000"
      >
        {/* Shape Image Bottle */}
        {shapeImage ? (
          <motion.img
            key={state.bottleSilhouette}
            src={shapeImage}
            alt={state.bottleSilhouette}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-contain drop-shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
          />
        ) : (
          <div
            className="relative w-48 h-72 border border-border/50 shadow-2xl flex flex-col items-center justify-center text-sm text-muted-foreground"
            style={{
              borderRadius: "16px",
            }}
          >
            {state.bottleSilhouette}
          </div>
        )}

        {/* Label overlay (positioned on top of the bottle image) */}
        <div
          className="absolute top-1/2 left-1/2 w-32 min-h-24 bg-background/90 p-3 flex flex-col items-center justify-center text-center shadow-lg border border-border"
          style={{
            borderRadius: state.label.shape === "Rounded" ? "12px" : "0px",
            height: state.label.shape === "Vertical Strip" ? "80%" : "auto",
            fontFamily: state.label.font === "Elegant Serif" ? "serif" : "sans-serif",
            transform: "translate(-50%, -50%) translateZ(40px)"
          }}
        >
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">EAU DE PARFUM</span>
          <span className="font-display font-bold text-lg leading-tight text-foreground">{state.label.name || "YOUR BRAND"}</span>
          <span className="text-[8px] uppercase tracking-wider text-muted-foreground mt-2">100 ML / 3.4 FL.OZ</span>
        </div>

        {/* Packaging Preview side-by-side (shows on Step 4+) */}
        <AnimatePresence>
          {state.step >= 4 && (
            <motion.div
              initial={{ x: 0, opacity: 0 }}
              animate={{ x: -140, opacity: 1 }}
              exit={{ opacity: 0, x: 0 }}
              className="absolute top-1/2 -translate-y-1/2 w-52 h-80 bg-card border border-border shadow-2xl rounded-sm flex items-center justify-center -z-10"
              style={{
                background: state.packaging.finish === "Matte" ? "#111" : "#f5f5f5",
                color: state.packaging.finish === "Matte" ? "#fff" : "#000"
              }}
            >
              <div className="text-center p-4 border border-current/20 w-4/5 h-4/5 flex flex-col items-center justify-center">
                <span className="font-display text-xl">{state.label.name || "YOUR BRAND"}</span>
                <span className="text-xs uppercase mt-2 opacity-60 tracking-widest">{state.packaging.type}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Floating features text based on step */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-sm text-muted-foreground">
        <p>Interactive 3D Preview</p>
        <p className="text-xs opacity-50 mt-1">Drag to rotate • Real-time rendering</p>
      </div>
    </div>
  );
}
