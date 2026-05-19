"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface StudentData {
  gpa: number;
  grades: { totalScore: number | null; letterGrade: string | null }[];
  payments: { status: string }[];
  enrollments: { course: { credits: number } }[];
}

export default function GraduatePage() {
  const [activeMenu, setActiveMenu] = useState("Оюутан");
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (me) => {
        if (!me?.userId) return;
        const res = await fetch("/api/students");
        const list = await res.json();
        const found = list.find((s: { userId: string }) => s.userId === me.userId);
        if (found) {
          const detail = await fetch(`/api/students/${found.id}`).then((r) => r.json());
          setStudent(detail);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const totalCredits = student?.enrollments?.reduce((s: number, e: { course: { credits: number } }) => s + e.course.credits, 0) ?? 0;
  const passedCourses = student?.grades?.filter((g) => (g.totalScore ?? 0) >= 60).length ?? 0;
  const allPaid = student?.payments?.every((p) => p.status === "paid") ?? false;
  const gpa = student?.gpa ?? 0;

  const requirements = [
    { label: "Нийт кредит",      required: 120, completed: totalCredits,  unit: "кредит", done: totalCredits >= 120 },
    { label: "Голч дүн",         required: 2.0, completed: gpa,           unit: "GPA",    done: gpa >= 2.0 },
    { label: "Тэнцсэн хичээл",   required: 30,  completed: passedCourses, unit: "хичээл", done: passedCourses >= 30 },
    { label: "Сургалтын төлбөр", required: 1,   completed: allPaid ? 1 : 0, unit: "бүрэн", done: allPaid },
  ];

  const checklist = [
    { label: "Сургалтын төлбөр бүрэн төлсөн",  done: allPaid },
    { label: "Бүх хичээлийн дүн бүрдсэн",       done: passedCourses > 0 },
    { label: "Голч дүн 2.0-аас дээш",           done: gpa >= 2.0 },
    { label: "Кредит 120-оос дээш",             done: totalCredits >= 120 },
  ];

  const readyToGraduate = checklist.every((c) => c.done);

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
              <h1 className="mt-1 text-2xl font-semibold">Төгсөлтийн мэдээлэл</h1>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
              </div>
            ) : (
              <>
                {/* Status banner */}
                <div className={`rounded-2xl border p-5 backdrop-blur-md ${readyToGraduate ? "border-emerald-400/30 bg-emerald-500/10" : "border-amber-400/30 bg-amber-500/10"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{readyToGraduate ? "🎓" : "📋"}</span>
                    <div>
                      <p className="font-semibold text-lg">
                        {readyToGraduate ? "Төгсөхөд бэлэн байна!" : "Төгсөлтийн шаардлага хангаагүй байна"}
                      </p>
                      <p className="text-sm text-white/60 mt-0.5">
                        {readyToGraduate ? "Бүх шаардлага хангагдсан байна" : "Доорх шаардлагуудыг хангана уу"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Requirements */}
                <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                  <p className="text-sm font-semibold text-white/80 mb-4">Төгсөлтийн шаардлагууд</p>
                  <div className="grid grid-cols-2 gap-4">
                    {requirements.map((r) => {
                      const pct = Math.min(100, Math.round((r.completed / r.required) * 100));
                      return (
                        <div key={r.label} className="rounded-xl border border-white/10 bg-[#0a1428] p-4">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-white/50">{r.label}</span>
                            <span className={r.done ? "text-emerald-400 font-bold" : "text-amber-400"}>
                              {typeof r.completed === "number" && r.unit !== "бүрэн"
                                ? `${r.completed.toFixed(r.unit === "GPA" ? 2 : 0)}/${r.required}`
                                : r.done ? "✓" : "✗"} {r.unit}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div className={`h-full rounded-full ${r.done ? "bg-emerald-500" : "bg-amber-500"}`}
                              style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Checklist */}
                <div className="rounded-2xl border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                  <p className="text-sm font-semibold text-white/80 mb-4">Шалгах жагсаалт</p>
                  <div className="space-y-3">
                    {checklist.map((item) => (
                      <div key={item.label} className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${item.done ? "border-emerald-400/20 bg-emerald-500/5" : "border-white/10 bg-white/[0.02]"}`}>
                        <span className={`text-lg ${item.done ? "text-emerald-400" : "text-white/30"}`}>
                          {item.done ? "✅" : "⬜"}
                        </span>
                        <span className={`text-sm ${item.done ? "text-white" : "text-white/50"}`}>{item.label}</span>
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
