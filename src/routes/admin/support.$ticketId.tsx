import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  RotateCcw,
  Mail,
  AlertCircle,
  Clock,
  XCircle,
  Inbox,
  User as UserIcon,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { useSupportStore } from "@/store/supportStore";
import { useI18n } from "@/i18n/context";
import type { TicketStatus, TicketPriority } from "@/store/supportStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/support/$ticketId")({
  component: AdminTicketDetail,
});

const STATUS_COLORS: Record<TicketStatus, string> = {
  open: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  in_progress: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  awaiting_customer: "bg-violet-400/10 text-violet-400 border-violet-400/20",
  resolved: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  closed: "bg-white/[0.06] text-white/40 border-white/[0.1]",
};

const STATUS_ICONS: Record<TicketStatus, React.ComponentType<{ className?: string }>> = {
  open: AlertCircle,
  in_progress: Clock,
  awaiting_customer: Clock,
  resolved: CheckCircle2,
  closed: XCircle,
};

const ADMIN_NAME = "Support Agent";
const AGENT_OPTIONS = ["Khalid Hassan", "Sara Mahmoud", "Fatima Al-Zahra", "Omar Khalil"];

function AdminTicketDetail() {
  const { ticketId } = Route.useParams();
  const { t } = useI18n();
  const navigate = useNavigate();

  const ticket = useSupportStore((s) => s.getTicket(ticketId));
  const addMessage = useSupportStore((s) => s.addMessage);
  const updateTicketStatus = useSupportStore((s) => s.updateTicketStatus);
  const updateTicketPriority = useSupportStore((s) => s.updateTicketPriority);
  const updateTicketAssignedTo = useSupportStore((s) => s.updateTicketAssignedTo);

  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ticket) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }, [ticket]);

  const sortedMessages = useMemo(
    () => (ticket ? [...ticket.messages].sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1)) : []),
    [ticket],
  );

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <Inbox className="h-12 w-12 text-white/15 mx-auto mb-4" />
        <h2 className="text-lg font-semibold">{t.support.ticketDetail.ticketNotFound}</h2>
        <Link
          to="/admin/support"
          className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-sm font-medium transition-colors"
        >
          {t.support.ticketDetail.backToList}
        </Link>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[ticket.status];
  const isResolved = ticket.status === "resolved";
  const isClosed = ticket.status === "closed";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 250));
    addMessage(ticket.id, reply.trim(), "admin", ADMIN_NAME);
    setReply("");
    setSending(false);
  };

  const handleResolve = () => {
    updateTicketStatus(ticket.id, "resolved");
    toast.success("Ticket marked as resolved.");
  };
  const handleReopen = () => {
    updateTicketStatus(ticket.id, "open");
    toast.success("Ticket reopened.");
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate({ to: "/admin/support" })}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.support.ticketDetail.back}
        </button>
        <span className="font-mono text-[11px] text-white/30">{ticket.id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main thread */}
        <div className="space-y-4">
          {/* Header card */}
          <div className="rounded-2xl bg-card border border-white/10 p-6">
            <h1 className="font-display text-xl font-bold text-foreground">{ticket.subject}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border",
                  STATUS_COLORS[ticket.status],
                )}
              >
                <StatusIcon className="h-3 w-3" />
                {t.support.status[ticket.status]}
              </span>
              <span
                className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border uppercase tracking-wider",
                  ticket.priority === "urgent"
                    ? "bg-rose-500/10 text-rose-300 border-rose-500/30"
                    : ticket.priority === "high"
                      ? "bg-orange-400/10 text-orange-300 border-orange-400/30"
                      : "bg-white/[0.04] text-white/60 border-white/[0.1]",
                )}
              >
                {t.support.priority[ticket.priority]}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border border-white/[0.1] bg-white/[0.04] text-white/60 uppercase tracking-wider">
                {t.support.category[ticket.category]}
              </span>
            </div>
          </div>

          {/* Conversation */}
          <div className="rounded-2xl bg-card border border-white/10 overflow-hidden">
            <div className="px-6 py-3 border-b border-white/[0.05] text-[10px] font-semibold text-white/30 uppercase tracking-wider">
              {t.support.ticketDetail.conversation}
            </div>
            <div className="px-6 py-6 space-y-5 max-h-[480px] overflow-y-auto scrollbar-hide">
              {sortedMessages.map((msg) => {
                const isAdmin = msg.sender === "admin";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn("flex gap-3", isAdmin ? "flex-row-reverse" : "flex-row")}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold",
                        isAdmin
                          ? "bg-gradient-to-br from-gold to-gold-soft text-black"
                          : "bg-white/[0.08] border border-white/[0.1] text-white/70",
                      )}
                    >
                      {msg.senderName.charAt(0).toUpperCase()}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        isAdmin
                          ? "bg-gold/10 border border-gold/25 text-foreground rounded-tr-md"
                          : "bg-white/[0.04] border border-white/[0.08] text-white/85 rounded-tl-md",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold">{msg.senderName}</span>
                        <span className="text-[10px] text-white/30">
                          {new Date(msg.timestamp).toLocaleString(undefined, {
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                        {msg.content}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply box */}
            <form
              onSubmit={handleSend}
              className="border-t border-white/[0.06] p-4 flex gap-3 items-end bg-black/20"
            >
              <textarea
                rows={2}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={t.support.ticketDetail.replyPlaceholder}
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-gold/50 focus:ring-2 focus:ring-gold/20 outline-none text-foreground placeholder:text-muted-foreground text-sm resize-none transition-all"
              />
              <button
                type="submit"
                disabled={!reply.trim() || sending}
                className="flex-shrink-0 h-11 w-11 rounded-xl bg-gold hover:bg-gold/90 disabled:opacity-40 disabled:cursor-not-allowed text-black flex items-center justify-center transition-all"
                aria-label={t.support.ticketDetail.reply}
              >
                {sending ? (
                  <span className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar controls */}
        <aside className="space-y-4">
          {/* Customer card */}
          <div className="rounded-2xl bg-card border border-white/10 p-5">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.18em] mb-3">
              {t.support.admin.detail.customerInfo}
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white/[0.06] border border-white/[0.1] flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-white/60" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold truncate">{ticket.clientName}</p>
                <a
                  href={`mailto:${ticket.clientEmail}`}
                  className="text-[11px] text-gold hover:text-gold-soft flex items-center gap-1 mt-0.5"
                >
                  <Mail className="h-3 w-3" />
                  {ticket.clientEmail}
                </a>
              </div>
            </div>
            {ticket.projectId && (
              <Link
                to="/client/projects"
                className="mt-4 w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs text-white/70 hover:text-white transition-colors"
              >
                View linked project
                <ExternalLink className="h-3 w-3" />
              </Link>
            )}
          </div>

          {/* Controls */}
          <div className="rounded-2xl bg-card border border-white/10 p-5 space-y-4">
            <p className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.18em]">
              {t.support.admin.detail.controls}
            </p>

            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                {t.support.ticketDetail.status}
              </label>
              <select
                value={ticket.status}
                onChange={(e) => updateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none text-sm transition-all"
              >
                <option value="open">{t.support.status.open}</option>
                <option value="in_progress">{t.support.status.in_progress}</option>
                <option value="awaiting_customer">{t.support.status.awaiting_customer}</option>
                <option value="resolved">{t.support.status.resolved}</option>
                <option value="closed">{t.support.status.closed}</option>
              </select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                {t.support.ticketDetail.priority}
              </label>
              <select
                value={ticket.priority}
                onChange={(e) => updateTicketPriority(ticket.id, e.target.value as TicketPriority)}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none text-sm transition-all"
              >
                <option value="low">{t.support.priority.low}</option>
                <option value="normal">{t.support.priority.normal}</option>
                <option value="high">{t.support.priority.high}</option>
                <option value="urgent">{t.support.priority.urgent}</option>
              </select>
            </div>

            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
                {t.support.admin.detail.assignedTo}
              </label>
              <select
                value={ticket.assignedTo ?? ""}
                onChange={(e) => updateTicketAssignedTo(ticket.id, e.target.value || "")}
                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] focus:border-gold/50 focus:ring-1 focus:ring-gold/20 outline-none text-sm transition-all"
              >
                <option value="">{t.support.admin.detail.unassigned}</option>
                {AGENT_OPTIONS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resolve / Reopen */}
          {!isResolved && !isClosed ? (
            <button
              onClick={handleResolve}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-300 font-semibold text-sm transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              {t.support.admin.detail.resolveAction}
            </button>
          ) : (
            <button
              onClick={handleReopen}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] font-semibold text-sm transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              {t.support.admin.detail.reopenAction}
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}
