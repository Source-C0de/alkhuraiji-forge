import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ShoppingBag, Truck, Download, RefreshCw, ExternalLink } from "lucide-react";
import { useClientStore } from "@/store/clientStore";

export const Route = createFileRoute("/client/orders")({
  component: OrdersAndInvoices,
});

const QC_COLOR: Record<string, string> = {
  pending: "text-white/40 bg-white/[0.05]",
  in_progress: "text-amber-400 bg-amber-400/10",
  passed: "text-emerald-400 bg-emerald-400/10",
  failed: "text-rose-400 bg-rose-400/10",
};

const MOCK_INVOICES = [
  { id: "INV-2026-041", project: "Rose Velvet Serum", amount: "AED 48,000", date: "2026-04-15", status: "Paid" },
  { id: "INV-2026-022", project: "Oud Noir Elixir", amount: "AED 32,500", date: "2026-04-10", status: "Paid" },
  { id: "INV-2026-067", project: "Midnight Mist Body Spray", amount: "AED 19,200", date: "2026-05-05", status: "Pending" },
];

function ProgressBar({ value, color = "#C9A84C" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
}

function OrdersAndInvoices() {
  const { orders, projects } = useClientStore();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Orders & Invoices</h1>
        <p className="text-white/35 text-sm mt-1">Monitor production orders and manage billing</p>
      </div>

      {/* Production Orders */}
      <section>
        <h2 className="font-display text-base font-semibold text-white mb-4">Production Orders</h2>
        <div className="space-y-4">
          {orders.map((order) => {
            const project = projects.find((p) => p.id === order.projectId);
            const pct = Math.round((order.unitsCompleted / order.units) * 100);
            const pkgPct = order.packagingStatus === "completed" ? 100 : order.packagingStatus === "in_progress" ? 45 : 0;

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display font-semibold text-white">{order.projectName}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${QC_COLOR[order.qcStatus]}`}>
                        QC {order.qcStatus.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-white/30">
                      <span>Order: #{order.id.toUpperCase()}</span>
                      <span>·</span>
                      <span>Created: {order.createdAt}</span>
                      {order.trackingNumber && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Truck className="h-3 w-3" />{order.trackingNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/50 hover:text-white hover:bg-white/[0.08] text-xs font-medium transition-all">
                      <RefreshCw className="h-3.5 w-3.5" /> Reorder
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-white/50 hover:text-white hover:bg-white/[0.08] text-xs font-medium transition-all">
                      <ExternalLink className="h-3.5 w-3.5" /> Track
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Unit production */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-white/35">Units Produced</span>
                      <span className="text-[#C9A84C] font-semibold">{pct}%</span>
                    </div>
                    <ProgressBar value={pct} color="#C9A84C" />
                    <p className="text-[11px] text-white/25 mt-1.5">{order.unitsCompleted.toLocaleString()} / {order.units.toLocaleString()} units</p>
                  </div>

                  {/* QC */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-white/35">Quality Inspection</span>
                      <span className="text-violet-400 font-semibold capitalize">{order.qcStatus.replace("_", " ")}</span>
                    </div>
                    <ProgressBar value={order.qcStatus === "passed" ? 100 : order.qcStatus === "in_progress" ? 60 : 0} color="#818cf8" />
                  </div>

                  {/* Packaging */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-2">
                      <span className="text-white/35">Packaging</span>
                      <span className="text-sky-400 font-semibold capitalize">{order.packagingStatus.replace("_", " ")}</span>
                    </div>
                    <ProgressBar value={pkgPct} color="#38bdf8" />
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-5 pt-5 border-t border-white/[0.05]">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <p className="text-[11px] text-white/40 flex-1">
                    Estimated delivery: <span className="text-white/70 font-medium">{order.estimatedDelivery}</span>
                  </p>
                  <span className="text-[11px] text-[#C9A84C]/60">{7 - Math.floor(Math.random() * 3)} business days remaining</span>
                </div>
              </motion.div>
            );
          })}

          {orders.length === 0 && (
            <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-16 text-center">
              <ShoppingBag className="h-12 w-12 text-white/[0.08] mx-auto mb-4" />
              <p className="text-white/30 text-sm">No active production orders</p>
            </div>
          )}
        </div>
      </section>

      {/* Invoices */}
      <section>
        <h2 className="font-display text-base font-semibold text-white mb-4">Invoices</h2>
        <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] overflow-hidden">
          <div className="grid grid-cols-5 px-6 py-3 border-b border-white/[0.05] text-[10px] font-semibold text-white/30 uppercase tracking-wider">
            <span>Invoice ID</span>
            <span className="col-span-2">Project</span>
            <span>Amount</span>
            <span className="text-right">Status</span>
          </div>
          {MOCK_INVOICES.map((inv, i) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="grid grid-cols-5 items-center px-6 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group"
            >
              <span className="font-mono text-[11px] text-white/50">{inv.id}</span>
              <span className="col-span-2 text-sm text-white/70">{inv.project}</span>
              <span className="font-semibold text-white text-sm">{inv.amount}</span>
              <div className="flex items-center justify-end gap-3">
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${inv.status === "Paid" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                  {inv.status}
                </span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1]">
                  <Download className="h-3.5 w-3.5 text-white/50" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
