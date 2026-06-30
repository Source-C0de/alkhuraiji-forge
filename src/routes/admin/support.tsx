import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  LifeBuoy,
  Search,
  ChevronRight,
  AlertCircle,
  Clock,
  CheckCircle2,
  Inbox,
} from "lucide-react";
import { useSupportStore } from "@/store/supportStore";
import { useI18n } from "@/i18n/context";
import type { TicketStatus, TicketPriority } from "@/store/supportStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/support")({
  component: AdminSupportInbox,
});

const STATUS_FILTERS: { key: TicketStatus | "all"; i18nKey: string }[] = [
  { key: "all", i18nKey: "all" },
  { key: "open", i18nKey: "open" },
  { key: "in_progress", i18nKey: "inProgress" },
  { key: "awaiting_customer", i18nKey: "awaiting" },
  { key: "resolved", i18nKey: "resolved" },
  { key: "closed", i18nKey: "closed" },
];

const PRIORITY_FILTERS: { key: TicketPriority | "all"; i18nKey: string }[] = [
  { key: "all", i18nKey: "all" },
  { key: "urgent", i18nKey: "urgent" },
  { key: "high", i18nKey: "high" },
  { key: "normal", i18nKey: "normal" },
  { key: "low", i18nKey: "low" },
];

const STATUS_BADGE_CLS: Record<TicketStatus, string> = {
  open: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  in_progress: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  awaiting_customer: "bg-violet-400/10 text-violet-400 border-violet-400/20",
  resolved: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  closed: "bg-white/[0.06] text-white/40 border-white/[0.1]",
};

const PRIORITY_BADGE_CLS: Record<TicketPriority, string> = {
  urgent: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  high: "bg-orange-400/10 text-orange-300 border-orange-400/30",
  normal: "bg-white/[0.04] text-white/60 border-white/[0.1]",
  low: "bg-white/[0.04] text-white/40 border-white/[0.08]",
};

function AdminSupportInbox() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const tickets = useSupportStore((s) => s.tickets);

  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tickets
      .filter((tk) => statusFilter === "all" || tk.status === statusFilter)
      .filter((tk) => priorityFilter === "all" || tk.priority === priorityFilter)
      .filter(
        (tk) =>
          !q ||
          tk.subject.toLowerCase().includes(q) ||
          tk.clientName.toLowerCase().includes(q) ||
          tk.id.toLowerCase().includes(q),
      )
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [tickets, statusFilter, priorityFilter, search]);

  const statusCounts = useMemo(() => {
    const map: Record<string, number> = { all: tickets.length };
    for (const tk of tickets) {
      map[tk.status] = (map[tk.status] ?? 0) + 1;
    }
    return map;
  }, [tickets]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center">
            <LifeBuoy className="h-6 w-6 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold">{t.support.admin.listTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t.support.admin.listSubtitle}</p>
          </div>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets, clients..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-gold/50 focus:ring-2 focus:ring-gold/20 outline-none text-sm transition-all"
          />
        </div>
      </div>

      {/* Status filter chips */}
      <div className="space-y-3">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.18em]">
          {t.support.admin.filtersTitle}
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((f) => {
            const active = statusFilter === f.key;
            const labelKey = f.i18nKey as keyof typeof t.support.status | "all";
            const label =
              labelKey === "all"
                ? t.support.admin.all
                : t.support.status[labelKey as keyof typeof t.support.status];
            const count = statusCounts[f.key] ?? 0;
            return (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all",
                  active
                    ? "bg-gold/15 text-gold border-gold/30"
                    : "bg-white/[0.04] text-white/50 border-white/[0.08] hover:text-white hover:bg-white/[0.08]",
                )}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "px-1.5 rounded-full text-[10px]",
                    active ? "bg-gold/25 text-gold" : "bg-white/[0.06] text-white/40",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap gap-2">
          {PRIORITY_FILTERS.map((f) => {
            const active = priorityFilter === f.key;
            const label =
              f.key === "all"
                ? t.support.admin.all
                : t.support.priority[f.key as keyof typeof t.support.priority];
            return (
              <button
                key={f.key}
                onClick={() => setPriorityFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[11px] font-medium border transition-all uppercase tracking-wider",
                  active
                    ? "bg-gold-soft/15 text-gold-soft border-gold-soft/30"
                    : "bg-white/[0.03] text-white/40 border-white/[0.06] hover:text-white/70",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-card border border-white/10 p-12 text-center">
          <Inbox className="h-12 w-12 text-white/15 mx-auto mb-3" />
          <p className="text-sm text-white/40">{t.support.admin.empty}</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-white/[0.05] text-[10px] font-semibold text-white/30 uppercase tracking-wider">
            <span className="col-span-2">{t.support.admin.columns.id}</span>
            <span className="col-span-2">{t.support.admin.columns.client}</span>
            <span className="col-span-3">{t.support.admin.columns.subject}</span>
            <span className="col-span-1">{t.support.admin.columns.category}</span>
            <span className="col-span-1.5">{t.support.admin.columns.status}</span>
            <span className="col-span-1.5">{t.support.admin.columns.priority}</span>
            <span className="col-span-1 text-right">{t.support.admin.columns.updated}</span>
          </div>

          {filtered.map((ticket, i) => (
            <motion.button
              key={ticket.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
              onClick={() =>
                navigate({
                  to: "/admin/support/$ticketId",
                  params: { ticketId: ticket.id },
                })
              }
              className="w-full grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors group text-left"
            >
              <span className="col-span-2 font-mono text-[11px] text-white/50 group-hover:text-gold transition-colors">
                {ticket.id}
              </span>
              <div className="col-span-2 min-w-0">
                <p className="text-sm text-white font-medium truncate">{ticket.clientName}</p>
                <p className="text-[10px] text-white/30 truncate">{ticket.clientEmail}</p>
              </div>
              <div className="col-span-3 flex items-center gap-2 min-w-0">
                {(ticket.priority === "high" || ticket.priority === "urgent") && (
                  <AlertCircle className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
                )}
                <span className="text-sm text-white/80 truncate">{ticket.subject}</span>
              </div>
              <span className="col-span-1 text-[10px] text-white/40 uppercase tracking-wider">
                {t.support.category[ticket.category]}
              </span>
              <div className="col-span-1.5">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border",
                    STATUS_BADGE_CLS[ticket.status],
                  )}
                >
                  {ticket.status === "resolved" || ticket.status === "closed" ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <Clock className="h-3 w-3" />
                  )}
                  {t.support.status[ticket.status]}
                </span>
              </div>
              <div className="col-span-1.5">
                <span
                  className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border uppercase tracking-wider",
                    PRIORITY_BADGE_CLS[ticket.priority],
                  )}
                >
                  {t.support.priority[ticket.priority]}
                </span>
              </div>
              <div className="col-span-1 flex justify-end items-center gap-2">
                <span className="text-[10px] text-white/40">
                  {new Date(ticket.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "2-digit",
                  })}
                </span>
                <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
