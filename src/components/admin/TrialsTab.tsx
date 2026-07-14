import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Smartphone, MessageSquareCode, Trash2, Edit, Search, 
  RefreshCw, Download, Printer, Bell, ArrowRight, CheckCircle2, 
  Clock, AlertCircle, Plus, Copy, Check, X, Laptop, MapPin, 
  CreditCard, Sparkles, User, Calendar, Activity, ChevronRight, 
  ChevronLeft, MoreVertical, Phone, Mail, FileUp, Info, HelpCircle,
  TrendingUp, ArrowLeft, Send, CheckSquare, Layers, MessageSquare, ShieldAlert,
  Sliders
} from "lucide-react";

interface TrialRequest {
  id: string;
  storeName: string;
  ownerName: string;
  phone: string;
  phone2?: string;
  hasWhatsapp?: "yes" | "no";
  paymentMethod?: string;
  programType?: string;
  city: string;
  timestamp: string;
  status: "pending" | "contacted" | "demo_sent" | "approved" | "completed" | "canceled";
}

interface StatusDropdownProps {
  currentStatus: "pending" | "contacted" | "demo_sent" | "approved" | "completed" | "canceled";
  onChange: (newStatus: "pending" | "contacted" | "demo_sent" | "approved" | "completed" | "canceled") => void;
  storeName?: string;
}

