import { useBuilderStore } from "@/store/useBuilderStore";

const QUANTITIES = [100, 250, 500, 1000, 5000];

export function QuantityStep() {
  const quantity = useBuilderStore((s) => s.quantity);
  const setQuantity = useBuilderStore((s) => s.setQuantity);

  const unitCost = quantity < 500 ? 15 : quantity < 1000 ? 12 : 9.5;
  const totalCost = quantity * unitCost;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-semibold">Production Quantity</h2>
      <p className="text-sm text-muted-foreground">Select your initial manufacturing run volume.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {QUANTITIES.map((q) => (
          <button
            key={q}
            onClick={() => setQuantity(q)}
            className={`py-4 rounded-lg border text-center transition-all ${
              quantity === q ? "border-primary bg-primary/10 shadow-gold-glow" : "border-border hover:border-primary/50"
            }`}
          >
            <div className="text-xl font-bold">{q}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Units</div>
          </button>
        ))}
      </div>

      <div className="mt-8 p-6 rounded-xl border border-border bg-card/50 space-y-4">
        <h3 className="font-semibold border-b border-border pb-3">Production Estimate</h3>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Estimated Unit Cost:</span>
          <span className="font-medium">${unitCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Production Cost:</span>
          <span className="font-bold text-lg text-primary">${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm pt-3 border-t border-border">
          <span className="text-muted-foreground">Estimated Timeline:</span>
          <span className="font-medium">{quantity > 1000 ? "4-6 Weeks" : "2-4 Weeks"}</span>
        </div>
      </div>
    </div>
  );
}
