import { useBuilderStore } from "@/store/useBuilderStore";
import { useAdminStore } from "@/store/adminStore";

export function CapStep() {
  const store = useBuilderStore();
  const { capStyles, pumpTypes, capColors, showCapStyles, showPumpTypes, showCapColor } =
    useAdminStore();

  // All three option lists are now admin-controlled. Filter to active items.
  const activeCapStyles = capStyles.filter((s) => s.active).map((s) => s.name);
  const activePumpTypes = pumpTypes.filter((p) => p.active).map((p) => p.name);
  const activeCapColors = capColors.filter((c) => c.active);

  return (
    <div className="space-y-10">
      {showCapStyles && (
        <div>
          <h2 className="text-2xl font-display font-semibold mb-4">Select Cap Style</h2>
          {activeCapStyles.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {activeCapStyles.map((style) => (
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
          ) : (
            <p className="text-xs text-muted-foreground italic">No cap style options available.</p>
          )}
        </div>
      )}

      {showCapColor && store.capStyle === "Colored Cap" && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-xl font-display font-semibold mb-4">Cap Color</h2>
          {activeCapColors.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {activeCapColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => store.setCapColor(color.name)}
                  className={`flex flex-col items-center gap-2 p-2 rounded-lg border transition-all ${
                    store.capColor === color.name
                      ? "border-primary shadow-gold-glow"
                      : "border-transparent hover:bg-muted"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full border border-border shadow-sm"
                    style={{ background: color.hex }}
                  />
                  <span className="text-[10px] text-center font-medium leading-tight">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">No cap color options available.</p>
          )}
        </div>
      )}

      {showPumpTypes && (
        <div>
          <h2 className="text-2xl font-display font-semibold mb-4">Pump Type</h2>
          {activePumpTypes.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {activePumpTypes.map((pump) => (
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
          ) : (
            <p className="text-xs text-muted-foreground italic">No pump type options available.</p>
          )}
        </div>
      )}
    </div>
  );
}
