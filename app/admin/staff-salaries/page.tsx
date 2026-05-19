"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface SalaryRow {
  id: string; month: string; base: number; bonus: number; deduction: number;
  net: number; status: string; paidAt: string | null;
  teacher: { firstName: string; lastName: string; user: { userId: string } };
}
interface Teacher { id: string; firstName: string; lastName: string; user: { userId: string } }

const fmt = (n: number) => n.toLocaleString("mn-MN") + "₮";

export default function StaffSalariesPage() {
  const [activeMenu, setActiveMenu] = useState("Цалингийн мэдээлэл");
  const [salaries, setSalaries] = useState<SalaryRow[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ teacherId: "", month: "", base: "", bonus: "0", deduction: "0" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, t] = await Promise.all([
        fetch("/api/salaries").then((r) => r.json()),
        fetch("/api/teachers").then((r) => r.json()),
      ]);
      setSalaries(Array.isArray(s) ? s : []);
      setTeachers(Array.isArray(t) ? t : []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.teacherId || !form.month || !form.base) {
      setError("Багш, сар, үндсэн цалин шаардлагатай"); return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/salaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setShowAdd(false); setForm({ teacherId: "", month: "", base: "", bonus: "0", deduction: "0" }); load();
    } finally { setSaving(false); }
  };

  const handlePay = async (id: string) => {
    if (!confirm("Цалин олгосон гэж тэмдэглэх үү?")) return;
    await fetch(`/api/salaries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    });
    load();
  };

  const totalNet     = salaries.reduce((s, r) => s + r.net, 0);
  const totalPaid    = salaries.filter((r) => r.status === "paid").reduce((s, r) => s + r.net, 0);
  const totalPending = salaries.filter((r) => r.status === "pending").reduce((s, r) => s + r.net, 0);

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-7xl space-y-6">

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { label: "Нийт цалин",       value: fmt(totalNet),     color: "text-white" },
                { label: "Олгосон",           value: fmt(totalPaid),    color: "text-emerald-400" },
                { label: "Хүлээгдэж байна",   value: fmt(totalPending), color: totalPending > 0 ? "text-amber-400" : "text-white/40" },
              ].map((s) => (
                <div key={s.label} className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{loading ? "…" : s.value}</p>
                  <p className="text-sm text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">Цалингийн бүртгэл</h2>
                <button onClick={() => { setShowAdd(true); setError(""); }}
                  className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                  + Цалин нэмэх
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : salaries.length === 0 ? (
                <p className="text-center py-12 text-white/40">Цалингийн бүртгэл байхгүй байна</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["Багш","Сар","Үндсэн","Нэмэгдэл","Суутгал","Цэвэр","Төлөв",""].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {salaries.map((s) => (
                        <tr key={s.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                          <td className="px-4 py-3">
                            <p className="font-medium">{s.teacher.lastName} {s.teacher.firstName}</p>
                            <p className="text-xs text-white/40">{s.teacher.user.userId}</p>
                          </td>
                          <td className="px-4 py-3 text-white/70">{s.month}</td>
                          <td className="px-4 py-3 text-white/70">{fmt(s.base)}</td>
                          <td className="px-4 py-3 text-emerald-400">{fmt(s.bonus)}</td>
                          <td className="px-4 py-3 text-red-400">{fmt(s.deduction)}</td>
                          <td className="px-4 py-3 font-bold text-violet-300">{fmt(s.net)}</td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs ${s.status === "paid" ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" : "border-amber-400/30 bg-amber-500/10 text-amber-300"}`}>
                              {s.status === "paid" ? "Олгосон" : "Хүлээгдэж байна"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {s.status !== "paid" && (
                              <button onClick={() => handlePay(s.id)}
                                className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-500/25">
                                Олгох
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1628] p-6">
            <h2 className="text-xl font-bold mb-5">Цалин нэмэх</h2>
            {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Багш *</label>
                <select value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="">Сонгох</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#0a1628]">
                      {t.lastName} {t.firstName} ({t.user.userId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Сар * (жишээ: 2025-05)</label>
                <input type="month" value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Үндсэн цалин *", key: "base" },
                  { label: "Нэмэгдэл", key: "bonus" },
                  { label: "Суутгал", key: "deduction" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="text-xs text-white/50 mb-1 block">{label}</label>
                    <input type="number" min="0" value={(form as Record<string, string>)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
                  </div>
                ))}
              </div>
              {form.base && (
                <p className="text-xs text-violet-400">
                  Цэвэр цалин: {fmt(parseFloat(form.base || "0") + parseFloat(form.bonus || "0") - parseFloat(form.deduction || "0"))}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowAdd(false); setError(""); }}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:text-white">Болих</button>
              <button onClick={handleAdd} disabled={saving}
                className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? "Хадгалж байна..." : "Нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
