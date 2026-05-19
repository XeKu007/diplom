"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface SalaryRow {
  id: string;
  month: string;
  base: number;
  bonus: number;
  deduction: number;
  net: number;
  status: string;
  teacher: {
    firstName: string;
    lastName: string;
    user: { userId: string };
  };
}

const fmt = (n: number) => n.toLocaleString("mn-MN") + " ₮";

export default function BonusDeductions() {
  const [activeMenu, setActiveMenu] = useState("Урамшуулал, суутгал");
  const [salaries, setSalaries] = useState<SalaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/salaries");
      if (res.ok) {
        const data = await res.json();
        setSalaries(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Show rows that have bonus or deduction
  const bonusRows = salaries.filter((s) => s.bonus > 0);
  const deductionRows = salaries.filter((s) => s.deduction > 0);

  const displayRows =
    filterType === "bonus"
      ? bonusRows
      : filterType === "deduction"
      ? deductionRows
      : salaries.filter((s) => s.bonus > 0 || s.deduction > 0);

  const totalBonus = bonusRows.reduce((s, r) => s + r.bonus, 0);
  const totalDeduction = deductionRows.reduce((s, r) => s + r.deduction, 0);

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
                <h1 className="mt-1 text-2xl font-semibold">Урамшуулал, суутгал</h1>
                <p className="mt-1 text-sm text-white/50">
                  Багш, ажилчдын урамшуулал болон суутгалын мэдээлэл
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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Нийт урамшуулал",
                  value: loading ? "…" : fmt(totalBonus),
                  icon: "💰",
                  color: "bg-emerald-500",
                },
                {
                  label: "Нийт суутгал",
                  value: loading ? "…" : fmt(totalDeduction),
                  icon: "📉",
                  color: "bg-rose-500",
                },
                {
                  label: "Урамшуулалтай",
                  value: loading ? "…" : bonusRows.length,
                  icon: "🎁",
                  color: "bg-amber-500",
                },
                {
                  label: "Суутгалтай",
                  value: loading ? "…" : deductionRows.length,
                  icon: "✂️",
                  color: "bg-blue-500",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">{stat.label}</p>
                      <p className="mt-2 text-xl font-bold text-white">{stat.value}</p>
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

            {/* Filter tabs */}
            <div className="flex gap-2">
              {[
                { value: "all", label: "Бүгд" },
                { value: "bonus", label: "Урамшуулал" },
                { value: "deduction", label: "Суутгал" },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setFilterType(t.value)}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    filterType === t.value
                      ? "bg-violet-600 text-white"
                      : "bg-white/[0.08] text-white/70 hover:bg-white/[0.12] hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">
                  Урамшуулал, суутгалын жагсаалт
                </h2>
                <p className="text-sm text-white/50">{displayRows.length} бүртгэл</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : displayRows.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <p className="text-4xl mb-3">📋</p>
                  <p>Урамшуулал, суутгалын мэдээлэл байхгүй байна</p>
                  <p className="text-sm mt-1">
                    Цалин нэмэхдээ{" "}
                    <a href="/admin/staff-salaries" className="text-violet-400 underline">
                      Цалингийн мэдээлэл
                    </a>{" "}
                    хуудаснаас нэмэгдэл/суутгал оруулна уу
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {[
                          "Багш",
                          "Сар",
                          "Үндсэн цалин",
                          "Урамшуулал",
                          "Суутгал",
                          "Цэвэр цалин",
                          "Төлөв",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-medium text-white/40"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {displayRows.map((s) => (
                        <tr
                          key={s.id}
                          className="border-b border-white/[0.05] hover:bg-white/[0.02]"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-white">
                              {s.teacher?.lastName} {s.teacher?.firstName}
                            </p>
                            <p className="text-xs text-white/40 font-mono">
                              {s.teacher?.user?.userId}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-white/70">{s.month}</td>
                          <td className="px-4 py-3 text-white/70">{fmt(s.base)}</td>
                          <td className="px-4 py-3">
                            {s.bonus > 0 ? (
                              <span className="text-emerald-400 font-semibold">
                                +{fmt(s.bonus)}
                              </span>
                            ) : (
                              <span className="text-white/30">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {s.deduction > 0 ? (
                              <span className="text-rose-400 font-semibold">
                                -{fmt(s.deduction)}
                              </span>
                            ) : (
                              <span className="text-white/30">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 font-bold text-violet-300">
                            {fmt(s.net)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-full border px-2.5 py-0.5 text-xs ${
                                s.status === "paid"
                                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300"
                                  : "border-amber-400/30 bg-amber-500/10 text-amber-300"
                              }`}
                            >
                              {s.status === "paid" ? "Олгосон" : "Хүлээгдэж байна"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Distribution */}
            {!loading && salaries.length > 0 && (
              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                  <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mb-4">
                    Урамшуулал / Суутгалын харьцаа
                  </h2>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Урамшуулал",
                        amount: totalBonus,
                        count: bonusRows.length,
                        color: "from-emerald-400 to-green-300",
                        bg: "bg-emerald-500",
                      },
                      {
                        label: "Суутгал",
                        amount: totalDeduction,
                        count: deductionRows.length,
                        color: "from-rose-400 to-red-300",
                        bg: "bg-rose-500",
                      },
                    ].map((item) => {
                      const total = totalBonus + totalDeduction;
                      const pct = total > 0 ? (item.amount / total) * 100 : 0;
                      return (
                        <div
                          key={item.label}
                          className="rounded-lg border border-white/10 bg-white/5 p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium text-white">{item.label}</p>
                            <span className="text-sm font-bold text-white">
                              {item.count} бүртгэл
                            </span>
                          </div>
                          <p className="text-xs text-white/50 mb-2">
                            Нийт дүн: {fmt(item.amount)}
                          </p>
                          <div className="h-2 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                  <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mb-4">
                    Хамгийн өндөр урамшуулалтай багш нар
                  </h2>
                  <div className="space-y-3">
                    {[...bonusRows]
                      .sort((a, b) => b.bonus - a.bonus)
                      .slice(0, 5)
                      .map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg"
                        >
                          <div>
                            <p className="text-sm font-medium text-white">
                              {s.teacher?.lastName} {s.teacher?.firstName}
                            </p>
                            <p className="text-xs text-white/40">{s.month}</p>
                          </div>
                          <span className="text-emerald-400 font-semibold text-sm">
                            +{fmt(s.bonus)}
                          </span>
                        </div>
                      ))}
                    {bonusRows.length === 0 && (
                      <p className="text-center text-white/40 py-4">
                        Урамшуулалтай бүртгэл байхгүй
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
