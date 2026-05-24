import { animate, useInView, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

export function StatCounter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());
  const displayRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 2, ease: "easeOut" });
    const unsub = rounded.on("change", (v) => {
      if (displayRef.current) displayRef.current.textContent = v;
    });
    return () => { controls.stop(); unsub(); };
  }, [inView, value, mv, rounded]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
        <span ref={displayRef} className="text-gradient-gold">0</span>
        <span className="text-gradient-gold">{suffix}</span>
      </div>
      <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground md:text-sm">{label}</div>
    </div>
  );
}
