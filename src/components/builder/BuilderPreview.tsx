import { useBuilderStore } from "@/store/useBuilderStore";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

export function BuilderPreview() {
  const state = useBuilderStore();
  const rotateY = useMotionValue(0);

  const handlePan = (e: any, info: any) => {
    rotateY.set(rotateY.get() + info.delta.x * 0.5);
  };

  const isColorHex = (color: string) => color.startsWith("#") || color.startsWith("linear-gradient");
  const getColorHex = (colorName: string) => {
    switch (colorName) {
      case "Black Frosted": return "#222";
      case "Amber": return "#b45f06";
      case "Emerald": return "#274e13";
      case "Royal Blue": return "#0b5394";
      case "Rose Gold": return "#b4a7d6";
      case "White Matte": return "#f3f4f6";
      case "Gradient Luxe": return "linear-gradient(135deg, #f6d365 0%, #fda085 100%)";
      default: return "transparent";
    }
  };

  const getBottleColor = () => getColorHex(state.bottleColor);

  const getMaterialStyle = () => {
    switch (state.bottleMaterial) {
      case "Glass": return { backdropFilter: "blur(12px)", background: "rgba(255,255,255,0.05)" };
      case "Frosted Glass": return { backdropFilter: "blur(24px)", background: "rgba(255,255,255,0.2)" };
      case "Matte Glass": return { background: "rgba(200,200,200,0.9)", backdropFilter: "none" };
      case "Crystal": return { backdropFilter: "blur(4px)", background: "rgba(255,255,255,0.1)", boxShadow: "inset 0 0 20px rgba(255,255,255,0.5)" };
      case "Plastic": return { backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.02)" };
      case "Recycled": return { backdropFilter: "blur(16px)", background: "rgba(200,230,200,0.15)" };
      default: return {};
    }
  };

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
        {/* Placeholder for 3D Bottle */}
        <div className="relative w-48 h-72 border border-border/50 shadow-2xl flex flex-col items-center"
          style={{
            ...getMaterialStyle(),
            background: state.bottleColor === "Transparent" ? getMaterialStyle().background : getBottleColor(),
            borderRadius: state.bottleSilhouette === "Round" ? "100px" : state.bottleSilhouette === "Oval" ? "100px 100px 120px 120px" : state.bottleSilhouette === "Square" ? "8px" : state.bottleSilhouette === "Cylindrical" ? "30px" : "16px",
            transformStyle: "preserve-3d",
            transition: "all 0.5s ease"
          }}
        >
          {/* Bottle Neck (visible when cap is off) */}
          {state.step < 2 && (
            <div className="absolute -top-6 left-1/2 w-8 h-6 rounded-t-sm z-0"
              style={{
                 background: state.bottleColor === "Transparent" ? getMaterialStyle().background : getBottleColor(),
                 transform: "translateX(-50%)",
                 ...getMaterialStyle()
              }}
            />
          )}

          {/* Pump Mechanism */}
          {state.step >= 2 && (
            <div className="absolute -top-4 left-1/2 w-6 h-6 z-10 shadow-md"
              style={{
                 background: state.pumpType === "Standard Spray" ? "#ccc" : 
                             state.pumpType === "Luxury Atomizer" ? "linear-gradient(to right, #bf953f, #fcf6ba)" : 
                             state.pumpType === "Fine Mist" ? "#e0e0e0" : "#333",
                 borderRadius: state.pumpType === "Oil Roller" ? "50%" : "4px 4px 0 0",
                 transform: "translateX(-50%) translateZ(8px)"
              }}
            >
              {state.pumpType === "Luxury Atomizer" && (
                <div className="absolute top-1/2 -right-8 w-10 h-10 rounded-full border-2 border-[#bf953f] bg-primary/20 backdrop-blur-sm transform -translate-y-1/2 z-0" />
              )}
              {state.pumpType === "Standard Spray" && (
                <div className="absolute top-0 right-0 w-3 h-2 bg-[#999] transform translate-x-full rounded-r-full" />
              )}
              {state.pumpType === "Fine Mist" && (
                <div className="absolute top-0 right-0 w-2 h-1.5 bg-[#bbb] transform translate-x-full rounded-r-full" />
              )}
            </div>
          )}

          {/* Cap */}
          {state.step >= 2 && (
            <div className={`absolute -top-14 left-1/2 w-14 h-14 z-20 transition-all duration-300 ${state.capStyle === 'Minimal Flat Cap' ? 'h-6 -top-6' : 'h-14'}`}
              style={{
                background: state.capStyle === "Metallic Gold" ? "linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7)" :
                  state.capStyle === "Matte Black" ? "#111" :
                    state.capStyle === "Gloss Silver" ? "linear-gradient(to right, #e0e0e0, #ffffff, #e0e0e0)" :
                      state.capStyle === "Wooden Luxury" ? "#8B5A2B" :
                        state.capStyle === "Crystal Crown" ? "rgba(255,255,255,0.2)" :
                          state.capStyle === "Colored Cap" ? getColorHex(state.capColor) : "#888",
                backdropFilter: state.capStyle === "Crystal Crown" ? "blur(10px)" : "none",
                border: state.capStyle === "Crystal Crown" ? "1px solid rgba(255,255,255,0.4)" : "none",
                boxShadow: state.capStyle === "Crystal Crown" ? "inset 0 0 10px rgba(255,255,255,0.5)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                borderRadius: state.capStyle === "Crystal Crown" ? "16px" : state.capStyle === "Wooden Luxury" ? "4px" : "8px 8px 0 0",
                transform: "translateX(-50%) translateZ(12px)"
              }}
            />
          )}

          {/* Label */}
          <div className="absolute top-1/2 left-1/2 w-32 min-h-24 bg-background/90 p-3 flex flex-col items-center justify-center text-center shadow-lg border border-border"
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

          {/* Glass Reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none rounded-[inherit]" style={{ transform: "translateZ(1px)" }} />
        </div>

        {/* Packaging Preview side-by-side (shows on Step 4+) */}
        <AnimatePresence>
          {state.step >= 4 && (
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: -160, opacity: 1 }}
              exit={{ opacity: 0 }}
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
        <p>Interactive 3D Preview (Placeholder)</p>
        <p className="text-xs opacity-50 mt-1">Drag to rotate • Real-time rendering</p>
      </div>
    </div>
  );
}
