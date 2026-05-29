import { Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Plus,
  FolderKanban,
  Layers,
  CheckSquare,
  FlaskConical,
  Factory,
  ShoppingBag,
  FileText,
  MessageSquare,
  LifeBuoy,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Lock,
  Globe,
  Sparkles,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import logo from "@/assets/logo.png";
import { useClientStore, type DashboardSection } from "@/store/clientStore";

export const Route = createFileRoute("/client")({
  component: ClientLayout,
});

const NAV_ITEMS: { icon: React.ElementType; label: string; section: DashboardSection; path: string; badge?: number }[] = [
  { icon: LayoutDashboard, label: "Overview", section: "overview", path: "/client/" },
  { icon: Plus, label: "New Product Request", section: "new-request", path: "/client/new-request" },
  { icon: FolderKanban, label: "My Projects", section: "my-projects", path: "/client/projects" },
  { icon: Layers, label: "Design Approvals", section: "design-approvals", path: "/client/design-approvals", badge: 1 },
  { icon: FlaskConical, label: "Samples & Prototypes", section: "samples", path: "/client/samples" },
  { icon: Factory, label: "Production Tracking", section: "production", path: "/client/production" },
  { icon: ShoppingBag, label: "Orders & Invoices", section: "orders", path: "/client/orders" },
  { icon: FileText, label: "Documents", section: "documents", path: "/client/documents" },
  { icon: MessageSquare, label: "Messaging Center", section: "messaging", path: "/client/messaging", badge: 2 },
  { icon: LifeBuoy, label: "Support Tickets", section: "support", path: "/client/support" },
  { icon: Settings, label: "Account Settings", section: "settings", path: "/client/settings" },
];

function LoginGate() {
  const { login } = useClientStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (!login(email, password)) {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080808] relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(212,180,100,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(212,180,100,0.06),transparent_50%)]" />
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize: '32px 32px' }} />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="relative p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_32px_80px_-16px_rgba(0,0,0,0.8)]">
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent rounded-t-2xl" />

          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 mb-4 shadow-[0_0_30px_rgba(201,168,76,0.15)]">
              <Lock className="w-7 h-7 text-[#C9A84C]" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <img src={logo} alt="Logo" className="h-5 w-5 object-contain opacity-80" />
              <span className="text-xs font-medium text-[#C9A84C]/70 tracking-[0.2em] uppercase">Client Portal</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-white/40 mt-1">Sign in to your manufacturing dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(false); }}
                placeholder="you@brand.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10 outline-none text-white placeholder:text-white/25 transition-all text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl bg-white/5 border transition-all outline-none text-white placeholder:text-white/25 text-sm ${
                  error ? "border-red-500/50 focus:ring-2 focus:ring-red-500/10" : "border-white/10 focus:border-[#C9A84C]/50 focus:ring-2 focus:ring-[#C9A84C]/10"
                }`}
              />
              {error && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-xs mt-1.5">
                  Invalid credentials. Try: client@lumiere.com / client123
                </motion.p>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] text-black font-semibold transition-all shadow-[0_4px_24px_rgba(201,168,76,0.35)] hover:shadow-[0_4px_32px_rgba(201,168,76,0.5)] disabled:opacity-70 flex items-center justify-center gap-2 text-sm mt-6"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Access Dashboard
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-white/25 mt-6">
            Need access?{" "}
            <a href="/contact" className="text-[#C9A84C]/70 hover:text-[#C9A84C] transition-colors">Contact your project manager</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function ClientLayout() {
  const { isAuthenticated, profile, logout, setActiveSection, sidebarOpen, setSidebarOpen, notifications, messages } = useClientStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Derive active section from current URL
  const activeSection = NAV_ITEMS.find((item) =>
    item.path === "/client/"
      ? currentPath === "/client" || currentPath === "/client/"
      : currentPath.startsWith(item.path)
  )?.section ?? "overview";

  const navigateTo = (item: typeof NAV_ITEMS[0]) => {
    setActiveSection(item.section);
    navigate({ to: item.path as any });
  };

  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = messages.filter((m) => m.sender === 'manager' && !m.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!isAuthenticated) return <LoginGate />;

  return (
    <div className="flex h-screen bg-[#070707] text-white font-sans overflow-hidden dark">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 272 : 72 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 flex-shrink-0 border-r border-white/[0.07] bg-[#0C0C0C] flex flex-col overflow-hidden"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-[68px] px-5 border-b border-white/[0.07] flex-shrink-0">
          <AnimatePresence initial={false}>
            {sidebarOpen ? (
              <motion.div
                key="full-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3 overflow-hidden"
              >
                <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center">
                  <img src={logo} alt="Logo" className="h-5 w-5 object-contain" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Client Portal</p>
                  <p className="text-[10px] text-[#C9A84C]/60 truncate">Manufacturing Hub</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="icon-logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-8 w-8 rounded-lg bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center"
              >
                <img src={logo} alt="Logo" className="h-5 w-5 object-contain" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-3 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.section;
            const badgeCount = item.section === 'messaging' ? unreadMessages : item.badge;
            return (
              <button
                key={item.section}
                onClick={() => navigateTo(item)}
                title={!sidebarOpen ? item.label : undefined}
                className={`relative flex items-center gap-3.5 px-3 py-2.5 rounded-xl transition-all duration-200 w-full group text-left ${
                  isActive
                    ? "bg-[#C9A84C]/10 text-[#C9A84C]"
                    : "text-white/40 hover:text-white/80 hover:bg-white/[0.04]"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20"
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <item.icon className={`h-4.5 w-4.5 flex-shrink-0 relative z-10 ${isActive ? "text-[#C9A84C]" : ""}`} style={{ width: 18, height: 18 }} />
                <AnimatePresence initial={false}>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="text-sm font-medium truncate relative z-10 flex-1"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {badgeCount && badgeCount > 0 && sidebarOpen && (
                  <span className="relative z-10 flex-shrink-0 h-5 min-w-5 px-1.5 rounded-full bg-[#C9A84C] text-black text-[10px] font-bold flex items-center justify-center">
                    {badgeCount}
                  </span>
                )}
                {badgeCount && badgeCount > 0 && !sidebarOpen && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#C9A84C] ring-2 ring-[#0C0C0C]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer - Profile */}
        <div className="border-t border-white/[0.07] p-3 flex-shrink-0">
          <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${sidebarOpen ? "" : "justify-center"}`}>
            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center text-black font-bold text-sm">
              {profile?.name?.charAt(0) ?? "C"}
            </div>
            <AnimatePresence initial={false}>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0 flex-1"
                >
                  <p className="text-sm font-medium text-white truncate">{profile?.name}</p>
                  <p className="text-[10px] text-white/40 truncate">{profile?.company}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-[68px] border-b border-white/[0.07] bg-[#0A0A0A]/80 backdrop-blur-xl flex items-center justify-between px-6 gap-4 flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-all text-white/50 hover:text-white"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="hidden md:flex items-center gap-2 text-white/30 text-sm">
              <span>Client Portal</span>
              <span>/</span>
              <span className="text-white/70 capitalize">{activeSection.replace(/-/g, ' ')}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language */}
            <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all text-sm">
              <Globe className="h-3.5 w-3.5" />
              <span>EN</span>
            </button>

            {/* New Request CTA */}
            <button
              onClick={() => navigate({ to: '/client/new-request' as any })}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#C9A84C] hover:bg-[#D4B86A] text-black font-semibold text-sm transition-all shadow-[0_2px_12px_rgba(201,168,76,0.25)]"
            >
              <Plus className="h-3.5 w-3.5" />
              New Request
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all text-white/50 hover:text-white"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#C9A84C] ring-2 ring-[#0A0A0A]" />
                )}
              </button>
              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-[#111] border border-white/10 shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/[0.07] flex justify-between items-center">
                      <span className="font-semibold text-sm">Notifications</span>
                      {unreadNotifications > 0 && (
                        <span className="text-[10px] text-[#C9A84C] font-medium">{unreadNotifications} new</span>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto scrollbar-hide">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => {
                          useClientStore.getState().markNotificationRead(n.id);
                          if (n.link) {
                            const target = NAV_ITEMS.find(i => i.section === n.link);
                            if (target) navigate({ to: target.path as any });
                          }
                          setNotifOpen(false);
                        }}
                          className={`w-full text-left px-4 py-3 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors flex gap-3 items-start ${!n.read ? "bg-white/[0.02]" : ""}`}
                        >
                          <div className={`mt-0.5 h-2 w-2 rounded-full flex-shrink-0 ${n.type === 'success' ? 'bg-emerald-400' : n.type === 'warning' ? 'bg-amber-400' : 'bg-[#C9A84C]'}`} />
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate">{n.title}</p>
                            <p className="text-[11px] text-white/40 mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                          {!n.read && <div className="h-1.5 w-1.5 rounded-full bg-[#C9A84C] flex-shrink-0 mt-1.5" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-all"
              >
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center text-black font-bold text-xs">
                  {profile?.name?.charAt(0) ?? "C"}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-white leading-tight">{profile?.name}</p>
                  <p className="text-[10px] text-white/40 leading-tight">{profile?.company}</p>
                </div>
                <ChevronDown className="h-3 w-3 text-white/30 hidden md:block" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-[#111] border border-white/10 shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/[0.07]">
                      <p className="text-sm font-semibold text-white">{profile?.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{profile?.email}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => { navigate({ to: '/client/settings' as any }); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/[0.05] transition-colors text-sm text-white/70 hover:text-white"
                      >
                        <Settings className="h-4 w-4" />
                        Account Settings
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          window.location.href = "/";
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-sm text-white/70 hover:text-red-400"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide relative">
          {/* Background pattern */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.015) 1px,transparent 1px)', backgroundSize: '28px 28px' }} />
          <div className="relative z-10 p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
