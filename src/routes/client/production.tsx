import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Factory, Package, Truck, ShieldCheck, Box, Clock } from "lucide-react";
import { useClientStore } from "@/store/clientStore";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

export const Route = createFileRoute("/client/production")({
  component: ProductionTracking,
});

const PRODUCTION_TIMELINE = [
  { stage: "Request Submitted", done: true },
  { stage: "Consultation Approved", done: true },
  { stage: "Design Finalized", done: true },
  { stage: "Prototype Ready", done: true },
  { stage: "Sample Approved", done: true },
  { stage: "Production Started", done: true, active: true },
  { stage: "Quality Inspection", done: false },
  { stage: "Packaging", done: false },
  { stage: "Shipping", done: false },
];

const DAILY_PROGRESS = [
  { day: "Mon", units: 820 },
  { day: "Tue", units: 950 },
  { day: "Wed", units: 1100 },
  { day: "Thu", units: 1040 },
  { day: "Fri", units: 1280 },
  { day: "Sat", units: 760 },
  { day: "Sun", units: 850 },
];

const QC_DATA = [
  { name: "Passed", value: 6500, fill: "#34d399" },
  { name: "In QC", value: 300, fill: "#C9A84C" },
  { name: "Failed", value: 0, fill: "#f87171" },
];

function ProgressBar({ value, color = "#C9A84C" }: { value: number; color?: string }) {
  return (
    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function ProductionTracking() {
  const { orders, projects } = useClientStore();
  const order = orders[0];
  const project = projects.find((p) => p.id === order?.projectId);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto">
        <h1 className="font-display text-3xl font-bold text-white mb-4">Production Tracking</h1>
        <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-16 text-center">
          <Factory className="h-12 w-12 text-white/[0.08] mx-auto mb-4" />
          <p className="text-white/30 text-sm">No active production orders</p>
        </div>
      </div>
    );
  }

  const pct = Math.round((order.unitsCompleted / order.units) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Production Tracking</h1>
          <p className="text-white/35 text-sm mt-1">Live monitoring of your manufacturing progress</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] text-white/30">Order ID</p>
          <p className="font-mono text-sm text-[#C9A84C] font-medium">#{order.id.toUpperCase()}</p>
        </div>
      </div>

      {/* Hero stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Factory, label: "Units in Production", value: order.units.toLocaleString(), color: "#C9A84C" },
          { icon: Package, label: "Units Completed", value: order.unitsCompleted.toLocaleString(), color: "#34d399" },
          { icon: ShieldCheck, label: "QC Status", value: order.qcStatus.replace("_", " "), color: "#818cf8" },
          { icon: Truck, label: "Est. Delivery", value: order.estimatedDelivery, color: "#38bdf8" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-20 h-20 rounded-full blur-3xl opacity-20" style={{ backgroundColor: s.color }} />
            <div className="p-2.5 rounded-xl inline-flex mb-3" style={{ backgroundColor: `${s.color}15` }}>
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <p className="text-xl font-bold text-white capitalize">{s.value}</p>
            <p className="text-[11px] text-white/35 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Timeline */}
        <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-6">
          <h2 className="font-display text-base font-semibold text-white mb-6">Stage Progress</h2>
          <div className="space-y-1">
            {PRODUCTION_TIMELINE.map((step, i) => (
              <div key={step.stage} className="relative">
                {i < PRODUCTION_TIMELINE.length - 1 && (
                  <div className={`absolute left-[13px] top-8 w-0.5 h-6 ${step.done ? "bg-[#C9A84C]/40" : "bg-white/[0.06]"}`} />
                )}
                <div className="flex items-center gap-3 py-2">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 border ${
                    step.done && !step.active ? "bg-[#C9A84C] border-[#C9A84C]"
                    : step.active ? "border-[#C9A84C] bg-[#C9A84C]/10"
                    : "border-white/[0.08] bg-transparent"
                  }`}>
                    {step.done && !step.active ? (
                      <svg className="h-3.5 w-3.5 text-black" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : step.active ? (
                      <div className="h-2 w-2 rounded-full bg-[#C9A84C] animate-pulse" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      step.done && !step.active ? "text-white/60 line-through decoration-white/20"
                      : step.active ? "text-[#C9A84C]"
                      : "text-white/25"
                    }`}>{step.stage}</p>
                    {step.active && (
                      <p className="text-[10px] text-[#C9A84C]/50 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" /> In progress
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="lg:col-span-2 space-y-5">
          {/* Overall progress */}
          <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-base font-semibold text-white">{project?.name}</h2>
                <p className="text-[11px] text-white/35 mt-0.5">Overall Production Progress</p>
              </div>
              <span className="text-2xl font-bold text-[#C9A84C]">{pct}%</span>
            </div>
            <ProgressBar value={pct} />
            <div className="flex justify-between text-[11px] text-white/30 mt-2">
              <span>0 units</span>
              <span>{order.unitsCompleted.toLocaleString()} completed</span>
              <span>{order.units.toLocaleString()} total</span>
            </div>
          </div>

          {/* Daily output chart */}
          <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-6">
            <h2 className="font-display text-base font-semibold text-white mb-4">Daily Production Output</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DAILY_PROGRESS} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="day" stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.25)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "rgba(15,15,15,0.95)", borderColor: "rgba(255,255,255,0.08)", borderRadius: "12px" }}
                    itemStyle={{ color: "#C9A84C" }}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar dataKey="units" fill="#C9A84C" radius={[4, 4, 0, 0]} fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* QC Breakdown */}
          <div className="grid grid-cols-3 gap-3">
            {QC_DATA.map((q) => (
              <div key={q.name} className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-4">
                <p className="text-lg font-bold text-white">{q.value.toLocaleString()}</p>
                <p className="text-[11px] text-white/35 mt-0.5">{q.name}</p>
                <div className="mt-2 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full rounded-full" style={{ backgroundColor: q.fill, width: `${(q.value / order.units) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
