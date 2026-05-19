"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface GradeRow {
  id: string; quiz1: number | null; quiz2: number | null;
  midterm: number | null; assignment: number | null;
  attendance: number | null; final: number | null;
  totalScore: number | null; letterGrade: string | null; semester: string;
  course: { name: string; code: string };
}

const COLORS = [
  { tw: "border-blue-400/30 bg-blue-500/15", text: "text-blue-300", dot: "bg-blue-400" },
  { tw: "border-amber-400/30 bg-amber-500/15", text: "text-amber-300", dot: "bg-amber-400" },
  { tw: "border-emerald-400/30 bg-emerald-500/15", text: "text-emerald-300", dot: "bg-emerald-400" },
  { tw: "border-orange-400/30 bg-orange-500/15", text: "text-orange-300", dot: "bg-orange-400" },
  { tw: "border-pink-400/30 bg-pink-500/15", text: "text-pink-300", dot: "bg-pink-400" },
  { tw: "border-cyan-400/30 bg-cyan-500/15", text: "text-cyan-300", dot: "bg-cyan-400" },
];

export default function ScoresPage() {
  const [activeMenu, setActiveMenu] = useState("Оюутан");
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/grades")
      .then((r) => r.json())
      .then((d) => setGrades(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-4xl space-y-5">

            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Оюутан</p>
              <h1 className="mt-1 text-2xl font-semibold">Сорилын оноо</h1>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
              </div>
            ) : grades.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-8 text-center text-white/40 backdrop-blur-md">
                Дүн бүртгэгдээгүй байна
              </div>
            ) : (
              <div className="space-y-4">
                {grades.map((g, i) => {
                  const c = COLORS[i % COLORS.length];
                  const quizzes = [
                    { name: "Сорил 1", got: g.quiz1, max: 10 },
                    { name: "Сорил 2", got: g.quiz2, max: 10 },
                    { name: "Явц",     got: g.midterm, max: 30 },
                    { name: "Бие даалт", got: g.assignment, max: 30 },
                    { name: "Ирц",     got: g.attendance, max: 10 },
                    { name: "Шалгалт", got: g.final, max: 30 },
                  ].filter((q) => q.got !== null);

                  return (
                    <div key={g.id} className={`rounded-[22px] border p-5 ${c.tw}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${c.dot}`} />
                          <div>
                            <p className="font-semibold">{g.course.name}</p>
                            <p className="text-xs text-white/50">{g.course.code} · {g.semester}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">{g.totalScore ?? "—"}</p>
                          <p className={`text-sm font-bold ${c.text}`}>{g.letterGrade ?? "—"}</p>
                        </div>
                      </div>

                      {quizzes.length > 0 && (
                        <div className="space-y-2">
                          {quizzes.map(({ name, got, max }) => {
                            const pct = got !== null ? Math.round((got / max) * 100) : 0;
                            return (
                              <div key={name}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-white/50">{name}</span>
                                  <span className={`font-semibold ${c.text}`}>{got}/{max}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                                  <div className={`h-full rounded-full ${c.dot}`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
