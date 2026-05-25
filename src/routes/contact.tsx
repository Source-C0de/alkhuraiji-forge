import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, Mail, MessageCircle, Phone, Send } from "lucide-react";
import { useState } from "react";
import { PageTransition } from "@/components/layout/PageTransition";
import { SectionHeading } from "@/components/ui-custom/SectionHeading";
import { BlueprintGrid } from "@/components/ui-custom/BlueprintGrid";
import { useI18n } from "@/i18n/context";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — AlKhuraiji Factory" },
      { name: "description", content: "Talk to our production team. Most quotations issued within 48 hours." },
      { property: "og:title", content: "Contact — AlKhuraiji Factory" },
      { property: "og:description", content: "Request a quotation, callback or partnership discussion." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden pt-32 pb-16 md:pt-40">
        <BlueprintGrid />
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading eyebrow={t.nav.contact} title={<span className="text-gradient-gold">{t.contact.title}</span>} subtitle={t.contact.subtitle} />
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 md:px-8 lg:grid-cols-[1fr_1.4fr]">
          <div className="space-y-4">
            <ContactCard icon={MessageCircle} title={t.contact.channels.whatsapp} body="+966 50 000 0000" href="https://wa.me/" />
            <ContactCard icon={Mail} title={t.contact.channels.email} body="partnerships@alkhuraiji.com" href="mailto:partnerships@alkhuraiji.com" />
            <ContactCard icon={Phone} title={t.contact.channels.callback} body="+966 11 000 0000" href="tel:+966110000000" />
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
              <div className="relative aspect-[4/3] bg-blueprint">
                <iframe
                  title="Al Khuraiji industrial Company Location Map"
                  src="https://maps.google.com/maps?q=Al%20Khuraiji%20industrial%20Company%2029%20Riyadh%2014334&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="absolute inset-0 h-full w-full border-0 filter grayscale opacity-90 dark:opacity-85 hover:grayscale-0 transition-all duration-500"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="border-t border-border p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Headquarters & Manufacturing Plant</div>
                <div className="mt-2 text-sm text-foreground/90 leading-relaxed font-light">{t.contact.location}</div>
              </div>
            </div>
          </div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="rounded-3xl border border-border bg-card p-6 md:p-10"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={t.contact.form.name} name="name" required />
              <Field label={t.contact.form.company} name="company" />
              <Field label={t.contact.form.email} name="email" type="email" required />
              <Field label={t.contact.form.phone} name="phone" type="tel" />
              <Field label={t.contact.form.category} name="category" />
              <Field label={t.contact.form.quantity} name="quantity" />
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{t.contact.form.message}</label>
              <textarea name="message" rows={5} className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-primary" />
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-gold-glow transition hover:opacity-90"
            >
              <Send className="h-4 w-4" />
              {t.contact.form.submit}
            </button>
            {sent && (
              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="mt-5 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm text-primary"
              >
                {t.contact.form.success}
              </motion.div>
            )}
          </motion.form>
        </div>
      </section>
    </PageTransition>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">{label}{required && <span className="ms-1 text-primary">*</span>}</label>
      <input name={name} type={type} required={required} className="w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm outline-none transition focus:border-primary" />
    </div>
  );
}

function ContactCard({ icon: Icon, title, body, href }: { icon: typeof Mail; title: string; body: string; href: string }) {
  return (
    <a href={href} className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/60">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">{title}</div>
        <div className="mt-0.5 text-sm text-foreground/90">{body}</div>
      </div>
    </a>
  );
}
