"use client";

import { useState, useEffect, useCallback } from "react";
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
    user: { userId: string };
  };
}

const fmt = (n: number) => "₮ " + n.toLocaleString("mn-MN");

const statusText = (s: string) =>
  ({ paid: "Амжилттай", pending: "Хүлээгдэж байгаа", overdue: "Хугацаа хэтэрсэн" }[s] ?? s);

const statusColor = (s: string) =>
  ({
    paid: "bg-emerald-500/10 text-emerald-400",
    pending: "bg-amber-500/10 text-amber-400",
    overdue: "bg-red-500/10 text-red-400",
  }[s] ?? "bg-gray-500/10 text-gray-400");

export default function PaymentHistory() {
  const [activeMenu, setActiveMenu] = useState("Гүйлгээний түүх");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments");
      if (res.ok) {
        const data = await res.json();
        setPayments(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    filterStatus === "all"
      ? payments
      : payments.filter((p) => p.status === filterStatus);

  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const paidCount = payments.filter((p) => p.status === "paid").length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const overdueCount = payments.filter((p) => p.status === "overdue").length;

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
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
                  Санхүү
                </p>
                <h1 className="mt-1 text-2xl font-semibold">Гүйлгээний түүх</h1>
                <p className="mt-1 text-sm text-white/50">
                  Системийн бүх төлбөрийн гүйлгээний түүх
                </p>
              </div>
              <button
                onClick={load}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white"
              >
                ↻ Шинэчлэх
              </button>
            </div>

            {/* Filter */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="md:w-64">
                <label className="block text-sm text-white/50 mb-2">
                  Статусаар шүүх
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.06] px-4 py-2.5 text-white focus:outline-none"
                >
                  <option value="all" className="bg-[#0a1628]">Бүх статус</option>
                  <option value="paid" className="bg-[#0a1628]">Амжилттай</option>
                  <option value="pending" className="bg-[#0a1628]">Хүлээгдэж байгаа</option>
                  <option value="overdue" className="bg-[#0a1628]">Хугацаа хэтэрсэн</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Нийт гүйлгээ",
                  value: loading ? "…" : payments.length,
                  icon: "📊",
                  color: "bg-blue-500",
                },
                {
                  label: "Нийт дүн (төлсөн)",
                  value: loading ? "…" : fmt(totalPaid),
                  icon: "💰",
                  color: "bg-emerald-500",
                },
                {
                  label: "Амжилттай",
                  value: loading ? "…" : paidCount,
                  icon: "✅",
                  color: "bg-amber-500",
                },
                {
                  label: "Хугацаа хэтэрсэн",
                  value: loading ? "…" : overdueCount,
                  icon: "⚠️",
                  color: "bg-red-500",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-white">{stat.value}</p>
                    </div>
                    <div
                      className={`h-12 w-12 rounded-full ${stat.color} flex items-center justify-center`}
                    >
                      <span className="text-lg">{stat.icon}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Гүйлгээний жагсаалт
                </h2>
                <p className="text-sm text-white/50">{filtered.length} гүйлгээ</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-white/40">
                  <p className="text-4xl mb-3">🔍</p>
                  <p>Гүйлгээ олдсонгүй</p>
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
                          "Статус",
                          "Үүсгэсэн огноо",
                          "Төлсөн огноо",
                          "Тэмдэглэл",
                        ].map((h) => (
                          <th
                            key={h}
                            className="pb-3 text-left text-sm font-medium text-white/50"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-white/5 hover:bg-white/[0.02]"
                        >
                          <td className="py-4">
                            <p className="font-medium text-white">
                              {p.student?.lastName} {p.student?.firstName}
                            </p>
                            <p className="text-xs text-white/40 font-mono">
                              {p.student?.user?.userId}
                            </p>
                          </td>
                          <td className="py-4 text-white/70">{p.term}</td>
                          <td className="py-4 text-lg font-bold text-white">
                            {fmt(p.amount)}
                          </td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(p.status)}`}
                            >
                              {statusText(p.status)}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-white/70">
                            {new Date(p.createdAt).toLocaleString("mn-MN")}
                          </td>
                          <td className="py-4 text-sm text-white/70">
                            {p.paidAt
                              ? new Date(p.paidAt).toLocaleString("mn-MN")
                              : "—"}
                          </td>
                          <td className="py-4 text-sm text-white/50 max-w-xs">
                            {p.note ?? "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Summary by term */}
            {!loading && payments.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Улирлын хураангуй
                </h2>
                <div className="space-y-3">
                  {Array.from(new Set(payments.map((p) => p.term))).map((term) => {
                    const termPayments = payments.filter((p) => p.term === term);
                    const paid = termPayments
                      .filter((p) => p.status === "paid")
                      .reduce((s, p) => s + p.amount, 0);
                    const total = termPayments.reduce((s, p) => s + p.amount, 0);
                    return (
                      <div
                        key={term}
                        className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/10"
                      >
                        <div>
                          <p className="text-white font-medium">{term}</p>
                          <p className="text-sm text-white/50">
                            {termPayments.length} нэхэмжлэх
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-300 font-semibold">{fmt(paid)}</p>
                          <p className="text-sm text-white/50">
                            Нийт: {fmt(total)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
