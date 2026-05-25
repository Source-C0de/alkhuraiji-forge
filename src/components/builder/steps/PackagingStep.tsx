import { useBuilderStore } from "@/store/useBuilderStore";

const BOX_TYPES = ["Standard Box", "Magnetic Luxury Box", "Drawer Style Box", "Premium Rigid Box"];
const FINISHES = ["Matte", "Gloss", "Soft Touch", "Velvet Finish"];
const ADDONS = ["Foil Stamping", "Embossing", "Spot UV", "Ribbon Wrap"];

export function PackagingStep() {
  const packaging = useBuilderStore((s) => s.packaging);
  const updatePackaging = useBuilderStore((s) => s.updatePackaging);

  const toggleAddon = (addon: string) => {
    const current = packaging.addons;
    if (current.includes(addon)) {
      updatePackaging({ addons: current.filter((a) => a !== addon) });
    } else {
      updatePackaging({ addons: [...current, addon] });
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-semibold">Design Outer Packaging</h2>
      
      <div className="space-y-3">
        <label className="text-sm font-medium">Box Type</label>
        <div className="grid grid-cols-2 gap-3">
          {BOX_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => updatePackaging({ type })}
              className={`p-3 rounded-md border text-sm transition-all ${
                packaging.type === type ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Finish</label>
        <div className="grid grid-cols-2 gap-3">
          {FINISHES.map((finish) => (
            <button
              key={finish}
              onClick={() => updatePackaging({ finish })}
              className={`p-3 rounded-md border text-sm transition-all ${
                packaging.finish === finish ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              {finish}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Add-ons</label>
        <div className="grid grid-cols-2 gap-3">
          {ADDONS.map((addon) => (
            <button
              key={addon}
              onClick={() => toggleAddon(addon)}
              className={`p-3 rounded-md border text-sm transition-all ${
                packaging.addons.includes(addon) ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              {addon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
