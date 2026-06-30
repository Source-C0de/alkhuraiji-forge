import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TicketStatus = "open" | "in_progress" | "awaiting_customer" | "resolved" | "closed";

export type TicketPriority = "low" | "normal" | "high" | "urgent";

export type TicketCategory =
  | "manufacturing"
  | "formulation"
  | "shipping"
  | "billing"
  | "samples"
  | "general";

export interface TicketMessage {
  id: string;
  ticketId: string;
  sender: "client" | "admin";
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string; // "TCK-XXXX"
  clientId: string;
  clientName: string;
  clientEmail: string;
  category: TicketCategory;
  subject: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  projectId?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqSection {
  category: string;
  items: FaqItem[];
}

interface CreateTicketInput {
  clientId: string;
  clientName: string;
  clientEmail: string;
  category: TicketCategory;
  subject: string;
  description: string;
  priority?: TicketPriority;
  projectId?: string;
  /** Sender name to use for the first message. Defaults to clientName. */
  senderName?: string;
}

interface SupportState {
  tickets: Ticket[];
  faqs: FaqSection[];
  liveChatOpen: boolean;

  // Selectors
  getTicketsByClient: (clientId: string) => Ticket[];
  getTicket: (id: string) => Ticket | undefined;
  getOpenTicketCount: () => number;

  // Mutations
  createTicket: (input: CreateTicketInput) => Ticket;
  addMessage: (
    ticketId: string,
    content: string,
    sender: "client" | "admin",
    senderName: string,
  ) => TicketMessage | null;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  updateTicketPriority: (ticketId: string, priority: TicketPriority) => void;
  updateTicketAssignedTo: (ticketId: string, assignedTo: string) => void;

