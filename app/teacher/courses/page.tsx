"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Course {
  id: string; name: string; code: string; semester: string | null;
  room: string | null; schedule: string | null; credits: number;
  _count: { enrollments: number };
  teacher: { firstName: string; lastName: string } | null;
}

const COLORS = [
  "border-blue-400/30 bg-blue-500/15",
  "border-amber-400/30 bg-amber-500/15",
  "border-emerald-400/30 bg-emerald-500/15",
  "border-orange-400/30 bg-orange-500/15",
  "border-pink-400/30 bg-pink-500/15",
  "border-cyan-400/30 bg-cyan-500/15",
];

export default function TeacherCoursesPage() {
  const [activeMenu, setActiveMenu] = useState("Хичээл");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((d) => setCourses(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = courses.reduce((s, c) => s + c._count.enrollments, 0);

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-6xl space-y-5">

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Багш</p>
                <h1 className="mt-1 text-2xl font-semibold">Миний хичээлүүд</h1>
              </div>
              <div className="flex gap-1 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-1">
                {(["grid","list"] as const).map((v) => (
                  <button key={v} onClick={() => setView(v)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${view === v ? "bg-gradient-to-b from-violet-500 to-violet-700 text-white" : "text-white/40 hover:text-white/70"}`}>
                    {v === "grid" ? "Сүлжээ" : "Жагсаалт"}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { label: "Нийт хичээл",  value: courses.length,  icon: "📚", color: "text-violet-300",  border: "border-violet-400/20 bg-violet-500/10" },
                { label: "Нийт оюутан",  value: totalStudents,   icon: "👨‍🎓", color: "text-emerald-300", border: "border-emerald-400/20 bg-emerald-500/10" },
                { label: "Нийт кредит",  value: courses.reduce((s, c) => s + c.credits, 0), icon: "⭐", color: "text-amber-300", border: "border-amber-400/20 bg-amber-500/10" },
              ].map((s) => (
                <div key={s.label} className={`rounded-[22px] border p-4 backdrop-blur-md ${s.border}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{s.icon}</span>
                    <p className={`text-2xl font-bold ${s.color}`}>{loading ? "…" : s.value}</p>
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/50">{s.label}</p>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" /></div>
            ) : courses.length === 0 ? (
              <div className="text-center py-16 text-white/40">Хичээл байхгүй байна</div>
            ) : view === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((c, i) => (
                  <div key={c.id} className={`rounded-[22px] border p-5 ${COLORS[i % COLORS.length]}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-semibold">{c.name}</p>
                        <p className="text-xs text-white/50 mt-0.5">{c.code} · {c.semester ?? "—"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">{c._count.enrollments}</p>
                        <p className="text-[10px] text-white/30">оюутан</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div className="rounded-xl border border-white/10 bg-[#0a1428] py-2 text-center">
                        <p className="text-white/30">Өрөө</p>
                        <p className="font-semibold text-cyan-300">{c.room ?? "—"}</p>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-[#0a1428] py-2 text-center">
                        <p className="text-white/30">Кредит</p>
                        <p className="font-semibold text-violet-300">{c.credits}</p>
                      </div>
                    </div>
                    {c.schedule && <p className="text-xs text-white/40 mb-3">{c.schedule}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 backdrop-blur-md overflow-hidden">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      {["Хичээл","Код","Семестер","Оюутан","Өрөө","Кредит"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((c) => (
                      <tr key={c.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-medium">{c.name}</td>
                        <td className="px-4 py-3 text-white/50">{c.code}</td>
                        <td className="px-4 py-3 text-white/50">{c.semester ?? "—"}</td>
                        <td className="px-4 py-3 text-violet-300 font-bold">{c._count.enrollments}</td>
                        <td className="px-4 py-3 text-white/50">{c.room ?? "—"}</td>
                        <td className="px-4 py-3 text-amber-300">{c.credits}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
