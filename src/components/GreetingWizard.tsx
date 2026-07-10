import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Phone, CheckCircle2, ShoppingBag, ArrowLeft, ArrowRight, UserCheck } from "lucide-react";

interface GreetingWizardProps {
  onClose: () => void;
  onSelectTrial: () => void;
}

export default function GreetingWizard({ onClose, onSelectTrial }: GreetingWizardProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    shopType: "",
    biggestPain: "",
  });

  const handleNext = (field: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setStep((prev) => prev + 1);
  };

  const painPoints = [
    {
      id: "inventory",
      title: "صعوبة تنظيم المخزون وحساب الأرباح",
      desc: "تداخل قطع الغيار، الهواتف، والإكسسوارات مع عدم معرفة الفائدة الصافية بدقة.",
      solution: "يقدم لك Algora Systems جردًا فوريًا للمخزون بالرقم التسلسلي (IMEI) وحسابًا آليًا لأرباحك الصافية مع كل عملية بيع.",
      icon: ShoppingBag,
    },
    {
      id: "maintenance",
      title: "فوضى أجهزة الصيانة ومتابعة الكريدي",
      desc: "نسيان حالة تصليح الأجهزة، أسعار قطع الغيار، وضياع مستحقات الديون (الكريدي).",
      solution: "نظام صيانة متكامل يتيح لك تسجيل حالة الجهاز، تتبع مراحل تصليحه، وإرسال إشعارات للزبائن فور الانتهاء مع كشف ديون دقيق.",
      icon: CheckCircle2,
    },
    {
      id: "speed",
      title: "بطء عملية الكاشير وطباعة الفواتير للزبائن",
      desc: "طوابير الزبائن وصعوبة إصدار وصولات بيع احترافية متوافقة مع الطابعات المتوفرة.",
      solution: "واجهة كاشير (POS) فائقة السرعة تدعم ماسح الباركود بنقرة واحدة، وتطبع وصولات حرارية احترافية بمقاسات 58mm و80mm.",
      icon: Phone,
    },
  ];

  const selectedPain = painPoints.find((p) => p.id === answers.biggestPain);

  return (
    <div id="greeting-wizard" className="bg-gradient-to-br from-indigo-950/95 via-purple-950/95 to-slate-950/98 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto rounded-3xl border border-purple-500/20 shadow-2xl">
      <div className="max-w-xl w-full text-center text-white py-8 px-6 relative">
        <div className="absolute top-2 left-2 flex gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-1.5 rounded-full transition-all duration-300 ${
                s <= step ? "bg-purple-500 w-6" : "bg-slate-700"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="inline-flex p-3.5 bg-purple-500/15 rounded-full border border-purple-500/30 text-purple-400 mb-2">
                <span className="text-3xl animate-bounce">👋</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                مرحباً بك في <span className="text-purple-400">Algora Systems</span>
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                البرنامج الجزائري الأكثر ثقة وتكاملاً لإدارة محلات الهواتف والصيانة الذكية. هل أنت جاهز للارتقاء بمتجرك؟ أخبرنا بوضعيتك الحالية لنقترح عليك الحل الأمثل:
              </p>
              
              <div className="grid grid-cols-1 gap-3 pt-4">
                <button
                  onClick={() => handleNext("shopType", "existing")}
                  className="group flex items-center justify-between p-4 bg-slate-900/60 hover:bg-purple-900/30 border border-slate-800 hover:border-purple-500/50 rounded-xl text-right transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500/20">
                      <UserCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm md:text-base">نعم، أملك محل هواتف وصيانة قائم</h4>
                      <p className="text-slate-400 text-xs">أريد نظاماً ينظم مبيعاتي، مخزوني وعمليات الصيانة.</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:-translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleNext("shopType", "new")}
                  className="group flex items-center justify-between p-4 bg-slate-900/60 hover:bg-purple-900/30 border border-slate-800 hover:border-purple-500/50 rounded-xl text-right transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500/20">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-100 text-sm md:text-base">أخطط لفتح محل هواتف قريباً</h4>
                      <p className="text-slate-400 text-xs">أبحث عن نظام متكامل لأبدأ مشروعي باحترافية تامة.</p>
                    </div>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors"
                >
                  تخطي والذهاب للصفحة الرئيسية مباشرة
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h2 className="text-xl md:text-2xl font-bold">
                ما هي <span className="text-purple-400">أكبر مشكلة</span> تعاني منها في تسيير محلك حالياً؟
              </h2>
              <p className="text-slate-400 text-xs md:text-sm">
                اختيارك يساعدنا في تفعيل الموديول المناسب لنشاطك فور تفعيل نسختك التجريبية.
              </p>

              <div className="space-y-3 pt-2">
                {painPoints.map((pain) => {
                  const IconComp = pain.icon;
                  return (
                    <button
                      key={pain.id}
                      onClick={() => handleNext("biggestPain", pain.id)}
                      className="w-full text-right p-4 bg-slate-900/60 hover:bg-purple-900/30 border border-slate-800 hover:border-purple-500/40 rounded-xl flex items-start gap-3.5 transition-all duration-200 group"
                    >
                      <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400 group-hover:bg-purple-500/20 shrink-0 mt-0.5">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className="grow">
                        <h4 className="font-bold text-slate-100 text-sm md:text-base group-hover:text-purple-300 transition-colors">
                          {pain.title}
                        </h4>
                        <p className="text-slate-400 text-xs leading-relaxed mt-1">
                          {pain.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" /> العودة للخلف
                </button>
                <button
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  تخطي
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="inline-flex p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 mb-1 animate-pulse">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-emerald-400">
                لقد وجدنا لك الحل المثالي! 🚀
              </h2>
              
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 text-right space-y-3 my-4">
                <h3 className="font-bold text-purple-400 text-sm md:text-base">
                  💡 تخصيص ذكي لمحلك:
                </h3>
                <p className="text-slate-200 text-xs md:text-sm leading-relaxed">
                  {selectedPain?.solution || "برنامجنا يوفر لك كاشير سريع، تتبع دقيق للمخزون بالباركود، إدارة الصيانة والزبائن وحساب الأرباح في تطبيق واحد متكامل."}
                </p>
                <div className="h-px bg-slate-800 my-2" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  نظام Algora Systems متوافق مع كافة طابعات الفواتير وماسحات الباركود المتوفرة بالجزائر، مع دعم فني جزائري محلي متوفر دائماً لحل أي تساؤل.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    onSelectTrial();
                    onClose();
                  }}
                  className="grow py-3 px-5 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-200 text-sm md:text-base flex items-center justify-center gap-2"
                >
                  اطلب نسخة تجريبية مجانية (5 أيام)
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="py-3 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium rounded-xl transition-all duration-200 text-sm md:text-base"
                >
                  استكشف الميزات والأسعار أولاً
                </button>
              </div>

              <div className="pt-2 text-xs text-slate-500 flex items-center justify-center gap-1.5">
                <span>⚡ لا تلتزم بشيء، تجربة مجانية بالكامل</span>
                <span>•</span>
                <span>دعم فني وتفعيل جزائري محلي مباشر</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
