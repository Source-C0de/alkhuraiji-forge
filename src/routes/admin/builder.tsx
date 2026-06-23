import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Eye, Box, Droplet, Package, Sparkles, Power } from "lucide-react";

export const Route = createFileRoute("/admin/builder")({
  component: BuilderManager,
});

const TABS = [
  { id: "bottles", label: "Bottle Shapes", icon: Box },
  { id: "caps", label: "Caps", icon: Droplet },
  { id: "packaging", label: "Packaging", icon: Package },
  { id: "fragrances", label: "Fragrances", icon: Sparkles },
];

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAdminStore,
  type BuilderItem,
  type NameItem,
  type ColorItem,
  type SectionKey,
} from "@/store/adminStore";

// ----------------------------------------------------------------------
// Section visibility switch — used both as a standalone strip (Bottles tab)
// and as part of each Caps sub-section header.
// ----------------------------------------------------------------------
function SectionToggle({
  label,
  visible,
  onToggle,
}: {
  label: string;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-card border border-white/5 px-4 py-3">
      <div className="flex items-center gap-3">
        <Switch id={`switch-${label}`} checked={visible} onCheckedChange={onToggle} />
        <Label htmlFor={`switch-${label}`} className="text-sm text-white cursor-pointer">
          {label}
        </Label>
      </div>
      <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
        {visible ? "Visible on site" : "Hidden on site"}
      </Badge>
    </div>
  );
}

