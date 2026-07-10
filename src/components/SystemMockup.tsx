import React, { useState } from "react";
import { 
  Smartphone, ShieldCheck, Wrench, BarChart3, ScanBarcode, 
  Check, Printer, AlertCircle, Sparkles, ChevronLeft, ChevronRight, CreditCard,
  CheckCircle2, Star, MessageCircle, HelpCircle, Loader2, Award, ArrowDown,
  Play, Pause, Volume2, VolumeX, UploadCloud, Video, Link2, Youtube, FileVideo, CheckCircle,
  Image, Plus, Trash2, Maximize2, Sliders, X, DollarSign, Package, Users, Settings, Lock, FileText, Send
} from "lucide-react";

interface SystemMockupProps {
  mockupId: string;
}

export default function SystemMockup({ mockupId }: SystemMockupProps) {
  switch (mockupId) {
    case "img_splash":
      return (
        <div className="w-full h-full bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950 flex items-center justify-center p-4 relative text-right">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,58,237,0.15),transparent_70%)] pointer-events-none" />
          
          {/* Phone Frame wrapper */}
          <div className="w-full max-w-sm bg-slate-900 border-4 border-slate-800 rounded-[3rem] shadow-2xl p-6 relative overflow-hidden flex flex-col justify-between aspect-[9/16] min-h-[500px]">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4.5 bg-black rounded-full z-20 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 absolute right-4" />
            </div>

            {/* Header */}
            <div className="text-center pt-8 space-y-2">
              <div className="w-16 h-16 mx-auto bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-950/50">
                <Smartphone className="w-9 h-9 text-purple-400" />
              </div>
              <h1 className="text-2xl font-black text-slate-100 tracking-wide">فون زون</h1>
              <p className="text-[10px] text-purple-300 font-extrabold tracking-widest uppercase">PhonePro DZ</p>
            </div>

            {/* Login fields mock */}
            <div className="space-y-4 px-2">
              <div className="text-center space-y-1 mb-4">
                <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md text-[10px] font-black text-purple-400 inline-block">
                  بوابة الدخول الموحدة 🔑
                </span>
                <p className="text-xs text-slate-400 font-medium">الرجاء إدخال بيانات حسابك لتسجيل الدخول</p>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">اسم المستخدم</label>
                <div className="relative">
                  <input 
                    type="text" 
                    readOnly 
                    value="admin_dz@phonezone.com" 
                    className="w-full text-[11px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-300 font-mono text-left focus:outline-none"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-500" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-400 font-bold">كلمة المرور</label>
                <div className="relative">
                  <input 
                    type="password" 
                    readOnly 
                    value="••••••••••••••" 
                    className="w-full text-[11px] bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-slate-400 font-mono text-left focus:outline-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button className="w-full py-3 mt-2 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-purple-950/50">
                <span>تسجيل دخول النظام</span>
                <CheckCircle className="w-4 h-4 text-purple-200" />
              </button>
            </div>

            {/* Footer */}
            <div className="text-center space-y-1">
              <div className="h-px bg-slate-800/60 w-3/4 mx-auto" />
              <p className="text-[9px] text-slate-500 font-bold font-mono">v3.0.0 — Secured By Algora Systems</p>
            </div>
          </div>
        </div>
      );

    case "img_dashboard":
      return (
        <div className="w-full h-full bg-slate-950 flex flex-col relative text-right text-xs">
          {/* Top header bar */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono">الصندوق: مفتوح 🔓</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black text-slate-200">المدير العام (أدمن الجزائر)</span>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow">
                أ
              </div>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar Mock */}
            <div className="w-44 bg-slate-900 border-l border-slate-800 p-2 space-y-1 hidden sm:flex flex-col">
              <div className="px-3 py-2 text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">الأقسام الحيوية</div>
              <div className="px-3 py-2 bg-purple-600/10 border-r-2 border-purple-500 text-purple-400 rounded-md font-bold flex items-center justify-end gap-2">
                <span>لوحة التحكم</span>
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="px-3 py-2 hover:bg-slate-800/50 text-slate-400 rounded-md font-medium flex items-center justify-end gap-2 transition-all">
                <span>المخزن والقطع</span>
                <Package className="w-4 h-4" />
              </div>
              <div className="px-3 py-2 hover:bg-slate-800/50 text-slate-400 rounded-md font-medium flex items-center justify-end gap-2 transition-all">
                <span>ورشة الصيانة</span>
                <Wrench className="w-4 h-4" />
              </div>
              <div className="px-3 py-2 hover:bg-slate-800/50 text-slate-400 rounded-md font-medium flex items-center justify-end gap-2 transition-all">
                <span>نقطة البيع POS</span>
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="px-3 py-2 hover:bg-slate-800/50 text-slate-400 rounded-md font-medium flex items-center justify-end gap-2 transition-all">
                <span>حساب الزكاة</span>
                <Sliders className="w-4 h-4" />
              </div>
            </div>

            {/* Dashboard Content Grid */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl space-y-1 relative overflow-hidden">
                  <div className="absolute top-1 left-1 bg-purple-500/10 p-1 rounded-lg text-purple-400"><DollarSign className="w-4 h-4" /></div>
                  <p className="text-[10px] text-slate-500 font-bold">مبيعات اليوم</p>
                  <p className="text-sm md:text-base font-black text-slate-100 font-mono">124,500 دج</p>
                  <span className="text-[9px] text-emerald-500 font-bold font-mono">+12.4% متوقع اليوم</span>
                </div>

                <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl space-y-1 relative overflow-hidden">
                  <div className="absolute top-1 left-1 bg-indigo-500/10 p-1 rounded-lg text-indigo-400"><Wrench className="w-4 h-4" /></div>
                  <p className="text-[10px] text-slate-500 font-bold">مداخيل الصيانة</p>
                  <p className="text-sm md:text-base font-black text-slate-100 font-mono">32,800 دج</p>
                  <span className="text-[9px] text-indigo-400 font-bold">8 هواتف تم إصلاحها</span>
                </div>

                <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl space-y-1 relative overflow-hidden">
                  <div className="absolute top-1 left-1 bg-teal-500/10 p-1 rounded-lg text-teal-400"><Smartphone className="w-4 h-4" /></div>
                  <p className="text-[10px] text-slate-500 font-bold">الأجهزة النشطة</p>
                  <p className="text-sm md:text-base font-black text-slate-100 font-mono">14 جهاز</p>
                  <span className="text-[9px] text-amber-500 font-bold">6 بانتظار قطع الغيار</span>
                </div>

                <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-xl space-y-1 relative overflow-hidden">
                  <div className="absolute top-1 left-1 bg-rose-500/10 p-1 rounded-lg text-rose-400"><Package className="w-4 h-4" /></div>
                  <p className="text-[10px] text-slate-500 font-bold">تنبيهات المخزون</p>
                  <p className="text-sm md:text-base font-black text-slate-100 font-mono">3 قطع غيار</p>
                  <span className="text-[9px] text-rose-500 font-bold">شاشات آيفون منخفضة</span>
                </div>
              </div>

              {/* Chart Mockup & Recent activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-purple-400 font-bold">آخر 7 أيام بالجزائر</span>
                    <h4 className="font-extrabold text-xs text-slate-200">النمو ومبيعات الورشة والمحل</h4>
                  </div>
                  {/* CSS flex chart columns */}
                  <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
                    {[
                      { day: "السبت", val: 40 },
                      { day: "الأحد", val: 55 },
                      { day: "الإثنين", val: 75 },
                      { day: "الثلاثاء", val: 65 },
                      { day: "الأربعاء", val: 90 },
                      { day: "الخميس", val: 110 },
                      { day: "الجمعة", val: 45 }
                    ].map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-md hover:from-indigo-500 hover:to-purple-400 transition-all cursor-pointer relative group" style={{ height: `${item.val}%` }}>
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30">
                            {item.val * 1500} دج
                          </div>
                        </div>
                        <span className="text-[8px] text-slate-500 font-bold">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl space-y-2">
                  <h4 className="font-extrabold text-xs text-slate-200">النشاطات الأخيرة بالثانية</h4>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {[
                      { time: "منذ دقيقة", type: "pos", desc: "بيع شاحن سريع Algora 30W", cash: "+2,200 دج" },
                      { time: "منذ 12 د", type: "rep", desc: "استلام iPhone 13 (تغيير شاشة)", user: "جمال" },
                      { time: "منذ 1 ساعة", type: "pos", desc: "بيع هاتف Redmi Note 13 Pro", cash: "+36,500 دج" },
                      { time: "منذ 2 ساعة", type: "rep", desc: "توصيل هاتف Galaxy A54 للزبون", cash: "+6,500 دج" }
                    ].map((act, idx) => (
                      <div key={idx} className="p-2 bg-slate-950/60 rounded-lg border border-slate-900 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-purple-400 font-bold">{act.cash || "تم"}</span>
                        <div className="text-right">
                          <p className="font-bold text-slate-300">{act.desc}</p>
                          <span className="text-[8px] text-slate-500">{act.time} {act.user && `| الزبون: ${act.user}`}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "img_inventory":
      return (
        <div className="w-full h-full bg-slate-950 flex flex-col relative text-right text-xs">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] font-black text-purple-400">إدارة المخزن بالـ IMEI والباركود 🏷️</span>
            <h4 className="font-black text-slate-200">فون زون — جدول جرد المخزون والسلع</h4>
          </div>

          <div className="flex-1 p-4 relative overflow-hidden flex flex-col gap-3">
            {/* Table Mockup */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex-1 flex flex-col justify-between">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-[9px] text-slate-400 font-bold">
                      <th className="p-2.5">رمز السلعة / الـ IMEI</th>
                      <th className="p-2.5">اسم المنتج</th>
                      <th className="p-2.5 text-center">الكمية</th>
                      <th className="p-2.5">سعر الشراء</th>
                      <th className="p-2.5">سعر البيع</th>
                      <th className="p-2.5">الحالة</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { code: "IMEI 359852210455214", name: "iPhone 15 Pro Max (256GB)", qty: 3, buy: "185,000 دج", sell: "198,000 دج", status: "متوفر", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                      { code: "IMEI 862415053229411", name: "Redmi Note 13 Pro (12/256)", qty: 8, buy: "32,000 دج", sell: "36,500 دج", status: "متوفر", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                      { code: "BARCODE_91002341", name: "شاحن سريع Algora Type-C 30W", qty: 24, buy: "1,200 دج", sell: "2,200 دج", status: "متوفر", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                      { code: "LOC_SHELF_B-12", name: "شاشة iPhone 11 Pro Original", qty: 1, buy: "8,500 دج", sell: "12,500 دج", status: "مخزون حرج", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" }
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-950/40 text-[10px] font-medium text-slate-300">
                        <td className="p-2.5 font-mono text-[9px] text-slate-500 text-left">{item.code}</td>
                        <td className="p-2.5 font-extrabold">{item.name}</td>
                        <td className="p-2.5 text-center font-mono font-bold">{item.qty}</td>
                        <td className="p-2.5 font-mono text-slate-400">{item.buy}</td>
                        <td className="p-2.5 font-mono font-bold text-purple-400">{item.sell}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded border text-[9px] font-black ${item.color}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-950 p-2.5 border-t border-slate-800 flex justify-between items-center text-[10px] text-slate-500 font-bold">
                <span className="font-mono">Showing 4 of 124 products</span>
                <span>الصفحة 1 من 31</span>
              </div>
            </div>

            {/* Simulated Add Device Popup Modal right in center */}
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center p-4">
              <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 space-y-3 text-right">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <X className="w-4 h-4 text-slate-500 cursor-pointer" />
                  <h5 className="font-extrabold text-xs text-slate-200 flex items-center gap-1">
                    <span>إدخال وجرد جهاز هاتف جديد</span>
                    <Plus className="w-4 h-4 text-purple-500" />
                  </h5>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <label className="block text-slate-400">العلامة التجارية</label>
                      <input type="text" readOnly value="Xiaomi / شاومي" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-300 font-bold" />
                    </div>
                    <div className="space-y-0.5">
                      <label className="block text-slate-400">اسم وموديل الهاتف</label>
                      <input type="text" readOnly value="Poco F5 Pro 5G" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-300 font-bold" />
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <label className="block text-slate-400">الرقم التسلسلي الفريد (IMEI)</label>
                    <div className="relative">
                      <input type="text" readOnly value="864501239988523" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-300 font-mono text-left" />
                      <ScanBarcode className="w-4 h-4 text-purple-400 absolute left-2 top-1.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <label className="block text-slate-400">سعر الشراء (كلفة)</label>
                      <input type="text" readOnly value="42,000 دج" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-300 font-mono font-bold" />
                    </div>
                    <div className="space-y-0.5">
                      <label className="block text-slate-400">سعر البيع المقترح</label>
                      <input type="text" readOnly value="48,500 دج" className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-slate-300 font-mono font-bold text-purple-400" />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-end gap-2">
                  <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-[10px] font-bold">إلغاء</button>
                  <button className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-[10px] font-black flex items-center gap-1">
                    <span>حفظ في المخزن 💾</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      );

    case "img_maintenance":
      return (
        <div className="w-full h-full bg-slate-950 flex flex-col relative text-right text-xs">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] font-black text-purple-400">ورشة الصيانة واستلام وتتبع الهواتف 🛠️</span>
            <h4 className="font-black text-slate-200">فون زون — جدول طلبات وأوامر الإصلاح</h4>
          </div>

          <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-3 overflow-hidden">
            {/* Maintenance List Table */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="bg-slate-950 border-b border-slate-800 text-[9px] text-slate-400 font-bold">
                      <th className="p-2.5">رقم الأمر</th>
                      <th className="p-2.5">الزبون والهاتف</th>
                      <th className="p-2.5">نوع العطل والمشكل</th>
                      <th className="p-2.5">سعر الكشف</th>
                      <th className="p-2.5">الحالة الحالية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "REP_101", client: "هيثم بومرداس", phone: "0555121234", dev: "iPhone 14 Pro", defect: "شاشة سوداء مكسورة داخلياً", cost: "18,000 دج", status: "تحت الإصلاح 🛠️", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
                      { id: "REP_102", client: "سامي بوزريعة", phone: "0777456123", dev: "Galaxy S22 Ultra", defect: "انتفاخ البطارية وغطاء مخلوع", cost: "6,500 دج", status: "جاهز للتسليم ✅", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
                      { id: "REP_103", client: "نسيم سطيف", phone: "0666789456", dev: "Poco X3 Pro", defect: "انطفاء مفاجئ (مشكلة المعالج CPU)", cost: "9,000 دج", status: "بانتظار قطع الغيار ⏳", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" }
                    ].map((rep, idx) => (
                      <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-950/40 text-[10px] font-medium text-slate-300">
                        <td className="p-2.5 font-mono text-[9px] text-slate-500 text-left">{rep.id}</td>
                        <td className="p-2.5 font-extrabold">
                          <p className="text-slate-200">{rep.client}</p>
                          <span className="text-[9px] text-slate-500 font-mono">{rep.dev} | {rep.phone}</span>
                        </td>
                        <td className="p-2.5 text-slate-400 font-semibold">{rep.defect}</td>
                        <td className="p-2.5 font-mono font-bold text-slate-200">{rep.cost}</td>
                        <td className="p-2.5">
                          <span className={`px-2.5 py-0.5 rounded border text-[9px] font-black ${rep.color}`}>
                            {rep.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-slate-950 p-2 border-t border-slate-800 text-[9px] text-slate-500 font-bold text-center">
                مجموع مداخيل الصيانة المقدرة اليوم: 33,500 دج
              </div>
            </div>

            {/* Quick Ticket Details Drawer / Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-slate-950 rounded text-[9px] font-mono text-purple-400 border border-slate-800">REP_101</span>
                  <h5 className="font-extrabold text-xs text-slate-200">تفاصيل تذكرة الصيانة النشطة</h5>
                </div>

                <div className="space-y-2 text-[10px]">
                  <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-900 space-y-1">
                    <p className="font-bold text-purple-400">الزبون: هيثم بومرداس</p>
                    <p className="text-slate-400">الجهاز: iPhone 14 Pro (البنفسجي)</p>
                    <p className="text-slate-500 font-mono text-left">IMEI: 359852210455214</p>
                  </div>

                  <div className="h-px bg-slate-800" />

                  <div className="space-y-1">
                    <p className="font-bold text-slate-400">العيب المشخص:</p>
                    <p className="bg-slate-950 p-2 rounded text-slate-300 font-medium">شاشة سوداء بالكامل مع كسر طفيف أسفل زر التشغيل. لا يوجد استجابة للمس.</p>
                  </div>

                  <div className="space-y-1">
                    <p className="font-bold text-slate-400">قطع الغيار المستخدمة:</p>
                    <p className="bg-slate-950 p-2 rounded text-slate-300 font-mono flex justify-between">
                      <span className="text-purple-400 font-bold font-sans">12,500 دج</span>
                      <span>شاشة iPhone 14 Pro الأصلية x1</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-900/60 font-mono text-center">
                    <div>
                      <p className="text-[8px] text-slate-500">العربون المدفوع</p>
                      <p className="font-black text-emerald-400 text-xs">5,000 دج</p>
                    </div>
                    <div>
                      <p className="text-[8px] text-slate-500">التكلفة الكلية</p>
                      <p className="font-black text-slate-200 text-xs">18,000 دج</p>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-[10px] rounded-lg flex items-center justify-center gap-1.5 shadow">
                <span>إصدار فاتورة التسليم وطباعة الوصل</span>
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      );

    case "img_inspection":
      return (
        <div className="w-full h-full bg-slate-950 flex flex-col relative text-right text-xs">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] font-black text-purple-400">لوحة الفحص الظاهري ورصد الأضرار بدقة 📱</span>
            <h4 className="font-black text-slate-200">فون زون — رسم تشخيص الهيكل والزجاج</h4>
          </div>

          <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-4 gap-3 overflow-hidden">
            {/* Visual Phone Inspector Canvas Mock */}
            <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
              <p className="absolute top-2 right-2 text-[9px] text-slate-500 font-bold">حدد نوع الخلل واضغط على مكانه في مجسم الهاتف</p>
              
              <div className="flex flex-row gap-12 items-center justify-center my-auto scale-90 sm:scale-100">
                {/* Front Face Model */}
                <div className="space-y-2 text-center">
                  <span className="text-[10px] text-slate-400 font-bold">الجهة الأمامية (الشاشة)</span>
                  <div className="w-24 h-48 bg-slate-950 border-2 border-slate-800 rounded-2xl relative p-1 flex items-center justify-center">
                    {/* Speaker grill / dynamic island */}
                    <div className="w-8 h-2 bg-slate-900 rounded-full absolute top-1.5" />
                    <div className="w-full h-full border border-slate-900 rounded-xl bg-slate-900/40 relative">
                      {/* Fake Crack Marks */}
                      <div className="absolute top-1/3 left-4 w-12 h-px bg-rose-500/50 rotate-45" />
                      <div className="absolute top-1/3 left-4 w-8 h-px bg-rose-500/50 -rotate-12" />
                      {/* Interactive Dots */}
                      <div className="absolute top-[32%] left-[20%] w-5 h-5 bg-rose-500 text-[9px] font-bold font-mono text-white rounded-full flex items-center justify-center border-2 border-slate-950 cursor-pointer shadow animate-pulse">
                        C
                      </div>
                      <div className="absolute bottom-[20%] right-[30%] w-5 h-5 bg-amber-500 text-[9px] font-bold font-mono text-white rounded-full flex items-center justify-center border-2 border-slate-950 cursor-pointer shadow">
                        S
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Face Model */}
                <div className="space-y-2 text-center">
                  <span className="text-[10px] text-slate-400 font-bold">الجهة الخلفية (الهيكل)</span>
                  <div className="w-24 h-48 bg-slate-950 border-2 border-slate-800 rounded-2xl relative p-1 flex items-center justify-center">
                    {/* Camera Island */}
                    <div className="w-7 h-7 bg-slate-900 border border-slate-800 rounded-lg absolute top-2 right-2 p-0.5 grid grid-cols-2 gap-0.5">
                      <div className="w-2 h-2 rounded-full bg-black border border-slate-800" />
                      <div className="w-2 h-2 rounded-full bg-black border border-slate-800" />
                      <div className="w-2 h-2 rounded-full bg-black border border-slate-800" />
                    </div>
                    <div className="w-full h-full border border-slate-900 rounded-xl bg-slate-900/40 relative">
                      {/* Interactive Dots */}
                      <div className="absolute top-[12%] right-[12%] w-5 h-5 bg-rose-500 text-[9px] font-bold font-mono text-white rounded-full flex items-center justify-center border-2 border-slate-950 cursor-pointer shadow">
                        C
                      </div>
                      <div className="absolute bottom-[40%] left-[40%] w-5 h-5 bg-indigo-500 text-[9px] font-bold font-mono text-white rounded-full flex items-center justify-center border-2 border-slate-950 cursor-pointer shadow">
                        D
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Marking Tools Guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <h5 className="font-extrabold text-xs text-slate-200 border-b border-slate-800 pb-2">رموز الفحص المعتمدة</h5>
                
                <div className="space-y-2.5 text-[10px]">
                  <div className="flex items-center gap-2 justify-end p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg">
                    <div className="text-right flex-1">
                      <p className="font-black text-rose-400">C - كسر الزجاج (Crack)</p>
                      <p className="text-[9px] text-slate-400">كسر أو شعر في الشاشة أو الظهر الخلفي</p>
                    </div>
                    <div className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center font-bold font-mono">C</div>
                  </div>

                  <div className="flex items-center gap-2 justify-end p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="text-right flex-1">
                      <p className="font-black text-amber-400">S - خدوش بليغة (Scratch)</p>
                      <p className="text-[9px] text-slate-400">تآكل أو خدش في الإطار أو الزجاج</p>
                    </div>
                    <div className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold font-mono">S</div>
                  </div>

                  <div className="flex items-center gap-2 justify-end p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                    <div className="text-right flex-1">
                      <p className="font-black text-indigo-400">D - صدمة وهبوط (Dent)</p>
                      <p className="text-[9px] text-slate-400">اعوجاج أو نقرة واضحة في معدن الحواف</p>
                    </div>
                    <div className="w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center font-bold font-mono">D</div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[9px] text-slate-400 font-bold text-center">
                يتم حفظ هذه العلامات وتوليدها تلقائياً على نموذج الفاتورة المطبوعة لمنع النزاعات مع الزبائن حول حالة هواتفهم المستلمة.
              </div>
            </div>
          </div>
        </div>
      );

    case "img_pos":
      return (
        <div className="w-full h-full bg-slate-950 flex flex-col relative text-right text-xs">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[10px] font-black text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>مزامنة سريعة POS ⚡</span>
            </div>
            <h4 className="font-black text-slate-200">واجهة البيع السريع — كواشير فون زون الكاش الحراري</h4>
          </div>

          <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-3 gap-3 overflow-hidden">
            {/* Left Column: Cart & Cashout */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
                  <span className="font-mono text-[9px] text-slate-500">2 Items Selected</span>
                  <h5 className="font-extrabold text-xs text-slate-200 flex items-center gap-1">
                    <span>سلة المبيعات النشطة</span>
                  </h5>
                </div>

                {/* Cart Items List */}
                <div className="space-y-2 max-h-36 overflow-y-auto">
                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-900 flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-slate-200">2,200 دج</span>
                    <div className="text-right">
                      <p className="font-bold text-slate-300">شاحن سريع Algora Type-C 30W</p>
                      <p className="text-[9px] text-slate-500">الكمية: 1 | سعر الحبة: 2,200 دج</p>
                    </div>
                  </div>

                  <div className="p-2 bg-slate-950/80 rounded-lg border border-slate-900 flex items-center justify-between text-[10px]">
                    <span className="font-mono font-bold text-slate-200">3,600 دج</span>
                    <div className="text-right">
                      <p className="font-bold text-slate-300">سماعات بلوتوث M10 Pro</p>
                      <p className="text-[9px] text-slate-500">الكمية: 2 | سعر الحبة: 1,800 دج</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                {/* Total box */}
                <div className="p-3 bg-purple-600/10 border border-purple-500/20 rounded-xl flex items-center justify-between font-mono">
                  <span className="text-sm font-black text-purple-400">5,800 دج</span>
                  <span className="text-[10px] text-slate-400 font-sans font-bold">المبلغ الإجمالي الكلي</span>
                </div>

                {/* Payment Methods */}
                <div className="space-y-1">
                  <label className="block text-[9px] text-slate-500 font-bold">طريقة الدفع المختارة</label>
                  <div className="grid grid-cols-3 gap-1 text-[9px] text-center font-bold">
                    <div className="p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-400 cursor-pointer">نقداً 💵</div>
                    <div className="p-1.5 bg-purple-600 border border-purple-500 text-white rounded cursor-pointer">بريدي موب 📱</div>
                    <div className="p-1.5 bg-slate-950 border border-slate-800 rounded text-slate-400 cursor-pointer">CCP 🏦</div>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow">
                  <span>إتمام عملية البيع وطباعة الفاتورة</span>
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Fast products grid */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col gap-3 justify-between">
              <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <input 
                  type="text" 
                  readOnly 
                  placeholder="ابحث بالاسم أو الباركود... 🔍" 
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-[10px] text-slate-300 w-1/2 text-right"
                />
                <h5 className="font-extrabold text-xs text-slate-200">المنتجات الأكثر مبيعاً بالمحل</h5>
              </div>

              {/* Products Mock Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1 overflow-y-auto pt-2">
                {[
                  { name: "شاحن Algora 30W", price: "2,200 دج", qty: "24 قطعة", category: "إكسسوارات" },
                  { name: "سماعات M10 Pro", price: "1,800 دج", qty: "15 قطعة", category: "إكسسوارات" },
                  { name: "كابل شحن Type-C", price: "800 دج", qty: "42 قطعة", category: "إكسسوارات" },
                  { name: "حامي زجاج سيراميك", price: "600 دج", qty: "80 قطعة", category: "إكسسوارات" },
                  { name: "غلاف سيليكون شفاف", price: "1,200 دج", qty: "30 قطعة", category: "إكسسوارات" },
                  { name: "حامل هاتف السيارة", price: "1,500 دج", qty: "12 قطعة", category: "إكسسوارات" }
                ].map((p, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-850 rounded-xl text-right space-y-1 transition-all cursor-pointer group hover:border-purple-500/30">
                    <span className="text-[8px] text-slate-500 font-bold block">{p.category} | {p.qty}</span>
                    <p className="font-extrabold text-[10px] text-slate-200 group-hover:text-purple-400 transition-colors truncate">{p.name}</p>
                    <p className="text-[10px] font-mono font-black text-purple-400">{p.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case "img_tracking":
      return (
        <div className="w-full h-full bg-slate-950 flex flex-col relative text-right text-xs">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] font-black text-purple-400">تتبع حالة تصليح الهاتف + طباعة الوصل 🖨️</span>
            <h4 className="font-black text-slate-200">فون زون — ميزة التتبع المباشر لخدمة العملاء</h4>
          </div>

          <div className="flex-1 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden items-center justify-center">
            {/* Left: Printer Receipt Mockup */}
            <div className="bg-white p-4 text-slate-900 rounded shadow-2xl space-y-2 border-l-4 border-dashed border-slate-300 max-h-64 overflow-y-auto max-w-xs mx-auto text-center font-sans">
              <div className="space-y-1 pb-2 border-b border-dashed border-slate-400">
                <h6 className="font-black text-sm tracking-wide">PHONE ZONE — فون زون</h6>
                <p className="text-[8px] font-bold">نهج ديدوش مراد — الجزائر العاصمة</p>
                <p className="text-[8px] font-bold font-mono">الهاتف: 0555123456</p>
              </div>

              <div className="text-right text-[8px] space-y-0.5">
                <p className="flex justify-between font-mono"><span>REP_101</span> <span className="font-bold">رقم تذكرة الصيانة:</span></p>
                <p className="flex justify-between font-mono"><span>2026-07-08</span> <span className="font-bold">تاريخ الاستلام:</span></p>
                <p className="flex justify-between"><span>هيثم بومرداس</span> <span className="font-bold">الزبون:</span></p>
                <p className="flex justify-between"><span>iPhone 14 Pro</span> <span className="font-bold">الهاتف المستلم:</span></p>
              </div>

              <div className="h-px bg-dashed border-b border-slate-400 my-1" />

              <div className="text-right text-[8px] font-bold space-y-1">
                <p className="font-black text-[9px]">تفاصيل الطلب:</p>
                <div className="flex justify-between font-normal"><span>12,500 دج</span> <span>شاشة آيفون 14 برو أصلية x1</span></div>
                <div className="flex justify-between font-normal"><span>5,500 دج</span> <span>تكلفة تركيب وعمل الورشة</span></div>
              </div>

              <div className="h-px bg-dashed border-b border-slate-400 my-1" />

              <div className="text-[8px] space-y-0.5 text-right">
                <p className="flex justify-between font-mono"><span className="font-black text-[10px]">18,000 دج</span> <span className="font-bold">المجموع الإجمالي:</span></p>
                <p className="flex justify-between font-mono"><span className="text-emerald-700 font-black">5,000 دج</span> <span className="font-bold">العربون المدفوع:</span></p>
                <p className="flex justify-between font-mono"><span className="text-rose-700 font-black">13,000 دج</span> <span className="font-bold">المتبقي للدفع:</span></p>
              </div>

              <div className="pt-2 flex flex-col items-center gap-1">
                {/* Simulated tiny barcode */}
                <div className="w-24 h-6 bg-slate-900 relative flex items-center justify-center text-[6px] text-white font-mono tracking-widest leading-none">
                  ||||| | ||||| | |||
                </div>
                <span className="text-[7px] text-slate-500 font-extrabold">امسح الكود لتتبع جهازك لايف</span>
              </div>
            </div>

            {/* Right: Phone Frame Live Client Tracker */}
            <div className="w-full max-w-[210px] bg-slate-900 border-2 border-slate-800 rounded-3xl p-3.5 relative overflow-hidden flex flex-col justify-between aspect-[9/16] min-h-[260px] mx-auto text-right">
              {/* Dynamic Island */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-black rounded-full z-20" />
              
              <div className="pt-3 space-y-1">
                <p className="text-[9px] text-slate-400 font-bold">موقع تتبع تصليح الهواتف</p>
                <h5 className="font-extrabold text-[11px] text-purple-400">مرحباً هيثم بومرداس 👋</h5>
              </div>

              {/* Steps Progress Visual */}
              <div className="space-y-2 py-2 flex-1 flex flex-col justify-center">
                {[
                  { text: "تم استلام هاتفك في ورشتنا", done: true },
                  { text: "قيد فحص ومعاينة التقني", done: true },
                  { text: "تحت التركيب الفعلي لقطع الغيار", done: true, active: true },
                  { text: "جاهز للتسليم في المحل والمطابقة", done: false }
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 justify-end text-[8px] font-bold">
                    <span className={`text-right flex-1 leading-tight ${step.active ? "text-purple-400 font-black" : step.done ? "text-slate-300" : "text-slate-500"}`}>{step.text}</span>
                    <div className="flex flex-col items-center shrink-0">
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${step.active ? "bg-purple-600 border-purple-500 text-white animate-pulse" : step.done ? "bg-emerald-500 border-emerald-400 text-white" : "bg-slate-950 border-slate-800 text-slate-600"}`}>
                        {step.done && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-[8px] font-black rounded-md flex items-center justify-center gap-1">
                  <span>راسلنا على واتساب 💬</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    case "img_zakat":
      return (
        <div className="w-full h-full bg-slate-950 flex flex-col relative text-right text-xs">
          {/* Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-[10px] font-black text-purple-400">حساب زكاة المال وعائدات المحلات التجارية بالجزائر 🇩🇿</span>
            <h4 className="font-black text-slate-200">فون زون — موديول تصفية وحساب وعاء الزكاة</h4>
          </div>

          <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden items-center justify-center">
            {/* Interactive Inputs Panel */}
            <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-3">
              <h5 className="font-extrabold text-xs text-slate-200 border-b border-slate-800 pb-2">مدخلات حساب وعاء الزكاة</h5>
              
              <div className="space-y-2.5 text-[10px]">
                <div className="space-y-1">
                  <div className="flex justify-between font-mono"><span className="text-purple-400 font-bold">850,000 دج</span> <span className="font-bold text-slate-300">السيولة النقدية المتوفرة (كاش + بريدي موب)</span></div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[70%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono"><span className="text-purple-400 font-bold">120,000 دج</span> <span className="font-bold text-slate-300">الديون التي نرجو استردادها من الزبائن (كريدي)</span></div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full w-[25%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-mono"><span className="text-rose-400 font-bold">150,000 دج</span> <span className="font-bold text-slate-300">الديون الواجبة علينا للموردين (تطرح وتخصم)</span></div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[35%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Zakat Result Summary Card */}
            <div className="bg-gradient-to-b from-purple-950/20 to-slate-950 border border-purple-900/30 p-4 rounded-xl space-y-3 text-right relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-purple-600 text-white font-black text-[8px] px-2.5 py-1 rounded-br-lg tracking-wider">
                مكتمل ومحتسب
              </div>

              <div className="space-y-1.5">
                <h5 className="font-extrabold text-xs text-slate-200">التقرير النهائي والنتيجة المالية</h5>
                <p className="text-[10px] text-slate-400">يقوم النظام بمطابقة مجموع الوعاء مع قيمة النصاب الشرعي بالجزائر تلقائياً.</p>
              </div>

              <div className="h-px bg-slate-900/80" />

              <div className="space-y-2 text-[10px]">
                <p className="flex justify-between">
                  <span className="font-mono font-bold text-slate-200">820,000 دج</span>
                  <span className="text-slate-400">وعاء الزكاة الخاضع للحساب:</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-mono font-bold text-slate-200">1,450,000 دج</span>
                  <span className="text-slate-400">مقدّار النصاب الجزائري الحالي المقدر:</span>
                </p>
                
                <div className="h-px bg-slate-900/80" />

                <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-lg text-amber-400 text-[10px] leading-relaxed font-bold">
                  ⚠️ الوعاء الإجمالي للمحل (820,000 دج) لم يبلغ النصاب الشرعي المقدر بـ 1,450,000 دج بعد. لا تجب الزكاة حتى يبلغ وعاء المال النصاب ويحول عليه الحول.
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-400">
          Unknown Mockup
        </div>
      );
  }
}
