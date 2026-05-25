import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Users, Box, MessageSquare, Package, Clock, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/admin/")({
  component: DashboardOverview,
});

const STATS = [
  { label: "Total Visitors", value: "24,593", change: "+14%", icon: Users },
  { label: "Builder Requests", value: "1,249", change: "+22%", icon: Box },
  { label: "Pending Quotations", value: "84", change: "+5%", icon: Clock },
  { label: "Active Products", value: "412", change: "+12%", icon: Package },
];

const CHART_DATA = [
  { name: "Jan", visitors: 4000, requests: 2400 },
  { name: "Feb", visitors: 3000, requests: 1398 },
  { name: "Mar", visitors: 2000, requests: 9800 },
  { name: "Apr", visitors: 2780, requests: 3908 },
  { name: "May", visitors: 1890, requests: 4800 },
  { name: "Jun", visitors: 2390, requests: 3800 },
  { name: "Jul", visitors: 3490, requests: 4300 },
];

const RECENT_ACTIVITY = [
  { id: 1, action: "New Builder Request", user: "Ahmed Al-Maktoum", time: "2 hours ago", status: "Pending" },
  { id: 2, action: "Quotation Approved", user: "Oud Essentials", time: "5 hours ago", status: "Completed" },
  { id: 3, action: "Contact Submission", user: "Sarah Jenkins", time: "1 day ago", status: "In Review" },
];

function DashboardOverview() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-1">Dashboard Overview</h1>
          <p className="text-muted-foreground text-sm">Welcome back, Admin. Here is your platform's performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition text-sm font-medium">
            <MessageSquare className="h-4 w-4" /> View Messages
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gold text-black rounded-lg hover:bg-gold-soft transition shadow-gold-glow text-sm font-medium">
            <Plus className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-card border border-white/5 shadow-xl relative overflow-hidden group hover:border-gold/30 transition-colors"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:bg-gold/10 transition-colors" />
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-white/5 text-gold">
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
                <TrendingUp className="h-3 w-3" /> {stat.change}
              </span>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="font-display text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-2xl bg-card border border-white/5 shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-lg font-semibold text-white">Platform Traffic & Requests</h3>
            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm text-muted-foreground outline-none focus:border-gold/50">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--gold)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--gold)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(20,20,20,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="visitors" stroke="var(--gold)" strokeWidth={3} fillOpacity={1} fill="url(#colorVisitors)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-card border border-white/5 shadow-xl flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-lg font-semibold text-white">Recent Activity</h3>
            <button className="text-gold text-sm hover:underline">View All</button>
          </div>
          <div className="flex-1 space-y-6">
            {RECENT_ACTIVITY.map((activity, i) => (
              <div key={activity.id} className="relative pl-6">
                <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${activity.status === 'Completed' ? 'bg-emerald-400' : activity.status === 'Pending' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                {i !== RECENT_ACTIVITY.length - 1 && (
                  <div className="absolute left-[3px] top-4 w-px h-10 bg-white/10" />
                )}
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium text-white">{activity.action}</p>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <span className="text-white/80">{activity.user}</span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-white/5 uppercase tracking-wider">
                    {activity.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-colors text-sm font-medium text-white flex items-center justify-center gap-2">
            View Request Log <ArrowRight className="h-4 w-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
