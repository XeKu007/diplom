"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface TimetableRow {
  id: string; dayOfWeek: number; startTime: string; endTime: string; room: string | null;
  course: { id: string; name: string; code: string };
}

const DAYS = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан"];
const COLORS = [
  "border-blue-400/30 bg-blue-500/15 text-blue-200",
  "border-amber-400/30 bg-amber-500/15 text-amber-200",
  "border-emerald-400/30 bg-emerald-500/15 text-emerald-200",
  "border-orange-400/30 bg-orange-500/15 text-orange-200",
  "border-pink-400/30 bg-pink-500/15 text-pink-200",
  "border-cyan-400/30 bg-cyan-500/15 text-cyan-200",
];

export default function TeacherSchedulePage() {
  const [activeMenu, setActiveMenu] = useState("Хуваарь");
  const [timetable, setTimetable] = useState<TimetableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/timetable")
      .then((r) => r.json())
      .then((d) => setTimetable(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  // Unique time slots
  const times = Array.from(new Set(timetable.map((t) => t.startTime))).sort();

  // Color map by course id
  const colorMap: Record<string, string> = {};
  timetable.forEach((t, i) => {
    if (!colorMap[t.course.id]) colorMap[t.course.id] = COLORS[Object.keys(colorMap).length % COLORS.length];
  });

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-5xl space-y-5">

            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Багш</p>
              <h1 className="mt-1 text-2xl font-semibold">Хичээлийн хуваарь</h1>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
              </div>
            ) : timetable.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-8 text-center text-white/40 backdrop-blur-md">
                Хуваарь бүртгэгдээгүй байна
              </div>
            ) : (
              <>
                {/* Grid view */}
                <div className="rounded-2xl border border-white/10 bg-[#081120]/70 backdrop-blur-md overflow-x-auto">
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/40 w-20">Цаг</th>
                        {DAYS.map((d) => (
                          <th key={d} className="px-4 py-3 text-center text-xs font-medium text-white/40">{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {times.map((time) => (
                        <tr key={time} className="border-b border-white/[0.05]">
                          <td className="px-4 py-3 text-xs font-medium text-white/50">{time}</td>
                          {DAYS.map((_, di) => {
                            const entry = timetable.find((t) => t.dayOfWeek === di + 1 && t.startTime === time);
                            return (
                              <td key={di} className="px-2 py-2">
                                {entry ? (
                                  <div className={`rounded-xl border p-2.5 text-center ${colorMap[entry.course.id] ?? COLORS[0]}`}>
                                    <p className="text-xs font-semibold truncate">{entry.course.name}</p>
                                    <p className="text-[10px] opacity-70 mt-0.5">{entry.startTime}–{entry.endTime}</p>
                                    <p className="text-[10px] opacity-60">{entry.room ?? "—"}</p>
                                  </div>
                                ) : (
                                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-center">
                                    <p className="text-[10px] text-white/20">—</p>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* List view */}
                <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                  <p className="text-sm font-semibold text-white/80 mb-4">Хуваарийн жагсаалт</p>
                  <div className="space-y-2">
                    {timetable.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)).map((t) => (
                      <div key={t.id} className={`flex items-center gap-4 rounded-xl border p-3 ${colorMap[t.course.id] ?? COLORS[0]}`}>
                        <div className="w-16 shrink-0 text-center">
                          <p className="text-xs font-bold">{DAYS[t.dayOfWeek - 1]}</p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{t.course.name}</p>
                          <p className="text-xs opacity-70">{t.course.code}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium">{t.startTime}–{t.endTime}</p>
                          <p className="text-xs opacity-60">{t.room ?? "—"}</p>
                        </div>
                      </div>
                    ))}
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
