import React from "react";
import { FileText, HelpCircle, Trash2 } from "lucide-react";

interface SupportTicket {
  id: string;
  storeName: string;
  phone: string;
  subject: string;
  message: string;
  timestamp: string;
  status: "open" | "resolved";
}

interface TicketsTabProps {
  sortedTickets: SupportTicket[];
  toggleTicketStatus: (id: string, status: "open" | "resolved") => void;
  deleteSupportTicket: (id: string) => void;
  createMockTicket: () => void;
}

export default function TicketsTab({
  sortedTickets,
  toggleTicketStatus,
  deleteSupportTicket,
  createMockTicket
}: TicketsTabProps) {
  if (sortedTickets.length === 0) {
    return (
      <div className="py-20 text-center space-y-3 text-slate-500 text-xs">
        <FileText className="w-12 h-12 mx-auto text-slate-750" />
        <p className="font-black text-sm text-slate-400">لا توجد تذاكر دعم فني تطابق البحث.</p>
        <button 
          onClick={createMockTicket}
          className="px-4 py-2 bg-transparent border border-[#7C3AED] text-[#7C3AED] hover:bg-[#7C3AED]/10 font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          + توليد تذكرة عشوائية فورا
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-right text-xs border-collapse min-w-[1000px]">
        <thead>
          <tr className="bg-[#0B0B0F] border-b border-[rgba(255,255,255,0.06)] text-slate-400 text-[10px] uppercase font-black tracking-wider">
            <th className="px-6 py-4 text-right">صورة المنتج</th>
            <th className="px-6 py-4 text-right">المتجر وصاحب الشكوى</th>
            <th className="px-6 py-4 text-right">الموضوع والمسألة</th>
            <th className="px-6 py-4 text-right">المحتوى المفصل</th>
            <th className="px-6 py-4 text-center">الحالة</th>
            <th className="px-6 py-4 text-right">تاريخ الإرسال</th>
            <th className="px-6 py-4 text-left">خيارات التحكم</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
          {sortedTickets.map((tkt) => (
            <tr key={tkt.id} className="hover:bg-[#0B0B0F]/50 transition-all duration-150 group">
              
              {/* image column */}
              <td className="px-6 py-4">
                <div className="w-11 h-11 rounded-lg bg-gradient-to-tr from-indigo-500/20 to-[#7C3AED]/20 border border-[rgba(255,255,255,0.06)] flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                </div>
              </td>

              {/* store name & contact */}
              <td className="px-6 py-4 font-black text-white text-sm">
                <div>{tkt.storeName}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{tkt.phone}</div>
              </td>

              {/* subject */}
              <td className="px-6 py-4 font-bold text-slate-200">
                {tkt.subject}
              </td>

              {/* message content */}
              <td className="px-6 py-4 text-slate-400 max-w-xs truncate" title={tkt.message}>
                {tkt.message}
              </td>

              {/* status */}
              <td className="px-6 py-4 text-center">
                {tkt.status === "resolved" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>متوفر (محلولة)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/10 border border-rose-500/30 text-rose-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    <span>نافد (مفتوحة)</span>
                  </span>
                )}
              </td>

              {/* date */}
              <td className="px-6 py-4 font-mono text-[11px] text-slate-500">
                {new Date(tkt.timestamp).toLocaleDateString("ar-DZ", {day: "2-digit", month: "2-digit", year: "2-digit"})}
              </td>

              {/* actions (outline) */}
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => toggleTicketStatus(tkt.id, tkt.status)}
                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all cursor-pointer ${
                      tkt.status === "resolved"
                        ? "border-[#F59E0B]/30 hover:bg-[#F59E0B]/10 text-[#F59E0B]"
                        : "border-[#22C55E]/30 hover:bg-[#22C55E]/10 text-[#22C55E]"
                    }`}
                  >
                    {tkt.status === "resolved" ? "إعادة فتح" : "تعليم كمحلولة"}
                  </button>

                  <button
                    onClick={() => deleteSupportTicket(tkt.id)}
                    className="p-1.5 bg-transparent border border-rose-500/30 hover:bg-rose-500/10 text-rose-400 rounded-lg transition-all cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
