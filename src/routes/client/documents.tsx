import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  FileText, Receipt, Award, ShieldCheck, FlaskConical,
  ClipboardCheck, Download, Search, Eye, Lock,
} from "lucide-react";
import { useClientStore, type Document } from "@/store/clientStore";

export const Route = createFileRoute("/client/documents")({
  component: DocumentCenter,
});

const TYPE_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  specification: { label: "Specification", icon: FileText, color: "#818cf8" },
  invoice: { label: "Invoice", icon: Receipt, color: "#C9A84C" },
  certificate: { label: "Certificate", icon: Award, color: "#34d399" },
  nda: { label: "NDA", icon: Lock, color: "#f87171" },
  formula: { label: "Formula", icon: FlaskConical, color: "#38bdf8" },
  compliance: { label: "Compliance", icon: ClipboardCheck, color: "#fb923c" },
};

function DocCard({ doc }: { doc: Document }) {
  const cfg = TYPE_CONFIG[doc.type];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="group rounded-2xl bg-[#0E0E0E] border border-white/[0.06] hover:border-white/[0.14] p-5 transition-all cursor-pointer relative overflow-hidden"
    >
      <div
        className="absolute right-0 top-0 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: `${cfg.color}10` }}
      />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center border"
          style={{ backgroundColor: `${cfg.color}12`, borderColor: `${cfg.color}25` }}
        >
          <Icon className="h-5 w-5" style={{ color: cfg.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-white text-sm leading-tight mb-1 truncate pr-8">{doc.name}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
              style={{ color: cfg.color, backgroundColor: `${cfg.color}12`, borderColor: `${cfg.color}25` }}
            >
              {cfg.label}
            </span>
            <span className="text-[10px] text-white/25">{doc.size}</span>
            {doc.projectId && (
              <span className="text-[10px] text-white/20">Project linked</span>
            )}
          </div>
          <p className="text-[10px] text-white/20 mt-1.5">Uploaded {doc.uploadedAt}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.05]">
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/50 hover:text-white text-[11px] font-medium transition-all">
          <Eye className="h-3.5 w-3.5" /> Preview
        </button>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/50 hover:text-white text-[11px] font-medium transition-all">
          <Download className="h-3.5 w-3.5" /> Download
        </button>
      </div>
    </motion.div>
  );
}

function DocumentCenter() {
  const { documents } = useClientStore();
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState<string>("all");

  const filtered = documents.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "all" || d.type === activeType;
    return matchSearch && matchType;
  });

  const types = ["all", ...Object.keys(TYPE_CONFIG)];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Document Center</h1>
        <p className="text-white/35 text-sm mt-1">Secure access to all your project files and agreements</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(TYPE_CONFIG).map(([type, cfg]) => {
          const count = documents.filter((d) => d.type === type).length;
          const Icon = cfg.icon;
          return (
            <button
              key={type}
              onClick={() => setActiveType(type === activeType ? "all" : type)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                activeType === type
                  ? "border-[#C9A84C]/30 bg-[#C9A84C]/5"
                  : "bg-[#0E0E0E] border-white/[0.06] hover:border-white/[0.12]"
              }`}
            >
              <Icon className="h-4 w-4 mb-2" style={{ color: cfg.color }} />
              <p className="text-lg font-bold text-white">{count}</p>
              <p className="text-[10px] text-white/30 leading-tight">{cfg.label}</p>
            </button>
          );
        })}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/40 outline-none text-sm text-white placeholder:text-white/20 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all capitalize ${
                activeType === t
                  ? "bg-[#C9A84C]/15 border-[#C9A84C]/30 text-[#C9A84C]"
                  : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Secure notice */}
      <div className="rounded-xl bg-[#C9A84C]/5 border border-[#C9A84C]/15 px-5 py-3 flex items-center gap-3">
        <ShieldCheck className="h-4 w-4 text-[#C9A84C] flex-shrink-0" />
        <p className="text-[12px] text-white/50">
          All documents are end-to-end encrypted and securely stored. Access is restricted to authorised personnel only.
        </p>
      </div>

      {/* Document Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => <DocCard key={doc.id} doc={doc} />)}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-16 text-center">
          <FileText className="h-12 w-12 text-white/[0.08] mx-auto mb-4" />
          <p className="text-white/30 text-sm">No documents match your search.</p>
        </div>
      )}
    </div>
  );
}
