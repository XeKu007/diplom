"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface TimetableRow {
  id: string; dayOfWeek: number; startTime: string; endTime: string; room: string | null;
  course: { id: string; name: string; code: string; teacher: { firstName: string; lastName: string } | null };
}

const DAYS = ["Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан"];
const COLORS = [
  "border-blue-400/30 bg-blue-500/15 text-blue-200",
  "border-amber-400/30 bg-amber-500/15 text-amber-200",
  "border-emerald-400/30 bg-emerald-500/15 text-emerald-200",
  "border-orange-400/30 bg-orange-500/15 text-orange-200",
  "border-pink-400/30 bg-pink-500/15 text-pink-200",
  "border-cyan-400/30 bg-cyan-500/15 text-cyan-200",
  "border-violet-400/30 bg-violet-500/15 text-violet-200",
  "border-red-400/30 bg-red-500/15 text-red-200",
  "border-lime-400/30 bg-lime-500/15 text-lime-200",
];

export default function TimetablePage() {
  const [activeMenu, setActiveMenu] = useState("Хичээлийн хуваарь");
  const [timetable, setTimetable] = useState<TimetableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/timetable")
      .then((r) => r.json())
      .then((d) => setTimetable(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const times = Array.from(new Set(timetable.map((t) => t.startTime))).sort();
  const colorMap: Record<string, string> = {};
  timetable.forEach((t) => {
    if (!colorMap[t.course.id]) {
      colorMap[t.course.id] = COLORS[Object.keys(colorMap).length % COLORS.length];
    }
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
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Хичээл</p>
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
                {/* Grid */}
                <div className="rounded-2xl border border-white/10 bg-[#081120]/70 backdrop-blur-md overflow-x-auto">
                  <table className="w-full border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/40 w-20">Цаг</th>
                        {DAYS.map((d) => (
                          <th key={d} className="px-3 py-3 text-center text-xs font-medium text-white/40">{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {times.map((time) => (
                        <tr key={time} className="border-b border-white/[0.05]">
                          <td className="px-4 py-2 text-xs font-medium text-white/50">{time}</td>
                          {DAYS.map((_, di) => {
                            const entry = timetable.find((t) => t.dayOfWeek === di + 1 && t.startTime === time);
                            return (
                              <td key={di} className="px-1.5 py-1.5">
                                {entry ? (
                                  <div className={`rounded-xl border p-2 text-center ${colorMap[entry.course.id] ?? COLORS[0]}`}>
                                    <p className="text-xs font-semibold truncate">{entry.course.name}</p>
                                    <p className="text-[10px] opacity-70 mt-0.5">{entry.startTime}–{entry.endTime}</p>
                                    {entry.room && <p className="text-[10px] opacity-60">{entry.room}</p>}
                                    {entry.course.teacher && (
                                      <p className="text-[10px] opacity-50 mt-0.5">
                                        {entry.course.teacher.lastName} {entry.course.teacher.firstName}
                                      </p>
                                    )}
                                  </div>
                                ) : (
                                  <div className="rounded-xl border border-white/5 bg-white/[0.01] p-2 text-center">
                                    <p className="text-[10px] text-white/15">—</p>
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

                {/* Legend */}
                <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">Хичээлүүд</p>
                  <div className="flex flex-wrap gap-2">
                    {Array.from(new Map(timetable.map((t) => [t.course.id, t.course])).values()).map((c) => (
                      <span key={c.id} className={`rounded-full border px-3 py-1 text-xs ${colorMap[c.id] ?? COLORS[0]}`}>
                        {c.name} ({c.code})
                      </span>
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
