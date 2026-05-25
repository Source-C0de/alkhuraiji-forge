import { useBuilderStore } from "@/store/useBuilderStore";

const CAP_STYLES = [
  "Metallic Gold",
  "Matte Black",
  "Gloss Silver",
  "Wooden Luxury",
  "Crystal Crown",
  "Colored Cap",
];

const PUMP_TYPES = [
  "Standard Spray",
  "Fine Mist",
  "Luxury Atomizer",
  "Oil Roller"
];

const CAP_COLORS = [
  { name: "Transparent", hex: "transparent" },
  { name: "Black Frosted", hex: "#222" },
  { name: "Amber", hex: "#b45f06" },
  { name: "Emerald", hex: "#274e13" },
  { name: "Royal Blue", hex: "#0b5394" },
  { name: "Rose Gold", hex: "#b4a7d6" },
  { name: "White Matte", hex: "#f3f4f6" },
  { name: "Gradient Luxe", hex: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
];

export function CapStep() {
  const store = useBuilderStore();

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl font-display font-semibold mb-4">Select Cap Style</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CAP_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => store.setCapStyle(style)}
              className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                store.capStyle === style
                  ? "border-primary bg-primary/10 shadow-gold-glow font-medium"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <p className="font-medium text-sm">{style}</p>
            </button>
          ))}
        </div>
      </div>

      {store.capStyle === "Colored Cap" && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-xl font-display font-semibold mb-4">Cap Color</h2>
          <div className="grid grid-cols-4 gap-4">
            {CAP_COLORS.map((color) => (
              <button
                key={color.name}
                onClick={() => store.setCapColor(color.name)}
                className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${
                  store.capColor === color.name ? "border-primary shadow-gold-glow" : "border-transparent hover:bg-muted"
                }`}
              >
                <div
                  className="w-10 h-10 rounded-full border border-border shadow-sm"
                  style={{ background: color.hex }}
                />
                <span className="text-[10px] text-center font-medium leading-tight">{color.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-display font-semibold mb-4">Pump Type</h2>
        <div className="grid grid-cols-2 gap-3">
          {PUMP_TYPES.map((pump) => (
            <button
              key={pump}
              onClick={() => store.setPumpType(pump)}
              className={`p-4 rounded-xl border text-center transition-all duration-300 ${
                store.pumpType === pump
                  ? "border-primary bg-primary/10 shadow-gold-glow font-medium"
                  : "border-border bg-card hover:border-primary/50"
              }`}
            >
              <span className="font-medium text-sm">{pump}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
