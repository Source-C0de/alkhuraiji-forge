import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FolderKanban,
  CheckSquare,
  FlaskConical,
  Factory,
  PackageCheck,
  Plus,
  ArrowRight,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Clock,
  TrendingUp,
} from "lucide-react";
import { useClientStore } from "@/store/clientStore";
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/client/")({
  component: ClientOverview,
});

const STATUS_LABEL: Record<string, string> = {
  request_submitted: "Submitted",
  consultation_approved: "Consultation",
  design_in_progress: "Design",
  prototype_development: "Prototype",
  sample_approval: "Sample Review",
  production_started: "In Production",
  quality_inspection: "QC",
  packaging: "Packaging",
  shipping: "Shipping",
  completed: "Completed",
};

const STATUS_COLOR: Record<string, string> = {
  request_submitted: "bg-blue-400/20 text-blue-400",
  consultation_approved: "bg-violet-400/20 text-violet-400",
  design_in_progress: "bg-amber-400/20 text-amber-400",
  prototype_development: "bg-orange-400/20 text-orange-400",
  sample_approval: "bg-sky-400/20 text-sky-400",
  production_started: "bg-emerald-400/20 text-emerald-400",
  quality_inspection: "bg-teal-400/20 text-teal-400",
  packaging: "bg-indigo-400/20 text-indigo-400",
  shipping: "bg-pink-400/20 text-pink-400",
  completed: "bg-green-400/20 text-green-400",
};

const TIMELINE_STEPS = [
  "Request Submitted",
  "Consultation",
  "Design",
  "Prototype",
  "Sample Approval",
  "Production",
  "QC",
  "Packaging",
  "Shipping",
];

function ProgressRing({ value, size = 56 }: { value: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={4} stroke="rgba(201,168,76,0.12)" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r} strokeWidth={4}
        stroke="#C9A84C" fill="none"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
    </svg>
  );
}

