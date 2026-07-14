import React, { useState, useEffect } from "react";

interface SettingsTabProps {
  monthlyPrice: number;
  setMonthlyPrice: (price: number) => void;
  annualPrice: number;
  setAnnualPrice: (price: number) => void;
  enterprisePrice: number;
  setEnterprisePrice: (price: number) => void;
  licStore: string;
  setLicStore: (store: string) => void;
  licDuration: "1_month" | "12_months";
  setLicDuration: (dur: "1_month" | "12_months") => void;
  generatedKey: string;
  handleGenerateLicenseKey: (e: React.FormEvent) => void;
  addLog: (msg: string) => void;
}

export default function SettingsTab({
  monthlyPrice,
  setMonthlyPrice,
  annualPrice,
  setAnnualPrice,
  enterprisePrice,
  setEnterprisePrice,
  licStore,
  setLicStore,
  licDuration,
  setLicDuration,
  generatedKey,
  handleGenerateLicenseKey,
  addLog
}: SettingsTabProps) {
  const [apiKeyVal, setApiKeyVal] = useState("");
  const [keyStatus, setKeyStatus] = useState({ configured: false, keyLength: 0 });
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Telegram bot configuration states
  const [telegramToken, setTelegramToken] = useState("");
  const [telegramChatId, setTelegramChatId] = useState("");
  const [telegramStatus, setTelegramStatus] = useState({ configured: false, chatId: "" });
  const [isSavingTelegram, setIsSavingTelegram] = useState(false);
  const [telegramSaveMsg, setTelegramSaveMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/gemini-status")
      .then(res => res.json())
      .then(data => setKeyStatus(data))
      .catch(err => console.error(err));

    fetch("/api/admin/telegram-status")
      .then(res => res.json())
      .then(data => {
        setTelegramStatus({ configured: data.configured, chatId: data.chatId });
        if (data.configured) {
          setTelegramChatId(data.chatId);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const handleSaveTelegramConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    const tokenToSave = telegramToken.trim() || "";
    const chatIdToSave = telegramChatId.trim();

    if (!chatIdToSave) return;
    setIsSavingTelegram(true);
    setTelegramSaveMsg("");
    try {
      const res = await fetch("/api/admin/save-telegram-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botToken: tokenToSave, chatId: chatIdToSave })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTelegramSaveMsg("✅ تم ربط البوت وحفظ الإعدادات بنجاح!");
        setTelegramStatus({ configured: true, chatId: chatIdToSave });
        setTelegramToken("");
        addLog("تم تحديث إعدادات الإشعارات لبوت تيليجرام وتنشيط الإرسال التلقائي.");
      } else {
        setTelegramSaveMsg("❌ خطأ: " + (data.error || "فشل الحفظ."));
      }
    } catch (err: any) {
      setTelegramSaveMsg("❌ خطأ بالشبكة: " + err.message);
    } finally {
      setIsSavingTelegram(false);
    }
  };

  const handleSaveGeminiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyVal.trim()) return;
    setIsSavingKey(true);
    setSaveMessage("");
    try {
      const res = await fetch("/api/admin/save-gemini-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: apiKeyVal })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveMessage("✅ تم حفظ مفتاح API بنجاح وتنشيط المساعد الذكي!");
        setKeyStatus({ configured: true, keyLength: apiKeyVal.length });
        setApiKeyVal("");
        addLog("تم تحديث مفتاح Gemini API وتنشيط المساعد الذكي بنجاح.");
      } else {
        setSaveMessage("❌ خطأ: " + (data.error || "فشل الحفظ."));
      }
    } catch (err: any) {
      setSaveMessage("❌ خطأ بالشبكة: " + err.message);
    } finally {
      setIsSavingKey(false);
    }
  };
  return (
    <div className="p-6 space-y-6 text-right">
      <div>
        <h4 className="text-sm font-black text-white">التحكم في تسعيرات الرخص وتوليد مفاتيح التفعيل المشفرة</h4>
        <p className="text-[11px] text-slate-400 mt-1">اضبط الأسعار المعروضة لأصحاب المتاجر في صفحة تفعيل الطلبات أو ولد أكواد تفعيل رخص فورية يدوياً.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Price range sliders */}
        <div className="bg-[#0B0B0F] p-5 rounded-xl border border-[rgba(255,255,255,0.06)] space-y-3">
          <div className="flex justify-between text-xs font-black text-slate-300 flex-row-reverse">
            <span>الباقة الشهرية أساسية</span>
            <span className="font-mono text-[#7C3AED]">{monthlyPrice.toLocaleString()} دج</span>
          </div>
          <input
            type="range"
            min="1500"
            max="10000"
            step="500"
            value={monthlyPrice}
            onChange={(e) => {
              setMonthlyPrice(Number(e.target.value));
              addLog(`تعديل تسعيرة الباقة الشهرية إلى ${e.target.value} دج.`);
            }}
            className="w-full accent-[#7C3AED] cursor-pointer"
          />
        </div>

        <div className="bg-[#0B0B0F] p-5 rounded-xl border border-[rgba(255,255,255,0.06)] space-y-3">
          <div className="flex justify-between text-xs font-black text-slate-300 flex-row-reverse">
            <span>الباقة السنوية (الأكثر طلباً)</span>
            <span className="font-mono text-[#7C3AED]">{annualPrice.toLocaleString()} دج</span>
          </div>
          <input
            type="range"
            min="10000"
            max="50000"
            step="1000"
            value={annualPrice}
            onChange={(e) => {
              setAnnualPrice(Number(e.target.value));
              addLog(`تعديل تسعيرة الباقة السنوية إلى ${e.target.value} دج.`);
            }}
            className="w-full accent-[#7C3AED] cursor-pointer"
          />
        </div>

        <div className="bg-[#0B0B0F] p-5 rounded-xl border border-[rgba(255,255,255,0.06)] space-y-3">
          <div className="flex justify-between text-xs font-black text-slate-300 flex-row-reverse">
            <span>باقة الموزعين الكبرى</span>
            <span className="font-mono text-[#7C3AED]">{enterprisePrice.toLocaleString()} دج</span>
          </div>
          <input
            type="range"
            min="50000"
            max="200000"
            step="5000"
            value={enterprisePrice}
            onChange={(e) => {
              setEnterprisePrice(Number(e.target.value));
              addLog(`تعديل تسعيرة رخصة الموزعين الكبرى إلى ${e.target.value} دج.`);
            }}
            className="w-full accent-[#7C3AED] cursor-pointer"
          />
        </div>

      </div>

      {/* Gemini API Key Configuration Section */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <div>
          <h5 className="text-xs font-black text-white">إعداد وتنشيط المساعد الذكي (Gemini AI Client)</h5>
          <p className="text-[11px] text-slate-400 mt-1">
            اربط موقعك بمفتاح API الخاص بـ Gemini لتنشيط المساعد الذكي وخدمة الزوار وإجابة أسئلتهم في الوقت الفعلي.
          </p>
        </div>

        <form onSubmit={handleSaveGeminiKey} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-[#0B0B0F] p-5 rounded-xl border border-[rgba(255,255,255,0.06)] text-right">
          <div className="space-y-1.5 md:col-span-3">
            <label className="block text-xs font-black text-slate-300">مفتاح API الخاص بـ Gemini (Gemini API Key):</label>
            <input
              type="password"
              value={apiKeyVal}
              onChange={(e) => setApiKeyVal(e.target.value)}
              placeholder={keyStatus.configured ? `مفتاح API نشط حالياً (${keyStatus.keyLength} حرفاً) — أدخل مفتاحاً جديداً لتغييره` : "مثال: AIzaSy..."}
              className="w-full bg-[#121218] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 text-left focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSavingKey}
            className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
          >
            {isSavingKey ? "جاري الحفظ والربط..." : "حفظ وتفعيل المفتاح ⚡"}
          </button>
        </form>

        {saveMessage && (
          <p className="text-[11px] font-bold text-right mt-1 px-2">{saveMessage}</p>
        )}
      </div>

      {/* Telegram Notification Configuration Section */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <div>
          <h5 className="text-xs font-black text-white">إعداد وتنشيط إشعارات تيليجرام (Telegram Notifications Bot)</h5>
          <p className="text-[11px] text-slate-400 mt-1">
            اربط موقعك ببوت تيليجرام لتصلك إشعارات فورية مباشرة على هاتفك عند تسجيل أي طلب تجربة مجانية جديد.
          </p>
        </div>

        <form onSubmit={handleSaveTelegramConfig} className="space-y-4 bg-[#0B0B0F] p-5 rounded-xl border border-[rgba(255,255,255,0.06)] text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-300">رمز توكن البوت (Bot Token):</label>
              <input
                type="password"
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                placeholder={telegramStatus.configured ? `البوت مفعل حالياً — أدخل توكن جديداً لتغييره` : "أدخل الرمز المميز للبوت (Token)"}
                className="w-full bg-[#121218] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 text-left focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                required={!telegramStatus.configured}
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-black text-slate-300">معرّف الدردشة المستلمة (Chat ID):</label>
              <input
                type="text"
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                placeholder={telegramStatus.configured ? `الدردشة الحالية: ${telegramStatus.chatId}` : "أدخل معرف الدردشة أو رقم المجموعة (Chat ID)"}
                className="w-full bg-[#121218] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 text-right focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center flex-row-reverse">
            <button
              type="submit"
              disabled={isSavingTelegram}
              className="py-2.5 px-6 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl shadow transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              {isSavingTelegram ? "جاري الحفظ والربط..." : "حفظ وربط البوت 🚀"}
            </button>
            
            {telegramSaveMsg && (
              <p className={`text-[11px] font-bold ${telegramSaveMsg.includes("❌") ? "text-rose-500" : "text-emerald-500"}`}>{telegramSaveMsg}</p>
            )}
          </div>
        </form>
      </div>

      {/* Generator Section */}
      <div className="pt-6 border-t border-slate-800 space-y-4">
        <h5 className="text-xs font-black text-white">توليد أكواد التفعيل المشفرة الفورية (Activation Keys)</h5>
        
        <form onSubmit={handleGenerateLicenseKey} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-[#0B0B0F] p-5 rounded-xl border border-[rgba(255,255,255,0.06)] text-right">
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-black text-slate-300">اسم المتجر بالكامل:</label>
            <input
              type="text"
              required
              value={licStore}
              onChange={(e) => setLicStore(e.target.value)}
              placeholder="مثال: صيانة ميكرو وهران"
              className="w-full bg-[#121218] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 text-right focus:outline-none focus:ring-1 focus:ring-[#7C3AED]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-black text-slate-300">الترخيص المطلوب:</label>
            <select
              value={licDuration}
              onChange={(e) => setLicDuration(e.target.value as any)}
              className="w-full bg-[#121218] border border-[rgba(255,255,255,0.06)] rounded-xl px-4 py-2.5 text-xs text-slate-300 text-right focus:outline-none focus:ring-1 focus:ring-[#7C3AED] cursor-pointer"
            >
              <option value="12_months">سنة كاملة (12 شهراً)</option>
              <option value="1_month">شهر واحد (30 يوماً)</option>
            </select>
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 bg-[#7C3AED] hover:bg-[#A855F7] text-white font-black text-xs rounded-xl shadow transition-all cursor-pointer text-center"
          >
            توليد المفتاح المشفر 🔑
          </button>
        </form>

        {generatedKey && (
          <div className="p-4 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4 animate-pulse flex-row-reverse">
            <div className="text-right">
              <p className="text-[10px] text-[#A855F7] font-bold">مفتاح الترخيص الرقمي المولد للنسخ والتسليم:</p>
              <p className="text-sm font-mono text-white mt-1 select-all font-bold tracking-wider">{generatedKey}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(generatedKey);
                alert("تم نسخ الكود المولد بنجاح!");
              }}
              className="px-4 py-2 bg-[#7C3AED] hover:bg-[#A855F7] text-white font-black text-xs rounded-lg transition-all cursor-pointer shadow-md"
            >
              نسخ كود التفعيل 📋
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
