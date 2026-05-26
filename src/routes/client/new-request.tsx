import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sparkles, ChevronRight, ChevronLeft, Check, Upload,
  Eye, RotateCcw, Send,
} from "lucide-react";
import { useClientStore } from "@/store/clientStore";

export const Route = createFileRoute("/client/new-request")({
  component: NewRequest,
});

const STEPS = [
  { id: 1, label: "Category" },
  { id: 2, label: "Details" },
  { id: 3, label: "Builder" },
  { id: 4, label: "Assets" },
  { id: 5, label: "Review" },
];

const CATEGORIES = [
  { id: "perfume", label: "Perfume", icon: "🌹", desc: "Eau de parfum, cologne, attar" },
  { id: "hair_oil", label: "Hair Oil", icon: "💧", desc: "Argan, coconut, treatment oils" },
  { id: "skincare", label: "Skincare", icon: "✨", desc: "Serums, creams, moisturizers" },
  { id: "body_mist", label: "Body Mist", icon: "🌸", desc: "Light fragrance body sprays" },
  { id: "cosmetics", label: "Cosmetic Product", icon: "💄", desc: "Lip, eye, foundation products" },
  { id: "packaging", label: "Custom Packaging", icon: "📦", desc: "Boxes, bags, gift sets" },
];

const BOTTLE_SHAPES = ["Round", "Square", "Oval", "Cylindrical", "Faceted", "Custom"];
const BOTTLE_MATERIALS = ["Glass", "Frosted Glass", "Acrylic", "Metal", "Ceramic"];
const BOTTLE_COLORS = ["Clear", "Amber", "Cobalt Blue", "Matte Black", "Blush Pink", "Emerald"];
const CAP_STYLES = ["Flat Gold", "Rounded Silver", "Tapered", "Magnetic", "Wooden", "Crystal"];
const LABEL_STYLES = ["Embossed", "Printed", "Engraved", "Hot Stamp", "No Label"];
const BOX_TYPES = ["Rigid Gift Box", "Sleeve Box", "Drawer Box", "Eco Kraft", "No Box"];
const FRAGRANCES = ["Oud & Amber", "Rose & Musk", "Citrus Fresh", "Oriental Spice", "Custom Formula"];
const FINISHES = ["Matte", "Gloss", "Satin", "Metallic", "Frosted"];

// Color map for bottle preview
const COLOR_MAP: Record<string, string> = {
  Clear: "rgba(200,220,255,0.35)",
  Amber: "rgba(180,120,40,0.7)",
  "Cobalt Blue": "rgba(30,60,180,0.7)",
  "Matte Black": "rgba(20,20,20,0.9)",
  "Blush Pink": "rgba(230,170,170,0.7)",
  Emerald: "rgba(20,140,90,0.7)",
};

