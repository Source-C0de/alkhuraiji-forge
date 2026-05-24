import { AnimatePresence, motion } from "framer-motion";
import { Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/context";
import { SectionHeading } from "@/components/ui-custom/SectionHeading";

const TESTIMONIALS_EN = [
  { quote: "Our private-label launch hit shelves 40% faster than our previous partner could deliver. The QA discipline is unmatched.", author: "Director of Operations", company: "Global Personal Care Brand" },
  { quote: "AlKhuraiji scaled with us from 50k to 2M units a month without a single SKU disruption. Real manufacturing partners.", author: "Head of Supply Chain", company: "MENA FMCG Group" },
  { quote: "They run their factory the way we wish we ran ours. Engineering discipline shows in every batch.", author: "VP Manufacturing", company: "European Cosmetics Brand" },
];
const TESTIMONIALS_AR = [
  { quote: "أُطلقت علامتنا الخاصة بسرعة أعلى بنسبة 40% عن شريكنا السابق. انضباط الجودة لا يُضاهى.", author: "مدير العمليات", company: "علامة عناية شخصية عالمية" },
  { quote: "كبر الخريجي معنا من 50 ألف إلى 2 مليون وحدة شهرياً دون أي اضطراب. شركاء تصنيع حقيقيون.", author: "مدير سلسلة الإمداد", company: "مجموعة سلع استهلاكية MENA" },
  { quote: "يديرون مصنعهم كما نتمنى أن ندير مصانعنا. الانضباط الهندسي يظهر في كل دفعة.", author: "نائب رئيس التصنيع", company: "علامة تجميل أوروبية" },
];

export function Testimonials() {
  const { t, locale } = useI18n();
  const data = locale === "ar" ? TESTIMONIALS_AR : TESTIMONIALS_EN;
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % data.length), 6000);
    return () => clearInterval(id);
  }, [data.length]);

  return (
    <section className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <SectionHeading title={t.home.testimonialsTitle} />
        <div className="relative mt-12 min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-border bg-card p-8 md:p-12"
            >
              <Quote className="h-8 w-8 text-primary" />
              <blockquote className="mt-5 font-display text-xl leading-relaxed md:text-2xl">"{data[i].quote}"</blockquote>
              <figcaption className="mt-6 text-sm text-muted-foreground">
                <div className="font-semibold text-foreground">{data[i].author}</div>
                <div>{data[i].company}</div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          <div className="mt-6 flex justify-center gap-2">
            {data.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-4 bg-muted"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
