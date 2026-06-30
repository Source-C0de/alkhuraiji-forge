import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Send,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  Clock,
  XCircle,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { useSupportStore } from "@/store/supportStore";
import { useClientStore } from "@/store/clientStore";
import { useI18n } from "@/i18n/context";
import type { TicketStatus } from "@/store/supportStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/client/support/$ticketId")({
  component: ClientTicketDetail,
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

function ClientTicketDetail() {
  const { ticketId } = Route.useParams();
  const { t } = useI18n();
  const navigate = useNavigate();

  const ticket = useSupportStore((s) => s.getTicket(ticketId));
  const addMessage = useSupportStore((s) => s.addMessage);
  const updateTicketStatus = useSupportStore((s) => s.updateTicketStatus);

  const profile = useClientStore((s) => s.profile);

  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ticket) {
      // Defer to allow render
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
        <h2 className="text-lg font-semibold text-white">
          {t.support.ticketDetail.ticketNotFound}
        </h2>
        <Link
          to="/client/support"
          className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white text-sm font-medium transition-colors"
        >
          {t.support.ticketDetail.backToList}
        </Link>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[ticket.status];
  const isClosed = ticket.status === "closed";

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim() || !profile) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 250));
    addMessage(ticket.id, reply.trim(), "client", profile.name);
    setReply("");
    setSending(false);
  };

  const toggleClosed = () => {
    if (isClosed) {
      updateTicketStatus(ticket.id, "open");
      toast.success("Ticket reopened.");
    } else {
      updateTicketStatus(ticket.id, "closed");
      toast.success("Ticket closed.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => navigate({ to: "/client/support" })}
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.support.ticketDetail.back}
        </button>
        <span className="font-mono text-[11px] text-white/30">{ticket.id}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Main thread */}
        <div className="space-y-4">
          {/* Header card */}
          <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-6">
            <h1 className="font-display text-xl font-bold text-white">{ticket.subject}</h1>
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
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border border-white/[0.08] bg-white/[0.04] text-white/60 uppercase tracking-wider">
                {t.support.priority[ticket.priority]}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border border-white/[0.08] bg-white/[0.04] text-white/60 uppercase tracking-wider">
                {t.support.category[ticket.category]}
              </span>
            </div>
          </div>

          {/* Conversation */}
          <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] overflow-hidden">
            <div className="px-6 py-3 border-b border-white/[0.05] text-[10px] font-semibold text-white/30 uppercase tracking-wider">
              {t.support.ticketDetail.conversation}
            </div>
            <div className="px-6 py-6 space-y-5 max-h-[480px] overflow-y-auto scrollbar-hide">
              {sortedMessages.map((msg) => {
                const isClient = msg.sender === "client";
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn("flex gap-3", isClient ? "flex-row-reverse" : "flex-row")}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold",
                        isClient
                          ? "bg-gradient-to-br from-[#C9A84C] to-[#8B6914] text-black"
                          : "bg-white/[0.08] border border-white/[0.1] text-white/70",
                      )}
                    >
                      {(isClient ? profile?.name : msg.senderName)?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3",
                        isClient
                          ? "bg-gradient-to-br from-[#C9A84C]/20 to-[#C9A84C]/[0.06] border border-[#C9A84C]/20 text-white rounded-tr-md"
                          : "bg-white/[0.04] border border-white/[0.08] text-white/85 rounded-tl-md",
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold">
                          {isClient
                            ? t.support.ticketDetail.you
                            : t.support.ticketDetail.supportTeam}
                        </span>
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
              className="border-t border-white/[0.06] p-4 flex gap-3 items-end bg-[#0A0A0A]/40"
            >
              <textarea
                rows={2}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder={t.support.ticketDetail.replyPlaceholder}
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/20 text-sm resize-none transition-all"
              />
              <button
                type="submit"
                disabled={!reply.trim() || sending}
                className="flex-shrink-0 h-11 w-11 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] disabled:opacity-40 disabled:cursor-not-allowed text-black flex items-center justify-center transition-all"
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

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                {t.support.ticketDetail.status}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border",
                  STATUS_COLORS[ticket.status],
                )}
              >
                <StatusIcon className="h-3 w-3" />
                {t.support.status[ticket.status]}
              </span>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                {t.support.ticketDetail.priority}
              </span>
              <span className="text-xs text-white/70">{t.support.priority[ticket.priority]}</span>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                {t.support.ticketDetail.category}
              </span>
              <span className="text-xs text-white/70">{t.support.category[ticket.category]}</span>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                {t.support.ticketDetail.created}
              </span>
              <span className="text-xs text-white/70">
                {new Date(ticket.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </span>
            </div>
            <div className="h-px bg-white/[0.06]" />
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                {t.support.ticketDetail.updated}
              </span>
              <span className="text-xs text-white/70">
                {new Date(ticket.updatedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                })}
              </span>
            </div>
          </div>

          <button
            onClick={toggleClosed}
            className={cn(
              "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all",
              isClosed
                ? "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white"
                : "bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-300",
            )}
          >
            {isClosed ? (
              <>
                <RotateCcw className="h-4 w-4" />
                {t.support.ticketDetail.reopenTicket}
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                {t.support.ticketDetail.closeTicket}
              </>
            )}
          </button>
        </aside>
      </div>
    </div>
  );
}
