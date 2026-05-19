"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface Student {
  id: string;
  userId: string;
  name: string;
  lastName: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  major: string | null;
  classGroup: string | null;
  semester: string | null;
  enrollmentYear: string | null;
  advisor: string | null;
  scholarship: string | null;
  dormitory: string | null;
  status: string;
  gpa: number;
}

const emptyForm = {
  userId: "", password: "", firstName: "", lastName: "",
  email: "", phone: "", major: "", classGroup: "",
  semester: "", enrollmentYear: "", advisor: "", scholarship: "", dormitory: "",
};

export default function Students() {
  const [activeMenu, setActiveMenu] = useState("Оюутны жагсаалт");
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState<Partial<Student>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/students?search=${encodeURIComponent(searchTerm)}`);
      if (res.ok) setStudents(await res.json());
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleAdd = async () => {
    if (!form.userId || !form.password || !form.firstName || !form.lastName) {
      setError("ID, нууц үг, нэр заавал шаардлагатай"); return;
    }
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setShowAddModal(false);
      setForm(emptyForm);
      load();
    } finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!selectedStudent) return;
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/students/${selectedStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      setIsEditing(false);
      load();
      setSelectedStudent(null);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Энэ оюутныг устгах уу?")) return;
    await fetch(`/api/students/${id}`, { method: "DELETE" });
    setSelectedStudent(null);
    load();
  };

  const getStatusColor = (s: string) => {
    if (s === "active")    return "bg-emerald-500/10 text-emerald-400 border-emerald-400/30";
    if (s === "leave")     return "bg-amber-500/10 text-amber-400 border-amber-400/30";
    if (s === "graduated") return "bg-blue-500/10 text-blue-400 border-blue-400/30";
    if (s === "expelled")  return "bg-red-500/10 text-red-400 border-red-400/30";
    return "bg-gray-500/10 text-gray-400 border-gray-400/30";
  };

  const statusLabel = (s: string) => ({
    active: "Идэвхтэй", leave: "Чөлөөтэй",
    graduated: "Төгссөн", expelled: "Хасагдсан",
  }[s] ?? s);

  const getGPAColor = (g: number) =>
    g >= 3.8 ? "text-emerald-400" : g >= 3.5 ? "text-green-400" : g >= 3.0 ? "text-amber-400" : "text-red-400";

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-7xl space-y-6">

            {/* Header */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70">
                    Оюутнуудын жагсаалт
                    {!loading && <span className="ml-2 text-white/40">({students.length})</span>}
                  </h2>
                  <button onClick={() => { setShowAddModal(true); setError(""); }}
                    className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                    + Шинэ оюутан
                  </button>
                </div>

                <div className="relative">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                    <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.2" />
                    <path d="M11 11l4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <input type="text" placeholder="Нэр, ID, тэнхим, имэйлээр хайх..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.06] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-400/40" />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-16 text-white/50">
                  {searchTerm ? `"${searchTerm}" хайлтад тохирох оюутан олдсонгүй` : "Оюутан бүртгэгдээгүй байна"}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {students.map((s) => (
                    <div key={s.id} className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.08] transition-colors">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center shrink-0">
                          <span className="text-sm font-semibold">{s.name.charAt(0)}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{s.lastName} {s.name}</p>
                          <p className="text-xs text-white/50">{s.userId}</p>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4 text-xs">
                        <div className="flex justify-between">
                          <span className="text-white/50">Тэнхим:</span>
                          <span className="text-white/80 truncate ml-2 max-w-[120px]">{s.major ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/50">GPA:</span>
                          <span className={`font-bold ${getGPAColor(s.gpa)}`}>{s.gpa.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-white/50">Төлөв:</span>
                          <span className={`rounded-full border px-2 py-0.5 ${getStatusColor(s.status)}`}>
                            {statusLabel(s.status)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setSelectedStudent(s); setEditForm({ ...s }); setIsEditing(false); }}
                          className="flex-1 rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/25">
                          Засах
                        </button>
                        <a href={`/admin/students/${s.id}`}
                          className="rounded-lg border border-blue-400/30 bg-blue-500/15 px-3 py-2 text-sm font-medium text-blue-300 hover:bg-blue-500/25">
                          →
                        </a>
                      </div>                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── Add Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1628] p-6">
            <h2 className="text-xl font-bold mb-5">Шинэ оюутан нэмэх</h2>
            {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Оюутны ID *", key: "userId", placeholder: "B211930001" },
                { label: "Нууц үг *", key: "password", placeholder: "••••••••", type: "password" },
                { label: "Нэр *", key: "firstName", placeholder: "Батбаяр" },
                { label: "Овог *", key: "lastName", placeholder: "Дорж" },
                { label: "Имэйл", key: "email", placeholder: "email@indra.edu.mn" },
                { label: "Утас", key: "phone", placeholder: "9900-1122" },
                { label: "Тэнхим", key: "major", placeholder: "Програм хангамж" },
                { label: "Анги", key: "classGroup", placeholder: "SE-2024" },
                { label: "Семестер", key: "semester", placeholder: "1" },
                { label: "Элссэн он", key: "enrollmentYear", placeholder: "2024" },
                { label: "Зөвлөх багш", key: "advisor", placeholder: "Б.Ганбат" },
                { label: "Тэтгэлэг", key: "scholarship", placeholder: "Тэтгэлэгтэй" },
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
              <button onClick={() => { setShowAddModal(false); setForm(emptyForm); setError(""); }}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:text-white">
                Болих
              </button>
              <button onClick={handleAdd} disabled={saving}
                className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? "Хадгалж байна..." : "Нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Detail / Edit Modal ── */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1628]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0a1628] px-6 py-4">
              <div>
                <h2 className="text-xl font-bold">{selectedStudent.lastName} {selectedStudent.name}</h2>
                <p className="text-sm text-white/50">{selectedStudent.userId}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(!isEditing)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${isEditing ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-300" : "border-blue-400/40 bg-blue-500/20 text-blue-300"}`}>
                  {isEditing ? "Болих" : "Засах"}
                </button>
                <button onClick={() => setSelectedStudent(null)}
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:text-white">✕</button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {error && <p className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Нэр", key: "name" }, { label: "Овог", key: "lastName" },
                  { label: "Имэйл", key: "email" }, { label: "Утас", key: "phone" },
                  { label: "Тэнхим", key: "major" }, { label: "Анги", key: "classGroup" },
                  { label: "Семестер", key: "semester" }, { label: "Элссэн он", key: "enrollmentYear" },
                  { label: "Зөвлөх багш", key: "advisor" }, { label: "Тэтгэлэг", key: "scholarship" },
                  { label: "Дотуур байр", key: "dormitory" },
                ].map(({ label, key }) => (
                  <div key={key}>
                    <p className="text-xs text-white/40 mb-1">{label}</p>
                    {isEditing ? (
                      <input value={(editForm as Record<string, string>)[key] ?? ""}
                        onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })}
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-400/50" />
                    ) : (
                      <p className="text-sm text-white">{(selectedStudent as unknown as Record<string, string>)[key] || "—"}</p>
                    )}
                  </div>
                ))}
                <div>
                  <p className="text-xs text-white/40 mb-1">Төлөв</p>
                  {isEditing ? (
                    <select value={editForm.status ?? selectedStudent.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-[#0a1628] px-3 py-2 text-sm text-white focus:outline-none">
                      <option value="active">Идэвхтэй</option>
                      <option value="leave">Чөлөөтэй</option>
                      <option value="graduated">Төгссөн</option>
                      <option value="expelled">Хасагдсан</option>
                    </select>
                  ) : (
                    <span className={`rounded-full border px-2 py-0.5 text-xs ${getStatusColor(selectedStudent.status)}`}>
                      {statusLabel(selectedStudent.status)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {isEditing ? (
                  <button onClick={handleEdit} disabled={saving}
                    className="flex-1 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                    {saving ? "Хадгалж байна..." : "Хадгалах"}
                  </button>
                ) : (
                  <button onClick={() => handleDelete(selectedStudent.id)}
                    className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/20">
                    Устгах
                  </button>
                )}
                <button onClick={() => { setSelectedStudent(null); setIsEditing(false); setError(""); }}
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
