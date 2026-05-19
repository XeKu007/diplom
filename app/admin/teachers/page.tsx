"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Teacher {
  id: string; firstName: string; lastName: string;
  email: string | null; phone: string | null;
  department: string | null; position: string | null;
  user: { userId: string; isActive: boolean };
  courses: { id: string; name: string; code: string; _count: { enrollments: number } }[];
  salaries: { net: number; status: string }[];
}

const emptyForm = {
  userId: "", password: "", firstName: "", lastName: "",
  email: "", phone: "", department: "", position: "",
};

export default function TeachersPage() {
  const [activeMenu, setActiveMenu] = useState("Багшийн жагсаалт");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Teacher | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState<Partial<Teacher>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/teachers");
      if (res.ok) setTeachers(await res.json());
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = teachers.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.firstName.toLowerCase().includes(q) ||
      t.lastName.toLowerCase().includes(q) ||
      t.user.userId.toLowerCase().includes(q) ||
      (t.department ?? "").toLowerCase().includes(q) ||
      (t.email ?? "").toLowerCase().includes(q)
    );
  });

  const handleAdd = async () => {
    if (!form.userId || !form.password || !form.firstName || !form.lastName) {
      setError("ID, нууц үг, нэр заавал шаардлагатай"); return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
      const res = await fetch(`/api/teachers/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      setIsEditing(false); load(); setSelected(null);
    } finally { setSaving(false); }
  };

  const totalStudents = teachers.reduce((s, t) =>
    s + t.courses.reduce((cs, c) => cs + c._count.enrollments, 0), 0);

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
                { label: "Нийт багш",    value: teachers.length,  icon: "👨‍🏫", color: "bg-blue-500" },
                { label: "Идэвхтэй",     value: teachers.filter((t) => t.user.isActive).length, icon: "✅", color: "bg-emerald-500" },
                { label: "Нийт хичээл",  value: teachers.reduce((s, t) => s + t.courses.length, 0), icon: "📚", color: "bg-amber-500" },
                { label: "Нийт оюутан",  value: totalStudents,    icon: "👥", color: "bg-purple-500" },
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
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">
                    Багш нарын жагсаалт {!loading && <span className="text-white/40 ml-1">({filtered.length})</span>}
                  </h2>
                  <button onClick={() => { setShowAdd(true); setError(""); }}
                    className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                    + Шинэ багш
                  </button>
                </div>
                <div className="relative">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <input type="text" placeholder="Нэр, ID, тэнхим, имэйлээр хайх..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.06] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/40" />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-white/50">
                  {search ? `"${search}" хайлтад тохирох багш олдсонгүй` : "Багш бүртгэгдээгүй байна"}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((t) => (
                    <div key={t.id} className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold">{t.firstName.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{t.lastName} {t.firstName}</p>
                          <p className="text-xs text-white/50">{t.user.userId}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs mb-4">
                        <div className="flex justify-between">
                          <span className="text-white/50">Тэнхим:</span>
                          <span className="text-white/80 truncate ml-2 max-w-[120px]">{t.department ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Хичээл:</span>
                          <span className="font-bold text-violet-300">{t.courses.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">Оюутан:</span>
                          <span className="font-bold text-emerald-300">
                            {t.courses.reduce((s, c) => s + c._count.enrollments, 0)}
                          </span>
                        </div>
                      </div>
                      <button onClick={() => { setSelected(t); setEditForm({ ...t }); setIsEditing(false); setError(""); }}
                        className="w-full rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25">
                        Дэлгэрэнгүй
                      </button>
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
            <h2 className="text-xl font-bold mb-5">Шинэ багш нэмэх</h2>
            {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Багшийн ID *", key: "userId", placeholder: "T001" },
                { label: "Нууц үг *", key: "password", placeholder: "••••••••", type: "password" },
                { label: "Нэр *", key: "firstName", placeholder: "Батбаяр" },
                { label: "Овог *", key: "lastName", placeholder: "Ганбат" },
                { label: "Имэйл", key: "email", placeholder: "teacher@indra.edu.mn" },
                { label: "Утас", key: "phone", placeholder: "9900-1122" },
                { label: "Тэнхим", key: "department", placeholder: "Програм хангамж" },
                { label: "Албан тушаал", key: "position", placeholder: "Багш" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs text-white/50 mb-1">{label}</label>
                  <input type={type ?? "text"} placeholder={placeholder}
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-400/50" />
                </div>
              ))}
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
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1628]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a1628] px-6 py-4">
              <div>
                <h2 className="text-xl font-bold">{selected.lastName} {selected.firstName}</h2>
                <p className="text-sm text-white/50">{selected.user.userId}</p>
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
                  { label: "Нэр", key: "firstName" }, { label: "Овог", key: "lastName" },
                  { label: "Имэйл", key: "email" }, { label: "Утас", key: "phone" },
                  { label: "Тэнхим", key: "department" }, { label: "Албан тушаал", key: "position" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <p className="text-xs text-white/40 mb-1">{label}</p>
                    {isEditing ? (
                      <input value={(editForm as Record<string, string>)[key] ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-400/50" />
                    ) : (
                      <p className="text-sm text-white">{(selected as unknown as Record<string, string>)[key] || "—"}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Courses */}
              {selected.courses.length > 0 && (
                <div>
                  <p className="text-xs text-white/40 mb-2">Заадаг хичээлүүд</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.courses.map((c) => (
                      <span key={c.id} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs">
                        {c.name} <span className="text-white/40">({c._count.enrollments} оюутан)</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {isEditing ? (
                  <button onClick={handleEdit} disabled={saving}
                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                    {saving ? "Хадгалж байна..." : "Хадгалах"}
                  </button>
                ) : null}
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
