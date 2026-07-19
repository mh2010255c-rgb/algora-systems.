import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
  ArrowLeft, Smartphone, ShieldCheck, Wrench, BarChart3, ScanBarcode, 
  Check, Printer, AlertCircle, Sparkles, ChevronLeft, ChevronRight, CreditCard,
  CheckCircle2, Star, MessageCircle, HelpCircle, Loader2, Award, ArrowDown,
  Play, Pause, Volume2, VolumeX, UploadCloud, Video, Link2, Youtube, FileVideo, CheckCircle,
  Image, Plus, Trash2, Maximize2, Sliders, X, Laptop, Download, FileText, ExternalLink
} from "lucide-react";
import { Testimonial, SubscriptionPlan } from "../types";
import SystemMockup from "./SystemMockup";
import algeriaData from "../data/algeria.json";

const wilayas = algeriaData;
const getCommunesByWilaya = (code: number) => {
  const wilaya = wilayas.find(w => w.code === code);
  return wilaya ? wilaya.communes : [];
};

interface LandingPageProps {
  onSelectDemo: () => void;
  onSelectSupport: () => void;
  onSelectTrial: () => void;
  trialFormRef: React.RefObject<HTMLDivElement | null>;
}

export default function LandingPage({ onSelectDemo, onSelectSupport, onSelectTrial, trialFormRef }: LandingPageProps) {
  
  // Video Demo Section States
  const [videoSrc, setVideoSrc] = useState("/videos/demo.mp4");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoLinkInput, setVideoLinkInput] = useState("");
  const [activeChapter, setActiveChapter] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [uploadTab, setUploadTab] = useState<"file" | "link">("file");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Video Demo Chapters list
  const videoChapters = [
    { title: "الواجهة الكلية ولوحة التحكم السريعة", time: 0, desc: "تصفح سريع لإحصائيات مبيعات اليوم، المداخيل، والصندوق المفتوح." },
    { title: "كيفية تسجيل وجرد هاتف بـ IMEI", time: 10, desc: "إدخال الهواتف بالرقم التسلسلي لمنع تداخل المخزون وتأمينه." },
    { title: "استلام جهاز صيانة وإشعار الزبون", time: 25, desc: "فتح تذكرة صيانة، تحديد العطل وقطع الغيار، وإرسال SMS فوري." },
    { title: "إتمام عملية بيع وتجربة طابعة الفواتير", time: 40, desc: "تجربة كاشير سريع POS بنقرة واحدة، طباعة وصل حراري احترافي." }
  ];

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          setIsPlaying(false);
        });
      }
    }
  };
  const handleMuteUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  const handleFullscreen = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (video.requestFullscreen) {
        video.requestFullscreen();
      } else if ((video as any).webkitEnterFullscreen) {
        (video as any).webkitEnterFullscreen(); // iOS Safari fallback
      } else if ((video as any).msRequestFullscreen) {
        (video as any).msRequestFullscreen();
      }
    }
  };
  const handleChapterClick = (time: number, index: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setActiveChapter(index);
      if (!isPlaying) {
        videoRef.current.play().then(() => {
          setIsPlaying(true);
        });
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) { // 500MB limit
        setUploadError("حجم الفيديو كبير جداً. يرجى اختيار فيديو أقل من 500 ميغابايت.");
        setUploadSuccess(false);
        return;
      }
      setUploadError(null);
      setUploadSuccess(false);
      
      // Revoke previous blob URL to avoid memory leaks
      if (videoSrc.startsWith("blob:")) {
        URL.revokeObjectURL(videoSrc);
      }
      
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
      setIsPlaying(false);
      
      // Load and auto-play the newly uploaded video
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load(); // reload source
          videoRef.current.play().then(() => {
            setIsPlaying(true);
            setUploadSuccess(true);
          }).catch(() => {
            setUploadSuccess(true); // still success even if autoplay blocked
          });
        } else {
          setUploadSuccess(true);
        }
      }, 300);
    }
  };

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoLinkInput.trim()) return;
    
    // Check if it looks like a video link
    if (videoLinkInput.includes("youtube.com") || videoLinkInput.includes("youtu.be")) {
      // For YouTube, since standard video tags don't play YouTube directly, we can map it to an embed or convert it.
      // But to maintain standard HTML5 playing, let's inform user or set it (we will support standard iframe if it's youtube, or direct mp4 url)
      setVideoSrc(videoLinkInput);
      setUploadSuccess(true);
      setUploadError(null);
    } else if (videoLinkInput.startsWith("http")) {
      setVideoSrc(videoLinkInput);
      setUploadSuccess(true);
      setUploadError(null);
    } else {
      setUploadError("الرجاء إدخال رابط صالح يبدأ بـ http أو https");
      setUploadSuccess(false);
    }
  };
  
  // Trial Register Form State
  const [storeName, setStoreName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [phone2, setPhone2] = useState("");
  const [hasWhatsapp, setHasWhatsapp] = useState<"yes" | "no">("yes");
  const [paymentMethod, setPaymentMethod] = useState("ccp");
  const [deliveryType, setDeliveryType] = useState("home");
  const [programType, setProgramType] = useState("both");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [showSuccessDownloads, setShowSuccessDownloads] = useState(false);
  const [downloadToast, setDownloadToast] = useState<{
    show: boolean;
    type: "info" | "success" | "error";
    message: string;
  } | null>(null);

  const registerTrial = useMutation(api.orders.create);

  const startDownload = async (filename: string) => {
    if (filename === "Setup.exe") {
      setDownloadToast({
        show: true,
        type: "info",
        message: "جاري تحويلك إلى صفحة التحميل على Google Drive..."
      });

      try {
        // Open the shared Google Drive folder in a new tab
        window.open("https://drive.google.com/drive/folders/1vtKQi5XgidR2DSzLcfaDSbAZVRIWaohv?usp=drive_link", "_blank");

        setDownloadToast({
          show: true,
          type: "success",
          message: "تم توجيهك بنجاح! يمكنك الآن تحميل الملف من مجلد Google Drive."
        });

        // Auto-hide success toast after 3 seconds
        setTimeout(() => {
          setDownloadToast(prev => prev?.type === "success" ? null : prev);
        }, 3000);
      } catch (error) {
        console.error("Download redirection error:", error);
        setDownloadToast({
          show: true,
          type: "error",
          message: "عذراً، حدث خطأ أثناء محاولة التوجيه لصفحة التحميل. يرجى المحاولة لاحقاً."
        });
      }
    } else {
      setDownloadToast({
        show: true,
        type: "info",
        message: "جاري التحقق من وجود الملف لبدء التنزيل المباشر..."
      });

      try {
        const response = await fetch(`/downloads/${filename}`, { method: "HEAD" });
        
        if (!response.ok) {
          throw new Error("File not found on server");
        }

        setDownloadToast({
          show: true,
          type: "success",
          message: "تم العثور على الملف! يبدأ التنزيل المباشر الآن..."
        });

        // Auto-hide success toast after 3 seconds
        setTimeout(() => {
          setDownloadToast(prev => prev?.type === "success" ? null : prev);
        }, 3000);

        const link = document.createElement("a");
        link.href = `/downloads/${filename}`;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Download verification error:", error);
        setDownloadToast({
          show: true,
          type: "error",
          message: "عذراً، هذا الملف غير متوفر حالياً للتنزيل المباشر. يرجى الاتصال بالدعم الفني."
        });
      }
    }
  };

  // Faq State
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Tutorials Accordion State
  const [tutorialOpen, setTutorialOpen] = useState<number | null>(null);
  const [activeTutorialTab, setActiveTutorialTab] = useState<"computer" | "phone">("computer");

  // System Screenshots Gallery States
  const [selectedLightboxImage, setSelectedLightboxImage] = useState<any | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setIsDragging(true);
    setStartX(e.pageX - container.offsetLeft);
    setScrollLeftState(container.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const container = scrollContainerRef.current;
    if (!container) return;
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX) * 1.5;
    container.scrollLeft = scrollLeftState - walk;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollPosition = container.scrollLeft;
    const width = container.clientWidth;
    if (width === 0) return;
    const index = Math.round(Math.abs(scrollPosition) / width);
    if (index >= 0 && index < systemImages.length) {
      setActiveSlideIndex(index);
    }
  };

  const scrollToSlide = (idx: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const slideElement = container.children[idx] as HTMLElement;
    if (slideElement) {
      slideElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center"
      });
      setActiveSlideIndex(idx);
    }
  };

  const handleUploadImage = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setSystemImages((prev) =>
          prev.map((img) => (img.id === id ? { ...img, uploadedUrl: dataUrl } : img))
        );
        // Also update lightbox if currently viewing the same image
        setSelectedLightboxImage((current: any) => {
          if (current && current.id === id) {
            return { ...current, uploadedUrl: dataUrl };
          }
          return current;
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (id: string) => {
    setSystemImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, uploadedUrl: undefined } : img))
    );
    setSelectedLightboxImage((current: any) => {
      if (current && current.id === id) {
        return { ...current, uploadedUrl: undefined };
      }
      return current;
    });
  };

  const [systemImages, setSystemImages] = useState<any[]>([
    {
      id: "img_splash",
      title: "شاشة الترحيب والدخول الموحد بالنظام",
      description: "بوابة دخول مشفرة وآمنة لحماية بيانات المحل التجاري وتأمين الكاشير والمسؤولين.",
      category: "pos",
      uploadedUrl: "/assets/fonzon_splash.png"
    },
    {
      id: "img_dashboard",
      title: "لوحة التحكم الرئيسية والإحصائيات الحية",
      description: "متابعة المبيعات اليومية، أرباح الصيانة، وحجم السيولة النقدية المتوفرة بالصندوق وأرقام النمو لحظياً.",
      category: "pos",
      uploadedUrl: "/assets/fonzon_dashboard.png"
    },
    {
      id: "img_pos_cashier",
      title: "واجهة البيع السريعة POS (الكاشير المطور)",
      description: "البيع السريع بالبحث الفوري والتصنيف للمنتجات وإضافة الطلبات للسلة وإتمام الدفع كاش أو بطاقة.",
      category: "pos",
      uploadedUrl: "/assets/fonzon_pos.png"
    },
    {
      id: "img_pos",
      title: "إدارة المخزن بالباركود والـ IMEI",
      description: "تتبع وحصر ذكي ومحكم للسلع وإكسسوارات الهواتف مع الرقم التسلسلي الفريد لكل هاتف لمنع التداخل.",
      category: "stock",
      uploadedUrl: "/assets/fonzon_inventory.png"
    },
    {
      id: "img_stock",
      title: "إضافة جهاز جديد بالنظام ومواصفاته",
      description: "إدخال الهواتف الجديدة والمستعملة وتفاصيلها بدقة وتجهيزها للبيع والضمان.",
      category: "stock",
      uploadedUrl: "/assets/fonzon_add_device.png"
    },
    {
      id: "img_accessories",
      title: "متجر وقسم إدارة الملحقات والإكسسوارات",
      description: "جرد وتصنيف الكابلات والشواحن والكفرات والسماعات وتنبيهات النواقص بالمخزن.",
      category: "stock",
      uploadedUrl: "/assets/fonzon_accessories.png"
    },
    {
      id: "img_maintenance",
      title: "لوحة الفحص الظاهري ورصد الأضرار بهيكل الهاتف",
      description: "رسم تمثيلي يتيح للتقني رصد أماكن الكسور والخدوش قبل الاستلام الفعلي.",
      category: "maintenance",
      uploadedUrl: "/assets/fonzon_inspection.png"
    },
    {
      id: "img_spare_parts",
      title: "إدارة قطع الغيار والملحقات بالمخزن",
      description: "تتبع وإدارة شاشات الهواتف والبطاريات والقطع المتوفرة وتكلفتها بدقة.",
      category: "stock",
      uploadedUrl: "/assets/fonzon_spare_parts.png"
    },
    {
      id: "img_add_spare_part",
      title: "إضافة قطعة غيار وتحديد تنبيه الحد الأدنى",
      description: "تسجيل بيانات القطع المشتراة، سعر الشراء وسعر البيع وتعيين تنبيهات النفاد.",
      category: "stock",
      uploadedUrl: "/assets/fonzon_add_spare_part.png"
    },
    {
      id: "img_maintenance_list",
      title: "جدول تتبع طلبات وأوامر الصيانة الحية",
      description: "متابعة شاملة لجميع الأجهزة المستلمة وتوزيع الأدوار على تقنيي المحل والتقدم في العمل.",
      category: "maintenance",
      uploadedUrl: "/assets/fonzon_maintenance_list.png"
    },
    {
      id: "img_maintenance_ticket_1",
      title: "إصدار أمر إصلاح وتذكرة صيانة للزبون",
      description: "تسجيل عطل الهاتف والتقني المسؤول، وحفظ الحالة الظاهرية للجهاز عند الاستلام.",
      category: "maintenance",
      uploadedUrl: "/assets/fonzon_maintenance_ticket_1.png"
    },
    {
      id: "img_maintenance_ticket_2",
      title: "إتمام أمر الصيانة وتحديد التكلفة الإجمالية",
      description: "تحديد قطع الغيار المستخدمة، تكلفة اليد العاملة والربح الصافي وإشعار العميل فوراً.",
      category: "maintenance",
      uploadedUrl: "/assets/fonzon_maintenance_ticket_2.png"
    },
    {
      id: "img_invoices",
      title: "لوحة تتبع الفواتير والضمان والمبيعات",
      description: "مراقبة الفواتير الصادرة وتواريخها وتفاصيل الدفع وحالتها الضمانية للزبائن.",
      category: "pos",
      uploadedUrl: "/assets/fonzon_invoices.png"
    },
    {
      id: "img_sales_log",
      title: "سجل حركات المبيعات والعمليات السابقة",
      description: "سجل كامل وتاريخي لجميع المنتجات والقطع المباعة وحالة السداد لكل عملية كاشير.",
      category: "pos",
      uploadedUrl: "/assets/fonzon_sales_log.png"
    },
    {
      id: "img_customers",
      title: "إدارة بيانات وحسابات زبائن المحل",
      description: "تسجيل حسابات الزبائن وتتبع ديونهم (الكريدي) وسجل مدفوعاتهم مع إمكانية السداد الفوري.",
      category: "mobile",
      uploadedUrl: "/assets/fonzon_customers.png"
    },
    {
      id: "img_loyalty",
      title: "برنامج الولاء والخصومات والمكافآت",
      description: "إعداد نقاط المكافأة التلقائية للعملاء الأوفياء والخصومات عند تكرار الشراء من متجرك.",
      category: "mobile",
      uploadedUrl: "/assets/fonzon_loyalty.png"
    },
    {
      id: "img_suppliers",
      title: "إدارة حسابات وديون الموردين والشركاء",
      description: "تنظيم الفواتير الآجلة وتواريخ السداد مع الموردين ومتابعة المدفوعات.",
      category: "stock",
      uploadedUrl: "/assets/fonzon_suppliers.png"
    },
    {
      id: "img_add_supplier",
      title: "إضافة مورد جديد للنظام وتقييمه",
      description: "تسجيل بيانات الموردين ونوع البضاعة وشروط الدفع والتعامل المالي المباشر.",
      category: "stock",
      uploadedUrl: "/assets/fonzon_add_supplier.png"
    },
    {
      id: "img_employees",
      title: "إدارة صلاحيات وحسابات الموظفين والعمال",
      description: "إضافة عمال المحل وتوزيع الصلاحيات (كاشير، تقني صيانة، مدير مخزن) وتتبع المبيعات.",
      category: "pos",
      uploadedUrl: "/assets/fonzon_employees.png"
    },
    {
      id: "img_reports",
      title: "التقارير التحليلية والرسوم البيانية للأداء",
      description: "متابعة المبيعات اليومية والشهرية وتوزيع الأرباح ومر دودية الموظفين تفصيلياً.",
      category: "pos",
      uploadedUrl: "/assets/fonzon_reports.png"
    },
    {
      id: "img_accounting",
      title: "الحسابات العامة والمالية للمحل",
      description: "متابعة شاملة للمصاريف، المداخيل، الأرباح الإجمالية والصافية وتوازن الصناديق.",
      category: "pos",
      uploadedUrl: "/assets/fonzon_accounting.png"
    },
    {
      id: "img_accounting_pos",
      title: "سجل مبيعات نقطة البيع بالمالية",
      description: "عرض حركات وصافي مبيعات الكاشير المباشرة وتأثيرها على السيولة النقدية اليومية.",
      category: "pos",
      uploadedUrl: "/assets/fonzon_accounting_pos.png"
    },
    {
      id: "img_expenses",
      title: "تسجيل ومتابعة مصاريف المحل",
      description: "تقييد كافة التكاليف التشغيلية (كراء، كهرباء، أجور عمال) لمطابقتها مع الأرباح.",
      category: "pos",
      uploadedUrl: "/assets/fonzon_expenses.png"
    },
    {
      id: "img_expense_categories",
      title: "تصنيف وتبويب بنود المصاريف",
      description: "إنشاء وتبويب فئات المصاريف (الفواتير، المستلزمات المكتبية، الإعلانات) لتسهيل الفرز.",
      category: "pos",
      uploadedUrl: "/assets/fonzon_expense_categories.png"
    },
    {
      id: "img_installments",
      title: "تسيير عقود البيع بالتقسيط للزبائن",
      description: "تتبع الأقساط الشهرية المحصلة والمتبقية وعقود التسهيل مع العملاء.",
      category: "mobile",
      uploadedUrl: "/assets/fonzon_installments.png"
    },
    {
      id: "img_tracking",
      title: "تتبع حالة التصليح المباشر للزبون وطباعة الوصل",
      description: "توليد وتلقي وصل استلام حراري وميزة تتبع لحظية لخطوات تصليح الجهاز على الهاتف تزيد ثقة عملائك.",
      category: "mobile",
    },
    {
      id: "img_zakat",
      title: "موديول تصفية وحساب زكاة المال وعائدات المحل",
      description: "حساب وعاء الزكاة السنوي آلياً بناء على مخزونك المادي، ديونك وديون الموردين ومطابقتها مع النصاب الشرعي بالجزائر.",
      category: "zakat",
    }
  ]);



  // 1. Algerian Testimonials List (Cairo, Oran, Constantine, Setif, Djelfa, Tlemcen, etc.)
  const testimonials: Testimonial[] = [
    {
      id: "t1",
      name: "ياسين غربي",
      storeName: "Oran Phone Center",
      city: "وهران",
      avatar: "ي",
      rating: 5,
      text: "برنامج لا يعلى عليه! كنا نعاني في متابعة قطع غيار شاشات الآيفون وبطاريات السامسونج وتكلفتها بدقة، وبفضل نظام الصيانة في ألجورا سيستمز أصبحنا نعرف هامش ربحنا الصافي في كل عملية إصلاح، والجميل هو إشعار الزبون بـ SMS بمجرد تصليح جهازه!"
    },
    {
      id: "t2",
      name: "فاتح بوزيد",
      storeName: "الهضاب موبايل",
      city: "سطيف",
      avatar: "ف",
      rating: 5,
      text: "ما أعجبني جداً هو الكواشير السريع المتوافق مع طابعتنا الحرارية 80 ملم وماسح الباركود الصغير. قمنا برقمنة أكثر من 1200 إكسسوار وعلبة حماية وهاتف في المخزن بضعة أيام فقط. الدعم الفني الجزائري قمة في الأخلاق والمهنية وثبّتوا لنا كل شيء عن بعد."
    },
    {
      id: "t3",
      name: "سعيد نايل",
      storeName: "البركة للاتصالات",
      city: "الجلفة",
      avatar: "س",
      rating: 5,
      text: "لوجيسيال رائع يدعم حساب الزكاة تلقائياً، وهذا أكثر شيء أسعدني كصاحب محل تجاري ملتزم. تسيير الكريدي للزبائن والديون للموردين دقيق جداً ولم نعد نفقد أي فلس بعد اليوم. تفعيل باقتنا السنوية تم فورا عبر بريدي موب."
    }
  ];

  // 2. Subscription Plans Definition (Local prices, CCP/Baridimob support)
  const plans: SubscriptionPlan[] = [
    {
      id: "p_both",
      name: "باقة تطبيق هاتف مع حاسوب",
      price: "20,000 دج",
      oldPrice: "22,000 دج",
      period: "سنة",
      badge: "الأكثر طلباً وتوفيراً 🔥",
      description: "التكامل والتحكم المطلق! لوجيسيال حاسوب متكامل لإدارة البيع مع تطبيق هاتف ذكي متزامن كلياً للمتابعة اللحظية.",
      features: [
        "لوجيسيال حاسوب (ويندوز) + تطبيق هاتف",
        "مزامنة سحابية فورية وتلقائية بين الأجهزة",
        "تسيير المخزون المتقدم بالـ IMEI والباركود",
        "لوحة تحكم إدارية شاملة من الهاتف والحاسوب",
        "موديول صيانة وإصلاح أجهزة متكامل ومتزامن",
        "دعم فني مخصص وأولوية في التحديثات",
        "نسخ احتياطي يومي مجدول تلقائياً"
      ],
      ctaText: "اطلب الباقة الكاملة الآن",
      color: "border-purple-500/50 hover:border-purple-500 bg-gradient-to-b from-purple-950/20 via-slate-950 to-slate-950 relative shadow-xl shadow-purple-900/10"
    },
    {
      id: "p_mobile_only",
      name: "باقة تطبيق هاتف فقط",
      price: "12,000 دج",
      period: "سنة",
      description: "تطبيق أندرويد و آيفون مخصص لإدارة محلك ومتابعة مبيعاتك ومخزونك أينما كنت مباشرة من هاتفك.",
      features: [
        "تطبيق هاتف ذكي (أندرويد / iOS)",
        "متابعة المخزن وحالة الأجهزة مباشرة",
        "مراقبة الكاشير والعمال عن بعد",
        "تقارير وإشعارات حية ومباشرة",
        "إضافة وتعديل المنتجات بالهاتف",
        "تحديثات مجانية مستمرة للبرنامج"
      ],
      ctaText: "اطلب باقة الهاتف",
      color: "border-slate-800 hover:border-slate-700 bg-slate-950/40"
    },
    {
      id: "p_pc_only",
      name: "باقة لوجيسيال حاسوب فقط",
      price: "12,000 دج",
      period: "سنة",
      description: "برنامج متكامل على نظام ويندوز لتسيير الكواشير والمبيعات والمخازن والصيانة باحترافية تامة.",
      features: [
        "لوجيسيال منصب على الحاسوب (ويندوز)",
        "تسيير المخزون بالباركود و IMEI",
        "موديول صيانة الهواتف المتقدم",
        "تقارير المبيعات والأرباح الصافية",
        "تسيير ديون الزبائن والكريدي",
        "نسخ احتياطي سحابي تلقائي"
      ],
      ctaText: "اطلب باقة الحاسوب",
      color: "border-slate-800 hover:border-slate-700 bg-slate-950/40"
    }
  ];

  // 3. FAQs Definition
  const faqs = [
    {
      q: "كيف تتم عملية تفعيل الاشتراك بعد دفع قيمة الباقة؟",
      a: "بمجرد إتمام الدفع بأي من طرقنا المحلية (بريدي موب، CCP، ريدوت باي)، يمكنك تصوير وصل الدفع وإرساله لفريق دعمنا عبر واتساب أو تسجيل تذكرة دعم فني. سيقوم مهندس الدعم بتفعيل ترخيصك مباشرة عن بعد ولن تفقد أي بيانات سجلتها في الفترة التجريبية."
    },
    {
      q: "هل يعمل البرنامج أوفلاين دون الحاجة للإنترنت؟",
      a: "نعم! اللوجيسيال يدعم العمل أوفلاين بالكامل داخل المحل لحفظ مبيعاتك ومخزونك اليومي، مع إمكانية المزامنة السحابية الاحتياطية بمجرد توفر اتصال بالإنترنت لضمان سلامة قاعدة بياناتك من الضياع في حال تلف الحاسوب."
    },
    {
      q: "هل يدعم البرنامج طابعات الفواتير الصينية وماسحات الباركود الرخيصة؟",
      a: "بالتأكيد! نظام Algora Systems مصمم ليدعم العمل المباشر مع 99% من معدات الكاشير المتوفرة بالجزائر، بما في ذلك طابعات 58mm و80mm الصينية وماسحات الباركود السلكية واللاسلكية دون الحاجة لتعريفات معقدة."
    },
    {
      q: "ماذا يحدث بعد انتهاء الفترة التجريبية لـ 5 أيام؟",
      a: "البرنامج لن يحذف بياناتك إطلاقاً! سيتوقف الكاشير مؤقتاً لحين اختيارك إحدى الباقات (الشهرية أو السنوية) وتفعيلها بمساعدة فريق دعمنا، وبمجرد التفعيل ستستأنف عملك بشكل طبيعي مع نفس السلع والزبائن المسجلين مسبقاً."
    }
  ];

  // 4. Tutorial Definitions with Google Drive download links
  const tutorials = [
    {
      title: "كيفية تحميل وتثبيت لوجيسيال Algora Systems على الحاسوب",
      desc: "اضغط على زر التحميل أدناه للحصول على ملف التثبيت (Setup) مباشرة. بعد التحميل، شغّل الملف وسيبدأ معالج التثبيت خطوة بخطوة تلقائياً.",
      driveUrl: "https://drive.google.com/drive/folders/1GFDi3qJWiB0hPWpPf0p8oZcfT9yOsVl7",
      driveLabel: "تحميل لوجيسيال Algora PC",
      category: "computer" as const
    },
    {
      title: "كيفية إضافة السلع والمنتجات وضبط كميات المخزون بالباركود والـ IMEI",
      desc: "بعد تثبيت البرنامج، ابدأ بإضافة سلعك بسهولة. راجع دليل المستخدم أو تواصل مع فريق الدعم للمساعدة.",
      driveUrl: "https://drive.google.com/drive/folders/1GFDi3qJWiB0hPWpPf0p8oZcfT9yOsVl7",
      driveLabel: "تحميل لوجيسيال Algora PC",
      category: "computer" as const
    },
    {
      title: "إدارة ورشة الصيانة واستلام أجهزة الزبائن وتتبع العطل",
      desc: "استخدم وحدة الصيانة المدمجة في البرنامج لإدارة الطلبات وتتبع العطل. حمّل البرنامج أولاً للبدء.",
      driveUrl: "https://drive.google.com/drive/folders/1GFDi3qJWiB0hPWpPf0p8oZcfT9yOsVl7",
      driveLabel: "تحميل لوجيسيال Algora PC",
      category: "computer" as const
    },
    {
      title: "كيفية تفعيل الاشتراك وإدخال مفتاح الترخيص بعد الدفع",
      desc: "بعد الدفع سيصلك مفتاح الترخيص عبر الواتساب. شغّل البرنامج وأدخل المفتاح في خانة التفعيل.",
      driveUrl: "https://drive.google.com/drive/folders/1GFDi3qJWiB0hPWpPf0p8oZcfT9yOsVl7",
      driveLabel: "تحميل لوجيسيال Algora PC",
      category: "computer" as const
    },
    {
      title: "كيفية ربط تطبيق الهاتف وتفعيل المزامنة السحابية",
      desc: "حمّل تطبيق الهاتف من الرابط أدناه، ثم افتح البرنامج على حاسوبك لمسح رمز QR ومزامنة البيانات.",
      driveUrl: "https://drive.google.com/drive/folders/1GFDi3qJWiB0hPWpPf0p8oZcfT9yOsVl7",
      driveLabel: "تحميل تطبيق Algora Mobile",
      category: "phone" as const
    },
    {
      title: "متابعة المبيعات والتقارير الفورية والأرباح من الهاتف",
      desc: "بعد تثبيت تطبيق الهاتف ومزامنته، يمكنك متابعة مبيعاتك وأرباحك من أي مكان وفي أي وقت.",
      driveUrl: "https://drive.google.com/drive/folders/1GFDi3qJWiB0hPWpPf0p8oZcfT9yOsVl7",
      driveLabel: "تحميل تطبيق Algora Mobile",
      category: "phone" as const
    },
    {
      title: "إجراء عمليات الجرد السريع وقراءة الباركود عبر كاميرا الهاتف",
      desc: "استخدم كاميرا هاتفك كقارئ باركود مباشرة داخل التطبيق. حمّل التطبيق من الرابط أدناه للبدء.",
      driveUrl: "https://drive.google.com/drive/folders/1GFDi3qJWiB0hPWpPf0p8oZcfT9yOsVl7",
      driveLabel: "تحميل تطبيق Algora Mobile",
      category: "phone" as const
    }
  ];

  // Submit trial request to API
  const handleRegisterTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !ownerName || !phone || !city || !province) {
      setSubmitStatus({ error: "الرجاء تعبئة جميع الحقول لتتمكن من التسجيل." });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setShowSuccessDownloads(false);

    try {
      const finalPaymentMethod = paymentMethod === "cod" 
        ? `cod - ${deliveryType}`
        : paymentMethod;

      const result = await registerTrial({
        storeName,
        ownerName,
        phonePrimary: phone,
        phoneSecondary: phone2 || "",
        province,
        city,
        packageType: programType,
        packagePrice: programType === "both" ? 20000 : 12000,
        paymentMethod: finalPaymentMethod,
        notes: notes || "",
      });

      setSubmitStatus({ 
        success: true, 
        message: "تم تسجيل طلبك للنسخة التجريبية بنجاح! سيتصل بك فريق الدعم الفني خلال ساعات لتفعيل حسابك وإرسال بيانات الدخول." 
      });
      
      // Track Meta Pixel Lead event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq('track', 'Lead');
      }

      // Clear forms
      setStoreName("");
      setOwnerName("");
      setPhone("");
      setPhone2("");
      setCity("");
      setProvince("");
      setNotes("");
      
      // Save to client localStorage as well so they can remember they requested it
      localStorage.setItem("algora_trial_requested", "true");
      localStorage.setItem("algora_trial_details", JSON.stringify({ 
        id: result.id, 
        orderNumber: result.orderNumber, 
        storeName, 
        ownerName, 
        phonePrimary: phone 
      }));
    } catch (err) {
      setSubmitStatus({ error: "فشل الاتصال بالخادم. يرجى محاولة التسجيل مجدداً أو الاتصال بـ 0553361047" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-24 pb-16 text-right">
      
      {/* 1. HERO SECTION (Welcoming Introduction) */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[200px] h-[200px] bg-indigo-600/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/25 rounded-full text-purple-400 text-xs font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>النسخة المتكاملة لإدارة محلات الهواتف والصيانة في الجزائر 🇩🇿</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-100 leading-tight tracking-tight"
          >
            سيّر محلك بذكاء واحترافية وضاعف مبيعاتك مع <span className="text-transparent bg-clip-text bg-gradient-to-l from-purple-400 via-violet-400 to-indigo-300">Algora Systems</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            لوجيسيال متكامل وسهل الاستخدام صمم خصيصاً للتجار الجزائريين لتنظيم المبيعات، ضبط كميات المخزون بالباركود والـ IMEI، تتبع أجهزة الصيانة، وإشعار الزبائن، مع توافق تام مع طرق الدفع المحلية (بريدي موب، CCP).
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
          >
            <a
              href="#trial-form-section"
              onClick={() => {
                const el = document.getElementById("trial-form-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="py-3 px-6 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-lg shadow-purple-900/40 transition-all text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer group"
            >
              جرب النظام مجاناً لمدة 5 أيام
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </a>

            <a
              href="https://wa.me/213553361047?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D9%86%D8%B8%D8%A7%D9%85%20Algora%20%D9%88%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B5%D9%88%D9%84%20%D8%B9%D9%84%D9%89%20%D9%86%D8%B3%D8%AE%D8%AA%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9"
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-6 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 font-bold rounded-xl transition-all text-xs md:text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>اطلب نسختك التجريبية عبر واتساب</span>
              <Smartphone className="w-4 h-4 text-emerald-400" />
            </a>
          </motion.div>

          {/* Quick numbers/badges from poster */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-10 text-center"
          >
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900">
              <span className="text-xl md:text-2xl font-black text-purple-400 font-mono">+40%</span>
              <p className="text-[10px] md:text-xs text-slate-400 mt-1 font-bold">زيادة في المبيعات</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900">
              <span className="text-xl md:text-2xl font-black text-purple-400 font-mono">-70%</span>
              <p className="text-[10px] md:text-xs text-slate-400 mt-1 font-bold">أخطاء وجرد أقل للسلع</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900">
              <span className="text-xl md:text-2xl font-black text-purple-400 font-mono">24/7</span>
              <p className="text-[10px] md:text-xs text-slate-400 mt-1 font-bold">دعم فني وتواصل محلي</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-900">
              <span className="text-xl md:text-2xl font-black text-purple-400 font-mono">100%</span>
              <p className="text-[10px] md:text-xs text-slate-400 mt-1 font-bold">متوافق مع طابعات الجزائر</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHATSAPP CTA BADGE IN GAP */}
      <div className="flex justify-center -mt-4 mb-10 relative z-20">
        <a
          href="https://wa.me/213553361047?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D9%86%D8%B8%D8%A7%D9%85%20Algora%20%D9%88%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B5%D9%88%D9%84%20%D8%B9%D9%84%D9%89%20%D9%86%D8%B3%D8%AE%D8%AA%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative inline-flex items-center gap-2.5 px-6 py-3 bg-slate-900 border border-[#25D366]/40 rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-[0_0_25px_rgba(37,211,102,0.25)] hover:shadow-[0_0_35px_rgba(37,211,102,0.4)] hover:-translate-y-1"
        >
          {/* Subtle pulse behind the icon */}
          <div className="absolute right-6 w-5 h-5 bg-[#25D366] rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity animate-pulse"></div>
          
          <Smartphone className="w-5 h-5 text-[#25D366] relative z-10" />
          <span className="text-slate-100 text-[15px] font-bold relative z-10">اطلب نسختك التجريبية عبر واتساب</span>
        </a>
      </div>

      {/* 1.5 SYSTEM VIDEO DEMONSTRATION SECTION */}
      <section id="demo-video-section" className="relative py-6 overflow-hidden">
        {/* Decorative ambient blurred shapes */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-2 md:px-6 space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-black">
              <Video className="w-4 h-4" />
              <span>فيديو توضيحي تفاعلي للنظام</span>
            </span>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-slate-100 leading-tight">
              اكتشف ميزات Algora Systems في دقيقتين قبل تفعيل حسابك
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              شاهد كيف يسهّل لك اللوجيسيال بيع السلع وإدخال الـ IMEI وإدارة ورشة الصيانة باحترافية كاملة.
            </p>
          </div>

          {/* Centered Video Player Display - Larger and with minimum height for mobile */}
          <div className="relative w-full aspect-video min-h-[420px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[600px] xl:min-h-[680px] 2xl:min-h-[780px] rounded-2xl bg-slate-950 border border-slate-900 overflow-hidden shadow-2xl group transition-all duration-300">
            
            {/* YouTube Link or Direct Link Handler */}
            {videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be") ? (
              <iframe
                src={videoSrc.replace("watch?v=", "embed/").split("&")[0]}
                title="Algora Systems Video Demo"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                  onClick={handlePlayPause}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onError={(e) => {
                    console.error('Video failed to load:', e);
                  }}
                >
                  <source src={videoSrc} type="video/mp4" />
                  <source src={videoSrc.replace('.mp4', '.mov')} type="video/quicktime" />
                  متصفحك لا يدعم تشغيل الفيديو
                </video>

                {/* Styled Player Controls Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-end gap-3">
                  {/* Mute/Unmute control */}
                  <button
                    onClick={handleMuteUnmute}
                    className="w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer border border-slate-800/80"
                    title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 text-purple-400" />}
                  </button>

                  {/* Fullscreen control */}
                  <button
                    onClick={handleFullscreen}
                    className="w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 flex items-center justify-center cursor-pointer border border-slate-800/80"
                    title="ملء الشاشة"
                  >
                    <Maximize2 className="w-5 h-5 text-indigo-400" />
                  </button>
                </div>

                {/* Big Center Play Button (Visible when paused) */}
                {!isPlaying && (
                  <button
                    onClick={handlePlayPause}
                    className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-purple-600/95 hover:bg-purple-500 hover:scale-110 text-white flex items-center justify-center shadow-2xl shadow-purple-950/50 cursor-pointer transition-all active:scale-95 border border-purple-500/20"
                  >
                    <Play className="w-9 h-9 fill-white translate-x-0.5" />
                  </button>
                )}
              </>
            )}


          </div>



          {/* Under video: Button "اطلب نسخة" */}
          <div className="flex flex-col items-center justify-center pt-2 pb-4 space-y-2">
            <button
              onClick={() => {
                const el = document.getElementById("trial-form-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-8 py-4 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm md:text-base rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl hover:shadow-purple-500/25 active:scale-95 cursor-pointer"
            >
              <Award className="w-5 h-5" />
              <span>اطلب نسختك التجريبية المجانية الآن ⚡</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>

        </div>
      </section>
      {/* 7. FREE TRIAL REQUEST FORM SECTION - DESIGNED IN BEAUTIFUL WHITE / LIGHT GRAY */}
      <section id="trial-form-section" ref={trialFormRef} className="bg-gradient-to-br from-white via-slate-50 to-purple-50/40 border border-slate-200/80 rounded-3xl p-6 md:p-10 relative overflow-hidden text-right shadow-sm text-slate-900">
        
        {/* Soft elegant ambient glows for light mode */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full text-purple-600 text-xs font-bold">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              <span>جرب نظامنا بالكامل 5 أيام مجاناً</span>
            </div>
            <h2 className="text-xl md:text-3xl font-black text-slate-900 leading-tight">اطلب تفعيل نسختك التجريبية المجانية في ثوانٍ معدودة</h2>
            <div className="h-px bg-slate-200/60" />

            <div className="bg-slate-100/80 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <p className="font-bold text-purple-700">⚡ ماذا يشتمل طلب التجربة المجانية؟</p>
              <ul className="space-y-1.5 text-slate-600">
                <li className="flex items-center gap-2 justify-end"><span>5 أيام كاملة دون أي التزام أو دفع مسبق</span> <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /></li>
                <li className="flex items-center gap-2 justify-end"><span>دعم فني كامل هاتفياً وعبر AnyDesk للتثبيت مجاناً</span> <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /></li>
                <li className="flex items-center gap-2 justify-end"><span>إمكانية الاحتفاظ بكافة السلع التي جردتها بعد الاشتراك</span> <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /></li>
              </ul>
            </div>
          </div>

          {/* Form container card (White theme with smooth shadows) */}
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xl shadow-slate-200/40 space-y-4">
            
            <AnimatePresence mode="wait">
              {submitStatus?.success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-5 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-emerald-850 space-y-4 flex flex-col items-center text-center shadow-lg"
                >
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-inner">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-black text-base text-slate-900 leading-tight">شكرًا جزيلاً لك! تم تسجيل طلبك بنجاح 🎉</h3>
                    <p className="text-xs text-slate-700 font-extrabold leading-relaxed">
                      {submitStatus.message}
                    </p>
                    <p className="text-[11px] text-slate-500 font-bold leading-relaxed mt-1">
                      سيقوم وكيلنا الجزائري المحلي بالاتصال بك هاتفياً أو عبر واتساب لمساعدتك في تفعيل ترخيصك وتدريبك مجاناً.
                    </p>
                  </div>

                  <div className="w-full bg-white/95 p-4 rounded-xl border border-emerald-100/50 space-y-3.5 text-right shadow-inner">
                    <h4 className="text-xs font-black text-purple-950 flex items-center justify-end gap-1.5">
                      <span>هل ترغب في تحميل البرنامج وتجربته فوراً الآن؟</span>
                      <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-bold">
                      لقد وفرنا لك روابط تحميل مباشرة للنسخة التجريبية (للكمبيوتر والهاتف) لتبدأ بالاستكشاف والتجربة فوراً قبل حتى أن يتصل بك الدعم!
                    </p>
                    
                    {!showSuccessDownloads ? (
                      <button
                        type="button"
                        onClick={() => {
                          setShowSuccessDownloads(true);
                        }}
                        className="w-full py-2.5 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-lg flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-900/10 cursor-pointer active:scale-95"
                      >
                        <Download className="w-4 h-4 animate-pulse" />
                        <span>نعم، أريد تحميل النسخة التجريبية الآن 📥</span>
                      </button>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-2 pt-1 text-right"
                      >
                        <p className="text-[10px] text-emerald-800 font-bold mb-1.5 flex items-center justify-end gap-1">
                          <span>اختر الملف لبدء التحميل فوراً (بدون الانتقال لأسفل الصفحة):</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        </p>
                        
                        {/* Windows Link */}
                        <button
                          type="button"
                          onClick={() => {
                            startDownload("Setup.exe");
                          }}
                          className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg flex items-center justify-between gap-2 transition-all cursor-pointer active:scale-95"
                        >
                          <span className="font-mono text-[9px] opacity-75">Windows • 84 MB</span>
                          <span className="flex items-center gap-1">
                            <Laptop className="w-3.5 h-3.5" />
                            <span>تحميل مباشر للكمبيوتر</span>
                          </span>
                        </button>

                        {/* Android Link */}
                        <button
                          type="button"
                          onClick={() => {
                            startDownload("app-debug.apk");
                          }}
                          className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center justify-between gap-2 transition-all cursor-pointer active:scale-95"
                        >
                          <span className="font-mono text-[9px] opacity-75">Android APK • 18 MB</span>
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>تحميل تطبيق الهاتف (APK)</span>
                          </span>
                        </button>

                        {/* PDF Guide Link */}
                        <button
                          type="button"
                          onClick={() => {
                            startDownload("Algora_QuickStart_Guide.pdf");
                          }}
                          className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg flex items-center justify-between gap-2 transition-all cursor-pointer active:scale-95"
                        >
                          <span className="font-mono text-[9px] opacity-75">PDF • 2.4 MB</span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" />
                            <span>دليل البدء السريع</span>
                          </span>
                        </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {submitStatus?.error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex gap-2 items-start"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <p className="leading-relaxed font-bold">{submitStatus.error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {!submitStatus?.success && (
              <form onSubmit={handleRegisterTrial} className="space-y-4 text-right">
                
                <div>
                  <label className="block text-xs text-slate-600 font-bold mb-1">اسم المحل التجاري</label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="مثال: البهجة موبايل"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-600 font-bold mb-1">اسم ولقب صاحب المحل</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="مثال: يوسف جيلالي"
                    className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 font-bold mb-1">رقم الهاتف الأول (النشط بالجزائر)</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="مثال: 0553361047"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all text-right font-mono font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 font-bold mb-1">رقم الهاتف الثاني (اختياري)</label>
                    <input
                      type="tel"
                      value={phone2}
                      onChange={(e) => setPhone2(e.target.value)}
                      placeholder="مثال: 0666123456"
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all text-right font-mono font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 font-bold mb-1">الولاية</label>
                    <select
                      value={selectedWilayaCode}
                      onChange={(e) => {
                        const code = parseInt(e.target.value);
                        setSelectedWilayaCode(code);
                        const wilaya = wilayas.find(w => w.code === code);
                        setProvince(wilaya ? wilaya.name_ar : "");
                        setCity(""); // reset city
                      }}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-semibold appearance-none cursor-pointer"
                      required
                    >
                      <option value="" disabled>اختر الولاية...</option>
                      {wilayas.map(w => (
                        <option key={w.code} value={w.code}>
                          {w.code} - {w.name_ar}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-600 font-bold mb-1">المدينة (البلدية)</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-semibold appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                      disabled={!selectedWilayaCode}
                    >
                      <option value="" disabled>اختر البلدية...</option>
                      {selectedWilayaCode && getCommunesByWilaya(selectedWilayaCode as number).map((c: any) => (
                        <option key={c.code_commune} value={c.name_ar}>
                          {c.name_ar}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Program / Package Selection (Algora Software packages with prices) */}
                <div className="space-y-2">
                  <label className="block text-xs text-slate-600 font-bold mb-1 flex items-center justify-end gap-1.5">
                    <span>باقة البرنامج المطلوب تفعيله</span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  </label>
                  <div className="space-y-2 text-right">
                    {[
                      { 
                        id: "pc", 
                        name: "باقة لوجيسيال حاسوب فقط", 
                        price: "12,000 دج / سنة", 
                        icon: <Laptop className="w-4 h-4" />,
                        desc: "برنامج متكامل على نظام ويندوز لإدارة الكواشير والصيانة" 
                      },
                      { 
                        id: "mobile", 
                        name: "باقة تطبيق هاتف فقط", 
                        price: "12,000 دج / سنة", 
                        icon: <Smartphone className="w-4 h-4" />,
                        desc: "تطبيق أندرويد وآيفون متكامل لمتابعة محلك أينما كنت" 
                      },
                      { 
                        id: "both", 
                        name: "باقة تطبيق هاتف مع حاسوب معاً", 
                        price: "20,000 دج / سنة", 
                        icon: <Sparkles className="w-4 h-4" />,
                        desc: "التكامل والتحكم المطلق! (حاسوب + هاتف متزامن كلياً)",
                        badge: "الأكثر طلباً وتوفيراً 🔥" 
                      }
                    ].map((pkg) => {
                      const isSelected = programType === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setProgramType(pkg.id)}
                          className={`w-full p-3 rounded-xl text-right transition-all border flex items-start gap-3 cursor-pointer ${
                            isSelected
                              ? "bg-purple-50/75 border-purple-500 ring-1 ring-purple-500/30 text-slate-900 shadow-md shadow-purple-600/5"
                              : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100/80 hover:border-slate-300"
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isSelected ? "bg-purple-600 text-white" : "bg-slate-200/70 text-slate-600"}`}>
                            {pkg.icon}
                          </div>
                          <div className="flex-1 space-y-0.5 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-black text-slate-900">{pkg.name}</span>
                              <span className={`text-[11px] font-black shrink-0 ${isSelected ? "text-purple-700" : "text-purple-600"}`}>
                                {pkg.price}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium leading-relaxed truncate">{pkg.desc}</p>
                            {pkg.badge && (
                              <span className="inline-block mt-1 text-[9px] font-extrabold bg-amber-500/10 border border-amber-500/20 text-amber-700 px-2 py-0.5 rounded-full">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <div className="self-center shrink-0">
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? "border-purple-600 bg-purple-600 text-white" : "border-slate-300 bg-white"}`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* WhatsApp Check (Clean White/Emerald design) */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="block text-xs font-bold text-slate-700 flex items-center justify-end gap-1.5">
                    <span>هل رقم الهاتف هذا مرتبط بالواتساب؟</span>
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setHasWhatsapp("yes")}
                      className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                        hasWhatsapp === "yes"
                          ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/10"
                          : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      } border`}
                    >
                      نعم، يوجد واتساب
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasWhatsapp("no")}
                      className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                        hasWhatsapp === "no"
                          ? "bg-slate-700 border-slate-700 text-white shadow-md shadow-slate-700/10"
                          : "bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                      } border`}
                    >
                      لا، اتصال هاتفي فقط
                    </button>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="space-y-2">
                  <label className="block text-xs text-slate-600 font-bold mb-1 flex items-center justify-end gap-1.5">
                    <span>وسيلة الدفع المفضلة لتفعيل الاشتراك لاحقاً</span>
                    <CreditCard className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-right">
                    {[
                      { id: "ccp", name: "CCP", icon: "💳" },
                      { id: "baridimob", name: "بريدي موب", icon: "📱" },
                      { id: "cod", name: "دفع عند الاستلام", icon: "🤝" },
                    ].map((method) => {
                      const isSelected = paymentMethod === method.id;
                      return (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`p-2.5 rounded-xl text-center transition-all border cursor-pointer ${
                            isSelected
                              ? "bg-gradient-to-l from-purple-600 to-indigo-600 border-purple-600 text-white shadow-md shadow-purple-600/20"
                              : "bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center gap-1.5 py-1">
                            <span className="text-lg">{method.icon}</span>
                            <span className="text-xs font-black">{method.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {paymentMethod === "cod" && (
                    <div className="grid grid-cols-2 gap-2 text-right mt-2">
                      {[
                        { id: "office", name: "توصيل للمكتب" },
                        { id: "home", name: "توصيل للمنزل" },
                      ].map((sub) => {
                        const isSubSelected = deliveryType === sub.id;
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => setDeliveryType(sub.id)}
                            className={`p-2 rounded-lg text-xs font-bold text-center transition-all border cursor-pointer ${
                              isSubSelected
                                ? "bg-purple-100 border-purple-500 text-purple-700 shadow-sm"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            {sub.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs text-slate-600 font-bold mb-1">ملاحظات (اختياري)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="اكتب أي ملاحظات إضافية هنا..."
                    rows={2}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-semibold resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs md:text-sm rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-lg hover:shadow-purple-600/10 cursor-pointer active:scale-95"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        جاري معالجة طلب تفعيل ترخيصك...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        اطلب نسختك التجريبية وتفعيل الدعم الآن
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-slate-400 text-center font-semibold">
                  🔒 معلومات محلك محمية بالكامل ولا يتم مشاركتها أبداً مع جهات خارجية.
                </p>

              </form>
            )}

          </div>

        </div>

      </section>

      {/* SUBSCRIPTION PLANS & PRICING TABLE (Placed directly under the trial request form) */}
      <section className="space-y-12 py-8 border-t border-b border-slate-900/80 bg-slate-950/20 rounded-3xl p-6 md:p-10 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-black">
            <span>🏷️ خطط الترخيص والاشتراك السنوي</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black text-slate-100">أسعار الاشتراكات وباقات الترخيص المتاحة</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">خطط تسعير واضحة، اقتصادية ومناسبة تماماً لحجم ونوع نشاطك التجاري دون رسوم خفية.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch relative z-10">
          {plans.map((plan) => (
            <div key={plan.id} className={`${plan.color} border p-6 rounded-2xl flex flex-col justify-between space-y-6 text-right transition-all duration-200 hover:-translate-y-1 relative overflow-hidden`}>
              
              <div className="space-y-4">
                {plan.badge && (
                  <span className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-500 text-white font-extrabold text-[9px] rounded-full px-2.5 py-1 tracking-wider animate-pulse">
                    {plan.badge}
                  </span>
                )}
                
                <div className="pt-2">
                  <h3 className="font-extrabold text-base md:text-lg text-slate-100">{plan.name}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5">{plan.description}</p>
                </div>

                <div className="h-px bg-slate-900/80" />

                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="text-2xl md:text-3xl font-black text-purple-400 font-mono">{plan.price}</span>
                  {plan.oldPrice && (
                    <span className="text-sm font-bold text-slate-500 line-through decoration-red-500/50 decoration-2 mr-2">
                      {plan.oldPrice}
                    </span>
                  )}
                  <span className="text-xs text-slate-500">/ {plan.period}</span>
                </div>

                <div className="h-px bg-slate-900/80" />

                <ul className="text-xs text-slate-300 space-y-3">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 justify-end">
                      <span className="text-right text-slate-400">{feat}</span>
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <a
                  href="#trial-form-section"
                  onClick={() => {
                    const el = document.getElementById("trial-form-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center ${
                    plan.id === "p_both"
                      ? "bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/40 cursor-pointer"
                      : "bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 cursor-pointer"
                  }`}
                >
                  {plan.ctaText}
                </a>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* SYSTEM SCREENSHOTS & LIVE GALLERY SECTION */}
      <section 
        id="screenshots-gallery-section" 
        className="space-y-8 py-16 px-6 md:px-12 relative overflow-hidden"
      >
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-black">
            <Image className="w-4 h-4 text-purple-400" />
            <span>📸 لقطات حية من داخل النظام والتطبيق</span>
          </div>
          <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-white">
            معرض صور الواجهات الحقيقية
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            تنقّل بين لقطات الشاشة الحقيقية للوجيسيال وتطبيق الهاتف المرفق لاستعراض قوة وسهولة الاستخدام.
          </p>
        </div>

        {/* Carousel Slider - Enlarged and made fully swipable/draggable with no buttons */}
        <div className="max-w-6xl mx-auto relative z-10 px-0 md:px-4">
          
          {/* Main Frame Container */}
          <div className="relative bg-slate-900 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl hover:border-purple-500/50 transition-all duration-300">
            
            {/* Navigation Arrows (Desktop Only) */}
            <button
              onClick={() => scrollToSlide(activeSlideIndex === 0 ? systemImages.length - 1 : activeSlideIndex - 1)}
              className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-purple-400 border border-slate-700/80 hover:border-purple-500/50 hover:scale-105 transition-all shadow-md items-center justify-center cursor-pointer active:scale-95 group/btn"
              aria-label="الصورة السابقة"
            >
              <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSlide(activeSlideIndex === systemImages.length - 1 ? 0 : activeSlideIndex + 1)}
              className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-purple-400 border border-slate-700/80 hover:border-purple-500/50 hover:scale-105 transition-all shadow-md items-center justify-center cursor-pointer active:scale-95 group/btn"
              aria-label="الصورة التالية"
            >
              <ChevronLeft className="w-5 h-5 group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>

            {/* Scrollable drag container */}
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              className="overflow-x-auto flex snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {systemImages.map((img) => (
                <div
                  key={img.id}
                  className="w-full shrink-0 snap-center relative aspect-video md:aspect-[16/9] min-h-[380px] sm:min-h-[500px] md:min-h-[580px] lg:min-h-[660px] bg-[#0A0A10] flex items-center justify-center overflow-hidden"
                >
                  <div 
                    className="w-full h-full cursor-pointer relative"
                    onClick={() => {
                      if (!isDragging) {
                        setSelectedLightboxImage(img);
                      }
                    }}
                  >
                    <div className="w-full h-full select-none overflow-hidden pointer-events-none flex items-center justify-center bg-[#0A0A10]">
                      {img.uploadedUrl ? (
                        <img 
                          src={img.uploadedUrl} 
                          alt={img.title} 
                          className="w-full h-full object-contain max-h-full scale-[1.08] transition-transform"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <SystemMockup mockupId={img.id} />
                      )}
                    </div>
                    
                    {/* Subtle Grid overlay for that premium screen look */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none" />
                    
                    {/* Category Pill Tag */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="px-3 py-1 bg-purple-600/95 backdrop-blur-md rounded-full text-[10px] font-black text-white shadow-lg border border-purple-500/30">
                        {img.category === "pos" ? "الكواشير ولوحة التحكم" : img.category === "stock" ? "إدارة المخزن" : img.category === "maintenance" ? "ورشة الصيانة" : img.category === "zakat" ? "الزكاة والمالية" : "تتبع الزبون"}
                      </span>
                    </div>


                    {/* Maximize Fullscreen Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <div className="p-3.5 bg-purple-600 text-white rounded-full shadow-lg transform scale-90 hover:scale-100 transition-transform duration-300">
                        <Maximize2 className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation & Dots Indicators Bar */}
          <div className="flex items-center justify-between md:justify-center mt-6">
            
            {/* Mobile Previous Button */}
            <button
              onClick={() => scrollToSlide(activeSlideIndex === 0 ? systemImages.length - 1 : activeSlideIndex - 1)}
              className="md:hidden w-10 h-10 rounded-full bg-slate-900 text-slate-300 border border-slate-800 hover:border-purple-500/50 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              aria-label="الصورة السابقة"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2.5">
              {systemImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    activeSlideIndex === idx 
                      ? "w-8 bg-purple-600 shadow-md shadow-purple-900/30" 
                      : "w-2 bg-slate-700 hover:bg-slate-600"
                  }`}
                  aria-label={`الذهاب للصورة رقم ${idx + 1}`}
                />
              ))}
            </div>

            {/* Mobile Next Button */}
            <button
              onClick={() => scrollToSlide(activeSlideIndex === systemImages.length - 1 ? 0 : activeSlideIndex + 1)}
              className="md:hidden w-10 h-10 rounded-full bg-slate-900 text-slate-300 border border-slate-800 hover:border-purple-500/50 flex items-center justify-center cursor-pointer active:scale-95 transition-all"
              aria-label="الصورة التالية"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Active Image Captions */}
          <div className="mt-6 p-6 bg-slate-900 border border-slate-800 rounded-2xl text-right space-y-2 shadow-sm">
            <h3 className="font-extrabold text-sm md:text-base text-slate-100 flex items-center justify-end gap-2">
              <span>{systemImages[activeSlideIndex]?.title}</span>
              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
            </h3>
            <p className="text-xs md:text-sm text-slate-400 leading-relaxed font-semibold">
              {systemImages[activeSlideIndex]?.description}
            </p>
          </div>

        </div>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
          {selectedLightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
              onClick={() => setSelectedLightboxImage(null)}
            >
              <div 
                className="relative max-w-5xl w-full bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()} // prevent closing
              >
                <button
                  id="close-lightbox-btn"
                  onClick={() => setSelectedLightboxImage(null)}
                  className="absolute top-4 left-4 p-2.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full cursor-pointer z-10 border border-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="aspect-video bg-slate-900 overflow-hidden relative flex items-center justify-center bg-slate-950">
                  {selectedLightboxImage.uploadedUrl ? (
                    <img 
                      src={selectedLightboxImage.uploadedUrl} 
                      alt={selectedLightboxImage.title} 
                      className="w-full h-full object-contain max-h-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <SystemMockup mockupId={selectedLightboxImage.id} />
                  )}
                </div>

                <div className="p-6 bg-slate-950 border-t border-slate-900 space-y-2 text-right">
                  <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-[10px] font-black inline-block">
                    {selectedLightboxImage.category === "pos" ? "الكواشير" : selectedLightboxImage.category === "stock" ? "المخازن" : selectedLightboxImage.category === "maintenance" ? "الصيانة" : selectedLightboxImage.category === "zakat" ? "الزكاة والمالية" : "تتبع الزبون"}
                  </span>
                  <h3 className="font-extrabold text-sm md:text-base text-slate-100">{selectedLightboxImage.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{selectedLightboxImage.description}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 2. CORE FEATURES (Organized Sales and Inventory) */}
      <section className="space-y-12 py-6 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>قوة الأداء والتكامل في لوجيسيال واحد</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black text-slate-100 tracking-tight">
            تحكم كامل ومطلق في كافة جوانب متجرك
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            صُممت أقسام وموديلات البرنامج بدقة بالغة لتغطي متطلبات محلات الهواتف والصيانة بالتفصيل.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {[
            {
              title: "تسيير المخزون بالـ IMEI",
              icon: <Smartphone className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />,
              badge: "ذكي وآمن",
              desc: "تسجيل وجرد الهواتف بالرقم التسلسلي الفريد للـ IMEI للوقاية التامة من بيع الهواتف الخاطئة أو تبديل العلب، وتنبيهات فورية عند وصول السلع للحد الأدنى للوقاية من نفاد المخزون."
            },
            {
              title: "موديول صيانة احترافي متكامل",
              icon: <Wrench className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300" />,
              badge: "الأكثر مبيعاً",
              desc: "تسجيل الهواتف المطلوب إصلاحها، تتبع حالة الصيانة (انتظار، قيد التصليح، جاهز)، وخصم قطع الغيار المستعملة تلقائياً، مع حساب دقيق لربح اليد العاملة والقطع المستخدمة."
            },
            {
              title: "كاشير سريع متوافق مع الباركود",
              icon: <ScanBarcode className="w-5 h-5 text-pink-400 group-hover:text-pink-300" />,
              badge: "فائق السرعة",
              desc: "إضافة مبيعات الإكسسوارات والشواحن في أجزاء من الثانية بمجرد تمرير السلعة على قارئ الباركود، مع دعم كامل للطباعة التلقائية لوصولات البيع الحرارية أو الورقية A4 وA5 للضمان."
            },
            {
              title: "تقارير المبيعات والأرباح الصافية",
              icon: <BarChart3 className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />,
              badge: "دقة محاسبية",
              desc: "تعرّف على ربحك الصافي اليومي والشهري بنقرة واحدة بعد طرح تكلفة الشراء والمصاريف الإضافية (مثل أجور العمال أو الكراء)، مع مبيعات تفصيلية لكل عامل لمراقبة الأداء بدقة."
            },
            {
              title: "إدارة ديون الكريدي والولاء",
              icon: <CheckCircle2 className="w-5 h-5 text-amber-400 group-hover:text-amber-300" />,
              badge: "زيادة مبيعات",
              desc: "تتبع مستحقات الكريدي للزبائن مع كشف حساب فوري لكل شخص وتواريخ السداد المحددة، مع نظام مكافآت ونقاط ولاء جذابة لتشجيع الزبائن على تكرار الشراء والمحافظة عليهم."
            },
            {
              title: "نسخ احتياطي سحابي تلقائي",
              icon: <ShieldCheck className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />,
              badge: "أمان مطلق",
              desc: "راحة بال تامة! قاعدة بيانات محلك محمية بنسخ احتياطي آلي يومي يرفع مباشرة لسحابة Algora، مما يضمن استعادة بيانات مبيعاتك ومخزونك في ثوانٍ في حال سرقة أو تلف حاسوبك."
            }
          ].map((feature, idx) => (
            <div 
              key={idx}
              className="group relative bg-slate-950/40 hover:bg-slate-900/40 border border-slate-900/80 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-xl hover:shadow-purple-950/10 overflow-hidden text-right flex flex-col justify-between"
            >
              {/* Decorative corner light */}
              <div className="absolute -right-10 -top-10 w-24 h-24 bg-gradient-to-br from-purple-600/5 to-indigo-600/5 rounded-full blur-xl group-hover:scale-150 transition-all duration-500 pointer-events-none" />
              
              {/* Left visual accent indicator */}
              <div className="absolute top-0 right-0 h-full w-[3px] bg-gradient-to-b from-purple-500/80 to-indigo-500/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="space-y-4">
                {/* Header card row */}
                <div className="flex items-start justify-between gap-4">
                  <span className="px-2 py-0.5 bg-slate-900/80 border border-slate-800 rounded-full text-[9px] text-slate-400 font-bold group-hover:border-purple-500/20 group-hover:text-purple-300 transition-all duration-300">
                    {feature.badge}
                  </span>
                  
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-center group-hover:border-purple-500/20 group-hover:bg-purple-950/20 transition-all duration-300 shadow-inner">
                    {feature.icon}
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-100 group-hover:text-purple-300 transition-colors duration-200 text-base md:text-lg">
                    {feature.title}
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed group-hover:text-slate-300 transition-colors duration-200">
                    {feature.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>





      {/* 7.5 DOWNLOAD TRIAL VERSION SECTION (Added for user request) */}
      <section id="download-trial-section" className="space-y-12 py-12 border-t border-slate-900/80 relative">
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-black">
            <Download className="w-3.5 h-3.5" />
            <span>تحميل مباشر وسريع للبرنامج</span>
          </div>
          <h2 className="text-xl md:text-3xl font-black text-slate-100 tracking-tight">
            تحميل النسخة التجريبية المجانية لـ Algora Systems
          </h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
            اختر نسخة البرنامج المناسبة لجهازك وتابع مع دليل الاستخدام والبدء السريع. جميع ملفاتنا آمنة وخالية من أي برمجيات ضارة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 max-w-5xl mx-auto">
          
          {/* Windows App Download Card */}
          <div className="bg-slate-950/50 hover:bg-slate-900/50 border border-slate-900 hover:border-purple-500/20 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 text-right flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[9px] text-purple-300 font-bold">
                  نظام تشغيل Windows
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-950/30 border border-purple-900/30 flex items-center justify-center text-purple-400">
                  <Laptop className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-100 text-sm md:text-base">لوجيسيال الكمبيوتر والـ POS</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  برنامج مبيعات متكامل للكمبيوتر يدعم قراءة الباركود، تسيير الصيانة، طباعة الفواتير ووصل الضمان الحراري.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono font-bold">
                <span>الإصدار: v4.2.5</span>
                <span>الحجم: 84 MB</span>
              </div>
            </div>
            <button
              onClick={() => {
                startDownload("Setup.exe");
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-purple-900/20"
            >
              <Download className="w-4 h-4" />
              <span>تحميل مباشر للكمبيوتر</span>
            </button>
          </div>

          {/* Android App Download Card */}
          <div className="bg-slate-950/50 hover:bg-slate-900/50 border border-slate-900 hover:border-purple-500/20 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 text-right flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[9px] text-indigo-300 font-bold">
                  نظام Android / APK
                </span>
                <div className="w-10 h-10 rounded-xl bg-indigo-950/30 border border-indigo-900/30 flex items-center justify-center text-indigo-400">
                  <Smartphone className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-100 text-sm md:text-base">تطبيق الهاتف والتابلت</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  تابع مبيعات محلك، أرباحك وحركة الصيانة بشكل فوري ومباشر من هاتفك أو تابلت أندرويد في أي مكان.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono font-bold">
                <span>الإصدار: v2.1.0</span>
                <span>الحجم: 18 MB</span>
              </div>
            </div>
            <button
              onClick={() => {
                startDownload("app-debug.apk");
              }}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-indigo-900/20"
            >
              <Download className="w-4 h-4" />
              <span>تحميل تطبيق الهاتف (APK)</span>
            </button>
          </div>

          {/* Video Guide Card */}
          <div className="bg-slate-950/50 hover:bg-slate-900/50 border border-slate-900 hover:border-purple-500/20 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 text-right flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] text-amber-300 font-bold">
                  فيديو شرح إرشادي
                </span>
                <div className="w-10 h-10 rounded-xl bg-amber-950/30 border border-amber-900/30 flex items-center justify-center text-amber-400">
                  <FileVideo className="w-5 h-5" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-100 text-sm md:text-base">فيديو شرح وتثبيت البرنامج</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  فيديو مبسط باللغة العربية يشرح خطوة بخطوة كيفية تثبيت اللوجيسيال، وتفعيل النسخة التجريبية وبدء العمل على الكاشير.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 font-mono font-bold">
                <span>الصيغة: MP4 فيديو</span>
                <span>المدة: 1:46 دقيقة</span>
              </div>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById("demo-video-section");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
                if (videoRef.current) {
                  videoRef.current.play();
                  setIsPlaying(true);
                }
              }}
              className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 shadow-lg shadow-amber-900/20"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>شاهد فيديو الشرح (MP4)</span>
            </button>
          </div>

        </div>

        {/* Local support hint */}
        <div className="max-w-xl mx-auto bg-slate-950/30 border border-slate-900 p-4 rounded-xl text-center text-xs text-slate-400 space-y-1 relative z-10">
          <p className="font-extrabold text-slate-200">💡 هل تواجه صعوبة في التثبيت أو ربط الطابعات؟</p>
          <p className="leading-relaxed">
            لا تقلق، فريق الدعم الفني الجزائري في خدمتك! اتصل بنا عبر الهاتف <a href="https://wa.me/213553361047?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D9%86%D8%B8%D8%A7%D9%85%20Algora%20%D9%88%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B5%D9%88%D9%84%20%D8%B9%D9%84%D9%89%20%D9%86%D8%B3%D8%AE%D8%AA%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9" target="_blank" rel="noopener noreferrer" className="font-mono font-bold text-purple-400 text-[13px] inline-block hover:underline cursor-pointer" dir="ltr">+213 553 36 10 47</a> أو تواصل معنا عبر واتساب، وسيتصل بك أحد مهندسينا لتثبيت وتجهيز البرنامج على حاسوبك مجانًا بالكامل عبر <span className="font-bold text-indigo-400">AnyDesk</span>.
          </p>
        </div>
      </section>

      {/* 8. FAQs ACCORDION */}
      <section className="space-y-8 max-w-3xl mx-auto text-right">
        <div className="text-center space-y-2">
          <h2 className="text-xl md:text-3xl font-black text-slate-100">الأسئلة الشائعة حول لوجيسيال Algora</h2>
          <p className="text-xs md:text-sm text-slate-400">إجابات سريعة وتفصيلية عن الأسئلة الأكثر طرحاً من قبل أصحاب محلات الهواتف الجزائريين.</p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-slate-950/60 border border-slate-900 rounded-xl overflow-hidden transition-all">
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full p-4 flex justify-between items-center text-right font-bold text-xs md:text-sm text-slate-200 hover:text-purple-400 transition-colors cursor-pointer"
              >
                <HelpCircle className={`w-4 h-4 text-purple-400 shrink-0 transition-transform ${faqOpen === idx ? "rotate-180" : ""}`} />
                <span>{faq.q}</span>
              </button>
              
              <AnimatePresence>
                {faqOpen === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-slate-900 bg-slate-900/10"
                  >
                    <p className="p-4 text-xs md:text-sm text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* 9. TUTORIALS ACCORDION */}
      <section className="space-y-8 max-w-3xl mx-auto text-right">
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-xs font-black">
            <Video className="w-3.5 h-3.5" />
            <span>شروحات استخدام النظام بالفيديو</span>
          </span>
          <h2 className="text-xl md:text-3xl font-black text-slate-100">دروس تعليمية مصورة خطوة بخطوة</h2>
          <p className="text-xs md:text-sm text-slate-400">شاهد بالفيديو كيفية تثبيت البرنامج، إضافة منتجاتك، وتسيير محلك باحترافية كاملة.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 bg-slate-950/40 p-1.5 rounded-2xl border border-slate-900/60 max-w-md mx-auto relative z-10">
          <button
            onClick={() => {
              setActiveTutorialTab("computer");
              setTutorialOpen(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTutorialTab === "computer"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/20 scale-105"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>تطبيق الحاسوب (PC)</span>
          </button>
          <button
            onClick={() => {
              setActiveTutorialTab("phone");
              setTutorialOpen(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs md:text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
              activeTutorialTab === "phone"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/20 scale-105"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>تطبيق الهاتف (Mobile)</span>
          </button>
        </div>

        <div className="space-y-3.5">
          {tutorials
            .filter((t) => t.category === activeTutorialTab)
            .map((tutorial, idx) => (
              <div key={idx} className="bg-slate-950/60 border border-slate-900 rounded-xl overflow-hidden transition-all">
                <button
                  onClick={() => setTutorialOpen(tutorialOpen === idx ? null : idx)}
                  className="w-full p-4 flex justify-between items-center text-right font-bold text-xs md:text-sm text-slate-200 hover:text-purple-400 transition-colors cursor-pointer"
                >
                  <Play className={`w-3.5 h-3.5 text-purple-400 shrink-0 transition-transform ${tutorialOpen === idx ? "rotate-90 text-indigo-400 fill-indigo-400" : "fill-purple-400"}`} />
                  <span>{tutorial.title}</span>
                </button>
                
                <AnimatePresence>
                  {tutorialOpen === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-slate-900 bg-slate-900/10 p-5 space-y-4"
                    >
                      {tutorial.desc && (
                        <p className="text-xs md:text-sm text-slate-400 leading-relaxed text-right">
                          {tutorial.desc}
                        </p>
                      )}
                      <div className="flex justify-center">
                        <a
                          href={tutorial.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-200 hover:scale-105 active:scale-100 text-sm"
                        >
                          <svg className="w-5 h-5 shrink-0" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                            <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                            <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                            <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 27h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                          </svg>
                          <span>{tutorial.driveLabel}</span>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
        </div>
      </section>

      {/* Floating Download Toast Notifications */}
      <AnimatePresence>
        {downloadToast && downloadToast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-slate-800 p-4 rounded-xl shadow-2xl flex items-start gap-3 text-right text-slate-100"
            dir="rtl"
          >
            <div className="shrink-0 pt-0.5">
              {downloadToast.type === "info" && (
                <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
              )}
              {downloadToast.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              )}
              {downloadToast.type === "error" && (
                <AlertCircle className="w-5 h-5 text-rose-500" />
              )}
            </div>

            <div className="flex-1 space-y-1">
              <p className="text-xs font-bold leading-relaxed">
                {downloadToast.message}
              </p>
            </div>

            <button
              onClick={() => setDownloadToast(null)}
              className="shrink-0 p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