  // UI
  setLiveChatOpen: (open: boolean) => void;
}

const SEED_FAQS: FaqSection[] = [
  {
    category: "Manufacturing & Production",
    items: [
      {
        q: "What is the minimum order quantity (MOQ)?",
        a: "Our standard MOQ starts at 1,000 units for stock packaging and 5,000 units for fully custom molds. This can vary based on the specific formulation and packaging choices.",
      },
      {
        q: "How long does production take?",
        a: "Standard production lead time is 4–6 weeks after final sample approval and packaging receipt. Custom components may extend this to 8–12 weeks.",
      },
      {
        q: "Can I supply my own packaging?",
        a: "Yes, we accept client-supplied packaging. However, all components must pass our line-compatibility testing before full production begins.",
      },
    ],
  },
  {
    category: "Formulation & Compliance",
    items: [
      {
        q: "Are your facilities ISO certified?",
        a: "Yes, we operate under strict ISO 22716 (GMP for Cosmetics) and ISO 9001 quality management systems.",
      },
      {
        q: "Do you assist with product registration?",
        a: "We provide all necessary technical documents (MSDS, COA, ingredient lists) required for Dubai Municipality and SFDA registration.",
      },
      {
        q: "Can you develop vegan or cruelty-free formulas?",
        a: "Absolutely. We maintain separate production lines for vegan formulations and can support Leaping Bunny / Vegan Society certification processes.",
      },
    ],
  },
  {
    category: "Samples & Prototypes",
    items: [
      {
        q: "How much does a prototype sample cost?",
        a: "Standard prototypes are USD 250 per formulation, refunded against your first production order. Custom mold prototypes start at USD 1,500.",
      },
      {
        q: "How long does it take to receive a sample?",
        a: "Stock-formulation samples ship within 5 business days; fully custom samples take 3–4 weeks including development and DHL/FedEx delivery.",
      },
      {
        q: "Can I request revisions to a sample?",
        a: "Yes. Each formulation includes up to two rounds of revisions. Additional rounds are quoted separately.",
      },
    ],
  },
  {
    category: "Shipping & Logistics",
    items: [
      {
        q: "Which countries do you ship to?",
        a: "We ship to 38+ countries with DDP (delivered duty paid) options for GCC, EU, UK, and North America.",
      },
      {
        q: "Do you handle customs documentation?",
        a: "Yes — our logistics team prepares commercial invoices, packing lists, certificates of origin, and SFDA/Dubai Municipality filings.",
      },
    ],
  },
  {
    category: "Billing & Payments",
    items: [
      {
        q: "What payment terms do you accept?",
        a: "New clients: 50% deposit, 40% pre-shipment, 10% net-30. Established clients may qualify for net-30 terms upon review.",
      },
      {
        q: "Which currencies can I pay in?",
        a: "We invoice in USD, AED, EUR, or SAR. Bank transfer and major credit cards are accepted.",
      },
    ],
  },
  {
    category: "Account & Portal",
    items: [
      {
        q: "How do I invite a colleague to my portal?",
        a: "Go to Account Settings → Team and enter their email. They'll receive an invitation to create their own login linked to your brand workspace.",
      },
      {
        q: "Where can I download invoices and COAs?",
        a: "All invoices are in the Orders section; COAs, MSDS, and technical sheets are in the Documents library.",
      },
    ],
  },
];

const SEED_TICKETS: Ticket[] = [
  {
    id: "TCK-8821",
    clientId: "c001",
    clientName: "Aisha Al-Rashidi",
    clientEmail: "aisha@lumiere-beauty.com",
    category: "shipping",
    subject: "Update shipping address for Order #O001",
    description:
      "We need to update the delivery address for Order #O001 — the original warehouse moved last week.",
    status: "open",
    priority: "high",
    projectId: "p001",
    createdAt: "2026-05-24T09:12:00Z",
    updatedAt: "2026-05-24T11:00:00Z",
    messages: [
      {
        id: "msg-8821-1",
        ticketId: "TCK-8821",
        sender: "client",
        senderName: "Aisha Al-Rashidi",
        content:
          "Hi team, our fulfillment warehouse moved to a new address in Jebel Ali Free Zone. Can you update the shipping address for Order #O001?",
        timestamp: "2026-05-24T09:12:00Z",
      },
      {
        id: "msg-8821-2",
        ticketId: "TCK-8821",
        sender: "admin",
        senderName: "Khalid Hassan",
        content:
          "Thanks Aisha — could you confirm the new address and contact phone at the warehouse? I'll update the order immediately.",
        timestamp: "2026-05-24T11:00:00Z",
      },
    ],
  },
  {
    id: "TCK-8790",
    clientId: "c001",
    clientName: "Aisha Al-Rashidi",
    clientEmail: "aisha@lumiere-beauty.com",
    category: "billing",
    subject: "Request for MSDS document - Oud Noir",
    description:
      "We need the MSDS for the Oud Noir Elixir formulation for our EU distributor onboarding.",
    status: "resolved",
    priority: "normal",
    projectId: "p001",
    createdAt: "2026-05-15T08:00:00Z",
    updatedAt: "2026-05-16T14:30:00Z",
    messages: [
      {
        id: "msg-8790-1",
        ticketId: "TCK-8790",
        sender: "client",
        senderName: "Aisha Al-Rashidi",
        content:
          "Can you send me the latest MSDS for Oud Noir Elixir? Our EU distributor needs it for product registration.",
        timestamp: "2026-05-15T08:00:00Z",
      },
      {
        id: "msg-8790-2",
        ticketId: "TCK-8790",
        sender: "admin",
        senderName: "Sara Mahmoud",
        content:
          "Attached MSDS v3 has been uploaded to your Documents library under Compliance. Let me know if you need anything else!",
        timestamp: "2026-05-16T14:30:00Z",
      },
    ],
  },
  {
    id: "TCK-8644",
    clientId: "c001",
    clientName: "Aisha Al-Rashidi",
    clientEmail: "aisha@lumiere-beauty.com",
    category: "billing",
    subject: "Clarification on invoice INV-2026-022",
    description:
      "Quick question about a line item on the latest invoice — the mold tooling charge.",
    status: "closed",
    priority: "normal",
    projectId: "p002",
    createdAt: "2026-04-12T13:20:00Z",
    updatedAt: "2026-04-14T10:00:00Z",
    messages: [
      {
        id: "msg-8644-1",
        ticketId: "TCK-8644",
        sender: "client",
        senderName: "Aisha Al-Rashidi",
        content:
          "Could you clarify the mold tooling line on INV-2026-022? Just want to confirm what's included.",
        timestamp: "2026-04-12T13:20:00Z",
      },
      {
        id: "msg-8644-2",
        ticketId: "TCK-8644",
        sender: "admin",
        senderName: "Fatima Al-Zahra",
        content:
          "Hi — that line covers the 50ml cap mold setup. I've attached a breakdown to the invoice record. Resolving this now.",
        timestamp: "2026-04-14T10:00:00Z",
      },
    ],
  },
];

function generateTicketId(existing: Ticket[]): string {
  const used = new Set(
    existing
      .map((t) => t.id)
      .filter((id) => id.startsWith("TCK-"))
      .map((id) => parseInt(id.slice(4), 10))
      .filter((n) => Number.isFinite(n)),
  );
  let n = 9000;
  while (used.has(n)) n += 1;
  return `TCK-${n}`;
}

function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;
}

