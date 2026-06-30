import { MessageCircle, Mail, Phone } from "lucide-react";
import { useI18n } from "@/i18n/context";

const CONTACTS = {
  whatsapp: {
    number: "971501234567",
    defaultMessage: "Hello, I need help with a manufacturing question.",
    display: "+971 50 123 4567",
    sub: "Mon–Sat · 8:00–20:00 GST",
  },
  email: {
    address: "support@alkhuraiji.com",
    display: "support@alkhuraiji.com",
    sub: "Replies within 2 hours",
  },
  phone: {
    tel: "+971501234567",
    display: "+971 50 123 4567",
    sub: "24/7 emergency line",
  },
} as const;

interface ContactChannelsPanelProps {
  layout?: "stacked" | "inline";
  showTitles?: boolean;
  className?: string;
}

export function ContactChannelsPanel({
  layout = "stacked",
  showTitles = false,
  className = "",
}: ContactChannelsPanelProps) {
  const { t } = useI18n();
  const whatsappHref = `https://wa.me/${CONTACTS.whatsapp.number}?text=${encodeURIComponent(CONTACTS.whatsapp.defaultMessage)}`;
  const emailHref = `mailto:${CONTACTS.email.address}`;
  const phoneHref = `tel:${CONTACTS.phone.tel}`;

  const grid = layout === "inline" ? "grid grid-cols-1 sm:grid-cols-3 gap-3" : "space-y-3";

  return (
    <div className={className}>
      {showTitles && (
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-[0.18em] mb-3">
          {t.support.widget.channelsTitle}
        </h4>
      )}
      <div className={grid}>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex items-center gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] hover:bg-emerald-500/[0.12] transition-all ${
            layout === "inline" ? "p-4 flex-col text-center" : "p-4"
          }`}
        >
          <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center group-hover:scale-105 transition-transform">
            <MessageCircle className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">{t.support.widget.whatsappCta}</p>
            <p className="text-xs text-white/50 mt-0.5 truncate">{CONTACTS.whatsapp.display}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{CONTACTS.whatsapp.sub}</p>
          </div>
        </a>

        <a
          href={emailHref}
          className={`group flex items-center gap-4 rounded-2xl border border-[#C9A84C]/25 bg-[#C9A84C]/[0.06] hover:bg-[#C9A84C]/[0.14] transition-all ${
            layout === "inline" ? "p-4 flex-col text-center" : "p-4"
          }`}
        >
          <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/25 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Mail className="h-5 w-5 text-[#C9A84C]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">{t.support.widget.emailCta}</p>
            <p className="text-xs text-white/50 mt-0.5 truncate">{CONTACTS.email.display}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{CONTACTS.email.sub}</p>
          </div>
        </a>

        <a
          href={phoneHref}
          className={`group flex items-center gap-4 rounded-2xl border border-sky-400/20 bg-sky-400/[0.06] hover:bg-sky-400/[0.12] transition-all ${
            layout === "inline" ? "p-4 flex-col text-center" : "p-4"
          }`}
        >
          <div className="flex-shrink-0 h-11 w-11 rounded-xl bg-sky-400/15 border border-sky-400/25 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Phone className="h-5 w-5 text-sky-300" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">{t.support.widget.phoneCta}</p>
            <p className="text-xs text-white/50 mt-0.5 truncate">{CONTACTS.phone.display}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{CONTACTS.phone.sub}</p>
          </div>
        </a>
      </div>
    </div>
  );
}
