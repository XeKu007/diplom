"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface AttendanceRow {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: string;
  note: string | null;
  student: { firstName: string; lastName: string; user: { userId: string } };
  course: { name: string; code: string };
}

interface Course { id: string; name: string; code: string }
interface Student { id: string; name: string; lastName: string; userId: string }

const STATUS_OPTS = [
  { value: "present", label: "Ирсэн",   color: "text-emerald-400" },
  { value: "absent",  label: "Тасалсан", color: "text-red-400" },
  { value: "late",    label: "Хоцорсон", color: "text-amber-400" },
  { value: "excused", label: "Чөлөөтэй", color: "text-blue-400" },
];

export default function AttendanceAdminPage() {
  const [activeMenu, setActiveMenu] = useState("Ирцийн бүртгэл");
  const [records, setRecords] = useState<AttendanceRow[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [showModal, setShowModal] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkData, setBulkData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCourse) params.set("courseId", selectedCourse);
      if (selectedDate) {
        params.set("from", selectedDate);
        params.set("to", selectedDate);
      }
      const res = await fetch(`/api/attendance?${params}`);
      if (res.ok) setRecords(await res.json());
    } finally { setLoading(false); }
  }, [selectedCourse, selectedDate]);

  useEffect(() => { load(); }, [load]);

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

  const openBulk = () => {
    if (!selectedCourse) { setError("Эхлээд хичээл сонгоно уу"); return; }
    const init: Record<string, string> = {};
    students.forEach((s) => { init[s.id] = "present"; });
    setBulkData(init);
    setBulkMode(true);
    setShowModal(true);
    setError("");
  };

  const saveBulk = async () => {
    setSaving(true); setError("");
    try {
      const payload = Object.entries(bulkData).map(([studentId, status]) => ({
        studentId, courseId: selectedCourse, date: selectedDate, status,
      }));
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      setShowModal(false);
      load();
    } finally { setSaving(false); }
  };

  const statusColor = (s: string) =>
    STATUS_OPTS.find((o) => o.value === s)?.color ?? "text-white/50";
  const statusLabel = (s: string) =>
    STATUS_OPTS.find((o) => o.value === s)?.label ?? s;

  // Summary per student
  const summary = students.map((s) => {
    const rows = records.filter((r) => r.studentId === s.id);
    const present = rows.filter((r) => r.status === "present").length;
    const absent  = rows.filter((r) => r.status === "absent").length;
    const late    = rows.filter((r) => r.status === "late").length;
    const total   = rows.length;
    const rate    = total ? Math.round((present / total) * 100) : null;
    return { ...s, present, absent, late, total, rate };
  }).filter((s) => s.total > 0);

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
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mr-auto">Ирцийн бүртгэл</h2>
                {error && <p className="text-xs text-red-400">{error}</p>}
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="" className="bg-[#0a1628]">Бүх хичээл</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0a1628]">{c.name}</option>
                  ))}
                </select>
                <button onClick={openBulk}
                  className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                  Ирц бүртгэх
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : summary.length === 0 ? (
                <div className="text-center py-16 text-white/50">
                  Энэ өдрийн ирцийн бүртгэл байхгүй байна
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {summary.map((s) => (
                    <div key={s.id} className={`rounded-xl border p-4 ${s.rate !== null && s.rate < 70 ? "border-red-400/30 bg-red-500/5" : "border-white/10 bg-white/5"}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold">{s.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{s.lastName} {s.name}</p>
                          <p className="text-xs text-white/50">{s.userId}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs mb-3">
                        <div><p className="text-white/40">Ирсэн</p><p className="font-bold text-emerald-400">{s.present}</p></div>
                        <div><p className="text-white/40">Тасалсан</p><p className="font-bold text-red-400">{s.absent}</p></div>
                        <div><p className="text-white/40">Хоцорсон</p><p className="font-bold text-amber-400">{s.late}</p></div>
                        <div><p className="text-white/40">Хувь</p>
                          <p className={`font-bold ${s.rate !== null && s.rate >= 80 ? "text-emerald-400" : s.rate !== null && s.rate >= 60 ? "text-amber-400" : "text-red-400"}`}>
                            {s.rate ?? "—"}%
                          </p>
                        </div>
                      </div>
                      {s.rate !== null && (
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                          <div className={`h-full rounded-full ${s.rate >= 80 ? "bg-emerald-500" : s.rate >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                            style={{ width: `${s.rate}%` }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Bulk Attendance Modal */}
      {showModal && bulkMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1628] p-6">
            <h2 className="text-xl font-bold mb-1">Ирц бүртгэх</h2>
            <p className="text-sm text-white/50 mb-5">{selectedDate} · {courses.find((c) => c.id === selectedCourse)?.name}</p>
            {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}
            <div className="space-y-2">
              {students.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium">{s.lastName} {s.name}</p>
                    <p className="text-xs text-white/40">{s.userId}</p>
                  </div>
                  <div className="flex gap-1">
                    {STATUS_OPTS.map((opt) => (
                      <button key={opt.value}
                        onClick={() => setBulkData({ ...bulkData, [s.id]: opt.value })}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${bulkData[s.id] === opt.value ? `border ${opt.color} bg-white/10 border-current` : "text-white/30 hover:text-white/60"}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setBulkMode(false); }}
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
