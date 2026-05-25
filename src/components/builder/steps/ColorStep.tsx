import { useBuilderStore } from "@/store/useBuilderStore";

const BOTTLE_COLORS = [
  { name: "Transparent", hex: "transparent" },
  { name: "Black Frosted", hex: "#222" },
  { name: "Amber", hex: "#b45f06" },
  { name: "Emerald", hex: "#274e13" },
  { name: "Royal Blue", hex: "#0b5394" },
  { name: "Rose Gold", hex: "#b4a7d6" },
  { name: "White Matte", hex: "#f3f4f6" },
  { name: "Gradient Luxe", hex: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)" },
];

export function ColorStep() {
  const bottleColor = useBuilderStore((s) => s.bottleColor);
  const setBottleColor = useBuilderStore((s) => s.setBottleColor);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold">Select Bottle Color</h2>
      <div className="grid grid-cols-4 gap-4">
        {BOTTLE_COLORS.map((color) => (
          <button
            key={color.name}
            onClick={() => setBottleColor(color.name)}
            className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${
              bottleColor === color.name ? "border-primary shadow-gold-glow" : "border-transparent hover:bg-muted"
            }`}
          >
            <div
              className="w-12 h-12 rounded-full border border-border shadow-sm"
              style={{ background: color.hex }}
            />
            <span className="text-xs text-center font-medium">{color.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
