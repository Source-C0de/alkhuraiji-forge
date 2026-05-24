import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useI18n } from "@/i18n/context";
import logo from "@/assets/logo.png";

export function Footer() {
  const { t } = useI18n();
  const links = [
    { to: "/about", label: t.nav.about },
    { to: "/services", label: t.nav.services },
    { to: "/process", label: t.nav.process },
    { to: "/industries", label: t.nav.industries },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  return (
    <footer className="relative border-t border-border bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-3 md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 overflow-hidden rounded-lg bg-card p-1 ring-1 ring-border">
              <img src={logo} alt={t.brand} className="h-full w-full object-contain" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-sm font-semibold">{t.brand}</div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{t.tagline}</div>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">{t.footer.tagline}</p>
        </div>

        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t.footer.explore}</div>
          <ul className="space-y-2.5 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-foreground/80 transition hover:text-primary">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t.footer.contact}</div>
          <ul className="space-y-2.5 text-sm text-foreground/80">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /> {t.contact.location}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> partnerships@alkhuraiji.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> +966 11 000 0000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-muted-foreground md:px-8">
          {t.footer.legal}
        </div>
      </div>
    </footer>
  );
}
