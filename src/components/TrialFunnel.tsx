import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Download, Send, User, Phone, Store, MapPin, Mail, ArrowRight, X } from "lucide-react";

type TrialFunnelProps = {
  onComplete: () => void;
  onSkip?: () => void;
};

type Step = 1 | 2 | 3;

export default function TrialFunnel({ onComplete, onSkip }: TrialFunnelProps) {
  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    shopName: "",
    wilaya: "",
    email: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.shopName || !formData.wilaya) {
      alert("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call to save data
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(2);
    }, 1500);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
      
      // Optional: trigger actual file download here
      // const link = document.createElement('a');
      // link.href = '/path/to/installer.exe';
      // link.download = 'Fonezoon-Trial.exe';
      // link.click();
      
      setStep(3);
    }, 2000);
  };

  // List of Algerian Wilayas
  const wilayas = [
    "01 - أدرار", "02 - الشلف", "03 - الأغواط", "04 - أم البواقي", "05 - باتنة", "06 - بجاية", "07 - بسكرة", "08 - بشار", "09 - البليدة", "10 - البويرة",
    "11 - تمنراست", "12 - تبسة", "13 - تلمسان", "14 - تيارت", "15 - تيزي وزو", "16 - الجزائر", "17 - الجلفة", "18 - جيجل", "19 - سطيف", "20 - سعيدة",
    "21 - سكيكدة", "22 - سيدي بلعباس", "23 - عنابة", "24 - قالمة", "25 - قسنطينة", "26 - المدية", "27 - مستغانم", "28 - المسيلة", "29 - معسكر", "30 - ورقلة",
    "31 - وهران", "32 - البيض", "33 - إليزي", "34 - برج بوعريريج", "35 - بومرداس", "36 - الطارف", "37 - تندوف", "38 - تيسمسيلت", "39 - الوادي", "40 - خنشلة",
    "41 - سوق أهراس", "42 - تيبازة", "43 - ميلة", "44 - عين الدفلى", "45 - النعامة", "46 - عين تموشنت", "47 - غرداية", "48 - غليزان", "49 - تيميمون", "50 - برج باجي مختار",
    "51 - أولاد جلال", "52 - بني عباس", "53 - عين صالح", "54 - عين قزام", "55 - تقرت", "56 - جانت", "57 - المغير", "58 - المنيعة"
  ];

  // Prevent scrolling when funnel is active
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xl p-4 md:p-6" dir="rtl">
      {onSkip && (
        <button 
          onClick={onSkip}
          className="absolute top-6 left-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          title="تخطي"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

        <div className="relative p-8 md:p-12">
          
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Form */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">مرحباً بك في Fonezoon 👋</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">أدخل معلوماتك للحصول على نسختك التجريبية المجانية</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">الاسم الكامل <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <User className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all"
                          placeholder="الاسم واللقب"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">رقم الهاتف <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="tel" 
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          dir="ltr"
                          className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all text-right"
                          placeholder="0550 00 00 00"
                        />
                      </div>
                    </div>

                    {/* Shop Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">اسم المحل <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Store className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          name="shopName"
                          value={formData.shopName}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all"
                          placeholder="اسم محلك التجاري"
                        />
                      </div>
                    </div>

                    {/* Wilaya */}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300">الولاية <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <select
                          name="wilaya"
                          value={formData.wilaya}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all appearance-none cursor-pointer"
                        >
                          <option value="" disabled>اختر الولاية...</option>
                          {wilayas.map(w => (
                            <option key={w} value={w}>{w}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Email (Optional) */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      البريد الإلكتروني 
                      <span className="text-xs font-normal text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">اختياري</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        dir="ltr"
                        className="w-full pl-4 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all text-right"
                        placeholder="contact@example.com"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-6 py-4 bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-extrabold text-base rounded-xl shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                    {isSubmitting ? (
                      <span className="animate-pulse">جاري التسجيل...</span>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>🚀 تحميل النسخة التجريبية</span>
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: Download */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col items-center justify-center text-center py-10 space-y-8"
              >
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center animate-fade-in-up">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">تم تسجيل معلوماتك بنجاح ✅</h2>
                  <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                    يمكنك الآن تحميل وتجربة برنامج Fonezoon الخاص بإدارة محلات الهواتف والصيانة.
                  </p>
                </div>

                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full max-w-md py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-lg rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 disabled:opacity-80 disabled:hover:scale-100 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-blue-500/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                  {isDownloading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 dark:border-slate-900/30 border-t-white dark:border-t-slate-900 rounded-full animate-spin"></span>
                      جاري التحميل...
                    </span>
                  ) : (
                    <>
                      <Download className="w-6 h-6 animate-bounce" />
                      <span>⬇️ Télécharger le logiciel</span>
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* STEP 3: Thank You & Contact */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-8 space-y-8"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
                  <span className="text-7xl drop-shadow-xl relative z-10 block animate-bounce-slow">🎉</span>
                </div>
                
                <div className="space-y-4">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white">شكراً لتسجيلك!</h2>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <p className="text-slate-700 dark:text-slate-300 font-bold mb-2">تم تحميل النسخة التجريبية بنجاح.</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">فريقنا سيتواصل معك قريباً لمساعدتك في تشغيل وإعداد البرنامج.</p>
                  </div>
                </div>

                <div className="w-full max-w-sm space-y-3">
                  <a 
                    href="https://wa.me/213671037202?text=مرحباً، قمت للتو بتحميل النسخة التجريبية من برنامج Fonezoon وأحتاج إلى مساعدة في التثبيت والتفعيل."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold text-base rounded-xl shadow-lg shadow-[#25D366]/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    <span>💬 التواصل معنا على WhatsApp</span>
                  </a>

                  <button 
                    onClick={onComplete}
                    className="w-full py-4 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <span>الدخول إلى الموقع</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
