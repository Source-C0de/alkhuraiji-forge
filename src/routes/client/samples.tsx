import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { Check, X, Truck, Package, MessageSquare, Star } from "lucide-react";
import { useClientStore, type Sample } from "@/store/clientStore";

export const Route = createFileRoute("/client/samples")({
  component: SamplesAndPrototypes,
});

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  in_transit: { label: "In Transit", color: "text-sky-400 bg-sky-400/10 border-sky-400/20", icon: Truck },
  delivered: { label: "Delivered — Awaiting Review", color: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: Package },
  approved: { label: "Sample Approved", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20", icon: Check },
  rejected: { label: "Changes Requested", color: "text-rose-400 bg-rose-400/10 border-rose-400/20", icon: X },
};

function SampleCard({ sample }: { sample: Sample }) {
  const { approveSample, rejectSample } = useClientStore();
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const cfg = STATUS_CONFIG[sample.status];
  const StatusIcon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all group"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-white/[0.02]">
        <img
          src={sample.imageUrl}
          alt={sample.projectName}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
        <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-semibold ${cfg.color}`}>
          <StatusIcon className="h-3 w-3" />
          {cfg.label}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display font-semibold text-white mb-1">{sample.projectName}</h3>

        {/* Tracking */}
        <div className="flex items-center gap-2 mb-4">
          <Truck className="h-3.5 w-3.5 text-white/25" />
          <span className="text-[11px] text-white/35">{sample.trackingNumber}</span>
          {sample.deliveredAt && (
            <span className="ml-auto text-[11px] text-white/25">Delivered {sample.deliveredAt}</span>
          )}
        </div>

        {/* Existing feedback */}
        {sample.feedback && (
          <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-3.5 w-3.5 text-[#C9A84C]" />
              <span className="text-[11px] font-medium text-[#C9A84C]">Your Feedback</span>
            </div>
            <p className="text-[12px] text-white/50">{sample.feedback}</p>
          </div>
        )}

        {/* Rating (for delivered samples) */}
        {sample.status === "delivered" && (
          <div className="mb-3">
            <p className="text-xs text-white/35 mb-2">Rate this sample</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-all ${rating >= star ? "text-[#C9A84C]" : "text-white/15 hover:text-white/40"}`}
                >
                  <Star className="h-5 w-5" fill={rating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {sample.status === "delivered" && (
          <div className="space-y-3">
            {showFeedback && (
              <motion.textarea
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Describe what needs to change…"
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-rose-400/40 outline-none text-white placeholder:text-white/20 text-sm resize-none"
              />
            )}
            <div className="flex gap-2">
              <button
                onClick={() => approveSample(sample.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-400/15 border border-emerald-400/30 hover:bg-emerald-400/25 text-emerald-400 text-sm font-semibold transition-all"
              >
                <Check className="h-4 w-4" /> Approve
              </button>
              <button
                onClick={() => {
                  if (showFeedback && feedback.trim()) {
                    rejectSample(sample.id, feedback);
                  } else {
                    setShowFeedback(!showFeedback);
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-400/15 border border-rose-400/30 hover:bg-rose-400/25 text-rose-400 text-sm font-semibold transition-all"
              >
                <X className="h-4 w-4" />
                {showFeedback && feedback ? "Submit" : "Reject"}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SamplesAndPrototypes() {
  const { samples } = useClientStore();
  const pending = samples.filter((s) => s.status === "delivered").length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Samples & Prototypes</h1>
        <p className="text-white/35 text-sm mt-1">Review physical samples before full production begins</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Samples", value: samples.length, color: "#C9A84C" },
          { label: "Awaiting Review", value: pending, color: "#fbbf24" },
          { label: "Approved", value: samples.filter((s) => s.status === "approved").length, color: "#34d399" },
          { label: "Changes Needed", value: samples.filter((s) => s.status === "rejected").length, color: "#f87171" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-5">
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-[11px] text-white/35">{stat.label}</p>
            <div className="mt-3 h-0.5 rounded-full" style={{ backgroundColor: `${stat.color}40`, width: "100%" }}>
              <div className="h-full rounded-full" style={{ backgroundColor: stat.color, width: stat.value > 0 ? "60%" : "0%" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Sample Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {samples.map((s) => <SampleCard key={s.id} sample={s} />)}
      </div>

      {samples.length === 0 && (
        <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-16 text-center">
          <Package className="h-12 w-12 text-white/[0.08] mx-auto mb-4" />
          <p className="text-white/30 text-sm">No samples dispatched yet. They'll appear here once shipped.</p>
        </div>
      )}
    </div>
  );
}
