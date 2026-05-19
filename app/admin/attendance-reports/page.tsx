"use client";

import { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface AttRow {
  id: string;
  status: string;
  date: string;
  student: { firstName: string; lastName: string };
  course: { name: string };
}

interface CourseStat {
  course: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  rate: number;
}

export default function AttendanceReportsPage() {
  const [activeMenu, setActiveMenu] = useState("Ирцийн тайлан");
  const [rows, setRows] = useState<AttRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("Бүгд");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/attendance");
      if (res.ok) {
        const data = await res.json();
        setRows(Array.isArray(data) ? data : []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const courseNames = [
    "Бүгд",
    ...Array.from(new Set(rows.map((r) => r.course.name))),
  ];

  const filtered =
    selectedCourse === "Бүгд"
      ? rows
      : rows.filter((r) => r.course.name === selectedCourse);

  // Build per-course stats
  const buildStats = (data: AttRow[]): CourseStat[] => {
    const map: Record<string, AttRow[]> = {};
    data.forEach((r) => {
      if (!map[r.course.name]) map[r.course.name] = [];
      map[r.course.name].push(r);
    });
    return Object.entries(map).map(([course, list]) => {
      const present = list.filter((r) => r.status === "present").length;
      const absent = list.filter((r) => r.status === "absent").length;
      const late = list.filter((r) => r.status === "late").length;
      const excused = list.filter((r) => r.status === "excused").length;
      const rate = list.length > 0 ? ((present + late) / list.length) * 100 : 0;
      return { course, total: list.length, present, absent, late, excused, rate };
    });
  };

  const stats = buildStats(filtered);

  const totals = filtered.reduce(
    (acc, r) => ({
      total: acc.total + 1,
      present: acc.present + (r.status === "present" ? 1 : 0),
      absent: acc.absent + (r.status === "absent" ? 1 : 0),
      late: acc.late + (r.status === "late" ? 1 : 0),
    }),
    { total: 0, present: 0, absent: 0, late: 0 }
  );

  const overallRate =
    totals.total > 0
      ? ((totals.present + totals.late) / totals.total) * 100
      : 0;

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
                <h1 className="mt-1 text-2xl font-semibold">Ирцийн тайлан</h1>
                <p className="mt-1 text-sm text-white/50">
                  Хичээл, тэнхимийн ирцийн статистик мэдээлэл
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

            {/* Summary stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Нийт ирц",
                  value: loading ? "…" : totals.total,
                  sub: "Бүртгэл",
                  color: "bg-violet-500/20",
                  icon: "📋",
                },
                {
                  label: "Ирсэн",
                  value: loading ? "…" : totals.present,
                  sub: "Оюутан",
                  color: "bg-emerald-500/20",
                  icon: "✅",
                },
                {
                  label: "Ирээгүй",
                  value: loading ? "…" : totals.absent,
                  sub: "Оюутан",
                  color: "bg-rose-500/20",
                  icon: "❌",
                },
                {
                  label: "Ирцийн хувь",
                  value: loading ? "…" : `${overallRate.toFixed(1)}%`,
                  sub: "Нийт дундаж",
                  color: "bg-blue-500/20",
                  icon: "📊",
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
            ) : rows.length === 0 ? (
              <div className="text-center py-16 text-white/40">
                <p className="text-4xl mb-3">📋</p>
                <p>Ирцийн мэдээлэл байхгүй байна</p>
              </div>
            ) : (
              <>
                {/* Per-course table */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                  <div className="p-5 border-b border-white/10">
                    <h3 className="text-xl font-semibold text-white">
                      Хичээлийн ирцийн тайлан
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          {[
                            "Хичээл",
                            "Нийт",
                            "Ирсэн",
                            "Ирээгүй",
                            "Хоцорсон",
                            "Чөлөөтэй",
                            "Ирцийн хувь",
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
                        {stats.map((s, i) => (
                          <tr
                            key={i}
                            className="border-b border-white/5 hover:bg-white/[0.02]"
                          >
                            <td className="p-4 text-white">{s.course}</td>
                            <td className="p-4 text-white">{s.total}</td>
                            <td className="p-4 text-emerald-300">{s.present}</td>
                            <td className="p-4 text-rose-300">{s.absent}</td>
                            <td className="p-4 text-amber-300">{s.late}</td>
                            <td className="p-4 text-blue-300">{s.excused}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      s.rate >= 90
                                        ? "bg-emerald-500"
                                        : s.rate >= 75
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                    }`}
                                    style={{ width: `${s.rate}%` }}
                                  />
                                </div>
                                <span className="text-white">{s.rate.toFixed(1)}%</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${
                                  s.rate >= 90
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : s.rate >= 75
                                    ? "bg-amber-500/20 text-amber-300"
                                    : "bg-rose-500/20 text-rose-300"
                                }`}
                              >
                                {s.rate >= 90 ? "Сайн" : s.rate >= 75 ? "Дунд" : "Муу"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bar chart */}
                <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                  <h3 className="text-xl font-semibold text-white mb-6">
                    Ирцийн хувь хэмжээ
                  </h3>
                  <div className="space-y-4">
                    {stats.map((s, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/70">{s.course}</span>
                          <span className="text-white">{s.rate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              s.rate >= 90
                                ? "bg-emerald-500"
                                : s.rate >= 75
                                ? "bg-amber-500"
                                : "bg-rose-500"
                            }`}
                            style={{ width: `${s.rate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Policy note */}
            <div className="p-5 bg-white/[0.02] border border-white/10 rounded-xl">
              <h4 className="text-base font-semibold text-white mb-3">
                Ирцийн тайлангийн тайлбар
              </h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>
                  • Ирцийн шаардлагатай хувь: 75% (энэ хувиас бага ирцтэй оюутнууд
                  шалгалтанд суух эрхгүй)
                </li>
                <li>
                  • Хоцорсон тохиолдолд хичээлийн цагийн эхний 15 минутанд тооцно
                </li>
                <li>• Чөлөөтэй ирц нь ирцийн хувьд тооцогдоно</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
