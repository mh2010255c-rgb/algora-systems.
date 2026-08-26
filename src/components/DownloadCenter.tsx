import React from "react";
import { motion } from "motion/react";
import { 
  Monitor, Smartphone, Download, CheckCircle2, QrCode, 
  ShieldCheck, WifiOff, Zap, Lock, ArrowRight
} from "lucide-react";

interface DownloadCenterProps {
  onBack?: () => void;
}

export default function DownloadCenter({ onBack }: DownloadCenterProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-500 antialiased relative" dir="rtl">
      
      {/* HEADER SECTION */}
      <div className="pt-20 pb-12 px-4 flex flex-col items-center justify-center text-center relative z-10">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all shadow-sm cursor-pointer active:scale-95"
          >
            <ArrowRight className="w-4 h-4 text-blue-600" />
            <span>العودة للرئيسية</span>
          </button>
        )}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-6">
          <ShieldCheck className="w-4 h-4" />
          <span>تم تشفير الوصول بنجاح</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
          <span className="text-slate-900">مركز </span>
          <span className="bg-gradient-to-r from-blue-500 to-pink-500 text-transparent bg-clip-text drop-shadow-[0_0_15px_rgba(236,72,153,0.15)]">التحميل</span>
        </h1>
        
        <p className="text-slate-600 max-w-lg text-sm leading-relaxed">
          اختر النسخة المناسبة لجهازك. ننصح بتثبيت نسخة الكمبيوتر أولاً لإعداد النظام، ثم ربط تطبيق الهاتف.
        </p>
      </div>

      {/* CARDS SECTION */}
      <div className="max-w-5xl mx-auto w-full px-4 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 pb-20">
        
        {/* Glow effect behind cards */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-blue-600/5 blur-[120px] -z-10 rounded-full pointer-events-none"></div>

        {/* PC CARD */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-slate-200/80 rounded-3xl p-8 relative overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:border-blue-500/30 transition-all group"
        >
          {/* Top Badges & Icon */}
          <div className="flex justify-between items-start mb-8">
            <span className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold rounded-full">
              الإصدار v2.4.0
            </span>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-100/50 transition-colors">
              <Monitor className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-3">نسخة الكمبيوتر (PC)</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            البرنامج الشامل لإدارة المحل. يدعم جميع قارئات الباركود والطابعات. يعمل على Windows 10 و 11.
          </p>

          <div className="space-y-4 mb-10 flex-1">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
              <span className="text-sm text-slate-700 font-medium">تثبيت بنقرة واحدة (Setup.exe)</span>
            </div>
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-orange-500 shrink-0" />
              <span className="text-sm text-slate-700 font-medium">يدعم العمل بدون إنترنت</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
              <span className="text-sm text-slate-700 font-medium">آمن وخالي من الفيروسات</span>
            </div>
          </div>

          <div className="mt-auto">
            <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(59,130,246,0.2)] transition-all transform hover:scale-[1.02] cursor-pointer">
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
          className="bg-white border border-slate-200/80 rounded-3xl p-8 relative overflow-hidden flex flex-col shadow-xl hover:shadow-2xl hover:border-pink-500/30 transition-all group"
        >
          {/* Top Badges & Icon */}
          <div className="flex justify-between items-start mb-8">
            <span className="px-3 py-1 bg-pink-50 border border-pink-100 text-pink-600 text-[10px] font-bold rounded-full">
              الإصدار v1.2.0
            </span>
            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-pink-100/50 transition-colors">
              <Smartphone className="w-6 h-6 text-pink-600" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-3">تطبيق الهاتف (Mobile)</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-8">
            لمتابعة نشاط محلك عن بعد. قم بتثبيته على هاتفك ثم امسح كود الربط من برنامج الكمبيوتر.
          </p>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center gap-4 mb-10 flex-1">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <QrCode className="w-4 h-4 text-pink-600" />
                <h4 className="text-slate-900 font-bold text-sm">امسح للتحميل</h4>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                وجه كاميرا هاتفك نحو الكود للتحميل المباشر.
              </p>
            </div>
            <div className="w-16 h-16 bg-white rounded-lg p-1 shrink-0 border border-slate-200">
              {/* Fake QR code representation */}
              <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://algora.dz/download/apk')] bg-contain bg-no-repeat bg-center"></div>
            </div>
          </div>

          <div className="mt-auto">
            <button className="w-full py-4 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(236,72,153,0.2)] transition-all transform hover:scale-[1.02] cursor-pointer">
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
        <h3 className="text-xl font-bold text-slate-900 mb-8">خطوات التثبيت السريع</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-100/50 border border-slate-200/50 p-6 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 font-bold flex items-center justify-center mx-auto mb-3">1</div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">تحميل وتثبيت</h4>
            <p className="text-[11px] text-slate-600">حمل نسخة الويندوز وقم بتثبيتها بشكل عادي على جهازك</p>
          </div>
          <div className="bg-slate-100/50 border border-slate-200/50 p-6 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 font-bold flex items-center justify-center mx-auto mb-3">2</div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">تفعيل الحساب</h4>
            <p className="text-[11px] text-slate-600">افتح البرنامج وأدخل مفتاح الترخيص لتفعيل حسابك</p>
          </div>
          <div className="bg-slate-100/50 border border-slate-200/50 p-6 rounded-2xl">
            <div className="w-8 h-8 rounded-full bg-blue-600/10 text-blue-600 font-bold flex items-center justify-center mx-auto mb-3">3</div>
            <h4 className="text-sm font-bold text-slate-800 mb-2">ربط الهاتف</h4>
            <p className="text-[11px] text-slate-600">افتح تطبيق الهاتف وامسح الكود من الكمبيوتر للربط المباشر</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
