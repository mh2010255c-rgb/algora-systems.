import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Settings, MessageSquare, History, CheckCircle, AlertTriangle, 
  Send, RefreshCw, Play, Edit, Trash2, Check, X, Shield, Lock, BellRing, Copy
} from "lucide-react";

interface WhatsappSettings {
  enabled: boolean;
  provider: "meta" | "twilio" | "ultramsg" | "custom";
  apiUrl: string;
  accessToken: string;
  phoneNumberId: string;
  businessAccountId: string;
  webhookSecret: string;
  templateName: string;
  retryAttempts: number;
  retryDelay: number;
  queueSize: number;
  businessNumber: string;
}

interface WhatsappTemplate {
  id: string;
  name: string;
  description: string;
  language: string;
  message: string;
  enabled: boolean;
}

interface WhatsappLog {
  id: string;
  messageId: string;
  orderId: string;
  customerName: string;
  phone: string;
  provider: string;
  template: string;
  status: "Sent" | "Delivered" | "Read" | "Failed";
  createdAt: string;
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  retryCount: number;
  errorMessage?: string;
}

export default function WhatsappTab() {
  const [activeSubSection, setActiveSubSection] = useState<"stats" | "settings" | "templates" | "logs" | "connection">("connection");
  
  // Connection State
  const [connectionStatus, setConnectionStatus] = useState<"Connected" | "Disconnected" | "Connecting" | "Authentication Failed" | "QR Expired" | "Reconnecting">("Disconnected");
  const [qrCode, setQrCode] = useState("");
  const [connectionErr, setConnectionErr] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [connectedName, setConnectedName] = useState("");
  const [connectedPhone, setConnectedPhone] = useState("");
  const [lastConnectedAt, setLastConnectedAt] = useState("");

  // Settings State
  const [settings, setSettings] = useState<WhatsappSettings>({
    enabled: false,
    provider: "ultramsg",
    apiUrl: "",
    accessToken: "",
    phoneNumberId: "",
    businessAccountId: "",
    webhookSecret: "",
    templateName: "",
    retryAttempts: 3,
    retryDelay: 60,
    queueSize: 100,
    businessNumber: ""
  });

  // Templates State
  const [templates, setTemplates] = useState<WhatsappTemplate[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<WhatsappTemplate | null>(null);
  const [templateMessageInput, setTemplateMessageInput] = useState("");

  // Logs State
  const [logs, setLogs] = useState<WhatsappLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingSettings, setSubmittingSettings] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Test connection state
  const [testPhone, setTestPhone] = useState("");
  const [testingConnection, setTestingConnection] = useState(false);

  // WhatsApp Web connection polling
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch("/api/admin/whatsapp/connection-status");
        if (res.ok) {
          const data = await res.json();
          setConnectionStatus(data.status);
          setQrCode(data.qr);
          setConnectionErr(data.error);
          setConnectedName(data.name || "");
          setConnectedPhone(data.phone || "");
          setLastConnectedAt(data.lastConnected || "");
        }
      } catch (err) {
        console.error("Connection check failed:", err);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch all parameters
  const fetchData = async () => {
    setLoading(true);
    try {
      const [settRes, tempRes, logsRes] = await Promise.all([
        fetch("/api/admin/whatsapp/settings"),
        fetch("/api/admin/whatsapp/templates"),
        fetch("/api/admin/whatsapp/logs")
      ]);

      if (settRes.ok) {
        const sData = await settRes.json();
        setSettings(sData);
      }
      if (tempRes.ok) {
        const tData = await tempRes.json();
        setTemplates(tData);
      }
      if (logsRes.ok) {
        const lData = await logsRes.json();
        setLogs(lData);
      }
    } catch (e) {
      console.error("Failed to load WhatsApp data:", e);
      triggerToast("خطأ أثناء الاتصال بالخادم وتحميل الإعدادات.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSettings(true);
    try {
      const res = await fetch("/api/admin/whatsapp/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast("تم حفظ إعدادات الواتساب بنجاح!");
      } else {
        triggerToast(data.error || "فشل حفظ الإعدادات.", "error");
      }
    } catch (err) {
      triggerToast("خطأ بالشبكة.", "error");
    } finally {
      setSubmittingSettings(false);
    }
  };

  // Test Connection
  const handleTestConnection = async () => {
    if (!testPhone) {
      triggerToast("يرجى إدخال رقم هاتف لتجربة الإرسال.", "error");
      return;
    }
    setTestingConnection(true);
    try {
      const res = await fetch("/api/admin/whatsapp/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          testPhone
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast("تم إرسال رسالة الاختبار بنجاح 🟢");
      } else {
        triggerToast(data.error || "فشل الاختبار، راجع تفاصيل الاتصال.", "error");
      }
    } catch (err) {
      triggerToast("خطأ في الاتصال بالخادم.", "error");
    } finally {
      setTestingConnection(false);
    }
  };

  // Edit Template trigger
  const handleStartEditTemplate = (t: WhatsappTemplate) => {
    setEditingTemplate(t);
    setTemplateMessageInput(t.message);
  };

  // Save Template changes
  const handleSaveTemplate = async () => {
    if (!editingTemplate) return;
    try {
      const res = await fetch(`/api/admin/whatsapp/templates/${editingTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: templateMessageInput, enabled: editingTemplate.enabled })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast("تم تحديث القالب وتطبيقه بنجاح 🎯");
        setEditingTemplate(null);
        fetchData();
      } else {
        triggerToast(data.error || "فشل التحديث.", "error");
      }
    } catch (err) {
      triggerToast("خطأ في الشبكة.", "error");
    }
  };

  // Resend log message
  const handleResendLog = async (logId: string) => {
    try {
      const res = await fetch(`/api/admin/whatsapp/resend/${logId}`, {
        method: "POST"
      });
      const data = await res.json();
      if (res.ok && data.success) {
        triggerToast("تمت إعادة جدولة الإرسال بنجاح 🚀");
        fetchData();
      } else {
        triggerToast(data.error || "فشل إعادة الإرسال.", "error");
      }
    } catch (err) {
      triggerToast("خطأ بالشبكة.", "error");
    }
  };

  // Compute Statistics
  const stats = React.useMemo(() => {
    const total = logs.length;
    const sent = logs.filter(l => l.status === "Sent" || l.status === "Delivered" || l.status === "Read").length;
    const failed = logs.filter(l => l.status === "Failed").length;
    
    // Today's stats
    const startOfToday = new Date();
    startOfToday.setHours(0,0,0,0);
    const todayLogs = logs.filter(l => new Date(l.sentAt || l.createdAt) >= startOfToday);
    const todayCount = todayLogs.length;

    const successRate = total > 0 ? Math.round((sent / total) * 100) : 100;
    const lastErrorLog = logs.find(l => l.status === "Failed" && l.errorMessage);
    const lastMsgLog = logs[0];

    return {
      total,
      sent,
      failed,
      todayCount,
      successRate,
      lastError: lastErrorLog ? lastErrorLog.errorMessage : "لا توجد أخطاء حالية",
      lastMessageTime: lastMsgLog ? new Date(lastMsgLog.sentAt || lastMsgLog.createdAt).toLocaleTimeString("ar-DZ") : "لا توجد رسائل"
    };
  }, [logs]);

  // Template Variables badges helper
  const templateVars = [
    { code: "{{customerName}}", desc: "اسم المالك" },
    { code: "{{storeName}}", desc: "اسم المحل" },
    { code: "{{orderNumber}}", desc: "رقم الطلب" },
    { code: "{{package}}", desc: "الباقة المختارة" },
    { code: "{{price}}", desc: "مبلغ الاشتراك" },
    { code: "{{licenseKey}}", desc: "رخصة التفعيل" },
    { code: "{{phone}}", desc: "رقم الهاتف" },
    { code: "{{today}}", desc: "تاريخ اليوم" }
  ];

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 text-right">
      
      {/* Toast Alert */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border font-black text-xs ${
              toast.type === "success" 
                ? "bg-emerald-950/90 border-emerald-500/30 text-emerald-400" 
                : "bg-rose-950/90 border-rose-500/30 text-rose-400"
            }`}
          >
            {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. Header & Section Selector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2 flex-row-reverse">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></span>
            <span>نظام إرسال رسائل الواتساب التلقائي (WhatsApp Automation)</span>
          </h2>
          <p className="text-slate-400 text-[11px] mt-1">تسيير الحملات الترحيبية وتفعيل الاشتراكات عبر WhatsApp Business API والمزودين السحابيين.</p>
        </div>

        {/* Section Tabs Selector */}
        <div className="flex items-center gap-1.5 bg-[#0B0B12] p-1.5 rounded-xl border border-white/5">
          <button 
            onClick={() => setActiveSubSection("logs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${activeSubSection === "logs" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            السجلات والعمليات
          </button>
          <button 
            onClick={() => setActiveSubSection("templates")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${activeSubSection === "templates" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            قوالب الرسائل
          </button>
          <button 
            onClick={() => setActiveSubSection("settings")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${activeSubSection === "settings" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            الإعدادات والمزودين
          </button>
          <button 
            onClick={() => setActiveSubSection("stats")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${activeSubSection === "stats" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            لوحة الإحصائيات
          </button>
          <button 
            onClick={() => setActiveSubSection("connection")}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${activeSubSection === "connection" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            <span className={`w-2 h-2 rounded-full ${connectionStatus === "Connected" ? "bg-emerald-500 animate-pulse" : connectionStatus === "Connecting" ? "bg-amber-500 animate-pulse" : "bg-rose-500"}`}></span>
            <span>WhatsApp Connection</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500 text-xs gap-3">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
          <span>جاري الاتصال بـ Firestore وتحميل بيانات الأتمتة...</span>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* A. STATS VIEW */}
          {activeSubSection === "stats" && (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
              
              <div className="bg-[#14141D] border border-white/5 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-[10px] text-slate-500 font-bold font-mono">Sent / Delivered</span>
                </div>
                <p className="text-2xl font-black text-white font-mono">{stats.sent}</p>
                <p className="text-[10px] text-slate-400">إجمالي الرسائل المرسلة بنجاح</p>
              </div>

              <div className="bg-[#14141D] border border-white/5 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                  <span className="text-[10px] text-slate-500 font-bold font-mono">Failed</span>
                </div>
                <p className="text-2xl font-black text-white font-mono">{stats.failed}</p>
                <p className="text-[10px] text-slate-400">الرسائل الفاشلة (تجاوزت المحاولات)</p>
              </div>

              <div className="bg-[#14141D] border border-white/5 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <span className="text-[10px] text-slate-500 font-bold font-mono">Today</span>
                </div>
                <p className="text-2xl font-black text-white font-mono">{stats.todayCount}</p>
                <p className="text-[10px] text-slate-400">رسائل تم معالجتها اليوم</p>
              </div>

              <div className="bg-[#14141D] border border-white/5 p-5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <Play className="w-5 h-5 text-indigo-400" />
                  <span className="text-[10px] text-slate-500 font-bold font-mono">Success Rate</span>
                </div>
                <p className="text-2xl font-black text-white font-mono">{stats.successRate}%</p>
                <p className="text-[10px] text-slate-400">معدل نجاح تسليم الرسائل</p>
              </div>

              {/* Logger boxes */}
              <div className="md:col-span-3 xl:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="bg-[#14141D] border border-white/5 p-5 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black text-white">آخر رسالة تم إرسالها</h4>
                  <div className="bg-[#0B0B12] p-3 rounded-xl border border-white/5 text-xs text-slate-300 min-h-[60px] flex items-center justify-end font-mono">
                    {logs.length > 0 ? (
                      <div className="w-full space-y-1">
                        <div className="flex justify-between flex-row-reverse text-slate-400 text-[10px]">
                          <span>المستلم: {logs[0].customerName}</span>
                          <span>الوقت: {stats.lastMessageTime}</span>
                        </div>
                        <p className="truncate text-right">{logs[0].phone}</p>
                      </div>
                    ) : "لا توجد سجلات بعد"}
                  </div>
                </div>

                <div className="bg-[#14141D] border border-white/5 p-5 rounded-2xl space-y-2">
                  <h4 className="text-xs font-black text-rose-400">آخر خطأ تم تسجيله من المزود</h4>
                  <div className="bg-[#0B0B12] p-3 rounded-xl border border-rose-500/10 text-xs text-rose-300 min-h-[60px] flex items-center justify-end font-mono text-right">
                    {stats.lastError}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* B. SETTINGS & SENDER DRIVERS CONFIG */}
          {activeSubSection === "settings" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              {/* Settings Form */}
              <form onSubmit={handleSaveSettings} className="xl:col-span-8 bg-[#14141D] border border-white/5 rounded-2xl p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-sm font-black text-white">إعدادات الاتصال والمزودين (WhatsApp Settings)</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold">حالة الإرسال التلقائي:</span>
                    <button
                      type="button"
                      onClick={() => setSettings(prev => ({ ...prev, enabled: !prev.enabled }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${settings.enabled ? "bg-purple-600" : "bg-slate-800"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enabled ? "-translate-x-1" : "-translate-x-6"}`} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* API Provider Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">مزود خدمة الواتساب (Provider)</label>
                    <select
                      value={settings.provider}
                      onChange={(e) => setSettings(prev => ({ ...prev, provider: e.target.value as any }))}
                      className="w-full bg-[#0B0B12] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="ultramsg">UltraMsg API (الأسهل والأسرع)</option>
                      <option value="meta">Meta WhatsApp Cloud API (الرسمي)</option>
                      <option value="twilio">Twilio WhatsApp Driver</option>
                      <option value="custom">بوابة HTTP مخصصة (Custom POST Webhook)</option>
                    </select>
                  </div>

                  {/* API Base URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">رابط واجهة برمجة التطبيقات (API URL)</label>
                    <input
                      type="text"
                      value={settings.apiUrl}
                      onChange={(e) => setSettings(prev => ({ ...prev, apiUrl: e.target.value }))}
                      placeholder="https://api.ultramsg.com/..."
                      className="w-full bg-[#0B0B12] border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Access Token */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">مفتاح الوصول السري (Access Token / API Key)</label>
                    <input
                      type="password"
                      value={settings.accessToken}
                      onChange={(e) => setSettings(prev => ({ ...prev, accessToken: e.target.value }))}
                      placeholder="أدخل الـ Token السري هنا..."
                      className="w-full bg-[#0B0B12] border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Phone Number ID */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">معرف الهاتف / رقم الجلسة (Phone Number ID / Instance ID)</label>
                    <input
                      type="text"
                      value={settings.phoneNumberId}
                      onChange={(e) => setSettings(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                      placeholder="مثال: instance9938"
                      className="w-full bg-[#0B0B12] border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Twilio From Number / Business Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">رقم الإرسال المسجل (Sender Number / twilio From)</label>
                    <input
                      type="text"
                      value={settings.businessNumber}
                      onChange={(e) => setSettings(prev => ({ ...prev, businessNumber: e.target.value }))}
                      placeholder="+14155238886"
                      className="w-full bg-[#0B0B12] border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Business Account ID / Webhook Secret */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">سرية الويب هوك (Webhook Verify Token / Secret)</label>
                    <input
                      type="text"
                      value={settings.webhookSecret}
                      onChange={(e) => setSettings(prev => ({ ...prev, webhookSecret: e.target.value }))}
                      placeholder="Verify Token"
                      className="w-full bg-[#0B0B12] border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  {/* Queue Size & Retry Attempts */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">أقصى محاولات إعادة الإرسال عند الفشل (Retry Attempts)</label>
                    <input
                      type="number"
                      value={settings.retryAttempts}
                      onChange={(e) => setSettings(prev => ({ ...prev, retryAttempts: Number(e.target.value) }))}
                      className="w-full bg-[#0B0B12] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">حجم طابور الرسائل (Queue Buffer Size)</label>
                    <input
                      type="number"
                      value={settings.queueSize}
                      onChange={(e) => setSettings(prev => ({ ...prev, queueSize: Number(e.target.value) }))}
                      className="w-full bg-[#0B0B12] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                    />
                  </div>

                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={submittingSettings}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-purple-900/20"
                  >
                    <Settings className="w-4 h-4" />
                    <span>حفظ إعدادات الاتصال الحالية</span>
                  </button>
                </div>
              </form>

              {/* Connection Tester */}
              <div className="xl:col-span-4 bg-[#14141D] border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-1.5 flex-row-reverse">
                  <Send className="w-4 h-4 text-purple-400" />
                  <span>فحص الاتصال (Test Connection)</span>
                </h3>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  أدخل رقم هاتفك الكامل مع رمز الدولة (مثال: +213553361047) لإرسال رسالة اختبارية برمجية فورية عبر الإعدادات النشطة أعلاه.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-300">رقم هاتف الاختبار</label>
                    <input
                      type="text"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                      placeholder="0553361047"
                      className="w-full bg-[#0B0B12] border border-white/5 rounded-xl px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono text-left"
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
                  >
                    {testingConnection ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                    <span>إرسال رسالة اختبار (WhatsApp)</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* C. TEMPLATE MANAGER */}
          {activeSubSection === "templates" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              {/* List of events templates */}
              <div className="xl:col-span-5 space-y-4">
                <h3 className="text-xs font-black text-slate-400 px-1">قوالب الأحداث التلقائية (Event Templates)</h3>
                
                <div className="space-y-3">
                  {templates.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleStartEditTemplate(t)}
                      className={`w-full text-right p-4 rounded-2xl border transition-all cursor-pointer block ${
                        editingTemplate?.id === t.id 
                          ? "bg-purple-600/10 border-purple-500/30 shadow-lg shadow-purple-900/5" 
                          : "bg-[#14141D] border-white/5 hover:border-purple-500/20"
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${t.enabled ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-500 border border-white/5"}`}>
                          {t.enabled ? "نشط" : "معطل"}
                        </span>
                        <h4 className="text-xs font-black text-white">{t.name}</h4>
                      </div>
                      <p className="text-[10px] text-slate-400 mb-2 truncate">{t.description}</p>
                      <div className="bg-[#0B0B12] p-2.5 rounded-xl border border-white/5 text-[10px] text-slate-400 font-mono line-clamp-2 leading-relaxed">
                        {t.message}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Workspace */}
              <div className="xl:col-span-7 bg-[#14141D] border border-white/5 rounded-2xl p-6 space-y-4">
                {editingTemplate ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-bold">تنشيط القالب:</span>
                        <button
                          type="button"
                          onClick={() => setEditingTemplate(prev => prev ? ({ ...prev, enabled: !prev.enabled }) : null)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${editingTemplate.enabled ? "bg-emerald-600" : "bg-slate-800"}`}
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${editingTemplate.enabled ? "-translate-x-0.5" : "-translate-x-5"}`} />
                        </button>
                      </div>
                      <h3 className="text-sm font-black text-white">تعديل قالب: {editingTemplate.name}</h3>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">محتوى رسالة الواتساب</label>
                      <textarea
                        value={templateMessageInput}
                        onChange={(e) => setTemplateMessageInput(e.target.value)}
                        rows={8}
                        className="w-full bg-[#0B0B12] border border-white/5 rounded-xl p-4 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed font-mono text-right"
                      />
                    </div>

                    {/* Helper variables */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-slate-400">انقر لنسخ المتغيرات المتاحة وإدراجها في نص الرسالة:</p>
                      <div className="flex flex-wrap gap-1.5 justify-end">
                        {templateVars.map(v => (
                          <button
                            key={v.code}
                            type="button"
                            onClick={() => {
                              setTemplateMessageInput(prev => prev + " " + v.code);
                              triggerToast(`تم إدراج المتغير ${v.code} 🎯`);
                            }}
                            className="px-2 py-1 bg-[#0B0B12] hover:bg-[#1A1A26] border border-white/5 rounded-lg text-[9px] text-[#A855F7] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                          >
                            <span>{v.desc}</span>
                            <span className="text-[8px] text-slate-500 font-normal">({v.code})</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-3 gap-2">
                      <button
                        type="button"
                        onClick={handleSaveTemplate}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                      >
                        <Check className="w-4 h-4" />
                        <span>حفظ وتطبيق القالب</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTemplate(null)}
                        className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center text-slate-500 text-xs flex flex-col items-center justify-center gap-3">
                    <MessageSquare className="w-12 h-12 text-slate-700" />
                    <p>اختر قالباً من القائمة الجانبية لتعديل محتواه وإعادة صياغته.</p>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* D. LOGS & OPERATIONS HISTORY */}
          {activeSubSection === "logs" && (
            <div className="bg-[#14141D] border border-white/5 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              
              <div className="p-5 border-b border-white/5 flex items-center justify-between flex-row-reverse bg-[#0B0B12]/50">
                <span className="text-[10px] text-slate-500 font-mono font-bold">إجمالي السجلات: {logs.length} عمليات إرسال</span>
                <h3 className="text-sm font-black text-white">سجل إرسال وتتبع الرسائل التلقائية (WhatsApp Logs)</h3>
              </div>

              <div className="overflow-x-auto w-full max-h-[500px]">
                <table className="w-full text-right text-xs border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-[#0B0B12] border-b border-white/5 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                      <th className="px-5 py-4 text-right">العميل والمحل</th>
                      <th className="px-5 py-4 text-right">رقم الهاتف</th>
                      <th className="px-5 py-4 text-right">الحدث / القالب</th>
                      <th className="px-5 py-4 text-right">المزود</th>
                      <th className="px-5 py-4 text-center">الحالة</th>
                      <th className="px-5 py-4 text-right">تاريخ المعالجة</th>
                      <th className="px-5 py-4 text-left">الإجراء السريع</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-20 text-center text-slate-500 font-bold text-xs space-y-2">
                          <History className="w-10 h-10 mx-auto text-slate-700" />
                          <p>لا توجد رسائل واتساب مرسلة في السجلات حتى الآن.</p>
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => {
                        const isFailed = log.status === "Failed";
                        return (
                          <tr key={log.id} className="hover:bg-[#1C1C26]/30 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="space-y-0.5">
                                <p className="font-black text-white">{log.customerName}</p>
                                <p className="text-[9px] text-slate-500">ID: {log.messageId || "N/A"}</p>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-mono text-slate-300">{log.phone}</td>
                            <td className="px-5 py-3.5">
                              <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[9px] text-purple-300 font-bold">
                                {log.template}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-slate-400 font-mono capitalize">{log.provider}</td>
                            <td className="px-5 py-3.5 text-center">
                              {log.status === "Read" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] bg-blue-500/10 border border-blue-500/20 text-blue-300 font-bold">
                                  <span>تمت القراءة</span>
                                </span>
                              ) : log.status === "Delivered" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold">
                                  <span>تم التسليم</span>
                                </span>
                              ) : log.status === "Sent" ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold">
                                  <span>تم الإرسال</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold" title={log.errorMessage}>
                                  <span>فشل</span>
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 font-mono text-slate-400 text-[10px]">
                              <div>{new Date(log.sentAt || log.createdAt).toLocaleDateString("ar-DZ")}</div>
                              <div className="text-[9px] text-slate-500 mt-0.5">{new Date(log.sentAt || log.createdAt).toLocaleTimeString("ar-DZ")}</div>
                            </td>
                            <td className="px-5 py-3.5 text-left">
                              <div className="flex items-center gap-1.5 justify-end">
                                {isFailed ? (
                                  <button
                                    onClick={() => handleResendLog(log.id)}
                                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-lg text-[9px] font-black cursor-pointer transition-all active:scale-95"
                                  >
                                    إعادة إرسال 🚀
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-slate-600 font-bold pr-2">تَم الإرسال</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {activeSubSection === "connection" && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              
              <div className="xl:col-span-8 bg-[#14141D] border border-white/5 rounded-2xl p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <h3 className="text-sm font-black text-white">إعداد جلسة الاتصال عبر متصفح واتساب (WhatsApp Web Session)</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-bold">حالة الجلسة:</span>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black border uppercase tracking-wider ${
                      connectionStatus === "Connected" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                      connectionStatus === "Connecting" || connectionStatus === "Reconnecting" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                      "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    }`}>
                      {connectionStatus}
                    </span>
                  </div>
                </div>

                {/* Account Details & Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#0B0B12] p-4 rounded-xl border border-white/5 text-right space-y-1">
                    <span className="text-[10px] text-slate-500 block">اسم الحساب المتصل</span>
                    <span className="text-xs font-black text-white">{connectedName || "غير متصل"}</span>
                  </div>
                  <div className="bg-[#0B0B12] p-4 rounded-xl border border-white/5 text-right space-y-1">
                    <span className="text-[10px] text-slate-500 block">رقم الهاتف المتصل</span>
                    <span className="text-xs font-black font-mono text-white" dir="ltr">{connectedPhone || "N/A"}</span>
                  </div>
                  <div className="bg-[#0B0B12] p-4 rounded-xl border border-white/5 text-right space-y-1">
                    <span className="text-[10px] text-slate-500 block">وقت آخر اتصال</span>
                    <span className="text-xs font-black text-white">
                      {lastConnectedAt ? new Date(lastConnectedAt).toLocaleString("ar-DZ") : "لم يتصل بعد"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-8 bg-[#0B0B12] rounded-2xl border border-white/5 text-center min-h-[300px]">
                  {connectionStatus === "Connected" ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white">تم تفعيل الاتصال برقمك الشخصي بنجاح 🟢</h4>
                        <p className="text-slate-400 text-xs mt-1">النظام يرسل الإشعارات الترحيبية وتراخيص التفعيل آلياً من رقمك الآن.</p>
                      </div>

                      <div className="flex justify-center gap-2 pt-2">
                        <button
                          onClick={async () => {
                            setConnecting(true);
                            try {
                              const res = await fetch("/api/admin/whatsapp/connect-session", { method: "POST" });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                triggerToast("تم إرسال طلب إعادة الاتصال.");
                              }
                            } catch (e) {}
                            setConnecting(false);
                          }}
                          disabled={connecting}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95"
                        >
                          إعادة الاتصال (Reconnect)
                        </button>
                        
                        <button
                          onClick={async () => {
                            setConnecting(true);
                            try {
                              const res = await fetch("/api/admin/whatsapp/disconnect-session", { method: "POST" });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                triggerToast("تم تسجيل الخروج وقطع الجلسة بنجاح.");
                              } else {
                                triggerToast(data.error || "فشل تسجيل الخروج.", "error");
                              }
                            } catch (e) {
                              triggerToast("خطأ بالشبكة.", "error");
                            } finally {
                              setConnecting(false);
                            }
                          }}
                          disabled={connecting}
                          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95"
                        >
                          تسجيل الخروج (Logout)
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 w-full max-w-sm">
                      {qrCode ? (
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-white">امسح رمز الاستجابة السريع (QR Code) لتسجيل الدخول:</h4>
                          <div className="bg-white p-4 rounded-2xl w-56 h-56 mx-auto flex items-center justify-center shadow-lg border border-white/10">
                            <img src={qrCode} alt="WhatsApp Web QR Code" className="w-full h-full object-contain" />
                          </div>
                          <p className="text-[10px] text-slate-400">افتح واتساب على هاتفك &gt; الأجهزة المرتبطة &gt; ربط جهاز &gt; ثم وجه الكاميرا نحو الشاشة.</p>
                        </div>
                      ) : (
                        <div className="space-y-4 py-8">
                          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto animate-reverse" />
                          <p className="text-xs text-slate-500 font-bold">بانتظار توليد الـ QR Code من جلسة WhatsApp Web...</p>
                        </div>
                      )}

                      <div className="flex justify-center gap-3">
                        <button
                          onClick={async () => {
                            setConnecting(true);
                            try {
                              const res = await fetch("/api/admin/whatsapp/connect-session", { method: "POST" });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                triggerToast("تم إرسال طلب تفعيل الجلسة.");
                              } else {
                                triggerToast(data.error || "فشل تفعيل الجلسة.", "error");
                              }
                            } catch (e) {
                              triggerToast("خطأ بالاتصال.", "error");
                            } finally {
                              setConnecting(false);
                            }
                          }}
                          disabled={connecting || connectionStatus === "Connecting" || connectionStatus === "Reconnecting"}
                          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95"
                        >
                          ربط واتساب جديد (Connect)
                        </button>

                        <button
                          onClick={async () => {
                            setConnecting(true);
                            try {
                              const res = await fetch("/api/admin/whatsapp/disconnect-session", { method: "POST" });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                triggerToast("تمت إعادة تصفير الجلسة بنجاح.");
                              }
                            } catch (e) {}
                            setConnecting(false);
                          }}
                          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-black cursor-pointer transition-all active:scale-95"
                        >
                          تصفير الجلسة (Reset)
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {connectionErr && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-bold leading-relaxed text-right">
                    ⚠️ خطأ الجلسة: {connectionErr}
                  </div>
                )}
              </div>

              {/* Session Guide Panel */}
              <div className="xl:col-span-4 bg-[#14141D] border border-white/5 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-1.5 flex-row-reverse">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>دليل الأمان والمزامنة</span>
                </h3>
                <ul className="text-slate-400 text-[11px] leading-relaxed list-disc list-inside space-y-2.5 pr-2">
                  <li>يتم تخزين بيانات الجلسة وسجلات الاتصال والـ cache تشفيرياً ومحلياً لضمان عدم اضطرارك لمسح الكود عند كل تشغيل للخادم.</li>
                  <li>في حال قطع الاتصال أو فصل الإنترنت عن هاتفك، سيقوم النظام تلقائياً بجدولة محاولات إعادة الاتصال بالخلفية كل 10 ثوانٍ.</li>
                  <li>تجنب تشغيل جلسات WhatsApp Web متعددة لنفس الرقم على متصفحات أخرى لتجنب تضارب التوثيق ومقاطعة الجلسة.</li>
                </ul>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
