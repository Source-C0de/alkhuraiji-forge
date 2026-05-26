import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ProjectStatus =
  | 'request_submitted'
  | 'consultation_approved'
  | 'design_in_progress'
  | 'prototype_development'
  | 'sample_approval'
  | 'production_started'
  | 'quality_inspection'
  | 'packaging'
  | 'shipping'
  | 'completed';

export interface Project {
  id: string;
  name: string;
  category: string;
  status: ProjectStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
  manager: string;
  quantity: number;
  estimatedDelivery: string;
  thumbnail?: string;
}

export interface DesignApproval {
  id: string;
  projectId: string;
  projectName: string;
  mockupUrl: string;
  status: 'pending' | 'approved' | 'changes_requested';
  submittedAt: string;
  comments: string[];
  version: number;
}

export interface Sample {
  id: string;
  projectId: string;
  projectName: string;
  imageUrl: string;
  status: 'in_transit' | 'delivered' | 'approved' | 'rejected';
  trackingNumber: string;
  deliveredAt?: string;
  feedback?: string;
}

export interface Message {
  id: string;
  sender: 'client' | 'manager';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  projectId?: string;
}

export interface Order {
  id: string;
  projectId: string;
  projectName: string;
  units: number;
  unitsCompleted: number;
  qcStatus: 'pending' | 'in_progress' | 'passed' | 'failed';
  packagingStatus: 'not_started' | 'in_progress' | 'completed';
  estimatedDelivery: string;
  trackingNumber?: string;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'specification' | 'invoice' | 'certificate' | 'nda' | 'formula' | 'compliance';
  url: string;
  size: string;
  uploadedAt: string;
  projectId?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatar?: string;
  country: string;
  brandLogo?: string;
}

export type DashboardSection =
  | 'overview'
  | 'new-request'
  | 'my-projects'
  | 'design-approvals'
  | 'samples'
  | 'production'
  | 'orders'
  | 'documents'
  | 'messaging'
  | 'support'
  | 'settings';

interface ClientState {
  // Auth
  isAuthenticated: boolean;
  profile: ClientProfile | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // UI
  activeSection: DashboardSection;
  setActiveSection: (section: DashboardSection) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Projects
  projects: Project[];

  // Design Approvals
  designApprovals: DesignApproval[];
  approveDesign: (id: string) => void;
  requestChanges: (id: string, comment: string) => void;

  // Samples
  samples: Sample[];
  approveSample: (id: string) => void;
  rejectSample: (id: string, feedback: string) => void;

  // Messages
  messages: Message[];
  sendMessage: (content: string, projectId?: string) => void;
  markMessagesRead: () => void;

  // Orders
  orders: Order[];

  // Documents
  documents: Document[];

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // New Request Wizard
  requestStep: number;
  setRequestStep: (step: number) => void;
  requestDraft: Partial<{
    category: string;
    name: string;
    market: string;
    type: string;
    audience: string;
    volume: string;
    quantity: string;
    bottleShape: string;
    bottleMaterial: string;
    bottleColor: string;
    capStyle: string;
    labelStyle: string;
    boxPackaging: string;
    fragrance: string;
    finish: string;
  }>;
  updateRequestDraft: (data: Partial<ClientState['requestDraft']>) => void;
  resetRequest: () => void;
}

const MOCK_PROFILE: ClientProfile = {
  id: 'c001',
  name: 'Aisha Al-Rashidi',
  company: 'Lumière Beauty Co.',
  email: 'aisha@lumiere-beauty.com',
  phone: '+971 50 234 5678',
  country: 'UAE',
};

const MOCK_PROJECTS: Project[] = [
  {
    id: 'p001',
    name: 'Oud Noir Elixir',
    category: 'Perfume',
    status: 'sample_approval',
    progress: 55,
    createdAt: '2026-04-10',
    updatedAt: '2026-05-20',
    manager: 'Khalid Hassan',
    quantity: 5000,
    estimatedDelivery: '2026-07-15',
    thumbnail: 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p002',
    name: 'Rose Velvet Serum',
    category: 'Skincare',
    status: 'production_started',
    progress: 70,
    createdAt: '2026-03-01',
    updatedAt: '2026-05-24',
    manager: 'Fatima Al-Zahra',
    quantity: 10000,
    estimatedDelivery: '2026-06-30',
    thumbnail: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'p003',
    name: 'Midnight Mist Body Spray',
    category: 'Body Mist',
    status: 'design_in_progress',
    progress: 30,
    createdAt: '2026-05-05',
    updatedAt: '2026-05-25',
    manager: 'Khalid Hassan',
    quantity: 3000,
    estimatedDelivery: '2026-08-20',
    thumbnail: 'https://images.unsplash.com/photo-1585232351009-aa87a4fbf0f7?auto=format&fit=crop&w=400&q=80',
  },
];

const MOCK_APPROVALS: DesignApproval[] = [
  {
    id: 'd001',
    projectId: 'p001',
    projectName: 'Oud Noir Elixir',
    mockupUrl: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80',
    status: 'pending',
    submittedAt: '2026-05-22',
    comments: [],
    version: 2,
  },
  {
    id: 'd002',
    projectId: 'p003',
    projectName: 'Midnight Mist Body Spray',
    mockupUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80',
    status: 'changes_requested',
    submittedAt: '2026-05-18',
    comments: ['Please adjust font size on label', 'Change bottle cap to matte gold'],
    version: 1,
  },
];

