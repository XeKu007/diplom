"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Payment {
  id: string;
  amount: number;
  status: string;
  term: string;
  paidAt: string | null;
  note: string | null;
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
    phone: string | null;
    user: { userId: string };
  };
}

const fmt = (n: number) => "₮ " + n.toLocaleString("mn-MN");

export default function OverduePaymentsPage() {
  const [activeMenu, setActiveMenu] = useState("Хугацаа хэтэрсэн төлбөр");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments");
      if (res.ok) {
        const data = await res.json();
        const all = Array.isArray(data) ? data : [];
        // Show pending + overdue
        setPayments(all.filter((p: Payment) => p.status === "overdue" || p.status === "pending"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markOverdue = async (id: string) => {
    setUpdating(id);
    await fetch(`/api/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "overdue" }),
    });
    setUpdating(null);
    load();
  };

  const markPaid = async (id: string) => {
    setUpdating(id);
    await fetch(`/api/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    });
    setUpdating(null);
    load();
  };

  const overdue = payments.filter((p) => p.status === "overdue");
  const pending = payments.filter((p) => p.status === "pending");
  const totalOverdue = overdue.reduce((s, p) => s + p.amount, 0);
  const totalPending = pending.reduce((s, p) => s + p.amount, 0);

  const getDaysOverdue = (createdAt: string) => {
    const diff = Date.now() - new Date(createdAt).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main
          className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{
            backgroundImage:
              "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')",
            backgroundSize: "72%",
          }}
        >
          <div className="mx-auto max-w-6xl space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
                  Санхүү
                </p>
                <h1 className="mt-1 text-2xl font-semibold">
                  Хугацаа хэтэрсэн төлбөр
                </h1>
                <p className="mt-1 text-sm text-white/50">
                  Хугацаа хэтэрсэн болон хүлээгдэж буй төлбөрийн удирдлага
                </p>
              </div>
              <button
                onClick={load}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white"
              >
                ↻ Шинэчлэх
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  label: "Хугацаа хэтэрсэн",
                  value: loading ? "…" : fmt(totalOverdue),
                  sub: `${overdue.length} бүртгэл`,
                  color: "bg-rose-500/20",
                  icon: "⚠️",
                },
                {
                  label: "Хүлээгдэж буй",
                  value: loading ? "…" : fmt(totalPending),
                  sub: `${pending.length} бүртгэл`,
                  color: "bg-amber-500/20",
                  icon: "⏳",
                },
                {
                  label: "Нийт дутуу",
                  value: loading ? "…" : fmt(totalOverdue + totalPending),
                  sub: `${payments.length} бүртгэл`,
                  color: "bg-violet-500/20",
                  icon: "💰",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white/[0.03] border border-white/10 rounded-xl p-5"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-white">{s.label}</h3>
                    <div className={`p-2 ${s.color} rounded-lg text-lg`}>{s.icon}</div>
                  </div>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-sm text-white/60 mt-1">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white">
                  Хугацаа хэтэрсэн болон хүлээгдэж буй төлбөрүүд
                </h3>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <p className="text-4xl mb-3">✅</p>
                  <p>Хугацаа хэтэрсэн төлбөр байхгүй байна</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {[
                          "Оюутан",
                          "Улирал",
                          "Дүн",
                          "Хоног",
                          "Холбоо барих",
                          "Төлөв",
                          "Үйлдэл",
                        ].map((h) => (
                          <th
                            key={h}
                            className="text-left p-4 text-white/70 font-medium text-sm"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => {
                        const days = getDaysOverdue(p.createdAt);
                        return (
                          <tr
                            key={p.id}
                            className="border-b border-white/5 hover:bg-white/[0.02]"
                          >
                            <td className="p-4">
                              <p className="text-white font-medium">
                                {p.student?.lastName} {p.student?.firstName}
                              </p>
                              <p className="text-xs text-white/40 font-mono">
                                {p.student?.user?.userId}
                              </p>
                            </td>
                            <td className="p-4 text-white/70">{p.term}</td>
                            <td className="p-4 text-rose-300 font-semibold">
                              {fmt(p.amount)}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  days <= 7
                                    ? "bg-amber-500/20 text-amber-300"
                                    : days <= 15
                                    ? "bg-orange-500/20 text-orange-300"
                                    : "bg-rose-500/20 text-rose-300"
                                }`}
                              >
                                {days} хоног
                              </span>
                            </td>
                            <td className="p-4 text-white/70">
                              {p.student?.phone ?? "—"}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  p.status === "overdue"
                                    ? "bg-rose-500/20 text-rose-300"
                                    : "bg-amber-500/20 text-amber-300"
                                }`}
                              >
                                {p.status === "overdue"
                                  ? "Хугацаа хэтэрсэн"
                                  : "Хүлээгдэж буй"}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2">
                                {p.status === "pending" && (
                                  <button
                                    onClick={() => markOverdue(p.id)}
                                    disabled={updating === p.id}
                                    className="px-3 py-1.5 text-xs bg-rose-500/15 border border-rose-400/30 text-rose-300 hover:bg-rose-500/25 rounded-lg transition-colors disabled:opacity-50"
                                  >
                                    Хэтэрсэн
                                  </button>
                                )}
                                <button
                                  onClick={() => markPaid(p.id)}
                                  disabled={updating === p.id}
                                  className="px-3 py-1.5 text-xs bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/25 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {updating === p.id ? "…" : "Төлсөн"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Policy */}
            <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl">
              <h4 className="text-base font-semibold text-white mb-3">
                Хугацаа хэтэрсэн төлбөрийн бодлого
              </h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>• 7 хоногоос дээш хэтэрсэн: Шар өнгөөр тэмдэглэнэ</li>
                <li>• 15 хоногоос дээш хэтэрсэн: Улаан өнгөөр тэмдэглэнэ</li>
                <li>• Сануулгыг 3, 7, 15 хоногийн дараа автоматаар илгээнэ</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
