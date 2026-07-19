import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { 
  Users, UserPlus, Lock, Shield, Check, Trash2, AlertCircle, 
  ShieldAlert, RefreshCw, KeyRound, CheckSquare, Square
} from "lucide-react";

export default function ConfirmersTab() {
  const confirmers = useQuery(api.confirmers.list);
  const createConfirmer = useMutation(api.confirmers.create);
  const updateConfirmer = useMutation(api.confirmers.update);
  const deleteConfirmer = useMutation(api.confirmers.remove);

  // Form States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    "view_orders",
    "edit_confirmation",
    "whatsapp_access"
  ]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Permission Options
  const permissionOptions = [
    { id: "view_orders", label: "رؤية الطلبيات", desc: "السماح برؤية وتصفح جدول الطلبات بالكامل" },
    { id: "edit_confirmation", label: "تعديل حالة التأكيد", desc: "السماح بتعديل حالة الاتصال (لا يرد، تم الاتصال، إلخ)" },
    { id: "edit_status", label: "تعديل حالة الطلب الأساسية", desc: "السماح بتنشيط التراخيص وتغيير الباقة وتعديل البيانات" },
    { id: "whatsapp_access", label: "إرسال واتساب", desc: "السماح بمراسلة العملاء بالواتساب واستخدام القوالب" },
    { id: "delete_orders", label: "حذف الطلبات", desc: "السماح بحذف سجلات العملاء نهائياً من قاعدة البيانات" }
  ];

  const handlePermissionToggle = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  const handleCreateConfirmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim() || !password.trim()) {
      setErrorMsg("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await createConfirmer({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        password: password.trim(),
        permissions: selectedPermissions,
        isActive: true
      });

      setSuccessMsg("✅ تم إضافة المؤكدة وتعيين صلاحياتها بنجاح!");
      setName("");
      setUsername("");
      setPassword("");
      setSelectedPermissions(["view_orders", "edit_confirmation", "whatsapp_access"]);
    } catch (err: any) {
      setErrorMsg(err.message || "حدث خطأ أثناء إضافة المؤكدة.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleConfirmerActive = async (confirmerId: any, currentActive: boolean) => {
    try {
      await updateConfirmer({
        id: confirmerId,
        updates: { isActive: !currentActive }
      });
    } catch (err: any) {
      alert("فشل تحديث حالة الحساب: " + err.message);
    }
  };

  const handleTogglePermission = async (confirmerId: any, permissions: string[], permId: string) => {
    const updatedPermissions = permissions.includes(permId)
      ? permissions.filter(p => p !== permId)
      : [...permissions, permId];
    
    try {
      await updateConfirmer({
        id: confirmerId,
        updates: { permissions: updatedPermissions }
      });
    } catch (err: any) {
      alert("فشل تحديث الصلاحيات: " + err.message);
    }
  };

  const handleDeleteConfirmer = async (confirmerId: any, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف حساب المؤكدة "${name}" نهائياً؟`)) return;

    try {
      await deleteConfirmer({ id: confirmerId });
    } catch (err: any) {
      alert("فشل حذف الحساب: " + err.message);
    }
  };

  return (
    <div className="p-6 space-y-6 text-right">
      
      {/* Tab Info Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-5 flex-row-reverse">
        <div>
          <h4 className="text-sm font-black text-white flex items-center gap-2 justify-end">
            <span>إدارة حسابات وصلاحيات مؤكدات الطلبيات</span>
            <Shield className="w-5 h-5 text-[#8B5CF6]" />
          </h4>
          <p className="text-[11px] text-slate-400 mt-1">
            أنشئ حسابات خاصة للموظفين (المؤكدات) وحدد ما يمكنهم فعله ورؤيته بدقة في لوحة التسيير الكبرى.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* RIGHT COLUMN: LIST OF CONFIRMERS (8 Cols) */}
        <div className="xl:col-span-8 bg-[#14141D] border border-[rgba(255,255,255,0.06)] rounded-[18px] overflow-hidden flex flex-col shadow-sm">
          <div className="p-5 border-b border-white/5 flex items-center justify-between flex-row-reverse">
            <h3 className="text-xs font-black text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#8B5CF6]" />
              <span>الحسابات الحالية والمؤكدات النشطات</span>
            </h3>
            <span className="text-[10px] font-bold text-slate-500 font-mono">
              المجموع: {confirmers ? confirmers.length : 0} حساب
            </span>
          </div>

          <div className="overflow-x-auto w-full">
            {confirmers === undefined ? (
              <div className="py-20 text-center flex flex-col items-center justify-center gap-3 text-slate-500 text-xs font-bold">
                <RefreshCw className="w-8 h-8 text-[#8B5CF6] animate-spin" />
                <p>جاري تحميل الحسابات والصلاحيات...</p>
              </div>
            ) : confirmers.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-xs font-bold space-y-2">
                <ShieldAlert className="w-10 h-10 mx-auto text-slate-700" />
                <p>لا يوجد حسابات مؤكدات مسجلة حالياً.</p>
                <p className="text-[11px] text-slate-600 font-medium">استخدم النموذج الجانبي لإضافة أول مؤكدة.</p>
              </div>
            ) : (
              <table className="w-full text-right text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0B0B12] border-b border-[rgba(255,255,255,0.06)] text-slate-400 text-[10px] uppercase font-black tracking-wider">
                    <th className="px-5 py-4 text-right">الاسم والمستخدم</th>
                    <th className="px-5 py-4 text-right">تاريخ الإنشاء</th>
                    <th className="px-5 py-4 text-right">صلاحيات الحساب</th>
                    <th className="px-5 py-4 text-center">حالة الحساب</th>
                    <th className="px-5 py-4 text-left">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {confirmers.map((conf) => (
                    <tr key={conf._id} className="hover:bg-white/[0.01] transition-all">
                      
                      {/* Name & Username */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 justify-end flex-row-reverse text-right">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8B5CF6]/10 to-[#A855F7]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#A855F7] font-black">
                            {conf.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-black text-white text-xs">{conf.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">@{conf.username}</div>
                          </div>
                        </div>
                      </td>

                      {/* Created At */}
                      <td className="px-5 py-4 font-mono text-[11px] text-slate-500">
                        {new Date(conf.createdAt).toLocaleDateString("ar-DZ")}
                      </td>

                      {/* Permissions Tags */}
                      <td className="px-5 py-4 max-w-[280px]">
                        <div className="flex flex-wrap gap-1 justify-end">
                          {permissionOptions.map((opt) => {
                            const isGranted = conf.permissions.includes(opt.id);
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleTogglePermission(conf._id, conf.permissions, opt.id)}
                                className={`px-2 py-0.5 rounded text-[9px] font-bold transition-all border cursor-pointer ${
                                  isGranted
                                    ? "bg-[#8B5CF6]/15 border-[#8B5CF6]/30 text-[#A855F7]"
                                    : "bg-transparent border-white/5 text-slate-600 hover:border-white/10 hover:text-slate-400"
                                }`}
                                title={opt.desc}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>

                      {/* Active Status Toggle */}
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleToggleConfirmerActive(conf._id, conf.isActive)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border transition-all cursor-pointer ${
                            conf.isActive
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${conf.isActive ? "bg-emerald-400" : "bg-rose-400"}`} />
                          <span>{conf.isActive ? "نشط ومفعل" : "معطل وموقف"}</span>
                        </button>
                      </td>

                      {/* Delete Action */}
                      <td className="px-5 py-4 text-left">
                        <button
                          onClick={() => handleDeleteConfirmer(conf._id, conf.name)}
                          className="p-2 bg-[#0B0B12] hover:bg-rose-500/15 border border-rose-500/20 text-rose-400 rounded-xl transition-all cursor-pointer"
                          title="حذف حساب الموظفة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* LEFT COLUMN: CREATE NEW CONFIRMER (4 Cols) */}
        <div className="xl:col-span-4 bg-[#14141D] border border-[rgba(255,255,255,0.06)] rounded-[18px] p-5 space-y-5 shadow-sm">
          
          <div>
            <h3 className="text-xs font-black text-white flex items-center gap-2 justify-end">
              <UserPlus className="w-4 h-4 text-[#8B5CF6]" />
              <span>إضافة حساب مؤكدة جديد</span>
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">أنشئ حساباً جديداً بنظام صلاحيات مخصص.</p>
          </div>

          <form onSubmit={handleCreateConfirmerSubmit} className="space-y-4">
            
            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-300">الاسم الكامل للمؤكدة (مثال: فاطمة الزهراء):</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="الاسم المعروض"
                className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-3 py-2.5 text-xs text-slate-100 text-right focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]"
              />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-300">اسم المستخدم لتسجيل الدخول (بالإنجليزي):</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-3 py-2.5 text-xs text-slate-100 text-left focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] font-mono"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-300">كلمة المرور الخاصة بها:</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0B0B0F] border border-[rgba(255,255,255,0.06)] rounded-xl px-3 py-2.5 text-xs text-slate-100 text-left focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] font-mono"
              />
            </div>

            {/* Permissions Checkbox Grid */}
            <div className="space-y-2 pt-2 border-t border-white/5">
              <label className="block text-[10px] font-black text-slate-300">تحديد الصلاحيات الممنوحة:</label>
              <div className="space-y-2">
                {permissionOptions.map((opt) => {
                  const isChecked = selectedPermissions.includes(opt.id);
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => handlePermissionToggle(opt.id)}
                      className="w-full flex items-start gap-2.5 px-3 py-2 bg-[#0B0B0F]/60 border border-[rgba(255,255,255,0.04)] rounded-xl text-right cursor-pointer hover:border-[#8B5CF6]/30 transition-all group"
                    >
                      <div className="pt-0.5">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-[#8B5CF6]" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 group-hover:text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-right">
                        <div className={`text-[11px] font-black ${isChecked ? "text-white" : "text-slate-400"}`}>
                          {opt.label}
                        </div>
                        <div className="text-[9px] text-slate-500 font-medium mt-0.5 truncate leading-tight">
                          {opt.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/40 border border-red-900/50 text-red-400 text-[10px] rounded-xl flex items-center gap-2 justify-end">
                <span>{errorMsg}</span>
                <ShieldAlert className="w-4 h-4 shrink-0" />
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 text-emerald-400 text-[10px] rounded-xl flex items-center gap-2 justify-end">
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-l from-[#7C3AED] to-[#A855F7] hover:from-[#A855F7] hover:to-[#7C3AED] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري إنشاء الحساب...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>تنشيط حساب المؤكدة 🔐</span>
                </>
              )}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}
