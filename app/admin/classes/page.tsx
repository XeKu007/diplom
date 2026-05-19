"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Course {
  id: string; code: string; name: string; credits: number;
  semester: string | null; room: string | null; schedule: string | null;
  isActive: boolean;
  teacher: { id: string; firstName: string; lastName: string } | null;
  _count: { enrollments: number };
}
interface Teacher { id: string; firstName: string; lastName: string; user: { userId: string } }

const emptyForm = { code: "", name: "", credits: 3, semester: "", teacherId: "", room: "", schedule: "", maxStudents: 30 };

export default function ClassesAdminPage() {
  const [activeMenu, setActiveMenu] = useState("Анги / Бүлэг");
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Course | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState<Partial<typeof emptyForm>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [c, t] = await Promise.all([
        fetch("/api/courses").then((r) => r.json()),
        fetch("/api/teachers").then((r) => r.json()),
      ]);
      setCourses(Array.isArray(c) ? c : []);
      setTeachers(Array.isArray(t) ? t : []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.code || !form.name) { setError("Код болон нэр шаардлагатай"); return; }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, credits: Number(form.credits), maxStudents: Number(form.maxStudents) }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setShowAdd(false); setForm(emptyForm); load();
    } finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!selected) return;
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/courses/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      setIsEditing(false); load(); setSelected(null);
    } finally { setSaving(false); }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Энэ хичээлийг идэвхгүй болгох уу?")) return;
    await fetch(`/api/courses/${id}`, { method: "DELETE" });
    load();
  };

  const totalStudents = courses.reduce((s, c) => s + c._count.enrollments, 0);

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-7xl space-y-6">

            {/* Stats */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Нийт хичээл",  value: courses.length,  icon: "📚", color: "bg-blue-500" },
                { label: "Нийт оюутан",  value: totalStudents,   icon: "👨‍🎓", color: "bg-emerald-500" },
                { label: "Нийт багш",    value: new Set(courses.map((c) => c.teacher?.id).filter(Boolean)).size, icon: "👨‍🏫", color: "bg-amber-500" },
                { label: "Дундаж оюутан", value: courses.length ? Math.round(totalStudents / courses.length) : 0, icon: "📊", color: "bg-purple-500" },
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

            {/* List */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">
                  Хичээлүүдийн жагсаалт {!loading && <span className="text-white/40 ml-1">({courses.length})</span>}
                </h2>
                <button onClick={() => { setShowAdd(true); setError(""); }}
                  className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                  + Шинэ хичээл
                </button>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : courses.length === 0 ? (
                <p className="text-center py-12 text-white/40">Хичээл бүртгэгдээгүй байна</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {courses.map((c) => (
                    <div key={c.id} className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
                            <span className="text-sm font-semibold">{c.code.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{c.name}</h3>
                            <p className="text-xs text-white/50">{c.code}</p>
                          </div>
                        </div>
                        <span className="rounded-full border border-blue-400/30 bg-blue-500/10 px-2 py-0.5 text-xs text-blue-300">
                          {c.credits} кредит
                        </span>
                      </div>
                      <div className="space-y-2 text-xs mb-4">
                        <div className="flex justify-between">
                          <span className="text-white/50">Оюутан:</span>
                          <span className="font-bold text-violet-300">{c._count.enrollments}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Багш:</span>
                          <span className="text-white/80">{c.teacher ? `${c.teacher.lastName} ${c.teacher.firstName}` : "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Өрөө:</span>
                          <span className="text-white/80">{c.room ?? "—"}</span>
                        </div>
                        {c.semester && (
                          <div className="flex justify-between">
                            <span className="text-white/50">Семестер:</span>
                            <span className="text-white/80">{c.semester}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelected(c); setEditForm({ name: c.name, room: c.room ?? "", schedule: c.schedule ?? "", semester: c.semester ?? "" }); setIsEditing(false); setError(""); }}
                          className="flex-1 rounded-lg border border-white/10 bg-white/5 py-1.5 text-xs text-white/70 hover:text-white">
                          Дэлгэрэнгүй
                        </button>
                        <button onClick={() => handleDeactivate(c.id)}
                          className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20">
                          Хаах
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1628] p-6">
            <h2 className="text-xl font-bold mb-5">Шинэ хичээл нэмэх</h2>
            {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Хичээлийн код *", key: "code", placeholder: "CS101" },
                { label: "Хичээлийн нэр *", key: "name", placeholder: "Python үндэс" },
                { label: "Кредит", key: "credits", placeholder: "3", type: "number" },
                { label: "Семестер", key: "semester", placeholder: "2025 Spring" },
                { label: "Өрөө", key: "room", placeholder: "A-201" },
                { label: "Хуваарь", key: "schedule", placeholder: "Даваа, Пүрэв 10:00-11:30" },
                { label: "Дээд оюутан", key: "maxStudents", placeholder: "30", type: "number" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs text-white/50 mb-1">{label}</label>
                  <input type={type ?? "text"} placeholder={placeholder}
                    value={(form as Record<string, string | number>)[key] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-400/50" />
                </div>
              ))}
              <div>
                <label className="block text-xs text-white/50 mb-1">Багш</label>
                <select value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white focus:outline-none">
                  <option value="">Сонгох</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id} className="bg-[#0a1628]">
                      {t.lastName} {t.firstName} ({t.user.userId})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowAdd(false); setForm(emptyForm); setError(""); }}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:text-white">Болих</button>
              <button onClick={handleAdd} disabled={saving}
                className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? "Хадгалж байна..." : "Нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail / Edit Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a1628]">
            <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#0a1628] px-6 py-4">
              <div>
                <h2 className="text-xl font-bold">{selected.name}</h2>
                <p className="text-sm text-white/50">{selected.code}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(!isEditing)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${isEditing ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-300" : "border-blue-400/40 bg-blue-500/20 text-blue-300"}`}>
                  {isEditing ? "Болих" : "Засах"}
                </button>
                <button onClick={() => { setSelected(null); setIsEditing(false); setError(""); }}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:text-white">✕</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {error && <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Нэр", key: "name" }, { label: "Өрөө", key: "room" },
                  { label: "Хуваарь", key: "schedule" }, { label: "Семестер", key: "semester" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <p className="text-xs text-white/40 mb-1">{label}</p>
                    {isEditing ? (
                      <input value={(editForm as Record<string, string>)[key] ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none" />
                    ) : (
                      <p className="text-sm text-white">{(selected as unknown as Record<string, string>)[key] || "—"}</p>
                    )}
                  </div>
                ))}
                <div>
                  <p className="text-xs text-white/40 mb-1">Оюутны тоо</p>
                  <p className="text-sm font-bold text-violet-300">{selected._count.enrollments}</p>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">Багш</p>
                  <p className="text-sm text-white">{selected.teacher ? `${selected.teacher.lastName} ${selected.teacher.firstName}` : "—"}</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                {isEditing && (
                  <button onClick={handleEdit} disabled={saving}
                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                    {saving ? "Хадгалж байна..." : "Хадгалах"}
                  </button>
                )}
                <button onClick={() => { setSelected(null); setIsEditing(false); setError(""); }}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:text-white">
                  Хаах
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
