import React from "react";
import { Search, Bell, Menu, Sun, Moon } from "lucide-react";

interface AdminHeaderProps {
  activeAdminSubTab: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  theme?: "light" | "dark";
  setTheme?: (theme: "light" | "dark") => void;
}

export default function AdminHeader({
  activeAdminSubTab,
  searchQuery,
  setSearchQuery,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  theme,
  setTheme
}: AdminHeaderProps) {
  const getBreadcrumbTitle = () => {
    switch (activeAdminSubTab) {
      case "overview": return "الملخص العام";
      case "trials": return "طلبات التراخيص";
      case "tickets": return "تذاكر الدعم";
      case "baridimob": return "مدفوعات بريدي موب";
      case "logs": return "سجلات الأحداث";
      case "settings": return "إعدادات الرخص";
      default: return "الملخص";
    }
  };

  const getPageTitle = () => {
    switch (activeAdminSubTab) {
      case "overview": return "لوحة الإحصائيات والملخص العام";
      case "trials": return "تسيير طلبات البرنامج والتراخيص";
      case "tickets": return "تذاكر وقضايا الدعم الفني المفتوحة";
      case "baridimob": return "مطابقة مدفوعات CCP وبريدي موب";
      case "logs": return "سجل نشاط النظام والربط المباشر";
      case "settings": return "إعدادات الترخيص وتعديل الأسعار";
      default: return "لوحة التحكم الرئيسية";
    }
  };

  return (
    <header className="bg-[#121218] border-b border-[rgba(255,255,255,0.06)] px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 z-10 shrink-0">
      
      {/* Right Header Side: Page Title & Breadcrumb */}
      <div className="flex items-center gap-4 w-full md:w-auto text-right justify-end md:justify-start flex-row-reverse md:flex-row">
        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 bg-[#121218] border border-[rgba(255,255,255,0.12)] rounded-xl text-slate-300 lg:hidden hover:border-[#7C3AED] hover:text-white transition-all cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="text-right">
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold mb-1 justify-end md:justify-start flex-row-reverse md:flex-row">
            <span>الرئيسية</span>
            <span>/</span>
            <span>لوحة التحكم</span>
            <span>/</span>
            <span className="text-[#A855F7]">{getBreadcrumbTitle()}</span>
          </div>
          <h1 className="text-sm sm:text-base font-black text-white">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      {/* Center Search Input */}
      <div className="relative w-full md:w-80 lg:w-96">
        <Search className="w-4 h-4 text-slate-500 absolute top-3 right-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث بالاسم، الولاية، أو رقم الهاتف..."
          className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl pr-11 pl-4 py-2.5 text-xs text-slate-200 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED] transition-all placeholder:text-slate-650"
        />
      </div>

      {/* Left Header Side: User profile & status widgets */}
      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        {/* Theme Toggle Switch */}
        {setTheme && (
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2.5 bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] hover:border-[#7C3AED] rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer"
            title={theme === "light" ? "تفعيل الوضع الداكن" : "تفعيل الوضع المضيء"}
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 text-[#A855F7]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>
        )}

        {/* Notifications */}
        <button className="p-2.5 bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] hover:border-[#7C3AED] rounded-xl text-slate-400 hover:text-white transition-all relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
        </button>

        {/* Sync Status Widget */}
        <div className="hidden sm:flex flex-col items-end text-right bg-[#0B0B0F] px-4 py-1.5 rounded-xl border border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping"></span>
            <span className="text-[10px] text-[#22C55E] font-black">Online متصل</span>
          </div>
          <p className="text-[9px] text-slate-500 mt-0.5">آخر مزامنة: قبل ثانيتين</p>
        </div>

        {/* User Info & Avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-200">المدير العام</p>
            <p className="text-[10px] text-slate-500 font-mono">mh2010255c@gmail.com</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] p-px">
            <div className="w-full h-full rounded-xl bg-[#121218] flex items-center justify-center font-black text-white text-xs">
              FZ
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
