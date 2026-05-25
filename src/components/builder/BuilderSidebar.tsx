import { AnimatePresence, motion } from "framer-motion";
import { useBuilderStore } from "@/store/useBuilderStore";
import { HeroStep } from "./steps/HeroStep";
import { BottleStep } from "./steps/BottleStep";
import { CapStep } from "./steps/CapStep";
import { LabelStep } from "./steps/LabelStep";
import { PackagingStep } from "./steps/PackagingStep";
import { FragranceStep } from "./steps/FragranceStep";
import { QuantityStep } from "./steps/QuantityStep";
import { ReviewStep } from "./steps/ReviewStep";
import { useState } from "react";

export function BuilderSidebar() {
  const step = useBuilderStore((s) => s.step);
  const nextStep = useBuilderStore((s) => s.nextStep);
  const prevStep = useBuilderStore((s) => s.prevStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <HeroStep />;
      case 1: return <BottleStep />;
      case 2: return <CapStep />;
      case 3: return <LabelStep />;
      case 4: return <PackagingStep />;
      case 5: return <FragranceStep />;
      case 6: return <QuantityStep />;
      case 7: return <ReviewStep />;
      default: return null;
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-8 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-16 h-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
          <h2 className="text-2xl font-display font-bold mb-2">Request Submitted Successfully</h2>
          <p className="text-muted-foreground mb-8">Our luxury manufacturing consultant will contact you within 24 hours.</p>
          
          <div className="space-y-3">
            <button className="w-full px-6 py-3 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
              Track Production (Dashboard)
            </button>
            <button className="w-full px-6 py-3 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">
              Message Factory Consultant
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-screen">
      {step > 0 && (
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border p-4 px-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Step {step} of 7</span>
            {step < 7 && (
              <button onClick={nextStep} className="text-sm font-medium text-primary hover:underline">
                Skip
              </button>
            )}
          </div>
          <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary" 
              initial={{ width: 0 }} 
              animate={{ width: `${(step / 7) * 100}%` }} 
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}
      
      <div className={`flex-1 p-8 flex flex-col ${step === 0 ? 'justify-center items-center' : ''} min-h-[70vh] pb-24`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-xl mx-auto"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {step > 0 && (
        <div className="fixed lg:absolute bottom-0 left-0 w-full lg:w-1/2 z-20 bg-background/90 backdrop-blur-md border-t border-border p-4 px-8 flex justify-between items-center shadow-elevated">
          <button
            onClick={prevStep}
            className={`px-6 py-2 rounded-full border border-border text-sm font-medium transition hover:bg-muted ${step === 1 ? 'invisible' : ''}`}
          >
            Back
          </button>
          {step < 7 ? (
            <button
              onClick={nextStep}
              className="px-6 py-2 rounded-full bg-primary text-primary-foreground shadow-gold-glow text-sm font-semibold transition hover:opacity-90"
            >
              Next Step
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 rounded-full bg-primary text-primary-foreground shadow-gold-glow text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Inquiry"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