const MOCK_SAMPLES: Sample[] = [
  {
    id: 's001',
    projectId: 'p001',
    projectName: 'Oud Noir Elixir',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80',
    status: 'delivered',
    trackingNumber: 'DHL-AE-88291',
    deliveredAt: '2026-05-21',
  },
  {
    id: 's002',
    projectId: 'p002',
    projectName: 'Rose Velvet Serum',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=400&q=80',
    status: 'approved',
    trackingNumber: 'FDX-AE-44102',
    deliveredAt: '2026-05-10',
    feedback: 'Perfect! Approved for production.',
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm001',
    sender: 'manager',
    senderName: 'Khalid Hassan',
    content: 'The label design for Oud Noir Elixir v2 is ready for your review. Please check the Design Approvals section.',
    timestamp: '2026-05-22T10:30:00Z',
    read: false,
    projectId: 'p001',
  },
  {
    id: 'm002',
    sender: 'manager',
    senderName: 'Fatima Al-Zahra',
    content: 'Production for Rose Velvet Serum has officially started. Estimated completion: June 20th.',
    timestamp: '2026-05-20T09:15:00Z',
    read: true,
    projectId: 'p002',
  },
  {
    id: 'm003',
    sender: 'client',
    senderName: 'Aisha Al-Rashidi',
    content: 'Can we schedule a call to discuss the Midnight Mist label revisions?',
    timestamp: '2026-05-19T14:00:00Z',
    read: true,
    projectId: 'p003',
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: 'o001',
    projectId: 'p002',
    projectName: 'Rose Velvet Serum',
    units: 10000,
    unitsCompleted: 6800,
    qcStatus: 'in_progress',
    packagingStatus: 'not_started',
    estimatedDelivery: '2026-06-30',
    createdAt: '2026-05-01',
  },
];

const MOCK_DOCUMENTS: Document[] = [
  { id: 'doc001', name: 'Oud Noir Elixir - Product Spec', type: 'specification', url: '#', size: '2.4 MB', uploadedAt: '2026-04-12', projectId: 'p001' },
  { id: 'doc002', name: 'Invoice #INV-2026-041', type: 'invoice', url: '#', size: '0.8 MB', uploadedAt: '2026-04-15' },
  { id: 'doc003', name: 'ISO 22716 Certificate', type: 'certificate', url: '#', size: '1.1 MB', uploadedAt: '2026-01-10' },
  { id: 'doc004', name: 'Mutual NDA Agreement', type: 'nda', url: '#', size: '0.5 MB', uploadedAt: '2026-03-05' },
  { id: 'doc005', name: 'Rose Velvet Formula Sheet', type: 'formula', url: '#', size: '3.2 MB', uploadedAt: '2026-03-10', projectId: 'p002' },
  { id: 'doc006', name: 'GCC Compliance Report', type: 'compliance', url: '#', size: '1.8 MB', uploadedAt: '2026-02-20' },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n001', title: 'Design Ready for Review', message: 'Oud Noir Elixir v2 label design has been submitted.', type: 'info', read: false, timestamp: '2026-05-22T10:30:00Z', link: 'design-approvals' },
  { id: 'n002', title: 'Sample Delivered', message: 'Your Oud Noir Elixir sample has arrived.', type: 'success', read: false, timestamp: '2026-05-21T08:00:00Z', link: 'samples' },
  { id: 'n003', title: 'Production Milestone', message: 'Rose Velvet Serum is 68% through production.', type: 'success', read: true, timestamp: '2026-05-20T09:15:00Z', link: 'production' },
];

export const useClientStore = create<ClientState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      profile: null,
      login: (email, password) => {
        if (email === 'client@lumiere.com' && password === 'client123') {
          set({ isAuthenticated: true, profile: MOCK_PROFILE });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false, profile: null }),

      activeSection: 'overview',
      setActiveSection: (section) => set({ activeSection: section }),
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      projects: MOCK_PROJECTS,
      designApprovals: MOCK_APPROVALS,
      approveDesign: (id) =>
        set((state) => ({
          designApprovals: state.designApprovals.map((d) =>
            d.id === id ? { ...d, status: 'approved' } : d,
          ),
        })),
      requestChanges: (id, comment) =>
        set((state) => ({
          designApprovals: state.designApprovals.map((d) =>
            d.id === id ? { ...d, status: 'changes_requested', comments: [...d.comments, comment] } : d,
          ),
        })),

      samples: MOCK_SAMPLES,
      approveSample: (id) =>
        set((state) => ({
          samples: state.samples.map((s) => (s.id === id ? { ...s, status: 'approved' } : s)),
        })),
      rejectSample: (id, feedback) =>
        set((state) => ({
          samples: state.samples.map((s) => (s.id === id ? { ...s, status: 'rejected', feedback } : s)),
        })),

      messages: MOCK_MESSAGES,
      sendMessage: (content, projectId) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: `m${Date.now()}`,
              sender: 'client',
              senderName: state.profile?.name ?? 'Client',
              content,
              timestamp: new Date().toISOString(),
              read: true,
              projectId,
            },
          ],
        })),
      markMessagesRead: () =>
        set((state) => ({
          messages: state.messages.map((m) => ({ ...m, read: true })),
        })),

      orders: MOCK_ORDERS,
      documents: MOCK_DOCUMENTS,

      notifications: MOCK_NOTIFICATIONS,
      markNotificationRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      requestStep: 1,
      setRequestStep: (step) => set({ requestStep: step }),
      requestDraft: {},
      updateRequestDraft: (data) =>
        set((state) => ({ requestDraft: { ...state.requestDraft, ...data } })),
      resetRequest: () => set({ requestStep: 1, requestDraft: {} }),
    }),
    {
      name: 'client-dashboard-store',
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, profile: state.profile }),
    },
  ),
);