function ClientOverview() {
  const { profile, projects, designApprovals, samples, orders, messages, setActiveSection } = useClientStore();

  const activeProjects = projects.filter((p) => p.status !== "completed").length;
  const pendingApprovals = designApprovals.filter((d) => d.status === "pending").length;
  const samplesInReview = samples.filter((s) => s.status === "delivered").length;
  const productionOrders = orders.length;
  const unreadMessages = messages.filter((m) => m.sender === "manager" && !m.read).length;

  const QUICK_STATS = [
    { label: "Active Projects", value: activeProjects, icon: FolderKanban, color: "#C9A84C", change: "+1 this month", section: "my-projects" as const },
    { label: "Pending Approvals", value: pendingApprovals, icon: CheckSquare, color: "#818cf8", change: "Action needed", section: "design-approvals" as const },
    { label: "Samples in Review", value: samplesInReview, icon: FlaskConical, color: "#34d399", change: "Awaiting feedback", section: "samples" as const },
    { label: "Production Orders", value: productionOrders, icon: Factory, color: "#fb923c", change: "On schedule", section: "production" as const },
    { label: "Unread Messages", value: unreadMessages, icon: MessageSquare, color: "#38bdf8", change: "From your team", section: "messaging" as const },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Welcome Hero */}
      <motion.div variants={itemVariants} className="relative rounded-2xl overflow-hidden border border-white/[0.07] bg-gradient-to-br from-[#111] via-[#0d0d0d] to-[#0a0a0a] p-8 md:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_100%_50%,rgba(201,168,76,0.07),transparent)]" />
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-[radial-gradient(circle,rgba(201,168,76,0.08),transparent_70%)]" />

        {/* Decorative lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px w-8 bg-[#C9A84C]" />
              <span className="text-[#C9A84C]/70 text-xs font-medium tracking-[0.15em] uppercase">Manufacturing Dashboard</span>
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back,{" "}
              <span className="text-gradient-gold">{profile?.name?.split(" ")[0]}</span>
            </h1>
            <p className="text-white/40 text-sm max-w-md">
              {profile?.company} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <p className="text-white/30 text-sm mt-1">You have <span className="text-[#C9A84C] font-medium">{pendingApprovals} approval{pendingApprovals !== 1 ? "s" : ""}</span> and <span className="text-sky-400 font-medium">{unreadMessages} message{unreadMessages !== 1 ? "s" : ""}</span> waiting.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveSection("new-request")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] text-black font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
            >
              <Plus className="h-4 w-4" />
              Start New Product
            </button>
            <button
              onClick={() => setActiveSection("production")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-white/80 font-medium text-sm transition-all"
            >
              <TrendingUp className="h-4 w-4" />
              Track Order
            </button>
            <button
              onClick={() => setActiveSection("messaging")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] hover:bg-white/[0.1] text-white/80 font-medium text-sm transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              Contact Manager
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {QUICK_STATS.map((stat) => (
          <motion.button
            key={stat.label}
            onClick={() => setActiveSection(stat.section)}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative p-5 rounded-2xl bg-[#0E0E0E] border border-white/[0.06] hover:border-white/[0.12] text-left transition-all overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `radial-gradient(circle at 80% 20%, ${stat.color}08, transparent 60%)` }} />
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}15` }}>
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-white/20 group-hover:text-white/50 transition-colors" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-[11px] text-white/40 leading-tight">{stat.label}</p>
            <p className="text-[10px] mt-1.5" style={{ color: `${stat.color}99` }}>{stat.change}</p>
          </motion.button>
        ))}
      </motion.div>

      {/* Projects + Production Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Active Projects */}
        <motion.div variants={itemVariants} className="lg:col-span-3 rounded-2xl bg-[#0E0E0E] border border-white/[0.06] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <div>
              <h2 className="font-display text-base font-semibold text-white">Active Projects</h2>
              <p className="text-xs text-white/35 mt-0.5">Your current manufacturing pipeline</p>
            </div>
            <button onClick={() => setActiveSection("my-projects")} className="flex items-center gap-1.5 text-xs text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors font-medium">
              View all <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors group">
                <div className="h-10 w-10 rounded-xl overflow-hidden flex-shrink-0 bg-white/[0.04]">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white/20">
                      <PackageCheck className="h-5 w-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white truncate">{project.name}</p>
                    <span className={`flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[project.status]}`}>
                      {STATUS_LABEL[project.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#C9A84C]/80 to-[#C9A84C]"
                      />
                    </div>
                    <span className="text-[11px] text-white/40 flex-shrink-0">{project.progress}%</span>
                  </div>
                  <p className="text-[11px] text-white/25 mt-1">ETA: {project.estimatedDelivery} · {project.quantity.toLocaleString()} units</p>
                </div>
                <button
                  onClick={() => setActiveSection("my-projects")}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1]"
                >
                  <ArrowRight className="h-3.5 w-3.5 text-white/50" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Production Snapshot */}
        <motion.div variants={itemVariants} className="lg:col-span-2 flex flex-col gap-4">
          {/* Order Progress */}
          {orders.map((order) => {
            const pct = Math.round((order.unitsCompleted / order.units) * 100);
            const radialData = [{ name: "Completed", value: pct, fill: "#C9A84C" }];
            return (
              <div key={order.id} className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-display text-sm font-semibold text-white">Production Snapshot</h3>
                  <button onClick={() => setActiveSection("production")} className="text-[11px] text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors">Details →</button>
                </div>
                <p className="text-[11px] text-white/30 mb-4">{order.projectName}</p>
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <ProgressRing value={pct} size={72} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-[#C9A84C]">{pct}%</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-white/40">Units Produced</span>
                        <span className="text-white font-medium">{order.unitsCompleted.toLocaleString()} / {order.units.toLocaleString()}</span>
                      </div>
                      <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full bg-[#C9A84C] rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${order.qcStatus === "passed" ? "bg-emerald-400/15 text-emerald-400" : "bg-amber-400/15 text-amber-400"}`}>
                        QC: {order.qcStatus.replace("_", " ")}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-white/[0.06] text-white/40">
                        ETA: {order.estimatedDelivery}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* AI Recommendations */}
          <div className="rounded-2xl bg-gradient-to-br from-[#C9A84C]/8 to-transparent border border-[#C9A84C]/15 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-[#C9A84C]" />
              <span className="text-sm font-semibold text-white">AI Recommendations</span>
            </div>
            <p className="text-[11px] text-white/40 mb-3 leading-relaxed">Based on your Oud Noir Elixir performance, consider launching a matching body mist collection to maximize your brand line.</p>
            <button
              onClick={() => setActiveSection("new-request")}
              className="flex items-center gap-2 text-[11px] font-semibold text-[#C9A84C] hover:text-[#D4B86A] transition-colors"
            >
              Start a new request <ChevronRight className="h-3 w-3" />
            </button>
          </div>

          {/* Quick Timeline */}
          <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Production Timeline</h3>
            <div className="space-y-2">
              {TIMELINE_STEPS.map((step, i) => {
                const project = projects[0];
                const statusIndex = Object.keys(STATUS_LABEL).indexOf(project?.status ?? "");
                const done = i < statusIndex;
                const active = i === statusIndex;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center border ${done ? "bg-[#C9A84C] border-[#C9A84C]" : active ? "border-[#C9A84C] bg-[#C9A84C]/10" : "border-white/[0.08] bg-transparent"}`}>
                      {done ? (
                        <svg className="h-3 w-3 text-black" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      ) : active ? (
                        <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
                      ) : null}
                    </div>
                    <span className={`text-[11px] ${done ? "text-white/60 line-through" : active ? "text-[#C9A84C] font-medium" : "text-white/25"}`}>{step}</span>
                    {active && <span className="ml-auto text-[10px] text-[#C9A84C]/60 flex items-center gap-1"><Clock className="h-3 w-3" /> Active</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Messages */}
      <motion.div variants={itemVariants} className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
          <h2 className="font-display text-base font-semibold text-white">Recent Messages</h2>
          <button onClick={() => setActiveSection("messaging")} className="flex items-center gap-1.5 text-xs text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors font-medium">
            Open inbox <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {messages.slice(0, 3).map((msg) => (
            <div key={msg.id} className={`flex items-start gap-4 px-6 py-4 hover:bg-white/[0.02] transition-colors ${!msg.read && msg.sender === "manager" ? "bg-[#C9A84C]/[0.03]" : ""}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold ${msg.sender === "manager" ? "bg-[#C9A84C]/15 text-[#C9A84C]" : "bg-white/[0.08] text-white/60"}`}>
                {msg.senderName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-white">{msg.senderName}</span>
                  {!msg.read && msg.sender === "manager" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C]" />
                  )}
                  <span className="ml-auto text-[11px] text-white/25">
                    {new Date(msg.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[12px] text-white/40 line-clamp-1">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
