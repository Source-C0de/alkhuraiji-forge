import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, PackageCheck, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useClientStore, type Project } from "@/store/clientStore";

export const Route = createFileRoute("/client/projects")({
  component: MyProjects,
});

const STATUS_LABEL: Record<string, string> = {
  request_submitted: "Request Submitted",
  consultation_approved: "Consultation Approved",
  design_in_progress: "Design In Progress",
  prototype_development: "Prototype Development",
  sample_approval: "Sample Approval",
  production_started: "Production Started",
  quality_inspection: "Quality Inspection",
  packaging: "Packaging",
  shipping: "Shipping",
  completed: "Completed",
};

const STATUS_COLOR: Record<string, string> = {
  request_submitted: "bg-blue-400/15 text-blue-400 border-blue-400/20",
  consultation_approved: "bg-violet-400/15 text-violet-400 border-violet-400/20",
  design_in_progress: "bg-amber-400/15 text-amber-400 border-amber-400/20",
  prototype_development: "bg-orange-400/15 text-orange-400 border-orange-400/20",
  sample_approval: "bg-sky-400/15 text-sky-400 border-sky-400/20",
  production_started: "bg-emerald-400/15 text-emerald-400 border-emerald-400/20",
  quality_inspection: "bg-teal-400/15 text-teal-400 border-teal-400/20",
  packaging: "bg-indigo-400/15 text-indigo-400 border-indigo-400/20",
  shipping: "bg-pink-400/15 text-pink-400 border-pink-400/20",
  completed: "bg-green-400/15 text-green-400 border-green-400/20",
};

const TIMELINE_STEPS = [
  { key: "request_submitted", label: "Submitted" },
  { key: "consultation_approved", label: "Consultation" },
  { key: "design_in_progress", label: "Design" },
  { key: "prototype_development", label: "Prototype" },
  { key: "sample_approval", label: "Sample" },
  { key: "production_started", label: "Production" },
  { key: "quality_inspection", label: "QC" },
  { key: "packaging", label: "Packaging" },
  { key: "shipping", label: "Shipping" },
];

function ProjectCard({ project }: { project: Project }) {
  const statusIdx = TIMELINE_STEPS.findIndex((s) => s.key === project.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] hover:border-white/[0.12] transition-all overflow-hidden group"
    >
      {/* Thumbnail */}
      <div className="relative h-44 bg-white/[0.03] overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <PackageCheck className="h-16 w-16" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent" />
        {/* Status badge */}
        <div className={`absolute top-3 right-3 text-[10px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_COLOR[project.status]}`}>
          {STATUS_LABEL[project.status]}
        </div>
        {/* Category */}
        <div className="absolute top-3 left-3 text-[10px] font-medium px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/70 border border-white/10">
          {project.category}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-display font-semibold text-white text-base">{project.name}</h3>
            <p className="text-[11px] text-white/30 mt-0.5">Managed by {project.manager}</p>
          </div>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1]">
            <ArrowRight className="h-3.5 w-3.5 text-white/50" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[11px] mb-1.5">
            <span className="text-white/35">Progress</span>
            <span className="text-[#C9A84C] font-semibold">{project.progress}%</span>
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[#C9A84C]/70 to-[#C9A84C]"
            />
          </div>
        </div>

        {/* Mini timeline */}
        <div className="flex items-center gap-1 mb-4">
          {TIMELINE_STEPS.map((step, i) => (
            <div
              key={step.key}
              title={step.label}
              className={`flex-1 h-1 rounded-full transition-all ${
                i < statusIdx ? "bg-[#C9A84C]/60" : i === statusIdx ? "bg-[#C9A84C]" : "bg-white/[0.06]"
              }`}
            />
          ))}
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-2.5">
            <p className="text-[10px] text-white/30 mb-0.5">Quantity</p>
            <p className="text-xs font-semibold text-white">{project.quantity.toLocaleString()} units</p>
          </div>
          <div className="rounded-lg bg-white/[0.03] border border-white/[0.05] p-2.5">
            <p className="text-[10px] text-white/30 mb-0.5">ETA</p>
            <p className="text-xs font-semibold text-white">{project.estimatedDelivery}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MyProjects() {
  const { projects, setActiveSection } = useClientStore();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = projects.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">My Projects</h1>
          <p className="text-white/35 text-sm mt-1">{projects.length} total projects in your pipeline</p>
        </div>
        <button
          onClick={() => setActiveSection("new-request")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] text-black font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)] self-start"
        >
          + New Request
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/40 outline-none text-sm text-white placeholder:text-white/20 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "design_in_progress", "sample_approval", "production_started", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                filter === f
                  ? "bg-[#C9A84C]/15 border-[#C9A84C]/30 text-[#C9A84C]"
                  : "bg-white/[0.03] border-white/[0.07] text-white/40 hover:text-white/70"
              }`}
            >
              {f === "all" ? "All" : STATUS_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      ) : (
        <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-16 text-center">
          <PackageCheck className="h-12 w-12 text-white/[0.08] mx-auto mb-4" />
          <p className="text-white/30 text-sm">No projects match your search.</p>
        </div>
      )}
    </div>
  );
}
