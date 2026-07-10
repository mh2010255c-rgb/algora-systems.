import React from "react";
import { CreditCard } from "lucide-react";

interface BaridiMobPayment {
  id: string;
  storeName: string;
  amount: number;
  transactionRef: string;
  senderName: string;
  date: string;
  status: "pending" | "verified" | "rejected";
}

interface BaridimobTabProps {
  baridimobPayments: BaridiMobPayment[];
  setBaridimobPayments: React.Dispatch<React.SetStateAction<BaridiMobPayment[]>>;
  handleVerifyPayment: (id: string, amount: number) => void;
  handleRejectPayment: (id: string) => void;
  addLog: (msg: string) => void;
}

export default function BaridimobTab({
  baridimobPayments,
  setBaridimobPayments,
  handleVerifyPayment,
  handleRejectPayment,
  addLog
}: BaridimobTabProps) {
  return (
    <div className="p-6 space-y-6 text-right">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-row-reverse">
        <div>
          <h4 className="text-sm font-black text-white">مطابقة إيصالات سداد بريدي موب والـ CCP بالجزائر</h4>
          <p className="text-[11px] text-slate-400 mt-1">تأكد من مطابقة اسم المرسل والمبلغ ومرجع العملية قبل التفعيل النهائي.</p>
        </div>
        <button 
          onClick={() => {
            const rId = "PM-" + Math.floor(2914 + Math.random() * 1000);
            const rAmt = [2500, 20000, 35000][Math.floor(Math.random() * 3)];
            const rRef = "MOB-" + Math.floor(100000 + Math.random() * 900000) + "-DZ";
            const rNames = ["بومعزة عيسى", "غزالي فريد", "بلخير محمد"];
            setBaridimobPayments(prev => [
              {
                id: rId,
                storeName: "متجر افتراضي صيانة " + Math.floor(Math.random() * 10),
                amount: rAmt,
                transactionRef: rRef,
                senderName: rNames[Math.floor(Math.random() * rNames.length)],
                date: new Date().toISOString(),
                status: "pending"
              },
              ...prev
            ]);
            addLog("تم إرسال إيداع بريدي موب تجريبي جديد للمطابقة.");
          }}
          className="px-4 py-2 bg-transparent border border-[#7C3AED] hover:bg-[#7C3AED]/10 text-[#7C3AED] font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          + محاكاة إيداع بريدي موب
        </button>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="bg-[#0B0B0F] border-b border-[rgba(255,255,255,0.06)] text-slate-400 text-[10px] uppercase font-black tracking-wider">
              <th className="px-6 py-4 text-right">صورة المنتج</th>
              <th className="px-6 py-4 text-right">المحل التجاري المستفيد</th>
              <th className="px-6 py-4 text-right">اسم مرسل الحوالة</th>
              <th className="px-6 py-4 text-right">المبلغ المودع</th>
              <th className="px-6 py-4 text-right">الرقم المرجعي والـ RIP</th>
              <th className="px-6 py-4 text-center">حالة التحقق</th>
              <th className="px-6 py-4 text-left">إجراءات المطابقة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
            {baridimobPayments.map((p) => (
              <tr key={p.id} className="hover:bg-[#0B0B0F]/50 transition-all duration-150 group">
                
                {/* image column */}
                <td className="px-6 py-4">
                  <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-[#06B6D4]/20 to-[#7C3AED]/20 border border-[rgba(255,255,255,0.06)] flex items-center justify-center shrink-0">
                    <CreditCard className="w-5 h-5 text-[#06B6D4]" />
                  </div>
                </td>

                {/* store name */}
                <td className="px-6 py-4 font-black text-white text-sm">
                  {p.storeName}
                </td>

                {/* sender name */}
                <td className="px-6 py-4 font-bold text-slate-300">
                  {p.senderName}
                </td>

                {/* amount */}
                <td className="px-6 py-4 font-mono font-black text-[#22C55E] text-sm">
                  {p.amount.toLocaleString()} دج
                </td>

                {/* rip/ref */}
                <td className="px-6 py-4 text-slate-400">
                  <span className="font-mono text-[11px] bg-[#0B0B0F] px-2.5 py-1 rounded border border-[rgba(255,255,255,0.06)]">{p.transactionRef}</span>
                </td>

                {/* status */}
                <td className="px-6 py-4 text-center">
                  {p.status === "verified" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>متوفر (مؤكدة)</span>
                    </span>
                  ) : p.status === "rejected" ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 border border-rose-500/30 text-rose-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>نافد (مرفوض)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>قليل (معلق)</span>
                    </span>
                  )}
                </td>

                {/* verify / reject (outline only) */}
                <td className="px-6 py-4 text-left">
                  {p.status === "pending" ? (
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => handleVerifyPayment(p.id, p.amount)}
                        className="px-3 py-1.5 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 font-bold transition-all cursor-pointer"
                      >
                        تأكيد الدفع 🟢
                      </button>
                      <button
                        onClick={() => handleRejectPayment(p.id)}
                        className="px-3 py-1.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 font-bold transition-all cursor-pointer"
                      >
                        رفض الإيصال 🔴
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500 font-bold font-mono">تم التدقيق بنجاح</span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
