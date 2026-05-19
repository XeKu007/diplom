"use client";

import { useEffect, useState, useCallback } from "react";
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
  paidAt: string | null;
  teacher: {
    firstName: string;
    lastName: string;
    position?: string;
    user: { userId: string };
  };
}

const fmt = (n: number) => "₮ " + n.toLocaleString("mn-MN");

export default function SalaryPage() {
  const [activeMenu, setActiveMenu] = useState("Цалин урамшуулал");
  const [salaries, setSalaries] = useState<SalaryRow[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handlePay = async (id: string) => {
    if (!confirm("Цалин олгосон гэж тэмдэглэх үү?")) return;
    await fetch(`/api/salaries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    });
    load();
  };

  const totalNet = salaries.reduce((s, r) => s + r.net, 0);
  const totalBonus = salaries.reduce((s, r) => s + r.bonus, 0);
  const paidCount = salaries.filter((r) => r.status === "paid").length;
  const teacherCount = new Set(salaries.map((r) => r.teacher?.user?.userId)).size;

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
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Санхүү</p>
              <h1 className="mt-1 text-2xl font-semibold">Цалин урамшуулал</h1>
              <p className="mt-1 text-sm text-white/50">
                Багш, ажилчдын цалингийн тооцоо, урамшуулал, суутгалын удирдлага
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Нийт цалин",
                  value: loading ? "…" : fmt(totalNet),
                  sub: "Сар бүр",
                  icon: "💰",
                  color: "bg-violet-500/20",
                },
                {
                  label: "Дундаж цалин",
                  value: loading ? "…" : salaries.length > 0 ? fmt(Math.round(totalNet / salaries.length)) : "₮ 0",
                  sub: "Бүртгэл бүр",
                  icon: "📊",
                  color: "bg-emerald-500/20",
                },
                {
                  label: "Урамшууллын сан",
                  value: loading ? "…" : fmt(totalBonus),
                  sub: "Нийт нэмэгдэл",
                  icon: "🎁",
                  color: "bg-amber-500/20",
                },
                {
                  label: "Ажилчдын тоо",
                  value: loading ? "…" : `${teacherCount} хүн`,
                  sub: `Олгосон: ${paidCount}`,
                  icon: "👥",
                  color: "bg-blue-500/20",
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
              <div className="p-5 border-b border-white/10 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-white">Цалингийн жагсаалт</h3>
                <div className="flex gap-3">
                  <button
                    onClick={load}
                    className="px-4 py-2 text-sm bg-white/[0.08] hover:bg-white/[0.12] text-white/80 hover:text-white rounded-lg transition-colors"
                  >
                    ↻ Шинэчлэх
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : salaries.length === 0 ? (
                <div className="text-center py-16 text-white/40">
                  <p className="text-4xl mb-3">💼</p>
                  <p>Цалингийн бүртгэл байхгүй байна</p>
                  <p className="text-sm mt-1">
                    Цалин нэмэхийн тулд{" "}
                    <a href="/admin/staff-salaries" className="text-violet-400 underline">
                      Цалингийн мэдээлэл
                    </a>{" "}
                    хуудас руу очно уу
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {[
                          "Нэр",
                          "Сар",
                          "Үндсэн цалин",
                          "Урамшуулал",
                          "Суутгал",
                          "Цэвэр цалин",
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
                      {salaries.map((s) => (
                        <tr
                          key={s.id}
                          className="border-b border-white/5 hover:bg-white/[0.02]"
                        >
                          <td className="p-4">
                            <p className="text-white font-medium">
                              {s.teacher?.lastName} {s.teacher?.firstName}
                            </p>
                            <p className="text-xs text-white/40 font-mono">
                              {s.teacher?.user?.userId}
                            </p>
                          </td>
                          <td className="p-4 text-white/70">{s.month}</td>
                          <td className="p-4 text-white">{fmt(s.base)}</td>
                          <td className="p-4 text-emerald-300">{fmt(s.bonus)}</td>
                          <td className="p-4 text-rose-300">{fmt(s.deduction)}</td>
                          <td className="p-4 text-white font-semibold">{fmt(s.net)}</td>
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
                          <td className="p-4">
                            {s.status !== "paid" && (
                              <button
                                onClick={() => handlePay(s.id)}
                                className="px-3 py-1.5 text-xs bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/25 rounded-lg transition-colors"
                              >
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

            {/* Policy note */}
            <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl">
              <h4 className="text-base font-semibold text-white mb-3">
                Цалингийн бодлогын тайлбар
              </h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>• Цалингийн тооцоог сарын эхний 5 хоногт хийнэ</li>
                <li>• Төлбөрийг сарын 15-ны өдөр хийгдэнэ</li>
                <li>• Цалин нэмэх, засахыг{" "}
                  <a href="/admin/staff-salaries" className="text-violet-400 underline">
                    Цалингийн мэдээлэл
                  </a>{" "}
                  хуудаснаас хийнэ
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
