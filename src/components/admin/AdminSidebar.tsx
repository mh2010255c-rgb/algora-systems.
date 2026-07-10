import React from "react";
import { 
  Layers, Activity, Users, MessageSquareCode, CreditCard, Sliders, Sparkles, Lock, X 
} from "lucide-react";

interface AdminSidebarProps {
  activeAdminSubTab: string;
  setActiveAdminSubTab: (tab: "overview" | "trials" | "tickets" | "baridimob" | "logs" | "settings" | "whatsapp") => void;
  stats: {
    pendingTrials: number;
    openTickets: number;
  };
  pendingPaymentsCount: number;
  handleLogout: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({
  activeAdminSubTab,
  setActiveAdminSubTab,
  stats,
  pendingPaymentsCount,
  handleLogout,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen
}: AdminSidebarProps) {
  return (
    <aside 
      className={`fixed inset-y-0 right-0 z-50 w-[280px] bg-[#0B0B0F] border-l border-[rgba(255,255,255,0.06)] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
        isMobileSidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
      }`}
    >
      {/* Mobile close button */}
      <div className="lg:hidden absolute top-4 left-4">
        <button 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="p-1.5 rounded-lg bg-[#121218] border border-[rgba(255,255,255,0.12)] text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Logo & Branding */}
      <div className="p-6 border-b border-[rgba(255,255,255,0.06)] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all hover:scale-105 duration-300">
          <Sparkles className="w-9 h-9 text-white animate-pulse" />
        </div>
        <h2 className="text-xl font-black text-white mt-3 tracking-wide">فون زون</h2>
        <p className="text-[10px] text-[#A855F7] font-black uppercase tracking-widest mt-1">Fon Zon Systems</p>
      </div>

      {/* Menu List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 text-right">

        {/* Group 2: تسيير العمليات */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider pr-3">تسيير العمليات</p>
          
          <button
            onClick={() => { setActiveAdminSubTab("trials"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeAdminSubTab === "trials"
                ? "bg-gradient-to-l from-[#7C3AED] to-[#A855F7] text-white shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-[#121218]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 shrink-0" />
              <span>طلبات البرامج والتراخيص</span>
            </div>
            {stats.pendingTrials > 0 && (
              <span className="text-[9px] bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30 px-1.5 py-0.5 rounded font-bold animate-pulse">{stats.pendingTrials}</span>
            )}
          </button>

          <button
            onClick={() => { setActiveAdminSubTab("tickets"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeAdminSubTab === "tickets"
                ? "bg-gradient-to-l from-[#7C3AED] to-[#A855F7] text-white shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-[#121218]"
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquareCode className="w-4 h-4 shrink-0" />
              <span>تذاكر الدعم الفني</span>
            </div>
            {stats.openTickets > 0 && (
              <span className="text-[9px] bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30 px-1.5 py-0.5 rounded font-bold">{stats.openTickets}</span>
            )}
          </button>

          <button
            onClick={() => { setActiveAdminSubTab("baridimob"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeAdminSubTab === "baridimob"
                ? "bg-gradient-to-l from-[#7C3AED] to-[#A855F7] text-white shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-[#121218]"
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4 shrink-0" />
              <span>مدفوعات بريدي موب</span>
            </div>
            {pendingPaymentsCount > 0 && (
              <span className="text-[9px] bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 px-1.5 py-0.5 rounded font-bold animate-pulse">{pendingPaymentsCount}</span>
            )}
          </button>
        </div>

        {/* Group 3: إعدادات النظام */}
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider pr-3">إعدادات النظام</p>

          <button
            onClick={() => { setActiveAdminSubTab("whatsapp"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeAdminSubTab === "whatsapp"
                ? "bg-gradient-to-l from-[#7C3AED] to-[#A855F7] text-white shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-[#121218]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Activity className="w-4 h-4 shrink-0" />
              <span>WhatsApp Automation</span>
            </div>
          </button>

          <button
            onClick={() => { setActiveAdminSubTab("settings"); setIsMobileSidebarOpen(false); }}
            className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeAdminSubTab === "settings"
                ? "bg-gradient-to-l from-[#7C3AED] to-[#A855F7] text-white shadow-[0_4px_12px_rgba(124,58,237,0.25)]"
                : "text-slate-400 hover:text-white hover:bg-[#121218]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Sliders className="w-4 h-4 shrink-0" />
              <span>الأسعار والتراخيص</span>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Logout Card */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.06)] bg-[#121218] m-4 rounded-2xl">
        <div className="flex items-center gap-3 mb-3 text-right justify-end">
          <div className="text-right">
            <p className="text-xs font-black text-white">مدير النظام</p>
            <p className="text-[10px] text-slate-500 font-mono">admin@fonzon.com</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center text-[#A855F7] font-black font-mono">
            AD
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-transparent border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
        >
          <Lock className="w-4 h-4" />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}
