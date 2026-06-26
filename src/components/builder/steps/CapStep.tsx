import { useBuilderStore } from "@/store/useBuilderStore";
import { useAdminStore } from "@/store/adminStore";

export function CapStep() {
  const store = useBuilderStore();
  const { pumpTypes, showPumpTypes } = useAdminStore();

  // Pump types are admin-controlled. Filter to active items.
  const activePumpTypes = pumpTypes.filter((p) => p.active).map((p) => p.name);

  return (
    <div className="space-y-6">
      {showPumpTypes && (
        <div>
          <h2 className="text-2xl font-display font-semibold mb-2">Pump with Collar</h2>
          <p className="text-xs text-muted-foreground mb-4">
            More cap styles coming soon.
          </p>
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