import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import logo from "@/assets/logo.png";

export function Navbar() {
  const { t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  const links = [
    { to: "/", label: t.nav.home },
    { to: "/about", label: t.nav.about },
    { to: "/services", label: t.nav.services },
    { to: "/process", label: t.nav.process },
    { to: "/industries", label: t.nav.industries },
    { to: "/builder", label: "Builder" },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-border bg-background/85 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 md:h-20 md:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-card p-1 ring-1 ring-border transition group-hover:ring-primary">
            <img src={logo} alt={t.brand} className="h-full w-full object-contain" />
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-sm font-semibold tracking-tight">{t.brand}</span>
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{t.tagline}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const isActive = pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`relative rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive ? "text-primary" : "text-foreground/80 hover:text-foreground"
                }`}
              >
                {l.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
          <Link
            to="/contact"
            className="hidden rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground shadow-gold-glow transition hover:opacity-90 md:inline-flex"
          >
            {t.nav.cta}
          </Link>
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="rounded-md px-3 py-3 text-sm font-medium text-foreground/90 hover:bg-card hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/contact"
                className="mt-2 rounded-full bg-primary px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground"
              >
                {t.nav.cta}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
