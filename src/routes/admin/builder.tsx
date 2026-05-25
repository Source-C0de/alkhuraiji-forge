import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Eye, Box, Droplet, Package, Sparkles } from "lucide-react";

export const Route = createFileRoute("/admin/builder")({
  component: BuilderManager,
});

const TABS = [
  { id: "bottles", label: "Bottle Shapes", icon: Box },
  { id: "caps", label: "Caps", icon: Droplet },
  { id: "packaging", label: "Packaging", icon: Package },
  { id: "fragrances", label: "Fragrances", icon: Sparkles },
];

import { useAdminStore, BuilderItem } from "@/store/adminStore";

function BuilderManager() {
  const [activeTab, setActiveTab] = useState("bottles");
  const { builderBottles, addBuilderBottle, updateBuilderBottle, deleteBuilderBottle } = useAdminStore();
  const [selectedPreview, setSelectedPreview] = useState<BuilderItem | null>(builderBottles[0] || null);

  const handleToggleActive = (id: number, currentActive: boolean) => {
    updateBuilderBottle(id, { active: !currentActive });
    // Update active preview state if it's the one modified
    if (selectedPreview?.id === id) {
      setSelectedPreview(prev => prev ? { ...prev, active: !currentActive } : null);
    }
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteBuilderBottle(id);
    if (selectedPreview?.id === id) {
      setSelectedPreview(builderBottles.find(b => b.id !== id) || null);
    }
  };

  const handleAddNew = () => {
    const name = prompt("Enter Bottle Name:");
    if (!name) return;
    const category = prompt("Enter Category (e.g. Classic, Luxury, Modern):", "Classic");
    if (!category) return;
    
    // Choose a random high-quality cosmetic bottle image from unsplash
    const randomImages = [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1585365321831-7e04a49db2ce?auto=format&fit=crop&w=400&q=80"
    ];
    const image = randomImages[Math.floor(Math.random() * randomImages.length)];

    addBuilderBottle({
      name,
      category,
      active: true,
      image
    });
  };

  // Keep selected preview in sync if database changes
  const activePreview = builderBottles.find(b => b.id === selectedPreview?.id) || builderBottles[0] || null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
      
      {/* Configuration Panel */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Builder Manager</h1>
          <p className="text-muted-foreground text-sm">Manage dynamic configurator assets, materials, and pricing tiers.</p>
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
        <div className="flex-1 overflow-y-auto scrollbar-hide pr-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white capitalize">{activeTab} Directory</h2>
            {activeTab === "bottles" && (
              <button 
                onClick={handleAddNew}
                className="flex items-center gap-2 px-3 py-1.5 bg-gold text-black rounded-lg hover:bg-gold-soft transition shadow-gold-glow text-xs font-medium"
              >
                <Plus className="h-3 w-3" /> Add New
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeTab === "bottles" && builderBottles.map((item) => (
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
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover mix-blend-screen" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-white truncate">{item.name}</h3>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1 rounded hover:bg-red-500/20 text-muted-foreground hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{item.category}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggleActive(item.id, item.active); }}
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

            {activeTab !== "bottles" && (
              <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl">
                <p className="text-muted-foreground text-sm">Select an item to edit or create new {activeTab}.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="w-full lg:w-[400px] flex-shrink-0 flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-white flex items-center gap-2">
          <Eye className="h-5 w-5 text-gold" /> Live Preview
        </h2>
        
        {activePreview ? (
          <div className="flex-1 rounded-2xl bg-[#111] border border-white/10 overflow-hidden relative shadow-2xl flex flex-col">
            {/* Header */}
            <div className="h-12 border-b border-white/10 bg-black/50 flex items-center justify-between px-4">
              <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">3D Viewer</span>
              <div className="flex gap-1.5">
                <div className="h-2 w-2 rounded-full bg-white/20" />
                <div className="h-2 w-2 rounded-full bg-white/20" />
                <div className="h-2 w-2 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Preview Area */}
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
                  <img 
                    src={activePreview.image} 
                    alt="Preview" 
                    className="max-h-full object-contain drop-shadow-2xl mix-blend-screen" 
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Preview Details */}
            <div className="p-6 bg-black/50 border-t border-white/10 backdrop-blur-md">
              <h3 className="font-semibold text-lg text-white mb-1">{activePreview.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {activePreview.active ? "Currently active in the public configurator." : "Currently hidden from the public configurator."}
              </p>
              
              <div className="space-y-3">
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
            No bottle shape selected
          </div>
        )}
      </div>
      
    </div>
  );
}
