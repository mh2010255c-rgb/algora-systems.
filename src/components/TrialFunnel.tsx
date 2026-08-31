import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, Download, MessageCircle, ArrowRight, X, 
  Monitor, Smartphone, MonitorSmartphone, CreditCard, Banknote, MapPin, 
  Building2, User, Phone, PhoneCall, MessageSquare, Zap, BadgeCheck
} from "lucide-react";

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
    shopName: "",
    ownerName: "",
    phone1: "",
    phone2: "",
    wilaya: "",
    city: "",
    package: "both", // 'pc', 'mobile', 'both'
    hasWhatsapp: true,
    paymentMethod: "ccp", // 'cash', 'baridimob', 'ccp'
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shopName || !formData.ownerName || !formData.phone1 || !formData.wilaya) {
      alert("الرجاء ملء جميع الحقول المطلوبة (اسم المحل، اسم المالك، رقم الهاتف، والولاية)");
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-2 md:p-6 overflow-y-auto" dir="rtl">
      {onSkip && (
        <button 
          onClick={onSkip}
          className="fixed top-4 left-4 md:top-6 md:left-6 p-2 bg-slate-800/50 hover:bg-slate-800/80 text-white rounded-full transition-colors z-[110]"
          title="تخطي"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      <div className="w-full max-w-6xl bg-white dark:bg-slate-950 rounded-2xl md:rounded-[2rem] shadow-2xl overflow-hidden relative min-h-[90vh] md:min-h-0 my-auto flex flex-col md:flex-row">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Form Layout */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col md:flex-row w-full"
            >
              {/* Right Side (Info) */}
              <div className="w-full md:w-5/12 bg-slate-50 dark:bg-slate-900 p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-l border-slate-200 dark:border-slate-800">
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-xs border border-blue-100 dark:border-blue-800/50">
                    <BadgeCheck className="w-4 h-4" />
                    <span>جرب نظامنا بالكامل 5 أيام مجاناً</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                    اطلب تفعيل نسختك التجريبية المجانية في ثوانٍ معدودة
                  </h2>

                  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 mt-8 shadow-sm">
                    <h3 className="font-black text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2 mb-4">
                      <span>ماذا يشمل طلب التجربة المجانية؟</span>
                      <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </h3>
                    <ul className="space-y-3">
                      {[
                        "5 أيام كاملة دون أي التزام أو دفع مسبق",
                        "دعم فني كامل هاتفياً وعبر AnyDesk للتثبيت مجاناً",
                        "إمكانية الاحتفاظ بكافة السلع التي جردتها بعد الاشتراك"
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Left Side (Form) */}
              <div className="w-full md:w-7/12 p-6 md:p-10 bg-white dark:bg-slate-950 overflow-y-auto max-h-[85vh] custom-scrollbar">
                <form onSubmit={handleFormSubmit} className="space-y-6 max-w-2xl mx-auto">
                  
                  {/* Shop Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم المحل التجاري</label>
                    <input 
                      type="text" 
                      name="shopName"
                      value={formData.shopName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 dark:text-white transition-all text-sm"
                      placeholder="مثال: البهجة موبايل"
                    />
                  </div>

                  {/* Owner Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">اسم ولقب صاحب المحل</label>
                    <input 
                      type="text" 
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 dark:text-white transition-all text-sm"
                      placeholder="مثال: يوسف جيلالي"
                    />
                  </div>

                  {/* Phones Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">رقم الهاتف الأول (النشط بالجزائر)</label>
                      <input 
                        type="tel" 
                        name="phone1"
                        value={formData.phone1}
                        onChange={handleInputChange}
                        required
                        dir="ltr"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 dark:text-white transition-all text-sm text-right"
                        placeholder="مثال: 0671837282"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300 text-slate-500">رقم الهاتف الثاني (اختياري)</label>
                      <input 
                        type="tel" 
                        name="phone2"
                        value={formData.phone2}
                        onChange={handleInputChange}
                        dir="ltr"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 dark:text-white transition-all text-sm text-right"
                        placeholder="مثال: 0666123456"
                      />
                    </div>
                  </div>

                  {/* Location Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">الولاية</label>
                      <select
                        name="wilaya"
                        value={formData.wilaya}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 dark:text-white transition-all text-sm cursor-pointer"
                      >
                        <option value="" disabled>اختر الولاية...</option>
                        {wilayas.map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">المدينة (البلدية)</label>
                      <input 
                        type="text" 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 dark:text-white transition-all text-sm"
                        placeholder="اختر البلدية..."
                      />
                    </div>
                  </div>

                  {/* Package Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MonitorSmartphone className="w-4 h-4 text-blue-500" />
                      <span>باقة البرنامج المطلوب تفعيله</span>
                    </label>
                    <div className="space-y-2">
                      
                      {/* Option 1: PC */}
                      <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.package === 'pc' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            formData.package === 'pc' ? 'border-blue-500 bg-blue-500' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {formData.package === 'pc' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">باقة لوجيسيال حاسوب فقط</p>
                            <p className="text-xs text-slate-500">برنامج متكامل على نظام ويندوز لإدارة الفواتير والمبيعات</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">12,000 دج / سنة</span>
                          <Monitor className="w-5 h-5 text-slate-400" />
                        </div>
                      </label>

                      {/* Option 2: Mobile */}
                      <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.package === 'mobile' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            formData.package === 'mobile' ? 'border-blue-500 bg-blue-500' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {formData.package === 'mobile' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">باقة تطبيق هاتف فقط</p>
                            <p className="text-xs text-slate-500">تطبيق أندرويد وآيفون متكامل لمتابعة محلك أينما كنت</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">12,000 دج / سنة</span>
                          <Smartphone className="w-5 h-5 text-slate-400" />
                        </div>
                      </label>

                      {/* Option 3: Both (Recommended) */}
                      <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.package === 'both' 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            formData.package === 'both' ? 'border-blue-500 bg-blue-500' : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {formData.package === 'both' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                              <span>باقة تطبيق هاتف مع حاسوب معاً</span>
                              <span className="text-[9px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-black">الأكثر طلباً وتوفيراً 🔥</span>
                            </p>
                            <p className="text-xs text-slate-500">التكامل والتحكم المطلق (حاسوب + هاتف متزامنان كلياً)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 dark:text-blue-400 text-sm">20,000 دج / سنة</span>
                          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <MonitorSmartphone className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </label>

                    </div>
                  </div>

                  {/* Whatsapp Connected Check */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4 text-green-500" />
                      <span>هل رقم الهاتف هذا مرتبط بالواتساب؟</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, hasWhatsapp: false})}
                        className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                          !formData.hasWhatsapp 
                            ? 'border-slate-800 bg-slate-800 text-white dark:border-slate-200 dark:bg-slate-200 dark:text-slate-900' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                        }`}
                      >
                        <PhoneCall className="w-4 h-4" />
                        <span>لا، اتصال هاتفي فقط</span>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, hasWhatsapp: true})}
                        className={`py-3 px-4 rounded-xl font-bold text-sm border-2 transition-all flex items-center justify-center gap-2 ${
                          formData.hasWhatsapp 
                            ? 'border-[#25D366] bg-[#25D366] text-white' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-[#25D366]/30 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>نعم، يوجد واتساب</span>
                      </button>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-500" />
                      <span>وسيلة الدفع المفضلة لتفعيل الاشتراك لاحقاً</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: 'cash'})}
                        className={`py-3 px-2 rounded-xl font-bold text-xs border-2 transition-all flex flex-col items-center justify-center gap-1.5 ${
                          formData.paymentMethod === 'cash' 
                            ? 'border-blue-600 bg-blue-600 text-white' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                        }`}
                      >
                        <span className="text-lg">📦</span>
                        <span>دفع عند الاستلام</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: 'baridimob'})}
                        className={`py-3 px-2 rounded-xl font-bold text-xs border-2 transition-all flex flex-col items-center justify-center gap-1.5 ${
                          formData.paymentMethod === 'baridimob' 
                            ? 'border-blue-600 bg-blue-600 text-white' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                        }`}
                      >
                        <span className="text-lg">📱</span>
                        <span>بريدي موب</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({...formData, paymentMethod: 'ccp'})}
                        className={`py-3 px-2 rounded-xl font-bold text-xs border-2 transition-all flex flex-col items-center justify-center gap-1.5 ${
                          formData.paymentMethod === 'ccp' 
                            ? 'border-blue-600 bg-blue-600 text-white' 
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400'
                        }`}
                      >
                        <span className="text-lg text-blue-400">💳</span>
                        <span>CCP</span>
                      </button>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">ملاحظات (اختياري)</label>
                    <textarea 
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900 dark:text-white transition-all text-sm resize-none"
                      placeholder="اكتب أي ملاحظات إضافية هنا..."
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm md:text-base rounded-xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">جاري تسجيل طلبك...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>اطلب نسختك التجريبية وتفعيل الدعم الآن</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Download */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex flex-col items-center justify-center text-center p-12 space-y-8 w-full"
            >
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center animate-fade-in-up">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">تم تسجيل طلبك بنجاح ✅</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto">
                  يمكنك الآن تحميل وتجربة برنامج Fonezoon. سيقوم فريقنا بالاتصال بك قريباً لتفعيل النسخة.
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center p-12 space-y-8 w-full"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full"></div>
                <span className="text-7xl drop-shadow-xl relative z-10 block animate-bounce-slow">🎉</span>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white">شكراً لثقتك بنا!</h2>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <p className="text-slate-700 dark:text-slate-300 font-bold mb-2">تم تحميل النسخة التجريبية بنجاح.</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">فريق الدعم الفني سيتواصل معك عبر الهاتف لضبط إعدادات البرنامج.</p>
                </div>
              </div>

              <div className="w-full max-w-sm space-y-3">
                <a 
                  href="https://wa.me/213671037202?text=مرحباً، قمت للتو بتحميل النسخة التجريبية من برنامج Fonezoon وأحتاج إلى مساعدة في التثبيت."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold text-base rounded-xl shadow-lg shadow-[#25D366]/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <MessageSquare className="w-5 h-5 fill-white" />
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
  );
}
