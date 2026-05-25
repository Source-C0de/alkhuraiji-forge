import { useBuilderStore } from "@/store/useBuilderStore";

const NOTES = {
  top: ["Citrus", "Bergamot", "Lemon", "Lavender", "Mint"],
  middle: ["Rose", "Jasmine", "Oud", "Cinnamon", "Vanilla"],
  base: ["Musk", "Sandalwood", "Amber", "Patchouli", "Leather"],
};

const INTENSITIES = ["Light", "Balanced", "Strong", "Signature Intense"];

export function FragranceStep() {
  const fragrance = useBuilderStore((s) => s.fragrance);
  const updateFragrance = useBuilderStore((s) => s.updateFragrance);

  const toggleNote = (layer: "top" | "middle" | "base", note: string) => {
    const current = fragrance[layer];
    if (current.includes(note)) {
      updateFragrance({ [layer]: current.filter((n) => n !== note) });
    } else {
      if (current.length < 3) {
        updateFragrance({ [layer]: [...current, note] });
      }
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-semibold">Fragrance Composition</h2>
      <p className="text-sm text-muted-foreground">Select up to 3 notes per layer.</p>
      
      {(Object.keys(NOTES) as Array<"top" | "middle" | "base">).map((layer) => (
        <div key={layer} className="space-y-3">
          <label className="text-sm font-medium capitalize">{layer} Notes</label>
          <div className="flex flex-wrap gap-2">
            {NOTES[layer].map((note) => (
              <button
                key={note}
                onClick={() => toggleNote(layer, note)}
                className={`px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                  fragrance[layer].includes(note) ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border hover:border-primary/50"
                }`}
              >
                {note}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-3 pt-4 border-t border-border">
        <label className="text-sm font-medium">Scent Intensity</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {INTENSITIES.map((intensity) => (
            <button
              key={intensity}
              onClick={() => updateFragrance({ intensity })}
              className={`p-2 rounded-md border text-xs text-center transition-all ${
                fragrance.intensity === intensity ? "border-primary bg-primary/10 font-bold" : "border-border hover:border-primary/50"
              }`}
            >
              {intensity}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
