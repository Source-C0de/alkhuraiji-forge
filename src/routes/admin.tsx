import { Outlet, createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Image as ImageIcon, 
  Box, 
  Droplet, 
  MessageSquare,
  Globe,
  FileText,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  Lock
} from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import { useAdminStore } from "@/store/adminStore";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: FileText, label: "Website Content", path: "/admin/content" },
  { icon: Box, label: "Builder Manager", path: "/admin/builder" },
  { icon: Droplet, label: "Products Manager", path: "/admin/products" },
  { icon: ImageIcon, label: "Media Library", path: "/admin/media" },
  { icon: Globe, label: "Multilingual", path: "/admin/multilingual" },
  { icon: MessageSquare, label: "Customer Requests", path: "/admin/requests" },
  { icon: Users, label: "User Management", path: "/admin/users" },
  { icon: Settings, label: "SEO & Settings", path: "/admin/settings" },
];

function AdminLayout() {
  const { isAuthenticated, login, logout } = useAdminStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(password)) setError(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] bg-[url('/blueprint-dark.png')] bg-repeat bg-[length:64px_64px] bg-blend-soft-light relative">
        <div className="absolute inset-0 bg-background/95 backdrop-blur-[2px] z-0" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md p-8 rounded-2xl bg-card border border-white/10 shadow-2xl overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold to-gold-soft" />
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20 shadow-gold-glow">
              <Lock className="h-8 w-8 text-gold" />
            </div>
          </div>
          <h1 className="text-center font-display text-2xl font-bold text-white mb-2">Admin Login</h1>
          <p className="text-center text-sm text-muted-foreground mb-8">Access the CMS and Builder Manager</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Enter admin password..." 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                className={`w-full px-4 py-3 rounded-lg bg-black/50 border ${error ? 'border-red-500' : 'border-white/10'} focus:border-gold outline-none text-white transition-colors`}
              />
              {error && <p className="text-red-500 text-xs mt-2">Incorrect password. Hint: admin123</p>}
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-gold text-black font-semibold hover:bg-gold-soft transition shadow-gold-glow">
              Authenticate
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-foreground font-sans overflow-hidden dark">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="relative z-20 flex-shrink-0 border-r border-gold/20 bg-card/50 backdrop-blur-xl flex flex-col transition-all duration-300"
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-gold/10">
          <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="flex-shrink-0 h-10 w-10 bg-gold/10 rounded-xl flex items-center justify-center border border-gold/20">
              <img src={logo} alt="Logo" className="h-6 w-6 object-contain" />
            </div>
            {sidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display font-semibold text-lg text-gradient-gold whitespace-nowrap"
              >
                Admin Panel
              </motion.span>
            )}
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide py-6 px-4 flex flex-col gap-2">
          {MENU_ITEMS.map((item) => {
            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-gold/10 text-gold shadow-[inset_0_0_0_1px_var(--gold-soft)]" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <item.icon className={`h-5 w-5 flex-shrink-0 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                {sidebarOpen && (
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                )}
                {isActive && sidebarOpen && (
                  <motion.div 
                    layoutId="active-nav-indicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-gold"
                  />
                )}
              </Link>
            );
          })}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 border-b border-gold/10 bg-card/30 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search everywhere..." 
                className="h-10 pl-10 pr-4 rounded-full bg-white/5 border border-white/10 focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all text-sm w-64 placeholder:text-muted-foreground"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
            </button>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-colors text-muted-foreground text-sm font-medium"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide bg-[url('/blueprint-dark.png')] bg-repeat bg-[length:64px_64px] bg-blend-soft-light relative">
          <div className="absolute inset-0 bg-background/95 backdrop-blur-[2px] z-0" />
          <div className="relative z-10 p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
