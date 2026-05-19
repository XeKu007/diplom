"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface TimetableRow {
  id: string; dayOfWeek: number; startTime: string; endTime: string; room: string | null;
  course: { id: string; name: string; code: string; teacher: { firstName: string; lastName: string } | null };
}
interface Course { id: string; name: string; code: string }

const DAY = ["", "Даваа", "Мягмар", "Лхагва", "Пүрэв", "Баасан", "Бямба", "Ням"];

export default function TimetableAdminPage() {
  const [activeMenu, setActiveMenu] = useState("Хичээлийн хуваарь");
  const [rows, setRows] = useState<TimetableRow[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ courseId: "", dayOfWeek: 1, startTime: "", endTime: "", room: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [t, c] = await Promise.all([
        fetch("/api/timetable").then((r) => r.json()),
        fetch("/api/courses").then((r) => r.json()),
      ]);
      setRows(Array.isArray(t) ? t : []);
      setCourses(Array.isArray(c) ? c : []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.courseId || !form.startTime || !form.endTime) {
      setError("Хичээл, эхлэх болон дуусах цаг шаардлагатай"); return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/timetable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setShowModal(false);
      setForm({ courseId: "", dayOfWeek: 1, startTime: "", endTime: "", room: "" });
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ хуваарийг устгах уу?")) return;
    await fetch("/api/timetable", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  // Group by day
  const grouped = DAY.slice(1, 6).map((day, i) => ({
    day, dayNum: i + 1,
    entries: rows.filter((r) => r.dayOfWeek === i + 1).sort((a, b) => a.startTime.localeCompare(b.startTime)),
  }));

  const uniqueCourses = new Set(rows.map((r) => r.course.id)).size;
  const uniqueRooms   = new Set(rows.map((r) => r.room).filter(Boolean)).size;

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-7xl space-y-6">

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт хуваарь", value: rows.length,     icon: "📅", color: "bg-blue-500" },
                { label: "Хичээл",        value: uniqueCourses,   icon: "📚", color: "bg-emerald-500" },
                { label: "Өрөө",          value: uniqueRooms,     icon: "🏫", color: "bg-amber-500" },
                { label: "Өдөр",          value: grouped.filter((g) => g.entries.length > 0).length, icon: "📆", color: "bg-purple-500" },
              ].map((s) => (
                <div key={s.label} className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white/50">{s.label}</p>
                      <p className="mt-2 text-2xl font-bold">{loading ? "…" : s.value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-full ${s.color} flex items-center justify-center text-lg`}>{s.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">Хичээлийн хуваарь</h2>
                <button onClick={() => { setShowModal(true); setError(""); }}
                  className="rounded-lg border border-blue-400/30 bg-blue-500/15 px-4 py-2 text-sm font-medium text-blue-200 hover:bg-blue-500/25">
                  + Хуваарь нэмэх
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : rows.length === 0 ? (
                <p className="text-center py-12 text-white/40">Хуваарь бүртгэгдээгүй байна</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        {["Өдөр","Цаг","Хичээл","Багш","Өрөө",""].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/50">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime)).map((r) => (
                        <tr key={r.id} className="border-b border-white/[0.05] hover:bg-white/[0.02]">
                          <td className="px-4 py-3 font-medium">{DAY[r.dayOfWeek]}</td>
                          <td className="px-4 py-3 text-white/70">{r.startTime}–{r.endTime}</td>
                          <td className="px-4 py-3">
                            <p className="font-medium">{r.course.name}</p>
                            <p className="text-xs text-white/40">{r.course.code}</p>
                          </td>
                          <td className="px-4 py-3 text-white/60">
                            {r.course.teacher ? `${r.course.teacher.lastName} ${r.course.teacher.firstName}` : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                              {r.room ?? "—"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button onClick={() => handleDelete(r.id)}
                              className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs text-red-400 hover:bg-red-500/20">
                              Устгах
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Grid view */}
            {rows.length > 0 && (
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mb-4">Хуваарийн сүлжээ</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {grouped.map((g) => (
                    <div key={g.day}>
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">{g.day}</p>
                      {g.entries.length === 0 ? (
                        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center text-xs text-white/20">Чөлөө</div>
                      ) : (
                        <div className="space-y-2">
                          {g.entries.map((e) => (
                            <div key={e.id} className="rounded-xl border border-blue-400/20 bg-blue-500/10 p-3">
                              <p className="text-xs font-medium text-white">{e.course.name}</p>
                              <p className="text-[10px] text-white/50 mt-0.5">{e.startTime}–{e.endTime}</p>
                              <p className="text-[10px] text-white/40">{e.room ?? "—"}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1628] p-6">
            <h2 className="text-xl font-bold mb-5">Хуваарь нэмэх</h2>
            {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Хичээл *</label>
                <select value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="">Сонгох</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#0a1628]">{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Өдөр *</label>
                <select value={form.dayOfWeek} onChange={(e) => setForm({ ...form, dayOfWeek: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white focus:outline-none">
                  {DAY.slice(1, 6).map((d, i) => (
                    <option key={d} value={i + 1} className="bg-[#0a1628]">{d}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Эхлэх цаг *</label>
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Дуусах цаг *</label>
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Өрөө</label>
                <input type="text" placeholder="A-201" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setError(""); }}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:text-white">Болих</button>
              <button onClick={handleAdd} disabled={saving}
                className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? "Хадгалж байна..." : "Нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
