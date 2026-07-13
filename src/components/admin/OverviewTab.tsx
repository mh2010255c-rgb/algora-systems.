import React from "react";
import { Sparkles, Activity, Layers, Clock, CheckCircle2, TrendingUp, AlertCircle, Users } from "lucide-react";

interface TrialRequest {
  id: string;
  storeName: string;
  ownerName: string;
  phone: string;
  city: string;
  timestamp: string;
  status: "pending" | "contacted" | "demo_sent" | "approved" | "completed" | "canceled";
}

interface OverviewTabProps {
  trialRequests: TrialRequest[];
  activityLogs: string[];
  stats: {
    totalTrials: number;
    approvedTrials: number;
    pendingTrials: number;
    totalRevenue: number;
  };
  setActivityLogs: React.Dispatch<React.SetStateAction<string[]>>;
  addLog: (msg: string) => void;
  createMockRequest: () => void;
  setActiveAdminSubTab: (tab: "overview" | "trials" | "tickets" | "baridimob" | "logs" | "settings") => void;
  setStatusFilter: (filter: string) => void;
  exportToCSV: () => void;
}

export default function OverviewTab({
  trialRequests,
  activityLogs,
  stats,
  setActivityLogs,
  addLog,
  createMockRequest,
  setActiveAdminSubTab,
  setStatusFilter,
  exportToCSV
}: OverviewTabProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart workspace (2/3 width) */}
        <div className="lg:col-span-2 space-y-4 text-right">
          <div className="flex items-center justify-between flex-row-reverse">
            <h4 className="text-sm font-black text-white">منحنى تطور الطلبات والتحويلات المالية بالجزائر</h4>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold flex-row-reverse">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7C3AED]"></span>الطلبات</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#06B6D4]"></span>المبيعات والـ CCP</span>
            </div>
          </div>

          <div className="bg-[#0B0B0F] p-4 rounded-xl border border-[rgba(255,255,255,0.06)]">
            <svg className="w-full h-52" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25"/>
                  <stop offset="100%" stopColor="#7C3AED" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
              <line x1="0" y1="160" x2="500" y2="160" stroke="rgba(255,255,255,0.03)" strokeDasharray="3,3" />
              
              <path d="M 0 180 C 40 140, 80 160, 120 110 C 160 70, 200 130, 240 80 C 280 40, 320 90, 360 50 C 400 30, 440 70, 500 20 L 500 200 L 0 200 Z" fill="url(#purpleGlow)" />
              <path d="M 0 180 C 40 140, 80 160, 120 110 C 160 70, 200 130, 240 80 C 280 40, 320 90, 360 50 C 400 30, 440 70, 500 20" fill="none" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
              <path d="M 0 195 C 50 170, 100 180, 150 140 C 200 120, 250 150, 300 95 C 350 70, 400 110, 450 65 L 500 50" fill="none" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4,2" />

              <circle cx="120" cy="110" r="4" fill="#7C3AED" stroke="#0B0B0F" strokeWidth="1.5" />
              <circle cx="240" cy="80" r="4" fill="#06B6D4" stroke="#0B0B0F" strokeWidth="1.5" />
              <circle cx="360" cy="50" r="4" fill="#F59E0B" stroke="#0B0B0F" strokeWidth="1.5" />
              <circle cx="500" cy="20" r="5" fill="#22C55E" stroke="#0B0B0F" strokeWidth="2" className="animate-pulse" />
            </svg>
            <div className="flex justify-between items-center text-[9px] text-slate-500 mt-2 px-1 font-mono flex-row-reverse">
              <span>تحديث مباشر (الآن)</span>
              <span>منتصف الشهر (يوم 15)</span>
              <span>بداية الشهر (يوم 1)</span>
            </div>
          </div>
        </div>

        {/* Sidebar/Timeline inside overview (1/3 width) */}
        <div className="space-y-4 text-right">
          <h4 className="text-sm font-black text-white">آخر الطلبات المسجلة فورا</h4>
          <div className="bg-[#0B0B0F] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] h-52 overflow-y-auto space-y-3.5 scrollbar-thin">
            {trialRequests.slice(0, 5).map((req) => (
              <div key={req.id} className="relative flex items-start gap-2.5 text-right justify-end flex-row-reverse">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${req.status === 'approved' ? 'bg-[#22C55E]' : 'bg-[#F59E0B]'}`}></div>
                <div className="text-right flex-1 min-w-0">
                  <p className="text-xs font-black text-white truncate">{req.storeName}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{req.ownerName} • {req.city}</p>
                </div>
                <span className="text-[9px] text-slate-500 font-mono shrink-0">{new Date(req.timestamp).toLocaleTimeString("ar-DZ", {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* AI Assistant Advices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0B0B0F] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] space-y-2 text-right">
          <h5 className="text-xs font-black text-white flex items-center gap-1.5 justify-start flex-row-reverse">
            <Sparkles className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>توصيات الذكاء الاصطناعي للمشرف</span>
          </h5>
          <div className="space-y-1.5 text-[10px] leading-relaxed text-slate-400 font-medium">
            <p>💡 <strong className="text-[#06B6D4]">أعلى ولاية:</strong> الجزائر العاصمة تحقق أعلى نسبة تأكيد اشتراكات بـ 98% اليوم.</p>
            <p>📈 <strong className="text-[#7C3AED]">الباقة الأفضل:</strong> الباقة السنوية تشكل 68% من إجمالي مبيعات التحويلات المؤكدة.</p>
            <p>🎯 <strong className="text-[#F59E0B]">أوقات الذروة:</strong> تشير البيانات إلى زيادة الطلبات بنسبة 40% بين 4:00 إلى 8:00 مساءً.</p>
          </div>
        </div>

        <div className="bg-[#0B0B0F] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] space-y-2 text-right">
          <h5 className="text-xs font-black text-white flex items-center gap-1.5 justify-start flex-row-reverse">
            <Activity className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>سجل النشاطات المباشر</span>
          </h5>
          <div className="h-20 overflow-y-auto space-y-1.5 text-[9px] font-mono text-slate-500 scrollbar-thin text-right">
            {activityLogs.map((log, index) => (
              <div key={index} className="truncate border-b border-slate-900 pb-0.5 last:border-0">{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
