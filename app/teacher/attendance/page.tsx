"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Course { id: string; name: string; code: string }
interface Student { id: string; name: string; lastName: string; userId: string }
interface AttRow {
  id: string; date: string; status: string;
  student: { firstName: string; lastName: string; user: { userId: string } };
  course: { name: string };
}

const STATUS_OPTS = [
  { value: "present", label: "Ирсэн",   color: "text-emerald-300" },
  { value: "absent",  label: "Тасалсан", color: "text-red-300" },
  { value: "late",    label: "Хоцорсон", color: "text-amber-300" },
  { value: "excused", label: "Чөлөөтэй", color: "text-blue-300" },
];

export default function TeacherAttendancePage() {
  const [activeMenu, setActiveMenu] = useState("Ирц бүртгэл");
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<AttRow[]>([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bulkData, setBulkData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

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

  const loadRecords = useCallback(async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/attendance?courseId=${selectedCourse}&from=${selectedDate}&to=${selectedDate}`);
      if (res.ok) setRecords(await res.json());
    } finally { setLoading(false); }
  }, [selectedCourse, selectedDate]);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  const openBulk = () => {
    const init: Record<string, string> = {};
    students.forEach((s) => { init[s.id] = "present"; });
    setBulkData(init);
    setShowModal(true);
  };

  const saveBulk = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(bulkData).map(([studentId, status]) => ({
        studentId, courseId: selectedCourse, date: selectedDate, status,
      }));
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setShowModal(false);
      loadRecords();
    } finally { setSaving(false); }
  };

  // Summary per student from records
  const summary = students.map((s) => {
    const rows = records.filter((r) => r.student.user.userId === s.userId);
    const present = rows.filter((r) => r.status === "present").length;
    const absent  = rows.filter((r) => r.status === "absent").length;
    const late    = rows.filter((r) => r.status === "late").length;
    return { ...s, present, absent, late, total: rows.length };
  });

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
              <h1 className="mt-1 text-2xl font-semibold">Ирц бүртгэл</h1>
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
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none ml-auto" />
              <button onClick={openBulk}
                className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                Ирц бүртгэх
              </button>
            </div>

            {/* Table */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <p className="text-sm font-semibold text-white/80 mb-4">
                {courses.find((c) => c.id === selectedCourse)?.name} · {selectedDate}
              </p>
              {loading ? (
                <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" /></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["Оюутан","ID","Ирсэн","Тасалсан","Хоцорсон"].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {summary.map((s) => (
                        <tr key={s.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                          <td className="px-4 py-3 font-medium">{s.lastName} {s.name}</td>
                          <td className="px-4 py-3 text-white/40 font-mono text-xs">{s.userId}</td>
                          <td className="px-4 py-3 text-emerald-400 font-bold">{s.present}</td>
                          <td className="px-4 py-3 text-red-400 font-bold">{s.absent}</td>
                          <td className="px-4 py-3 text-amber-400 font-bold">{s.late}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {summary.length === 0 && (
                    <p className="text-center py-8 text-white/40">Ирцийн бүртгэл байхгүй байна</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Bulk Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1628] p-6">
            <h2 className="text-xl font-bold mb-1">Ирц бүртгэх</h2>
            <p className="text-sm text-white/50 mb-5">{selectedDate} · {courses.find((c) => c.id === selectedCourse)?.name}</p>
            <div className="space-y-2">
              {students.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{s.lastName} {s.name}</p>
                    <p className="text-xs text-white/40">{s.userId}</p>
                  </div>
                  <div className="flex gap-1">
                    {STATUS_OPTS.map((opt) => (
                      <button key={opt.value} onClick={() => setBulkData({ ...bulkData, [s.id]: opt.value })}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${bulkData[s.id] === opt.value ? `border ${opt.color} bg-white/10 border-current` : "text-white/30 hover:text-white/60"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:text-white">Болих</button>
              <button onClick={saveBulk} disabled={saving}
                className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? "Хадгалж байна..." : "Хадгалах"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
