import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { 
  User, Building2, Bell, Shield, Key, MapPin, 
  CreditCard, Upload, Check, Globe
} from "lucide-react";
import { useClientStore } from "@/store/clientStore";

export const Route = createFileRoute("/client/settings")({
  component: AccountSettings,
});

function AccountSettings() {
  const { profile } = useClientStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-white">Account Settings</h1>
        <p className="text-white/35 text-sm mt-1">Manage your brand profile and dashboard preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
          {[
            { id: "profile", label: "Brand Profile", icon: Building2 },
            { id: "personal", label: "Personal Details", icon: User },
            { id: "security", label: "Security & Login", icon: Shield },
            { id: "notifications", label: "Notifications", icon: Bell },
            { id: "billing", label: "Billing & Shipping", icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C]"
                  : "bg-transparent border border-transparent text-white/50 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-[#0E0E0E] border border-white/[0.06] p-6 md:p-8"
          >
            {activeTab === "profile" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Brand Profile</h2>
                  <p className="text-xs text-white/40">This information appears on your invoices and project documentation.</p>
                </div>
                
                <div className="flex items-center gap-6 pb-6 border-b border-white/[0.06]">
                  <div className="h-24 w-24 rounded-2xl bg-white/[0.04] border border-white/[0.08] border-dashed flex flex-col items-center justify-center text-white/30 hover:text-white hover:border-[#C9A84C]/50 hover:bg-[#C9A84C]/5 transition-all cursor-pointer">
                    <Upload className="h-6 w-6 mb-2" />
                    <span className="text-[10px] uppercase font-medium">Upload Logo</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">Company Logo</h3>
                    <p className="text-[11px] text-white/30 max-w-xs">High resolution PNG or SVG. Max file size 5MB. Must have a transparent background.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Company Name</label>
                    <input defaultValue={profile?.company} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 outline-none text-white text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Trade License / Registration Number</label>
                    <input defaultValue="TRD-2023-88910" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 outline-none text-white text-sm" />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Company Description</label>
                    <textarea rows={3} defaultValue="Luxury cosmetics brand focusing on organic ingredients and sustainable packaging." className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 outline-none text-white text-sm resize-none" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "personal" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold text-white mb-1">Personal Details</h2>
                  <p className="text-xs text-white/40">Manage your contact information</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Full Name</label>
                    <input defaultValue={profile?.name} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 outline-none text-white text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Email Address</label>
                    <input defaultValue={profile?.email} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 outline-none text-white text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Phone Number</label>
                    <input defaultValue={profile?.phone} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 outline-none text-white text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Role / Title</label>
                    <input defaultValue="Founder & CEO" className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] focus:border-[#C9A84C]/50 outline-none text-white text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Save Button Container */}
            <div className="mt-8 pt-6 border-t border-white/[0.06] flex justify-end">
              <button 
                onClick={handleSave}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#C9A84C] hover:bg-[#D4B86A] text-black font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(201,168,76,0.3)] w-full sm:w-auto"
              >
                {saved ? <><Check className="h-4 w-4" /> Saved</> : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
