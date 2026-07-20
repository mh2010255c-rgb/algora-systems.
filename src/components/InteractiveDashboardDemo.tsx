import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, Package, ShieldCheck, Printer, Percent, BadgeAlert,
  Smartphone, Wrench, ShoppingCart, DollarSign, Plus, Check, RefreshCw,
  Search, ScanLine, User, ShieldAlert, Award, FileText, Send, Info, Scale, HelpCircle
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: "phones" | "parts" | "acc";
  quantity: number;
  imei?: string;
  buyPrice: number;
  sellPrice: number;
}

interface Repair {
  id: string;
  clientName: string;
  clientPhone: string;
  device: string;
  status: "pending" | "repairing" | "ready" | "delivered";
  cost: number;
  partsCost: number;
  notes: string;
}

interface InteractiveDashboardDemoProps {
  onShowGreeting?: () => void;
}

export default function InteractiveDashboardDemo({ onShowGreeting }: InteractiveDashboardDemoProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "inventory" | "maintenance" | "pos" | "zakat" | "licensing">("dashboard");
  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<any>(null);

  // 1. Initial State for Products (Inventory)
  const [products, setProducts] = useState<Product[]>([
    { id: "1", name: "Redmi Note 13 Pro (12/256)", category: "phones", quantity: 8, imei: "862415053229411", buyPrice: 32000, sellPrice: 36500 },
    { id: "2", name: "iPhone 15 Pro Max (256GB)", category: "phones", quantity: 3, imei: "359852210455214", buyPrice: 185000, sellPrice: 198000 },
    { id: "3", name: "شاشة iPhone 11 Pro Original", category: "parts", quantity: 2, buyPrice: 8500, sellPrice: 12500 },
    { id: "4", name: "بطارية Samsung S22 Ultra", category: "parts", quantity: 5, buyPrice: 3200, sellPrice: 5500 },
    { id: "5", name: "شاحن سريع Algora Type-C 30W", category: "acc", quantity: 24, buyPrice: 1200, sellPrice: 2200 },
    { id: "6", name: "سماعات بلوتوث M10 Pro", category: "acc", quantity: 15, buyPrice: 800, sellPrice: 1800 },
  ]);

  // 2. Initial State for Maintenance (Repairs)
  const [repairs, setRepairs] = useState<Repair[]>([
    { id: "REP_101", clientName: "محمد بلقاسم", clientPhone: "0661223344", device: "Poco X3 Pro (شاشة سوداء)", status: "repairing", cost: 9500, partsCost: 4500, notes: "تركيب شاشة أصلية مع ضمان شهر" },
    { id: "REP_102", clientName: "أحمد بن يوسف", clientPhone: "0772334455", device: "iPhone 12 (تغيير بطارية)", status: "ready", cost: 6500, partsCost: 3200, notes: "البطارية القديمة كانت منتفخة" },
    { id: "REP_103", clientName: "سفيان وهران", clientPhone: "0554332211", device: "Redmi 10 (منفذ الشحن)", status: "delivered", cost: 2500, partsCost: 500, notes: "تم التنظيف والتصليح بنجاح" },
    { id: "REP_104", clientName: "ياسين قسنطينة", clientPhone: "0658447799", device: "Galaxy S21 (كاميرا خلفية)", status: "pending", cost: 14000, partsCost: 8000, notes: "بانتظار وصول قطعة الغيار من المورد" },
  ]);

  // 3. POS Cart State
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [posSearch, setPosSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "baridimob" | "ccp">("baridimob");

  // 4. Zakat Calculator State (Algerian Localized)
  const [zakatCash, setZakatCash] = useState<number>(450000); // Cash on hand + Baridimob
  const [zakatDebtToUs, setZakatDebtToUs] = useState<number>(85000); // Credit we expect from customers
  const [zakatDebtToSuppliers, setZakatDebtToSuppliers] = useState<number>(120000); // Debts we owe to suppliers
  const nissabThreshold = 1450000; // Algerian Nissab estimation (based on gold price approx)

  // Handlers for Add Product (Simulation)
  const [newProdName, setNewProdName] = useState("");
  const [newProdCat, setNewProdCat] = useState<"phones" | "parts" | "acc">("acc");
  const [newProdQty, setNewProdQty] = useState(10);
  const [newProdBuy, setNewProdBuy] = useState(1000);
  const [newProdSell, setNewProdSell] = useState(1500);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const newProduct: Product = {
      id: "prod_" + Math.random().toString(36).substr(2, 9),
      name: newProdName,
      category: newProdCat,
      quantity: Number(newProdQty),
      buyPrice: Number(newProdBuy),
      sellPrice: Number(newProdSell),
      imei: newProdCat === "phones" ? "86045903" + Math.floor(1000000 + Math.random() * 9000000) : undefined
    };

    setProducts((prev) => [newProduct, ...prev]);
    setNewProdName("");
    setNewProdQty(10);
    setNewProdBuy(1000);
    setNewProdSell(1500);
    alert(`تمت إضافة "${newProduct.name}" إلى المخزون الافتراضي للتجربة بنجاح!`);
  };

  // Handlers for Repairs Status Change
  const updateRepairStatus = (id: string, nextStatus: Repair["status"]) => {
    setRepairs((prev) =>
      prev.map((rep) => (rep.id === id ? { ...rep, status: nextStatus } : rep))
    );
  };

  // POS Handlers
  const addToCart = (prod: Product) => {
    if (prod.quantity <= 0) {
      alert("الكمية غير متوفرة في المخزون!");
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === prod.id);
      if (existing) {
        if (existing.qty >= prod.quantity) {
          alert(`عذراً، لا يمكنك تجاوز الكمية المتاحة في المخزون (${prod.quantity} قطعة)`);
          return prev;
        }
        return prev.map((item) =>
          item.product.id === prod.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product: prod, qty: 1 }];
    });
  };

  const removeFromCart = (prodId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== prodId));
  };

  const updateCartQty = (prodId: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === prodId) {
          const nextQty = item.qty + delta;
          if (nextQty <= 0) return item;
          if (nextQty > item.product.quantity) {
            alert(`المتاح في المخزون ${item.product.quantity} قطعة فقط`);
            return item;
          }
          return { ...item, qty: nextQty };
        }
        return item;
      })
    );
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const totalAmount = cart.reduce((acc, item) => acc + item.product.sellPrice * item.qty, 0);
    
    // Create elegant invoice
    const newInvoice = {
      invoiceNo: "ALG_" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString("ar-DZ"),
      cashier: "المدير العام (أنت)",
      items: cart.map(c => ({
        name: c.product.name,
        qty: c.qty,
        price: c.product.sellPrice,
        total: c.product.sellPrice * c.qty
      })),
      total: totalAmount,
      paymentMethod: paymentMethod === "cash" ? "نقداً (كاش)" : paymentMethod === "baridimob" ? "بريدي موب (BaridiMob)" : "حساب بريدي CCP",
    };

    setInvoiceData(newInvoice);
    setShowInvoice(true);

    // Deduct stock quantities in simulation
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.product.id === p.id);
        return cartItem ? { ...p, quantity: Math.max(0, p.quantity - cartItem.qty) } : p;
      })
    );
    // Clear cart
    setCart([]);
  };

  // Calculations for Dashboard Charts and KPI Cards
  const totalSalesDemo = 45230;
  const todayRepairsCount = repairs.filter(r => r.status === "repairing" || r.status === "ready").length;
  const stockAlertsCount = products.filter(p => p.quantity <= 3).length;

  // Zakat Calculator logic
  const totalStockValue = products.reduce((acc, p) => acc + p.buyPrice * p.quantity, 0);
  const zakatBase = zakatCash + totalStockValue + zakatDebtToUs - zakatDebtToSuppliers;
  const zakatDue = zakatBase >= nissabThreshold ? zakatBase * 0.025 : 0;

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[750px] relative">
      
      {/* 1. Header of the System Dashboard */}
      <div className="bg-slate-950 px-6 py-4 flex flex-wrap items-center justify-between border-b border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center font-bold text-white text-lg tracking-wider border border-purple-500/30">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold text-base tracking-tight">Algora Systems</span>
              <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] rounded-full font-bold">
                محاكاة تفاعلية حية
              </span>
            </div>
            <p className="text-xs text-slate-400">متجر الهواتف: <span className="text-slate-300 font-bold">فون زون (الجزائر)</span></p>
          </div>
        </div>

        {/* Dynamic Interactive Banner */}
        <div className="hidden md:flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-1.5 text-amber-400 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>فترة تجريبية مجانية: بقيت 5 أيام للاستفادة الكاملة</span>
          <button 
            onClick={() => setActiveTab("licensing")}
            className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded text-[10px] hover:bg-amber-400 transition-colors"
          >
            تفعيل الترخيص الآن
          </button>
        </div>

        {/* User Info & Quick Alerts */}
        <div className="flex items-center gap-3">
          <div className="text-left hidden sm:block">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <p className="text-xs text-slate-200 font-bold">أحمد بن محمد</p>
            </div>
            <p className="text-[10px] text-slate-400">المدير العام (المسؤول الرئيسي)</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold">
            م
          </div>
        </div>
      </div>

      {/* 2. Main Work Layout (Sidebar + Action Stage) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* RIGHT SIDEBAR (RTL Arabic Layout) */}
        <div className="w-16 md:w-56 bg-slate-950/70 border-l border-slate-800 flex flex-col py-4 select-none justify-between">
          <div className="space-y-1 px-2">
            
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="hidden md:block">لوحة التحكم</span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 ${
                activeTab === "inventory"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Package className="w-4 h-4 shrink-0" />
              <span className="hidden md:block">المخزون وقطع الغيار</span>
            </button>

            <button
              onClick={() => setActiveTab("maintenance")}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 ${
                activeTab === "maintenance"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Wrench className="w-4 h-4 shrink-0" />
              <span className="hidden md:block">قسم الصيانة (التصليح)</span>
            </button>

            <button
              onClick={() => setActiveTab("pos")}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 ${
                activeTab === "pos"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <ShoppingCart className="w-4 h-4 shrink-0" />
              <span className="hidden md:block">نقطة البيع والكاشير</span>
            </button>

            <button
              onClick={() => setActiveTab("zakat")}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 ${
                activeTab === "zakat"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
              }`}
            >
              <Scale className="w-4 h-4 shrink-0 text-amber-500" />
              <span className="hidden md:block text-amber-500">حساب الزكاة المحلي</span>
            </button>

          </div>

          <div className="px-2 space-y-2">
            <button
              onClick={onShowGreeting}
              className="w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-extrabold transition-all duration-200 text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-slate-850/60"
            >
              <HelpCircle className="w-4 h-4 shrink-0 text-purple-400" />
              <span className="hidden md:block text-slate-300">مرشد النظام</span>
            </button>

            <button
              onClick={() => setActiveTab("licensing")}
              className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 ${
                activeTab === "licensing"
                  ? "bg-amber-600 text-slate-950"
                  : "text-amber-500 hover:bg-amber-500/10"
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 animate-pulse" />
              <span className="hidden md:block">الترخيص والاشتراكات</span>
            </button>
          </div>

        </div>

        {/* MAIN STAGE SECTION */}
        <div className="flex-1 bg-slate-900/50 p-4 md:p-6 overflow-y-auto text-right">
          
          <AnimatePresence mode="wait">
            
            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-slate-100"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg md:text-xl font-extrabold flex items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-purple-400" />
                    أداء المتجر المباشر (لوحة التحكم)
                  </h3>
                  <p className="text-xs text-slate-400">تحديث فوري لليوم: {new Date().toLocaleDateString("ar-DZ")}</p>
                </div>

                {/* KPI Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-slate-400 text-[11px] md:text-xs">
                      <span>حالة الكاشير اليوم</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                    <p className="text-base md:text-lg font-black text-emerald-400 mt-2">نـشـط</p>
                    <p className="text-[10px] text-slate-500 mt-1">تحديث تلقائي مستمر</p>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-slate-400 text-[11px] md:text-xs">
                      <span>أجهزة في الصيانة حالياً</span>
                      <Wrench className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-base md:text-lg font-black text-purple-300 mt-2">{todayRepairsCount} أجهزة</p>
                    <p className="text-[10px] text-slate-500 mt-1">منها {repairs.filter(r => r.status === "ready").length} جاهزة للتسليم</p>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-slate-400 text-[11px] md:text-xs">
                      <span>مبيعات اليوم الافتراضية</span>
                      <DollarSign className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-base md:text-lg font-black text-slate-100 mt-2">{totalSalesDemo.toLocaleString("ar-DZ")} دج</p>
                    <p className="text-[10px] text-emerald-400 mt-1">▲ 12% مقارنة بالأسبوع الماضي</p>
                  </div>

                  <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80">
                    <div className="flex items-center justify-between text-slate-400 text-[11px] md:text-xs">
                      <span>صافي أرباح المحل (اليوم)</span>
                      <Percent className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-base md:text-lg font-black text-emerald-400 mt-2">12,500.00 دج</p>
                    <p className="text-[10px] text-slate-500 mt-1">أرباح مبيعات وصيانة الهواتف</p>
                  </div>
                </div>

                {/* Graphic + Sidebar Alerts Panels */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column - Custom Styled SVG Line Graph */}
                  <div className="lg:col-span-2 bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-300 mb-2">إحصائيات المبيعات والأرباح (الأيام الـ7 الأخيرة)</h4>
                      <p className="text-[10px] text-slate-400">تتبع ذكي يوضح المبيعات (بالبنفسجي) والأرباح الصافية (بالأخضر)</p>
                    </div>

                    {/* Responsive Simulated Graph */}
                    <div className="w-full h-44 my-4 flex items-end justify-between relative px-2">
                      <div className="absolute inset-x-0 top-1/2 h-px bg-slate-800/40"></div>
                      <div className="absolute inset-x-0 top-1/4 h-px bg-slate-800/20"></div>
                      
                      {/* Interactive Graph bars or paths. We will draw custom curved SVGs */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Sales Curve */}
                        <path 
                          d="M 10 120 C 50 130, 100 40, 150 50 C 200 60, 250 110, 300 80 C 350 70, 390 90, 400 85 L 400 150 L 10 150 Z" 
                          fill="url(#salesGrad)"
                        />
                        <path 
                          d="M 10 120 C 50 130, 100 40, 150 50 C 200 60, 250 110, 300 80 C 350 70, 390 90, 400 85" 
                          fill="none" 
                          stroke="#8b5cf6" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                        />
                        
                        {/* Profit Curve */}
                        <path 
                          d="M 10 140 C 50 142, 100 110, 150 115 C 200 120, 250 135, 300 130 C 350 125, 390 128, 400 126 L 400 150 L 10 150 Z" 
                          fill="url(#profitGrad)"
                        />
                        <path 
                          d="M 10 140 C 50 142, 100 110, 150 115 C 200 120, 250 135, 300 130 C 350 125, 390 128, 400 126" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="2.5" 
                          strokeLinecap="round"
                        />
                        
                        {/* Highlights circles */}
                        <circle cx="150" cy="50" r="5" fill="#8b5cf6" stroke="#fff" strokeWidth="1.5" />
                        <circle cx="150" cy="115" r="4" fill="#10b981" stroke="#fff" strokeWidth="1" />
                      </svg>

                      {/* Day Labels */}
                      <div className="absolute inset-x-0 bottom-[-16px] flex justify-between text-[9px] text-slate-500 px-1 font-mono">
                        <span>السبت</span>
                        <span>الأحد</span>
                        <span>الإثنين</span>
                        <span>الثلاثاء</span>
                        <span>الأربعاء</span>
                        <span>الخميس</span>
                        <span>الجمعة</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3 mt-1.5 font-bold">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                        <span>المبيعات: 135,000 دج (الأسبوع)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span>صافي الأرباح: 42,000 دج (الأسبوع)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Stock Alerts & System status */}
                  <div className="space-y-4">
                    
                    {/* Stock Warning Box */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-center justify-between text-amber-500 text-xs font-bold mb-3">
                        <span className="flex items-center gap-1.5">
                          <BadgeAlert className="w-4 h-4 animate-bounce" />
                          تنبيهات انخفاض المخزون ({stockAlertsCount})
                        </span>
                        <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 rounded-full px-2 py-0.5">هام جداً</span>
                      </div>

                      <div className="space-y-2 max-h-36 overflow-y-auto">
                        {products.filter(p => p.quantity <= 3).map(p => (
                          <div key={p.id} className="p-2 bg-slate-900/80 border border-slate-800 rounded-lg flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-slate-200">{p.name}</p>
                              <p className="text-[10px] text-slate-400">قسم: {p.category === "parts" ? "قطع الغيار" : "الهواتف"}</p>
                            </div>
                            <span className="text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded text-[10px] font-mono">
                              متبقي: {p.quantity} قطع
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Printer and Hardware Integration Status Widget */}
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                      <h4 className="font-bold text-xs text-slate-300 mb-3 flex items-center gap-1.5">
                        <Printer className="w-4 h-4 text-purple-400" />
                        حالة اتصال الأجهزة والملحقات
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">طابعة الفواتير الحرارية (XP-80)</span>
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">متصل (80mm)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">ماسح الباركود اللاسلكي (USB)</span>
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">جاهز للعمل</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">النسخ الاحتياطي السحابي اليومي</span>
                          <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded text-[10px]">تلقائي (مفعل)</span>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Banner calling them to try the POS */}
                <div className="bg-gradient-to-r from-purple-900/30 to-slate-950/80 border border-purple-500/20 rounded-xl p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-right space-y-1">
                    <p className="text-sm font-bold text-purple-300">💡 هل تريد تجربة المبيعات وإصدار الفواتير؟</p>
                    <p className="text-xs text-slate-400">افتح موديول "الكاشير ونقطة البيع" لاختيار السلع، طباعة كشف حراري حقيقي وتجربة دقة التسيير.</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("pos")}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    فتح واجهة نقطة البيع الكاشير
                  </button>
                </div>

              </motion.div>
            )}

            {/* TAB 2: INVENTORY & PRODUCT MANAGEMENT */}
            {activeTab === "inventory" && (
              <motion.div
                key="inventory-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-slate-100"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-extrabold flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-400" />
                      إدارة مخزون الهواتف وقطع الغيار بدقة تامة
                    </h3>
                    <p className="text-xs text-slate-400">تسجيل كميات الهواتف بالـ IMEI وقطع الصيانة مع تحديد أسعار الجملة والتجزئة فورا.</p>
                  </div>
                  <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-300">
                    إجمالي المنتجات المسجلة: {products.length} أصناف
                  </div>
                </div>

                {/* Grid layout for simulation form & table */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Column - Simulation Form */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 h-fit">
                    <h4 className="font-bold text-sm text-slate-300 mb-3 border-b border-slate-800 pb-2 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-purple-400" />
                      إضافة منتج جديد للمخزون (تجربة)
                    </h4>

                    <form onSubmit={handleAddProduct} className="space-y-4 text-right">
                      <div>
                        <label className="block text-xs text-slate-400 font-bold mb-1">اسم السلعة / الموديل</label>
                        <input 
                          type="text" 
                          value={newProdName}
                          onChange={(e) => setNewProdName(e.target.value)}
                          placeholder="مثال: شاشة Redmi Note 12 Original"
                          className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 font-bold mb-1">التصنيف</label>
                          <select 
                            value={newProdCat}
                            onChange={(e: any) => setNewProdCat(e.target.value)}
                            className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500"
                          >
                            <option value="phones">هواتف ذكية</option>
                            <option value="parts">قطع غيار وصيانة</option>
                            <option value="acc">إكسسوارات وملحقات</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 font-bold mb-1">الكمية الأولية</label>
                          <input 
                            type="number" 
                            min="1"
                            value={newProdQty}
                            onChange={(e) => setNewProdQty(Number(e.target.value))}
                            className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-slate-400 font-bold mb-1">سعر الشراء (دج)</label>
                          <input 
                            type="number" 
                            value={newProdBuy}
                            onChange={(e) => setNewProdBuy(Number(e.target.value))}
                            className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-slate-400 font-bold mb-1">سعر البيع (دج)</label>
                          <input 
                            type="number" 
                            value={newProdSell}
                            onChange={(e) => setNewProdSell(Number(e.target.value))}
                            className="w-full text-xs px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        إضافة للمخزون وتحديث الأرباح الافتراضية
                      </button>
                    </form>
                  </div>

                  {/* Right Column - Inventory Table */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400">
                            <th className="pb-3 pt-1">اسم المنتج</th>
                            <th className="pb-3 pt-1">التصنيف</th>
                            <th className="pb-3 pt-1 font-mono">الكمية</th>
                            <th className="pb-3 pt-1">سعر الشراء</th>
                            <th className="pb-3 pt-1">سعر البيع</th>
                            <th className="pb-3 pt-1 font-mono">المكسب المتوقع</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                          {products.map((p) => (
                            <tr key={p.id} className="hover:bg-slate-900/40">
                              <td className="py-3 font-bold text-slate-200">
                                <div>
                                  <span>{p.name}</span>
                                  {p.imei && (
                                    <p className="text-[9px] font-mono text-amber-500/80 mt-0.5">IMEI: {p.imei}</p>
                                  )}
                                </div>
                              </td>
                              <td className="py-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] ${
                                  p.category === "phones" ? "bg-blue-500/10 text-blue-400" :
                                  p.category === "parts" ? "bg-purple-500/10 text-purple-400" : "bg-emerald-500/10 text-emerald-400"
                                }`}>
                                  {p.category === "phones" ? "هواتف" : p.category === "parts" ? "قطع صيانة" : "إكسسوار"}
                                </span>
                              </td>
                              <td className="py-3 font-mono font-bold">
                                <span className={p.quantity <= 3 ? "text-red-400 font-black" : "text-slate-300"}>
                                  {p.quantity} قطع
                                </span>
                              </td>
                              <td className="py-3 font-mono text-slate-400">{(p.buyPrice).toLocaleString()} دج</td>
                              <td className="py-3 font-mono font-bold text-slate-200">{(p.sellPrice).toLocaleString()} دج</td>
                              <td className="py-3 font-mono font-bold text-emerald-400">+{(p.sellPrice - p.buyPrice).toLocaleString()} دج</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* TAB 3: MAINTENANCE & REPAIRS */}
            {activeTab === "maintenance" && (
              <motion.div
                key="maintenance-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-slate-100"
              >
                <div>
                  <h3 className="text-lg md:text-xl font-extrabold flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-purple-400" />
                    قسم تسيير عمليات الصيانة (التصليح) الاحترافي
                  </h3>
                  <p className="text-xs text-slate-400">تسجيل أجهزة الزبائن وتتبع حالة الإصلاح وحساب قطع الغيار المستعملة من المخزون تلقائياً.</p>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-3 pt-1">الرقم</th>
                        <th className="pb-3 pt-1">الزبون والهاتف</th>
                        <th className="pb-3 pt-1">الجهاز والعطل</th>
                        <th className="pb-3 pt-1">سعر التصليح</th>
                        <th className="pb-3 pt-1">تكلفة القطع</th>
                        <th className="pb-3 pt-1">حالة الإصلاح الحالي</th>
                        <th className="pb-3 pt-1">إرسال إشعار للزبون</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850">
                      {repairs.map((rep) => (
                        <tr key={rep.id} className="hover:bg-slate-900/40">
                          <td className="py-3 font-mono font-bold text-slate-400">{rep.id}</td>
                          <td className="py-3">
                            <div>
                              <p className="font-bold text-slate-200">{rep.clientName}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{rep.clientPhone}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <div>
                              <p className="font-bold text-purple-300">{rep.device}</p>
                              <p className="text-[10px] text-slate-400">{rep.notes}</p>
                            </div>
                          </td>
                          <td className="py-3 font-mono font-bold text-slate-200">{rep.cost.toLocaleString()} دج</td>
                          <td className="py-3 font-mono text-slate-400">{rep.partsCost.toLocaleString()} دج</td>
                          <td className="py-3">
                            <select
                              value={rep.status}
                              onChange={(e) => updateRepairStatus(rep.id, e.target.value as any)}
                              className={`text-[11px] font-bold px-2 py-1 bg-slate-900 border border-slate-800 rounded focus:outline-none focus:border-purple-500 cursor-pointer ${
                                rep.status === "pending" ? "text-amber-400" :
                                rep.status === "repairing" ? "text-blue-400" :
                                rep.status === "ready" ? "text-emerald-400 bg-emerald-500/10" : "text-slate-400"
                              }`}
                            >
                              <option value="pending">⏳ انتظار القطع / الفحص</option>
                              <option value="repairing">⚙️ قيد التصليح الآن</option>
                              <option value="ready">✅ تم التصليح (جاهز)</option>
                              <option value="delivered">📦 تم التسليم للزبون</option>
                            </select>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => {
                                alert(`تنبيه محاكاة: تم إرسال رسالة SMS تلقائية للزبون "${rep.clientName}" عبر نظام إشعارات Algora Systems لإخباره بأن جهازه (${rep.device}) حالته الآن: [${rep.status === "ready" ? "جاهز للتسليم ومصلّح بنجاح" : rep.status}]`);
                              }}
                              className="px-2 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded text-[10px] flex items-center gap-1 transition-colors"
                            >
                              <Send className="w-3 h-3" />
                              إرسال SMS/واتس
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Info block about repairs automation */}
                <div className="bg-slate-950/40 p-4 border border-slate-800 rounded-xl flex items-start gap-3">
                  <Info className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <span className="text-slate-200 font-bold block mb-1">الربط الآلي للمخزون مع الصيانة:</span>
                    عند اختيار قطعة غيار مستعملة في الصيانة، يقوم نظام Algora Systems باقتطاعها مباشرة من مخزن قطع الغيار وتحديث كمياتها وإضافتها لتكلفة الفاتورة تلقائياً من دون تدخل يدوي، مما يمنع الأخطاء وسرقة القطع نهائياً.
                  </p>
                </div>

              </motion.div>
            )}

            {/* TAB 4: POS & BILLING CASHIER */}
            {activeTab === "pos" && (
              <motion.div
                key="pos-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-slate-100 h-full flex flex-col"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg md:text-xl font-extrabold flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-purple-400" />
                      واجهة المبيعات السريعة (الكاشير ونقطة البيع POS)
                    </h3>
                    <p className="text-xs text-slate-400">انقر على السلع لإضافتها لفاتورة البيع الحرارية وتجربة الطباعة المباشرة.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  
                  {/* Left Column: Products Showcase (3/5 width) */}
                  <div className="lg:col-span-3 space-y-4">
                    
                    {/* Search & Barcode Scan Simulation Bar */}
                    <div className="flex gap-2">
                      <div className="relative grow">
                        <input
                          type="text"
                          placeholder="ابحث بالاسم أو امسح الباركود..."
                          value={posSearch}
                          onChange={(e) => setPosSearch(e.target.value)}
                          className="w-full text-xs px-3 py-2.5 pr-9 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 text-right"
                        />
                        <Search className="w-4 h-4 text-slate-500 absolute top-3 right-3" />
                      </div>
                      <button
                        onClick={() => {
                          // Simulate scanning a random accessory barcode
                          const randomAcc = products.filter(p => p.category === "acc")[Math.floor(Math.random() * 2)];
                          if (randomAcc) {
                            addToCart(randomAcc);
                            alert(`باركود محاكى 📱 تم مسح السلعة: [${randomAcc.name}] بنجاح وإضافتها للفاتورة!`);
                          }
                        }}
                        className="px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                      >
                        <ScanLine className="w-4 h-4" />
                        محاكاة المسح (Barcode)
                      </button>
                    </div>

                    {/* Product Grid Items */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[360px] p-1">
                      {products
                        .filter(p => p.name.toLowerCase().includes(posSearch.toLowerCase()))
                        .map((p) => (
                          <button
                            key={p.id}
                            onClick={() => addToCart(p)}
                            disabled={p.quantity <= 0}
                            className={`p-3 bg-slate-950 hover:bg-purple-950/20 border border-slate-850 hover:border-purple-500/40 rounded-xl text-right transition-all duration-150 flex flex-col justify-between h-28 group relative ${
                              p.quantity <= 0 ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                          >
                            <div>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                                p.category === "phones" ? "bg-blue-500/10 text-blue-400" :
                                p.category === "parts" ? "bg-purple-500/10 text-purple-400" : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {p.category === "phones" ? "هواتف" : p.category === "parts" ? "قطع غيار" : "إكسسوار"}
                              </span>
                              <h4 className="font-bold text-slate-200 text-xs mt-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                                {p.name}
                              </h4>
                            </div>
                            
                            <div className="flex justify-between items-center w-full mt-1">
                              <span className="font-mono font-black text-purple-400 text-[11px] md:text-xs">
                                {(p.sellPrice).toLocaleString()} دج
                              </span>
                              <span className="text-[10px] text-slate-500">
                                مخزن: {p.quantity}ق
                              </span>
                            </div>

                            {p.quantity <= 0 && (
                              <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center rounded-xl text-[10px] text-red-400 font-bold">
                                نفد المخزون!
                              </div>
                            )}
                          </button>
                        ))}
                    </div>

                  </div>

                  {/* Right Column: Billing / Invoice Cart Summary (2/5 width) */}
                  <div className="lg:col-span-2 bg-slate-950 border border-slate-850 rounded-xl p-4 flex flex-col h-[420px] justify-between">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-3">
                        <h4 className="font-bold text-sm text-slate-200 flex items-center gap-1.5">
                          <ShoppingCart className="w-4 h-4 text-purple-400" />
                          الفاتورة الحالية
                        </h4>
                        <span className="text-[10px] bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-full px-2 py-0.5 font-bold font-mono">
                          {cart.reduce((acc, c) => acc + c.qty, 0)} قطع
                        </span>
                      </div>

                      {/* Cart Items List */}
                      <div className="space-y-2.5 overflow-y-auto max-h-[180px] pr-1">
                        {cart.length === 0 ? (
                          <div className="text-center py-12 text-slate-500 text-xs space-y-2">
                            <ShoppingCart className="w-8 h-8 mx-auto opacity-30 animate-pulse" />
                            <p>سلة الكاشير فارغة حالياً.</p>
                            <p className="text-[10px]">انقر على أي منتج من القائمة المقابلة لإضافته للفاتورة.</p>
                          </div>
                        ) : (
                          cart.map((item) => (
                            <div key={item.product.id} className="bg-slate-900 p-2 border border-slate-800 rounded-lg flex justify-between items-center gap-2">
                              <div className="grow text-right">
                                <p className="font-bold text-slate-200 text-xs line-clamp-1">{item.product.name}</p>
                                <p className="text-[10px] font-mono text-purple-400 font-bold">{(item.product.sellPrice).toLocaleString()} دج</p>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  onClick={() => updateCartQty(item.product.id, -1)}
                                  className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="font-mono text-xs font-bold text-slate-100 min-w-[12px] text-center">{item.qty}</span>
                                <button
                                  onClick={() => updateCartQty(item.product.id, 1)}
                                  className="w-5 h-5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold text-xs"
                                >
                                  +
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-[10px] text-red-400 hover:text-red-300 font-bold mr-1.5"
                                >
                                  حذف
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Total & Checkout Section */}
                    <div className="border-t border-slate-850 pt-3 mt-2 space-y-3">
                      
                      {/* Payment Method Selector (Algeria support) */}
                      <div>
                        <span className="block text-[10px] text-slate-400 font-bold mb-1.5">طريقة الدفع في الجزائر:</span>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setPaymentMethod("baridimob")}
                            className={`py-1 text-[10px] font-bold border rounded transition-all duration-150 ${
                              paymentMethod === "baridimob"
                                ? "bg-purple-600/20 border-purple-500 text-purple-300"
                                : "bg-slate-900 border-slate-800 text-slate-400"
                            }`}
                          >
                            بريدي موب
                          </button>
                          <button
                            onClick={() => setPaymentMethod("cash")}
                            className={`py-1 text-[10px] font-bold border rounded transition-all duration-150 ${
                              paymentMethod === "cash"
                                ? "bg-purple-600/20 border-purple-500 text-purple-300"
                                : "bg-slate-900 border-slate-800 text-slate-400"
                            }`}
                          >
                            كاش (نقدي)
                          </button>
                          <button
                            onClick={() => setPaymentMethod("ccp")}
                            className={`py-1 text-[10px] font-bold border rounded transition-all duration-150 ${
                              paymentMethod === "ccp"
                                ? "bg-purple-600/20 border-purple-500 text-purple-300"
                                : "bg-slate-900 border-slate-800 text-slate-400"
                            }`}
                          >
                            CCP جاري
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs font-bold bg-slate-900 p-2 rounded-lg border border-slate-800">
                        <span className="text-slate-400">الإجمالي الصافي:</span>
                        <span className="font-mono text-sm font-black text-emerald-400">
                          {cart.reduce((acc, item) => acc + item.product.sellPrice * item.qty, 0).toLocaleString()} دج
                        </span>
                      </div>

                      <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                          cart.length > 0
                            ? "bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md cursor-pointer"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        <Printer className="w-4 h-4" />
                        إصدار الفاتورة وطباعة كشف حراري (XP-80)
                      </button>
                    </div>

                  </div>

                </div>

              </motion.div>
            )}

            {/* TAB 5: ZAKAT CALCULATOR (ALGERIA) */}
            {activeTab === "zakat" && (
              <motion.div
                key="zakat-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-slate-100"
              >
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/15 rounded-lg text-amber-500 border border-amber-500/20">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-extrabold text-amber-400">
                      مقياس وحاسبة الزكاة الذكية المدمجة للمحلات
                    </h3>
                    <p className="text-xs text-slate-400">أول لوجيسيال يدعم تسيير حساب الزكاة تلقائياً وفقاً لقيم وموازين وزارة الشؤون الدينية والأوقاف الجزائرية.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Calculations & Inputs panel */}
                  <div className="lg:col-span-2 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4">
                    <h4 className="font-bold text-sm text-slate-200 border-b border-slate-800 pb-2">تفاصيل وعناصر وعاء الزكاة لمحلك التجاري</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-right">
                      
                      <div>
                        <label className="block text-slate-400 mb-1 font-bold">1. قيمة السلع المتاحة للبيع حالياً (بسعر الشراء):</label>
                        <div className="p-2.5 bg-slate-900 border border-slate-800 text-slate-200 font-mono font-bold rounded-lg flex justify-between">
                          <span>{totalStockValue.toLocaleString()} دج</span>
                          <span className="text-[10px] text-purple-400 font-sans font-normal">(محسوبة من المخزن حالياً)</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-bold">2. السيولة النقدية المتوفرة (كاش + بريدي موب + CCP):</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={zakatCash}
                            onChange={(e) => setZakatCash(Number(e.target.value))}
                            className="w-full p-2 bg-slate-900 border border-slate-800 font-mono font-bold text-slate-100 rounded-lg text-right"
                          />
                          <span className="text-xs text-slate-400">دج</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-bold">3. ديون مرجوة السداد عند الزبائن (كريدي للزبائن):</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={zakatDebtToUs}
                            onChange={(e) => setZakatDebtToUs(Number(e.target.value))}
                            className="w-full p-2 bg-slate-900 border border-slate-800 font-mono font-bold text-slate-100 rounded-lg text-right"
                          />
                          <span className="text-xs text-slate-400">دج</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-400 mb-1 font-bold">4. ديون عليك لصالح الموردين (تطرح من الوعاء):</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="number"
                            value={zakatDebtToSuppliers}
                            onChange={(e) => setZakatDebtToSuppliers(Number(e.target.value))}
                            className="w-full p-2 bg-slate-900 border border-slate-800 font-mono font-bold text-slate-100 rounded-lg text-right"
                          />
                          <span className="text-xs text-slate-400">دج</span>
                        </div>
                      </div>

                    </div>

                    <div className="h-px bg-slate-800/80 my-4" />

                    <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-400">وعاء الزكاة الخاضع للحساب (صافي المال النامي):</span>
                        <span className="font-mono text-slate-200">{zakatBase.toLocaleString()} دج</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-400">نصاب الزكاة بالجزائر لعام 1445/1446 هـ (تقديري):</span>
                        <span className="font-mono text-amber-500">{nissabThreshold.toLocaleString()} دج</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-slate-800 pt-2 mt-2">
                        <span className="text-slate-300">هل بلغ مالك النصاب ومر عليه الحول؟</span>
                        <span className={zakatBase >= nissabThreshold ? "text-emerald-400" : "text-amber-500"}>
                          {zakatBase >= nissabThreshold ? "✅ نعم، بلغت النصاب" : "❌ لم تبلغ النصاب هذا العام"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Results panel */}
                  <div className="bg-gradient-to-br from-amber-950/20 to-slate-950 border border-amber-500/20 rounded-xl p-5 flex flex-col justify-between text-right">
                    <div className="space-y-3">
                      <h4 className="font-bold text-amber-400 text-sm">كشف الزكاة السنوي المستحق</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        بموجب فقه المعاملات المالية، تخرج الزكاة بنسبة <span className="text-slate-200 font-bold">2.5%</span> (ربع العشر) من إجمالي وعاء مال التجارة النامي إذا بلغ النصاب وحال عليه الحول برأس السنة القمرية.
                      </p>
                    </div>

                    <div className="my-6 bg-slate-900/60 p-4 border border-slate-800 rounded-xl text-center space-y-1">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold tracking-wider">الزكاة الواجب إخراجها للمصارف الشرعية</span>
                      <p className="text-2xl font-black text-amber-400 font-mono">
                        {zakatDue.toLocaleString("ar-DZ")} دج
                      </p>
                      <span className="text-[10px] text-slate-500 block">أي ما يقارب {(zakatDue / 10).toLocaleString()} سنتيم بالعملة المتداولة</span>
                    </div>

                    <div className="bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 text-[11px] text-amber-300">
                      🎯 <span className="font-bold">بركة في المال:</span> يضمن لك نظام Algora Systems دقة متناهية تفادياً لأي شبهة في الأرباح أو السهو، مع تيسير إخراج حق الفقراء من مال التجارة بيسر وطمأنينة.
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* TAB 6: LICENSING & SUBSCRIPTIONS */}
            {activeTab === "licensing" && (
              <motion.div
                key="licensing-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-slate-100"
              >
                <div className="text-center max-w-lg mx-auto space-y-2">
                  <div className="inline-flex p-3 bg-purple-500/15 border border-purple-500/30 text-purple-400 rounded-full mb-2">
                    <Award className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg md:text-xl font-extrabold text-slate-200">الترخيص والتفعيل الرسمي لنظام Algora Systems</h3>
                  <p className="text-xs text-slate-400">
                    أنت مسجل حالياً في الفترة التجريبية المجانية. تفعيل اشتراكك يضمن الحفاظ على كافة مبيعاتك المسجلة، مخزونك وقاعدة بيانات زبائنك دون انقطاع.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-4 text-right">
                  <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4">
                    <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] rounded font-bold">باقة تسيير الصيانة والمخزون</span>
                    <h4 className="text-base font-bold text-slate-200">الاشتراك السنوي الاحترافي</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">أفضل خيار لمحلات الهواتف والصيانة في الجزائر، يشتمل على كامل موديول الـ POS، قطع غيار الصيانة، تتبع IMEI والدعم المباشر.</p>
                    
                    <div className="h-px bg-slate-900" />
                    <div className="flex justify-between items-baseline font-mono font-black text-emerald-400 text-lg">
                      <span>20,000 دج / سنة</span>
                      <span className="text-[10px] font-sans font-normal text-slate-500">سعر توفيري للغاية</span>
                    </div>

                    <ul className="text-[11px] text-slate-400 space-y-2">
                      <li className="flex items-center gap-1.5 justify-end"><span>مستخدمين غير محدودين وعمال متعددين</span> <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /></li>
                      <li className="flex items-center gap-1.5 justify-end"><span>النسخ الاحتياطي السحابي التلقائي لقاعدة البيانات</span> <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /></li>
                      <li className="flex items-center gap-1.5 justify-end"><span>دعم فني مباشر بالهاتف والواتساب 24/7</span> <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /></li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-br from-slate-950 via-slate-950 to-purple-950/20 border border-purple-500/30 p-5 rounded-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                      <h4 className="text-base font-bold text-purple-400">طرق الدفع المتوفرة في الجزائر 🇩🇿</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        ندعم الدفع بكافة السبل المحلية السريعة، فور الدفع يقوم مهندسو دعمنا بتفعيل حسابك مباشرة عن بعد دون انقطاع:
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                        <div className="p-2 bg-slate-900 border border-slate-850 rounded text-center text-slate-300">CCP بريد الجزائر</div>
                        <div className="p-2 bg-slate-900 border border-slate-850 rounded text-center text-slate-300">تطبيق BaridiMob</div>
                        <div className="p-2 bg-slate-900 border border-slate-850 rounded text-center text-slate-300">بطاقة RedotPay</div>
                        <div className="p-2 bg-slate-900 border border-slate-850 rounded text-center text-slate-300">نقداً مع الوكلاء</div>
                      </div>
                    </div>

                    <div className="pt-4">
                      <a
                        href="#trial-form"
                        onClick={() => {
                          const el = document.getElementById("trial-form-section");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        اضغط لملء نموذج تفعيل الترخيص
                      </a>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* 3. SIMULATED THERMAL INVOICE MODAL (Fulfills Print requirement) */}
      <AnimatePresence>
        {showInvoice && invoiceData && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-950/90 flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white text-slate-900 w-80 p-5 rounded-xl shadow-2xl border border-slate-200 font-mono text-xs text-right relative flex flex-col justify-between h-[500px]"
            >
              <div>
                <button
                  onClick={() => setShowInvoice(false)}
                  className="absolute top-3 left-3 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center font-sans text-xs transition-colors"
                >
                  X
                </button>
                
                {/* Header of Invoice */}
                <div className="text-center font-sans border-b border-dashed border-slate-300 pb-3 mb-3">
                  <h5 className="font-extrabold text-sm tracking-tight text-slate-950">محل فون زون PHONE ZONE</h5>
                  <p className="text-[10px] text-slate-500 mt-0.5">الجزائر - هاتف: 0671037202</p>
                  <p className="text-[9px] text-slate-400 mt-1">فاتورة مبيعات كاشير رقم: <span className="font-bold">{invoiceData.invoiceNo}</span></p>
                  <p className="text-[8px] text-slate-400 font-mono mt-0.5">{invoiceData.date}</p>
                </div>

                {/* Bill details */}
                <div className="space-y-2 border-b border-dashed border-slate-300 pb-3 mb-3 font-sans text-[10px] text-slate-600">
                  <div className="flex justify-between">
                    <span>{invoiceData.cashier}</span>
                    <span className="font-bold text-slate-800">البائع:</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-800">{invoiceData.paymentMethod}</span>
                    <span className="text-slate-500">طريقة السداد:</span>
                  </div>
                </div>

                {/* Items listing */}
                <div className="space-y-2 border-b border-dashed border-slate-300 pb-3 mb-3">
                  <div className="flex justify-between font-bold font-sans text-slate-700 text-[9px]">
                    <span className="w-16 text-left">المجموع</span>
                    <span className="w-12 text-center">السعر</span>
                    <span className="w-8 text-center">الكمية</span>
                    <span className="grow text-right">السلعة</span>
                  </div>
                  
                  <div className="space-y-1.5 max-h-[140px] overflow-y-auto font-sans text-[10px] text-slate-800">
                    {invoiceData.items.map((it: any, index: number) => (
                      <div key={index} className="flex justify-between items-start leading-tight">
                        <span className="w-16 text-left font-mono font-bold">{(it.total).toLocaleString()} دج</span>
                        <span className="w-12 text-center font-mono">{(it.price).toLocaleString()}</span>
                        <span className="w-8 text-center font-mono">x{it.qty}</span>
                        <span className="grow text-right font-semibold text-slate-950">{it.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-1 font-sans text-xs border-b border-dashed border-slate-300 pb-3 mb-3">
                  <div className="flex justify-between font-bold text-slate-950">
                    <span className="font-mono text-sm font-black">{(invoiceData.total).toLocaleString()} دج</span>
                    <span>المجموع الإجمالي:</span>
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 leading-tight">
                    <span className="font-bold">شامل الضريبة والضمان</span>
                    <span>ملاحظة:</span>
                  </div>
                </div>

                <div className="text-center font-sans text-[9px] text-slate-500 space-y-1">
                  <p className="font-bold text-purple-900">شكراً لزيارتكم • وعليكم بالبركة 🤝</p>
                  <p className="text-[8px] text-slate-400">برنامج Algora Systems • www.algora.dz</p>
                </div>
              </div>

              <div className="flex gap-2 font-sans">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="grow py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[10px] transition-colors flex items-center justify-center gap-1 shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  طباعة فعلية
                </button>
                <button
                  onClick={() => {
                    setShowInvoice(false);
                    alert("فاتورة محاكاة حرارية: تم إرسال أمر الطباعة بنجاح لطابعة XP-80 الحرارية المتصلة عبر شبكة المحل الافتراضية بنظام Algora!");
                  }}
                  className="grow py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-[10px] transition-colors"
                >
                  تأكيد وإغلاق الفاتورة
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