function StatusDropdown({ currentStatus, onChange, storeName }: StatusDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options = [
    {
      id: "pending" as const,
      label: "جديد",
      desc: "بانتظار أول متابعة.",
      icon: Clock,
      btnClass: "bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20 focus:ring-blue-500/30",
      activeTextClass: "text-blue-400",
      activeBgClass: "bg-blue-500/5 hover:bg-blue-500/10"
    },
    {
      id: "contacted" as const,
      label: "تم الاتصال",
      desc: "تم التواصل مع العميل.",
      icon: Phone,
      btnClass: "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20 focus:ring-amber-500/30",
      activeTextClass: "text-amber-400",
      activeBgClass: "bg-amber-500/5 hover:bg-amber-500/10"
    },
    {
      id: "demo_sent" as const,
      label: "تم ارسال النسخة التجريبية",
      desc: "تم إرسال النسخة التجريبية للعميل للتجربة.",
      icon: Smartphone,
      btnClass: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 focus:ring-cyan-500/30",
      activeTextClass: "text-cyan-400",
      activeBgClass: "bg-cyan-500/5 hover:bg-cyan-500/10"
    },
    {
      id: "completed" as const,
      label: "تم الدفع",
      desc: "تم استلام قيمة الاشتراك.",
      icon: CreditCard,
      btnClass: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 focus:ring-emerald-500/30",
      activeTextClass: "text-emerald-400",
      activeBgClass: "bg-emerald-500/5 hover:bg-emerald-500/10"
    },
    {
      id: "approved" as const,
      label: "مفعل",
      desc: "تم إرسال الترخيص وتفعيل النظام.",
      icon: CheckCircle2,
      btnClass: "bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20 focus:ring-purple-500/30",
      activeTextClass: "text-purple-400",
      activeBgClass: "bg-purple-500/5 hover:bg-purple-500/10"
    },
    {
      id: "canceled" as const,
      label: "ملغي",
      desc: "تم إلغاء الطلب.",
      icon: X,
      btnClass: "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20 focus:ring-rose-500/30",
      activeTextClass: "text-rose-400",
      activeBgClass: "bg-rose-500/5 hover:bg-rose-500/10"
    }
  ];

  const currentOption = options.find(o => o.id === currentStatus) || options[0];
  const IconComponent = currentOption.icon;

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opt.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative inline-block text-right" ref={containerRef} onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center justify-center gap-1.5 px-2.5 py-1 text-[11px] font-black rounded-full border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 select-none cursor-pointer ${currentOption.btnClass}`}
      >
        <IconComponent className="w-3 h-3 shrink-0" />
        <span>{currentOption.label}</span>
        <svg 
          className={`w-3 h-3 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth="3"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", duration: 0.3 }}
            style={{ borderRadius: "16px", backgroundColor: "var(--dropdown-bg, #16161F)", borderColor: "var(--dropdown-border, rgba(255,255,255,.08))", boxShadow: "0 20px 40px rgba(0,0,0,.45)" }}
            className="absolute left-0 mt-2.5 w-72 border backdrop-blur-xl z-50 overflow-hidden py-2"
          >
            {/* Conditional Search Box if options count > 8 */}
            {options.length > 8 && (
              <div className="px-3 pb-2 pt-1 border-b border-white/5">
                <div className="relative flex items-center">
                  <Search className="absolute right-3 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث عن حالة..."
                    className="w-full bg-[#0B0B12] border border-white/5 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-right"
                  />
                </div>
              </div>
            )}

            {/* List of elements */}
            <div className="max-h-[300px] overflow-y-auto px-1.5 space-y-0.5">
              {filteredOptions.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500">لا توجد نتائج</div>
              ) : (
                filteredOptions.map((opt) => {
                  const OptIcon = opt.icon;
                  const isSelected = opt.id === currentStatus;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onChange(opt.id);
                        setIsOpen(false);
                      }}
                      className={`w-full h-[46px] rounded-xl flex items-center justify-between px-3 text-right transition-all duration-200 group cursor-pointer ${
                        isSelected 
                          ? "bg-purple-500/10 text-purple-300" 
                          : "text-slate-300 hover:bg-[#8B5CF6]/10 hover:text-white"
                      }`}
                    >
                      {/* Left: Checkmark */}
                      <div className="flex items-center shrink-0 w-5">
                        {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                      </div>

                      {/* Right: Icon + Text */}
                      <div className="flex items-center gap-3 flex-row-reverse text-right flex-1 min-w-0 pr-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                          isSelected ? "bg-purple-500/20 text-purple-300" : "bg-white/5 text-slate-400 group-hover:bg-[#8B5CF6]/20 group-hover:text-[#A855F7]"
                        }`}>
                          <OptIcon className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5 text-right flex-1 min-w-0">
                          <div className={`text-xs font-black truncate ${isSelected ? "text-purple-300" : "text-slate-200 group-hover:text-purple-300"}`}>
                            {opt.label}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium truncate group-hover:text-slate-400 transition-colors">
                            {opt.desc}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TrialsTabProps {
  sortedTrials: TrialRequest[];
  updateTrialStatus: (id: string, newStatus: "pending" | "contacted" | "demo_sent" | "approved" | "completed" | "canceled") => void;
  openEditModal: (req: TrialRequest) => void;
  deleteTrialRequest: (id: string) => void;
  createMockRequest: () => void;
  refreshData?: () => void;
}

export default function TrialsTab({
  sortedTrials: parentSortedTrials,
  updateTrialStatus,
  openEditModal,
  deleteTrialRequest,
  createMockRequest,
  refreshData
}: TrialsTabProps) {

  // --- STATE MANAGEMENT ---
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  
  // Add Request Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStoreName, setAddStoreName] = useState("");
  const [addOwnerName, setAddOwnerName] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [addPhone2, setAddPhone2] = useState("");
  const [addCity, setAddCity] = useState("الجزائر العاصمة (Alger)");
  const [addProgramType, setAddProgramType] = useState("both");
  const [addPaymentMethod, setAddPaymentMethod] = useState("baridimob");
  const [addHasWhatsapp, setAddHasWhatsapp] = useState<"yes" | "no">("yes");
  const [addStatus, setAddStatus] = useState<"pending" | "contacted" | "demo_sent" | "approved" | "completed" | "canceled">("pending");
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  
  // Checkbox Quick Filters
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [showOnlyToday, setShowOnlyToday] = useState(false);
  const [showOnlyDelayed, setShowOnlyDelayed] = useState(false);
  const [showOnlyNeedsContact, setShowOnlyNeedsContact] = useState(false);

  // Pagination & Sorting States
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name_asc" | "name_desc" | "amount_desc">("newest");

  // Selection & Drawer States
  const [selectedRequest, setSelectedRequest] = useState<TrialRequest | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"details" | "licenses" | "whatsapp" | "notes">("details");
  const [drawerNotes, setDrawerNotes] = useState<{ [key: string]: string }>({});
  const [tempNoteText, setTempNoteText] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [systemLogs, setSystemLogs] = useState<string[]>([
    `[نظام] تم تمكين لوحة الإدارة الذكية الفاخرة بنجاح.`,
    `[نظام] جاري متابعة الطلبات المتأخرة والمدفوعات آلياً.`
  ]);

  const [selectedTemplateId, setSelectedTemplateId] = useState("new_order");
  const [whatsappLogs, setWhatsappLogs] = useState<any[]>([]);
  const [sendingManualMsg, setSendingManualMsg] = useState(false);

  const fetchWhatsappLogs = async (orderId: string) => {
    try {
      const res = await fetch("/api/admin/whatsapp/logs");
      if (res.ok) {
        const data = await res.json();
        setWhatsappLogs(data.filter((l: any) => l.orderId === orderId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResendLog = async (logId: string) => {
    try {
      const res = await fetch(`/api/admin/whatsapp/resend/${logId}`, {
        method: "POST"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast("تمت إعادة جدولة الإرسال بنجاح 🚀");
        if (selectedRequest) {
          fetchWhatsappLogs(selectedRequest.id);
        }
      } else {
        triggerToast(data.error || "فشل إعادة الإرسال.");
      }
    } catch (err) {
      triggerToast("خطأ بالشبكة أثناء إعادة الإرسال.");
    }
  };

  useEffect(() => {
    if (selectedRequest && activeDrawerTab === "whatsapp") {
      fetchWhatsappLogs(selectedRequest.id);
    }
  }, [selectedRequest, activeDrawerTab]);

  // Input ref for focusing search
  const searchInputRef = useRef<HTMLInputElement>(null);

  // --- REFRESH / TOAST HELPER ---
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString("ar-DZ");
    setSystemLogs(prev => [`[${timestamp}] ${msg}`, ...prev.slice(0, 19)]);
  };

  const handleRefresh = () => {
    addLog("تم إعادة مزامنة وتحديث حالة الطلبات والترتيب.");
    triggerToast("تم تحديث وجلب البيانات الحية فوراً!");
  };

  const handleAddNewRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addStoreName.trim() || !addOwnerName.trim() || !addPhone.trim()) {
      alert("يرجى ملء كافة الحقول الأساسية المطلوبة.");
      return;
    }

    setIsSubmittingAdd(true);
    try {
      const response = await fetch("/api/register-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: addStoreName.trim(),
          ownerName: addOwnerName.trim(),
          phone: addPhone.trim(),
          phone2: addPhone2.trim(),
          city: addCity,
          hasWhatsapp: addHasWhatsapp,
          paymentMethod: addPaymentMethod,
          programType: addProgramType,
          status: addStatus
        })
      });

      if (response.ok) {
        addLog(`تم إضافة طلب ترخيص جديد يدوياً لصالح متجر: "${addStoreName.trim()}"`);
        triggerToast("تم إضافة وتفعيل طلب الترخيص بنجاح!");
        
        // Reset state
        setAddStoreName("");
        setAddOwnerName("");
        setAddPhone("");
        setAddPhone2("");
        setAddCity("الجزائر العاصمة (Alger)");
        setAddProgramType("annual");
        setAddPaymentMethod("baridimob");
        setAddHasWhatsapp("yes");
        setAddStatus("pending");
        setIsAddModalOpen(false);

        // Refresh parent
        if (refreshData) {
          refreshData();
        }
      } else {
        alert("فشل إضافة طلب الترخيص، يرجى المحاولة لاحقاً.");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ في الاتصال بالشبكة.");
    } finally {
      setIsSubmittingAdd(false);
    }
  };

  // --- KEYBOARD SHORTCUTS ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+F -> Focus Search
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInputRef.current?.focus();
        triggerToast("تم تفعيل مربع البحث الذكي 🔍");
      }
      // Ctrl+N -> New Mock Request
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        createMockRequest();
        addLog("تم توليد طلب افتراضي جديد عبر الاختصار Ctrl+N");
        triggerToast("تم توليد طلب افتراضي جديد بنجاح!");
      }
      // Ctrl+P -> Print
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        window.print();
        addLog("تم تشغيل نافذة الطباعة عبر الاختصار Ctrl+P");
      }
      // Ctrl+R -> Refresh/Reset
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
        e.preventDefault();
        setSearchQuery("");
        setCityFilter("all");
        setProgramFilter("all");
        setStatusFilter("all");
        setDateFilter("all");
        setPaymentFilter("all");
        setShowOnlyNew(false);
        setShowOnlyToday(false);
        setShowOnlyDelayed(false);
        setShowOnlyNeedsContact(false);
        setCurrentPage(1);
        handleRefresh();
      }
      // Delete key -> Delete selected request
      if (e.key === "Delete" && selectedRequest) {
        e.preventDefault();
        if (confirm(`هل أنت متأكد من حذف طلب "${selectedRequest.storeName}" بالكامل؟`)) {
          deleteTrialRequest(selectedRequest.id);
          addLog(`تم حذف طلب "${selectedRequest.storeName}" عبر زر الحذف.`);
          setSelectedRequest(null);
          triggerToast("تم حذف الطلب بنجاح.");
        }
      }
      // Enter key -> Open first request if drawer closed
      if (e.key === "Enter" && !selectedRequest && filteredAndSortedTrials.length > 0) {
        // Only if not in input fields to avoid conflicts
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "SELECT") {
          e.preventDefault();
          setSelectedRequest(filteredAndSortedTrials[0]);
          triggerToast(`تم فتح تفاصيل طلب: ${filteredAndSortedTrials[0].storeName}`);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRequest, parentSortedTrials]);

  // --- PROGRAM HELPERS ---
  const translateProg = (val?: string) => {
    if (val === "pc" || val === "computer" || val === "p_pc_only") return "باقة لوجيسيال حاسوب فقط";
    if (val === "mobile" || val === "phone" || val === "p_mobile_only") return "باقة تطبيق هاتف فقط";
    if (val === "both" || val === "combo" || val === "p_both") return "باقة تطبيق هاتف مع حاسوب معاً ✨";
    if (val === "monthly") return "الباقة الشهرية (2,500 دج)";
    if (val === "annual") return "الباقة السنوية (20,000 دج) ✨";
    if (val === "enterprise") return "باقة الموزعين (35,000 دج)";
    return "فترة تجريبية أساسية";
  };

  const getPrice = (val?: string) => {
    if (val === "pc" || val === "computer" || val === "p_pc_only") return 12000;
    if (val === "mobile" || val === "phone" || val === "p_mobile_only") return 12000;
    if (val === "both" || val === "combo" || val === "p_both") return 22000;
    if (val === "monthly") return 2500;
    if (val === "annual") return 20000;
    if (val === "enterprise") return 35000;
    return 0;
  };

  const getCityName = (fullCity: string) => {
    return fullCity.split(" ")[0] || fullCity;
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("ar-DZ", { style: "currency", currency: "DZD", maximumFractionDigits: 0 })
      .format(val)
      .replace("د.ج.‏", "دج");
  };

  // --- FILTER & SORT LOGIC (Memoized for high performance) ---
  const filteredAndSortedTrials = useMemo(() => {
    let result = [...parentSortedTrials];

    // Search Query (Multi-field)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.id.toLowerCase().includes(q) ||
        t.storeName.toLowerCase().includes(q) ||
        t.ownerName.toLowerCase().includes(q) ||
        t.phone.includes(q) ||
        t.city.toLowerCase().includes(q) ||
        (t.programType && t.programType.toLowerCase().includes(q))
      );
    }

    // City Filter
    if (cityFilter !== "all") {
      result = result.filter(t => t.city.includes(cityFilter));
    }

    // Program Filter
    if (programFilter !== "all") {
      result = result.filter(t => t.programType === programFilter);
    }

    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter(t => t.status === statusFilter);
    }

    // Payment Filter
    if (paymentFilter !== "all") {
      result = result.filter(t => t.paymentMethod === paymentFilter);
    }

    // Date Filter
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter(t => {
        const itemDate = new Date(t.timestamp);
        const diffHours = (now.getTime() - itemDate.getTime()) / (3600000);
        if (dateFilter === "today") return diffHours <= 24;
        if (dateFilter === "week") return diffHours <= 24 * 7;
        if (dateFilter === "month") return diffHours <= 24 * 30;
        return true;
      });
    }

    // --- CHECKBOX QUICK FILTERS ---
    if (showOnlyNew) {
      result = result.filter(t => t.status === "pending");
    }

    if (showOnlyToday) {
      const todayStr = new Date().toDateString();
      result = result.filter(t => new Date(t.timestamp).toDateString() === todayStr);
    }

    if (showOnlyDelayed) {
      // Delayed > 24 hours without approval/completion/canceled
      const now = new Date();
      result = result.filter(t => {
        const itemDate = new Date(t.timestamp);
        const diffHours = (now.getTime() - itemDate.getTime()) / (3600000);
        return diffHours > 24 && (t.status === "pending" || t.status === "contacted");
      });
    }

    if (showOnlyNeedsContact) {
      result = result.filter(t => t.status === "pending" || t.status === "contacted");
    }

    // --- SORTING ---
    result.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      if (sortBy === "name_asc") {
        return a.storeName.localeCompare(b.storeName, "ar");
      }
      if (sortBy === "name_desc") {
        return b.storeName.localeCompare(a.storeName, "ar");
      }
      if (sortBy === "amount_desc") {
        return getPrice(b.programType) - getPrice(a.programType);
      }
      // default: newest
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    return result;
  }, [parentSortedTrials, searchQuery, cityFilter, programFilter, statusFilter, dateFilter, paymentFilter, showOnlyNew, showOnlyToday, showOnlyDelayed, showOnlyNeedsContact, sortBy]);

  // --- STATS COMPUTING (6 Big Cards) ---
  const stats = useMemo(() => {
    const now = new Date();
    
    // Total
    const total = parentSortedTrials.length;
    const totalToday = parentSortedTrials.filter(t => {
      const d = new Date(t.timestamp);
      return (now.getTime() - d.getTime()) / 3600000 <= 24;
    }).length;

    // New (Pending)
    const newCount = parentSortedTrials.filter(t => t.status === "pending").length;
    const newToday = parentSortedTrials.filter(t => t.status === "pending" && (now.getTime() - new Date(t.timestamp).getTime()) / 3600000 <= 24).length;

    // In Review / Contacted
    const reviewCount = parentSortedTrials.filter(t => t.status === "contacted").length;
    const reviewToday = parentSortedTrials.filter(t => t.status === "contacted" && (now.getTime() - new Date(t.timestamp).getTime()) / 3600000 <= 24).length;

    // Awaiting Contact (Pending or delayed ones that need immediate action)
    const needsContactCount = parentSortedTrials.filter(t => t.status === "pending" || t.status === "contacted").length;
    const needsContactToday = parentSortedTrials.filter(t => {
      const d = new Date(t.timestamp);
      const isPending = t.status === "pending";
      const isToday = (now.getTime() - d.getTime()) / 3600000 <= 24;
      return isPending && isToday;
    }).length;

    // Activated (Approved or Completed)
    const activatedCount = parentSortedTrials.filter(t => t.status === "approved" || t.status === "completed").length;
    const activatedToday = parentSortedTrials.filter(t => {
      const isAct = t.status === "approved" || t.status === "completed";
      const isToday = (now.getTime() - new Date(t.timestamp).getTime()) / 3600000 <= 24;
      return isAct && isToday;
    }).length;

    // Revenue
    const revenue = parentSortedTrials.reduce((sum, current) => {
      if (current.status === "approved" || current.status === "completed") {
        return sum + getPrice(current.programType);
      }
      return sum;
    }, 0);
    
    const revenueToday = parentSortedTrials.reduce((sum, current) => {
      const isToday = (now.getTime() - new Date(current.timestamp).getTime()) / 3600000 <= 24;
      const isActive = current.status === "approved" || current.status === "completed";
      if (isActive && isToday) {
        return sum + getPrice(current.programType);
      }
      return sum;
    }, 0);

    return {
      total, totalToday,
      newCount, newToday,
      reviewCount, reviewToday,
      needsContactCount, needsContactToday,
      activatedCount, activatedToday,
      revenue, revenueToday
    };
  }, [parentSortedTrials]);

  // --- PAGINATION LOGIC ---
  const paginatedTrials = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedTrials.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedTrials, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTrials.length / itemsPerPage) || 1;

  useEffect(() => {
    // Reset to page 1 on filter changes
    setCurrentPage(1);
  }, [searchQuery, cityFilter, programFilter, statusFilter, dateFilter, paymentFilter, showOnlyNew, showOnlyToday, showOnlyDelayed, showOnlyNeedsContact]);

  // --- UNIQUE CITIES FOR SELECTOR ---
  const uniqueCities = useMemo(() => {
    const cities = parentSortedTrials.map(t => getCityName(t.city));
    return Array.from(new Set(cities)).filter(Boolean);
  }, [parentSortedTrials]);

  // --- GENERATE WHATSAPP DIRECT URL ---
  const generateWhatsAppLink = (phone: string, ownerName: string, storeName: string, programType?: string) => {
    let cleanPhone = phone.replace(/[\s\-\+]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '213' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('213')) {
      cleanPhone = '213' + cleanPhone;
    }
    
    const chosenPlan = translateProg(programType);
    const textMessage = `مرحباً أستاذ ${ownerName}، معكم الدعم الفني لبرنامج الكاشير والبيع Algora POS.\n\nلقد استلمنا طلبكم لتجربة البرنامج لصالح متجركم المميز: *${storeName}*.\n\nلقد قمنا بتجهيز الحساب وفترة التفعيل لـ: *${chosenPlan}*.\n\nهل أنتم متاحون الآن لنقوم بمساعدتكم في عملية التثبيت السريع وبدء العمل؟ 😊`;
    
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textMessage)}`;
  };

  // --- COPY TO CLIPBOARD HELPER ---
  const copyText = (text: string, id: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addLog(`تم نسخ ${label}: ${text}`);
    triggerToast(`تم نسخ ${label} إلى الحافظة!`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // --- INTELLIGENCE CHECKS ---
  const isDelayed = (timestamp: string, status: string) => {
    const diffHours = (new Date().getTime() - new Date(timestamp).getTime()) / 3600000;
    return diffHours > 24 && (status === "pending" || status === "contacted");
  };

  const getRowHighlightClass = (req: TrialRequest) => {
    if (isDelayed(req.timestamp, req.status)) {
      return "border-r-4 border-r-rose-500 bg-rose-500/5 hover:bg-rose-500/10";
    }
    if (req.status === "completed" || req.status === "approved") {
      return "border-r-4 border-r-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10";
    }
    return "hover:bg-[#1C1C26]/50 border-r-4 border-r-transparent";
  };

  // --- DRAWERS NOTE SAVE ---
  const handleSaveDrawerNote = (id: string) => {
    if (!tempNoteText.trim()) return;
    setDrawerNotes(prev => ({
      ...prev,
      [id]: tempNoteText
    }));
    addLog(`تم تحديث الملاحظات لطلب متجر: ${selectedRequest?.storeName}`);
    triggerToast("تم حفظ ملاحظات العميل بنجاح!");
  };

  useEffect(() => {
    if (selectedRequest) {
      setTempNoteText(drawerNotes[selectedRequest.id] || "");
    }
  }, [selectedRequest]);

  // --- EXPORT TO CSV LOCAL IMPLEMENTATION ---
  const exportToCSV = () => {
    let headers = "ID,اسم المحل,المالك,رقم الهاتف,المدينة/الولاية,الباقة,طريقة الدفع,الحالة,التاريخ\n";
    let rows = filteredAndSortedTrials.map(r => {
      return `"${r.id}","${r.storeName}","${r.ownerName}","${r.phone}","${r.city}","${r.programType || "trial"}","${r.paymentMethod || "cash"}","${r.status}","${r.timestamp}"`;
    }).join("\n");
    
    const blob = new Blob(["\uFEFF" + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `AlgoraPOS_Filter_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog("تم تصدير ملف الإكسل (CSV) المفلتر بنجاح.");
    triggerToast("تم تصدير ملف إكسل بنجاح!");
  };

  // --- RENDER STATUS BADGE UTILITY ---
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-blue-500/10 border border-blue-500/30 text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
            <span>جديد</span>
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>تم الاتصال</span>
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>تم الدفع</span>
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-purple-500/10 border border-purple-500/30 text-purple-400">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span>
            <span>مفعل</span>
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-500/10 border border-rose-500/30 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            <span>ملغي</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-500/10 border border-slate-500/30 text-slate-400">
            <span>{status}</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B12] text-right font-sans relative overflow-x-hidden flex flex-col p-4 md:p-6 space-y-6" id="trials-pro-dashboard">
      
      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] bg-[#14141D] border border-emerald-500/30 shadow-[0_0_15px_rgba(34,197,94,0.15)] text-emerald-400 px-6 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-black"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================================================================= */}
      {/* 1. TOP BAR */}
      {/* ================================================================= */}
      <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#14141D] border border-[rgba(255,255,255,0.06)] p-4 rounded-[18px] shadow-sm">
        
        {/* Search Bar Block */}
        <div className="flex-1 relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="البحث الذكي بالاسم، الهاتف، المحل، الولاية، الباقة، أو رقم الطلب (Ctrl+F)..."
            className="w-full bg-[#0B0B12] border border-[rgba(255,255,255,0.06)] rounded-xl pr-12 pl-4 py-3 text-xs md:text-sm text-slate-100 placeholder:text-slate-500 text-right focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/50 transition-all font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")} 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Global Quick Action Icons */}
        <div className="flex items-center gap-2 justify-end self-end lg:self-auto">
          {/* Refresh Action */}
          <button
            onClick={handleRefresh}
            className="p-3 bg-[#0B0B12] hover:bg-[#1C1C26] border border-[rgba(255,255,255,0.06)] rounded-xl text-slate-300 hover:text-[#8B5CF6] transition-all cursor-pointer"
            title="تحديث البيانات الفوري (Ctrl+R)"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {/* Export CSV */}
          <button
            onClick={exportToCSV}
            className="px-4 py-2.5 bg-[#0B0B12] hover:bg-[#1C1C26] border border-[rgba(255,255,255,0.06)] rounded-xl text-xs font-black text-slate-300 hover:text-emerald-400 flex items-center gap-2 transition-all cursor-pointer"
            title="تصدير لملف إكسل متوافق"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">تصدير إكسل</span>
          </button>

          {/* Print */}
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-[#0B0B12] hover:bg-[#1C1C26] border border-[rgba(255,255,255,0.06)] rounded-xl text-xs font-black text-slate-300 hover:text-[#A855F7] flex items-center gap-2 transition-all cursor-pointer"
            title="طباعة التراخيص والطلبات (Ctrl+P)"
          >
            <Printer className="w-4 h-4 text-[#A855F7]" />
            <span className="hidden sm:inline">طباعة الجدول</span>
          </button>

          {/* Notification Indicator */}
          <div className="relative">
            <button
              onClick={() => {
                triggerToast("لا توجد إشعارات جديدة غير مقروءة.");
                addLog("تم مراجعة مركز الإشعارات الفورية.");
              }}
              className="p-3 bg-[#0B0B12] hover:bg-[#1C1C26] border border-[rgba(255,255,255,0.06)] rounded-xl text-slate-300 hover:text-[#F59E0B] transition-all cursor-pointer"
            >
              <Bell className="w-4 h-4 text-[#F59E0B]" />
              <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 left-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. STATISTICS SECTION (6 Big Cards) */}
      {/* ================================================================= */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Card 1: Total */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-[#14141D] border border-[rgba(255,255,255,0.06)] p-4 rounded-[18px] relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400">إجمالي الطلبات</span>
            <div className="p-1.5 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-black text-white">{stats.total}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+{stats.totalToday} اليوم</span>
            </div>
          </div>
          <div className="w-full bg-slate-800/50 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#8B5CF6] h-full" style={{ width: "85%" }}></div>
          </div>
        </motion.div>

        {/* Card 2: New */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-[#14141D] border border-[rgba(255,255,255,0.06)] p-4 rounded-[18px] relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400">طلبات جديدة</span>
            <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-black text-white">{stats.newCount}</div>
            <div className="text-[10px] text-blue-400 flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
              <span>نشط حالياً</span>
            </div>
          </div>
          <div className="w-full bg-slate-800/50 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-500 h-full" style={{ width: `${(stats.newCount / (stats.total || 1)) * 100}%` }}></div>
          </div>
        </motion.div>

        {/* Card 3: In Review */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-[#14141D] border border-[rgba(255,255,255,0.06)] p-4 rounded-[18px] relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400">قيد المراجعة</span>
            <div className="p-1.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-black text-white">{stats.reviewCount}</div>
            <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5">
              <span>قيد التواصل</span>
            </div>
          </div>
          <div className="w-full bg-slate-800/50 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full" style={{ width: `${(stats.reviewCount / (stats.total || 1)) * 100}%` }}></div>
          </div>
        </motion.div>

        {/* Card 4: Awaiting Contact */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-[#14141D] border border-[rgba(255,255,255,0.06)] p-4 rounded-[18px] relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400">بانتظار الاتصال</span>
            <div className="p-1.5 bg-[#F59E0B]/10 text-[#F59E0B] rounded-lg">
              <Phone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-black text-white">{stats.needsContactCount}</div>
            <div className="text-[10px] text-rose-400 flex items-center gap-1 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>تحتاج رعاية فورية</span>
            </div>
          </div>
          <div className="w-full bg-slate-800/50 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#F59E0B] h-full" style={{ width: "45%" }}></div>
          </div>
        </motion.div>

        {/* Card 5: Activated */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-[#14141D] border border-[rgba(255,255,255,0.06)] p-4 rounded-[18px] relative overflow-hidden flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400">مفعلة ونشطة</span>
            <div className="p-1.5 bg-[#22C55E]/10 text-[#22C55E] rounded-lg">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl md:text-2xl font-black text-white">{stats.activatedCount}</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <span>مضمونة وآمنة</span>
            </div>
          </div>
          <div className="w-full bg-slate-800/50 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#22C55E] h-full" style={{ width: `${(stats.activatedCount / (stats.total || 1)) * 100}%` }}></div>
          </div>
        </motion.div>

        {/* Card 6: Revenue */}
        <motion.div 
          whileHover={{ y: -4 }}
          className="bg-[#14141D] border border-[rgba(255,255,255,0.06)] p-4 rounded-[18px] relative overflow-hidden flex flex-col justify-between col-span-2 md:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400">إجمالي الإيرادات</span>
            <div className="p-1.5 bg-[#A855F7]/10 text-[#A855F7] rounded-lg">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-lg md:text-xl font-black text-emerald-400 font-mono">{formatCurrency(stats.revenue)}</div>
            <div className="text-[10px] text-emerald-300 flex items-center gap-1 mt-0.5">
              <span>+{formatCurrency(stats.revenueToday)} اليوم</span>
            </div>
          </div>
          <div className="w-full bg-slate-800/50 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-400 h-full" style={{ width: "92%" }}></div>
          </div>
        </motion.div>

      </div>

      {/* ================================================================= */}
      {/* 3. ACTION TOOLBAR */}
      {/* ================================================================= */}
      <div className="bg-[#14141D] border border-[rgba(255,255,255,0.06)] p-5 rounded-[18px] space-y-4 shadow-sm">
        
        <div className="flex items-center gap-2 border-b border-white/5 pb-2">
          <Sliders className="w-4 h-4 text-[#8B5CF6]" />
          <h3 className="text-xs font-black text-white">شريط أدوات الفلترة والتحكم بالطلبات</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* City Filter */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400">تصفية بالولاية:</label>
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full bg-[#0B0B12] border border-[rgba(255,255,255,0.06)] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] cursor-pointer"
            >
              <option value="all">📍 جميع الولايات ({uniqueCities.length})</option>
              {uniqueCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Package Filter */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400">تصفية بالباقة:</label>
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="w-full bg-[#0B0B12] border border-[rgba(255,255,255,0.06)] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] cursor-pointer"
            >
              <option value="all">📦 جميع الباقات</option>
              <option value="trial">فترة تجريبية أساسية ⏳</option>
              <option value="pc">باقة لوجيسيال حاسوب فقط (12K) 💻</option>
              <option value="mobile">باقة تطبيق هاتف فقط (12K) 📱</option>
              <option value="both">باقة تطبيق هاتف مع حاسوب معاً (22K) ✨</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400">تصفية بالحالة:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#0B0B12] border border-[rgba(255,255,255,0.06)] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] cursor-pointer"
            >
              <option value="all">🔔 جميع الحالات</option>
              <option value="pending">⏳ جديد / قيد الانتظار</option>
              <option value="contacted">📞 تم التواصل مع العميل</option>
              <option value="completed">✅ تم الدفع والموافقة</option>
              <option value="approved">🟢 مفعّل ونشط</option>
              <option value="canceled">❌ ملغي</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400">تاريخ الطلبات:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full bg-[#0B0B12] border border-[rgba(255,255,255,0.06)] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] cursor-pointer"
            >
              <option value="all">📅 كل الفترات الزمنية</option>
              <option value="today">اليوم (آخر 24 ساعة)</option>
              <option value="week">آخر 7 أيام</option>
              <option value="month">آخر 30 يوم</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="space-y-1">
            <label className="block text-[10px] font-black text-slate-400">ترتيب العرض حسب:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-[#0B0B12] border border-[rgba(255,255,255,0.06)] rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] cursor-pointer"
            >
              <option value="newest">🕒 الأحدث تسجيلاً</option>
              <option value="oldest">🕒 الأقدم تسجيلاً</option>
              <option value="name_asc">🔤 اسم المحل (أ-ي)</option>
              <option value="name_desc">🔤 اسم المحل (ي-أ)</option>
              <option value="amount_desc">💰 قيمة الباقة (الأعلى فما دون)</option>
            </select>
          </div>

        </div>

        {/* Checkboxes Line + Add Action Button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2 border-t border-white/5">
          
          {/* Checkboxes Group */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            
            <label className="inline-flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={showOnlyNew}
                onChange={(e) => setShowOnlyNew(e.target.checked)}
                className="w-4 h-4 accent-[#8B5CF6] cursor-pointer rounded bg-[#0B0B12]"
              />
              <span className="text-xs font-bold">الطلبات الجديدة فقط</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={showOnlyToday}
                onChange={(e) => setShowOnlyToday(e.target.checked)}
                className="w-4 h-4 accent-[#8B5CF6] cursor-pointer rounded bg-[#0B0B12]"
              />
              <span className="text-xs font-bold">طلبات اليوم</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={showOnlyDelayed}
                onChange={(e) => setShowOnlyDelayed(e.target.checked)}
                className="w-4 h-4 accent-rose-500 cursor-pointer rounded bg-[#0B0B12]"
              />
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>المتأخرة (&gt; 24 ساعة)</span>
              </span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
              <input
                type="checkbox"
                checked={showOnlyNeedsContact}
                onChange={(e) => setShowOnlyNeedsContact(e.target.checked)}
                className="w-4 h-4 accent-[#F59E0B] cursor-pointer rounded bg-[#0B0B12]"
              />
              <span className="text-xs font-bold text-amber-400">تحتاج اتصال فوري</span>
            </label>

          </div>

          {/* Leftside Control Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            
            {/* Import simulation */}
            <button
              onClick={() => {
                const el = document.getElementById('trials-bulk-import-input');
                el?.click();
              }}
              className="px-3.5 py-2 bg-[#0B0B12] hover:bg-[#1C1C26] border border-[rgba(255,255,255,0.06)] rounded-xl text-xs font-bold text-slate-300 hover:text-blue-400 flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <FileUp className="w-4 h-4" />
              <span>استيراد طلبات</span>
            </button>
            <input 
              id="trials-bulk-import-input" 
              type="file" 
              accept=".csv,.json" 
              className="hidden" 
              onChange={() => {
                addLog("تم محاكاة استيراد طلبات خارجية من ملف محلي.");
                triggerToast("تم استيراد قائمة الطلبات الإضافية بنجاح!");
              }}
            />

            {/* Main Add Button (Manual form popup) */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#A855F7] hover:to-[#8B5CF6] text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة طلب ترخيص جديد</span>
            </button>

          </div>

        </div>

      </div>

      {/* ================================================================= */}
      {/* 4. MAIN LAYOUT WORKSPACE SPLIT (Table on Left, Sidebar on Right) */}
      {/* ================================================================= */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT: ORDERS TABLE (Full Width) */}
        <div className="xl:col-span-12 bg-[#14141D] border border-[rgba(255,255,255,0.06)] rounded-[18px] overflow-hidden flex flex-col shadow-sm">
          
          <div className="p-5 border-b border-white/5 flex items-center justify-between flex-row-reverse">
            <div className="text-[11px] font-black text-slate-400 flex items-center gap-1 font-mono">
              <span>عرض {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedTrials.length)}</span>
              <span>من أصل {filteredAndSortedTrials.length} طلبات مصنفة</span>
            </div>
            <h3 className="text-sm font-black text-white flex items-center gap-2 flex-row-reverse">
              <span>قائمة طلبات التراخيص والمتاجر الحالية</span>
              {filteredAndSortedTrials.length !== parentSortedTrials.length && (
                <span className="text-[10px] bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 px-2 py-0.5 rounded-full">مفلتر</span>
              )}
            </h3>
          </div>

          <div className="overflow-x-auto w-full pb-36">
            <table className="w-full text-right text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-[#0B0B12] border-b border-[rgba(255,255,255,0.06)] text-slate-400 text-[10px] uppercase font-black tracking-wider">
                  <th className="px-5 py-4 text-right">المحل والعميل</th>
                  <th className="px-5 py-4 text-right">الولاية والهاتف</th>
                  <th className="px-5 py-4 text-right">الباقة المختارة</th>
                  <th className="px-5 py-4 text-right">طريقة الدفع والمبلغ</th>
                  <th className="px-5 py-4 text-center">حالة الطلب</th>
                  <th className="px-5 py-4 text-right">آخر تحديث</th>
                  <th className="px-5 py-4 text-left">الإجراءات السريعة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                {paginatedTrials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center text-slate-500 font-bold text-xs space-y-2 border border-white/10">
                      <FileText className="w-10 h-10 mx-auto text-slate-700" />
                      <p>لا توجد طلبات تطابق معايير الفلترة المحددة حالياً.</p>
                      <button 
                        onClick={() => {
                          setSearchQuery("");
                          setCityFilter("all");
                          setProgramFilter("all");
                          setStatusFilter("all");
                        }} 
                        className="text-[#8B5CF6] hover:underline"
                      >
                        إعادة تعيين جميع الفلاتر
                      </button>
                    </td>
                  </tr>
                ) : (
                  paginatedTrials.map((req) => {
                    const isNew = req.status === "pending";
                    return (
                      <tr 
                        key={req.id} 
                        className={`transition-all duration-150 group cursor-pointer ${getRowHighlightClass(req)}`}
                        onClick={() => setSelectedRequest(req)}
                      >
                        {/* 1. Client & Store (Avatar) */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B5CF6]/20 to-[#A855F7]/20 border border-[rgba(255,255,255,0.06)] flex items-center justify-center shrink-0 relative">
                              <Laptop className="w-5 h-5 text-[#A855F7]" />
                              {isNew && (
                                <span className="absolute -top-1 -right-1 bg-blue-500 text-[8px] text-white font-black px-1.5 rounded-full uppercase tracking-widest scale-90 border border-slate-900 animate-pulse">
                                  NEW
                                </span>
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <div className="font-black text-white text-sm group-hover:text-[#A855F7] transition-colors flex items-center gap-1.5">
                                <span>{req.storeName}</span>
                              </div>
                              <div className="text-[10px] text-slate-400 font-medium">{req.ownerName}</div>
                            </div>
                          </div>
                        </td>

                        {/* 2. City & Phone */}
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-200 text-xs flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{req.city}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{req.phone}</div>
                        </td>

                        {/* 3. Package Selection */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-start flex-row-reverse">
                            <div className="space-y-1 text-right">
                              <span className="font-black text-slate-100 block text-xs">
                                {req.programType === "pc" || req.programType === "computer" || req.programType === "p_pc_only" ? (
                                  "باقة لوجيسيال حاسوب فقط"
                                ) : req.programType === "mobile" || req.programType === "phone" || req.programType === "p_mobile_only" ? (
                                  "باقة تطبيق هاتف فقط"
                                ) : req.programType === "both" || req.programType === "combo" || req.programType === "p_both" ? (
                                  "باقة تطبيق هاتف مع حاسوب"
                                ) : req.programType === "annual" ? (
                                  "الباقة السنوية"
                                ) : req.programType === "monthly" ? (
                                  "الباقة الشهرية"
                                ) : req.programType === "enterprise" ? (
                                  "باقة الموزعين الكبرى"
                                ) : (
                                  "فترة تجريبية أساسية"
                                )}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 4. Payment & Amount */}
                        <td className="px-5 py-4">
                          <div className="space-y-1 text-right">
                            <span className="font-black text-emerald-400 text-sm block tracking-wide font-mono">
                              {getPrice(req.programType) > 0 ? (
                                `${getPrice(req.programType).toLocaleString("ar-DZ")} دج`
                              ) : (
                                "0 دج (مجاني)"
                              )}
                            </span>
                            <div className="flex items-center gap-1.5 justify-end uppercase font-bold text-[10px]">
                              {req.paymentMethod === "baridimob" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400">
                                  <span>BARIDIMOB</span>
                                </span>
                              ) : req.paymentMethod === "ccp" ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/20 text-[#F59E0B]">
                                  <span>CCP</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-500/10 border border-slate-500/20 text-slate-400">
                                  <span>بدون دفع</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* 5. Status Badge */}
                        <td className="px-5 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <StatusDropdown
                            currentStatus={req.status}
                            onChange={(newStatus) => {
                              updateTrialStatus(req.id, newStatus);
                              triggerToast(`تم تحديث حالة الطلب إلى: ${newStatus} 🎯`);
                            }}
                            storeName={req.storeName}
                          />
                        </td>

                        {/* 6. Last Active / Timestamp */}
                        <td className="px-5 py-4 font-mono text-xs text-slate-400">
                          <div>{new Date(req.timestamp).toLocaleDateString("ar-DZ", { day: "2-digit", month: "2-digit", year: "numeric" })}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{new Date(req.timestamp).toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" })}</div>
                        </td>

                        {/* 7. Quick Actions with stopPropagation to avoid opening drawer */}
                        <td className="px-5 py-4 text-left" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5 justify-end">
                            
                            {/* WhatsApp Template URL */}
                            <a
                              href={generateWhatsAppLink(req.phone, req.ownerName, req.storeName, req.programType)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-[#0B0B12] hover:bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg transition-all cursor-pointer"
                              title="مراسلة عبر واتساب"
                            >
                              <MessageSquareCode className="w-3.5 h-3.5" />
                            </a>

                            {/* Direct Phone Call */}
                            <a
                              href={`tel:${req.phone}`}
                              className="p-1.5 bg-[#0B0B12] hover:bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg transition-all cursor-pointer"
                              title="اتصال هاتفي مباشر"
                            >
                              <Phone className="w-3.5 h-3.5" />
                            </a>

                            {/* Copy number */}
                            <button
                              onClick={() => copyText(req.phone, `${req.id}-phone`, "رقم الهاتف")}
                              className="p-1.5 bg-[#0B0B12] hover:bg-slate-700/50 border border-white/5 text-slate-300 rounded-lg transition-all cursor-pointer"
                              title="نسخ الرقم"
                            >
                              {copiedId === `${req.id}-phone` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Open Details Drawer */}
                            <button
                              onClick={() => setSelectedRequest(req)}
                              className="p-1.5 bg-[#0B0B12] hover:bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6] rounded-lg transition-all cursor-pointer"
                              title="فتح لوحة تفاصيل العميل والترخيص"
                            >
                              <Info className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Action */}
                            <button
                              onClick={() => openEditModal(req)}
                              className="p-1.5 bg-[#0B0B12] hover:bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg transition-all cursor-pointer"
                              title="تعديل تفاصيل الطلب"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            {/* Status Quick Activation */}
                            {req.status !== "approved" ? (
                              <button
                                onClick={() => {
                                  updateTrialStatus(req.id, "approved");
                                  addLog(`تم تنشيط وتفعيل رخصة متجر "${req.storeName}" بنجاح.`);
                                  triggerToast("تم تنشيط رخصة المتجر بنجاح 🟢");
                                }}
                                className="p-1.5 bg-[#0B0B12] hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg transition-all cursor-pointer"
                                title="تنشيط وتسليم الرخصة فوراً"
                              >
                                <CheckSquare className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  updateTrialStatus(req.id, "canceled");
                                  addLog(`تم إلغاء وتجميد رخصة متجر "${req.storeName}".`);
                                  triggerToast("تم إلغاء وتجميد الرخصة.");
                                }}
                                className="p-1.5 bg-[#0B0B12] hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg transition-all cursor-pointer"
                                title="إلغاء وتجميد رخصة العميل"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete Action */}
                            <button
                              onClick={() => {
                                if (confirm(`هل أنت متأكد من حذف طلب "${req.storeName}" بالكامل؟`)) {
                                  deleteTrialRequest(req.id);
                                  addLog(`تم حذف طلب "${req.storeName}" من جدول الإجراءات.`);
                                  triggerToast("تم حذف الطلب بنجاح.");
                                }
                              }}
                              className="p-1.5 bg-[#0B0B12] hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg transition-all cursor-pointer"
                              title="حذف طلب العميل"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Pagination Controls */}
          {filteredAndSortedTrials.length > 0 && (
            <div className="p-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">الصفوف لكل صفحة:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="bg-[#0B0B12] border border-[rgba(255,255,255,0.06)] rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none cursor-pointer font-mono"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              {/* Pagination indicators */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0B0B12] text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        currentPage === page 
                          ? "bg-[#8B5CF6] text-white border border-[#8B5CF6]" 
                          : "bg-[#0B0B12] hover:bg-[#1C1C26] text-slate-400 border border-[rgba(255,255,255,0.06)]"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#0B0B12] text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ================================================================= */}
      {/* 5. CLIENT DETAILS DRAWERS (Slide in from Right) */}
      {/* ================================================================= */}
      <AnimatePresence>
        {selectedRequest && (
          <>
            {/* Backdrop Layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequest(null)}
              className="fixed inset-0 bg-[#000]/70 z-[100] backdrop-blur-xs"
            />

            {/* Right Side Drawer Sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-lg bg-[#14141D] border-l border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-[101] flex flex-col text-right"
            >
              {/* Drawer Header */}
              <div className="p-5 bg-[#0B0B12] border-b border-white/5 flex items-center justify-between flex-row-reverse">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (confirm(`هل أنت متأكد من حذف طلب "${selectedRequest.storeName}" بالكامل؟`)) {
                        deleteTrialRequest(selectedRequest.id);
                        addLog(`تم حذف طلب "${selectedRequest.storeName}" من لوحة التفاصيل.`);
                        setSelectedRequest(null);
                        triggerToast("تم حذف الطلب بنجاح.");
                      }
                    }}
                    className="p-2 bg-[#14141D] hover:bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl transition-all cursor-pointer"
                    title="حذف هذا الطلب"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedRequest(null)}
                    className="p-2 bg-[#14141D] hover:bg-[#1C1C26] border border-white/5 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6]/30 to-[#A855F7]/30 border border-[#8B5CF6]/40 flex items-center justify-center shrink-0">
                    <Laptop className="w-6 h-6 text-[#A855F7]" />
                  </div>
                  <div>
                    <h2 className="text-md font-black text-white">{selectedRequest.storeName}</h2>
                    <p className="text-xs text-[#8B5CF6] font-bold">{translateProg(selectedRequest.programType)}</p>
                  </div>
                </div>
              </div>

              {/* Drawer Nav Tabs */}
              <div className="grid grid-cols-4 bg-[#0B0B12]/80 border-b border-white/5 p-2 gap-1 text-center">
                <button
                  onClick={() => setActiveDrawerTab("details")}
                  className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                    activeDrawerTab === "details"
                      ? "bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  البيانات
                </button>
                <button
                  onClick={() => setActiveDrawerTab("licenses")}
                  className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                    activeDrawerTab === "licenses"
                      ? "bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  التراخيص
                </button>
                <button
                  onClick={() => setActiveDrawerTab("whatsapp")}
                  className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                    activeDrawerTab === "whatsapp"
                      ? "bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  مراسلة سريعة
                </button>
                <button
                  onClick={() => setActiveDrawerTab("notes")}
                  className={`py-2 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                    activeDrawerTab === "notes"
                      ? "bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#8B5CF6]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  ملاحظات
                </button>
              </div>

              {/* Drawer Content Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
                
                {activeDrawerTab === "details" && (
                  <div className="space-y-4">
                    
                    {/* General section */}
                    <div className="bg-[#0B0B12] p-4 rounded-xl border border-white/5 space-y-3">
                      <h4 className="text-xs font-black text-[#8B5CF6] flex items-center gap-1 flex-row-reverse border-b border-white/5 pb-1.5">
                        <User className="w-4 h-4" />
                        <span>معلومات العميل والمالك</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">اسم المالك الكامل:</span>
                          <span className="text-white font-bold">{selectedRequest.ownerName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">رقم الهاتف الأساسي:</span>
                          <span className="text-white font-mono font-bold">{selectedRequest.phone}</span>
                        </div>
                        {selectedRequest.phone2 && (
                          <div>
                            <span className="text-slate-400 block mb-0.5">رقم الهاتف الثانوي:</span>
                            <span className="text-white font-mono">{selectedRequest.phone2}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-slate-400 block mb-0.5">المدينة والولاية:</span>
                          <span className="text-white font-bold">{selectedRequest.city}</span>
                        </div>
                      </div>
                    </div>

                    {/* Store section */}
                    <div className="bg-[#0B0B12] p-4 rounded-xl border border-white/5 space-y-3">
                      <h4 className="text-xs font-black text-[#A855F7] flex items-center gap-1 flex-row-reverse border-b border-white/5 pb-1.5">
                        <Laptop className="w-4 h-4" />
                        <span>بيانات المتجر والترخيص المطلوب</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-slate-400 block mb-0.5">اسم المحل التجاري:</span>
                          <span className="text-white font-bold">{selectedRequest.storeName}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">نوع الباقة:</span>
                          <span className="text-[#8B5CF6] font-bold">{translateProg(selectedRequest.programType)}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">طريقة الدفع المحددة:</span>
                          <span className="text-white font-bold capitalize">{selectedRequest.paymentMethod || "مجاني"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block mb-0.5">المبلغ المفروض:</span>
                          <span className="text-emerald-400 font-mono font-bold">{formatCurrency(getPrice(selectedRequest.programType))}</span>
                        </div>
                        <div className="col-span-2 pt-2.5 border-t border-white/5 flex items-center justify-between flex-row-reverse">
                          <span className="text-slate-400 font-bold">التحكم في حالة الطلب:</span>
                          <StatusDropdown
                            currentStatus={selectedRequest.status}
                            onChange={(newStatus) => {
                              updateTrialStatus(selectedRequest.id, newStatus);
                              setSelectedRequest(prev => prev ? { ...prev, status: newStatus } : null);
                              const statusNames = {
                                pending: "جديد ⏳",
                                contacted: "تم الاتصال 📞",
                                demo_sent: "تم ارسال النسخة التجريبية 🧪",
                                approved: "مفعّل ونشط 🟢",
                                completed: "تم الدفع ✅",
                                canceled: "ملغي ❌"
                              };
                              addLog(`تم تغيير حالة طلب متجر "${selectedRequest.storeName}" إلى: ${statusNames[newStatus]}`);
                              triggerToast(`تم تحديث حالة الطلب إلى: ${statusNames[newStatus]} 🎯`);
                            }}
                            storeName={selectedRequest.storeName}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Files Simulation */}
                    <div className="bg-[#0B0B12] p-4 rounded-xl border border-white/5 space-y-3">
                      <h4 className="text-xs font-black text-[#06B6D4] flex items-center gap-1 flex-row-reverse border-b border-white/5 pb-1.5">
                        <FileText className="w-4 h-4" />
                        <span>الملفات المرفقة وتأكيد السداد</span>
                      </h4>
                      
                      <div className="border border-dashed border-white/10 rounded-xl p-4 text-center space-y-2 text-slate-500 text-[11px]">
                        <FileUp className="w-8 h-8 mx-auto text-slate-700 animate-pulse" />
                        <p>صورة إثبات سداد الحوالة البريدية متوفرة للتحقق</p>
                        <button 
                          onClick={() => {
                            triggerToast("جاري تنزيل صورة الوصل والتحويل البريدي...");
                            addLog(`تم تحميل إثبات دفع العميل لمتجر: ${selectedRequest.storeName}`);
                          }}
                          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-black rounded-lg cursor-pointer transition-all"
                        >
                          معاينة وتنزيل الملف المرفق
                        </button>
                      </div>
                    </div>

                  </div>
                )}

                {activeDrawerTab === "licenses" && (
                  <div className="space-y-4">
                    <div className="bg-[#0B0B12] p-4 rounded-xl border border-white/5 space-y-3 text-xs">
                      <h4 className="text-xs font-black text-emerald-400 flex items-center gap-1 flex-row-reverse border-b border-white/5 pb-1.5">
                        <CheckSquare className="w-4 h-4" />
                        <span>توليد وتسليم رموز التراخيص الذكية</span>
                      </h4>
                      
                      <p className="text-slate-400 leading-relaxed text-[11px]">
                        تلقائياً يقوم النظام بربط رمز الترخيص بقاعدة بيانات العميل لتثبيته في النسخة المكتبية من برنامج الكاشير.
                      </p>

                      <div className="space-y-2.5 pt-2">
                        <div>
                          <span className="text-slate-400 block mb-1">رمز تفعيل الخادم الأساسي (Server Key):</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={`ALGORA-POS-${selectedRequest.id.toUpperCase()}-LIC-2026`}
                              className="flex-1 bg-[#14141D] border border-white/10 rounded-lg px-3 py-2 text-[11px] font-mono text-emerald-300 text-left focus:outline-none"
                            />
                            <button
                              onClick={() => copyText(`ALGORA-POS-${selectedRequest.id.toUpperCase()}-LIC-2026`, "lic-srv", "مفتاح الترخيص")}
                              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                              title="نسخ الرمز"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-400 block mb-1">كود الترخيص الاحتياطي (Backup Key):</span>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={`BAK-9281-01-${selectedRequest.id.split("-")[0]?.toUpperCase() || "DZ"}`}
                              className="flex-1 bg-[#14141D] border border-white/10 rounded-lg px-3 py-2 text-[11px] font-mono text-slate-400 text-left focus:outline-none"
                            />
                            <button
                              onClick={() => copyText(`BAK-9281-01-${selectedRequest.id.split("-")[0]?.toUpperCase() || "DZ"}`, "lic-bak", "مفتاح الاحتياطي")}
                              className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300"
                              title="نسخ الرمز"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Order QR Representation */}
                        <div className="pt-2 text-center space-y-2">
                          <span className="text-slate-400 block text-[11px]">رمز الاستجابة السريع للطلب (Order QR ID):</span>
                          <div className="bg-white p-3 rounded-lg w-28 h-28 mx-auto flex items-center justify-center border border-slate-200">
                            {/* Simple visual mock of barcode / QR code using CSS divs */}
                            <div className="grid grid-cols-4 gap-1.5 w-full h-full opacity-85">
                              <div className="bg-slate-900 h-full w-2"></div>
                              <div className="bg-slate-900 h-full w-1"></div>
                              <div className="bg-slate-900 h-full w-3"></div>
                              <div className="bg-slate-900 h-full w-1.5"></div>
                              <div className="bg-slate-900 h-full w-1"></div>
                              <div className="bg-slate-900 h-full w-2"></div>
                              <div className="bg-slate-900 h-full w-1"></div>
                              <div className="bg-slate-900 h-full w-2"></div>
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 block">ID: {selectedRequest.id}</span>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {activeDrawerTab === "whatsapp" && (
                  <div className="space-y-4 text-xs">
                    {/* Automated Send Panel */}
                    <div className="bg-[#0B0B12] p-4 rounded-xl border border-white/5 space-y-3">
                      <h4 className="text-xs font-black text-emerald-400 flex items-center gap-1 flex-row-reverse border-b border-white/5 pb-1.5">
                        <MessageSquare className="w-4 h-4" />
                        <span>إرسال رسالة واتساب أوتوماتيكية</span>
                      </h4>

                      <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 block">اختر الحدث / القالب للإرسال:</label>
                        <select
                          value={selectedTemplateId}
                          onChange={(e) => setSelectedTemplateId(e.target.value)}
                          className="w-full bg-[#14141D] border border-white/10 rounded-lg px-3 py-2 text-[11px] text-white focus:outline-none"
                        >
                          <option value="new_order">طلب جديد (الرسالة الترحيبية)</option>
                          <option value="contacted">تم الاتصال ومتابعة العميل</option>
                          <option value="pending_payment">بانتظار سداد الفاتورة</option>
                          <option value="completed_payment">تم الدفع واستلام المال</option>
                          <option value="activated">تم التفعيل وإرسال الرخصة</option>
                          <option value="expiring_soon">تنبيه بقرب انتهاء الاشتراك</option>
                          <option value="expired">تنبيه بانتهاء الاشتراك</option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-1.5">
                        <button
                          onClick={async () => {
                            setSendingManualMsg(true);
                            try {
                              const res = await fetch("/api/admin/whatsapp/send-manual", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                  orderId: selectedRequest.id,
                                  templateId: selectedTemplateId
                                })
                              });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                triggerToast("تم إرسال الرسالة وجدولتها بنجاح 🟢");
                                fetchWhatsappLogs(selectedRequest.id);
                              } else {
                                triggerToast(data.error || "فشل إرسال الرسالة.");
                              }
                            } catch (e) {
                              triggerToast("خطأ أثناء الاتصال بالخادم.");
                            } finally {
                              setSendingManualMsg(false);
                            }
                          }}
                          disabled={sendingManualMsg}
                          className="flex-1 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-black rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>إرسال آلي عبر الـ API</span>
                        </button>

                        <button
                          onClick={async () => {
                            try {
                              // Fetch template message body to format on frontend and copy
                              const tRes = await fetch("/api/admin/whatsapp/templates");
                              if (tRes.ok) {
                                const list = await tRes.json();
                                const currentT = list.find((t: any) => t.id === selectedTemplateId);
                                if (currentT) {
                                  // Local dynamic format fallback
                                  let text = currentT.message;
                                  const vars = {
                                    "{{customerName}}": selectedRequest.ownerName || "",
                                    "{{storeName}}": selectedRequest.storeName || "",
                                    "{{orderNumber}}": selectedRequest.orderNumber || "",
                                    "{{package}}": selectedRequest.programType || "",
                                    "{{price}}": `${(selectedRequest.packagePrice || 0).toLocaleString("ar-DZ")} دج`,
                                    "{{licenseKey}}": `ALGORA-POS-${selectedRequest.id.toUpperCase()}-LIC-2026`,
                                    "{{activationCode}}": "BAK-9281-01",
                                    "{{phone}}": selectedRequest.phone || "",
                                    "{{today}}": new Date().toLocaleDateString("ar-DZ")
                                  };
                                  for (const [key, value] of Object.entries(vars)) {
                                    text = text.replace(new RegExp(key, "g"), value);
                                  }
                                  copyText(text, "manual-copy", "نص الرسالة");
                                }
                              }
                            } catch (e) {
                              triggerToast("فشل نسخ النص.");
                            }
                          }}
                          className="px-3 py-2 bg-[#14141D] hover:bg-[#1C1C26] border border-white/10 text-slate-300 font-bold rounded-lg cursor-pointer transition-all"
                        >
                          نسخ النص
                        </button>
                      </div>

                      {/* Direct web fallback */}
                      <a
                        href={generateWhatsAppLink(selectedRequest.phone, selectedRequest.ownerName, selectedRequest.storeName, selectedRequest.programType)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-black rounded-lg text-center flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>فتح محادثة واتساب ويب مباشرة (يدوي)</span>
                      </a>
                    </div>

                    {/* Customer WhatsApp Logs List */}
                    <div className="bg-[#0B0B12] p-4 rounded-xl border border-white/5 space-y-2">
                      <h4 className="text-xs font-black text-indigo-400 flex items-center justify-between flex-row-reverse border-b border-white/5 pb-1.5">
                        <span>سجل الإرسال الخاص بهذا العميل</span>
                        <span className="text-[9px] text-slate-500">محدث تلقائياً</span>
                      </h4>

                      <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {whatsappLogs.length === 0 ? (
                          <p className="text-center py-4 text-slate-500 text-[10px]">لا توجد رسائل مسجلة لهذا العميل بعد.</p>
                        ) : (
                          whatsappLogs.map(l => (
                            <div key={l.id} className="p-2.5 bg-[#14141D] border border-white/5 rounded-lg flex items-center justify-between text-[10px]">
                              {l.status === "Failed" ? (
                                <button
                                  onClick={() => handleResendLog(l.id)}
                                  className="px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-400 rounded text-[9px] font-black"
                                >
                                  إعادة إرسال 🚀
                                </button>
                              ) : (
                                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                  l.status === "Read" ? "bg-blue-500/15 text-blue-400" :
                                  l.status === "Delivered" ? "bg-emerald-500/15 text-emerald-400" :
                                  "bg-indigo-500/15 text-indigo-400"
                                }`}>
                                  {l.status === "Read" ? "قرئت" : l.status === "Delivered" ? "وصلت" : "أرسلت"}
                                </span>
                              )}
                              <div className="text-right">
                                <p className="font-black text-slate-300">{l.template}</p>
                                <p className="text-[8px] text-slate-500 mt-0.5">{new Date(l.sentAt || l.createdAt).toLocaleString("ar-DZ")}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeDrawerTab === "notes" && (
                  <div className="space-y-4">
                    <div className="bg-[#0B0B12] p-4 rounded-xl border border-white/5 space-y-3">
                      <h4 className="text-xs font-black text-[#A855F7] flex items-center gap-1 flex-row-reverse border-b border-white/5 pb-1.5">
                        <FileText className="w-4 h-4" />
                        <span>ملاحظات المشرف وتتبع العميل</span>
                      </h4>

                      <div className="space-y-2">
                        <textarea
                          rows={4}
                          value={tempNoteText}
                          onChange={(e) => setTempNoteText(e.target.value)}
                          placeholder="أدخل ملاحظات خاصة حول العميل (مثلاً: طريقة التواصل المفضلة، تفاصيل التثبيت، وقت السداد المتوقع)..."
                          className="w-full bg-[#14141D] border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 text-right focus:outline-none focus:ring-1 focus:ring-[#A855F7] font-medium"
                        />
                        
                        <button
                          onClick={() => handleSaveDrawerNote(selectedRequest.id)}
                          className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#A855F7] text-white text-xs font-black rounded-lg transition-all cursor-pointer"
                        >
                          حفظ التعديلات
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Drawer Footer Panel with Action Buttons */}
              <div className="p-4 bg-[#0B0B12] border-t border-white/5 grid grid-cols-2 gap-2">
                
                {selectedRequest.status !== "approved" ? (
                  <button
                    onClick={() => {
                      updateTrialStatus(selectedRequest.id, "approved");
                      addLog(`تم تفعيل طلب متجر ${selectedRequest.storeName} من لوحة التفاصيل الجانبية.`);
                      setSelectedRequest(prev => prev ? { ...prev, status: "approved" } : null);
                      triggerToast("تم تفعيل رخصة المتجر بنجاح 🟢");
                    }}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>تنشيط رخصة الترخيص</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      updateTrialStatus(selectedRequest.id, "pending");
                      addLog(`تم إلغاء تفعيل حساب متجر ${selectedRequest.storeName} وإعادته لقيد الانتظار.`);
                      setSelectedRequest(prev => prev ? { ...prev, status: "pending" } : null);
                      triggerToast("تم إعادة الطلب لقيد المراجعة.");
                    }}
                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>تجميد الترخيص</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    updateTrialStatus(selectedRequest.id, "completed");
                    addLog(`تم تسجيل حوالة سداد متجر ${selectedRequest.storeName} بنجاح.`);
                    setSelectedRequest(prev => prev ? { ...prev, status: "completed" } : null);
                    triggerToast("تم تأكيد دفع العميل بنجاح! 💸");
                  }}
                  className="w-full py-3 bg-[#8B5CF6] hover:bg-[#A855F7] text-white font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>تأكيد سداد العميل</span>
                </button>

                <button
                  onClick={() => {
                    const printWindow = window.open("", "_blank");
                    if (printWindow) {
                      printWindow.document.write(`
                        <html>
                        <head>
                          <title>فاتورة - ${selectedRequest.storeName}</title>
                          <style>
                            body { font-family: sans-serif; direction: rtl; text-align: right; padding: 20px; }
                            .header { border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
                            .details { line-height: 1.8; font-size: 14px; }
                          </style>
                        </head>
                        <body>
                          <div class="header">
                            <h1>المركز الجزائري للبرمجيات Algora POS</h1>
                            <p>فاتورة مبيعات واستلام برمجيات للفرع</p>
                          </div>
                          <div class="details">
                            <p><strong>اسم المحل:</strong> ${selectedRequest.storeName}</p>
                            <p><strong>مالك الترخيص:</strong> ${selectedRequest.ownerName}</p>
                            <p><strong>رقم المالك:</strong> ${selectedRequest.phone}</p>
                            <p><strong>المدينة / الولاية:</strong> ${selectedRequest.city}</p>
                            <p><strong>الباقة المخصصة:</strong> ${translateProg(selectedRequest.programType)}</p>
                            <p><strong>المبلغ المستحق:</strong> ${getPrice(selectedRequest.programType)} دج</p>
                            <p><strong>كود الترخيص:</strong> ALGORA-POS-${selectedRequest.id.toUpperCase()}-LIC-2026</p>
                          </div>
                        </body>
                        </html>
                      `);
                      printWindow.document.close();
                      printWindow.print();
                    }
                    addLog(`تم استخراج وطباعة وثيقة الترخيص لـ: ${selectedRequest.storeName}`);
                    triggerToast("تم فتح نافذة طباعة الوصل والترخيص!");
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة وثيقة الترخيص</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm("هل أنت متأكد من إلغاء ورفض هذا الطلب نهائياً؟")) {
                      updateTrialStatus(selectedRequest.id, "canceled");
                      addLog(`تم رفض وإلغاء طلب متجر: ${selectedRequest.storeName}`);
                      setSelectedRequest(prev => prev ? { ...prev, status: "canceled" } : null);
                      triggerToast("تم إلغاء الطلب.");
                    }
                  }}
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>إلغاء ورفض الطلب</span>
                </button>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Request Modal Popup */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121218] border border-[rgba(255,255,255,0.06)] w-full max-w-lg text-right shadow-2xl rounded-2xl relative flex flex-col max-h-[90vh]"
            >
              <div className="bg-[#0B0B0F] px-6 py-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between flex-row-reverse rounded-t-2xl">
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-2 bg-[#121218] hover:bg-slate-800 text-slate-400 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <Plus className="w-5 h-5 text-[#8B5CF6]" />
                  <h3 className="font-black text-white text-base">إضافة طلب ترخيص جديد يدوياً</h3>
                </div>
              </div>

              <form onSubmit={handleAddNewRequestSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                {/* Store Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-300">اسم المحل التجاري بالكامل <span className="text-rose-500">*</span>:</label>
                  <input
                    type="text"
                    required
                    value={addStoreName}
                    onChange={(e) => setAddStoreName(e.target.value)}
                    placeholder="مثال: ماتريكس للهواتف - Matrix Phone"
                    className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED]"
                  />
                </div>

                {/* Owner Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-300">اسم صاحب المحل / العميل <span className="text-rose-500">*</span>:</label>
                  <input
                    type="text"
                    required
                    value={addOwnerName}
                    onChange={(e) => setAddOwnerName(e.target.value)}
                    placeholder="مثال: ياسين حداد"
                    className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED]"
                  />
                </div>

                {/* Phones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300">رقم الهاتف الأساسي <span className="text-rose-500">*</span>:</label>
                    <input
                      type="text"
                      required
                      value={addPhone}
                      onChange={(e) => setAddPhone(e.target.value)}
                      placeholder="0550123456"
                      className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300">الهاتف الاحتياطي (اختياري):</label>
                    <input
                      type="text"
                      value={addPhone2}
                      onChange={(e) => setAddPhone2(e.target.value)}
                      placeholder="0660123456"
                      className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-100 font-mono text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                    />
                  </div>
                </div>

                {/* City State */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-300">الولاية والمقر الجغرافي بالجزائر <span className="text-rose-500">*</span>:</label>
                  <select
                    value={addCity}
                    onChange={(e) => setAddCity(e.target.value)}
                    className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-300 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                  >
                    <option value="الجزائر العاصمة (Alger)">الجزائر العاصمة (Alger)</option>
                    <option value="وهران (Oran)">وهران (Oran)</option>
                    <option value="قسنطينة (Constantine)">قسنطينة (Constantine)</option>
                    <option value="سطيف (Sétif)">سطيف (Sétif)</option>
                    <option value="بجاية (Béjaïa)">بجاية (Béjaïa)</option>
                    <option value="باتنة (Batna)">باتنة (Batna)</option>
                    <option value="تلمسان (Tlemcen)">تلمسان (Tlemcen)</option>
                    <option value="الشلف (Chlef)">الشلف (Chlef)</option>
                    <option value="جيجل (Jijel)">جيجل (Jijel)</option>
                    <option value="عنابة (Annaba)">عنابة (Annaba)</option>
                    <option value="البليدة (Blida)">البليدة (Blida)</option>
                    <option value="برج بوعريريج (BBA)">برج بوعريريج (BBA)</option>
                    <option value="غرداية (Ghardaïa)">غرداية (Ghardaïa)</option>
                    <option value="بسكرة (Biskra)">بسكرة (Biskra)</option>
                    <option value="المسيلة (M'Sila)">المسيلة (M'Sila)</option>
                  </select>
                </div>

                {/* Program Type, Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300">نوع الباقة الترخيصية:</label>
                    <select
                      value={addProgramType}
                      onChange={(e) => setAddProgramType(e.target.value)}
                      className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-300 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                    >
                      <option value="trial">فترة تجريبية أساسية (5 أيام)</option>
                      <option value="pc">باقة لوجيسيال حاسوب فقط (12,000 دج)</option>
                      <option value="mobile">باقة تطبيق هاتف فقط (12,000 دج)</option>
                      <option value="both">باقة تطبيق هاتف مع حاسوب معاً (22,000 دج)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300">طريقة الدفع والسداد للترخيص:</label>
                    <select
                      value={addPaymentMethod}
                      onChange={(e) => setAddPaymentMethod(e.target.value)}
                      className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-300 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                    >
                      <option value="baridimob">بريدي موب (Baridimob)</option>
                      <option value="ccp">حساب CCP البريدي الجاري</option>
                      <option value="redotpay">بطاقة RedotPay الدولية</option>
                      <option value="cash">نقداً / وكيل معتمد يد بيد</option>
                    </select>
                  </div>
                </div>

                {/* Has WhatsApp, Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300">هل يملك رقم واتساب مفعل؟</label>
                    <div className="flex gap-4 justify-end mt-2">
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <span>لا</span>
                        <input
                          type="radio"
                          name="addHasWhatsapp"
                          checked={addHasWhatsapp === "no"}
                          onChange={() => setAddHasWhatsapp("no")}
                          className="text-[#7C3AED] focus:ring-[#7C3AED] bg-[#0B0B0F] border-slate-800"
                        />
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <span>نعم</span>
                        <input
                          type="radio"
                          name="addHasWhatsapp"
                          checked={addHasWhatsapp === "yes"}
                          onChange={() => setAddHasWhatsapp("yes")}
                          className="text-[#7C3AED] focus:ring-[#7C3AED] bg-[#0B0B0F] border-slate-800"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300">حالة الحساب والتفعيل:</label>
                    <select
                      value={addStatus}
                      onChange={(e) => setAddStatus(e.target.value as any)}
                      className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-300 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                    >
                      <option value="pending">⏳ قيد الانتظار والمراجعة</option>
                      <option value="contacted">📞 تم التواصل مع العميل</option>
                      <option value="demo_sent">🧪 تم ارسال النسخة التجريبية</option>
                      <option value="approved">🟢 مفعّل ونشط (تسليم فوري)</option>
                      <option value="completed">✅ مكتمل ومؤكد</option>
                      <option value="canceled">❌ ملغى أو مرفوض</option>
                    </select>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex gap-3 justify-end flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isSubmittingAdd}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#A855F7] hover:to-[#8B5CF6] text-white text-xs font-black rounded-xl transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingAdd ? "جاري الحفظ والإنشاء..." : "💾 إضافة وحفظ العميل"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    إلغاء والتراجع
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
