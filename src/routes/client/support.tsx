import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  LifeBuoy, MessageCircle, FileText, Search, Plus,
  ChevronRight, AlertCircle, Clock, CheckCircle2, ChevronDown
} from "lucide-react";

export const Route = createFileRoute("/client/support")({
  component: SupportCenter,
});

const FAQ_ITEMS = [
  {
    category: "Manufacturing & Production",
    items: [
      { q: "What is the minimum order quantity (MOQ)?", a: "Our standard MOQ starts at 1,000 units for stock packaging and 5,000 units for fully custom molds. This can vary based on the specific formulation and packaging choices." },
      { q: "How long does production take?", a: "Standard production lead time is 4-6 weeks after final sample approval and packaging receipt. Custom components may extend this to 8-12 weeks." },
      { q: "Can I supply my own packaging?", a: "Yes, we accept client-supplied packaging. However, all components must pass our line-compatibility testing before full production begins." }
    ]
  },
  {
    category: "Formulation & Compliance",
    items: [
      { q: "Are your facilities ISO certified?", a: "Yes, we operate under strict ISO 22716 (GMP for Cosmetics) and ISO 9001 quality management systems." },
      { q: "Do you assist with product registration?", a: "We provide all necessary technical documents (MSDS, COA, ingredient lists) required for Dubai Municipality and SFDA registration." }
    ]
  }
];

const MOCK_TICKETS = [
  { id: "TCK-8821", subject: "Update shipping address for Order #O001", status: "open", priority: "high", date: "2026-05-24" },
  { id: "TCK-8790", subject: "Request for MSDS document - Oud Noir", status: "resolved", priority: "normal", date: "2026-05-15" },
  { id: "TCK-8644", subject: "Clarification on invoice INV-2026-022", status: "resolved", priority: "normal", date: "2026-04-12" },
];

function SupportCenter() {
  const [search, setSearch] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"faq" | "tickets">("faq");
  const [showNewTicket, setShowNewTicket] = useState(false);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Support Center</h1>
          <p className="text-white/35 text-sm mt-1">Get help, find answers, and manage your support tickets</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setActiveTab("tickets"); setShowNewTicket(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] text-black font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)]"
          >
            <Plus className="h-4 w-4" /> Open Ticket
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] w-fit">
          <button
            onClick={() => setActiveTab("faq")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "faq" ? "bg-white/[0.08] text-white shadow-sm" : "text-white/40 hover:text-white/80"
            }`}
          >
            <FileText className="h-4 w-4" /> FAQs & Guides
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === "tickets" ? "bg-white/[0.08] text-white shadow-sm" : "text-white/40 hover:text-white/80"
            }`}
          >
            <MessageCircle className="h-4 w-4" /> My Tickets
          </button>
        </div>
        
        {activeTab === "faq" && (
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search help articles..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/40 outline-none text-sm text-white placeholder:text-white/20 transition-all"
            />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === "faq" ? (
            <motion.div
              key="faq"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              <div className="lg:col-span-2 space-y-8">
                {FAQ_ITEMS.map((section) => (
                  <div key={section.category} className="space-y-4">
                    <h3 className="text-sm font-semibold text-[#C9A84C] uppercase tracking-wider">{section.category}</h3>
                    <div className="space-y-3">
                      {section.items.map((item, i) => {
                        const isExpanded = expandedFaq === `${section.category}-${i}`;
                        return (
                          <div key={i} className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] overflow-hidden transition-all">
                            <button
                              onClick={() => setExpandedFaq(isExpanded ? null : `${section.category}-${i}`)}
                              className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
                            >
                              <span className="font-medium text-white text-sm">{item.q}</span>
                              <ChevronDown className={`h-4 w-4 text-white/40 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-5 pb-5 pt-0 text-sm text-white/50 leading-relaxed border-t border-white/[0.04] mt-2">
                                    {item.a}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Need more help sidebar */}
              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border border-white/[0.08] p-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-[#C9A84C]/5 rounded-full blur-3xl" />
                  <LifeBuoy className="h-8 w-8 text-[#C9A84C] mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Still need help?</h3>
                  <p className="text-sm text-white/40 mb-6">Can't find the answer you're looking for? Our dedicated support team is ready to assist you.</p>
                  <button
                    onClick={() => { setActiveTab("tickets"); setShowNewTicket(true); }}
                    className="w-full py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-medium text-sm transition-all"
                  >
                    Open a Support Ticket
                  </button>
                </div>
                
                <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-6">
                  <h3 className="text-sm font-semibold text-white mb-4">Direct Contact</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Account Manager</p>
                      <p className="text-sm text-white">Khalid Hassan</p>
                      <p className="text-xs text-[#C9A84C] mt-0.5">khalid@lumiere.com</p>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div>
                      <p className="text-[11px] text-white/30 uppercase tracking-wider mb-1">Emergency Support (24/7)</p>
                      <p className="text-sm text-white">+971 4 123 4567</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tickets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {showNewTicket ? (
                <div className="max-w-2xl rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/[0.06]">
                    <div>
                      <h2 className="text-lg font-bold text-white">Submit New Ticket</h2>
                      <p className="text-xs text-white/40 mt-1">We usually respond within 2-4 hours</p>
                    </div>
                    <button onClick={() => setShowNewTicket(false)} className="text-sm text-white/40 hover:text-white transition-colors">
                      Cancel
                    </button>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Related Project / Order</label>
                      <select className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white text-sm transition-all appearance-none">
                        <option value="p001">Oud Noir Elixir</option>
                        <option value="p002">Rose Velvet Serum</option>
                        <option value="general">General Inquiry</option>
                      </select>
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Subject</label>
                      <input
                        type="text"
                        placeholder="Brief summary of the issue"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/20 text-sm transition-all"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Description</label>
                      <textarea
                        rows={5}
                        placeholder="Please provide as much detail as possible..."
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/20 text-sm resize-none transition-all"
                      />
                    </div>
                    
                    <button className="w-full py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] text-black font-semibold transition-all shadow-[0_4px_24px_rgba(201,168,76,0.3)] text-sm mt-2">
                      Submit Ticket
                    </button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] overflow-hidden">
                  <div className="grid grid-cols-6 px-6 py-3 border-b border-white/[0.05] text-[10px] font-semibold text-white/30 uppercase tracking-wider">
                    <span>Ticket ID</span>
                    <span className="col-span-3">Subject</span>
                    <span>Status</span>
                    <span className="text-right">Date</span>
                  </div>
                  
                  {MOCK_TICKETS.map((ticket, i) => (
                    <div key={ticket.id} className="grid grid-cols-6 items-center px-6 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                      <span className="font-mono text-[11px] text-white/40 group-hover:text-[#C9A84C] transition-colors">{ticket.id}</span>
                      <div className="col-span-3 flex items-center gap-2">
                        {ticket.priority === 'high' && <AlertCircle className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />}
                        <span className="text-sm text-white/80 font-medium truncate">{ticket.subject}</span>
                      </div>
                      <div>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          ticket.status === 'open' ? 'bg-sky-400/10 text-sky-400 border-sky-400/20' : 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20'
                        }`}>
                          {ticket.status === 'open' ? <Clock className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
                          <span className="capitalize">{ticket.status}</span>
                        </span>
                      </div>
                      <div className="text-right flex justify-end items-center gap-3">
                        <span className="text-xs text-white/40">{ticket.date}</span>
                        <ChevronRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
