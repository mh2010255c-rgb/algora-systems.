import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { 
  Bot, Send, User, MessageSquareCode, Headphones, AlertCircle, CheckCircle, 
  PhoneCall, Mail, Clock, HelpCircle, Loader2, PlayCircle, Smartphone
} from "lucide-react";
import { ChatMessage } from "../types";

export default function SupportCenter() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      content: "مرحباً بك في مركز الدعم الفني الذكي لـ Algora Systems! 👋\nأنا مساعدك التقني الفوري لخدمتكم 24/7. يمكنك سؤالي عن أي شيء يخص تشغيل البرنامج، تكامل طابعات الفواتير، ماسحات الباركود، تفعيل الاشتراكات، أو كيفية تسيير المخزون والصيانة. تفضل، كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const createTicket = useMutation(api.tickets.create);

  // Ticket Form State
  const [ticketStoreName, setTicketStoreName] = useState("");
  const [ticketPhone, setTicketPhone] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketMessage, setTicketMessage] = useState("");
  const [ticketStatus, setTicketStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);

  // Suggested questions to make it interactive and super easy
  const suggestedQuestions = [
    "هل يدعم الدفع ببريدي موب وCCP؟",
    "كيف أربط طابعة الفواتير الحرارية؟",
    "هل يعمل البرنامج من الهاتف والتابلت؟",
    "كيف تمنع الصيانة سرقة قطع الغيار؟"
  ];

  // Scroll to bottom on new chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  // Submit chat to Gemini API
  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputMessage;
    if (!messageText.trim()) return;

    // Add user message to state
    const userMsg: ChatMessage = {
      id: "user_" + Date.now(),
      role: "user",
      content: messageText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsSending(true);

    try {
      const response = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          chatHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      
      const botMsg: ChatMessage = {
        id: "bot_" + Date.now(),
        role: "model",
        content: data.reply || "عذراً، لم أستطع توليد رد في الوقت الحالي. يرجى مراجعة الاتصال الخاص بك.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: "error_" + Date.now(),
        role: "model",
        content: "عذراً، حدث خطأ أثناء الاتصال بالخادم الذكي. يرجى تكرار المحاولة أو التواصل مع الدعم الفني الهاتفي المباشر على الرقم 0671037202.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  // Submit Ticket to API
  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketPhone || !ticketMessage) {
      setTicketStatus({ error: "الرجاء إدخال رقم الواتساب وتفاصيل الاستفسار." });
      return;
    }

    setIsSubmittingTicket(true);
    setTicketStatus(null);

    const storeName = ticketStoreName.trim() || "استفسار عام / زائر";
    const subject = ticketSubject.trim() || "دعم فني واتساب";

    try {
      await createTicket({
        storeName: storeName,
        phone: ticketPhone,
        subject: subject,
        message: ticketMessage
      });

      setTicketStatus({ 
        success: true, 
        message: "تم إرسال تذكرة الدعم الفني بنجاح! سيقوم أحد المهندسين بالرد عليك أو التواصل معك عبر الهاتف/الواتساب خلال دقائق." 
      });
      // Clear inputs
      setTicketStoreName("");
      setTicketPhone("");
      setTicketSubject("");
      setTicketMessage("");
    } catch (err) {
      setTicketStatus({ error: "فشل الاتصال بالخادم. يرجى المحاولة لاحقاً." });
    } finally {
      setIsSubmittingTicket(false);
    }
  };

  return (
    <div className="space-y-12">
      
      {/* 1. Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-2xl mb-1">
          <Headphones className="w-8 h-8" />
        </div>
        <h2 className="text-2xl md:text-4xl font-black text-slate-100 tracking-tight">
          مركز الدعم الفني المحلي المباشر
        </h2>
        <p className="text-sm md:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          نحن في <span className="text-purple-400 font-bold">Algora Systems</span> فخورون بتقديم دعم فني حقيقي، فوري ومحلي بالكامل داخل الجزائر لحل أي انشغالات أو تدريب العمال والمسيرين.
        </p>
      </div>

      {/* 2. Chat & Ticket Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: GEMINI LIVE CHATBOT (7/12 width) */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-850 rounded-2xl shadow-xl flex flex-col h-[560px] overflow-hidden">
          
          {/* Chat Header */}
          <div className="bg-slate-900/60 px-5 py-3.5 border-b border-slate-850 flex items-center justify-between text-right">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center border border-purple-500/20 text-white relative">
                <Bot className="w-5 h-5" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute bottom-[-1px] left-[-1px] border-2 border-slate-950 animate-pulse"></span>
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-100">المساعد التقني الذكي لـ Algora</h4>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span>إجابات فورية ذكية متوفرة 24 ساعة على مدار الأسبوع</span>
                </p>
              </div>
            </div>
            <div className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-400 font-bold">
              نشط الآن دج
            </div>
          </div>

          {/* Chat Messages Stage */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-right bg-slate-950/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 items-start max-w-[85%] ${
                  msg.role === "user" ? "mr-auto flex-row-reverse text-left" : "ml-auto"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === "user" ? "bg-purple-600/30 text-purple-300" : "bg-purple-600 text-white"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className="space-y-1">
                  <div className={`px-4 py-3 rounded-2xl text-xs md:text-sm leading-relaxed whitespace-pre-line text-right ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white rounded-tr-none"
                      : "bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono block px-1">
                    {msg.timestamp.toLocaleTimeString("ar-DZ", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3 items-start ml-auto max-w-[80%]">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />
                  <span>المساعد الذكي يفكّر في حل تقني...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Questions Bar */}
          <div className="px-5 py-2.5 bg-slate-900/30 border-t border-slate-850/60 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2 text-right">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isSending}
                className="text-[10px] md:text-xs font-bold bg-slate-900 hover:bg-purple-900/20 border border-slate-800 hover:border-purple-500/30 px-3 py-1.5 rounded-full text-slate-300 transition-all shrink-0 cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Chat Send bar */}
          <div className="p-4 bg-slate-900/80 border-t border-slate-850 flex gap-2">
            <input
              type="text"
              placeholder="اكتب استفسارك التقني أو التجاري هنا..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isSending}
              className="grow text-xs md:text-sm px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-500 text-right"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isSending || !inputMessage.trim()}
              className={`p-3 rounded-xl transition-all font-bold text-xs flex items-center justify-center ${
                inputMessage.trim() && !isSending
                  ? "bg-purple-600 hover:bg-purple-500 text-white shadow-md cursor-pointer"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: DIRECT TECHNICAL TICKET FORM (5/12 width) */}
        <div className="lg:col-span-5 space-y-6 text-right">
          
          {/* Support Ticket Submission Form */}
          <div className="bg-slate-950/80 border border-slate-850 p-6 rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-850 pb-3">
              <MessageSquareCode className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="font-extrabold text-sm text-slate-200">إرسال تذكرة دعم فني فوري</h4>
                <p className="text-[10px] text-slate-400">للحصول على معاودة اتصال من مهندسي الدعم وحل المشاكل المعقدة.</p>
              </div>
            </div>

            <form onSubmit={handleTicketSubmit} className="space-y-3.5">
              
              <AnimatePresence mode="wait">
                {ticketStatus?.success && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs flex gap-2 items-start"
                  >
                    <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-bold">{ticketStatus.message}</p>
                  </motion.div>
                )}

                {ticketStatus?.error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex gap-2 items-start"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="leading-relaxed font-bold">{ticketStatus.error}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-xs text-slate-400 font-bold mb-1">رقم الواتساب (WhatsApp)</label>
                <div className="relative">
                  <input
                    type="tel"
                    value={ticketPhone}
                    onChange={(e) => setTicketPhone(e.target.value)}
                    placeholder="مثال: 0671037202"
                    className="w-full text-xs pr-10 pl-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 font-mono text-right"
                    required
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    {/* Simple green indicator or SVG for WhatsApp */}
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 font-bold mb-1">اكتب استفسارك أو مشكلتك هنا</label>
                <textarea
                  rows={6}
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  placeholder="اكتب استفسارك بالتفصيل وسيقوم مهندس الدعم بالرد عليك مباشرة عبر الواتساب..."
                  className="w-full text-xs px-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500 text-right leading-relaxed"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmittingTicket}
                className="w-full py-2.5 bg-gradient-to-l from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {isSubmittingTicket ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    جاري إرسال تذكرتك للدعم...
                  </>
                ) : (
                  <>
                    <MessageSquareCode className="w-4 h-4" />
                    تأكيد إرسال طلب الدعم الفني
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Local Support Details Card */}
          <div className="bg-slate-950/80 border border-slate-850 p-5 rounded-2xl shadow-xl space-y-4 text-xs leading-relaxed text-slate-300">
            <h4 className="font-bold text-slate-200 border-b border-slate-850 pb-2">تفاصيل الاتصال والتدريب الفوري 🇩🇿</h4>
            
            <div className="space-y-3">
              <div className="flex gap-3 items-start justify-end">
                <div className="text-right">
                  <h5 className="font-bold text-slate-200">الهاتف والواتساب المباشر:</h5>
                  <p className="font-mono text-purple-400 font-bold text-[13px] mt-0.5 inline-block" dir="ltr">0671037202 / +213 671 03 72 02</p>
                  <div className="mt-2.5">
                    <a
                      href="https://wa.me/213671037202?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%86%D8%A7%20%D9%85%D9%87%D8%AA%D9%85%20%D8%A8%D9%86%D8%B8%D8%A7%D9%85%20Algora%20%D9%88%D8%A3%D8%B1%D9%8A%D8%AF%20%D8%A7%D9%84%D8%AD%D8%B5%D9%88%D9%84%20%D8%B9%D9%84%D9%89%20%D9%86%D8%B3%D8%AE%D8%AA%D9%8A%20%D8%A7%D9%84%D8%AA%D8%AC%D8%B1%D9%8A%D8%A8%D9%8A%D8%A9%20%D8%A7%D9%84%D9%85%D8%AC%D8%A7%D9%86%D9%8A%D8%A9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black shadow transition-all cursor-pointer"
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.623-1.023-5.086-2.885-6.948C16.59 2.016 14.11 1.008 11.99 1.008 6.556 1.008 2.13 5.379 2.127 10.81c-.001 1.76.46 3.473 1.336 4.985l-.997 3.638 3.75-.98c1.478.808 2.985 1.2 4.541 1.201h.003zm11.236-7.394c-.29-.144-1.711-.844-1.977-.94-.266-.097-.46-.144-.654.144-.194.288-.75.94-.919 1.13-.17.19-.338.213-.628.069-.29-.144-1.226-.452-2.336-1.443-.864-.77-1.447-1.722-1.617-2.011-.17-.29-.018-.447.127-.59.13-.13.29-.338.435-.506.145-.17.194-.288.29-.48.097-.193.048-.36-.024-.505-.072-.144-.654-1.577-.895-2.155-.236-.577-.496-.499-.679-.508-.176-.008-.377-.01-.58-.01-.202 0-.53.076-.807.38-.277.303-1.057 1.034-1.057 2.52 0 1.487 1.082 2.923 1.231 3.125.15.202 2.13 3.251 5.16 4.56.72.311 1.282.497 1.72.637.724.23 1.383.197 1.903.12.58-.087 1.712-.699 1.952-1.376.24-.678.24-1.258.17-1.376-.073-.118-.266-.192-.556-.338z"/>
                      </svg>
                      <span>تواصل عبر واتساب</span>
                    </a>
                  </div>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 shrink-0">
                  <PhoneCall className="w-4 h-4" />
                </div>
              </div>

              <div className="flex gap-3 items-start justify-end">
                <div>
                  <h5 className="font-bold text-slate-200">البريد الإلكتروني الرسمي:</h5>
                  <p className="font-mono text-slate-400 text-[11px] mt-0.5">contact@algora.dz</p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
              </div>

              <div className="flex gap-3 items-start justify-end">
                <div>
                  <h5 className="font-bold text-slate-200">أوقات العمل والتواجد:</h5>
                  <p className="text-slate-400 mt-0.5">على مدار الساعة 24/7 للرد الهاتفي الفوري.</p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              <div className="h-px bg-slate-850" />

              <div className="bg-purple-950/25 border border-purple-500/20 p-3.5 rounded-xl space-y-1.5 text-right">
                <h5 className="font-bold text-purple-300 text-xs flex items-center justify-end gap-1.5">
                  <PlayCircle className="w-4 h-4 shrink-0" />
                  برنامج التدريب بالفيديو وعن بعد:
                </h5>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  نحن لا نبيع البرنامج ونرحل! نوفر جلسة تواصل كاملة عبر الـ <span className="font-bold text-slate-300">AnyDesk</span> لتثبيت البرنامج، إعداد طابعتك، وتعليم عمالك كيفية استخدام المبيعات والمخزن في أقل من 10 دقائق كاملة.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
