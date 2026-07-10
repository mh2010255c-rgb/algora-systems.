import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, FileText, ShieldCheck, RefreshCw, ChevronLeft, 
  Award, Globe, CheckCircle2, Phone, Sparkles, Building2, HelpCircle
} from "lucide-react";

export type InfoSection = "about" | "terms" | "privacy" | "refund";

interface InfoPagesProps {
  initialSection?: InfoSection;
  onSelectTrial?: () => void;
}

export default function InfoPages({ initialSection = "about", onSelectTrial }: InfoPagesProps) {
  const [activeSection, setActiveSection] = useState<InfoSection>(initialSection);

  // Sync activeSection with prop updates
  React.useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  // Define menu items
  const menuItems = [
    {
      id: "about" as InfoSection,
      label: "من نحن - Algora Systems",
      icon: Users,
      description: "تعرّف على فريقنا ورؤيتنا لرقمنة تجارة الهواتف بالجزائر",
      color: "text-purple-400"
    },
    {
      id: "terms" as InfoSection,
      label: "شروط الاستخدام والأحكام",
      icon: FileText,
      description: "القواعد والسياسات المنظمة لاستخدام اللوجيسيال والتراخيص",
      color: "text-indigo-400"
    },
    {
      id: "privacy" as InfoSection,
      label: "سياسة الخصوصية وحماية البيانات",
      icon: ShieldCheck,
      description: "كيف نحمي سرّية بيانات مبيعاتك ومخزونك بكل أمان",
      color: "text-emerald-400"
    },
    {
      id: "refund" as InfoSection,
      label: "سياسة الاستبدال والاسترجاع",
      icon: RefreshCw,
      description: "تفاصيل الفترة التجريبية وتفعيل وإلغاء الاشتراكات",
      color: "text-amber-400"
    }
  ];

  return (
    <div className="space-y-8 text-right animate-fade-in" id="info-pages-container">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl mb-1">
          <Building2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-slate-100 tracking-tight">
          السياسات القانونية والتعريفية لـ Algora
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          نلتزم بالشفافية الكاملة وحماية حقوق تجارنا في الجزائر. يمكنك تصفح بنود الخدمة وسياسة الخصوصية والتعريف بنا أدناه.
        </p>
      </div>

      {/* Horizontal Low-Profile Tab Switcher (Modern Segmented Bar) */}
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-950/60 p-2 rounded-2xl border border-slate-900 max-w-4xl mx-auto w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all duration-200 cursor-pointer ${
                isActive 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20 border border-purple-500/30" 
                  : "bg-slate-900/30 border border-slate-900/40 text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0 text-purple-400" />
              <span>{item.label.split(" - ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Centered Single-Column Content Section */}
      <div className="max-w-4xl mx-auto w-full">
        <section className="bg-slate-950/80 border border-slate-900 rounded-2xl p-6 md:p-8 shadow-xl min-h-[480px] flex flex-col justify-between">
          
          <AnimatePresence mode="wait">
            {activeSection === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg md:text-xl text-slate-100">من نحن - فريق Algora Systems</h3>
                    <p className="text-xs text-slate-400">مهندسون ومطورون جزائريون ملتزمون برقمنة محلاتكم التجارية</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
                  <p>
                    مرحباً بكم في <span className="text-purple-400 font-bold">Algora Systems</span>، الشركة البرمجية الوطنية الرائدة في تطوير حلول إدارة وتسيير نقاط البيع (POS) وتتبع الصيانة المتخصصة لمحلات الهواتف المحمولة والإكسسوارات في الجزائر.
                  </p>
                  <p>
                    تأسست ألجورا على يد مهندسين برمجيات جزائريين بعد ملامسة الحاجة الملحة لأصحاب المحلات لبرنامج جرد ومبيعات حقيقي، دقيق وسهل الاستخدام، لا يعتمد على تعقيدات اللوجيسيلات الأجنبية المكلفة ويدعم الخصائص الضرورية للتاجر الجزائري مثل حساب الـ <span className="font-bold text-slate-200">IMEI</span> للصيانة ومبيعات الكريدي وطرق الدفع المحلية مثل <span className="font-bold text-slate-200">بريدي موب</span>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-900 space-y-2">
                      <h5 className="font-extrabold text-slate-200 flex items-center justify-end gap-1.5">
                        <span>رؤيتنا الرقمية 🇩🇿</span>
                        <Globe className="w-4 h-4 text-purple-400" />
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        أن نكون الشريك التقني رقم واحد للتاجر الجزائري، لنقود معاً التحول الرقمي للتجزئة والخدمات بأحدث المعايير وبطابع محلي أصيل.
                      </p>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-900 space-y-2">
                      <h5 className="font-extrabold text-slate-200 flex items-center justify-end gap-1.5">
                        <span>الالتزام والدعم المستمر</span>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      </h5>
                      <p className="text-[11px] text-slate-400">
                        نحن لا نكتفي ببيع ترخيص البرنامج! نوفر تثبيتاً شاملاً مجانياً عبر AnyDesk، وتدريباً مخصصاً لجميع عمالكم ومسيريكم حتى الاحتراف.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-900 text-center space-y-1 mt-4">
                    <p className="font-bold text-slate-200">مقرنا ومجال تغطيتنا:</p>
                    <p className="text-xs text-slate-400">نحن نقدم خدماتنا وتراخيصنا لكافة ولايات الجزائر الـ 58 مع دعم هاتفي فوري على مدار الساعة.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "terms" && (
              <motion.div
                key="terms"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg md:text-xl text-slate-100">شروط وأحكام الاستخدام</h3>
                    <p className="text-xs text-slate-400">البنود القانونية والضوابط المنظمة لاستعمال البرنامج والتراخيص</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
                  <p>
                    باستخدامك للوجيسيال <span className="text-purple-400 font-bold">Algora Systems</span>، فإنك توافق التزاماً بالبنود والشروط القانونية المبينة أدناه:
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex gap-2.5 items-start">
                      <span className="font-mono text-purple-400 font-bold text-sm shrink-0">01.</span>
                      <p>
                        <strong className="text-slate-100">حق الترخيص والاستخدام:</strong> يمنح الاشتراك للمستخدم ترخيصاً لاستخدام البرنامج في متجر واحد محدد عند تفعيل الاشتراك. لا يجوز إعادة بيع، توزيع، أو محاولة قرصنة البرنامج أو نقله لأطراف أخرى دون ترخيص مكتوب من الإدارة.
                      </p>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <span className="font-mono text-purple-400 font-bold text-sm shrink-0">02.</span>
                      <p>
                        <strong className="text-slate-100">مسؤولية البيانات الشخصية والتجارية:</strong> اللوجيسيال يحتفظ ببيانات المبيعات والمخزون في جهاز المستخدم المحلي (مؤمن) مع إمكانية المزامنة السحابية الاحتياطية. يلتزم المستخدم بالحفاظ على كلمة المرور السرية لمدير النظام لمنع تلاعب العمال.
                      </p>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <span className="font-mono text-purple-400 font-bold text-sm shrink-0">03.</span>
                      <p>
                        <strong className="text-slate-100">التحديثات والتطوير:</strong> نلتزم في Algora Systems بتقديم تحديثات دورية مجانية لإصلاح الثغرات وتحسين الأداء وتقديم ميزات جديدة لجميع المشتركين طيلة فترة سريان ترخيصهم.
                      </p>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <span className="font-mono text-purple-400 font-bold text-sm shrink-0">04.</span>
                      <p>
                        <strong className="text-slate-100">أعطال العتاد والكوارث الطبيعية:</strong> يوصى بشدة بتهيئة خاصية النسخ السحابي التلقائي بشكل مستمر. إدارة البرنامج غير مسؤولة عن ضياع البيانات الناتج عن احتراق أو تلف الحاسوب الشخصي للزبون في حال تعطيله للنسخ الاحتياطي.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "privacy" && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg md:text-xl text-slate-100">سياسة الخصوصية وحماية البيانات</h3>
                    <p className="text-xs text-slate-400">التزامنا الصارم بالحفاظ على سرية وأمن معلومات متجرك وزبائنك</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
                  <p>
                    نحن في <span className="text-purple-400 font-bold">Algora Systems</span> نضع سرية وأمان بيانات مبيعاتك ومخزونك وأرباحك على رأس أولوياتنا. إليك تفصيل كيفية حماية خصوصيتك:
                  </p>

                  <div className="space-y-4 pt-2">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-900 space-y-1.5">
                      <h5 className="font-bold text-slate-200">1. تشفير وتخزين البيانات السحابية</h5>
                      <p className="text-[11px] text-slate-400">
                        كافة النسخ الاحتياطية المرفوعة لسحابة Algora محمية ببروتوكولات تشفير متطورة للغاية (AES-256)، وهي مخزنة في خوادم عالمية آمنة ومحمية، ولا يمكن لأي موظف أو طرف ثالث الاطلاع على مبيعاتك أو أسعار شرائك نهائياً.
                      </p>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-900 space-y-1.5">
                      <h5 className="font-bold text-slate-200">2. البيانات الشخصية التي نجمعها</h5>
                      <p className="text-[11px] text-slate-400">
                        نحن نطلب فقط البيانات الأساسية مثل (اسم المحل، اسم صاحب المحل، رقم الهاتف والولاية) بغرض تسجيل رخصة اللوجيسيال، وتقديم الدعم الفني الهاتفي أو معاودة الاتصال بك لحل مشكلات طابعة الفواتير.
                      </p>
                    </div>

                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-900 space-y-1.5">
                      <h5 className="font-bold text-slate-200">3. عدم مشاركة البيانات تجارياً</h5>
                      <p className="text-[11px] text-slate-400">
                        نلتزم التزاماً أخلاقياً وقانونياً تاماً بعدم بيع، تأجير، أو مشاركة أي بيانات تخص محلك، مبيعاتك، أو أرقام هواتف زبائنك مع أي شركات تسويق أو جهات خارجية مهما كانت الأسباب.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === "refund" && (
              <motion.div
                key="refund"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-slate-900 pb-4">
                  <div className="p-3 bg-amber-500/10 border border-purple-500/25 text-amber-500 rounded-xl">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg md:text-xl text-slate-100">سياسة الاستبدال والاسترجاع والاشتراك</h3>
                    <p className="text-xs text-slate-400">توضيح شفاف حول تجربة النظام، الدفع، وتفعيل الترخيص السنوي</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs md:text-sm text-slate-300 leading-relaxed">
                  <p>
                    لتوفير تجربة شراء آمنة وخالية من القلق للتجار الجزائريين، قمنا بتنظيم سياسة الاشتراك والتعويض كالتالي:
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex gap-2.5 items-start">
                      <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p>
                        <strong className="text-slate-100">فترة تجريبية 5 أيام مجاناً:</strong> يحق لكل تاجر الحصول على نسخة تجريبية كاملة المزايا مجاناً وبلا قيود لمدة 5 أيام للتحقق من جودة البرنامج وتوافق طابعته وعتاده، ليتخذ قرار الشراء والاشتراك عن قناعة تامة وبينة.
                      </p>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p>
                        <strong className="text-slate-100">سياسة التعويض والاسترجاع المالي:</strong> نظراً لأننا نوفر فترة تجربة مجانية كافية ومفصلة قبل دفع المستحقات، فإن مبالغ تفعيل الاشتراك (الشهري أو السنوي) بمجرد دفعها وإصدار مفاتيح الترخيص تكون غير قابلة للاسترجاع النقدي.
                      </p>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p>
                        <strong className="text-slate-100">تعديل وترقية الباقات:</strong> يمكنك ترقية اشتراكك من الباقة الشهرية إلى السنوية في أي وقت، وسيتم احتساب الأيام المتبقية من باقتك السابقة وخصمها من قيمة باقتك السنوية الجديدة تلقائياً وبأمانة تامة.
                      </p>
                    </div>

                    <div className="flex gap-2.5 items-start">
                      <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p>
                        <strong className="text-slate-100">ضمان حل المشاكل التقنية:</strong> نضمن لك المساعدة الفنية الشاملة. في حال واجهت أي مشكلة تعطل تشغيل البرنامج بمحلّك، يلتزم فريق دعمنا هاتفياً وعبر AnyDesk بالتدخل وحل المشكلة تماماً دون تحميلك أي تكاليف إضافية.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer of the Content Column */}
          <div className="border-t border-slate-900 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <div className="text-slate-500">
              🇩🇿 دعم فني محلي فوري بالجزائر هاتفياً وعلى الواتساب: <a href="https://wa.me/213553361047" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-300 font-mono inline-block hover:underline hover:text-purple-400 transition-colors cursor-pointer" dir="ltr">+213 553 36 10 47</a>
            </div>
            {onSelectTrial && (
              <button
                onClick={onSelectTrial}
                className="px-5 py-2 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-lg shadow transition-all cursor-pointer"
              >
                تفعيل اللوجيسيال مجاناً
              </button>
            )}
          </div>

        </section>

      </div>

    </div>
  );
}
