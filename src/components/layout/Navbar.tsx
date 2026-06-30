import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/context";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import logo from "@/assets/logo.png";

// const COSMETICS_PRODUCTS = [
//   { id: "face-cream",  name: "Face Cream"   },
//   { id: "serum",       name: "Serum"         },
//   { id: "hair-oil",    name: "Hair Oil"      },
//   { id: "shampoo",     name: "Shampoo"       },
//   { id: "conditioner", name: "Conditioner"   },
//   { id: "body-lotion", name: "Body Lotion"   },
//   { id: "face-wash",   name: "Face Wash"     },
//   { id: "sunscreen",   name: "Sunscreen"     },
//   { id: "beard-oil",   name: "Beard Oil"     },
//   { id: "lip-balm",    name: "Lip Balm"      },
//   { id: "body-butter", name: "Body Butter"   },
//   { id: "hand-cream",  name: "Hand Cream"    },
// ];

export function Navbar() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [cosmeticsOpen, setCosmeticsOpen] = useState(false);
  const [mobileCosmeticsOpen, setMobileCosmeticsOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setCosmeticsOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setCosmeticsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCosmeticsMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCosmeticsOpen(true);
  };
  const handleCosmeticsMouseLeave = () => {
    closeTimer.current = setTimeout(() => setCosmeticsOpen(false), 150);
  };

  const navLinks = [
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
      className={`fixed inset-x-0 top-0 z-50 isolate transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-2xl backdrop-saturate-150 shadow-elevated ring-1 ring-inset ring-primary/15"
          : "bg-background/70 backdrop-blur-2xl backdrop-saturate-150 ring-1 ring-inset ring-primary/15"
      }`}
    >
      {/* Gold gradient hairline at the bottom of the navbar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      {/* Soft gold glow just above the hairline */}
      <div className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent blur-[2px]" />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:h-20 md:px-8">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3 flex-shrink-0">
          <div className="relative h-11 w-11 md:h-12 md:w-12 overflow-hidden rounded-lg bg-card p-1 ring-1 ring-primary/40 shadow-gold-glow transition-transform group-hover:scale-105">
            <img src={logo} alt={t.brand} className="h-full w-full object-contain" />
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-base font-semibold tracking-tight">{t.brand}</span>
            <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {t.tagline}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks
            .filter((l) => l.to !== "/builder")
            .map((l) => {
              const isActive = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`relative rounded-full px-4 py-2 text-[15px] font-semibold tracking-tight transition ${
                    isActive
                      ? "text-primary bg-primary/10 ring-1 ring-primary/25"
                      : "text-foreground/80 hover:text-foreground hover:bg-primary/5"
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

          {/* Focused Builder CTA — same vibe as the previous "Start Private Label" */}
          <Link
            to="/builder"
            className="relative ml-2 rounded-full bg-gradient-to-r from-gold via-gold-soft to-gold px-5 py-2.5 text-sm font-bold uppercase tracking-[0.18em] text-primary-foreground shadow-gold-glow transition hover:opacity-90"
          >
            <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-primary/30 opacity-50 animate-ping" />
            Builder
          </Link>

          {/* ── Cosmetics Dropdown ── */}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-primary/40 text-primary transition hover:bg-primary/5 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-primary/20 bg-background/95 backdrop-blur-xl shadow-elevated lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
              {navLinks.map((l) => {
                const isActive = pathname === l.to;
                return (
                  <Link
                    key={l.to}
                    to={l.to}
                    className={`rounded-md px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-primary/10 text-primary ring-1 ring-primary/25"
                        : "text-foreground/90 hover:bg-card hover:text-primary"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}

              {/* Mobile Cosmetics accordion */}
              <div>
                <button
                  onClick={() => setMobileCosmeticsOpen((v) => !v)}
                  className="w-full flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium text-foreground/90 hover:bg-card hover:text-primary"
                >
                  <span>Cosmetics</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${mobileCosmeticsOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {mobileCosmeticsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-4 pb-2 grid grid-cols-2 gap-1">
                        {COSMETICS_PRODUCTS.map((prod) => (
                          <button
                            key={prod.id}
                            onClick={() => {
                              setOpen(false);
                              navigate({ to: "/cosmetics", search: { product: prod.id } });
                            }}
                            className="text-left rounded-lg px-3 py-2.5 text-[12px] font-medium text-foreground/80 hover:text-primary hover:bg-secondary/40 transition-all"
                          >
                            {prod.name}
                          </button>
                        ))}
                        <button
                          onClick={() => {
                            setOpen(false);
                            navigate({ to: "/cosmetics" });
                          }}
                          className="col-span-2 mt-1 px-3 py-2.5 rounded-xl bg-gold/10 border border-gold/25 text-gold text-[11px] font-bold uppercase tracking-wider"
                        >
                          Open Full Configurator
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
