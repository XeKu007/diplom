"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface PaymentRow {
  id: string; term: string; amount: number; status: string;
  paidAt: string | null; note: string | null;
  student: { firstName: string; lastName: string; user: { userId: string } };
}
interface Student { id: string; name: string; lastName: string; userId: string }

const fmt = (n: number) => n.toLocaleString("mn-MN") + "₮";

const statusLabel = (s: string) =>
  ({ paid: "Төлсөн", pending: "Хүлээгдэж байна", overdue: "Хугацаа хэтэрсэн" }[s] ?? s);

const statusColor = (s: string) => ({
  paid:    "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  pending: "border-amber-400/30 bg-amber-500/10 text-amber-300",
  overdue: "border-red-400/30 bg-red-500/10 text-red-300",
}[s] ?? "border-white/10 text-white/50");

export default function FinancePage() {
  const [activeMenu, setActiveMenu] = useState("Санхүүгийн мэдээлэл");
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ studentId: "", term: "", amount: "", status: "pending", note: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([
        fetch("/api/payments").then((r) => r.json()),
        fetch("/api/students").then((r) => r.json()),
      ]);
      setPayments(Array.isArray(p) ? p : []);
      setStudents(Array.isArray(s) ? s.map((st: { id: string; name: string; lastName: string; userId: string }) => ({
        id: st.id, name: st.name, lastName: st.lastName, userId: st.userId,
      })) : []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.studentId || !form.term || !form.amount) {
      setError("Оюутан, улирал, дүн шаардлагатай"); return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setShowAdd(false); setForm({ studentId: "", term: "", amount: "", status: "pending", note: "" }); load();
    } finally { setSaving(false); }
  };

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const filtered = filterStatus ? payments.filter((p) => p.status === filterStatus) : payments;
  const totalAll     = payments.reduce((s, p) => s + p.amount, 0);
  const totalPaid    = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status !== "paid").reduce((s, p) => s + p.amount, 0);

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
                { label: "Нийт төлбөр",       value: fmt(totalAll),     color: "text-white" },
                { label: "Төлсөн",             value: fmt(totalPaid),    color: "text-emerald-400" },
                { label: "Хүлээгдэж байна",    value: fmt(totalPending), color: totalPending > 0 ? "text-amber-400" : "text-white/40" },
              ].map((s) => (
                <div key={s.label} className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md text-center">
                  <p className={`text-2xl font-bold ${s.color}`}>{loading ? "…" : s.value}</p>
                  <p className="text-sm text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mr-auto">Төлбөрийн бүртгэл</h2>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="" className="bg-[#0a1628]">Бүх төлөв</option>
                  <option value="paid" className="bg-[#0a1628]">Төлсөн</option>
                  <option value="pending" className="bg-[#0a1628]">Хүлээгдэж байна</option>
                  <option value="overdue" className="bg-[#0a1628]">Хугацаа хэтэрсэн</option>
                </select>
                <button onClick={() => { setShowAdd(true); setError(""); }}
                  className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                  + Төлбөр нэмэх
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : filtered.length === 0 ? (
                <p className="text-center py-12 text-white/40">Төлбөрийн бүртгэл байхгүй байна</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["Оюутан","Улирал","Дүн","Огноо","Төлөв","Үйлдэл"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => (
                        <tr key={p.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                          <td className="px-4 py-3">
                            <p className="font-medium">{p.student.lastName} {p.student.firstName}</p>
                            <p className="text-xs text-white/40">{p.student.user.userId}</p>
                          </td>
                          <td className="px-4 py-3 text-white/70">{p.term}</td>
                          <td className="px-4 py-3 font-bold">{fmt(p.amount)}</td>
                          <td className="px-4 py-3 text-white/50 text-xs">
                            {p.paidAt ? new Date(p.paidAt).toLocaleDateString("mn-MN") : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs ${statusColor(p.status)}`}>
                              {statusLabel(p.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1">
                              {p.status !== "paid" && (
                                <button onClick={() => handleStatusChange(p.id, "paid")}
                                  className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-300 hover:bg-emerald-500/25">
                                  Төлсөн
                                </button>
                              )}
                              {p.status === "pending" && (
                                <button onClick={() => handleStatusChange(p.id, "overdue")}
                                  className="rounded-lg border border-red-400/30 bg-red-500/10 px-2.5 py-1 text-xs text-red-400 hover:bg-red-500/20">
                                  Хэтэрсэн
                                </button>
                              )}
                            </div>
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
            <h2 className="text-xl font-bold mb-5">Төлбөр нэмэх</h2>
            {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Оюутан *</label>
                <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="">Сонгох</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0a1628]">
                      {s.lastName} {s.name} ({s.userId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Улирал * (жишээ: 2025 намар)</label>
                <input value={form.term} onChange={(e) => setForm({ ...form, term: e.target.value })}
                  placeholder="2025 намар"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Дүн (₮) *</label>
                <input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="900000"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Төлөв</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="pending" className="bg-[#0a1628]">Хүлээгдэж байна</option>
                  <option value="paid" className="bg-[#0a1628]">Төлсөн</option>
                  <option value="overdue" className="bg-[#0a1628]">Хугацаа хэтэрсэн</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Тэмдэглэл</label>
                <input value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })}
                  placeholder="Нэмэлт тэмдэглэл..."
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
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
