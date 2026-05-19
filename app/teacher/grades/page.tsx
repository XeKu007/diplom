"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Course { id: string; name: string; code: string }
interface GradeRow {
  id: string; totalScore: number | null; letterGrade: string | null;
  quiz1: number | null; quiz2: number | null; midterm: number | null;
  assignment: number | null; attendance: number | null; final: number | null;
  semester: string;
  student: { firstName: string; lastName: string; user: { userId: string } };
  course: { name: string; code: string };
}
interface Student { id: string; name: string; lastName: string; userId: string }

export default function TeacherGradesPage() {
  const [activeMenu, setActiveMenu] = useState("Дүнгийн жагсаалт");
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [semester, setSemester] = useState("2025 Spring");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState<Partial<GradeRow & { studentId: string; courseId: string }> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/courses").then((r) => r.json()),
      fetch("/api/students").then((r) => r.json()),
    ]).then(([c, s]) => {
      setCourses(Array.isArray(c) ? c : []);
      setStudents(Array.isArray(s) ? s : []);
      if (c.length > 0) setSelectedCourse(c[0].id);
    });
  }, []);

  const loadGrades = useCallback(async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/grades?courseId=${selectedCourse}&semester=${encodeURIComponent(semester)}`);
      if (res.ok) setGrades(await res.json());
    } finally { setLoading(false); }
  }, [selectedCourse, semester]);

  useEffect(() => { loadGrades(); }, [loadGrades]);

  const handleSave = async () => {
    if (!editRow?.studentId || !editRow?.courseId) { setError("Оюутан, хичээл шаардлагатай"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editRow, semester }),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      setShowModal(false); setEditRow(null); loadGrades();
    } finally { setSaving(false); }
  };

  const lc = (l: string | null) => ({
    A: "text-emerald-400", B: "text-blue-400", C: "text-amber-400", D: "text-orange-400",
  }[l ?? ""] ?? "text-red-400");

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
              <h1 className="mt-1 text-2xl font-semibold">Дүнгийн жагсаалт</h1>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex gap-1.5 overflow-x-auto">
                {courses.map((c) => (
                  <button key={c.id} onClick={() => setSelectedCourse(c.id)}
                    className={`shrink-0 rounded-2xl border px-4 py-2 text-sm font-medium transition-all ${selectedCourse === c.id ? "border-violet-400/30 bg-violet-500/15 text-violet-200" : "border-white/[0.07] bg-white/[0.03] text-white/45 hover:text-white/70"}`}>
                    {c.name}
                  </button>
                ))}
              </div>
              <select value={semester} onChange={(e) => setSemester(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none ml-auto">
                {["2025 Spring","2024 Fall","2024 Spring"].map((s) => (
                  <option key={s} value={s} className="bg-[#0a1628]">{s}</option>
                ))}
              </select>
              <button onClick={() => { setEditRow({ courseId: selectedCourse, semester }); setShowModal(true); setError(""); }}
                className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                + Дүн оруулах
              </button>
            </div>

            {/* Table */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md overflow-x-auto">
              {loading ? (
                <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" /></div>
              ) : grades.length === 0 ? (
                <p className="text-center py-12 text-white/40">Дүн бүртгэгдээгүй байна</p>
              ) : (
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {["Оюутан","Сорил 1","Сорил 2","Явц","Бие даалт","Ирц","Шалгалт","Нийт","Үнэлгээ",""].map((h) => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-medium text-white/40">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g) => (
                      <tr key={g.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                        <td className="px-3 py-3">
                          <p className="font-medium">{g.student.lastName} {g.student.firstName}</p>
                          <p className="text-xs text-white/40">{g.student.user.userId}</p>
                        </td>
                        <td className="px-3 py-3 text-center text-white/70">{g.quiz1 ?? "—"}</td>
                        <td className="px-3 py-3 text-center text-white/70">{g.quiz2 ?? "—"}</td>
                        <td className="px-3 py-3 text-center text-white/70">{g.midterm ?? "—"}</td>
                        <td className="px-3 py-3 text-center text-white/70">{g.assignment ?? "—"}</td>
                        <td className="px-3 py-3 text-center text-white/70">{g.attendance ?? "—"}</td>
                        <td className="px-3 py-3 text-center text-white/70">{g.final ?? "—"}</td>
                        <td className="px-3 py-3 text-center font-bold">{g.totalScore ?? "—"}</td>
                        <td className="px-3 py-3 text-center"><span className={`font-bold text-lg ${lc(g.letterGrade)}`}>{g.letterGrade ?? "—"}</span></td>
                        <td className="px-3 py-3">
                          <button onClick={() => { setEditRow({ ...g, studentId: g.student.user.userId, courseId: selectedCourse }); setShowModal(true); setError(""); }}
                            className="rounded-lg border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs text-blue-300 hover:bg-blue-500/25">
                            Засах
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Grade Modal */}
      {showModal && editRow !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1628] p-6">
            <h2 className="text-xl font-bold mb-5">Дүн оруулах</h2>
            {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Оюутан *</label>
                <select value={editRow.studentId ?? ""} onChange={(e) => setEditRow({ ...editRow, studentId: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="">Сонгох</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#0a1628]">{s.lastName} {s.name} ({s.userId})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Сорил 1 (/10)", key: "quiz1" },
                  { label: "Сорил 2 (/10)", key: "quiz2" },
                  { label: "Явц (/30)", key: "midterm" },
                  { label: "Бие даалт (/30)", key: "assignment" },
                  { label: "Ирц (/10)", key: "attendance" },
                  { label: "Шалгалт (/30)", key: "final" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <label className="text-xs text-white/50 mb-1 block">{label}</label>
                    <input type="number" min="0" max="100"
                      value={(editRow as Record<string, unknown>)[key] as number ?? ""}
                      onChange={(e) => setEditRow({ ...editRow, [key]: e.target.value ? parseFloat(e.target.value) : null })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setEditRow(null); setError(""); }}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:text-white">Болих</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? "Хадгалж байна..." : "Хадгалах"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
