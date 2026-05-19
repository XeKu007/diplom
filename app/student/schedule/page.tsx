"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface TimetableRow {
  id: string; dayOfWeek: number; startTime: string; endTime: string; room: string | null;
  course: { name: string; code: string; teacher: { firstName: string; lastName: string } | null };
}

const DAY = ["", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба", "Ням"];
const COLORS = [
  "border-violet-400/25 bg-violet-500/10 text-violet-300",
  "border-amber-400/25 bg-amber-500/10 text-amber-300",
  "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
  "border-orange-400/25 bg-orange-500/10 text-orange-300",
  "border-pink-400/25 bg-pink-500/10 text-pink-300",
  "border-cyan-400/25 bg-cyan-500/10 text-cyan-300",
];

export default function SchedulePage() {
  const [activeMenu, setActiveMenu] = useState("Оюутан");
  const [timetable, setTimetable] = useState<TimetableRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/timetable")
      .then((r) => r.json())
      .then((d) => setTimetable(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const grouped = DAY.slice(1, 6).map((day, i) => ({
    day,
    dayNum: i + 1,
    entries: timetable.filter((t) => t.dayOfWeek === i + 1).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  })).filter((g) => g.entries.length > 0);

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-3xl space-y-5">

            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Оюутан</p>
              <h1 className="mt-1 text-2xl font-semibold">Хичээлийн хуваарь</h1>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
              </div>
            ) : grouped.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-8 text-center text-white/40 backdrop-blur-md">
                Хуваарь бүртгэгдээгүй байна
              </div>
            ) : (
              <div className="space-y-4">
                {grouped.map((g) => (
                  <div key={g.day} className="rounded-2xl border border-white/10 bg-[#081120]/70 p-4 backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-3">{g.day}</p>
                    <div className="space-y-2">
                      {g.entries.map((t, i) => (
                        <div key={t.id} className={`flex items-center gap-4 rounded-[18px] border p-4 ${COLORS[i % COLORS.length]}`}>
                          <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] py-2">
                            <p className="text-[10px] text-white/40">Эхлэх</p>
                            <p className="text-sm font-bold text-white">{t.startTime}</p>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{t.course.name}</p>
                            <p className="text-xs text-white/50 mt-0.5">{t.course.code} · {t.course.teacher ? `${t.course.teacher.lastName} ${t.course.teacher.firstName}` : "—"}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-medium">{t.startTime}–{t.endTime}</p>
                            <p className="text-xs text-white/40 mt-0.5">Өрөө: {t.room ?? "—"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
