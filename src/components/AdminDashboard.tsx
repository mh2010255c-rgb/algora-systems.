import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
  Users, CheckCircle2, Clock, Trash2, Edit, Search, Filter, 
  Plus, RefreshCw, Phone, MessageSquareCode, FileText, Check, 
  X, Lock, ShieldAlert, Laptop, Smartphone, ArrowRight, MapPin, 
  CreditCard, Sparkles, CheckSquare, AlertCircle, TrendingUp, Download,
  Printer, Send, HelpCircle, Building2, Layers, CheckCircle,
  Calendar, Zap, Award, Bell, Percent, Activity, Sliders
} from "lucide-react";

import AdminSidebar from "./admin/AdminSidebar";
import AdminHeader from "./admin/AdminHeader";
import OverviewTab from "./admin/OverviewTab";
import TrialsTab from "./admin/TrialsTab";
import TicketsTab from "./admin/TicketsTab";
import BaridimobTab from "./admin/BaridimobTab";
import SettingsTab from "./admin/SettingsTab";
import WhatsappTab from "./admin/WhatsappTab";
import ConfirmersTab from "./admin/ConfirmersTab";

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
  status: "pending" | "contacted" | "demo_sent" | "approved" | "completed" | "canceled" | "whatsapp_sent" | "no_whatsapp";
  confirmationStatus?: "pending" | "contacted" | "no_reply_1" | "no_reply_2" | "no_reply_3" | "whatsapp_sent" | "no_whatsapp" | "wrong_number" | "confirmed" | "canceled";
  assignedConfirmerId?: string;
}

interface SupportTicket {
  id: string;
  storeName: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "open" | "resolved";
}

interface AdminDashboardProps {
  onLogout?: () => void;
  theme?: "light" | "dark";
  setTheme?: (theme: "light" | "dark") => void;
}

