import { Languages } from "lucide-react";
import { useI18n } from "@/i18n/context";

export function LanguageSwitcher() {
  const { locale, toggle } = useI18n();
  return (
    <button
      onClick={toggle}
      className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-foreground transition hover:border-primary hover:text-primary"
      aria-label="Toggle language"
    >
      <Languages className="h-3.5 w-3.5" />
      <span>{locale === "en" ? "AR" : "EN"}</span>
    </button>
  );
}
