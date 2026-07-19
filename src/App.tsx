import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Smartphone, Headphones, LayoutDashboard, Menu, X, Sparkles, 
  HelpCircle, MessageSquareCode, Award, ShieldCheck, PlayCircle, ArrowLeft, Info,
  ChevronRight, ChevronLeft, Lock, Sun, Moon
} from "lucide-react";
import LandingPage from "./components/LandingPage";
import InteractiveDashboardDemo from "./components/InteractiveDashboardDemo";
import SupportCenter from "./components/SupportCenter";
import GreetingWizard from "./components/GreetingWizard";
import InfoPages, { InfoSection } from "./components/InfoPages";
import AdminDashboard from "./components/AdminDashboard";
import { ErrorBoundary } from "react-error-boundary";

function AdminErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6 text-right" dir="rtl">
      <div className="max-w-md w-full bg-red-950/20 border border-red-900/50 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-red-500 mb-2">عذراً، حدث خطأ غير متوقع</h2>
        <div className="bg-black/50 p-3 rounded-lg overflow-x-auto mb-4">
          <pre className="text-red-400 text-xs text-left" dir="ltr">{error.message}</pre>
        </div>
        <button onClick={resetErrorBoundary} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm transition-colors">
          حاول مرة أخرى
        </button>
      </div>
    </div>
  );
}

