import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Check, X, MessageSquare, Download, Eye, ChevronLeft, ChevronRight, GitCompare } from "lucide-react";
import { useClientStore } from "@/store/clientStore";

export const Route = createFileRoute("/client/design-approvals")({
  component: DesignApprovals,
});

function DesignApprovals() {
  const { designApprovals, approveDesign, requestChanges } = useClientStore();
  const [selected, setSelected] = useState<string | null>(designApprovals[0]?.id ?? null);
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const selectedDesign = designApprovals.find((d) => d.id === selected);

  const statusColor: Record<string, string> = {
    pending: "bg-amber-400/15 text-amber-400 border-amber-400/20",
    approved: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
    changes_requested: "bg-rose-400/15 text-rose-400 border-rose-400/20",
  };

  const statusLabel: Record<string, string> = {
    pending: "Awaiting Approval",
    approved: "Approved",
    changes_requested: "Changes Requested",
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Design Approvals</h1>
          <p className="text-white/35 text-sm mt-1">Review and approve your product design mockups</p>
        </div>
        <button
          onClick={() => setCompareMode(!compareMode)}
          className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
            compareMode ? "bg-[#C9A84C]/15 border-[#C9A84C]/30 text-[#C9A84C]" : "bg-white/[0.04] border-white/[0.08] text-white/60 hover:text-white"
          }`}
        >
          <GitCompare className="h-4 w-4" /> Compare View
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar list */}
        <div className="space-y-3">
          {designApprovals.map((d) => (
            <button
              key={d.id}
              onClick={() => { setSelected(d.id); setShowCommentBox(false); }}
              className={`w-full text-left rounded-2xl border overflow-hidden transition-all ${
                selected === d.id
                  ? "border-[#C9A84C]/40 bg-[#C9A84C]/5"
                  : "border-white/[0.06] bg-[#0E0E0E] hover:border-white/[0.12]"
              }`}
            >
              <img src={d.mockupUrl} alt={d.projectName} className="w-full h-36 object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-sm text-white leading-tight">{d.projectName}</p>
                  <span className={`flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColor[d.status]}`}>
                    v{d.version}
                  </span>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusColor[d.status]}`}>
                  {statusLabel[d.status]}
                </span>
                <p className="text-[11px] text-white/25 mt-2">Submitted {d.submittedAt}</p>
              </div>
            </button>
          ))}

          {designApprovals.length === 0 && (
            <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-10 text-center">
              <p className="text-white/30 text-sm">No designs pending review</p>
            </div>
          )}
        </div>

        {/* Main panel */}
        {selectedDesign ? (
          <div className="lg:col-span-2 space-y-4">
            {/* Mockup viewer */}
            <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div>
                  <h2 className="font-semibold text-white">{selectedDesign.projectName}</h2>
                  <p className="text-[11px] text-white/35 mt-0.5">Version {selectedDesign.version} · Submitted {selectedDesign.submittedAt}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${statusColor[selectedDesign.status]}`}>
                    {statusLabel[selectedDesign.status]}
                  </span>
                  <button className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors">
                    <Download className="h-4 w-4 text-white/50" />
                  </button>
                </div>
              </div>

              {compareMode ? (
                <div className="grid grid-cols-2 gap-0">
                  <div className="relative">
                    <div className="absolute top-3 left-3 text-[10px] bg-black/60 backdrop-blur-md text-white/60 px-2 py-1 rounded-lg border border-white/10">Current v{selectedDesign.version}</div>
                    <img src={selectedDesign.mockupUrl} alt="Current" className="w-full h-80 object-cover" />
                  </div>
                  <div className="relative border-l border-white/[0.06]">
                    <div className="absolute top-3 left-3 text-[10px] bg-black/60 backdrop-blur-md text-[#C9A84C]/80 px-2 py-1 rounded-lg border border-[#C9A84C]/20">Previous v{selectedDesign.version - 1}</div>
                    <img src={selectedDesign.mockupUrl} alt="Previous" className="w-full h-80 object-cover opacity-60 grayscale" />
                  </div>
                </div>
              ) : (
                <img src={selectedDesign.mockupUrl} alt="Design Mockup" className="w-full h-80 object-cover" />
              )}
            </div>

            {/* Comments */}
            {selectedDesign.comments.length > 0 && (
              <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#C9A84C]" /> Revision Notes
                </h3>
                <div className="space-y-2">
                  {selectedDesign.comments.map((c, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                      <div className="h-6 w-6 rounded-full bg-rose-400/15 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-rose-400">
                        {i + 1}
                      </div>
                      <p className="text-sm text-white/60">{c}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {selectedDesign.status === "pending" && (
              <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-5 space-y-4">
                <h3 className="text-sm font-semibold text-white">Your Decision</h3>

                <AnimatePresence>
                  {showCommentBox && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Describe what changes are needed…"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-rose-400/40 outline-none text-white placeholder:text-white/20 text-sm resize-none transition-all mb-3"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex gap-3">
                  <button
                    onClick={() => { approveDesign(selectedDesign.id); setSelected(null); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-400/15 border border-emerald-400/30 hover:bg-emerald-400/25 text-emerald-400 font-semibold text-sm transition-all"
                  >
                    <Check className="h-4 w-4" /> Approve Design
                  </button>
                  <button
                    onClick={() => {
                      if (showCommentBox && comment.trim()) {
                        requestChanges(selectedDesign.id, comment);
                        setComment("");
                        setShowCommentBox(false);
                      } else {
                        setShowCommentBox(!showCommentBox);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-400/15 border border-rose-400/30 hover:bg-rose-400/25 text-rose-400 font-semibold text-sm transition-all"
                  >
                    <X className="h-4 w-4" />
                    {showCommentBox && comment ? "Submit Changes" : "Request Changes"}
                  </button>
                </div>
              </div>
            )}

            {selectedDesign.status !== "pending" && (
              <div className={`rounded-2xl border p-5 ${selectedDesign.status === "approved" ? "bg-emerald-400/5 border-emerald-400/20" : "bg-rose-400/5 border-rose-400/20"}`}>
                <div className="flex items-center gap-3">
                  {selectedDesign.status === "approved" ? (
                    <Check className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <X className="h-5 w-5 text-rose-400" />
                  )}
                  <p className={`font-medium text-sm ${selectedDesign.status === "approved" ? "text-emerald-400" : "text-rose-400"}`}>
                    {selectedDesign.status === "approved" ? "Design approved — proceeding to prototype" : "Changes requested — awaiting updated design"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-2 rounded-2xl bg-[#0E0E0E] border border-white/[0.06] flex items-center justify-center h-64">
            <p className="text-white/25 text-sm">Select a design to review</p>
          </div>
        )}
      </div>
    </div>
  );
}
