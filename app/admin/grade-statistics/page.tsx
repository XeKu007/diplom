"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface GradeRow {
  id: string;
  totalScore: number | null;
  letterGrade: string | null;
  semester: string | null;
  student: { firstName: string; lastName: string };
  course: { name: string; code: string };
}

interface CourseStat {
  course: string;
  A: number;
  B: number;
  C: number;
  D: number;
  F: number;
  total: number;
  average: number;
  passRate: number;
}

export default function GradeStatisticsPage() {
  const [activeMenu, setActiveMenu] = useState("Дүнгийн статистик");
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("Бүгд");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/grades");
      if (res.ok) {
        const data = await res.json();
        setGrades(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Build per-course stats from real data
  const courseNames = ["Бүгд", ...Array.from(new Set(grades.map((g) => g.course.name)))];

  const buildStats = (rows: GradeRow[]): CourseStat[] => {
    const map: Record<string, GradeRow[]> = {};
    rows.forEach((g) => {
      if (!map[g.course.name]) map[g.course.name] = [];
      map[g.course.name].push(g);
    });
    return Object.entries(map).map(([course, list]) => {
      const scores = list.map((g) => g.totalScore ?? 0);
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      const A = list.filter((g) => (g.totalScore ?? 0) >= 90).length;
      const B = list.filter((g) => (g.totalScore ?? 0) >= 80 && (g.totalScore ?? 0) < 90).length;
      const C = list.filter((g) => (g.totalScore ?? 0) >= 70 && (g.totalScore ?? 0) < 80).length;
      const D = list.filter((g) => (g.totalScore ?? 0) >= 60 && (g.totalScore ?? 0) < 70).length;
      const F = list.filter((g) => (g.totalScore ?? 0) < 60).length;
      const passRate = list.length ? ((list.length - F) / list.length) * 100 : 0;
      return { course, A, B, C, D, F, total: list.length, average: avg, passRate };
    });
  };

  const filteredGrades =
    selectedCourse === "Бүгд"
      ? grades
      : grades.filter((g) => g.course.name === selectedCourse);

  const stats = buildStats(filteredGrades);

  const totalStats = stats.reduce(
    (acc, s) => ({
      A: acc.A + s.A,
      B: acc.B + s.B,
      C: acc.C + s.C,
      D: acc.D + s.D,
      F: acc.F + s.F,
      total: acc.total + s.total,
      avgSum: acc.avgSum + s.average,
      passSum: acc.passSum + s.passRate,
    }),
    { A: 0, B: 0, C: 0, D: 0, F: 0, total: 0, avgSum: 0, passSum: 0 }
  );

  const overallAvg = stats.length > 0 ? totalStats.avgSum / stats.length : 0;
  const overallPass = stats.length > 0 ? totalStats.passSum / stats.length : 0;

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
                  Сургалт
                </p>
                <h1 className="mt-1 text-2xl font-semibold">Дүнгийн статистик</h1>
                <p className="mt-1 text-sm text-white/50">
                  Хичээл, тэнхимийн дүнгийн статистик мэдээлэл
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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-72">
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Хичээл
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-white focus:outline-none"
                >
                  {courseNames.map((c) => (
                    <option key={c} value={c} className="bg-[#0a1628]">
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Нийт дүн",
                  value: loading ? "…" : totalStats.total,
                  sub: "Бүртгэл",
                  color: "bg-violet-500/20",
                  icon: "👨‍🎓",
                },
                {
                  label: "Дундаж дүн",
                  value: loading ? "…" : overallAvg.toFixed(1),
                  sub: "100 онооны систем",
                  color: "bg-emerald-500/20",
                  icon: "📊",
                },
                {
                  label: "Тэнцсэн хувь",
                  value: loading ? "…" : `${overallPass.toFixed(1)}%`,
                  sub: "Тэнцсэн оюутан",
                  color: "bg-blue-500/20",
                  icon: "✅",
                },
                {
                  label: "Тэнцээгүй",
                  value: loading ? "…" : totalStats.F,
                  sub: "F дүнтэй",
                  color: "bg-rose-500/20",
                  icon: "❌",
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
            ) : grades.length === 0 ? (
              <div className="text-center py-16 text-white/40">
                <p className="text-4xl mb-3">📊</p>
                <p>Дүнгийн мэдээлэл байхгүй байна</p>
              </div>
            ) : (
              <>
                {/* Per-course table */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white">
                      Хичээлийн дүнгийн тайлан
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          {[
                            "Хичээл",
                            "A (90-100)",
                            "B (80-89)",
                            "C (70-79)",
                            "D (60-69)",
                            "F (0-59)",
                            "Дундаж",
                            "Тэнцсэн %",
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
                        {stats.map((s, i) => (
                          <tr
                            key={i}
                            className="border-b border-white/5 hover:bg-white/[0.02]"
                          >
                            <td className="p-4 text-white">{s.course}</td>
                            <td className="p-4 text-emerald-300">{s.A}</td>
                            <td className="p-4 text-blue-300">{s.B}</td>
                            <td className="p-4 text-amber-300">{s.C}</td>
                            <td className="p-4 text-orange-300">{s.D}</td>
                            <td className="p-4 text-rose-300">{s.F}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      s.average >= 80
                                        ? "bg-emerald-500"
                                        : s.average >= 70
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                    }`}
                                    style={{ width: `${s.average}%` }}
                                  />
                                </div>
                                <span className="text-white">{s.average.toFixed(1)}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  s.passRate >= 90
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : s.passRate >= 80
                                    ? "bg-amber-500/20 text-amber-300"
                                    : "bg-rose-500/20 text-rose-300"
                                }`}
                              >
                                {s.passRate.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Grade distribution */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <h3 className="text-xl font-semibold text-white mb-6">
                      Дүнгийн тархалт
                    </h3>
                    <div className="space-y-4">
                      {[
                        { grade: "A (90-100)", count: totalStats.A, color: "bg-emerald-500" },
                        { grade: "B (80-89)", count: totalStats.B, color: "bg-blue-500" },
                        { grade: "C (70-79)", count: totalStats.C, color: "bg-amber-500" },
                        { grade: "D (60-69)", count: totalStats.D, color: "bg-orange-500" },
                        { grade: "F (0-59)", count: totalStats.F, color: "bg-rose-500" },
                      ].map((item) => {
                        const pct =
                          totalStats.total > 0
                            ? (item.count / totalStats.total) * 100
                            : 0;
                        return (
                          <div key={item.grade} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-white/70">{item.grade}</span>
                              <span className="text-white">
                                {item.count} хүн ({pct.toFixed(1)}%)
                              </span>
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

                  <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                    <h3 className="text-xl font-semibold text-white mb-6">
                      Хамгийн өндөр / бага дүнтэй хичээлүүд
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-white font-medium mb-3">Өндөр дүнтэй топ 3</h4>
                        <div className="space-y-3">
                          {[...stats]
                            .sort((a, b) => b.average - a.average)
                            .slice(0, 3)
                            .map((s, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg"
                              >
                                <div>
                                  <div className="text-white font-medium">{s.course}</div>
                                  <div className="text-sm text-white/50">
                                    Дундаж: {s.average.toFixed(1)}
                                  </div>
                                </div>
                                <div className="text-emerald-300 font-semibold">
                                  {s.passRate.toFixed(1)}% тэнцсэн
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-white font-medium mb-3">Бага дүнтэй топ 3</h4>
                        <div className="space-y-3">
                          {[...stats]
                            .sort((a, b) => a.average - b.average)
                            .slice(0, 3)
                            .map((s, i) => (
                              <div
                                key={i}
                                className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg"
                              >
                                <div>
                                  <div className="text-white font-medium">{s.course}</div>
                                  <div className="text-sm text-white/50">
                                    Дундаж: {s.average.toFixed(1)}
                                  </div>
                                </div>
                                <div className="text-rose-300 font-semibold">
                                  {s.passRate.toFixed(1)}% тэнцсэн
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
