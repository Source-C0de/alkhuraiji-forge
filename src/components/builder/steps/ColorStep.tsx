import { useBuilderStore } from "@/store/useBuilderStore";
import { useAdminStore } from "@/store/adminStore";

export function ColorStep() {
  const bottleColor = useBuilderStore((s) => s.bottleColor);
  const setBottleColor = useBuilderStore((s) => s.setBottleColor);
  const { builderColors, showBottleColor } = useAdminStore();

  // Whole-section hidden — return null so the step collapses entirely.
  if (!showBottleColor) return null;

  const activeColors = builderColors.filter((c) => c.active);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold">Select Bottle Color</h2>
      {activeColors.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {activeColors.map((color) => (
            <button
              key={color.id}
              onClick={() => setBottleColor(color.name)}
              className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${
                bottleColor === color.name
                  ? "border-primary shadow-gold-glow"
                  : "border-transparent hover:bg-muted"
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
      ) : (
        <p className="text-xs text-muted-foreground italic">No bottle color options available.</p>
      )}
    </div>
  );
}
