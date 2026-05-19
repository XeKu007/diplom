"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

interface AdminUser {
  id: string; userId: string; name: string;
  role: string; adminType: string | null; isActive: boolean;
}

export default function AdminProfilePage() {
  const [activeMenu, setActiveMenu] = useState("Профайл");
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(async (me) => {
        if (!me?.userId) return;
        const res = await fetch("/api/admin/users");
        const list: AdminUser[] = await res.json();
        const found = list.find((u) => u.userId === me.userId);
        if (found) { setUser(found); setForm((f) => ({ ...f, name: found.name })); }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!user) return;
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError("Шинэ нууц үг таарахгүй байна"); return;
    }
    setSaving(true); setError(""); setSuccess("");
    try {
      const body: Record<string, string> = { name: form.name };
      if (form.newPassword) body.password = form.newPassword;
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error); return; }
      setSuccess("Мэдээлэл амжилттай шинэчлэгдлээ");
      setEditing(false);
      setUser((prev) => prev ? { ...prev, name: form.name } : prev);
      setForm((f) => ({ ...f, currentPassword: "", newPassword: "", confirmPassword: "" }));
    } finally { setSaving(false); }
  };

  const typeLabel = (t: string | null) => ({
    "full-admin":     "👑 Бүрэн эрхт админ",
    "training-admin": "📚 Сургалтын алба",
    "finance-admin":  "💰 Санхүүгийн алба",
  }[t ?? ""] ?? t ?? "—");

  if (loading) return (
    <div className="min-h-screen text-white flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
    </div>
  );

  return (
    <div className="min-h-screen text-white">
      <Navbar />
      <div className="flex">
        <Sidebar activeMenu={activeMenu} onMenuChange={setActiveMenu} />
        <main className="flex-1 overflow-y-auto bg-no-repeat px-4 py-6 md:px-6"
          style={{ backgroundImage: "linear-gradient(rgba(8,14,30,0.9),rgba(8,12,24,0.95)),url('/indra-bg.jpg')", backgroundSize: "72%" }}>
          <div className="mx-auto max-w-2xl space-y-5">

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Систем</p>
                <h1 className="mt-1 text-2xl font-semibold">Миний профайл</h1>
              </div>
              <button onClick={() => { setEditing(!editing); setError(""); setSuccess(""); }}
                className="rounded-2xl border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-200 hover:bg-violet-500/25">
                {editing ? "Цуцлах" : "Засах"}
              </button>
            </div>

            {success && (
              <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">✅ {success}</div>
            )}
            {error && (
              <div className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">❌ {error}</div>
            )}

            {/* Profile card */}
            <div className="rounded-[24px] border border-white/10 bg-[#081120]/70 p-6 backdrop-blur-md">
              <div className="flex items-center gap-5 mb-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-800 flex items-center justify-center text-3xl font-bold shrink-0">
                  {user?.name.charAt(0) ?? "A"}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{user?.name}</h2>
                  <p className="text-sm text-white/50 mt-0.5 font-mono">{user?.userId}</p>
                  <span className="mt-2 inline-block rounded-full border border-violet-400/30 bg-violet-500/15 px-3 py-0.5 text-xs text-violet-300">
                    {typeLabel(user?.adminType ?? null)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs text-white/40 mb-1 block">Нэр</label>
                  {editing ? (
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-400/50" />
                  ) : (
                    <p className="text-sm text-white">{user?.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-white/40 mb-1 block">Нэвтрэх ID</label>
                  <p className="text-sm text-white/60 font-mono">{user?.userId}</p>
                </div>

                <div>
                  <label className="text-xs text-white/40 mb-1 block">Эрхийн төрөл</label>
                  <p className="text-sm text-white">{typeLabel(user?.adminType ?? null)}</p>
                </div>

                <div>
                  <label className="text-xs text-white/40 mb-1 block">Төлөв</label>
                  <span className={`rounded-full border px-2.5 py-0.5 text-xs ${user?.isActive ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-300" : "border-red-400/30 bg-red-500/10 text-red-300"}`}>
                    {user?.isActive ? "Идэвхтэй" : "Идэвхгүй"}
                  </span>
                </div>

                {editing && (
                  <>
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-xs text-white/40 mb-3">Нууц үг солих (заавал биш)</p>
                      <div className="space-y-3">
                        {[
                          { label: "Шинэ нууц үг", key: "newPassword" },
                          { label: "Нууц үг давтах", key: "confirmPassword" },
                        ].map(({ label, key }) => (
                          <div key={key}>
                            <label className="text-xs text-white/40 mb-1 block">{label}</label>
                            <input type="password" value={(form as Record<string, string>)[key]}
                              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-400/50" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button onClick={handleSave} disabled={saving}
                      className="w-full rounded-lg bg-gradient-to-r from-violet-500 to-violet-700 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
                      {saving ? "Хадгалж байна..." : "Хадгалах"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
