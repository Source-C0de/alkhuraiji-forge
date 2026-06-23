import { useBuilderStore } from "@/store/useBuilderStore";
import { useAdminStore } from "@/store/adminStore";
import circleGlass from "@/assets/shape/circle_glass.png";
import cylindricalGlass from "@/assets/shape/cyclindaric_glass.png";
import ovalGlass from "@/assets/shape/oval_glass.png";
import squareGlass from "@/assets/shape/square_glass.png";

const SHAPE_IMAGES: Record<string, string> = {
  Round: circleGlass,
  Cylindrical: cylindricalGlass,
  Oval: ovalGlass,
  Square: squareGlass,
};

export function BottleStep() {
  const store = useBuilderStore();
  const {
    builderBottles,
    builderMaterials,
    builderCapacities,
    builderColors,
    showBottleMaterials,
    showBottleCapacity,
    showBottleColor,
  } = useAdminStore();

  // Silhouettes already driven by the admin store (silhouettes list).
  const activeBottles = builderBottles.filter((b) => b.active);
  const SILHOUETTES = activeBottles.map((b) => b.name);

  // Materials, capacities, and bottle colors are now admin-controlled.
  // Filter to active items, falling back to an empty list if everything is off.
  const materials = builderMaterials.filter((m) => m.active).map((m) => m.name);
  const capacities = builderCapacities.filter((c) => c.active).map((c) => c.name);
  const bottleColors = builderColors.filter((c) => c.active);

  return (
    <div className="space-y-10">
      {showBottleMaterials && (
        <div>
          <h2 className="text-2xl font-display font-semibold mb-4">Material</h2>
          {materials.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {materials.map((mat) => (
                <button
                  key={mat}
                  onClick={() => store.setBottleMaterial(mat)}
                  className={`p-3 rounded-xl border text-sm text-center transition-all duration-300 ${
                    store.bottleMaterial === mat
                      ? "border-primary bg-primary/10 shadow-gold-glow font-medium"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No material options available.</p>
          )}
        </div>
      )}

      <div>
        <h2 className="text-2xl font-display font-semibold mb-4">Silhouette</h2>
        {SILHOUETTES.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {SILHOUETTES.map((sil) => (
              <button
                key={sil}
                onClick={() => store.setBottleSilhouette(sil)}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-3 transition-all duration-300 ${
                  store.bottleSilhouette === sil
                    ? "border-primary bg-primary/10 shadow-gold-glow"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="h-12 w-12 rounded bg-muted/50 border border-border flex items-center justify-center overflow-hidden">
                  {SHAPE_IMAGES[sil] ? (
                    <img
                      src={SHAPE_IMAGES[sil]}
                      alt={sil}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-muted-foreground">{sil}</span>
                  )}
                </div>
                <span className="font-medium text-sm">{sil}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">No bottle silhouettes available.</p>
        )}
      </div>

      {showBottleCapacity && (
        <div>
          <h2 className="text-2xl font-display font-semibold mb-4">Capacity</h2>
          {capacities.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {capacities.map((cap) => (
                <button
                  key={cap}
                  onClick={() => store.setBottleCapacity(cap)}
                  className={`px-5 py-3 rounded-full border text-sm transition-all duration-300 ${
                    store.bottleCapacity === cap
                      ? "border-primary bg-primary text-primary-foreground shadow-gold-glow font-bold"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  {cap}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No capacity options available.</p>
          )}
        </div>
      )}

      {showBottleColor && (
        <div>
          <h2 className="text-2xl font-display font-semibold mb-4">Bottle Color</h2>
          {bottleColors.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {bottleColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => store.setBottleColor(color.name)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${
                    store.bottleColor === color.name
                      ? "border-primary shadow-gold-glow"
                      : "border-transparent hover:bg-muted"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full border border-border shadow-sm"
                    style={{ background: color.hex }}
                  />
                  <span className="text-xs text-center font-medium leading-tight">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No bottle color options available.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