function BottlePreview({ shape, color, cap }: { shape: string; color: string; cap: string }) {
  const fillColor = COLOR_MAP[color] ?? "rgba(200,200,200,0.4)";
  const capColor = cap.includes("Gold") ? "#C9A84C" : cap.includes("Silver") ? "#C0C0C0" : cap.includes("Wooden") ? "#8B6914" : "#888";

  const shapeMap: Record<string, string> = {
    Round: "50px",
    Square: "4px",
    Oval: "40px 20px",
    Cylindrical: "8px",
    Faceted: "0px",
    Custom: "16px",
  };
  const borderRadius = shapeMap[shape] ?? "8px";

  return (
    <div className="flex flex-col items-center gap-0">
      {/* Cap */}
      <div className="w-12 h-6 rounded-t-lg" style={{ backgroundColor: capColor, borderRadius: "8px 8px 0 0" }} />
      {/* Neck */}
      <div className="w-8 h-8" style={{ backgroundColor: fillColor, backdropFilter: "blur(4px)" }} />
      {/* Body */}
      <motion.div
        key={`${shape}-${color}`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-24 h-36 relative overflow-hidden"
        style={{ backgroundColor: fillColor, borderRadius, backdropFilter: "blur(4px)", border: "1px solid rgba(255,255,255,0.15)" }}
      >
        {/* Shine */}
        <div className="absolute top-0 left-2 w-4 h-full bg-white/10 rounded-full" style={{ transform: "skewX(-8deg)" }} />
      </motion.div>
      {/* Base */}
      <div className="w-28 h-2 rounded-b-lg" style={{ backgroundColor: fillColor, opacity: 0.6 }} />
    </div>
  );
}

function Step1({ draft, update }: { draft: any; update: (d: any) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Select Product Category</h2>
        <p className="text-white/40 text-sm">Choose the type of product you'd like to manufacture</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => (
          <motion.button
            key={cat.id}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => update({ category: cat.id })}
            className={`relative p-5 rounded-2xl border text-left transition-all ${
              draft.category === cat.id
                ? "border-[#C9A84C]/50 bg-[#C9A84C]/8"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12]"
            }`}
          >
            {draft.category === cat.id && (
              <motion.div layoutId="cat-active" className="absolute inset-0 rounded-2xl border border-[#C9A84C]/40 bg-[#C9A84C]/5" />
            )}
            {draft.category === cat.id && (
              <div className="absolute top-3 right-3 h-5 w-5 rounded-full bg-[#C9A84C] flex items-center justify-center">
                <Check className="h-3 w-3 text-black" />
              </div>
            )}
            <span className="text-3xl mb-3 block">{cat.icon}</span>
            <p className="font-semibold text-white text-sm">{cat.label}</p>
            <p className="text-[11px] text-white/35 mt-1">{cat.desc}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function Step2({ draft, update }: { draft: any; update: (d: any) => void }) {
  const fields = [
    { key: "name", label: "Product Name", placeholder: "e.g. Oud Noir Elixir" },
    { key: "market", label: "Target Market", placeholder: "e.g. GCC, Europe, Global" },
    { key: "type", label: "Product Type / Variant", placeholder: "e.g. Eau de Parfum 100ml" },
    { key: "audience", label: "Intended Audience", placeholder: "e.g. Luxury women 25-45" },
    { key: "volume", label: "Volume / Size", placeholder: "e.g. 50ml, 100ml" },
    { key: "quantity", label: "Initial Quantity (MOQ)", placeholder: "e.g. 1,000 units" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Product Details</h2>
        <p className="text-white/40 text-sm">Tell us about your product vision and requirements</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">{f.label}</label>
            <input
              value={draft[f.key] ?? ""}
              onChange={(e) => update({ [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/20 text-sm transition-all"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function Step3({ draft, update }: { draft: any; update: (d: any) => void }) {
  const selects: { key: string; label: string; options: string[] }[] = [
    { key: "bottleShape", label: "Bottle Shape", options: BOTTLE_SHAPES },
    { key: "bottleMaterial", label: "Bottle Material", options: BOTTLE_MATERIALS },
    { key: "bottleColor", label: "Bottle Color", options: BOTTLE_COLORS },
    { key: "capStyle", label: "Cap Style", options: CAP_STYLES },
    { key: "labelStyle", label: "Label Style", options: LABEL_STYLES },
    { key: "boxPackaging", label: "Box Packaging", options: BOX_TYPES },
    { key: "fragrance", label: "Fragrance / Formula", options: FRAGRANCES },
    { key: "finish", label: "Finish Type", options: FINISHES },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Custom Product Builder</h2>
        <p className="text-white/40 text-sm">Configure your product — preview updates in real time</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Options */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {selects.map((s) => (
            <div key={s.key} className="space-y-1.5">
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider">{s.label}</label>
              <div className="flex flex-wrap gap-2">
                {s.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => update({ [s.key]: opt })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      draft[s.key] === opt
                        ? "bg-[#C9A84C]/15 border-[#C9A84C]/40 text-[#C9A84C]"
                        : "bg-white/[0.03] border-white/[0.06] text-white/50 hover:border-white/[0.15] hover:text-white/80"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Live Preview */}
        <div className="rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/[0.08] p-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-6 self-stretch">
            <Eye className="h-4 w-4 text-[#C9A84C]" />
            <span className="text-xs font-medium text-[#C9A84C]">Live Preview</span>
          </div>
          <BottlePreview
            shape={draft.bottleShape ?? "Round"}
            color={draft.bottleColor ?? "Clear"}
            cap={draft.capStyle ?? "Flat Gold"}
          />
          <div className="mt-6 space-y-1.5 self-stretch">
            {[
              ["Shape", draft.bottleShape ?? "—"],
              ["Material", draft.bottleMaterial ?? "—"],
              ["Color", draft.bottleColor ?? "—"],
              ["Cap", draft.capStyle ?? "—"],
              ["Label", draft.labelStyle ?? "—"],
              ["Box", draft.boxPackaging ?? "—"],
              ["Fragrance", draft.fragrance ?? "—"],
              ["Finish", draft.finish ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-[11px]">
                <span className="text-white/30">{k}</span>
                <span className="text-white/70 font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Step4({ draft, update }: { draft: any; update: (d: any) => void }) {
  const [dragging, setDragging] = useState(false);
  const uploads = [
    { key: "logo", label: "Brand Logo", hint: "SVG, PNG, AI — Max 10MB" },
    { key: "designRef", label: "Design References", hint: "Images, PDF, Mood board" },
    { key: "packagingRef", label: "Packaging Inspiration", hint: "Photos, screenshots, sketches" },
    { key: "formula", label: "Formula Requirements", hint: "PDF, DOCX, TXT" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Upload Brand Assets</h2>
        <p className="text-white/40 text-sm">Share your brand files, references and formula requirements</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {uploads.map((u) => (
          <div
            key={u.key}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); update({ [u.key]: e.dataTransfer.files[0]?.name ?? "File uploaded" }); }}
            className={`relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-all ${
              dragging || draft[u.key]
                ? "border-[#C9A84C]/40 bg-[#C9A84C]/5"
                : "border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02]"
            }`}
          >
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => update({ [u.key]: e.target.files?.[0]?.name ?? "File uploaded" })}
            />
            <div className="flex flex-col items-center gap-3 pointer-events-none">
              {draft[u.key] ? (
                <>
                  <div className="h-10 w-10 rounded-full bg-emerald-400/15 flex items-center justify-center">
                    <Check className="h-5 w-5 text-emerald-400" />
                  </div>
                  <p className="text-sm font-medium text-emerald-400">Uploaded</p>
                  <p className="text-[11px] text-white/30 truncate max-w-[180px]">{draft[u.key]}</p>
                </>
              ) : (
                <>
                  <div className="h-10 w-10 rounded-full bg-white/[0.05] flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white/30" />
                  </div>
                  <p className="text-sm font-medium text-white/70">{u.label}</p>
                  <p className="text-[11px] text-white/30">{u.hint}</p>
                  <p className="text-[10px] text-white/20">Drag & drop or click to browse</p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step5({ draft }: { draft: any }) {
  const catLabel = CATEGORIES.find((c) => c.id === draft.category)?.label ?? draft.category;
  const sections = [
    { title: "Product Category", items: [["Category", catLabel]] },
    {
      title: "Product Details",
      items: [
        ["Name", draft.name], ["Market", draft.market], ["Type", draft.type],
        ["Audience", draft.audience], ["Volume", draft.volume], ["Quantity", draft.quantity],
      ],
    },
    {
      title: "Builder Configuration",
      items: [
        ["Shape", draft.bottleShape], ["Material", draft.bottleMaterial], ["Color", draft.bottleColor],
        ["Cap", draft.capStyle], ["Label", draft.labelStyle], ["Box", draft.boxPackaging],
        ["Fragrance", draft.fragrance], ["Finish", draft.finish],
      ],
    },
    {
      title: "Brand Assets",
      items: [
        ["Logo", draft.logo ? "✓ Uploaded" : "Not provided"],
        ["Design Ref", draft.designRef ? "✓ Uploaded" : "Not provided"],
        ["Packaging Ref", draft.packagingRef ? "✓ Uploaded" : "Not provided"],
        ["Formula", draft.formula ? "✓ Uploaded" : "Not provided"],
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Review & Submit</h2>
        <p className="text-white/40 text-sm">Please review your request before submitting to the production team</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((sec) => (
          <div key={sec.title} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5">
            <h3 className="text-xs font-semibold text-[#C9A84C] uppercase tracking-wider mb-4">{sec.title}</h3>
            <div className="space-y-2.5">
              {sec.items.map(([k, v]) => (
                <div key={k} className="flex justify-between text-sm">
                  <span className="text-white/35">{k}</span>
                  <span className="text-white/80 font-medium text-right max-w-[60%] truncate">{v ?? "—"}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-[#C9A84C]/8 border border-[#C9A84C]/20 p-5 flex gap-3">
        <Sparkles className="h-5 w-5 text-[#C9A84C] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-white">Ready to submit</p>
          <p className="text-[12px] text-white/40 mt-0.5">Your dedicated project manager will review this request and contact you within 24 hours to confirm details and next steps.</p>
        </div>
      </div>
    </div>
  );
}

function NewRequest() {
  const { requestStep, setRequestStep, requestDraft, updateRequestDraft, resetRequest, setActiveSection } = useClientStore();
  const [submitted, setSubmitted] = useState(false);

  const canNext = () => {
    if (requestStep === 1) return !!requestDraft.category;
    if (requestStep === 2) return !!(requestDraft.name && requestDraft.quantity);
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      resetRequest();
      setActiveSection("my-projects");
    }, 2800);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="h-20 w-20 rounded-full bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center mx-auto mb-6"
          >
            <Check className="h-10 w-10 text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-2">Request Submitted!</h2>
          <p className="text-white/40 text-sm">Your project manager will be in touch within 24 hours. Redirecting to your projects…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white">New Product Request</h1>
        <p className="text-white/40 text-sm mt-1">Complete the wizard to submit your manufacturing request</p>
      </div>

      {/* Step Indicators */}
      <div className="flex items-center gap-0 mb-10">
        {STEPS.map((step, i) => (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <button
              onClick={() => step.id < requestStep && setRequestStep(step.id)}
              className={`flex items-center gap-2.5 ${step.id < requestStep ? "cursor-pointer" : "cursor-default"}`}
            >
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all flex-shrink-0 ${
                step.id < requestStep
                  ? "bg-[#C9A84C] border-[#C9A84C] text-black"
                  : step.id === requestStep
                  ? "border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10"
                  : "border-white/[0.1] text-white/25 bg-transparent"
              }`}>
                {step.id < requestStep ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${step.id === requestStep ? "text-white" : step.id < requestStep ? "text-white/60" : "text-white/20"}`}>
                {step.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-3 bg-white/[0.06]">
                {step.id < requestStep && (
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} className="h-full bg-[#C9A84C]/40 origin-left" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-6 md:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={requestStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {requestStep === 1 && <Step1 draft={requestDraft} update={updateRequestDraft} />}
            {requestStep === 2 && <Step2 draft={requestDraft} update={updateRequestDraft} />}
            {requestStep === 3 && <Step3 draft={requestDraft} update={updateRequestDraft} />}
            {requestStep === 4 && <Step4 draft={requestDraft} update={updateRequestDraft} />}
            {requestStep === 5 && <Step5 draft={requestDraft} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-3">
          {requestStep > 1 && (
            <button
              onClick={() => setRequestStep(requestStep - 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] text-white/70 font-medium text-sm transition-all"
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>
          )}
          <button
            onClick={resetRequest}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.02] text-white/30 hover:text-white/60 font-medium text-sm transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>

        {requestStep < 5 ? (
          <button
            onClick={() => canNext() && setRequestStep(requestStep + 1)}
            disabled={!canNext()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] text-black font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] text-black font-bold text-sm transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
          >
            <Send className="h-4 w-4" /> Submit Request
          </button>
        )}
      </div>
    </div>
  );
}
