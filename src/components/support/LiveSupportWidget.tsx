import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, User } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";
import { toast } from "sonner";
import { useSupportStore } from "@/store/supportStore";
import { ContactChannelsPanel } from "@/components/support/ContactChannelsPanel";
import { useI18n } from "@/i18n/context";

const HIDDEN_PREFIXES = ["/admin", "/client"];

const inputCls =
  "w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/20 text-sm transition-all";

export function LiveSupportWidget() {
  const { t } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hidden = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));

  const open = useSupportStore((s) => s.liveChatOpen);
  const setOpen = useSupportStore((s) => s.setLiveChatOpen);
  const createTicket = useSupportStore((s) => s.createTicket);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [question, setQuestion] = useState("");
  const [sending, setSending] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !question.trim()) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 350));
    createTicket({
      clientId: "guest",
      clientName: name.trim(),
      clientEmail: email.trim(),
      category: "general",
      subject: question.trim().slice(0, 60),
      description: question.trim(),
      priority: "normal",
    });
    setName("");
    setEmail("");
    setQuestion("");
    setSending(false);
    toast.success(t.support.widget.success);
  };

  if (hidden) return null;

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            key="launcher"
            initial={{ opacity: 0, scale: 0.6, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setOpen(true)}
            aria-label={t.support.widget.launcherTitle}
            className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] text-black shadow-[0_8px_32px_rgba(201,168,76,0.45)] hover:shadow-[0_12px_40px_rgba(201,168,76,0.6)] flex items-center justify-center group"
          >
            <MessageCircle className="h-6 w-6 transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#070707] animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[380px] max-h-[calc(100vh-3rem)] rounded-3xl bg-[#0E0E0E]/95 backdrop-blur-xl border border-white/[0.1] shadow-[0_24px_80px_-12px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
            role="dialog"
            aria-labelledby="live-support-title"
          >
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.07] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative flex-shrink-0 h-10 w-10 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/25 flex items-center justify-center">
                  <User className="h-5 w-5 text-[#C9A84C]" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0E0E0E]" />
                </div>
                <div className="min-w-0">
                  <p id="live-support-title" className="text-sm font-semibold text-white truncate">
                    {t.support.widget.panelTitle}
                  </p>
                  <p className="text-[11px] text-white/40 truncate">
                    {t.support.widget.panelSubtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={t.common.close}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-white/[0.05] text-white/40 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide px-5 py-5 space-y-6">
              <ContactChannelsPanel showTitles />

              <div className="h-px bg-white/[0.06]" />

              <div>
                <h4 className="text-xs font-semibold text-white/40 uppercase tracking-[0.18em] mb-3">
                  {t.support.widget.quickTitle}
                </h4>
                <form onSubmit={onSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.support.widget.fields.name}
                    required
                    className={inputCls}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.support.widget.fields.email}
                    required
                    className={inputCls}
                  />
                  <textarea
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={t.support.widget.fields.question}
                    required
                    className={`${inputCls} resize-none`}
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] disabled:opacity-70 text-black font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
                  >
                    {sending ? (
                      <span className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t.support.widget.submit}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-white/[0.07] bg-[#0A0A0A]/60">
              <p className="text-[10px] text-white/30 leading-relaxed">
                {t.support.widget.offlineNotice}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
