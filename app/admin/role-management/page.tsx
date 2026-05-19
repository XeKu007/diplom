"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface AdminUser {
  id: string; userId: string; name: string;
  role: string; adminType: string | null;
  isActive: boolean; createdAt: string;
}

const ADMIN_TYPES = [
  { key: "full-admin",     label: "Бүрэн эрхт админ",      icon: "👑", color: "border-purple-400/30 bg-purple-500/15 text-purple-300" },
  { key: "training-admin", label: "Сургалтын албаны админ", icon: "📚", color: "border-blue-400/30 bg-blue-500/15 text-blue-300" },
  { key: "finance-admin",  label: "Санхүүгийн албаны админ",icon: "💰", color: "border-emerald-400/30 bg-emerald-500/15 text-emerald-300" },
];

const typeLabel = (t: string | null) =>
  ADMIN_TYPES.find((a) => a.key === t)?.label ?? t ?? "—";

const typeColor = (t: string | null) =>
  ADMIN_TYPES.find((a) => a.key === t)?.color ?? "border-white/10 text-white/50";

const typeIcon = (t: string | null) =>
  ADMIN_TYPES.find((a) => a.key === t)?.icon ?? "👤";

export default function RoleManagementPage() {
  const [activeMenu, setActiveMenu] = useState("Эрхийн удирдлага");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [form, setForm] = useState({ userId: "", password: "", name: "", adminType: "training-admin" });
  const [editForm, setEditForm] = useState({ name: "", password: "", isActive: true });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFullAdmin, setIsFullAdmin] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [me, res] = await Promise.all([
        fetch("/api/auth/me").then((r) => r.json()),
        fetch("/api/admin/users"),
      ]);
      setIsFullAdmin(me?.role === "admin");
      if (res.ok) setUsers(await res.json());
      else setUsers([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async () => {
    if (!form.userId || !form.password || !form.name) {
      setError("ID, нууц үг, нэр бүгд шаардлагатай"); return;
    }
    setSaving(true); setError(""); setSuccess("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(`${typeLabel(form.adminType)} амжилттай нэмэгдлээ`);
      setShowAdd(false);
      setForm({ userId: "", password: "", name: "", adminType: "training-admin" });
      load();
    } finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!selected) return;
    setSaving(true); setError(""); setSuccess("");
    try {
      const body: Record<string, unknown> = { name: editForm.name, isActive: editForm.isActive };
      if (editForm.password) body.password = editForm.password;
      const res = await fetch(`/api/admin/users/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      setSuccess("Мэдээлэл шинэчлэгдлээ");
      setShowEdit(false); setSelected(null); load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!confirm(`"${user.name}" (${user.userId})-г устгах уу?`)) return;
    const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); setError(d.error); return; }
    setSuccess("Устгагдлаа");
    load();
  };

  const handleToggleActive = async (user: AdminUser) => {
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !user.isActive }),
    });
    load();
  };

  return (
    <div className="min-h-screen font-sans text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-5 md:px-6 md:py-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-5xl space-y-6">

            {/* Header */}
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Систем</p>
                <h1 className="mt-1 text-2xl font-semibold">Эрхийн удирдлага</h1>
                <p className="mt-1 text-sm text-white/50">Admin хэрэглэгчдийг удирдах</p>
              </div>
              {isFullAdmin && (
                <button onClick={() => { setShowAdd(true); setError(""); setSuccess(""); }}
                  className="rounded-lg border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25">
                  + Шинэ admin нэмэх
                </button>
              )}            </div>

            {/* Alerts */}
            {success && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300 flex items-center gap-2">
                <span>✅</span> {success}
                <button onClick={() => setSuccess("")} className="ml-auto text-emerald-400/60 hover:text-emerald-300">✕</button>
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 flex items-center gap-2">
                <span>❌</span> {error}
                <button onClick={() => setError("")} className="ml-auto text-red-400/60 hover:text-red-300">✕</button>
              </div>
            )}

            {/* Admin type summary */}
            <div className="grid gap-4 sm:grid-cols-3">
              {ADMIN_TYPES.map((t) => {
                const count = users.filter((u) => u.adminType === t.key).length;
                return (
                  <div key={t.key} className={`rounded-[20px] border p-4 ${t.color}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{t.icon}</span>
                      <div>
                        <p className="font-semibold text-sm">{t.label}</p>
                        <p className="text-xs opacity-70 mt-0.5">{count} хэрэглэгч</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Users list */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-5 backdrop-blur-md">
              <h2 className="text-sm font-medium uppercase tracking-[0.28em] text-white/70 mb-5">
                Admin хэрэглэгчид
                {!loading && <span className="text-white/40 ml-2">({users.length})</span>}
              </h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
                </div>
              ) : users.length === 0 ? (
                <p className="text-center py-12 text-white/40">Admin хэрэглэгч байхгүй байна</p>
              ) : (
                <div className="space-y-3">
                  {users.map((u) => (
                    <div key={u.id} className={`rounded-xl border p-4 transition-all ${u.isActive ? "border-white/10 bg-white/[0.03]" : "border-white/5 bg-white/[0.01] opacity-60"}`}>
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center text-xl shrink-0">
                          {typeIcon(u.adminType)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold">{u.name}</p>
                            {!u.isActive && (
                              <span className="rounded-full border border-red-400/30 bg-red-500/10 px-2 py-0.5 text-xs text-red-400">Идэвхгүй</span>
                            )}
                          </div>
                          <p className="text-xs text-white/40 mt-0.5 font-mono">{u.userId}</p>
                          <div className="mt-1">
                            <span className={`rounded-full border px-2.5 py-0.5 text-xs ${typeColor(u.adminType)}`}>
                              {typeLabel(u.adminType)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 shrink-0">
                          {isFullAdmin && (
                            <button
                              onClick={() => {
                                setSelected(u);
                                setEditForm({ name: u.name, password: "", isActive: u.isActive });
                                setShowEdit(true); setError(""); setSuccess("");
                              }}
                              className="rounded-lg border border-blue-400/30 bg-blue-500/15 px-3 py-1.5 text-xs text-blue-300 hover:bg-blue-500/25">
                              Засах
                            </button>
                          )}
                          {isFullAdmin && (
                            <button
                              onClick={() => handleToggleActive(u)}
                              className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${u.isActive
                                ? "border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                                : "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"}`}>
                              {u.isActive ? "Хаах" : "Нээх"}
                            </button>
                          )}
                          {isFullAdmin && (
                            <button
                              onClick={() => handleDelete(u)}
                              className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20">
                              Устгах
                            </button>
                          )}
                        </div>
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
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1628] p-6">
            <h2 className="text-xl font-bold mb-5">Шинэ admin нэмэх</h2>
            {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}

            {/* Admin type selector */}
            <div className="mb-4">
              <label className="text-xs text-white/50 mb-2 block">Эрхийн төрөл *</label>
              <div className="grid gap-2">
                {ADMIN_TYPES.map((t) => (
                  <button key={t.key} type="button"
                    onClick={() => setForm({ ...form, adminType: t.key })}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${form.adminType === t.key ? t.color : "border-white/10 bg-white/[0.02] text-white/50 hover:bg-white/[0.05]"}`}>
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-sm font-medium">{t.label}</span>
                    {form.adminType === t.key && <span className="ml-auto text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: "Нэвтрэх ID *", key: "userId", placeholder: "training2" },
                { label: "Нууц үг *", key: "password", placeholder: "••••••••", type: "password" },
                { label: "Нэр *", key: "name", placeholder: "Сургалтын алба 2" },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="text-xs text-white/50 mb-1 block">{label}</label>
                  <input type={type ?? "text"} placeholder={placeholder}
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-400/50" />
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowAdd(false); setForm({ userId: "", password: "", name: "", adminType: "training-admin" }); setError(""); }}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:text-white">Болих</button>
              <button onClick={handleAdd} disabled={saving}
                className="flex-1 rounded-lg bg-gradient-to-r from-violet-500 to-violet-700 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? "Нэмж байна..." : "Нэмэх"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a1628] p-6">
            <h2 className="text-xl font-bold mb-1">Мэдээлэл засах</h2>
            <p className="text-sm text-white/50 mb-5">{selected.userId} · {typeLabel(selected.adminType)}</p>
            {error && <p className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-2 text-sm text-red-400">{error}</p>}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/50 mb-1 block">Нэр</label>
                <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-400/50" />
              </div>
              <div>
                <label className="text-xs text-white/50 mb-1 block">Шинэ нууц үг (хоосон бол өөрчлөхгүй)</label>
                <input type="password" placeholder="••••••••" value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-400/50" />
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="text-sm text-white/70 flex-1">Идэвхтэй эсэх</span>
                <button onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                  className={`relative h-6 w-11 rounded-full transition-colors ${editForm.isActive ? "bg-emerald-500" : "bg-white/20"}`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${editForm.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowEdit(false); setSelected(null); setError(""); }}
                className="flex-1 rounded-lg border border-white/10 bg-white/5 py-2.5 text-sm text-white/70 hover:text-white">Болих</button>
              <button onClick={handleEdit} disabled={saving}
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