export default function AdminDashboard({ onLogout, theme, setTheme }: AdminDashboardProps) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Convex queries
  const rawTrialRequests = useQuery(api.orders.list);
  const rawSupportTickets = useQuery(api.tickets.list);

  // Convex mutations
  const createOrderMutation = useMutation(api.orders.create);
  const updateOrderMutation = useMutation(api.orders.update);
  const deleteOrderMutation = useMutation(api.orders.remove);
  const createTicketMutation = useMutation(api.tickets.create);
  const updateTicketMutation = useMutation(api.tickets.updateStatus);
  const deleteTicketMutation = useMutation(api.tickets.remove);

  // Mapped lists for local components
  const trialRequests: TrialRequest[] = (rawTrialRequests || []).map((o: any) => ({
    id: o._id,
    storeName: o.storeName,
    ownerName: o.ownerName,
    phone: o.phonePrimary,
    phone2: o.phoneSecondary,
    hasWhatsapp: o.whatsappLinked ? "yes" : "no",
    paymentMethod: o.paymentMethod,
    programType: o.packageType,
    city: o.city + (o.province ? ` (${o.province})` : ""),
    timestamp: o.createdAt,
    status: o.orderStatus,
    packagePrice: o.packagePrice,
    licenseKey: o.licenseKey,
    confirmationStatus: o.confirmationStatus || "pending",
    assignedConfirmerId: o.assignedConfirmerId || "",
  }));

  const supportTickets: SupportTicket[] = (rawSupportTickets || []).map((t: any) => ({
    id: t._id,
    storeName: t.storeName,
    phone: t.phone,
    subject: t.subject,
    message: t.message,
    timestamp: t.createdAt,
    status: t.status,
  }));

  const loading = rawTrialRequests === undefined || rawSupportTickets === undefined;
  const [error, setError] = useState<string>("");

  const rawConfirmers = useQuery(api.confirmers.list);

  // Active Tab inside Admin Panel
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<"overview" | "trials" | "tickets" | "baridimob" | "logs" | "settings" | "whatsapp" | "confirmers">("trials");

  const [userRole, setUserRole] = useState<"admin" | "confirmer" | null>("admin");
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  // Mobile and responsive layout states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "name_asc" | "name_desc">("date_desc");

  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("ar-DZ", { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setCurrentDate(now.toLocaleDateString("ar-DZ", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  interface BaridiMobPayment {
    id: string;
    storeName: string;
    amount: number;
    transactionRef: string;
    senderName: string;
    date: string;
    status: "pending" | "verified" | "rejected";
  }

  const [baridimobPayments, setBaridimobPayments] = useState<BaridiMobPayment[]>([
    {
      id: "PM-2910",
      storeName: "هواتف الغرب - Oran Phone",
      amount: 20000,
      transactionRef: "MOB-839210-DZ",
      senderName: "بن عودة عبد القادر",
      date: "2026-07-09T02:15:00Z",
      status: "pending"
    },
    {
      id: "PM-2911",
      storeName: "صيانة ميكرو بجاية",
      amount: 2500,
      transactionRef: "MOB-748921-DZ",
      senderName: "مزيان السعيد",
      date: "2026-07-08T18:30:00Z",
      status: "verified"
    },
    {
      id: "PM-2912",
      storeName: "ماتريكس فون الجزائر",
      amount: 35000,
      transactionRef: "CCP-992384-ALG",
      senderName: "حداد ياسين",
      date: "2026-07-08T14:10:00Z",
      status: "pending"
    },
    {
      id: "PM-2913",
      storeName: "كوسميتيك النجمة سطيف",
      amount: 20000,
      transactionRef: "MOB-110294-DZ",
      senderName: "بوقرة بلال",
      date: "2026-07-07T09:45:00Z",
      status: "verified"
    }
  ]);

  // Pricing States
  const [annualPrice, setAnnualPrice] = useState(20000);
  const [monthlyPrice, setMonthlyPrice] = useState(2500);
  const [enterprisePrice, setEnterprisePrice] = useState(35000);

  // License Generator State
  const [licStore, setLicStore] = useState("");
  const [licPhone, setLicPhone] = useState("");
  const [licDuration, setLicDuration] = useState("12_months");
  const [generatedKey, setGeneratedKey] = useState("");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [programFilter, setProgramFilter] = useState("all");

  // Log messages for the real-time simulation pane
  const [activityLogs, setActivityLogs] = useState<string[]>([
    "النظام متصل بنجاح بقاعدة البيانات المركزية.",
    "تم تحديث إحصائيات الاشتراسات للولايات الجزائرية بنجاح."
  ]);

  // Modal State for Editing Trial Request
  const [editingRequest, setEditingRequest] = useState<TrialRequest | null>(null);
  const [editStoreName, setEditStoreName] = useState("");
  const [editOwnerName, setEditOwnerName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPhone2, setEditPhone2] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editProgramType, setEditProgramType] = useState("annual");
  const [editPaymentMethod, setEditPaymentMethod] = useState("baridimob");
  const [editHasWhatsapp, setEditHasWhatsapp] = useState<"yes" | "no">("yes");
  const [editStatus, setEditStatus] = useState<"pending" | "contacted" | "demo_sent" | "approved" | "completed" | "canceled" | "whatsapp_sent" | "no_whatsapp">("pending");
  const [isUpdating, setIsUpdating] = useState(false);

  // Stats Counters
  const [stats, setStats] = useState({
    totalTrials: 0,
    pendingTrials: 0,
    approvedTrials: 0,
    totalTickets: 0,
    openTickets: 0,
    totalRevenue: 0, // In DA
  });

  // Load and check login session
  useEffect(() => {
    const adminSession = localStorage.getItem("algora_admin_logged");
    if (adminSession === "true") {
      setIsAuthenticated(true);
      setUserRole("admin");
      setUserPermissions([]);
    } else {
      const confirmerSession = localStorage.getItem("algora_confirmer_logged");
      const confirmerRole = localStorage.getItem("algora_confirmer_role");
      const confirmerPerms = localStorage.getItem("algora_confirmer_perms");
      if (confirmerSession === "true") {
        setIsAuthenticated(true);
        setUserRole("confirmer");
        setUserPermissions(confirmerPerms ? JSON.parse(confirmerPerms) : []);
      }
    }
  }, []);

  // Log adding helper
  const addLog = (message: string) => {
    const time = new Date().toLocaleTimeString("ar-DZ", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setActivityLogs(prev => [`[${time}] ${message}`, ...prev.slice(0, 15)]);
  };

  // Request desktop notification permissions
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // Helper to show native desktop notification
  const showDesktopNotification = (title: string, options?: NotificationOptions) => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "granted") {
        try {
          new Notification(title, options);
        } catch (e) {
          console.warn("Failed to trigger desktop notification:", e);
        }
      }
    }
  };

  // Notification Sound Generator (Web Audio API)
  const playNotificationSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;

      const playNote = (frequency: number, startTime: number, duration: number, volume: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = "sine"; 
        osc.frequency.setValueAtTime(frequency, startTime);
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.04); 
        gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration); 
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      // Premium sweet chime sequence (A5 -> C#6 -> E6)
      playNote(880, now, 0.35, 0.08);              // A5
      playNote(1108.73, now + 0.08, 0.4, 0.06);     // C#6
      playNote(1318.51, now + 0.16, 0.45, 0.04);    // E6
    } catch (error) {
      console.warn("Failed to play notification sound:", error);
    }
  };

  // Refs to track previous ids for live alerts
  const isInitialLoad = useRef(true);
  const prevTrialIds = useRef<Set<string>>(new Set());
  const prevTicketIds = useRef<Set<string>>(new Set());

  // Listen to incoming trial requests or tickets and trigger sound
  useEffect(() => {
    if (rawTrialRequests === undefined || rawSupportTickets === undefined) return;

    const currentTrialIds = new Set<string>((rawTrialRequests || []).map((o: any) => o._id));
    const currentTicketIds = new Set<string>((rawSupportTickets || []).map((t: any) => t._id));

    if (isInitialLoad.current) {
      prevTrialIds.current = currentTrialIds;
      prevTicketIds.current = currentTicketIds;
      isInitialLoad.current = false;
      return;
    }

    let hasNewTrial = false;
    let newTrialStore = "";
    for (const id of currentTrialIds) {
      if (!prevTrialIds.current.has(id)) {
        hasNewTrial = true;
        const req = rawTrialRequests.find((o: any) => o._id === id);
        if (req) {
          newTrialStore = req.storeName;
        }
        break;
      }
    }

    let hasNewTicket = false;
    let newTicketSubject = "";
    for (const id of currentTicketIds) {
      if (!prevTicketIds.current.has(id)) {
        hasNewTicket = true;
        const t = rawSupportTickets.find((o: any) => o._id === id);
        if (t) {
          newTicketSubject = t.subject;
        }
        break;
      }
    }

    if (hasNewTrial) {
      playNotificationSound();
      addLog(`🔔 تم استلام طلب تفعيل تجريبي جديد! (${newTrialStore || 'جديد'})`);
      showDesktopNotification("🔔 طلب تفعيل تجريبي جديد!", {
        body: newTrialStore ? `اسم المتجر: ${newTrialStore}` : "تم استلام طلب جديد في قائمة المراجعة.",
        icon: "/favicon.ico"
      });
    } else if (hasNewTicket) {
      playNotificationSound();
      addLog(`🔔 تم استلام تذكرة دعم فني جديدة! (${newTicketSubject || 'جديد'})`);
      showDesktopNotification("🔔 تذكرة دعم فني جديدة!", {
        body: newTicketSubject ? `الموضوع: ${newTicketSubject}` : "تم استلام تذكرة جديدة في مركز الدعم.",
        icon: "/favicon.ico"
      });
    }

    prevTrialIds.current = currentTrialIds;
    prevTicketIds.current = currentTicketIds;
  }, [rawTrialRequests, rawSupportTickets]);

  const handleVerifyPayment = (paymentId: string, amount: number) => {
    setBaridimobPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: "verified" } : p));
    setStats(prev => ({ ...prev, totalRevenue: prev.totalRevenue + amount }));
    addLog(`تم التحقق بنجاح من إيصال السداد للعملية ${paymentId} وإضافة المبلغ ${amount} دج للرصيد الفعلي.`);
  };

  const handleRejectPayment = (paymentId: string) => {
    setBaridimobPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: "rejected" } : p));
    addLog(`تم رفض إيصال السداد للعملية ${paymentId} كونه غير مطابق لبيانات CCP.`);
  };

  const handleGenerateLicenseKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!licStore.trim()) {
      alert("يرجى إدخال اسم المتجر أولاً لتوليد رخصة مخصصة.");
      return;
    }
    // Generate an authentic license key
    const cleanStore = licStore.trim().substring(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, "ALG");
    const randSfx = Math.floor(1000 + Math.random() * 9000);
    const randSfx2 = Math.floor(1000 + Math.random() * 9000);
    const key = `ALG-${cleanStore}-${licDuration === "12_months" ? "ANNUAL" : "MONTH"}-${randSfx}-${randSfx2}`;
    setGeneratedKey(key);
    addLog(`تم توليد مفتاح ترخيص مشفر جديد لصالح متجر "${licStore}".`);
  };

  // Fetch all admin data (no-op since we use Convex queries)
  const fetchData = async () => {};

  useEffect(() => {
    if (loading) return;
    
    // Recalculate stats
    const rev = trialRequests.reduce((acc: number, current: any) => {
      if (current.status !== "approved" && current.status !== "completed") return acc;
      return acc + (current.packagePrice || 0);
    }, 0);

    setStats({
      totalTrials: trialRequests.length,
      pendingTrials: trialRequests.filter((t: any) => t.status === "pending").length,
      approvedTrials: trialRequests.filter((t: any) => t.status === "approved" || t.status === "completed").length,
      totalTickets: supportTickets.length,
      openTickets: supportTickets.filter((t: any) => t.status === "open").length,
      totalRevenue: rev
    });
  }, [rawTrialRequests, rawSupportTickets, loading]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "⏳ جديد";
      case "contacted": return "📞 تم التواصل";
      case "demo_sent": return "🧪 تم ارسال النسخة التجريبية";
      case "whatsapp_sent": return "💬 تم إرسال واتساب";
      case "no_whatsapp": return "⚠️ لا يوجد واتساب";
      case "approved": return "🟢 مفعّل ونشط";
      case "completed": return "✅ تم الدفع";
      case "canceled": return "❌ ملغى";
      default: return status;
    }
  };

  const calculateStats = (trials: TrialRequest[], tickets: SupportTicket[]) => {
    const rev = trials.reduce((acc, current) => {
      if (current.status !== "approved" && current.status !== "completed") return acc;
      if (current.programType === "pc" || current.programType === "computer" || current.programType === "p_pc_only") return acc + 12000;
      if (current.programType === "mobile" || current.programType === "phone" || current.programType === "p_mobile_only") return acc + 12000;
      if (current.programType === "both" || current.programType === "combo" || current.programType === "p_both") return acc + 22000;
      if (current.programType === "annual") return acc + 20000;
      if (current.programType === "monthly") return acc + 2500;
      if (current.programType === "enterprise") return acc + 35000;
      return acc;
    }, 0);

    setStats({
      totalTrials: trials.length,
      pendingTrials: trials.filter(t => t.status === "pending").length,
      approvedTrials: trials.filter(t => t.status === "approved" || t.status === "completed").length,
      totalTickets: tickets.length,
      openTickets: tickets.filter(t => t.status === "open").length,
      totalRevenue: rev,
    });
  };

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userClean = username.trim().toLowerCase();
    
    // Check main Admin
    if (userClean === "admin" && password === "hitham") {
      localStorage.setItem("algora_admin_logged", "true");
      setUserRole("admin");
      setUserPermissions([]);
      setIsAuthenticated(true);
      setLoginError("");
      addLog("قام المشرف بتسجيل الدخول بأمان إلى لوحة التسيير الكبرى.");
      return;
    }
    
    // Check Confirmers
    if (rawConfirmers) {
      const match = rawConfirmers.find(c => c.username === userClean && c.password === password);
      if (match) {
        if (!match.isActive) {
          setLoginError("هذا الحساب معطل حالياً. يرجى مراجعة المسؤول.");
          return;
        }
        localStorage.setItem("algora_confirmer_logged", "true");
        localStorage.setItem("algora_confirmer_role", "confirmer");
        localStorage.setItem("algora_confirmer_perms", JSON.stringify(match.permissions));
        
        setUserRole("confirmer");
        setUserPermissions(match.permissions);
        setIsAuthenticated(true);
        setLoginError("");
        addLog(`قامت المؤكدة "${match.name}" بتسجيل الدخول بنجاح.`);
        return;
      }
    }
    
    setLoginError("اسم المستخدم أو كلمة المرور غير صحيحة.");
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("algora_admin_logged");
    localStorage.removeItem("algora_confirmer_logged");
    localStorage.removeItem("algora_confirmer_role");
    localStorage.removeItem("algora_confirmer_perms");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserPermissions([]);
    setUsername("");
    setPassword("");
    onLogout?.();
  };

  // Update Trial Request Status (Quick Action)
  const updateTrialStatus = async (id: any, newStatus: "pending" | "contacted" | "demo_sent" | "approved" | "completed" | "canceled" | "whatsapp_sent" | "no_whatsapp") => {
    try {
      const targetReq = trialRequests.find(r => r.id === id);
      const storeName = targetReq ? targetReq.storeName : "العميل";

      await updateOrderMutation({
        id,
        updates: { orderStatus: newStatus }
      });
      addLog(`تم تغيير حالة تفعيل متجر "${storeName}" إلى: ${getStatusLabel(newStatus)}`);
    } catch (err) {
      alert("حدث خطأ في الاتصال بقاعدة البيانات");
    }
  };

  // Update Generic Order Fields
  const updateOrderFields = async (id: any, fields: any) => {
    try {
      await updateOrderMutation({
        id,
        updates: fields
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Trial Request
  const deleteTrialRequest = async (id: any) => {
    const targetReq = trialRequests.find(r => r.id === id);
    const storeName = targetReq ? targetReq.storeName : "المتجر";
    
    if (!confirm(`هل أنت متأكد من رغبتك في حذف طلب "${storeName}" نهائياً من قاعدة البيانات؟`)) return;

    try {
      await deleteOrderMutation({ id });
      addLog(`تم حذف سجل متجر "${storeName}" بالكامل وبنجاح.`);
    } catch (err) {
      alert("حدث خطأ في الاتصال بقاعدة البيانات");
    }
  };

  // Toggle Ticket Status
  const toggleTicketStatus = async (id: any, currentStatus: "open" | "resolved") => {
    try {
      const newStatus = currentStatus === "open" ? "resolved" : "open";
      const targetTkt = supportTickets.find(t => t.id === id);
      const subject = targetTkt ? targetTkt.subject : "التذكرة";

      await updateTicketMutation({ id, status: newStatus });
      addLog(`تم تعديل تذكرة "${subject}" إلى: ${newStatus === "resolved" ? "تم حلها بنجاح ✅" : "مفتوحة ومعلّقة 🔴"}`);
    } catch (err) {
      alert("حدث خطأ في الاتصال بقاعدة البيانات");
    }
  };

  // Delete Support Ticket
  const deleteSupportTicket = async (id: any) => {
    const targetTkt = supportTickets.find(t => t.id === id);
    const subject = targetTkt ? targetTkt.subject : "تذكرة";

    if (!confirm(`هل أنت متأكد من رغبتك في حذف تذكرة الدعم الفني "${subject}"؟`)) return;

    try {
      await deleteTicketMutation({ id });
      addLog(`تم حذف تذكرة "${subject}" نهائياً.`);
    } catch (err) {
      alert("حدث خطأ في الاتصال بقاعدة البيانات");
    }
  };

  // Open Edit Modal
  const openEditModal = (req: TrialRequest) => {
    setEditingRequest(req);
    setEditStoreName(req.storeName);
    setEditOwnerName(req.ownerName);
    setEditPhone(req.phone);
    setEditPhone2(req.phone2 || "");
    setEditCity(req.city);
    setEditProgramType(req.programType || "annual");
    setEditPaymentMethod(req.paymentMethod || "baridimob");
    setEditHasWhatsapp(req.hasWhatsapp || "yes");
    setEditStatus(req.status);
  };

  // Save Edit Request Changes
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRequest) return;

    setIsUpdating(true);
    try {
      // Split city and province back
      const parts = editCity.split(" (");
      const cityOnly = parts[0];
      const provinceOnly = parts[1] ? parts[1].replace(")", "") : "";

      await updateOrderMutation({
        id: editingRequest.id as any,
        updates: {
          storeName: editStoreName,
          ownerName: editOwnerName,
          phonePrimary: editPhone,
          phoneSecondary: editPhone2,
          city: cityOnly,
          province: provinceOnly,
          packageType: editProgramType,
          paymentMethod: editPaymentMethod,
          whatsappLinked: editHasWhatsapp === "yes",
          orderStatus: editStatus,
        }
      });
      addLog(`تم تعديل وحفظ بيانات المتجر "${editStoreName}" بنجاح في قاعدة البيانات السحابية.`);
      setEditingRequest(null);
    } catch (err) {
      alert("حدث خطأ في الاتصال بقاعدة البيانات");
    } finally {
      setIsUpdating(false);
    }
  };

  // Create Random Mock Request
  const createMockRequest = async () => {
    const storeNames = [
      "ماتريكس للهواتف - Matrix Phone", "التيسير للمواد الغذائية - Alimentation", 
      "كوسميتيك النجمة - Star Cosmétique", "النصر لقطع غيار الهواتف", "كافيتيريا الياسمين - Cafétéria",
      "صيدلية الشفاء - Pharmacie", "مكتبة النور - Librairie El Nour"
    ];
    const ownerNames = ["ياسين حداد", "جمال بن عودة", "بلال بوقرة", "إسماعيل طيب", "أمين زروق", "كمال بوثلجة", "سفيان بن عمار"];
    const cities = ["الجزائر العاصمة (Alger)", "وهران (Oran)", "قسنطينة (Constantine)", "تلمسان (Tlemcen)", "سطيف (Sétif)", "بجاية (Béjaïa)", "باتنة (Batna)", "الشلف (Chlef)"];
    const programTypes = ["trial", "pc", "mobile", "both"];
    const paymentMethods = ["baridimob", "ccp", "redotpay", "cash"];

    const rStore = storeNames[Math.floor(Math.random() * storeNames.length)];
    const rOwner = ownerNames[Math.floor(Math.random() * ownerNames.length)];
    const rCityWithProvince = cities[Math.floor(Math.random() * cities.length)];
    const rProg = programTypes[Math.floor(Math.random() * programTypes.length)];
    const rPay = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const rPhone = "0" + [5, 6, 7][Math.floor(Math.random() * 3)] + Math.floor(10000000 + Math.random() * 90000000).toString().substring(0, 8);

    const parts = rCityWithProvince.split(" (");
    const cityOnly = parts[0];
    const provinceOnly = parts[1] ? parts[1].replace(")", "") : "";

    try {
      await createOrderMutation({
        storeName: rStore,
        ownerName: rOwner,
        phonePrimary: rPhone,
        phoneSecondary: "",
        city: cityOnly,
        province: provinceOnly,
        packageType: rProg,
        packagePrice: rProg === "both" ? 22000 : 12000,
        paymentMethod: rPay,
        notes: "Mock request"
      });
      addLog(`طلب جديد متطوع وصل الآن من: ${rStore} (${rCityWithProvince})`);
    } catch (err) {
      console.error(err);
    }
  };

  // Create Random Support Ticket
  const createMockTicket = async () => {
    const storeNames = ["ماتريكس للهواتف", "التيسير للمواد الغذائية", "كوسميتيك النجمة"];
    const phones = ["0550123456", "0661234567", "0772345678"];
    const subjects = ["مشكلة في إرسال الفاتورة عبر الواتساب للزبون", "استفسار حول تحديث برنامج الكود بار", "طلب دعم فني سريع لتشغيل الكاشير"];
    const messages = [
      "السلام عليكم، البرنامج يظهر لي خطأ عندما أحاول إرسال فاتورة PDF عبر الواتساب لزبائني من داخل الواجهة الرئيسية.",
      "هل تدعم نسخة الكود بار الجزائرية الحالية طباعة الملصقات الصغيرة بدقة 30*20 مم أم يجب الترقية للنسخة الاحترافية؟",
      "الرجاء المساعدة المستعجلة، لم أتمكن من ربط طابعة التذاكر والدرج المالي لتفتح بصفة آلية بعد عملية البيع."
    ];

    const idx = Math.floor(Math.random() * storeNames.length);

    try {
      await createTicketMutation({
        storeName: storeNames[idx],
        phone: phones[idx],
        subject: subjects[idx],
        message: messages[idx]
      });
      addLog(`تذكرة دعم فني جديدة من متجر: ${storeNames[idx]} - الموضوع: ${subjects[idx]}`);
    } catch (err) {
      console.error(err);
    }
  };

  // Format Algerian Dinar currency output
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("ar-DZ", { style: "currency", currency: "DZD", maximumFractionDigits: 0 })
      .format(val)
      .replace("د.ج.‏", "دج");
  };

  // Export Table Data to CSV
  const exportToCSV = () => {
    let headers = "ID,Store Name,Owner Name,Phone,Secondary Phone,City,Has Whatsapp,Program Type,Payment Method,Status,Timestamp\n";
    let rows = trialRequests.map(r => {
      return `"${r.id}","${r.storeName}","${r.ownerName}","${r.phone}","${r.phone2 || ""}","${r.city}","${r.hasWhatsapp || "no"}","${r.programType || "trial"}","${r.paymentMethod || "cash"}","${r.status}","${r.timestamp}"`;
    }).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `AlgoraPOS_Clients_List_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog("تم تصدير ملف إكسل CSV لجميع العملاء الحاليين.");
  };

  // Print Table Data
  const printTable = () => {
    window.print();
    addLog("تم إرسال أمر طباعة جدول تسيير طلبات العملاء الحاليين.");
  };

  const filteredTrials = trialRequests.filter(t => {
    const matchesSearch = 
      (t.storeName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.ownerName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.phone || "").includes(searchQuery) ||
      (t.city || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCity = cityFilter === "all" || (t.city || "").includes(cityFilter);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesProgram = programFilter === "all" || t.programType === programFilter;

    return matchesSearch && matchesCity && matchesStatus && matchesProgram;
  });

  // Filter Support Tickets
  const filteredTickets = supportTickets.filter(t => {
    const matchesSearch = 
      (t.storeName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.subject || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.phone || "").includes(searchQuery) ||
      (t.message || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get Unique Cities for Filtering
  const uniqueCities = Array.from(new Set(trialRequests.map(t => {
    return (t.city || "").split(" ")[0];
  }))).filter(Boolean);

  const sortedTrials = [...filteredTrials].sort((a, b) => {
    if (sortBy === "name_asc") return (a.storeName || "").localeCompare(b.storeName || "", "ar");
    if (sortBy === "name_desc") return (b.storeName || "").localeCompare(a.storeName || "", "ar");
    if (sortBy === "date_asc") return new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime();
    return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === "name_asc") return (a.storeName || "").localeCompare(b.storeName || "", "ar");
    if (sortBy === "name_desc") return (b.storeName || "").localeCompare(a.storeName || "", "ar");
    if (sortBy === "date_asc") return new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime();
    return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
  });

  // Authentication gate screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-20" id="admin-login-card">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#121218] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 backdrop-blur-md shadow-2xl text-right relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col items-center justify-center gap-3 mb-6 text-center">
            <div className="w-14 h-14 bg-[#7C3AED]/10 border border-[#7C3AED]/30 text-[#A855F7] rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-white">لوحة تحكم المشرف والطلبات</h2>
            <p className="text-xs text-slate-400">يرجى تسجيل الدخول للوصول إلى قاعدة بيانات العملاء</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">اسم مستخدم الإدارة:</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="اسم المستخدم"
                className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 text-right focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">كلمة مرور لوحة التحكم:</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 text-right focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 text-red-400 text-[11px] rounded-lg flex items-center gap-2 justify-end">
                <span>{loginError}</span>
                <ShieldAlert className="w-4 h-4 shrink-0" />
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#7C3AED] hover:bg-[#A855F7] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>دخول للوحة التحكم 🔐</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-slate-300 font-sans flex flex-row-reverse" id="admin-crm-workspace">
      
      {/* 1. FIXED RIGHT SIDEBAR */}
      <AdminSidebar
        activeAdminSubTab={activeAdminSubTab}
        setActiveAdminSubTab={setActiveAdminSubTab}
        stats={{
          pendingTrials: stats.pendingTrials,
          openTickets: stats.openTickets
        }}
        pendingPaymentsCount={baridimobPayments.filter(p => p.status === "pending").length}
        handleLogout={handleLogout}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        userRole={userRole}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pr-[280px] flex flex-col min-h-screen overflow-x-hidden">
        
        {/* 2. TOP HEADER */}
        <AdminHeader
          activeAdminSubTab={activeAdminSubTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          theme={theme}
          setTheme={setTheme}
        />

        {/* Content Body Container */}
        <main className="flex-1 p-6 space-y-6 flex flex-col">

          {/* 4. DYNAMIC INTERACTIVE TOOLBAR (For filters & custom sorting) */}
          {(activeAdminSubTab === "trials" || activeAdminSubTab === "tickets") && (
            <div className="bg-[#121218] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] flex flex-col md:flex-row gap-4 items-center justify-between text-right">
              
              {/* Right filters panel */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end flex-row-reverse">
                
                {/* City state filter */}
                {activeAdminSubTab === "trials" && (
                  <select
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#7C3AED] cursor-pointer"
                  >
                    <option value="all">كل الولايات 🇩🇿</option>
                    {uniqueCities.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                )}

                {/* Program bundle package filter */}
                {activeAdminSubTab === "trials" && (
                  <select
                    value={programFilter}
                    onChange={(e) => setProgramFilter(e.target.value)}
                    className="bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#7C3AED] cursor-pointer"
                  >
                    <option value="all">كل الباقات 📦</option>
                    <option value="trial">فترة تجريبية ⏳</option>
                    <option value="monthly">باقة شهرية 📅</option>
                    <option value="annual">باقة سنوية ✨</option>
                    <option value="enterprise">موزع معتمد 🏢</option>
                  </select>
                )}

                {/* Status state filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#7C3AED] cursor-pointer"
                >
                  <option value="all">كل الحالات 🔍</option>
                  {activeAdminSubTab === "trials" ? (
                    <>
                      <option value="pending">⏳ قيد الانتظار</option>
                      <option value="approved">🟢 نشط ومفعل</option>
                    </>
                  ) : (
                    <>
                      <option value="open">🔴 تذاكر مفتوحة</option>
                      <option value="resolved">✅ تذاكر محلولة</option>
                    </>
                  )}
                </select>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#7C3AED] cursor-pointer"
                >
                  <option value="date_desc">الأحدث أولاً ⏱️</option>
                  <option value="date_asc">الأقدم أولاً ⏱️</option>
                  <option value="name_asc">الاسم (أ-ي) 🔠</option>
                  <option value="name_desc">الاسم (ي-أ) 🔠</option>
                </select>

              </div>

              {/* Left actions panel */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {activeAdminSubTab === "trials" && (
                  <button
                    onClick={exportToCSV}
                    className="px-3 py-2 bg-transparent border border-[#7C3AED]/30 hover:bg-[#7C3AED]/10 text-[#A855F7] text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير إكسل</span>
                  </button>
                )}

                <button
                  onClick={printTable}
                  className="px-3 py-2 bg-transparent border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>طباعة</span>
                </button>

                {activeAdminSubTab === "trials" && (
                  <button
                    onClick={createMockRequest}
                    className="px-3.5 py-2 bg-[#7C3AED] hover:bg-[#A855F7] text-white text-xs font-black rounded-lg transition-all cursor-pointer shadow flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة طلب افتراضي</span>
                  </button>
                )}

                {activeAdminSubTab === "tickets" && (
                  <button
                    onClick={createMockTicket}
                    className="px-3.5 py-2 bg-[#7C3AED] hover:bg-[#A855F7] text-white text-xs font-black rounded-lg transition-all cursor-pointer shadow flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>توليد تذكرة دعم</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* 5. DATA VIEWER & SUBTAB RESOLVER GRID CARD */}
          <div className="bg-[#121218] border border-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-xs text-slate-500 gap-3">
                <RefreshCw className="w-8 h-8 text-[#7C3AED] animate-spin" />
                <p className="font-black text-slate-400">جاري مزامنة وجلب البيانات الحية من خوادم السحابة...</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col">
                {error && (
                  <div className="bg-amber-500/10 border-b border-amber-500/20 p-3.5 px-5 text-right flex items-center justify-between flex-row-reverse animate-pulse">
                    <span className="text-[11px] font-bold text-amber-400 leading-relaxed">{error}</span>
                    <button 
                      onClick={() => setError("")}
                      className="text-xs text-amber-500 hover:text-amber-400 font-bold bg-[#0B0B0F] px-2 py-1 rounded border border-amber-500/30 transition-all cursor-pointer"
                    >
                      إخفاء ✕
                    </button>
                  </div>
                )}
                {activeAdminSubTab === "overview" && (
                  <OverviewTab
                    trialRequests={trialRequests}
                    activityLogs={activityLogs}
                    stats={stats}
                    setActivityLogs={setActivityLogs}
                    addLog={addLog}
                    createMockRequest={createMockRequest}
                    setActiveAdminSubTab={setActiveAdminSubTab}
                    setStatusFilter={setStatusFilter}
                    exportToCSV={exportToCSV}
                  />
                )}

                {activeAdminSubTab === "trials" && (
                  <TrialsTab
                    sortedTrials={sortedTrials}
                    updateTrialStatus={updateTrialStatus}
                    openEditModal={openEditModal}
                    deleteTrialRequest={deleteTrialRequest}
                    createMockRequest={createMockRequest}
                    refreshData={fetchData}
                    updateOrderFields={updateOrderFields}
                    userPermissions={userPermissions}
                  />
                )}

                {activeAdminSubTab === "tickets" && (
                  <TicketsTab
                    sortedTickets={sortedTickets}
                    toggleTicketStatus={toggleTicketStatus}
                    deleteSupportTicket={deleteSupportTicket}
                    createMockTicket={createMockTicket}
                  />
                )}

                {activeAdminSubTab === "baridimob" && (
                  <BaridimobTab
                    baridimobPayments={baridimobPayments}
                    setBaridimobPayments={setBaridimobPayments}
                    handleVerifyPayment={handleVerifyPayment}
                    handleRejectPayment={handleRejectPayment}
                    addLog={addLog}
                  />
                )}

                {activeAdminSubTab === "whatsapp" && (
                  <WhatsappTab />
                )}

                {activeAdminSubTab === "confirmers" && (
                  <ConfirmersTab />
                )}

                {activeAdminSubTab === "logs" && (
                  <div className="p-6 space-y-4 text-right">
                    <div className="flex items-center justify-between flex-row-reverse border-b border-slate-800 pb-3">
                      <h4 className="text-sm font-black text-white">سجل العمليات الدقيقة ونشاطات النظام (Audit Trail)</h4>
                      <button 
                        onClick={() => {
                          setActivityLogs(["[نظام] تم تصفير وإعادة تعيين سجلات النشاط."]);
                        }}
                        className="px-3 py-1.5 bg-transparent border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 text-xs font-bold rounded-lg transition-all cursor-pointer"
                      >
                        مسح السجل
                      </button>
                    </div>
                    <div className="bg-[#0B0B0F] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] space-y-2 h-[450px] overflow-y-auto font-mono text-xs text-slate-400 scrollbar-thin">
                      {activityLogs.map((log, idx) => (
                        <div key={idx} className="py-1 border-b border-slate-900 pb-1.5 last:border-0 hover:text-white transition-colors">
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeAdminSubTab === "settings" && (
                  <SettingsTab
                    monthlyPrice={monthlyPrice}
                    setMonthlyPrice={setMonthlyPrice}
                    annualPrice={annualPrice}
                    setAnnualPrice={setAnnualPrice}
                    enterprisePrice={enterprisePrice}
                    setEnterprisePrice={setEnterprisePrice}
                    licStore={licStore}
                    setLicStore={setLicStore}
                    licDuration={licDuration as any}
                    setLicDuration={setLicDuration as any}
                    generatedKey={generatedKey}
                    handleGenerateLicenseKey={handleGenerateLicenseKey}
                    addLog={addLog}
                  />
                )}
              </div>
            )}
          </div>

        </main>
      </div>

      {/* 6. GIGANTIC LUXURIOUS EDITING SIDE DRAWER/PANEL */}
      <AnimatePresence>
        {editingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-0 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.5 }}
              transition={{ type: "spring", damping: 25, stiffness: 150 }}
              className="bg-[#121218] border-r border-[rgba(255,255,255,0.06)] h-full w-full max-w-lg text-right shadow-2xl relative flex flex-col"
            >
              <div className="bg-[#0B0B0F] px-6 py-5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between flex-row-reverse">
                <button
                  onClick={() => setEditingRequest(null)}
                  className="p-2 bg-[#121218] hover:bg-slate-800 text-slate-400 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 flex-row-reverse">
                  <span className="text-xs bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#A855F7] px-2.5 py-0.5 rounded font-mono font-bold">
                    ID: {editingRequest.id}
                  </span>
                  <h3 className="font-black text-white text-lg">تعديل بيانات رخصة المتجر</h3>
                </div>
              </div>

              <form onSubmit={handleSaveEdit} className="p-6 space-y-5 overflow-y-auto flex-1">
                
                {/* Store Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-300">اسم المحل التجاري بالكامل:</label>
                  <input
                    type="text"
                    required
                    value={editStoreName}
                    onChange={(e) => setEditStoreName(e.target.value)}
                    className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-xs text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED]"
                  />
                </div>

                {/* Owner Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-300">اسم صاحب المحل / المدير المسؤول:</label>
                  <input
                    type="text"
                    required
                    value={editOwnerName}
                    onChange={(e) => setEditOwnerName(e.target.value)}
                    className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-xs text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED]"
                  />
                </div>

                {/* Phones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300">رقم الهاتف الأساسي للاتصال:</label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-xs text-slate-100 font-mono text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300">الهاتف الاحتياطي (اختياري):</label>
                    <input
                      type="text"
                      value={editPhone2}
                      onChange={(e) => setEditPhone2(e.target.value)}
                      className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-xs text-slate-100 font-mono text-left focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                    />
                  </div>
                </div>

                {/* City State */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-300">الولاية والمقر الجغرافي بالجزائر:</label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-xs text-slate-100 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED]"
                  />
                </div>

                {/* Program Type, Payment, Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300">نوع الباقة الترخيصية:</label>
                    <select
                      value={editProgramType}
                      onChange={(e) => setEditProgramType(e.target.value)}
                      className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-xs text-slate-300 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
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
                      value={editPaymentMethod}
                      onChange={(e) => setEditPaymentMethod(e.target.value)}
                      className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-xs text-slate-300 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                    >
                      <option value="baridimob">بريدي موب (Baridimob)</option>
                      <option value="ccp">حساب CCP البريدي الجاري</option>
                      <option value="redotpay">بطاقة RedotPay الدولية</option>
                      <option value="cash">نقداً / وكيل معتمد يد بيد</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300">هل يملك رقم واتساب مفعل؟</label>
                    <div className="flex gap-4 justify-end mt-1.5">
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <span>لا</span>
                        <input
                          type="radio"
                          name="editHasWhatsapp"
                          checked={editHasWhatsapp === "no"}
                          onChange={() => setEditHasWhatsapp("no")}
                          className="text-[#7C3AED] focus:ring-[#7C3AED] bg-[#0B0B0F] border-slate-800"
                        />
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                        <span>نعم</span>
                        <input
                          type="radio"
                          name="editHasWhatsapp"
                          checked={editHasWhatsapp === "yes"}
                          onChange={() => setEditHasWhatsapp("yes")}
                          className="text-[#7C3AED] focus:ring-[#7C3AED] bg-[#0B0B0F] border-slate-800"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-300">حالة الحساب والتفعيل:</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-3 text-xs text-slate-300 text-right focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50"
                    >
                      <option value="pending">⏳ قيد الانتظار والمراجعة</option>
                      <option value="contacted">📞 تم التواصل مع العميل</option>
                      <option value="demo_sent">🧪 تم ارسال النسخة التجريبية</option>
                      <option value="whatsapp_sent">💬 تم إرسال واتساب</option>
                      <option value="no_whatsapp">⚠️ لا يوجد واتساب</option>
                      <option value="approved">🟢 مفعّل ونشط (تم تسليم الترخيص)</option>
                      <option value="completed">✅ مكتمل ومؤكد</option>
                      <option value="canceled">❌ ملغى أو مرفوض</option>
                    </select>
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] flex gap-3 justify-end flex-row-reverse">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-3 bg-[#7C3AED] hover:bg-[#A855F7] text-white text-xs font-black rounded-xl transition-all shadow-lg cursor-pointer disabled:opacity-50"
                  >
                    {isUpdating ? "جاري حفظ التعديل..." : "💾 حفظ كافة البيانات"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingRequest(null)}
                    className="px-5 py-3 bg-slate-850 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
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
