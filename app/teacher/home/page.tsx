"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Course {
  id: string; name: string; code: string; room: string | null; schedule: string | null;
  _count: { enrollments: number };
}

interface Timetable {
  id: string; dayOfWeek: number; startTime: string; endTime: string; room: string | null;
  course: { name: string };
}

const DAY = ["", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба", "Ням"];

export default function TeacherHomePage() {
  const router = useRouter();
  const [activeMenu, setActiveMenu] = useState("Нүүр хуудас");
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetable, setTimetable] = useState<Timetable[]>([]);
  const [loading, setLoading] = useState(true);
  const [teacherName, setTeacherName] = useState("Багш");

  useEffect(() => {
    Promise.all([
      fetch("/api/courses").then((r) => r.json()),
      fetch("/api/timetable").then((r) => r.json()),
      fetch("/api/auth/me").then((r) => r.json()),
    ]).then(([c, t, me]) => {
      setCourses(Array.isArray(c) ? c : []);
      setTimetable(Array.isArray(t) ? t : []);
      if (me?.name) setTeacherName(me.name);
    }).finally(() => setLoading(false));
  }, []);

  const totalStudents = courses.reduce((s, c) => s + c._count.enrollments, 0);
  const today = new Date().getDay() || 7;
  const todayClasses = timetable.filter((t) => t.dayOfWeek === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-6xl space-y-5">

            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Багш</p>
              <h1 className="mt-1 text-2xl font-semibold">Сайн байна уу, {teacherName}</h1>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Нийт оюутан",  value: totalStudents,   icon: "👨‍🎓", color: "text-violet-300",  border: "border-violet-400/20 bg-violet-500/10" },
                { label: "Хичээл",       value: courses.length,  icon: "📚",  color: "text-emerald-300", border: "border-emerald-400/20 bg-emerald-500/10" },
                { label: "Өнөөдрийн хичээл", value: todayClasses.length, icon: "📅", color: "text-amber-300", border: "border-amber-400/20 bg-amber-500/10" },
                { label: "Хуваарь",      value: timetable.length, icon: "🗓️", color: "text-cyan-300",    border: "border-cyan-400/20 bg-cyan-500/10" },
              ].map((s) => (
                <div key={s.label} className={`rounded-[22px] border p-4 backdrop-blur-md ${s.border}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{s.icon}</span>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${s.color}`}>{loading ? "…" : s.value}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-white/50">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {/* Courses */}
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-white/80 mb-4">Миний хичээлүүд</p>
                {loading ? (
                  <div className="flex justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" /></div>
                ) : courses.length === 0 ? (
                  <p className="text-center py-8 text-white/40">Хичээл байхгүй байна</p>
                ) : (
                  <div className="space-y-3">
                    {courses.map((c) => (
                      <div key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="text-sm font-semibold">{c.name}</p>
                            <p className="text-xs text-white/40">{c.code} · {c.room ?? "—"}</p>
                          </div>
                          <p className="text-lg font-bold text-violet-300">{c._count.enrollments}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => router.push("/teacher/attendance")}
                            className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] py-1.5 text-xs text-white/60 hover:bg-white/[0.08]">
                            Ирц
                          </button>
                          <button onClick={() => router.push("/teacher/grades")}
                            className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] py-1.5 text-xs text-white/60 hover:bg-white/[0.08]">
                            Дүн
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Today's schedule */}
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-white/80 mb-1">Өнөөдрийн хуваарь</p>
                <p className="text-xs text-white/40 mb-4">{DAY[today]}</p>
                {loading ? (
                  <div className="flex justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" /></div>
                ) : todayClasses.length === 0 ? (
                  <p className="text-center py-8 text-white/40">Өнөөдөр хичээл байхгүй</p>
                ) : (
                  <div className="space-y-3">
                    {todayClasses.map((t) => (
                      <div key={t.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div>
                          <p className="text-sm font-semibold">{t.course.name}</p>
                          <p className="text-xs text-white/40">{t.room ?? "—"}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-white">{t.startTime}</p>
                          <p className="text-xs text-white/40">{t.endTime}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={() => router.push("/teacher/schedule")}
                  className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.04] py-2.5 text-sm text-white/60 hover:bg-white/[0.08]">
                  Бүх хуваарь харах
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
