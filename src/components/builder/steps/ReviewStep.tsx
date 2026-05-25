import { useBuilderStore } from "@/store/useBuilderStore";

export function ReviewStep() {
  const state = useBuilderStore();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display font-semibold">Review Configuration</h2>
      <p className="text-sm text-muted-foreground">Confirm your product specifications before submitting.</p>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-lg bg-card border border-border">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Bottle Details</h4>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Material:</span> <span className="font-medium">{state.bottleMaterial}</span></div>
              <div className="flex justify-between"><span>Silhouette:</span> <span className="font-medium">{state.bottleSilhouette}</span></div>
              <div className="flex justify-between"><span>Capacity:</span> <span className="font-medium">{state.bottleCapacity}</span></div>
              <div className="flex justify-between"><span>Color:</span> <span className="font-medium">{state.bottleColor}</span></div>
              <div className="flex justify-between"><span>Cap:</span> <span className="font-medium">{state.capStyle}</span></div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Brand Label</h4>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Name:</span> <span className="font-medium">{state.label.name}</span></div>
              <div className="flex justify-between"><span>Font:</span> <span className="font-medium">{state.label.font}</span></div>
              <div className="flex justify-between"><span>Shape:</span> <span className="font-medium">{state.label.shape}</span></div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Packaging</h4>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Type:</span> <span className="font-medium">{state.packaging.type}</span></div>
              <div className="flex justify-between"><span>Finish:</span> <span className="font-medium">{state.packaging.finish}</span></div>
              <div className="flex justify-between">
                <span>Add-ons:</span> 
                <span className="font-medium">{state.packaging.addons.length ? state.packaging.addons.join(", ") : "None"}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3">Production</h4>
            <div className="space-y-2">
              <div className="flex justify-between"><span>Quantity:</span> <span className="font-medium">{state.quantity} units</span></div>
              <div className="flex justify-between"><span>Fragrance:</span> <span className="font-medium">{state.fragrance.intensity}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
