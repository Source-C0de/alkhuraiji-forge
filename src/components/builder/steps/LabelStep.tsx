import { useBuilderStore } from "@/store/useBuilderStore";

const FONTS = ["Modern Sans", "Elegant Serif", "Arabic Luxury", "Minimal Corporate"];
const SHAPES = ["Rectangle", "Rounded", "Vertical Strip", "Full Wrap"];

export function LabelStep() {
  const label = useBuilderStore((s) => s.label);
  const updateLabel = useBuilderStore((s) => s.updateLabel);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-semibold">Customize Label</h2>
      
      <div className="space-y-3">
        <label className="text-sm font-medium">Brand Name</label>
        <input
          type="text"
          value={label.name}
          onChange={(e) => updateLabel({ name: e.target.value })}
          className="w-full px-4 py-3 rounded-md border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter brand name"
        />
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Typography</label>
        <div className="grid grid-cols-2 gap-3">
          {FONTS.map((font) => (
            <button
              key={font}
              onClick={() => updateLabel({ font })}
              className={`p-3 rounded-md border text-sm transition-all ${
                label.font === font ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              {font}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="text-sm font-medium">Label Shape</label>
        <div className="grid grid-cols-2 gap-3">
          {SHAPES.map((shape) => (
            <button
              key={shape}
              onClick={() => updateLabel({ shape })}
              className={`p-3 rounded-md border text-sm transition-all ${
                label.shape === shape ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
              }`}
            >
              {shape}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
