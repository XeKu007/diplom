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
  student: { firstName: string; lastName: string };
}

interface Salary {
  id: string;
  base: number;
  bonus: number;
  deduction: number;
  net: number;
  status: string;
  month: string;
}

export default function FinancialReportsPage() {
  const [activeMenu, setActiveMenu] = useState("Санхүүгийн тайлан");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("Орлогын тайлан");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, s] = await Promise.all([
        fetch("/api/payments").then((r) => r.json()),
        fetch("/api/salaries").then((r) => r.json()),
      ]);
      setPayments(Array.isArray(p) ? p : []);
      setSalaries(Array.isArray(s) ? s : []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalIncome = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + p.amount, 0);
  const pendingIncome = payments
    .filter((p) => p.status === "pending")
    .reduce((s, p) => s + p.amount, 0);
  const overdueIncome = payments
    .filter((p) => p.status === "overdue")
    .reduce((s, p) => s + p.amount, 0);
  const totalSalaries = salaries.reduce((s, r) => s + r.net, 0);
  const netProfit = totalIncome - totalSalaries;

  const fmt = (n: number) => "₮ " + n.toLocaleString("mn-MN");

  // Group payments by term
  const byTerm: Record<string, { paid: number; pending: number; overdue: number }> = {};
  payments.forEach((p) => {
    if (!byTerm[p.term]) byTerm[p.term] = { paid: 0, pending: 0, overdue: 0 };
    if (p.status === "paid") byTerm[p.term].paid += p.amount;
    else if (p.status === "pending") byTerm[p.term].pending += p.amount;
    else if (p.status === "overdue") byTerm[p.term].overdue += p.amount;
  });

  const reportTypes = [
    "Орлогын тайлан",
    "Зарлагын тайлан",
    "Цэвэр ашгийн тайлан",
  ];

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
                <h1 className="mt-1 text-2xl font-semibold">Санхүүгийн тайлан</h1>
                <p className="mt-1 text-sm text-white/50">
                  Орлого, зарлага, цэвэр ашгийн тайлан
                </p>
              </div>
              <button
                onClick={load}
                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:text-white"
              >
                ↻ Шинэчлэх
              </button>
            </div>

            {/* Report type tabs */}
            <div className="flex flex-wrap gap-2">
              {reportTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setReportType(t)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    reportType === t
                      ? "bg-violet-600 text-white"
                      : "bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Нийт орлого",
                  value: loading ? "…" : fmt(totalIncome),
                  sub: "Төлөгдсөн",
                  color: "bg-emerald-500/20",
                  icon: "💰",
                },
                {
                  label: "Хүлээгдэж буй",
                  value: loading ? "…" : fmt(pendingIncome),
                  sub: "Pending",
                  color: "bg-amber-500/20",
                  icon: "⏳",
                },
                {
                  label: "Нийт зарлага",
                  value: loading ? "…" : fmt(totalSalaries),
                  sub: "Цалин",
                  color: "bg-rose-500/20",
                  icon: "💸",
                },
                {
                  label: "Цэвэр ашиг",
                  value: loading ? "…" : fmt(netProfit),
                  sub: "Орлого - Зарлага",
                  color: netProfit >= 0 ? "bg-violet-500/20" : "bg-red-500/20",
                  icon: netProfit >= 0 ? "📈" : "📉",
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

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
              </div>
            ) : (
              <>
                {/* Income report */}
                {reportType === "Орлогын тайлан" && (
                  <div className="space-y-6">
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                      <div className="p-5 border-b border-white/10">
                        <h3 className="text-xl font-semibold text-white">
                          Улирлын орлогын тайлан
                        </h3>
                      </div>
                      {Object.keys(byTerm).length === 0 ? (
                        <div className="text-center py-12 text-white/40">
                          Төлбөрийн мэдээлэл байхгүй
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-white/10">
                                {[
                                  "Улирал",
                                  "Төлөгдсөн",
                                  "Хүлээгдэж буй",
                                  "Хугацаа хэтэрсэн",
                                  "Нийт",
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
                              {Object.entries(byTerm).map(([term, data]) => (
                                <tr
                                  key={term}
                                  className="border-b border-white/5 hover:bg-white/[0.02]"
                                >
                                  <td className="p-4 text-white font-medium">{term}</td>
                                  <td className="p-4 text-emerald-300">
                                    {fmt(data.paid)}
                                  </td>
                                  <td className="p-4 text-amber-300">
                                    {fmt(data.pending)}
                                  </td>
                                  <td className="p-4 text-rose-300">
                                    {fmt(data.overdue)}
                                  </td>
                                  <td className="p-4 text-white font-semibold">
                                    {fmt(data.paid + data.pending + data.overdue)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Payment status breakdown */}
                    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                      <h3 className="text-xl font-semibold text-white mb-6">
                        Төлбөрийн статус
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            label: "Төлөгдсөн",
                            amount: totalIncome,
                            count: payments.filter((p) => p.status === "paid").length,
                            color: "bg-emerald-500",
                          },
                          {
                            label: "Хүлээгдэж буй",
                            amount: pendingIncome,
                            count: payments.filter((p) => p.status === "pending").length,
                            color: "bg-amber-500",
                          },
                          {
                            label: "Хугацаа хэтэрсэн",
                            amount: overdueIncome,
                            count: payments.filter((p) => p.status === "overdue").length,
                            color: "bg-rose-500",
                          },
                        ].map((item) => {
                          const total = totalIncome + pendingIncome + overdueIncome;
                          const pct = total > 0 ? (item.amount / total) * 100 : 0;
                          return (
                            <div key={item.label} className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/70">
                                  {item.label} ({item.count} бүртгэл)
                                </span>
                                <span className="text-white">{fmt(item.amount)}</span>
                              </div>
                              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${item.color}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Expense report */}
                {reportType === "Зарлагын тайлан" && (
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-5 border-b border-white/10">
                      <h3 className="text-xl font-semibold text-white">
                        Цалингийн зарлага
                      </h3>
                    </div>
                    {salaries.length === 0 ? (
                      <div className="text-center py-12 text-white/40">
                        Цалингийн мэдээлэл байхгүй
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              {["Сар", "Үндсэн", "Нэмэгдэл", "Суутгал", "Цэвэр", "Төлөв"].map(
                                (h) => (
                                  <th
                                    key={h}
                                    className="text-left p-4 text-white/70 font-medium text-sm"
                                  >
                                    {h}
                                  </th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {salaries.map((s) => (
                              <tr
                                key={s.id}
                                className="border-b border-white/5 hover:bg-white/[0.02]"
                              >
                                <td className="p-4 text-white">{s.month}</td>
                                <td className="p-4 text-white/70">{fmt(s.base)}</td>
                                <td className="p-4 text-emerald-300">{fmt(s.bonus)}</td>
                                <td className="p-4 text-rose-300">{fmt(s.deduction)}</td>
                                <td className="p-4 text-white font-semibold">
                                  {fmt(s.net)}
                                </td>
                                <td className="p-4">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs ${
                                      s.status === "paid"
                                        ? "bg-emerald-500/20 text-emerald-300"
                                        : "bg-amber-500/20 text-amber-300"
                                    }`}
                                  >
                                    {s.status === "paid" ? "Олгосон" : "Хүлээгдэж буй"}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* Net profit report */}
                {reportType === "Цэвэр ашгийн тайлан" && (
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <h3 className="text-xl font-semibold text-white mb-6">
                      Цэвэр ашгийн тайлан
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          label: "Нийт орлого (төлөгдсөн)",
                          amount: totalIncome,
                          color: "text-emerald-300",
                        },
                        {
                          label: "Нийт зарлага (цалин)",
                          amount: -totalSalaries,
                          color: "text-rose-300",
                        },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center justify-between p-4 bg-white/[0.02] rounded-lg"
                        >
                          <span className="text-white/80">{item.label}</span>
                          <span className={`font-semibold ${item.color}`}>
                            {item.amount >= 0 ? "+" : ""}
                            {fmt(Math.abs(item.amount))}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between p-4 bg-white/[0.05] rounded-lg border border-white/10">
                        <span className="text-white font-semibold">Цэвэр ашиг</span>
                        <span
                          className={`text-xl font-bold ${
                            netProfit >= 0 ? "text-emerald-300" : "text-rose-300"
                          }`}
                        >
                          {fmt(netProfit)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
