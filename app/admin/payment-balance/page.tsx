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
  createdAt: string;
  student: {
    firstName: string;
    lastName: string;
    phone: string | null;
    user: { userId: string };
  };
}

const fmt = (n: number) => "₮ " + n.toLocaleString("mn-MN");

export default function PaymentBalancePage() {
  const [activeMenu, setActiveMenu] = useState("Төлбөрийн үлдэгдэл");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Group by student to show balance
  const studentMap: Record<
    string,
    { name: string; userId: string; phone: string | null; total: number; paid: number; balance: number; hasOverdue: boolean }
  > = {};

  payments.forEach((p) => {
    const key = p.student?.user?.userId ?? p.id;
    if (!studentMap[key]) {
      studentMap[key] = {
        name: `${p.student?.lastName ?? ""} ${p.student?.firstName ?? ""}`.trim(),
        userId: p.student?.user?.userId ?? "",
        phone: p.student?.phone ?? null,
        total: 0,
        paid: 0,
        balance: 0,
        hasOverdue: false,
      };
    }
    studentMap[key].total += p.amount;
    if (p.status === "paid") studentMap[key].paid += p.amount;
    else studentMap[key].balance += p.amount;
    if (p.status === "overdue") studentMap[key].hasOverdue = true;
  });

  const students = Object.values(studentMap);
  const totalBalance = students.reduce((s, st) => s + st.balance, 0);
  const overdueBalance = students
    .filter((st) => st.hasOverdue)
    .reduce((s, st) => s + st.balance, 0);
  const fullyPaid = students.filter((st) => st.balance === 0).length;

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
                <h1 className="mt-1 text-2xl font-semibold">Төлбөрийн үлдэгдэл</h1>
                <p className="mt-1 text-sm text-white/50">
                  Оюутны төлбөрийн үлдэгдэл, хугацаа хэтэрсэн мэдээлэл
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
                  label: "Нийт үлдэгдэл",
                  value: loading ? "…" : fmt(totalBalance),
                  sub: `${students.filter((s) => s.balance > 0).length} оюутнаас`,
                  color: "bg-rose-500/20",
                  icon: "💸",
                },
                {
                  label: "Хугацаа хэтэрсэн",
                  value: loading ? "…" : fmt(overdueBalance),
                  sub: `${students.filter((s) => s.hasOverdue).length} оюутнаас`,
                  color: "bg-amber-500/20",
                  icon: "⚠️",
                },
                {
                  label: "Бүрэн төлөгдсөн",
                  value: loading ? "…" : `${fullyPaid} оюутан`,
                  sub: "Үлдэгдэлгүй",
                  color: "bg-emerald-500/20",
                  icon: "✅",
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
                  Оюутны төлбөрийн үлдэгдэл
                </h3>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <p className="text-4xl mb-3">💰</p>
                  <p>Төлбөрийн мэдээлэл байхгүй байна</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {[
                          "Оюутан",
                          "Нийт төлбөр",
                          "Төлсөн",
                          "Үлдэгдэл",
                          "Явц",
                          "Холбоо барих",
                          "Төлөв",
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
                      {students.map((st, i) => {
                        const progress =
                          st.total > 0 ? (st.paid / st.total) * 100 : 0;
                        return (
                          <tr
                            key={i}
                            className="border-b border-white/5 hover:bg-white/[0.02]"
                          >
                            <td className="p-4">
                              <p className="text-white font-medium">{st.name}</p>
                              <p className="text-xs text-white/40 font-mono">
                                {st.userId}
                              </p>
                            </td>
                            <td className="p-4 text-white">{fmt(st.total)}</td>
                            <td className="p-4 text-emerald-300">{fmt(st.paid)}</td>
                            <td className="p-4 text-rose-300">{fmt(st.balance)}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      progress >= 100
                                        ? "bg-emerald-500"
                                        : progress >= 50
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                    }`}
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <span className="text-white text-sm">
                                  {progress.toFixed(0)}%
                                </span>
                              </div>
                            </td>
                            <td className="p-4 text-white/70">{st.phone ?? "—"}</td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  st.balance === 0
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : st.hasOverdue
                                    ? "bg-rose-500/20 text-rose-300"
                                    : "bg-amber-500/20 text-amber-300"
                                }`}
                              >
                                {st.balance === 0
                                  ? "Бүрэн төлөгдсөн"
                                  : st.hasOverdue
                                  ? "Хугацаа хэтэрсэн"
                                  : "Хүлээгдэж буй"}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
