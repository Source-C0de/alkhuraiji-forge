import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminStore } from "@/store/adminStore";
import { Save, Eye, FileText, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/admin/content")({
  component: ContentManager,
});

function ContentManager() {
  const { heroTitle, heroSubtitle, setHeroContent } = useAdminStore();
  const [title, setTitle] = useState(heroTitle);
  const [subtitle, setSubtitle] = useState(heroSubtitle);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroContent(title, subtitle);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)]">
      
      {/* Editor Panel */}
      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Website Content Manager</h1>
          <p className="text-muted-foreground text-sm">Edit text, headlines, and call-to-actions dynamically across your multilingual pages.</p>
        </div>

        <form onSubmit={handleSave} className="flex-1 flex flex-col gap-6 overflow-y-auto scrollbar-hide pr-2">
          {/* Hero Editor Section */}
          <div className="p-6 rounded-2xl bg-card border border-white/5 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-gold" /> Homepage Hero Segment
            </h2>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hero Headline (Use \n for line breaks)</label>
              <textarea 
                rows={3}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-gold outline-none text-white transition-colors text-sm font-display font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hero Subtitle</label>
              <textarea 
                rows={4}
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-gold outline-none text-white transition-colors text-sm"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-3 bg-gold text-black rounded-lg hover:bg-gold-soft transition shadow-gold-glow text-sm font-semibold"
            >
              <Save className="h-4 w-4" /> Save Changes
            </button>
            
            {saved && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-sm font-medium"
              >
                <CheckCircle className="h-4 w-4" /> Changes saved and reflected instantly!
              </motion.span>
            )}
          </div>
        </form>
      </div>

      {/* Real-time Web Preview Panel */}
      <div className="w-full lg:w-[450px] flex-shrink-0 flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-white flex items-center gap-2">
          <Eye className="h-5 w-5 text-gold" /> Live Page Preview
        </h2>
        
        <div className="flex-1 rounded-2xl bg-[#111] border border-white/10 overflow-hidden relative shadow-2xl flex flex-col">
          {/* Header */}
          <div className="h-12 border-b border-white/10 bg-black/50 flex items-center justify-between px-4">
            <span className="text-xs font-medium text-muted-foreground tracking-widest uppercase">Homepage Preview</span>
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500/20" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
              <div className="h-3 w-3 rounded-full bg-green-500/20" />
            </div>
          </div>

          {/* Simulated Web Viewport */}
          <div className="flex-1 bg-black p-6 flex flex-col justify-center relative overflow-hidden">
            {/* Background luxury gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent opacity-40 pointer-events-none" />
            
            {/* Headline and paragraph rendered dynamically */}
            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-[8px] font-medium uppercase tracking-[0.2em] text-primary">
                Luxury Fragrance House
              </div>
              <h1 className="font-display text-2xl font-light text-white leading-tight">
                {title.split("\n").map((line, i) => (
                  <span key={i} className="block">
                    {i === title.split("\n").length - 1 ? <span className="text-gradient-gold font-medium">{line}</span> : line}
                  </span>
                ))}
              </h1>
              <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-3">
                {subtitle}
              </p>
              
              <div className="flex gap-2 pt-2">
                <div className="px-3 py-1.5 bg-primary rounded-full text-[8px] font-semibold text-primary-foreground">
                  Get Started
                </div>
                <div className="px-3 py-1.5 border border-white/10 rounded-full text-[8px] font-semibold text-white">
                  3D Configurator
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
