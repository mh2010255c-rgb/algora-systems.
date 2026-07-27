import React from "react";
import { motion } from "motion/react";
import { 
  Monitor, Smartphone, Download, CheckCircle2, QrCode, 
  ShieldCheck, WifiOff, Zap, Lock
} from "lucide-react";

export default function DownloadCenter() {
  return (
    <div className="min-h-screen bg-[#060813] text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-purple-300 antialiased" dir="rtl">
      
      {/* HEADER SECTION */}
      <div className="pt-20 pb-12 px-4 flex flex-col items-center justify-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>تم تشفير الوصول بنجاح</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          <span className="text-white">مركز </span>
          <span className="bg-gradient-to-l from-pink-500 to-purple-500 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">التحميل</span>
        </h1>
        
        <p className="text-slate-400 max-w-lg text-sm leading-relaxed">
          اختر النسخة المناسبة لجهازك. ننصح بتثبيت نسخة الكمبيوتر أولاً لإعداد النظام، ثم ربط تطبيق الهاتف.
        </p>
      </div>

      {/* CARDS SECTION */}
      <div className="max-w-5xl mx-auto w-full px-4 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 pb-20">
        
        {/* Glow effect behind cards */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-purple-600/20 blur-[100px] -z-10 rounded-full pointer-events-none"></div>

        {/* PC CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#111327] border border-blue-900/10 rounded-3xl p-8 relative overflow-hidden flex flex-col shadow-2xl hover:border-blue-500/30 transition-all group"
        >
          {/* Top Badges & Icon */}
          <div className="flex justify-between items-start mb-8">
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full">
              الإصدار v2.4.0
            </span>
            <div className="w-12 h-12 bg-[#1a1f3c] rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-600/20 transition-colors">
              <Monitor className="w-6 h-6 text-blue-400" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-white mb-3">نسخة الكمبيوتر (PC)</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            البرنامج الشامل لإدارة المحل. يدعم جميع قارئات الباركود والطابعات. يعمل على Windows 10 و 11.
          </p>

          <div className="space-y-4 mb-10 flex-1">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm text-slate-300 font-medium">تثبيت بنقرة واحدة (Setup.exe)</span>
            </div>
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm text-slate-300 font-medium">يدعم العمل بدون إنترنت</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="text-sm text-slate-300 font-medium">آمن وخالي من الفيروسات</span>
            </div>
          </div>

          <div className="mt-auto">
            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all transform hover:scale-[1.02]">
              <Download className="w-5 h-5" />
              <span>تحميل للويندوز</span>
            </button>
            <p className="text-center text-slate-500 text-[10px] mt-4 font-mono">
              Size: 45MB • .exe file
            </p>
          </div>
        </motion.div>

        {/* MOBILE CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-[#150e1f] border border-pink-900/10 rounded-3xl p-8 relative overflow-hidden flex flex-col shadow-2xl hover:border-pink-500/30 transition-all group"
        >
          {/* Top Badges & Icon */}
          <div className="flex justify-between items-start mb-8">
            <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-bold rounded-full">
              الإصدار v1.2.0
            </span>
            <div className="w-12 h-12 bg-[#2a162a] rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-pink-600/20 transition-colors">
              <Smartphone className="w-6 h-6 text-pink-400" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-white mb-3">تطبيق الهاتف (Mobile)</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8">
            لمتابعة نشاط محلك عن بعد. قم بتثبيته على هاتفك ثم امسح كود الربط من برنامج الكمبيوتر.
          </p>

          <div className="bg-[#0a0c1a] border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 mb-10 flex-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <QrCode className="w-4 h-4 text-pink-500" />
                <h4 className="text-white font-bold text-sm">امسح للتحميل</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                وجه كاميرا هاتفك نحو الكود للتحميل المباشر.
              </p>
            </div>
            <div className="w-16 h-16 bg-white rounded-lg p-1 shrink-0">
              {/* Fake QR code representation */}
              <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://algora.dz/download/apk')] bg-contain bg-no-repeat bg-center"></div>
            </div>
          </div>

          <div className="mt-auto">
            <button className="w-full py-4 bg-white hover:bg-slate-100 text-pink-600 rounded-xl font-black flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all transform hover:scale-[1.02]">
              <Download className="w-5 h-5" />
              <span>تحميل ملف APK</span>
            </button>
            <p className="text-center text-slate-500 text-[10px] mt-4 font-mono invisible">
              Spacer
            </p>
          </div>
        </motion.div>

      </div>

      {/* QUICK INSTALL STEPS SECTION */}
      <div className="max-w-4xl mx-auto w-full px-4 pb-20 relative z-10 text-center">
        <h3 className="text-xl font-bold text-white mb-8">خطوات التثبيت السريع</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 font-bold flex items-center justify-center mx-auto mb-3">1</div>
            <h4 className="text-sm font-bold text-slate-200 mb-2">تحميل وتثبيت</h4>
            <p className="text-[11px] text-slate-400">حمل نسخة الويندوز وقم بتثبيتها بشكل عادي على جهازك</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 font-bold flex items-center justify-center mx-auto mb-3">2</div>
            <h4 className="text-sm font-bold text-slate-200 mb-2">تفعيل الحساب</h4>
            <p className="text-[11px] text-slate-400">افتح البرنامج وأدخل مفتاح الترخيص لتفعيل حسابك</p>
          </div>
          <div className="bg-slate-900/50 border border-slate-800/50 p-6 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 font-bold flex items-center justify-center mx-auto mb-3">3</div>
            <h4 className="text-sm font-bold text-slate-200 mb-2">ربط الهاتف</h4>
            <p className="text-[11px] text-slate-400">افتح تطبيق الهاتف وامسح الكود من الكمبيوتر للربط المباشر</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
