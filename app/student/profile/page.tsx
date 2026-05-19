"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface StudentData {
  id: string; userId: string; firstName: string; lastName: string;
  email: string | null; phone: string | null; major: string | null;
  classGroup: string | null; semester: string | null; enrollmentYear: string | null;
  advisor: string | null; scholarship: string | null; dormitory: string | null;
  status: string; gpa: number;
  user: { userId: string };
  enrollments?: { course: { name: string; code: string; credits: number; room: string | null; schedule: string | null; teacher: { firstName: string } | null } }[];
  grades?: { totalScore: number | null; letterGrade: string | null; course: { name: string; code: string } }[];
}

export default function StudentProfilePage() {
  const [activeMenu, setActiveMenu] = useState("Хувийн мэдээлэл");
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ phone: "", email: "", address: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (me) => {
        if (!me?.userId) return;
        const res = await fetch("/api/students");
        const list: StudentData[] = await res.json();
        const found = list.find((s) => s.userId === me.userId);
        if (found) {
          setStudent(found);
          setForm({ phone: found.phone ?? "", email: found.email ?? "", address: "" });
          // Load full detail
          const detail = await fetch(`/api/students/${found.id}`).then((r) => r.json());
          setStudent(detail);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!student) return;
    setSaving(true);
    await fetch(`/api/students/${student.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: form.phone, email: form.email }),
    });
    setSaving(false);
    setEditing(false);
    setStudent((prev) => prev ? { ...prev, phone: form.phone, email: form.email } : prev);
  };

  if (loading) return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
    </div>
  );

  if (!student) return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <p className="text-white/50">Мэдээлэл олдсонгүй</p>
    </div>
  );

  const courses = student.enrollments?.map((e) => e.course) ?? [];
  const grades = student.grades ?? [];
  const totalCredits = courses.reduce((s, c) => s + c.credits, 0);

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-4xl space-y-5">

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Оюутан</p>
                <h1 className="mt-1 text-2xl font-semibold">Хувийн мэдээлэл</h1>
              </div>
              <button onClick={() => setEditing(!editing)}
                className="rounded-2xl border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-200 hover:bg-violet-500/25">
                {editing ? "Цуцлах" : "Засах"}
              </button>
            </div>

            {/* Profile card */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-6 backdrop-blur-md">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-800 to-violet-800 flex items-center justify-center text-3xl font-bold">
                  {student.firstName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{student.lastName} {student.firstName}</h2>
                  <p className="text-sm text-white/60 mt-1">{student.major ?? "—"} · {student.classGroup ?? "—"}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {student.scholarship && <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">{student.scholarship}</span>}
                    {student.semester && <span className="rounded-full border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs text-blue-300">{student.semester}-р семестер</span>}
                    {student.dormitory && <span className="rounded-full border border-amber-400/30 bg-amber-500/15 px-3 py-1 text-xs text-amber-300">{student.dormitory}</span>}
                  </div>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Хичээл", value: courses.length, color: "text-violet-300" },
                      { label: "Кредит", value: totalCredits, color: "text-emerald-300" },
                      { label: "GPA", value: student.gpa.toFixed(2), color: "text-amber-300" },
                      { label: "Оюутны ID", value: student.user?.userId ?? student.userId, color: "text-cyan-300" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-white/10 bg-[#0a1428] p-3 text-center">
                        <p className="text-[10px] text-white/30">{s.label}</p>
                        <p className={`mt-1 text-base font-bold ${s.color}`}>{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {/* Personal info */}
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-white/80 mb-4">Хувийн мэдээлэл</p>
                <div className="space-y-3">
                  {[
                    { label: "Нэр", value: `${student.lastName} ${student.firstName}`, icon: "👤", editable: false },
                    { label: "Оюутны ID", value: student.user?.userId ?? student.userId, icon: "🪪", editable: false },
                    { label: "И-мэйл", value: student.email, icon: "✉️", key: "email" },
                    { label: "Утас", value: student.phone, icon: "📱", key: "phone" },
                    { label: "Тэнхим", value: student.major, icon: "🎓", editable: false },
                    { label: "Зөвлөх багш", value: student.advisor, icon: "🧑‍🏫", editable: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/40">{item.label}</p>
                        {editing && item.key ? (
                          <input value={(form as Record<string, string>)[item.key]}
                            onChange={(e) => setForm({ ...form, [item.key!]: e.target.value })}
                            className="mt-1 w-full rounded border border-white/20 bg-[#0a1428] px-2 py-1 text-sm text-white focus:outline-none" />
                        ) : (
                          <p className="mt-0.5 text-sm font-medium text-white/85 truncate">{item.value ?? "—"}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {editing && (
                  <button onClick={handleSave} disabled={saving}
                    className="mt-4 w-full rounded-xl border border-emerald-400/30 bg-emerald-500/15 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-60">
                    {saving ? "Хадгалж байна..." : "Хадгалах"}
                  </button>
                )}
              </div>

              {/* Courses */}
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-white/80 mb-4">Одоо үзэж буй хичээлүүд</p>
                {courses.length === 0 ? (
                  <p className="text-center py-8 text-white/40">Хичээл бүртгэгдээгүй байна</p>
                ) : (
                  <div className="space-y-3">
                    {courses.map((c, i) => {
                      const grade = grades.find((g) => g.course.code === c.code);
                      return (
                        <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold truncate">{c.name}</p>
                              <p className="text-xs text-white/50 mt-0.5">{c.code} · {c.teacher?.firstName ?? "—"}</p>
                              {c.schedule && <p className="text-xs text-white/30 mt-0.5">{c.schedule}</p>}
                            </div>
                            <div className="ml-3 text-right shrink-0">
                              <p className={`text-lg font-bold ${grade?.letterGrade === "A" ? "text-emerald-300" : grade?.letterGrade === "B" ? "text-blue-300" : "text-amber-300"}`}>
                                {grade?.letterGrade ?? "—"}
                              </p>
                              <p className="text-[10px] text-white/30">{c.credits} кредит</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