export const useSupportStore = create<SupportState>()(
  persist(
    (set, get) => ({
      tickets: SEED_TICKETS,
      faqs: SEED_FAQS,
      liveChatOpen: false,

      getTicketsByClient: (clientId) =>
        get()
          .tickets.filter((t) => t.clientId === clientId)
          .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),

      getTicket: (id) => get().tickets.find((t) => t.id === id),

      getOpenTicketCount: () =>
        get().tickets.filter((t) => t.status === "open" || t.status === "in_progress").length,

      createTicket: (input) => {
        const now = new Date().toISOString();
        const id = generateTicketId(get().tickets);
        const senderName = input.senderName ?? input.clientName;
        const firstMessage: TicketMessage = {
          id: generateId("msg"),
          ticketId: id,
          sender: "client",
          senderName,
          content: input.description,
          timestamp: now,
        };
        const ticket: Ticket = {
          id,
          clientId: input.clientId,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          category: input.category,
          subject: input.subject,
          description: input.description,
          status: "open",
          priority: input.priority ?? "normal",
          projectId: input.projectId,
          createdAt: now,
          updatedAt: now,
          messages: [firstMessage],
        };
        set((s) => ({ tickets: [ticket, ...s.tickets] }));
        return ticket;
      },

      addMessage: (ticketId, content, sender, senderName) => {
        const trimmed = content.trim();
        if (!trimmed) return null;
        const now = new Date().toISOString();
        const message: TicketMessage = {
          id: generateId("msg"),
          ticketId,
          sender,
          senderName,
          content: trimmed,
          timestamp: now,
        };
        let appended = false;
        set((s) => ({
          tickets: s.tickets.map((t) => {
            if (t.id !== ticketId) return t;
            appended = true;
            const newStatus: TicketStatus =
              sender === "admin" && t.status === "open"
                ? "in_progress"
                : sender === "admin" && t.status === "awaiting_customer"
                  ? "in_progress"
                  : t.status === "closed" || t.status === "resolved"
                    ? t.status
                    : t.status;
            return {
              ...t,
              messages: [...t.messages, message],
              updatedAt: now,
              ...(newStatus !== t.status ? { status: newStatus } : {}),
            };
          }),
        }));
        return appended ? message : null;
      },

      updateTicketStatus: (ticketId, status) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t,
          ),
        })),

      updateTicketPriority: (ticketId, priority) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId ? { ...t, priority, updatedAt: new Date().toISOString() } : t,
          ),
        })),

      updateTicketAssignedTo: (ticketId, assignedTo) =>
        set((s) => ({
          tickets: s.tickets.map((t) =>
            t.id === ticketId ? { ...t, assignedTo, updatedAt: new Date().toISOString() } : t,
          ),
        })),

      setLiveChatOpen: (open) => set({ liveChatOpen: open }),
    }),
    {
      name: "client-support-store",
      partialize: (state) => ({
        tickets: state.tickets,
        faqs: state.faqs,
      }),
    },
  ),
);