// ----------------------------------------------------------------------
// Name sub-section — used for cap styles + pump types
// ----------------------------------------------------------------------
function NameSubSection({
  title,
  items,
  visible,
  onToggleVisible,
  onAdd,
  onToggleItem,
  onDelete,
  addLabel,
}: {
  title: string;
  items: NameItem[];
  visible: boolean;
  onToggleVisible: () => void;
  onAdd: () => void;
  onToggleItem: (id: number, current: boolean) => void;
  onDelete: (id: number) => void;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SectionToggle label={title} visible={visible} onToggle={onToggleVisible} />
        <Button
          onClick={onAdd}
          size="sm"
          className="bg-gold text-black hover:bg-gold-soft shadow-gold-glow text-xs font-medium"
        >
          <Plus className="h-3 w-3 mr-1" /> {addLabel}
        </Button>
      </div>

      {visible && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.length === 0 ? (
            <div className="col-span-full py-6 text-center text-xs text-muted-foreground italic border border-dashed border-white/10 rounded-xl">
              No items yet — add one above.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border bg-card border-white/5 hover:border-white/20 transition-colors"
              >
                <div className="flex justify-between items-center gap-2">
                  <span className="font-medium text-white text-sm truncate">{item.name}</span>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-1 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400 flex-shrink-0"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => onToggleItem(item.id, item.active)}
                  className={`mt-2 inline-flex px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider transition-colors ${
                    item.active
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                      : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {item.active ? "Active" : "Inactive"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Color sub-section — used for cap colors; card shows a swatch.
// ----------------------------------------------------------------------
function ColorSubSection({
  title,
  items,
  visible,
  onToggleVisible,
  onAdd,
  onToggleItem,
  onDelete,
}: {
  title: string;
  items: ColorItem[];
  visible: boolean;
  onToggleVisible: () => void;
  onAdd: () => void;
  onToggleItem: (id: number, current: boolean) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <SectionToggle label={title} visible={visible} onToggle={onToggleVisible} />
        <Button
          onClick={onAdd}
          size="sm"
          className="bg-gold text-black hover:bg-gold-soft shadow-gold-glow text-xs font-medium"
        >
          <Plus className="h-3 w-3 mr-1" /> Add Color
        </Button>
      </div>

      {visible && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.length === 0 ? (
            <div className="col-span-full py-6 text-center text-xs text-muted-foreground italic border border-dashed border-white/10 rounded-xl">
              No colors yet — add one above.
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl border bg-card border-white/5 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="h-10 w-10 rounded-full border border-border flex-shrink-0 shadow-sm"
                    style={{ background: item.hex }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-1">
                      <span className="font-medium text-white text-xs truncate">{item.name}</span>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400 flex-shrink-0"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => onToggleItem(item.id, item.active)}
                      className={`mt-1.5 inline-flex px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider transition-colors ${
                        item.active
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {item.active ? "Active" : "Inactive"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Add-color dialog — reused for both bottle and cap colors in the future.
// ----------------------------------------------------------------------
function AddColorDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (name: string, hex: string) => void;
}) {
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#888888");

  const reset = () => {
    setName("");
    setHex("#888888");
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(name.trim(), hex.trim() || "#000000");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="bg-card border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Add Color Option</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Hex, <code className="text-white">transparent</code>, or any CSS gradient.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Champagne Gold"
              className="bg-black/40 border-white/10"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1 block">CSS background value</Label>
            <div className="flex gap-2">
              <Input
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#b45f06 or linear-gradient(...)"
                className="bg-black/40 border-white/10"
              />
              <div
                className="h-9 w-9 rounded-md border border-white/10 flex-shrink-0"
                style={{ background: hex }}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gold text-black hover:bg-gold-soft shadow-gold-glow"
          >
            Add Color
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ----------------------------------------------------------------------
// Main page
// ----------------------------------------------------------------------
function BuilderManager() {
  const [activeTab, setActiveTab] = useState("bottles");

  // Bottles tab state (existing silhouettes + per-section visibility strip)
  const {
    builderBottles,
    addBuilderBottle,
    updateBuilderBottle,
    deleteBuilderBottle,
    showBottleMaterials,
    showBottleCapacity,
    showBottleColor,
    toggleSection,
  } = useAdminStore();

  // Caps tab state
  const {
    capStyles,
    addCapStyle,
    updateCapStyle,
    deleteCapStyle,
    pumpTypes,
    addPumpType,
    updatePumpType,
    deletePumpType,
    capColors,
    addCapColor,
    updateCapColor,
    deleteCapColor,
    showCapStyles,
    showPumpTypes,
    showCapColor,
  } = useAdminStore();

  const [selectedPreview, setSelectedPreview] = useState<BuilderItem | null>(
    builderBottles[0] || null,
  );
  const [addColorOpen, setAddColorOpen] = useState(false);

  // --------------------------------------------------------------------
  // Bottle silhouettes handlers (unchanged from original)
  // --------------------------------------------------------------------
  const handleToggleBottle = (id: number, current: boolean) => {
    updateBuilderBottle(id, { active: !current });
    if (selectedPreview?.id === id) {
      setSelectedPreview((p) => (p ? { ...p, active: !current } : p));
    }
  };

  const handleDeleteBottle = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBuilderBottle(id);
    if (selectedPreview?.id === id) {
      setSelectedPreview(builderBottles.find((b) => b.id !== id) || null);
    }
  };

  const handleAddBottle = () => {
    const name = prompt("Enter Bottle Name:");
    if (!name) return;
    const category = prompt("Enter Category (e.g. Classic, Luxury, Modern):", "Classic");
    if (!category) return;
    const randomImages = [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1585365321831-7e04a49db2ce?auto=format&fit=crop&w=400&q=80",
    ];
    const image = randomImages[Math.floor(Math.random() * randomImages.length)];
    addBuilderBottle({ name, category, active: true, image });
  };

  // --------------------------------------------------------------------
  // Caps handlers
  // --------------------------------------------------------------------
  const handleAddCapStyle = () => {
    const name = prompt("Enter Cap Style Name:");
    if (!name) return;
    addCapStyle({ name, active: true });
  };

  const handleAddPumpType = () => {
    const name = prompt("Enter Pump Type Name:");
    if (!name) return;
    addPumpType({ name, active: true });
  };

  const handleAddCapColor = (name: string, hex: string) => {
    addCapColor({ name, hex, active: true });
  };

  // --------------------------------------------------------------------
  // Live Preview content adapts to which tab is open
  // --------------------------------------------------------------------
  const activePreview = useMemo<BuilderItem | null>(() => {
    if (activeTab === "bottles") {
      return builderBottles.find((b) => b.id === selectedPreview?.id) || builderBottles[0] || null;
    }
    // For caps, show a synthetic preview based on the first active cap color.
    const firstColor = capColors.find((c) => c.active);
    if (firstColor) {
      return {
        id: firstColor.id,
        name: firstColor.name,
        category: "Cap Color",
        active: firstColor.active,
        image: capColorToDataUrl(firstColor.hex),
      };
    }
    const firstStyle = capStyles.find((s) => s.active);
    if (firstStyle) {
      return {
        id: firstStyle.id,
        name: firstStyle.name,
        category: "Cap Style",
        active: firstStyle.active,
        image: "",
      };
    }
    return null;
  }, [activeTab, builderBottles, selectedPreview, capColors, capStyles]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
      {/* Configuration Panel */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Builder Manager</h1>
          <p className="text-muted-foreground text-sm">
            Manage dynamic configurator assets, materials, and pricing tiers.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-gold/10 text-gold shadow-[inset_0_0_0_1px_var(--gold-soft)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pr-2 space-y-6">
          {/* -------- Bottles tab -------- */}
          {activeTab === "bottles" && (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Silhouettes Directory</h2>
                <Button
                  onClick={handleAddBottle}
                  size="sm"
                  className="bg-gold text-black hover:bg-gold-soft shadow-gold-glow text-xs font-medium"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add New
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {builderBottles.map((item) => (
                  <motion.div
                    key={item.id}
                    layoutId={`card-${item.id}`}
                    onClick={() => setSelectedPreview(item)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                      activePreview?.id === item.id
                        ? "bg-white/10 border-gold/50 shadow-xl"
                        : "bg-card border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="h-16 w-16 rounded-lg bg-black/50 border border-white/10 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover mix-blend-screen"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-white truncate">{item.name}</h3>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => handleDeleteBottle(item.id, e)}
                              className="p-1 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleBottle(item.id, item.active);
                          }}
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider transition-colors ${
                            item.active
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                              : "bg-white/5 text-muted-foreground border border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {item.active ? "Active" : "Inactive"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Per-section visibility strip */}
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                  <Power className="h-3 w-3 text-gold" />
                  Bottle Step Sections
                </div>
                <SectionToggle
                  label="Show Material"
                  visible={showBottleMaterials}
                  onToggle={() => toggleSection("showBottleMaterials" as SectionKey)}
                />
                <SectionToggle
                  label="Show Capacity"
                  visible={showBottleCapacity}
                  onToggle={() => toggleSection("showBottleCapacity" as SectionKey)}
                />
                <SectionToggle
                  label="Show Bottle Color"
                  visible={showBottleColor}
                  onToggle={() => toggleSection("showBottleColor" as SectionKey)}
                />
              </div>
            </>
          )}

          {/* -------- Caps tab -------- */}
          {activeTab === "caps" && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-white">Caps Directory</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage cap styles, pump types, and cap colors. Use the section switches to hide an
                  entire block on the public configurator.
                </p>
              </div>

              <NameSubSection
                title="Cap Styles"
                items={capStyles}
                visible={showCapStyles}
                onToggleVisible={() => toggleSection("showCapStyles")}
                onAdd={handleAddCapStyle}
                onToggleItem={(id, current) => updateCapStyle(id, { active: !current })}
                onDelete={(id) => deleteCapStyle(id)}
                addLabel="Add Style"
              />

              <NameSubSection
                title="Pump Types"
                items={pumpTypes}
                visible={showPumpTypes}
                onToggleVisible={() => toggleSection("showPumpTypes")}
                onAdd={handleAddPumpType}
                onToggleItem={(id, current) => updatePumpType(id, { active: !current })}
                onDelete={(id) => deletePumpType(id)}
                addLabel="Add Pump"
              />

              <ColorSubSection
                title="Cap Colors"
                items={capColors}
                visible={showCapColor}
                onToggleVisible={() => toggleSection("showCapColor")}
                onAdd={() => setAddColorOpen(true)}
                onToggleItem={(id, current) => updateCapColor(id, { active: !current })}
                onDelete={(id) => deleteCapColor(id)}
              />
            </>
          )}

          {activeTab !== "bottles" && activeTab !== "caps" && (
            <div className="py-12 text-center border border-dashed border-white/10 rounded-xl">
              <p className="text-muted-foreground text-sm">
                Select an item to edit or create new {activeTab}.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-white flex items-center gap-2">
          <Eye className="h-5 w-5 text-gold" /> Live Preview
        </h2>

        {activePreview ? (
          <div className="flex-1 rounded-2xl bg-[#111] border border-white/10 overflow-hidden relative shadow-2xl flex flex-col">
            <div className="h-12 border-b border-white/10 bg-black/50 flex items-center justify-between px-4">
              <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">
                3D Viewer
              </span>
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-white/20" />
                <div className="h-2 w-2 rounded-full bg-white/20" />
                <div className="h-2 w-2 rounded-full bg-white/20" />
              </div>
            </div>

            <div className="flex-1 relative flex items-center justify-center p-8">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-30" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activePreview.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full aspect-square flex items-center justify-center"
                >
                  {activePreview.image ? (
                    <img
                      src={activePreview.image}
                      alt="Preview"
                      className="max-h-full object-contain drop-shadow-2xl mix-blend-screen"
                    />
                  ) : (
                    <div
                      className="h-32 w-32 rounded-2xl shadow-2xl"
                      style={{ background: capColorToCss(activePreview.name, capColors) }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="p-6 bg-black/50 border-t border-white/10 backdrop-blur-md">
              <h3 className="font-semibold text-lg text-white mb-1">{activePreview.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activePreview.active
                  ? "Currently active in the public configurator."
                  : "Currently hidden from the public configurator."}
              </p>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span className="text-white font-medium">{activePreview.category}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dimensions</span>
                  <span className="text-white font-medium">120 x 45 mm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Material</span>
                  <span className="text-white font-medium">Flint Glass</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="text-white font-medium">50ml / 1.7oz</span>
                </div>
              </div>

              <button className="w-full mt-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-semibold text-white">
                Edit Properties
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 rounded-2xl bg-[#111] border border-white/10 flex items-center justify-center text-muted-foreground">
            No item selected
          </div>
        )}
      </div>

      <AddColorDialog
        open={addColorOpen}
        onOpenChange={setAddColorOpen}
        onSubmit={handleAddCapColor}
      />
    </div>
  );
}

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------
function capColorToCss(name: string, colors: ColorItem[]): string {
  return colors.find((c) => c.name === name)?.hex ?? "#888";
}

// Build a tiny inline-SVG data URL so a cap-color hex can be rendered in the
// existing <img> slot of the Live Preview without leaking the cap-color name
// into a network fetch.
function capColorToDataUrl(hex: string): string {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='42' fill='${escapeAttr(
    hex,
  )}' stroke='rgba(255,255,255,0.2)' stroke-width='2'/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeAttr(s: string): string {
  return s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
