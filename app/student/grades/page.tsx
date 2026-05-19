"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface GradeRow {
  id: string;
  quiz1: number | null; quiz2: number | null;
  midterm: number | null; assignment: number | null;
  attendance: number | null; final: number | null;
  totalScore: number | null; letterGrade: string | null;
  semester: string;
  course: { name: string; code: string };
}

function letterColor(l: string | null) {
  if (l === "A") return { text: "text-emerald-300", bg: "bg-emerald-400/10 border-emerald-400/25" };
  if (l === "B") return { text: "text-blue-300",    bg: "bg-blue-400/10 border-blue-400/25" };
  if (l === "C") return { text: "text-amber-300",   bg: "bg-amber-400/10 border-amber-400/25" };
  if (l === "D") return { text: "text-orange-300",  bg: "bg-orange-400/10 border-orange-400/25" };
  return           { text: "text-red-300",           bg: "bg-red-400/10 border-red-400/25" };
}

export default function StudentGradesPage() {
  const [activeMenu, setActiveMenu] = useState("Дүн");
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/grades")
      .then((r) => r.json())
      .then((data) => { setGrades(Array.isArray(data) ? data : []); })
      .finally(() => setLoading(false));
  }, []);

  const avg = grades.length
    ? (grades.reduce((s, g) => s + (g.totalScore ?? 0), 0) / grades.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-5xl space-y-5">

            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Нийт хичээл", value: grades.length },
                { label: "Дундаж оноо", value: avg },
                { label: "Тэнцсэн", value: grades.filter((g) => (g.totalScore ?? 0) >= 60).length },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-white/10 bg-[#081120]/70 p-4 text-center backdrop-blur-md">
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-xs text-white/50 mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Grades table */}
            <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-widest text-white/60 mb-4">Дүнгийн хуудас</h2>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : grades.length === 0 ? (
                <p className="text-center py-12 text-white/40">Дүн бүртгэгдээгүй байна</p>
              ) : (
                <div className="space-y-3">
                  {grades.map((g) => {
                    const lc = letterColor(g.letterGrade);
                    const pct = g.totalScore ?? 0;
                    return (
                      <div key={g.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium">{g.course.name}</p>
                            <p className="text-xs text-white/40">{g.course.code} · {g.semester}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-white">{g.totalScore ?? "—"}</span>
                            <span className={`rounded-full border px-3 py-1 text-sm font-bold ${lc.bg} ${lc.text}`}>
                              {g.letterGrade ?? "—"}
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
                          <div className={`h-full rounded-full ${pct >= 90 ? "bg-emerald-400" : pct >= 80 ? "bg-blue-400" : pct >= 70 ? "bg-amber-400" : pct >= 60 ? "bg-orange-400" : "bg-red-400"}`}
                            style={{ width: `${pct}%` }} />
                        </div>
                        <div className="grid grid-cols-6 gap-2 text-center text-xs text-white/50">
                          {[
                            { label: "Сорил 1", val: g.quiz1, max: 10 },
                            { label: "Сорил 2", val: g.quiz2, max: 10 },
                            { label: "Явц",     val: g.midterm, max: 30 },
                            { label: "Бие даалт", val: g.assignment, max: 30 },
                            { label: "Ирц",     val: g.attendance, max: 10 },
                            { label: "Шалгалт", val: g.final, max: 30 },
                          ].map(({ label, val, max }) => (
                            <div key={label}>
                              <p>{label}</p>
                              <p className="font-semibold text-white/80">{val ?? "—"}/{max}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