type ActiveTab = "home" | "demo" | "support" | "info" | "admin";

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("home");
  const [activeInfoSection, setActiveInfoSection] = useState<InfoSection>("about");
  const [showGreeting, setShowGreeting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const trialFormRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("theme") as "light" | "dark") || "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Trigger interactive greeting wizard on first load if not requested trial yet or route to admin
  useEffect(() => {
    const path = window.location.pathname.replace(/\/$/, "");
    if (path === "/admin" || path === "/admine") {
      setActiveTab("admin");
    } else {
      const hasRequested = localStorage.getItem("algora_trial_requested");
      if (!hasRequested) {
        // Delay slightly for dramatic introduction effect
        const timer = setTimeout(() => {
          setShowGreeting(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleNavToTrialForm = () => {
    setActiveTab("home");
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById("trial-form-section");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  const handleNavToInfo = (section: InfoSection) => {
    setActiveInfoSection(section);
    setActiveTab("info");
    setMobileMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById("info-pages-container");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#060813] text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-300 antialiased overflow-x-hidden">
      
      {/* 1. BACKDROP OVERLAY FOR MOBILE SIDEBAR DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          />
        )}
      </AnimatePresence>

      {/* 2. MOBILE DRAWER SIDEBAR (SLIDE-IN) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-72 bg-slate-950/95 border-l border-slate-900/60 backdrop-blur-md z-50 p-6 flex flex-col justify-between md:hidden shadow-2xl"
          >
            <div className="space-y-6">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-slate-900 pb-4">
                <div className="flex items-center gap-2.5 text-right">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-black text-white text-sm">
                    A
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm tracking-tight">Algora Systems</h4>
                    <p className="text-[9px] text-slate-500">إدارة محلات الهواتف والصيانة</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 bg-slate-900/60 hover:bg-slate-850 border border-slate-800/40 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Links List for Mobile */}
              <nav className="space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("home");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-xs ${
                    activeTab === "home"
                      ? "bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-white border-r-4 border-purple-500"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-r-4 border-transparent"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>الرئيسية والمميزات</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("demo");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-xs ${
                    activeTab === "demo"
                      ? "bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-white border-r-4 border-purple-500"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-r-4 border-transparent"
                  }`}
                >
                  <PlayCircle className="w-4 h-4 text-purple-400 shrink-0" />
                  <span className="flex-1 text-right">العرض التجريبي الحيّ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("support");
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-xs ${
                    activeTab === "support"
                      ? "bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-white border-r-4 border-purple-500"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-r-4 border-transparent"
                  }`}
                >
                  <Headphones className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>الدعم الفني والذكاء</span>
                </button>

                {/* Info Tab expandable links */}
                <div>
                  <button
                    onClick={() => {
                      setActiveTab("info");
                      setActiveInfoSection("about");
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-xs ${
                      activeTab === "info"
                        ? "bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-white border-r-4 border-purple-500"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-r-4 border-transparent"
                    }`}
                  >
                    <Info className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>من نحن والسياسات</span>
                  </button>
                  
                  {/* Nested Policy Sublinks */}
                  <div className="mr-6 pr-2 border-r border-slate-800/80 my-1.5 space-y-1">
                    <button
                      onClick={() => handleNavToInfo("about")}
                      className={`w-full py-1.5 text-[11px] font-bold text-right flex items-center justify-start gap-2 ${
                        activeTab === "info" && activeInfoSection === "about" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                      <span>حول الشركة - Algora Systems</span>
                    </button>
                    
                    <button
                      onClick={() => handleNavToInfo("terms")}
                      className={`w-full py-1.5 text-[11px] font-bold text-right flex items-center justify-start gap-2 ${
                        activeTab === "info" && activeInfoSection === "terms" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                      <span>شروط وأحكام الخدمة</span>
                    </button>

                    <button
                      onClick={() => handleNavToInfo("privacy")}
                      className={`w-full py-1.5 text-[11px] font-bold text-right flex items-center justify-start gap-2 ${
                        activeTab === "info" && activeInfoSection === "privacy" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>سياسة حماية الخصوصية</span>
                    </button>

                    <button
                      onClick={() => handleNavToInfo("refund")}
                      className={`w-full py-1.5 text-[11px] font-bold text-right flex items-center justify-start gap-2 ${
                        activeTab === "info" && activeInfoSection === "refund" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      <span>سياسة الاستبدال والاسترجاع</span>
                    </button>
                  </div>
                </div>
              </nav>
            </div>

            <div className="space-y-3">
              {/* Theme Selector Section inside Mobile Drawer */}
              <div className="flex items-center justify-between flex-row-reverse bg-slate-900/40 p-3 rounded-xl border border-slate-900/60 mb-2">
                <span className="text-slate-400 text-xs font-bold">مظهر التطبيق:</span>
                <button
                  onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800/80 text-slate-200 rounded-lg text-xs font-black transition-all cursor-pointer"
                >
                  {theme === "light" ? (
                    <>
                      <Moon className="w-3.5 h-3.5 text-purple-400" />
                      <span>الوضع الداكن</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>الوضع المضيء</span>
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  setShowGreeting(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-slate-900/60 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl text-xs font-black flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>الدليل والتعليمات</span>
              </button>

              <button
                onClick={handleNavToTrialForm}
                className="w-full py-3 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
              >
                تفعيل تجريبي مجاني ⚡
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* 3. PERSISTENT COLLAPSIBLE DESKTOP SIDEBAR */}
      <aside 
        className="hidden"
      >
        <div className="space-y-8">
          {/* Logo Section */}
          <div className="flex items-center gap-3 justify-start overflow-hidden">
            <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-black text-white text-lg border border-purple-500/25 shadow-lg shadow-purple-900/30 shrink-0">
              A
            </div>
            {!isSidebarCollapsed && (
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-black text-sm tracking-tight">Algora Systems</span>
                  <span className="text-[9px] bg-purple-500/15 border border-purple-500/25 text-purple-400 font-bold px-1.5 py-0.5 rounded-full">الجزائر</span>
                </div>
                <p className="text-[9px] text-slate-500 font-medium">لوجيسيال محلات الهواتف والصيانة</p>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-xs ${
                activeTab === "home"
                  ? "bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-white border-r-4 border-purple-500 shadow-md shadow-purple-900/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-r-4 border-transparent"
              } ${isSidebarCollapsed ? "justify-center" : "justify-start"}`}
              title="الرئيسية والمميزات"
            >
              <LayoutDashboard className="w-4.5 h-4.5 text-purple-400 shrink-0" />
              {!isSidebarCollapsed && <span>الرئيسية والمميزات</span>}
            </button>

            <button
              onClick={() => setActiveTab("demo")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-xs ${
                activeTab === "demo"
                  ? "bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-white border-r-4 border-purple-500 shadow-md shadow-purple-900/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-r-4 border-transparent"
              } ${isSidebarCollapsed ? "justify-center" : "justify-start"}`}
              title="العرض التجريبي الحيّ"
            >
              <PlayCircle className="w-4.5 h-4.5 text-purple-400 shrink-0" />
              {!isSidebarCollapsed ? (
                <>
                  <span className="flex-1 text-right">العرض التجريبي الحيّ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </>
              ) : (
                <div className="absolute right-2 top-2 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950 animate-pulse"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab("support")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-xs ${
                activeTab === "support"
                  ? "bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-white border-r-4 border-purple-500 shadow-md shadow-purple-900/5"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-r-4 border-transparent"
              } ${isSidebarCollapsed ? "justify-center" : "justify-start"}`}
              title="الدعم الفني والذكاء الاصطناعي"
            >
              <Headphones className="w-4.5 h-4.5 text-purple-400 shrink-0" />
              {!isSidebarCollapsed && <span>الدعم والذكاء الاصطناعي</span>}
            </button>

            {/* Info and sublinks */}
            <div>
              <button
                onClick={() => {
                  setActiveTab("info");
                  setActiveInfoSection("about");
                }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-xs ${
                  activeTab === "info"
                    ? "bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-white border-r-4 border-purple-500 shadow-md"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 border-r-4 border-transparent"
                } ${isSidebarCollapsed ? "justify-center" : "justify-start"}`}
                title="من نحن والسياسات"
              >
                <Info className="w-4.5 h-4.5 text-purple-400 shrink-0" />
                {!isSidebarCollapsed && <span>معلوماتنا وسياساتنا</span>}
              </button>

              {!isSidebarCollapsed && activeTab === "info" && (
                <div className="mr-6 pr-3 border-r border-slate-900 my-1.5 space-y-1">
                  <button
                    onClick={() => handleNavToInfo("about")}
                    className={`w-full py-1 text-[11px] font-bold text-right flex items-center justify-start gap-2 ${
                      activeInfoSection === "about" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                    <span>من نحن - Algora</span>
                  </button>
                  
                  <button
                    onClick={() => handleNavToInfo("terms")}
                    className={`w-full py-1 text-[11px] font-bold text-right flex items-center justify-start gap-2 ${
                      activeInfoSection === "terms" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                    <span>شروط الاستخدام</span>
                  </button>

                  <button
                    onClick={() => handleNavToInfo("privacy")}
                    className={`w-full py-1 text-[11px] font-bold text-right flex items-center justify-start gap-2 ${
                      activeInfoSection === "privacy" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                    <span>سياسة الخصوصية</span>
                  </button>

                  <button
                    onClick={() => handleNavToInfo("refund")}
                    className={`w-full py-1 text-[11px] font-bold text-right flex items-center justify-start gap-2 ${
                      activeInfoSection === "refund" ? "text-purple-400" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                    <span>الاستبدال والاسترجاع</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-bold text-xs ${
                activeTab === "admin"
                  ? "bg-gradient-to-l from-purple-600/20 to-indigo-600/20 text-white border-r-4 border-purple-500 shadow-md shadow-purple-900/5"
                  : "text-purple-400 hover:text-purple-300 hover:bg-slate-900/40 border-r-4 border-transparent"
              } ${isSidebarCollapsed ? "justify-center" : "justify-start"}`}
              title="لوحة تسيير الطلبات المشفرة"
            >
              <Lock className="w-4.5 h-4.5 text-purple-400 shrink-0" />
              {!isSidebarCollapsed && (
                <span className="flex items-center gap-1">
                  <span>لوحة تسيير الطلبات</span>
                  <span className="text-[10px] text-slate-500">🔐</span>
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom widgets of Desktop Sidebar */}
        <div className="space-y-4">
          <button
            onClick={() => setShowGreeting(true)}
            className={`w-full py-2.5 bg-slate-900/60 hover:bg-slate-850 border border-slate-800/40 text-slate-300 rounded-xl text-xs font-black flex items-center gap-2 ${
              isSidebarCollapsed ? "justify-center" : "px-4 justify-start"
            }`}
            title="الدليل التفاعلي"
          >
            <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
            {!isSidebarCollapsed && <span>الدليل والتعليمات</span>}
          </button>

          {!isSidebarCollapsed ? (
            <button
              onClick={handleNavToTrialForm}
              className="w-full py-3 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <span>تجربة مجانية (5 أيام)</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleNavToTrialForm}
              className="w-10 h-10 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl shadow-lg transition-all flex items-center justify-center mx-auto"
              title="تجربة مجانية"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          )}

          {/* Sidebar collapse toggler button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="w-full py-1.5 bg-slate-950 hover:bg-slate-900 border border-slate-900 text-slate-500 hover:text-slate-300 rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition-all"
          >
            {isSidebarCollapsed ? (
              <>
                <ChevronLeft className="w-3.5 h-3.5 text-purple-400" />
              </>
            ) : (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
                <span>تصغير القائمة</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* 4. MAIN CONTENT WORKSPACE (Contains top header and the active view) */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* DESKTOP MASTER HEADER */}
        {activeTab !== "admin" && (
          <header className="hidden md:flex items-center justify-between bg-slate-950/80 border-b border-slate-900 backdrop-blur-md px-8 py-4 sticky top-0 z-30">
            
            {/* Right Group: Logo and Nav Menu */}
            <div className="flex items-center gap-8">
              {/* Logo Section */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-purple-600 rounded-xl flex items-center justify-center font-black text-white text-base border border-purple-500/25 shadow-lg shadow-purple-900/30 shrink-0">
                  A
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="text-white font-black text-sm tracking-tight">Algora Systems</span>
                    <span className="text-[9px] bg-purple-500/15 border border-purple-500/25 text-purple-400 font-bold px-1.5 py-0.5 rounded-full">الجزائر</span>
                  </div>
                  <p className="text-[9px] text-slate-500 font-medium">لوجيسيال محلات الهواتف والصيانة</p>
                </div>
              </div>

              {/* Horizontal Navigation Menu */}
              <nav className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab("home")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold text-xs cursor-pointer ${
                    activeTab === "home"
                      ? "bg-purple-600/15 text-purple-400 border border-purple-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>الرئيسية والمميزات</span>
                </button>

                <button
                  onClick={() => setActiveTab("demo")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold text-xs relative cursor-pointer ${
                    activeTab === "demo"
                      ? "bg-purple-600/15 text-purple-400 border border-purple-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  <PlayCircle className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>العرض التجريبي الحيّ</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </button>

                <button
                  onClick={() => setActiveTab("support")}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold text-xs cursor-pointer ${
                    activeTab === "support"
                      ? "bg-purple-600/15 text-purple-400 border border-purple-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  <Headphones className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>الدعم والذكاء الاصطناعي</span>
                </button>

                {/* Info Dropdown */}
                <div className="relative group">
                  <button
                    onClick={() => {
                      setActiveTab("info");
                      setActiveInfoSection("about");
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all font-bold text-xs cursor-pointer ${
                      activeTab === "info"
                        ? "bg-purple-600/15 text-purple-400 border border-purple-500/20"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                    }`}
                  >
                    <Info className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>معلوماتنا وسياساتنا</span>
                  </button>
                  
                  {/* Dropdown Menu on Hover */}
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-slate-950/95 border border-slate-900 rounded-xl p-1.5 hidden group-hover:block hover:block shadow-2xl z-50 transition-all duration-200">
                    <button
                      onClick={() => handleNavToInfo("about")}
                      className={`w-full px-3 py-2 text-[11px] font-bold text-right flex items-center gap-2 rounded-lg cursor-pointer ${
                        activeTab === "info" && activeInfoSection === "about" ? "bg-purple-600/10 text-purple-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"></span>
                      <span>من نحن - Algora</span>
                    </button>
                    <button
                      onClick={() => handleNavToInfo("terms")}
                      className={`w-full px-3 py-2 text-[11px] font-bold text-right flex items-center gap-2 rounded-lg cursor-pointer ${
                        activeTab === "info" && activeInfoSection === "terms" ? "bg-purple-600/10 text-purple-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                      <span>شروط الاستخدام</span>
                    </button>
                    <button
                      onClick={() => handleNavToInfo("privacy")}
                      className={`w-full px-3 py-2 text-[11px] font-bold text-right flex items-center gap-2 rounded-lg cursor-pointer ${
                        activeTab === "info" && activeInfoSection === "privacy" ? "bg-purple-600/10 text-purple-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span>سياسة الخصوصية</span>
                    </button>
                    <button
                      onClick={() => handleNavToInfo("refund")}
                      className={`w-full px-3 py-2 text-[11px] font-bold text-right flex items-center gap-2 rounded-lg cursor-pointer ${
                        activeTab === "info" && activeInfoSection === "refund" ? "bg-purple-600/10 text-purple-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      <span>الاستبدال والاسترجاع</span>
                    </button>
                  </div>
                </div>
              </nav>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Light Mode / Dark Mode Toggle button */}
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2.5 bg-slate-900/60 hover:bg-slate-850 border border-slate-800/40 text-slate-300 hover:text-white rounded-xl transition-all cursor-pointer flex items-center justify-center"
                title={theme === "light" ? "تفعيل الوضع الداكن" : "تفعيل الوضع المضيء"}
              >
                {theme === "light" ? <Moon className="w-4 h-4 text-[#A855F7]" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </button>

              <button
                onClick={() => setShowGreeting(true)}
                className="py-2 px-3.5 bg-slate-900/60 hover:bg-slate-850 border border-slate-800/40 text-slate-300 rounded-xl text-xs font-black flex items-center gap-2 transition-colors cursor-pointer"
                title="الدليل التفاعلي"
              >
                <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
                <span>الدليل والتعليمات</span>
              </button>

              <button
                onClick={handleNavToTrialForm}
                className="py-2.5 px-4 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>تجربة مجانية (5 أيام)</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>
        )}

        {/* MOBILE DYNAMIC HEADER */}
        {activeTab !== "admin" && (
          <header className="md:hidden sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center font-black text-white text-sm">
                A
              </div>
              <div className="text-right">
                <span className="text-white font-black text-xs">Algora Systems</span>
                <span className="text-[8px] bg-purple-500/10 border border-purple-500/20 text-purple-400 px-1 py-0.2 rounded-full mr-1.5">الجزائر</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/213553361047?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D9%86%D8%B8%D8%A7%D9%85%20Algora%20%D9%88%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B5%D9%88%D9%84%20%D8%B9%D9%84%D9%89%20%D9%86%D8%B3%D8%AE%D8%AA%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                title="تواصل معنا عبر واتساب"
              >
                <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </a>
              <button
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-200 transition-colors cursor-pointer flex items-center justify-center"
                title={theme === "light" ? "تفعيل الوضع الداكن" : "تفعيل الوضع المضيء"}
              >
                {theme === "light" ? <Moon className="w-4 h-4 text-[#A855F7]" /> : <Sun className="w-4 h-4 text-amber-500" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg text-slate-200 transition-colors flex items-center justify-center"
              >
                <Menu className="w-4 h-4" />
              </button>
            </div>
          </header>
        )}

        {/* DESKTOP TOP STATUS BAR */}
        {activeTab !== "admin" && (
          <div className="hidden md:flex items-center justify-between bg-slate-950/20 border-b border-slate-900/40 px-8 py-3 text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-4 text-right">
              <span className="text-[11px] font-black text-slate-200 flex items-center gap-2 bg-slate-950/50 border border-slate-850/60 px-3 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>
                  {activeTab === "home" && "الرئيسية والمزايا التجارية"}
                  {activeTab === "demo" && "منصة المحاكاة والعرض الحي"}
                  {activeTab === "support" && "المساعد الذكي والمهندسين 24/7"}
                  {activeTab === "info" && "مركز التوثيق وقوانين النظام"}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-4 font-bold text-[11px]">
              <span className="text-slate-500">طريقة الدفع المقبولة: بريدي موب (Baridimob) & CCP</span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-300">الولاية الحالية للتغطية: <span className="text-purple-400">58 ولاية الجزائر 🇩🇿</span></span>
            </div>
          </div>
        )}

        {/* 5. CORE ROUTER STAGE */}
        <main className={`flex-1 w-full py-12 relative transition-all duration-300 ${activeTab === "admin" ? "max-w-none w-full px-6 md:px-14 lg:px-24" : "max-w-7xl mx-auto px-4 md:px-8"}`}>
        
        <AnimatePresence mode="wait">
          
          {activeTab === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <LandingPage 
                onSelectDemo={() => setActiveTab("demo")}
                onSelectSupport={() => setActiveTab("support")}
                onSelectTrial={handleNavToTrialForm}
                trialFormRef={trialFormRef}
              />
            </motion.div>
          )}

          {activeTab === "demo" && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <InteractiveDashboardDemo onShowGreeting={() => setShowGreeting(true)} />
            </motion.div>
          )}

          {activeTab === "support" && (
            <motion.div
              key="support"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <SupportCenter />
            </motion.div>
          )}

          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <InfoPages initialSection={activeInfoSection} onSelectTrial={handleNavToTrialForm} />
            </motion.div>
          )}

          {activeTab === "admin" && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <ErrorBoundary FallbackComponent={AdminErrorFallback}>
                <AdminDashboard 
                  theme={theme}
                  setTheme={setTheme}
                  onLogout={() => {
                    setActiveTab("home");
                    window.history.pushState(null, "", "/");
                  }} 
                />
              </ErrorBoundary>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* 4. COMPREHENSIVE LANDING FOOTER */}
      {activeTab !== "admin" && (
        <footer className="bg-slate-950 border-t border-slate-900 py-12 px-6 md:px-8 text-right mt-12 text-slate-400 text-xs">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-white font-black text-sm">Algora Systems</span>
                <div className="w-6 h-6 bg-purple-600 rounded-lg flex items-center justify-center font-bold text-white text-[11px]">A</div>
              </div>
              <p className="leading-relaxed">
                الخيار الأول والحل البرمجي المتكامل الأكثر دقة وتوافقية لتسيير ومتابعة محلات الهواتف والصيانة في الجزائر.
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-extrabold text-slate-200">أقسام ومزايا النظام:</h5>
              <ul className="space-y-1 text-slate-500">
                <li>• كاشير سريع POS بالباركود</li>
                <li>• جرد السلع ومخزون الـ IMEI</li>
                <li>• تتبع وتسيير أجهزة الصيانة</li>
                <li>• كشف ديون الكريدي والولاء</li>
                <li>• تقارير المبيعات والأرباح</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h5 className="font-extrabold text-slate-200">الدعم وطرق الدفع بالجزائر:</h5>
              <ul className="space-y-1 text-slate-500">
                <li>• بريدي موب Baridimob (RIP)</li>
                <li>• الحساب البريدي الجاري CCP</li>
                <li>• بطاقات RedotPay الدولية</li>
                <li>• الدعم الفني الهاتفي 24/7</li>
                <li>• تدريب المسيرين والعمال عن بعد</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h5 className="font-extrabold text-slate-200">تواصل معنا مباشرة:</h5>
              <p className="text-slate-500 leading-relaxed">فريق الدعم والمهندسين متواجد بالجزائر لخدمتك.</p>
              <div className="flex flex-col gap-2">
                <p className="font-mono text-slate-300 font-bold text-[13px] inline-block text-right" dir="ltr">هاتف: <a href="https://wa.me/213553361047?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D9%86%D8%B8%D8%A7%D9%85%20Algora%20%D9%88%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B5%D9%88%D9%84%20%D8%B9%D9%84%D9%89%20%D9%86%D8%B3%D8%AE%D8%AA%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-purple-400 transition-colors cursor-pointer">+213 553 36 10 47</a></p>
                <div>
                  <a
                    href="https://wa.me/213553361047?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D9%86%D8%B8%D8%A7%D9%85%20Algora%20%D9%88%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B5%D9%88%D9%84%20%D8%B9%D9%84%D9%89%20%D9%86%D8%B3%D8%AE%D8%AA%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black shadow transition-all cursor-pointer"
                  >
                    <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.885-6.948C16.59 2.016 14.11 1.008 11.99 1.008 6.556 1.008 2.13 5.379 2.127 10.81c-.001 1.76.46 3.473 1.336 4.985l-.997 3.638 3.75-.98c1.478.808 2.985 1.2 4.541 1.201h.003zm11.236-7.394c-.29-.144-1.711-.844-1.977-.94-.266-.097-.46-.144-.654.144-.194.288-.75.94-.919 1.13-.17.19-.338.213-.628.069-.29-.144-1.226-.452-2.336-1.443-.864-.77-1.447-1.722-1.617-2.011-.17-.29-.018-.447.127-.59.13-.13.29-.338.435-.506.145-.17.194-.288.29-.48.097-.193.048-.36-.024-.505-.072-.144-.654-1.577-.895-2.155-.236-.577-.496-.499-.679-.508-.176-.008-.377-.01-.58-.01-.202 0-.53.076-.807.38-.277.303-1.057 1.034-1.057 2.52 0 1.487 1.082 2.923 1.231 3.125.15.202 2.13 3.251 5.16 4.56.72.311 1.282.497 1.72.637.724.23 1.383.197 1.903.12.58-.087 1.712-.699 1.952-1.376.24-.678.24-1.258.17-1.376-.073-.118-.266-.192-.556-.338z"/>
                    </svg>
                    <span>اتصل بنا واتساب</span>
                  </a>
                </div>
              </div>
              <p className="font-mono text-slate-400">إيميل: contact@algora.dz</p>
            </div>

          </div>

          <div className="max-w-7xl mx-auto h-px bg-slate-900 my-8" />

          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-[10px]">
            <p>© {new Date().getFullYear()} Algora Systems. جميع الحقوق محفوظة لشركتنا بالجزائر.</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
              <button onClick={() => handleNavToInfo("about")} className="hover:text-slate-300 transition-colors cursor-pointer">من نحن</button>
              <span>•</span>
              <button onClick={() => handleNavToInfo("terms")} className="hover:text-slate-300 transition-colors cursor-pointer">شروط الاستخدام</button>
              <span>•</span>
              <button onClick={() => handleNavToInfo("privacy")} className="hover:text-slate-300 transition-colors cursor-pointer">سياسة الخصوصية</button>
              <span>•</span>
              <button onClick={() => handleNavToInfo("refund")} className="hover:text-slate-300 transition-colors cursor-pointer">سياسة الاستبدال والاسترجاع</button>
              <span>•</span>
              <a href="#trial" onClick={handleNavToTrialForm} className="hover:text-slate-300 transition-colors">طلب نسخة تجريبية مجانية</a>
              <span>•</span>
              <a href="#demo" onClick={() => setActiveTab("demo")} className="hover:text-slate-300 transition-colors">العرض التجريبي</a>
            </div>
          </div>
        </footer>
      )}

      </div>

      {/* 5. INTERACTIVE ONBOARDING GREETING WIZARD OVERLAY */}
      <AnimatePresence>
        {showGreeting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <GreetingWizard 
              onClose={() => setShowGreeting(false)} 
              onSelectTrial={handleNavToTrialForm}
            />
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING WHATSAPP BUTTON */}
      {activeTab !== "admin" && (
        <a
          href="https://wa.me/213553361047?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D9%86%D8%B8%D8%A7%D9%85%20Algora%20%D9%88%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B5%D9%88%D9%84%20%D8%B9%D9%84%D9%89%20%D9%86%D8%B3%D8%AE%D8%AA%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300"
          aria-label="تواصل معنا عبر واتساب"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
          </svg>
        </a>
      )}

    </div>
  );
}
