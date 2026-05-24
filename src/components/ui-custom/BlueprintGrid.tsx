import { motion } from "framer-motion";

export function BlueprintGrid({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-blueprint opacity-[0.07]" />
      <motion.div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
        animate={{ y: ["0%", "100vh"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
    </div>
  );
}
