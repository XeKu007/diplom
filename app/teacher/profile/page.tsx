"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface TeacherData {
  id: string; firstName: string; lastName: string;
  email: string | null; phone: string | null;
  department: string | null; position: string | null;
  user: { userId: string };
  courses: { id: string; name: string; code: string; semester: string | null; _count: { enrollments: number } }[];
}

export default function TeacherProfilePage() {
  const [activeMenu, setActiveMenu] = useState("Профайл");
  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ email: "", phone: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (me) => {
        if (!me?.userId) return;
        const res = await fetch("/api/teachers");
        const list: TeacherData[] = await res.json();
        const found = list.find((t) => t.user.userId === me.userId);
        if (found) {
          setTeacher(found);
          setForm({ email: found.email ?? "", phone: found.phone ?? "" });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!teacher) return;
    setSaving(true);
    await fetch(`/api/teachers/${teacher.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setEditing(false);
    setTeacher((prev) => prev ? { ...prev, ...form } : prev);
  };

  if (loading) return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
    </div>
  );

  if (!teacher) return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <p className="text-white/50">Мэдээлэл олдсонгүй</p>
    </div>
  );

  const totalStudents = teacher.courses.reduce((s, c) => s + c._count.enrollments, 0);

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
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Багш</p>
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
                <div className="h-20 w-20 shrink-0 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center text-3xl font-bold">
                  {teacher.firstName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{teacher.lastName} {teacher.firstName}</h2>
                  <p className="text-sm text-white/60 mt-1">{teacher.department ?? "—"} · {teacher.position ?? "Багш"}</p>
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                      { label: "Хичээл",   value: teacher.courses.length, color: "text-violet-300" },
                      { label: "Оюутан",   value: totalStudents,           color: "text-emerald-300" },
                      { label: "Багшийн ID", value: teacher.user.userId,  color: "text-amber-300" },
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
              {/* Contact info */}
              <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
                <p className="text-sm font-semibold text-white/80 mb-4">Холбоо барих</p>
                <div className="space-y-3">
                  {[
                    { label: "Нэр",       value: `${teacher.lastName} ${teacher.firstName}`, editable: false },
                    { label: "Тэнхим",    value: teacher.department,  editable: false },
                    { label: "Албан тушаал", value: teacher.position, editable: false },
                    { label: "И-мэйл",    value: teacher.email,       key: "email" },
                    { label: "Утас",      value: teacher.phone,       key: "phone" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
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
                <p className="text-sm font-semibold text-white/80 mb-4">Заадаг хичээлүүд</p>
                {teacher.courses.length === 0 ? (
                  <p className="text-center py-8 text-white/40">Хичээл байхгүй байна</p>
                ) : (
                  <div className="space-y-3">
                    {teacher.courses.map((c) => (
                      <div key={c.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold">{c.name}</p>
                            <p className="text-xs text-white/40 mt-0.5">{c.code} · {c.semester ?? "—"}</p>
                          </div>
                          <p className="text-lg font-bold text-violet-300">{c._count.enrollments}</p>
                        </div>
                      </div>
                    ))}
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
