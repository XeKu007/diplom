"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface GradeRow {
  id: string;
  studentId: string;
  courseId: string;
  semester: string;
  quiz1: number | null;
  quiz2: number | null;
  midterm: number | null;
  assignment: number | null;
  attendance: number | null;
  final: number | null;
  totalScore: number | null;
  letterGrade: string | null;
  student: { firstName: string; lastName: string; user: { userId: string } };
  course: { name: string; code: string };
}

interface Course { id: string; name: string; code: string }
interface Student { id: string; name: string; lastName: string; userId: string }

export default function GradesAdminPage() {
  const [activeMenu, setActiveMenu] = useState("Дүнгийн хуудас");
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("2025 Spring");
  const [showModal, setShowModal] = useState(false);
  const [editRow, setEditRow] = useState<Partial<GradeRow> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadGrades = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCourse) params.set("courseId", selectedCourse);
      if (selectedSemester) params.set("semester", selectedSemester);
      const res = await fetch(`/api/grades?${params}`);
      if (res.ok) setGrades(await res.json());
    } finally { setLoading(false); }
  }, [selectedCourse, selectedSemester]);

  useEffect(() => { loadGrades(); }, [loadGrades]);

  useEffect(() => {
    Promise.all([
      fetch("/api/courses").then((r) => r.json()),
      fetch("/api/students").then((r) => r.json()),
    ]).then(([c, s]) => {
      setCourses(c);
      setStudents(s.map((st: { id: string; name: string; lastName: string; userId: string }) => ({
        id: st.id, name: st.name, lastName: st.lastName, userId: st.userId,
      })));
    });
  }, []);

  const handleSave = async () => {
    if (!editRow?.studentId || !editRow?.courseId || !editRow?.semester) {
      setError("Оюутан, хичээл, семестер шаардлагатай"); return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editRow),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setShowModal(false);
      setEditRow(null);
      loadGrades();
    } finally { setSaving(false); }
  };

  const letterColor = (l: string | null) => {
    if (l === "A") return "text-emerald-400";
    if (l === "B") return "text-blue-400";
    if (l === "C") return "text-amber-400";
    if (l === "D") return "text-orange-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-7xl space-y-6">
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mr-auto">Дүнгийн бүртгэл</h2>
                <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none">
                  {["2025 Spring","2024 Fall","2024 Spring"].map((s) => (
                    <option key={s} value={s} className="bg-[#0a1628]">{s}</option>
                  ))}
                </select>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="" className="bg-[#0a1628]">Бүх хичээл</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0a1628]">{c.name}</option>
                  ))}
                </select>
                <button onClick={() => { setEditRow({ semester: selectedSemester }); setShowModal(true); setError(""); }}
                  className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                  + Дүн оруулах
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : grades.length === 0 ? (
                <div className="text-center py-16 text-white/50">Дүн бүртгэгдээгүй байна</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["Оюутан","Хичээл","Сорил 1","Сорил 2","Явц","Бие даалт","Ирц","Шалгалт","Нийт","Үнэлгээ",""].map((h) => (
                          <th key={h} className="px-3 py-3 text-left text-xs font-medium text-white/50">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {grades.map((g) => (
                        <tr key={g.id} className="border-b border-white/[0.06] hover:bg-white/[0.03]">
                          <td className="px-3 py-3">
                            <p className="font-medium">{g.student.lastName} {g.student.firstName}</p>
                            <p className="text-xs text-white/40">{g.student.user.userId}</p>
                          </td>
                          <td className="px-3 py-3">
                            <p>{g.course.name}</p>
                            <p className="text-xs text-white/40">{g.course.code}</p>
                          </td>
                          <td className="px-3 py-3 text-center text-white/70">{g.quiz1 ?? "—"}</td>
                          <td className="px-3 py-3 text-center text-white/70">{g.quiz2 ?? "—"}</td>
                          <td className="px-3 py-3 text-center text-white/70">{g.midterm ?? "—"}</td>
                          <td className="px-3 py-3 text-center text-white/70">{g.assignment ?? "—"}</td>
                          <td className="px-3 py-3 text-center text-white/70">{g.attendance ?? "—"}</td>
                          <td className="px-3 py-3 text-center text-white/70">{g.final ?? "—"}</td>
                          <td className="px-3 py-3 text-center font-bold">{g.totalScore ?? "—"}</td>
                          <td className="px-3 py-3 text-center">
                            <span className={`font-bold text-lg ${letterColor(g.letterGrade)}`}>{g.letterGrade ?? "—"}</span>
                          </td>
                          <td className="px-3 py-3">
                            <button onClick={() => { setEditRow({ ...g }); setShowModal(true); setError(""); }}
                              className="rounded-lg border border-blue-400/30 bg-blue-500/15 px-3 py-1 text-xs text-blue-300 hover:bg-blue-500/25">
                              Засах
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Grade Modal */}
      {showModal && editRow !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1628] p-6">
            <h2 className="text-xl font-bold mb-5">Дүн оруулах / засах</h2>
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
              <div>
                <label className="text-xs text-white/50 mb-1 block">Хичээл *</label>
                <select value={editRow.courseId ?? ""} onChange={(e) => setEditRow({ ...editRow, courseId: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="">Сонгох</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0a1628]">{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Семестер *</label>
                <input value={editRow.semester ?? ""} onChange={(e) => setEditRow({ ...editRow, semester: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
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
